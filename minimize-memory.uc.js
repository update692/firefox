// ==UserScript==
// @name            Minimize Memory Usage
// @include         main
// ==/UserScript==


(function () {
    console.log(">>>>: Minimize memory usage: START");

    const threshold = 1000;      // script is activated only when (megabytes) or more RAM are used
    const minz_limit = 500;      // minimize memory when relative RAM consumption exceeds (megabytes)
    const poll_interval = 30000; // check RAM consumption value every (milliseconds)
    const poll_number = 3;       // how many RAM values to aggregate for decision
    const debug_notify = true;   // show notification when memory is cleared
    const notify_time = 1000;    // keep notification for (milliseconds)
    const debug_beep = true;     // sound beep when memory is cleared
    const beep_time = 0.1;       // beep duration (seconds)

    const STAT_NONE = 0;
    const STAT_HIGH = 1;
    const STAT_LOW = 2;

    const Mgr = Cc["@mozilla.org/memory-reporter-manager;1"].getService(Ci.nsIMemoryReporterManager);
    const urlbar = document.querySelector('#urlbar-background');

    async function doMMU() {
        if (debug_notify) doNotify();
        if (debug_beep) doBeep();
        Services.obs.notifyObservers(null, "child-mmu-request");
        Mgr.minimizeMemoryUsage(() => {
            console.log(">>>>: Memory minimization completed" + ` (${new Date().toISOString()})`);
            update_level = true;
        });
    }

    async function doBeep() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        // Set the gain (volume)
        gainNode.gain.value = 0.5;
        // Connect the oscillator to the gain node, and the gain node to the audio context's destination (the speakers)
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        // Set the oscillator to a sine wave
        oscillator.type = 'sine';
        // Set the frequency of the beep
        oscillator.frequency.value = 440; // A4 note
        // Start the oscillator
        oscillator.start();
        // Stop the oscillator after 1 second
        oscillator.stop(audioContext.currentTime + beep_time);
    }

    async function doNotify() {
        if (typeof doNotify.def_color == 'undefined') doNotify.def_color = urlbar.style.backgroundColor;
        urlbar.style.backgroundColor = "red";
        setTimeout(() => {
            urlbar.style.backgroundColor = doNotify.def_color;
        }, notify_time);
    }

    async function getRAM() {
        var info = await ChromeUtils.requestProcInfo();
        var bytes = info.memory;
        for (let child of info.children) bytes += child.memory;
        return Math.round(bytes / 1048576);
    }

    function checkStat(buffer, current, limit) {
        const values = buffer.getValues();
        var ret = STAT_NONE;
        if (values.every(value => value >= current + limit))
            ret = STAT_HIGH;
        else if (values.every(value => value < current))
            ret = STAT_LOW;
        return ret;
    }

    class CircularBuffer {
        constructor(size) {
            this.size = size;
            this.buffer = new Array(size);
            this.clear();
        }

        clear() {
            this.count = 0;
            this.index = 0;
        }

        add(value) {
            if (this.count < this.size) {
                this.buffer[this.count] = value;
                this.count++;
            } else {
                this.buffer[this.index] = value;
                this.index = (this.index + 1) % this.size;
            }
        }

        getValues() {
            let values = [];
            for (let i = 0; i < this.count; i++) {
                values.push(this.buffer[(this.index + i) % this.size]);
            }
            return values;
        }

        isFull() {
            return this.count >= this.size;
        }
    }

    const statbuf = new CircularBuffer(poll_number);
    var current_level = threshold;
    var update_level = false;
    var lower_level = threshold; // base for tracking lower memory minimize

    function doReset() {
        current_level = threshold;
        update_level = false;
        lower_level = threshold;
        statbuf.clear();
    }

    setInterval(async () => {
        var megabytes = await getRAM();
        if (update_level) {
            update_level = false;
            current_level = megabytes;
            lower_level = megabytes;
        }
        console.log(`>>>>: ${megabytes} MB, level: ${current_level}, level-down: ${lower_level}, threshold: ${threshold}, limit: ${minz_limit}`);

        if (megabytes >= threshold) {
            statbuf.add(megabytes);
            if (statbuf.isFull()) {
                let result = checkStat(statbuf, current_level, minz_limit);
                if (result === STAT_HIGH) {
                    console.log(">>>>: high>>");
                    doMMU();
                } else if (result === STAT_LOW) {
                    console.log(">>>>: low<<");
                    current_level = megabytes;
                    if (current_level <= lower_level - Math.round(minz_limit / 2)) {
                        doMMU();
                    }
                } else {
                    console.log(">>>>: none");
                }
            } else {
                console.log(">>>>: filling");
            }
        } else {
            console.log(">>>>: reset");
            doReset();
        }
    }, poll_interval);
})();
