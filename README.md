# Firefox userChrome.js scripts

[minimize-memory.uc.js](https://github.com/update692/firefox/raw/master/minimize-memory.uc.js) (tested on Firefox 137.0.2)

Automatically frees browser memory when needed. The function is the same as clicking the `Minimize memory usage` button on the `about:memory` tab.

Default parameters (edit them as you see fit):
```
const threshold = 1000;      // script is activated only when Firefox uses (megabytes) or more RAM
const minz_limit = 500;      // minimize memory when relative RAM consumption exceeds (megabytes)
const poll_interval = 30000; // check RAM consumption value every (milliseconds)
const poll_number = 3;       // how many RAM consumption values to aggregate for decision
// must be less than poll_interval
const cooldown_time = 5000;  // give (milliseconds) for RAM level to stalilize after minimizing
const debug_beep = false;    // sound beep when memory is cleared
const beep_time = 0.1;       // beep duration (seconds)
const round_mb = 20;         // round RAM values to (megabytes)
```

## How to use

### Preparation:

[xiaoxiaoflood](https://github.com/xiaoxiaoflood/firefox-scripts)'s method
1. Unpack [firefox.zip](https://github.com/update692/firefox/raw/master/firefox.zip) into Firefox installation folder.
2. Unpack [chrome.zip](https://github.com/update692/firefox/raw/master/chrome.zip) into your Firefox profile `chrome` subfolder.

### Installation:

3. Place [minimize-memory.uc.js](https://github.com/update692/firefox/raw/master/minimize-memory.uc.js) into your Firefox profile `chrome` subfolder.
4. Restart Firefox, you should have the button to manage scripts with Minimize Memory Usage script already registered there. Make sure script is activated (have check mark).
