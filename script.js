//1 3 2 3 - 1 2 3 1 3 2 3 - 1 2 3 1 3 2 3 - 1 2 3 1 3 2 3 - 1 2 3
//4+3 3 7+3 3

const boxHolder = document.getElementById("boxes");
const input = document.getElementById("input");
const submit = document.getElementById("submit");
const pause = document.getElementById("stop");
const bpmLabel = document.getElementById("label");
const bpm = document.getElementById("bpm");
const boxes = document.querySelectorAll(".box");

const sounds = ["boom", "clap", "hihat", "kick", "openhat", "ride", "snare", "tink", "tom"];
const audio = [];

var currentAudio, disableKeys, forceStop;

function init() {
    console.log("init");

    bpmLabel.textContent = bpm.value + "bpm";

    bpm.addEventListener("input", (e) => {
        bpmLabel.textContent = e.target.value + "bpm";
    });

    submit.addEventListener("click", () => {
        sub();
    });

    input.addEventListener("focusin", () => {
        disableKeys = true;
    });

    input.addEventListener("focusout", () => {
        disableKeys = false;
    });

    pause.addEventListener("click", () => {
        forceStop = true;

        stopAll();
    });

    window.onkeyup = keyClick;
}

init();

function loadSounds() {
    for(let i = 0; i < sounds.length; i++) {
        let sound = sounds[i];
        let box = boxes[i];
        
        let a = new Audio("./sounds/" + sound + ".wav");

        audio.push(a);

        let p1 = document.createElement("p");
        p1.textContent = "Key: " + (i + 1);

        let p2 = document.createElement("p");
        p2.class = "sound";
        p2.textContent = sound;

        box.onclick = () => {
            playSound(i);
        }

        box.appendChild(p1);
        box.appendChild(p2);
    };
}

loadSounds();

//keyCode 49 = 1, keyCode 57 = 9

function keyClick(e) {
    if(disableKeys) {
        return;
    }

    let code = e.keyCode;

    if(code >= 49 && code <= 57) {
        playSound(code - 49);
    }
}

function playSound(i) {
    playAudio(audio[i]);
}

function playAudio(audio) {
    audio.currentAudioTime = 0;
    audio.load();
    audio.play();
}

function stopAll() {
    for(let i = 0; i < audio.length; i++) {
        audio[i].pause();
        audio[i].currentAudioTime = 0;
    };
}

async function sub() {
    stopAll();

    forceStop = false;

    let values = input.value.split(" ");

    let loop = document.getElementById("loop-forever");
    let loops = 1;    

    while(loop.checked || loops == 1) {
        if(forceStop) {
            break;
        }

        for(let i = 0; i < values.length; i++) {
            if(forceStop) {
                break;
            }

            let value = values[i];

            if(value != "-") {
                if(value.includes("+")) {
                    let vvalues = value.split("+");

                    for(let j = 0; j < vvalues.length; j++) {
                        playSound(vvalues[j] - 1);
                    }
                } else {
                    playSound(values[i] - 1);
                }
            }

            if(forceStop) {
                break;
            }

            let timeToSleep = 1000 * (60 / bpm.value) / 2;

            loops--;

            await sleep(timeToSleep);
        }
    }

    forceStop = false;
}

async function wait(ms) {
    await sleep(ms);
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}