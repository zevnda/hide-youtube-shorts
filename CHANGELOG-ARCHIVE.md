## v1.9.0 (15 October 2026)

- Rewrite the extension in Kotlin
- New extension icon
- Sharper toolbar icon on high-resolution displays
- License changed from GPL-3.0 to MIT

## v1.8.1 (28 August 2025)

- Fix shorts shelf not being hidden in search results

## v1.8.0 (9 June 2025)

_No release notes._

## v1.7.1 (27 November 2024)

- Improved code readability
- Improved the insertion/removal of stylesheets
- URL bar icon now reflects the enabled/disabled state of the extension
- Fixed an issue on FireFox where Shorts were unable to be rehidden after unhiding them

## v1.7.0 (26 November 2024)

I've decided to breathe new life into this repo and release a completely revised version of HYS. This is a full top-to-bottom rewrite, but it still retains the core functionality of the old version, with the following notable changes:
- Removed the popup window for simplicity
  - This eliminates the togglable options from previous versions and focuses solely on hiding Shorts videos everywhere on YouTube by default
  - The extension can still be easily toggled on and off by clicking the extension's icon in the URL toolbar, allowing you to hide/show Shorts content in real-time
- Now using friendlier permissions
  - The extension now uses `*://*.youtube.com/*` instead of the previous `<all_urls>` permission, making it more privacy-conscious
- The extension is now available for Firefox users as well

## v1.6.15.3 (12 August 2023)

##### *DEPRECATED*

#### **Changelog**

##### Changed
- Made some features 'pro' gated

