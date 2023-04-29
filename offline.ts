const _testMode = false;
let _isOnline = false;
let _timeOffline = 0;

function setBackgroundColor(color: string) {
    document.body.style.background = color;
}

function setOnline(online: boolean) {
    _isOnline = online;
    const $onlineDiv = document.querySelector("#online");
    const $offlineDiv = document.querySelector("#offline");
    if ($onlineDiv && $offlineDiv) {
        if (online) {
            $onlineDiv.classList.remove("hidden");
            $offlineDiv.classList.add("hidden");
            setBackgroundColor("#708090");
            _timeOffline = 0;
        } else {
            $onlineDiv.classList.add("hidden");
            $offlineDiv.classList.remove("hidden");
            setBackgroundColor("#2E8B57");
            updateTimeSpan();
        }
    } else {
        throw new Error("Could not find parts of the page");
    }
}

function formatTime(totalSeconds: number): string {
    let comps = {
        seconds: totalSeconds % 60,
        minutes: (totalSeconds / 60) % 60,
        hours: (totalSeconds / 60 / 60) % 24,
        days: totalSeconds / 60 / 60 / 24,
    };

    let output: string = "";
    let show: boolean = false;
    for (const [unit, value] of Object.entries(comps).reverse()) {
        const floored = Math.floor(value);
        if (!show && floored === 0 && unit !== "seconds") {
            continue;
        }
        show = true;
        let formattedUnit = unit;
        if (floored === 1) {
            formattedUnit =
                formattedUnit.slice(0, formattedUnit.length - 1) + " ";
        }
        const pad = floored < 10 ? "" : " ";
        output += ` ${pad}${floored} ${formattedUnit}`;
    }
    return output;
}

function updateTimeSpan() {
    const $timeSpan = document.querySelector("#offline h2 span");
    $timeSpan!.innerHTML = formatTime(_timeOffline);
}

function onFlipButtonPressed() {
    setOnline(!_isOnline);
}

function linkTestButton() {
    const $flip = document.querySelector("#flipButton");
    if (!$flip || !_testMode) {
        return;
    }
    $flip.classList.remove("hidden");
    $flip.addEventListener("click", onFlipButtonPressed);
}

function initApp() {
    linkTestButton();
    setOnline(true);

    // when clicking in the app, make it update faster
    document.body.addEventListener("click", pollNetwork);

    setInterval(poll, 1_000);
    setInterval(pollNetwork, 10_000);
}

function poll() {
    if (_isOnline) {
        _timeOffline = 0;
    } else {
        _timeOffline++;
        updateTimeSpan();
    }
}

async function pollNetwork() {
    try {
        await Promise.race([
            fetch("https://www.google.com/", {
                method: "HEAD",
                mode: "no-cors",
            }),
            new Promise((_, reject) =>
                setTimeout(() => reject("Timed out"), 5000)
            ),
        ]);
        setOnline(true);
    } catch (error) {
        setOnline(false);
    }
}

document.addEventListener("DOMContentLoaded", initApp);
