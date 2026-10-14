// External declarations for the subset of the chrome.* / browser.* extension APIs used by the extension

import kotlin.js.Json
import kotlin.js.Promise

external interface BrowserApi {
    val action: ActionApi?
    val browserAction: ActionApi?
    val scripting: ScriptingApi?
    val tabs: TabsApi
    val runtime: RuntimeApi
    val storage: StorageApi
}

external interface BrowserEvent<T> {
    fun addListener(callback: T)
}

external interface ActionApi {
    val onClicked: BrowserEvent<(tab: Tab) -> Unit>
    fun setIcon(details: IconDetails): Promise<Unit>
    fun setTitle(details: TitleDetails): Promise<Unit>
}

external interface IconDetails {
    var path: Json
}

external interface TitleDetails {
    var title: String
}

external interface ScriptingApi {
    fun insertCSS(injection: CssInjection): Promise<Unit>
    fun removeCSS(injection: CssInjection): Promise<Unit>
    fun executeScript(injection: ScriptInjection): Promise<Array<InjectionResult>>
}

external interface ScriptInjection {
    var func: dynamic
    var target: InjectionTarget
}

external interface InjectionResult {
    val result: Any?
}

external interface CssInjection {
    var files: Array<String>
    var target: InjectionTarget
}

external interface InjectionTarget {
    var tabId: Int
}

external interface TabsApi {
    val onUpdated: BrowserEvent<(tabId: Int, changeInfo: TabChangeInfo, tab: Tab) -> Unit>
    fun query(queryInfo: QueryInfo): Promise<Array<Tab>>
    fun reload(tabId: Int): Promise<Unit>

    // Manifest V2 fallbacks for browsers without the scripting API
    fun insertCSS(tabId: Int, details: InjectDetails): Promise<Unit>
    fun removeCSS(tabId: Int, details: InjectDetails): Promise<Unit>
    fun executeScript(tabId: Int, details: ScriptDetails): Promise<Array<Any?>>
}

external interface ScriptDetails {
    var code: String
}

external interface Tab {
    val id: Int?
    val url: String?
}

external interface TabChangeInfo {
    val status: String?
}

external interface QueryInfo {
    var url: Array<String>
}

external interface InjectDetails {
    var file: String
}

external interface RuntimeApi {
    val onInstalled: BrowserEvent<(details: InstalledDetails) -> Unit>
}

external interface InstalledDetails {
    val reason: String
}

external interface StorageApi {
    val local: StorageArea
}

external interface StorageArea {
    fun get(keys: Array<String>): Promise<Json>
    fun set(items: Json): Promise<Unit>
}

external fun setTimeout(handler: () -> Unit, timeout: Int): Int
external fun clearTimeout(id: Int)

// Firefox exposes the promise-based `browser` namespace, Chrome only has `chrome`
val browserApi: BrowserApi = js("typeof browser !== 'undefined' ? browser : chrome").unsafeCast<BrowserApi>()

fun <T : Any> jsObject(init: T.() -> Unit): T = js("({})").unsafeCast<T>().apply(init)
