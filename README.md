# firefox

Firefox **userChrome.js** scripts

#### minimize-memory.uc.js

Frees browser memory when needed. The function is the same as clicking the `Minimize memory usage` button on the `about:memory` tab.

Default parameters (edit them as you see fit):
```
const threshold = 1000;      // script is activated only when (megabytes) or more RAM are used
const minz_limit = 500;      // minimize memory when relative RAM consumption exceeds (megabytes)
const poll_interval = 30000; // check RAM consumption value every (milliseconds)
const poll_number = 3;       // how many RAM values to aggregate for decision
const debug_notify = true;   // show notification when memory is cleared
const notify_time = 1000;    // keep notification for (milliseconds)
const debug_beep = true;     // sound beep when memory is cleared
const beep_time = 0.1;       // beep duration (seconds)
```

## How to use

[xiaoxiaoflood](https://github.com/xiaoxiaoflood/firefox-scripts)'s method
1. Unpack [firefox.zip](https://github.com/update692/firefox/raw/master/firefox.zip) into Firefox installation folder
2. Unpack [chrome.zip](https://github.com/update692/firefox/raw/master/chrome.zip) into your Firefox profile `chrome` subfolder
3. Place [minimize-memory.uc.js](https://github.com/update692/firefox/raw/master/minimize-memory.uc.js) into your Firefox profile `chrome` subfolder
4. Restart Firefox, you should have the button to manage scripts with Minimize Memory Usage script already registered there