#### **Download**
[hide-youtube-shorts-1.6.15.3.zip](https://github.com/ProbablyRaging/hide-youtube-shorts/files/12326956/hide-youtube-shorts-1.6.15.3.zip)

## v1.6.15.2 (26 July 2023)

##### *DEPRECATED*

#### **Changelog**

##### Fixed
- Fixed an issue _(#29)_ where the shorts shelf was not being hidden on the subscriptions feed when in list view

#### **Download**
[hide-youtube-shorts-1.6.15.2.zip](https://github.com/ProbablyRaging/hide-youtube-shorts/files/12329249/hide-youtube-shorts-1.6.15.2.zip)

## v1.6.15.1 (27 June 2023)

##### *DEPRECATED*
#### **Changelog**

##### Changed
- Fixed an issue _(#25)_ where shorts were being hidden in the shorts tab on channel pages even when the option was disabled
- Updated the block button the `blocking` page

#### **Download**
[hide-youtube-shorts-1.6.15.1.zip](https://github.com/ProbablyRaging/hide-youtube-shorts/files/12329252/hide-youtube-shorts-1.6.15.1.zip)

## v1.6.15 (25 June 2023)

##### *DEPRECATED*
#### **Changelog**

**As of version `1.6.15` onwards, Hide YouTube Shorts will no longer work on the old YouTube UI. [Click here](https://github.com/ProbablyRaging/hide-youtube-shorts/issues/2) for more information**

##### Added
- Added the `blocking` tab which will allow users to block specific channels based on the channel's handle _(e.g.: @ChannelName)_. Adding a channel to your blocklist will hide that channel's content on the Home, Subscriptions, Trending, and Search pages
- Added locales for English, French, German, Spanish, and Russian
- Added a badge to settings button which will display the extensions toggle state _(on = green, red = off)_
- Added page icon and page description to the page header

##### Changed
- Opting to use stylesheets over javascript logic for the majority of the hiding function _(desktop only),_ this should result in;
  - Significantly less system resource usage
  - Videos and other elements being hidden long before the page finishes loading
  - The ability to toggle options on/off and see the changes in real time, without needing to refresh the page
- Moved the power button _(main extension toggle)_ to the settings menu
- Updated navigation bar icons
- Updated switch container styles
- Increased the overall popup height and width

##### Removed
- Removed the `statistics` tab as it is no longer viable with the new changes

#### **Download**
[hide-youtube-shorts-1.6.15.zip](https://github.com/ProbablyRaging/hide-youtube-shorts/files/12329254/hide-youtube-shorts-1.6.15.zip)

## v1.6.14 (18 June 2023)

#### **Changelog**

##### Changed
- I have decided to completely revert the extenison back to v1.6.12 as people were not happy about the new permissions required by the changes made in v1.6.13

#### **Download**
[hide-youtube-shorts-1.6.14.zip](https://github.com/ProbablyRaging/hide-youtube-shorts/files/11780902/hide-youtube-shorts-1.6.14.zip)

## v1.6.13 (17 June 2023)

#### **Changelog**

##### Changed
- Opting to use stylesheets over javascript logic for the majority of the hiding function, this should result in;
  - Significantly less system resource usage
  - Videos and other elements being hidden long before the page finishes loading
  - The ability to toggle options on/off and see the changes in real time, without needing to refresh the page
  - A much nicer user experience overall
 
https://github.com/ProbablyRaging/hide-youtube-shorts/assets/24839609/82b45d85-03da-4d4f-9d7a-4da7ce953b18

##### Removed
- Removed the statistics tab as it is no longer viable with the new changes

#### **Download**
~~hide-youtube-shorts-1.6.13.zip~~

## v1.6.12 (16 June 2023)

#### **Changelog**

##### Fixed
- Fixed an issue where the Shorts shelf would still show on the Subscriptions page for some users

#### **Download**
[hide-youtube-shorts-1.6.12.zip](https://github.com/ProbablyRaging/hide-youtube-shorts/files/11760504/hide-youtube-shorts-1.6.12.zip)

## v1.6.11 (13 June 2023)

#### **Changelog**

##### Changed
- Updated the support link in the settings menu

#### **Download**
[hide-youtube-shorts-1.6.11.zip](https://github.com/ProbablyRaging/hide-youtube-shorts/files/11734371/hide-youtube-shorts-1.6.11.zip)

## v1.6.10 (11 June 2023)

#### **Changelog**

##### Changed
- New logo and icons
- Minor refactoring of context scripts

#### **Download**
[hide-youtube-shorts-1.6.10.zip](https://github.com/ProbablyRaging/hide-youtube-shorts/files/11714730/hide-youtube-shorts-1.6.10.zip)

## v1.6.9 (10 June 2023)

#### **Changelog**

##### Fixed
- Fixed an issue where Lives and Premieres weren't being hidden when viewing the Subscriptions feed in list view
- Fixed an issue with an unassigned variable

#### **Download**
[hide-youtube-shorts-1.6.9.zip](https://github.com/ProbablyRaging/hide-youtube-shorts/files/11710767/hide-youtube-shorts-1.6.9.zip)

## v1.6.8 (9 June 2023)

#### **Changelog**

##### Fixed
- Fixed an issue with elements being out of place especially on channel pages. This is caused by the insertion of CSS into pages
- Added a temporary fix for the subscriptions page being completely empty when navigating away and then back to it. Still not really sure what causes this

#### **Download**
[hide-youtube-shorts-1.6.8.zip](https://github.com/ProbablyRaging/hide-youtube-shorts/files/11705198/hide-youtube-shorts-1.6.8.zip)

## v1.6.7 (9 June 2023)

#### **Changelog**

##### Fixed
- Fixed the issue where empty spaces were left behind when removing Shorts from the Subscriptions feed. Massive thank you to HorsyNox for reaching out and providing the fix!

#### **Download**
[hide-youtube-shorts.1.6.7.zip](https://github.com/ProbablyRaging/hide-youtube-shorts/files/11692824/hide-youtube-shorts.1.6.7.zip)

## v1.6.6 (8 June 2023)

#### **Changelog**

##### Added
- Added the option to hide Live and Premiere videos in the Home and Subscriptions feeds

#### **Download**
[hide-youtube-shorts-1.6.6.zip](https://github.com/ProbablyRaging/hide-youtube-shorts/files/11686632/hide-youtube-shorts-1.6.6.zip)

## v1.6.5 (8 June 2023)

#### **Changelog**

##### Fixed
- Fixed an issue with the "Element Removed" placeholder image being too large sometimes

#### **Download**
[hide-youtube-shorts-1.6.5.zip](https://github.com/ProbablyRaging/hide-youtube-shorts/files/11685165/hide-youtube-shorts-1.6.5.zip)

## v1.6.3 (8 June 2023)

#### **Changelog**

##### Added
- Added a "Reset Statistics" button to the Statistics page

##### Fixed
- Fixed an issue with the subscription feed statistic repeatedly counting already hidden elements

##### Changed
- Increased the overall extension popup window height and width

#### **Download**
[hide-youtube-shorts-1.6.3.zip](https://github.com/ProbablyRaging/hide-youtube-shorts/files/11678556/hide-youtube-shorts-1.6.3.zip)

## v1.6.2 (7 June 2023)

#### **Changelog**

##### Added
- Added an option to fill empty space left behind when removing Shorts elements on the Subscriptions page with the new UI

##### Fixed
- Fixed an issue where the old UI method and new UI method were sometimes clashing causing all vidies to be removed on the Subscriptions page

#### **Download**
[hide-youtube-shorts-1.6.2.zip](https://github.com/ProbablyRaging/hide-youtube-shorts/files/11676611/hide-youtube-shorts-1.6.2.zip)

## v1.6.1 (7 June 2023)

#### **Changelog**

##### Fixed
- Fixed an issue where Shorts videos were not being hidden on the Subscriptions page due to a slow rollout of a new YouTube UI

#### **Download**
[hide-youtube-shorts-1.6.1.zip](https://github.com/ProbablyRaging/hide-youtube-shorts/files/11673710/hide-youtube-shorts-1.6.1.zip)

## v1.6.0 (7 June 2023)

#### **Changelog**

##### Added
- **Statistics Tab** - See a breakdown of how HYS has improved your experience on YouTube
- **Play As Regular Video** - Added the option to automatically play Shorts videos in a regular video page

##### Changed
- Updated the UI to be a little more elegant and reponsive
- Fixed an issue where enabling the option to hide Shorts in the notifcation menu would remove the entire menu

#### **Download**
[hide-youtube-shorts-1.6.0.zip](https://github.com/ProbablyRaging/hide-youtube-shorts/files/11667126/hide-youtube-shorts-1.6.0.zip)

## v1.4.9 (16 April 2023)

#### **Changelog**

##### Changed
- Temporarily disabled the "Notification Menu" option due to issues with it making the entire notification menu unusable

#### **Download**
[hide-youtube-shorts-1.4.9.zip](https://github.com/ProbablyRaging/hide-youtube-shorts/files/11241700/hide-youtube-shorts-1.4.9.zip)

## v1.4.7 (19 February 2023)

#### **Changelog**

##### Fixed
- Fixed an issue where when the sendMessage method was called with an invalid tabId it would throw an error

#### **Download**
[hide-youtube-shorts-1.4.7.zip](https://github.com/ProbablyRaging/hide-youtube-shorts/files/10776744/hide-youtube-shorts-1.4.7.zip)

## v1.4.6 (17 February 2023)

#### **Changelog**

##### Added
- Added the option to hide shorts elements in the recommended list on video watch pages
##### Changed
- Settings and theme choices will now persist over updates
- Other minor UI tweaks

#### **Download**
[hide-youtube-shorts-1.4.6.zip](https://github.com/ProbablyRaging/hide-youtube-shorts/files/10765294/hide-youtube-shorts-1.4.6.zip)

## v1.4.5 (16 February 2023)

#### **Changelog**

##### Added
- Added a modal window to present users with a changelog and other information on install and updates

#### **Download**
[hide-youtube-shorts-1.4.5.zip](https://github.com/ProbablyRaging/hide-youtube-shorts/files/10753371/hide-youtube-shorts-1.4.5.zip)

## v1.4.4 (15 February 2023)

#### **Changelog**

##### Changed
- Further improvements to element hiding functions, meaning less system resource usage
- Miscellaneous UI tweaks
##### Fixed
- Fixed an issue with reading page titles to determine if a function should continue or not. This caused issues on browsers using locales other than English

#### **Download**
[hide-youtube-shorts-1.4.4.zip](https://github.com/ProbablyRaging/hide-youtube-shorts/files/10741626/hide-youtube-shorts-1.4.4.zip)

## v1.4.3 (14 February 2023)

#### **Changelog**

##### Changed
- Refactored code and other QOL stuff

#### **Download**
[hide-youtube-shorts-1.4.3.zip](https://github.com/ProbablyRaging/hide-youtube-shorts/files/10731538/hide-youtube-shorts-1.4.3.zip)

## v1.4.2 (14 February 2023)

#### **Changelog**

##### Added
- Added compatibility for mobile site

#### **Download**
[hide-youtube-shorts-1.4.2.zip](https://github.com/ProbablyRaging/hide-youtube-shorts/files/10727117/hide-youtube-shorts-1.4.2.zip)

## v1.4.1 (14 February 2023)

#### **Changelog**

##### Fixed
- Fixed an issue causing shorts elements to not be hidden when viewing the subscriptions page in grid view

#### **Download**
[hide-youtube-shorts-1.4.1.zip](https://github.com/ProbablyRaging/hide-youtube-shorts/files/10726649/hide-youtube-shorts-1.4.1.zip)

## v1.4.0 (13 February 2023)

#### **Changelog**

##### Added
- Added a 'turbo' switch to use a more aggressive approach to hiding elements
- Added webpack for JS and CSS minification of production package on the Chrome store
##### Changed
- Refactored the execution of scripts to decrease system resource consumption _(non-turbo mode)_
- Split grouped functions into their own separate functions for better control over what elements are hidden
- Partially refactored popup scripts
- Miscellaneous UI tweaks in the popup window
- Restructured directories

#### **Download**
[hide-youtube-shorts-1.4.0.zip](https://github.com/ProbablyRaging/hide-youtube-shorts/files/10720896/hide-youtube-shorts-1.4.0.zip)

## v1.3.7 (12 February 2023)

#### **Changelog**

##### Changed
- Wait for the status of the tab to be 'loading' before executing scripts to prevent functions from running more than once

#### **Download**
[hide-youtube-shorts-v1.3.7.zip](https://github.com/ProbablyRaging/hide-youtube-shorts/files/10714496/hide-youtube-shorts.zip)

## v1.3.6 (12 February 2023)

#### **Changelog**

##### Added
- Added theme stepper to the popup UI for switching themes
- Added 6 different themes (3 dark, 3 light) to choose from via the popup UI - changing the UI theme will also change the badge icon in the address bar
##### Changed
- Updated icon sets and images for new main theme

#### **Download**
[hide-youtube-shorts-v1.3.6.zip](https://github.com/ProbablyRaging/hide-youtube-shorts/files/10714073/hide-youtube-shorts.zip)

## v1.3.4 (10 February 2023)

#### **Changelog**

##### Changed
- Updated icons

#### **Download**
[hide-youtube-shorts-v1.3.4.zip](https://github.com/ProbablyRaging/hide-youtube-shorts/files/10701491/hide-youtube-shorts.zip)

## v1.3.3 (10 February 2023)

#### **Changelog**

##### Added
- Added a check to see if the extension was unloaded or updated, which will refresh any active YouTube tabs if needed
##### Changed
- No longer requiring the "tabs" permissions in the manifest - this should prevent the Chrome store from incorrectly issuing users a warning about the extension accessing browsing data

#### **Download**
[hide-youtube-shorts-v1.3.3.zip](https://github.com/ProbablyRaging/hide-youtube-shorts/files/10700961/hide-youtube-shorts.zip)

## v1.3.0 (10 February 2023)

#### **Changelog**

##### Added
- Added separate toggle buttons to the popup menu for hiding shorts elements in the home and subscription feeds
##### Changed
- Refactored functions to allow improved element hiding in specific areas
- Set the state of the extension and refresh any open YouTube tabs on initial install
##### Fixed
- Fixed misaligned icons

#### **Download**
[hide-youtube-shorts-v1.3.0.zip](https://github.com/ProbablyRaging/hide-youtube-shorts/files/10698403/hide-youtube-shorts.zip)

## v1.2.2 (3 February 2023)

#### **Changelog**

##### Fixed
- Fixed an issue where hiding shorts elements in the notification menu caused the entire menu to be unusable (fixes #1)

#### **Download**
[hide-youtube-shorts-v1.2.2.zip](https://github.com/ProbablyRaging/hide-youtube-shorts/files/10571097/hide-youtube-shorts.zip)

## v1.2.1 (12 January 2023)

#### **Changelog**

##### Changed
- Updated the address bar menu icon to fit the popup theme

#### **Download**
[hide-youtube-shorts-v1.2.1.zip](https://github.com/ProbablyRaging/hide-youtube-shorts/files/10397816/hide-youtube-shorts.zip)

## v1.2.0 (11 January 2023)

#### **Changelog**

##### Added
- Added toggleable buttons for hiding Shorts features in specific areas of YouTube **(videos, tabs, menu buttons)**
- Added address bar icon to visibly show when the extension is set to "on" or "off"

##### Fixed
- Fixed an issue where parent elements of Shorts videos weren't properly being removed in the subscriptions tab

#### **Download**
[hide-youtube-shorts-v1.2.0.zip](https://github.com/ProbablyRaging/hide-youtube-shorts/files/10389055/hide-youtube-shorts.zip)
