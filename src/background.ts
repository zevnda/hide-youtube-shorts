declare const browser: any;

interface BrowserAPI {
    action?: typeof chrome.action;
    browserAction?: typeof chrome.browserAction;
    scripting: typeof chrome.scripting;
    tabs: typeof chrome.tabs;
    runtime: typeof chrome.runtime;
    storage: typeof chrome.storage;
}

const browserAPI: BrowserAPI = (typeof browser !== 'undefined' ? browser : chrome) as BrowserAPI;

const getActionHandler = () => {
    return browserAPI.action?.onClicked || browserAPI.browserAction?.onClicked;
};

// Check if URL is a YouTube page
const isYouTubePage = (url: string): boolean => {
    try {
        return new URL(url).hostname.endsWith('youtube.com');
    } catch {
        return false;
    }
};

// Get the current state of extension
const getCurrentState = async (): Promise<boolean> => {
    try {
        const result = await browserAPI.storage.local.get(['shortsHidden']);
        return result.shortsHidden !== false;
    } catch (error) {
        console.error('Failed to read extension state:', error);
        return true;
    }
};

// Save the current state
const setState = async (isHidden: boolean): Promise<void> => {
    try {
        await browserAPI.storage.local.set({ shortsHidden: isHidden });
    } catch (error) {
        console.error('Failed to save extension state:', error);
        throw error;
    }
};

// Inject or remove CSS to hide/show YouTube Shorts
const manageShortsCSS = async (tabId: number, shouldHide: boolean): Promise<void> => {
    const cssFile = 'styles/shorts-selectors.css';
    
    try {
        if (browserAPI.scripting?.insertCSS) {
            if (shouldHide) {
                await browserAPI.scripting.insertCSS({
                    files: [cssFile],
                    target: { tabId }
                });
            } else {
                await browserAPI.scripting.removeCSS({
                    files: [cssFile],
                    target: { tabId }
                });
            }
        } else {
            const method = shouldHide ? 'insertCSS' : 'removeCSS';
            await (browserAPI.tabs as any)[method](tabId, { file: cssFile });
        }
    } catch (error) {
        console.error(`Failed to ${shouldHide ? 'insert' : 'remove'} CSS:`, error);
    }
};

// Update the extension icon and title based on current state
const updateIcon = async (isHiding: boolean): Promise<void> => {
    const iconPath = { 16: `icons/icon16${isHiding ? '' : '_disabled'}.png` };
    const title = `Hide YouTube Shorts${isHiding ? '' : ' - Disabled'}`;

    try {
        const actionAPI = browserAPI.action || browserAPI.browserAction;
        if (actionAPI) {
            await Promise.all([
                actionAPI.setIcon({ path: iconPath }),
                actionAPI.setTitle({ title })
            ]);
        }
    } catch (error) {
        console.error('Failed to update extension icon:', error);
    }
};

// Apply Shorts hiding styles to a specific tab
const injectYouTubeShortStyles = async (tabId: number): Promise<void> => {
    const isHidden = await getCurrentState();
    await manageShortsCSS(tabId, isHidden);
    await updateIcon(isHidden);
};

// Toggle the visibility of Shorts across all YouTube tabs
const toggleYouTubeShortsVisibility = async (): Promise<void> => {
    try {
        const currentState = await getCurrentState();
        const newState = !currentState;
        
        // Save new state
        await setState(newState);
        
        // Apply changes to all open YouTube tabs
        const tabs = await new Promise<chrome.tabs.Tab[]>((resolve) => {
            browserAPI.tabs.query({ url: ['*://*.youtube.com/*'] }, resolve);
        });
        
        await Promise.allSettled(
            tabs.map(tab => tab.id ? manageShortsCSS(tab.id, newState) : Promise.resolve())
        );
        
        await updateIcon(newState);
    } catch (error) {
        console.error('Failed to toggle YouTube Shorts visibility:', error);
    }
};

// Reload all YouTube tabs when extension is installed or updated
browserAPI.runtime.onInstalled.addListener((details: chrome.runtime.InstalledDetails) => {
    if (details.reason === 'install' || details.reason === 'update') {
        browserAPI.tabs.query({ url: ['*://*.youtube.com/*'] }, (tabs: chrome.tabs.Tab[]) => {
            tabs.forEach(tab => {
                if (tab.id) {
                    browserAPI.tabs.reload(tab.id);
                }
            });
        });
    }
});

// Store timeoutsfor debouncing tab updates
let updateTimeouts = new Map<number, NodeJS.Timeout>();

// Listen for tab updates and inject styles when YouTube pages finish loading
browserAPI.tabs.onUpdated.addListener((tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
    if (tab.url && isYouTubePage(tab.url) && changeInfo.status === 'complete') {
        // Clear any existing timeout for this tab to debounce rapid updates
        const existingTimeout = updateTimeouts.get(tabId);
        if (existingTimeout) {
            clearTimeout(existingTimeout);
        }
        
        // Delay injection slightly to ensure page is fully loaded
        const timeout = setTimeout(() => {
            injectYouTubeShortStyles(tabId);
            updateTimeouts.delete(tabId);
        }, 100);
        
        updateTimeouts.set(tabId, timeout);
    }
});

// Click handler for extension icon
const clickHandler = getActionHandler();
if (clickHandler) {
    clickHandler.addListener(() => {
        toggleYouTubeShortsVisibility();
    });
}

// Initialize extension icon state on startup
getCurrentState()
    .then(updateIcon)
    .catch(error => console.error('Failed to initialize extension:', error));
