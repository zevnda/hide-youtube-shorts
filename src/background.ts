declare const browser: any;

interface BrowserAPI {
    action?: typeof chrome.action;
    browserAction?: any;
    scripting: typeof chrome.scripting;
    tabs: typeof chrome.tabs;
    runtime: typeof chrome.runtime;
    storage: typeof chrome.storage;
}

const browserAPI: BrowserAPI = typeof browser !== 'undefined' ? browser as any : chrome;
const onClickHandler = browserAPI.action ? browserAPI.action.onClicked : browserAPI.browserAction.onClicked;

const isYouTubePage = (url: string): boolean => new URL(url).hostname.endsWith('youtube.com');

// Get current state from storage
const getCurrentState = async (): Promise<boolean> => {
    try {
        const result = await browserAPI.storage.local.get(['shortsHidden']);
        return result.shortsHidden !== false; // Default to true (hidden) if not set
    } catch (error) {
        console.log('Error reading storage:', error);
        return true; // Default to hidden
    }
};

// Set state in storage
const setState = async (isHidden: boolean): Promise<void> => {
    try {
        await browserAPI.storage.local.set({ shortsHidden: isHidden });
    } catch (error) {
        console.log('Error saving to storage:', error);
    }
};

// Insert CSS based on current state
const injectYouTubeShortStyles = async (tabId: number): Promise<void> => {
    const isHidden = await getCurrentState();
    
    if (!isHidden) {
        updateIcon(false);
        return; // Don't inject CSS if shorts should be visible
    }

    if (browserAPI === chrome) {
        browserAPI.scripting.insertCSS({
            files: ['styles/shorts-selectors.css'],
            target: { tabId }
        }).catch((err: any) => console.log('Error inserting styles', err));
    } else {
        browserAPI.tabs.insertCSS(tabId, {
            file: 'styles/shorts-selectors.css'
        }).catch((err: any) => console.log('Error inserting styles', err));
    }
    
    updateIcon(true);
};

// Toggle Shorts visibility
const toggleYouTubeShortsVisibility = async (): Promise<void> => {
    const currentState = await getCurrentState();
    const newState = !currentState;
    
    await setState(newState);
    
    // Apply to all YouTube tabs
    browserAPI.tabs.query({ url: ['*://*.youtube.com/*'] }, (tabs: chrome.tabs.Tab[]) => {
        tabs.forEach(tab => {
            if (tab.id) {
                executeToggleScript(tab.id, newState);
            }
        });
    });
    
    updateIcon(newState);
};

const executeToggleScript = (tabId: number, isHiding: boolean): void => {
    if (browserAPI === chrome) {
        browserAPI.scripting[isHiding ? 'insertCSS' : 'removeCSS']({
            files: ['styles/shorts-selectors.css'],
            target: { tabId }
        }).catch((err: any) => console.log('Error toggling styles', err));
    } else {
        const method = isHiding ? 'insertCSS' : 'removeCSS';
        (browserAPI.tabs as any)[method](tabId, {
            file: 'styles/shorts-selectors.css'
        }).catch((err: any) => console.log('Error toggling styles', err));
    }
};

const updateIcon = (isHiding: boolean): void => {
    const iconPath = isHiding ? { 16: 'icons/icon16.png' } : { 16: 'icons/icon16_disabled.png' };
    const title = isHiding ? 'Hide YouTube Shorts' : 'Hide YouTube Shorts - Disabled';

    if (browserAPI === chrome && browserAPI.action) {
        browserAPI.action.setIcon({ path: iconPath });
        browserAPI.action.setTitle({ title: title });
    } else if (browserAPI.browserAction) {
        browserAPI.browserAction.setIcon({ path: iconPath });
        browserAPI.browserAction.setTitle({ title: title });
    }
};

// Reload YouTube tabs on extension install or update
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

// Inject Shorts hiding styles when YouTube tabs are updated
browserAPI.tabs.onUpdated.addListener((tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
    if (tab.url && isYouTubePage(tab.url) && changeInfo.status === 'complete') {
        injectYouTubeShortStyles(tabId);
    }
});

// Toggle Shorts visibility when extension icon is clicked
onClickHandler.addListener(() => {
    toggleYouTubeShortsVisibility();
});

// Initialize icon state on startup
getCurrentState().then(updateIcon);
