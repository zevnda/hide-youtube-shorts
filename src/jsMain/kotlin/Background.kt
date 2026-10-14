import kotlin.js.Promise
import kotlin.js.json
import org.w3c.dom.url.URL

private const val CSS_FILE = "styles/shorts-selectors.css"
private const val STATE_KEY = "shortsHidden"
private const val YOUTUBE_URL_PATTERN = "*://*.youtube.com/*"

// Check if URL is a YouTube page
private fun isYouTubePage(url: String): Boolean = try {
    URL(url).hostname.endsWith("youtube.com")
} catch (_: Throwable) {
    false
}

private suspend fun queryYouTubeTabs(): Array<Tab> =
    browserApi.tabs.query(jsObject { url = arrayOf(YOUTUBE_URL_PATTERN) }).await()

// Get the current state of extension
private suspend fun getCurrentState(): Boolean = try {
    browserApi.storage.local.get(arrayOf(STATE_KEY)).await()[STATE_KEY] != false
} catch (e: Throwable) {
    console.error("Failed to read extension state:", e)
    true
}

// Save the current state
private suspend fun setState(isHidden: Boolean) {
    try {
        browserApi.storage.local.set(json(STATE_KEY to isHidden)).await()
    } catch (e: Throwable) {
        console.error("Failed to save extension state:", e)
        throw e
    }
}

// Inject or remove CSS to hide/show YouTube Shorts
private suspend fun manageShortsCss(tabId: Int, shouldHide: Boolean) {
    try {
        val scripting = browserApi.scripting
        if (scripting != null && scripting.asDynamic().insertCSS != null) {
            val injection = jsObject<CssInjection> {
                files = arrayOf(CSS_FILE)
                target = jsObject { this.tabId = tabId }
            }
            (if (shouldHide) scripting.insertCSS(injection) else scripting.removeCSS(injection)).await()
        } else {
            val details = jsObject<InjectDetails> { file = CSS_FILE }
            val tabs = browserApi.tabs
            (if (shouldHide) tabs.insertCSS(tabId, details) else tabs.removeCSS(tabId, details)).await()
        }
    } catch (e: Throwable) {
        console.error("Failed to ${if (shouldHide) "insert" else "remove"} CSS:", e)
    }
}

// Update the extension icon and title based on current state
private suspend fun updateIcon(isHiding: Boolean) {
    val suffix = if (isHiding) "" else "_disabled"
    val iconPath = json("16" to "icons/icon16$suffix.png", "32" to "icons/icon32$suffix.png")
    val title = "Hide YouTube Shorts${if (isHiding) "" else " - Disabled"}"

    try {
        val actionApi = browserApi.action ?: browserApi.browserAction ?: return
        Promise.all(arrayOf(
            actionApi.setIcon(jsObject { path = iconPath }),
            actionApi.setTitle(jsObject { this.title = title }),
        )).await()
    } catch (e: Throwable) {
        console.error("Failed to update extension icon:", e)
    }
}

// Apply Shorts hiding styles to a specific tab
private suspend fun injectYouTubeShortStyles(tabId: Int) {
    val isHidden = getCurrentState()
    manageShortsCss(tabId, isHidden)
    updateIcon(isHidden)
}

// Toggle the visibility of Shorts across all YouTube tabs
private suspend fun toggleYouTubeShortsVisibility() {
    try {
        val newState = !getCurrentState()

        // Save new state
        setState(newState)

        // Apply changes to all open YouTube tabs (manageShortsCss never rejects)
        val updates = queryYouTubeTabs().mapNotNull { it.id }.map { tabId -> async { manageShortsCss(tabId, newState) } }
        Promise.all(updates.toTypedArray()).await()

        updateIcon(newState)
    } catch (e: Throwable) {
        console.error("Failed to toggle YouTube Shorts visibility:", e)
    }
}

// Store timeouts for debouncing tab updates
private val updateTimeouts = mutableMapOf<Int, Int>()

// Listeners are registered synchronously so events that wake the background worker are not missed
fun main() {
    // Reload all YouTube tabs when extension is installed or updated
    browserApi.runtime.onInstalled.addListener { details ->
        if (details.reason == "install" || details.reason == "update") {
            launch {
                queryYouTubeTabs().forEach { tab -> tab.id?.let { browserApi.tabs.reload(it) } }
            }
        }
    }

    // Listen for tab updates and inject styles when YouTube pages finish loading
    browserApi.tabs.onUpdated.addListener { tabId, changeInfo, tab ->
        val url = tab.url
        if (url != null && isYouTubePage(url) && changeInfo.status == "complete") {
            // Clear any existing timeout for this tab to debounce rapid updates
            updateTimeouts[tabId]?.let { clearTimeout(it) }

            // Delay injection slightly to ensure page is fully loaded
            updateTimeouts[tabId] = setTimeout({
                updateTimeouts.remove(tabId)
                launch { injectYouTubeShortStyles(tabId) }
            }, 100)
        }
    }

    // Click handler for extension icon
    (browserApi.action ?: browserApi.browserAction)?.onClicked?.addListener {
        launch { toggleYouTubeShortsVisibility() }
    }

    // Initialize extension icon state on startup
    launch { updateIcon(getCurrentState()) }
}
