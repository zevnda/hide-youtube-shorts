chrome.runtime.onInstalled.addListener(async t=>{if(t.reason==="install"&&(chrome.storage.sync.set({presentModal:!0,toggleState:!0,toggleNavState:!0,toggleHomeFeedState:!0,toggleHomeFeedStateLives:!1,toggleHomeFeedStatePremieres:!1,toggleSubscriptionFeedState:!0,toggleSubscriptionFeedStateLives:!1,toggleSubscriptionFeedStatePremieres:!1,toggleTrendingFeedState:!0,toggleSearchState:!0,toggleRecommendedState:!0,toggleTabState:!0,toggleHomeTabState:!0,toggleTurboState:!1,toggleRegularState:!0,toggleNotificationState:!0}).catch(()=>{console.log("[STORAGE] Could not set storage item")}),chrome.tabs.query({url:["https://www.youtube.com/*","https://m.youtube.com/*"]},function(o){o.forEach(s=>{chrome.tabs.reload(s.id)})}),chrome.action.setBadgeBackgroundColor({color:"#ed5a64"}),chrome.action.setBadgeText({text:"1"})),t.reason==="update"){const o=["toggleState","toggleNavState","toggleHomeFeedState","toggleHomeFeedStateLives","toggleHomeFeedStatePremieres","toggleSubscriptionFeedState","toggleSubscriptionFeedStateLives","toggleSubscriptionFeedStatePremieres","toggleTrendingFeedState","toggleSearchState","toggleRecommendedState","toggleTabState","toggleHomeTabState","toggleTurboState","toggleRegularState","toggleNotificationState"],s=await chrome.storage.sync.get(o);for(const e of o)(!(e in s)||s[e]===void 0)&&await chrome.storage.sync.set({[e]:!1});chrome.storage.sync.set({presentModal:!0}).catch(()=>{console.log("[STORAGE] Could not set storage item")}),chrome.action.setBadgeBackgroundColor({color:"#ed5a64"}),chrome.action.setBadgeText({text:"1"})}});function l(){return chrome.runtime.id?chrome.storage.sync.get(["toggleState","toggleNavState","toggleHomeFeedState","toggleHomeFeedStateLives","toggleHomeFeedStatePremieres","toggleSubscriptionFeedState","toggleSubscriptionFeedStateLives","toggleSubscriptionFeedStatePremieres","toggleTrendingFeedState","toggleSearchState","toggleRecommendedState","toggleTabState","toggleHomeTabState","toggleTurboState","toggleRegularState","toggleNotificationState"]):location.reload()}function r(t,o){chrome.scripting.insertCSS({files:o,target:{tabId:t}})}function g(t,o){chrome.scripting.removeCSS({files:o,target:{tabId:t}})}function N(t){chrome.scripting.removeCSS({files:["assets/home_lives.css","assets/home_premieres.css","assets/home_shorts.css","assets/home_tab_shorts.css","assets/navigation_button.css","assets/notification_shorts.css","assets/recommended_shorts.css","assets/search_shorts.css","assets/sub_feed_fix.css","assets/subscriptions_lives.css","assets/subscriptions_premieres.css","assets/subscriptions_shorts.css","assets/trending_shorts.css"],target:{tabId:t}}),chrome.scripting.executeScript({function:()=>{const o=document.querySelectorAll(".tab-content");Array.from(o).filter(e=>e.textContent.replace(/\s/g,"").replace(/\n/g,"")==="Shorts").forEach(e=>{e.parentNode.style.display="inline-flex"})},target:{tabId:t}})}chrome.runtime.onMessage.addListener(async function(t,o,s){if(t.checkStates){const e=await l();chrome.tabs.query({url:["https://www.youtube.com/*","https://m.youtube.com/*"]},function(c){c.forEach(i=>{t.checkStates==="toggleState"&&R(i,i.id,e.toggleState),t.checkStates==="toggleNavState"&&a(i,i.id,e.toggleNavState),t.checkStates==="toggleHomeFeedState"&&u(i,i.id,e.toggleHomeFeedState),t.checkStates==="toggleHomeFeedStateLives"&&S(i,i.id,e.toggleHomeFeedStateLives),t.checkStates==="toggleHomeFeedStatePremieres"&&f(i,i.id,e.toggleHomeFeedStatePremieres),t.checkStates==="toggleSubscriptionFeedState"&&m(i,i.id,e.toggleSubscriptionFeedState),t.checkStates==="toggleSubscriptionFeedStateLives"&&d(i,i.id,e.toggleSubscriptionFeedStateLives),t.checkStates==="toggleSubscriptionFeedStatePremieres"&&h(i,i.id,e.toggleSubscriptionFeedStatePremieres),t.checkStates==="toggleTrendingFeedState"&&p(i,i.id,e.toggleTrendingFeedState),t.checkStates==="toggleSearchState"&&w(i,i.id,e.toggleSearchState),t.checkStates==="toggleRecommendedState"&&F(i,i.id,e.toggleRecommendedState),t.checkStates==="toggleNotificationState"&&y(i,i.id,e.toggleNotificationState),t.checkStates==="toggleTabState"&&H(i,i.id,e.toggleTabState),t.checkStates==="toggleHomeTabState"&&v(i,i.id,e.toggleHomeTabState),t.checkStates==="toggleRegularState"&&T(i,i.id,e.toggleRegularState)})})}});chrome.tabs.onUpdated.addListener(async function(t,o,s){if(!chrome.runtime.id)return;const e=await l();e.toggleState&&o.status==="loading"&&(e.toggleNavState&&a(s,t,e.toggleNavState),e.toggleHomeFeedState&&u(s,t,e.toggleHomeFeedState),e.toggleHomeFeedStateLives&&S(s,t,e.toggleHomeFeedStateLives),e.toggleHomeFeedStatePremieres&&f(s,t,e.toggleHomeFeedStatePremieres),e.toggleSubscriptionFeedState&&m(s,t,e.toggleSubscriptionFeedState),e.toggleSubscriptionFeedStateLives&&d(s,t,e.toggleSubscriptionFeedStateLives),e.toggleSubscriptionFeedStatePremieres&&h(s,t,e.toggleSubscriptionFeedStatePremieres),e.toggleTrendingFeedState&&p(s,t,e.toggleTrendingFeedState),e.toggleSearchState&&w(s,t,e.toggleSearchState),e.toggleRecommendedState&&F(s,t,e.toggleRecommendedState),e.toggleNotificationState&&y(s,t,e.toggleNotificationState),e.toggleTabState&&H(s,t,e.toggleTabState),e.toggleHomeTabState&&v(s,t,e.toggleHomeTabState),e.toggleRegularState&&T(s,t,e.toggleRegularState))});async function R(t,o,s){if(s){const e=await l();e.toggleNavState&&a(t,o,e.toggleNavState),e.toggleHomeFeedState&&u(t,o,e.toggleHomeFeedState),e.toggleHomeFeedStateLives&&S(t,o,e.toggleHomeFeedStateLives),e.toggleHomeFeedStatePremieres&&f(t,o,e.toggleHomeFeedStatePremieres),e.toggleSubscriptionFeedState&&m(t,o,e.toggleSubscriptionFeedState),e.toggleSubscriptionFeedStateLives&&d(t,o,e.toggleSubscriptionFeedStateLives),e.toggleSubscriptionFeedStatePremieres&&h(t,o,e.toggleSubscriptionFeedStatePremieres),e.toggleTrendingFeedState&&p(t,o,e.toggleTrendingFeedState),e.toggleSearchState&&w(t,o,e.toggleSearchState),e.toggleRecommendedState&&F(t,o,e.toggleRecommendedState),e.toggleNotificationState&&y(t,o,e.toggleNotificationState),e.toggleTabState&&H(t,o,e.toggleTabState),e.toggleHomeTabState&&v(t,o,e.toggleHomeTabState),e.toggleRegularState&&T(t,o,e.toggleRegularState)}s||N(o)}function a(t,o,s){if(t.url.includes("https://www.youtube.com/")){const e=["assets/navigation_button.css"];s&&r(o,e),s||g(o,e)}}function u(t,o,s){if(t.url==="https://www.youtube.com/"){const e=["assets/home_shorts.css"];s&&r(o,e),s||g(o,e)}}function S(t,o,s){if(t.url==="https://www.youtube.com/"){const e=["assets/home_lives.css"];s&&r(o,e),s||g(o,e)}}function f(t,o,s){if(t.url==="https://www.youtube.com/"){const e=["assets/home_premieres.css"];s&&r(o,e),s||g(o,e)}}function m(t,o,s){if(t.url==="https://www.youtube.com/feed/subscriptions"){const e=["assets/subscriptions_shorts.css","assets/sub_feed_fix.css"];s&&r(o,e),s||g(o,e)}}function d(t,o,s){if(t.url==="https://www.youtube.com/feed/subscriptions"){const e=["assets/subscriptions_lives.css","assets/sub_feed_fix.css"];s&&r(o,e),s||g(o,e)}}function h(t,o,s){if(t.url==="https://www.youtube.com/feed/subscriptions"){const e=["assets/subscriptions_premieres.css","assets/sub_feed_fix.css"];s&&r(o,e),s||g(o,e)}}function p(t,o,s){if(t.url.includes("https://www.youtube.com/feed/trending")||t.url.includes("https://www.youtube.com/gaming")){const e=["assets/trending_shorts.css"];s&&r(o,e),s||g(o,e)}}function w(t,o,s){if(t.url.includes("https://www.youtube.com/results")){const e=["assets/search_shorts.css"];s&&r(o,e),s||g(o,e)}}function F(t,o,s){if(t.url.includes("https://www.youtube.com/watch")){const e=["assets/recommended_shorts.css"];s&&r(o,e),s||g(o,e)}}function y(t,o,s){if(t.url.includes("https://www.youtube.com/")){const e=["assets/notification_shorts.css"];s&&r(o,e),s||g(o,e)}}function v(t,o,s){if(t.url.includes("https://www.youtube.com/channel/")||t.url.includes("https://www.youtube.com/@")||t.url.includes("https://www.youtube.com/user/")||t.url.includes("https://www.youtube.com/c/")){const e=["assets/home_tab_shorts.css"];s&&r(o,e),s||g(o,e)}}function H(t,o,s){(t.url.includes("https://www.youtube.com/channel/")||t.url.includes("https://www.youtube.com/@")||t.url.includes("https://www.youtube.com/user/")||t.url.includes("https://www.youtube.com/c/"))&&(s?chrome.scripting.executeScript({function:()=>{const e=document.querySelectorAll(".tab-content");Array.from(e).filter(i=>i.textContent.replace(/\s/g,"").replace(/\n/g,"")==="Shorts").forEach(i=>{i.parentNode.style.display="none"})},target:{tabId:o}}):chrome.scripting.executeScript({function:()=>{const e=document.querySelectorAll(".tab-content");Array.from(e).filter(i=>i.textContent.replace(/\s/g,"").replace(/\n/g,"")==="Shorts").forEach(i=>{i.parentNode.style.display="inline-flex"})},target:{tabId:o}}))}function T(t,o,s){if(t.url.includes("https://www.youtube.com/shorts/")){let c=function(n){const L=/\/shorts\/([^/]+)/,_=n.match(L);return _?_[1]:null};var e=c;const i=c(t.url);if(i&&s){const n=`https://youtube.com/watch?v=${i}`;chrome.tabs.update(o,{url:n})}}}
