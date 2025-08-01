let loadedPlugins = [];
const noop = () => {};
console.clear = console.warn = console.error = window.debug = noop;

const splashScreen = document.createElement('splashScreen');

// Objeto para gerenciar o estado das funcionalidades
const features = {
    rgbLogo: false,
    oneko: false,
    autoAnswer: true,
    questionSpoof: true,
    videoSpoof: true,
    showAnswers: false,
    repeatQuestion: false,
    nextRecomendation: false,
    minuteFarmer: false,
    customBanner: false,
    darkMode: true,
    onekoJs: false
};

const featureConfigs = {
    autoAnswerDelay: 1,
    customUsername: "jojao",
    customPfp: ""
};

const user = { username: "jojao", UID: "123456" };
const device = { mobile: false };

class EventEmitter {
    constructor() { this.events = {}; }
    on(t, e) {
        (Array.isArray(t) ? t : [t]).forEach(t => {
            (this.events[t] = this.events[t] || []).push(e);
        });
    }
    off(t, e) {
        (Array.isArray(t) ? t : [t]).forEach(t => {
            this.events[t] && (this.events[t] = this.events[t].filter(h => h !== e));
        });
    }
    emit(t, ...e) {
        this.events[t]?.forEach(h => h(...e));
    }
    once(t, e) {
        const s = (...i) => {
            e(...i);
            this.off(t, s);
        };
        this.on(t, s);
    }
}

const plppdo = new EventEmitter();

new MutationObserver(mutationsList =>
    mutationsList.some(m => m.type === 'childList') && plppdo.emit('domChanged')
).observe(document.body, { childList: true, subtree: true });

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const findAndClickBySelector = selector => document.querySelector(selector)?.click();

function sendToast(text, duration = 5000, gravity = 'bottom') {
    Toastify({
        text,
        duration,
        gravity,
        position: "center",
        stopOnFocus: true,
        style: { background: "linear-gradient(90deg, #ffffff 0%, #a259ff 100%)" }
    }).showToast();
}

async function showSplashScreen() {
    splashScreen.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:linear-gradient(90deg, #6c4b8b 0%, #b89ac4 100%);display:flex;align-items:center;justify-content:center;z-index:9999;opacity:0;transition:opacity 1s;";
    splashScreen.innerHTML = '<span style="color:#fff;font-weight:bold;">KHAN</span><span style="color:#a259ff;font-weight:bold;">VALLE</span>';
    document.body.appendChild(splashScreen);
    setTimeout(() => splashScreen.style.opacity = '1', 10);
}

async function hideSplashScreen() {
    splashScreen.style.opacity = '0';
    setTimeout(() => splashScreen.remove(), 1000);
}

async function loadScript(url, label) {
    const response = await fetch(url);
    const script = await response.text();
    loadedPlugins.push(label);
    eval(script);
}

async function loadCss(url) {
    return new Promise(resolve => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;
        link.onload = resolve;
        document.head.appendChild(link);
    });
}

function playWelcomeAudio() {
    const audio = new Audio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
    audio.volume = 0.5;
    document.addEventListener('click', () => {
        audio.play().catch(e => console.error("Erro ao reproduzir o áudio:", e));
    }, { once: true });
}

let onekoEl;
function initOneko() { if (!onekoEl) return; onekoEl.style.display = 'block'; }
function stopOneko() { if (!onekoEl) return; onekoEl.style.display = 'none'; }

function initRgbLogo() {
    const khanLogo = document.querySelector('svg._1rt6g9t path:nth-last-of-type(2)');
    if (!khanLogo) return;

    if (!document.querySelector('style.RGBLogo')) {
        const styleElement = document.createElement('style');
        styleElement.className = "RGBLogo";
        styleElement.textContent = `
            @keyframes colorShift {
                0% { fill: rgb(255, 0, 0); }
                33% { fill: rgb(0, 255, 0); }
                66% { fill: rgb(0, 0, 255); }
                100% { fill: rgb(255, 0, 0); }
            }
        `;
        document.head.appendChild(styleElement);
    }
    khanLogo.style.animation = 'colorShift 5s infinite';
}

function stopRgbLogo() {
    const khanLogo = document.querySelector('svg._1rt6g9t path:nth-last-of-type(2)');
    if (khanLogo) {
        khanLogo.style.animation = 'none';
    }
}

// --- Novo código StatusPanel.js integrado ---
const statsPanel = document.createElement('div');
Object.assign(statsPanel.style, {
    position: 'fixed', top: '95%', left: '20px', width: '250px', height: '30px',
    backgroundColor: 'rgb(0,0,0,0.2)', color: 'white', fontSize: '13px', fontFamily: 'Arial, sans-serif',
    display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'default', borderRadius: '10px',
    userSelect: 'none', zIndex: '1000', transition: 'transform 0.3s', backdropFilter: 'blur(1.5px)', WebkitBackdropFilter: 'blur(1.5px)'
});

const getPing = async () => {
    if (window.disablePing) return ':( ';
    try {
        const t = performance.now();
        await fetch('https://pt.khanacademy.org/', { method: 'HEAD' });
        return Math.round(performance.now() - t);
    } catch {
        return 'Erro';
    }
};

let lastFrameTime = performance.now(),
    frameCount = 0,
    fps = 0;

(function calcFPS() {
    if (++frameCount && performance.now() - lastFrameTime >= 1000) {
        fps = Math.round(frameCount * 1000 / (performance.now() - lastFrameTime));
        frameCount = 0;
        lastFrameTime = performance.now();
    }
    requestAnimationFrame(calcFPS);
})();

const getTime = () => new Date().toLocaleTimeString();
const updateStats = async () => statsPanel.innerHTML = `
    <span style="text-shadow: -1px 0.5px 0 #540b8a, -2px 0px 0 #3b0962;">KV</span>
    <span style="margin: 0 8px;">|</span><span>${fps}fps</span>
    <span style="margin: 0 8px;">|</span><span>${await getPing()}ms</span>
    <span style="margin: 0 8px;">|</span><span>${getTime()}</span>
`;

updateStats();
document.body.appendChild(statsPanel);
setInterval(updateStats, 1000);

let isDraggingStats = false,
    offsetXStats, offsetYStats;

statsPanel.onmousedown = e => {
    isDraggingStats = true;
    offsetXStats = e.clientX - statsPanel.offsetLeft;
    offsetYStats = e.clientY - statsPanel.offsetTop;
    statsPanel.style.transform = 'scale(0.9)';
};
statsPanel.onmouseup = () => {
    isDraggingStats = false;
    statsPanel.style.transform = 'scale(1)';
};

document.onmousemove = e => {
    if (isDraggingStats) {
        Object.assign(statsPanel.style, {
            left: `${Math.max(0, Math.min(e.clientX - offsetXStats, window.innerWidth - statsPanel.offsetWidth))}px`,
            top: `${Math.max(0, Math.min(e.clientY - offsetYStats, window.innerHeight - statsPanel.offsetHeight))}px`
        });
    }
};
// --- Fim StatusPanel.js ---

// --- Novo código DevTab.js integrado ---
plppdo.on('domChanged', () => {
    if (document.getElementById('khanValleTab')) return;

    function createTab(name, href = '#') {
        const li = document.createElement('li');
        li.innerHTML = `<a class="_8ry3zep" href="${href}" target="_blank"><span class="_xy39ea8">${name}</span></a>`;
        return li;
    }

    const nav = document.querySelector('nav[data-testid="side-nav"]');
    if (!nav) return;

    const section = document.createElement('section');
    section.id = 'khanValleTab';
    section.className = '_1ozlbq6';
    section.innerHTML = '<h2 class="_18undph9">KhanValle</h2>';

    const ul = document.createElement('ul');
    const devTab = createTab('Developer', '#');

    devTab.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        window.khanValleWin = window.open("", "_blank");
        if (window.khanValleWin) {
            window.khanValleWin.document.write(`
                <html>
                <head>
                    <title>KhanValle Developer</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            background: #121212;
                            color: #fff;
                            margin: 0;
                        }
                        .container {
                            width: min(90vw, 600px);
                            height: min(90vh, 600px);
                            padding: 20px;
                            border-radius: 10px;
                            background: #1e1e1e;
                            box-shadow: 0px 0px 15px rgba(0,0,0,0.5);
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                        }
                        h2 {
                            text-align: center;
                            margin-bottom: 10px;
                        }
                        .toggle-container {
                            flex: 1;
                            overflow-y: auto;
                            padding-right: 10px;
                        }
                        .toggle {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding: 10px;
                            border-bottom: 1px solid #333;
                        }
                        .toggle strong { color: #fff; }
                        .toggle small { color: #bbb; }
                        .debug-box {
                            width: 90%;
                            height: 150px;
                            overflow-y: auto;
                            background: #000;
                            color: #ccc;
                            padding: 10px;
                            font-family: monospace;
                            white-space: pre-wrap;
                            border-radius: 5px;
                            border: 1px solid #333;
                            margin: 10px auto;
                        }
                        input[type="checkbox"] {
                            transform: scale(1.2);
                            cursor: pointer;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>Developer Options</h2>
                        <div class="toggle-container" id="toggles"></div>
                        <div class="debug-box" id="debugBox"></div>
                    </div>
                    <script>
                        document.head.appendChild(Object.assign(document.createElement('style'), {
                            innerHTML: "::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: #1e1e1e; } ::-webkit-scrollbar-thumb { background: #444; border-radius: 10px; } ::-webkit-scrollbar-thumb:hover { background: #666; }"
                        }));
                    </script>
                </body>
                </html>
            `);
        }
        createToggle('Debug Mode', 'Enables debugging logs', 'debugMode', window.debugMode || false);
        createToggle('Disable Security', 'Enables Right click and Ctrl + Shift + I again', 'disableSecurity', window.disableSecurity || false);
        createToggle('Disable Ping Request', 'Disables the request triggered every 1 second to find out the ping in ms', 'disablePing', window.disablePing || false);
    });

    ul.appendChild(devTab);
    section.appendChild(ul);
    nav.appendChild(section);
});

window.createToggle = function(name, desc, varName, toggled = false) {
    if (!window.khanValleWin || window.khanValleWin.closed) return;

    const toggleContainer = window.khanValleWin.document.getElementById('toggles');
    if (!toggleContainer) return;

    const toggleId = `toggle-${varName}`;

    const toggleElement = document.createElement('div');
    toggleElement.className = 'toggle';
    toggleElement.innerHTML = `
        <div>
            <strong>${name}</strong><br>
            <small>${desc}</small>
        </div>
        <input type="checkbox" id="${toggleId}" ${toggled ? "checked" : ""}>
    `;

    toggleElement.querySelector('input').addEventListener('change', (e) => {
        window[varName] = e.target.checked;
        debug(`❕${name} set to ${window[varName]}`);
    });

    toggleContainer.appendChild(toggleElement);
};
window.debug = function(message) {
    if (!window.khanValleWin || window.khanValleWin.closed || !window.debugMode) return;
    
    const debugBox = window.khanValleWin.document.getElementById('debugBox');
    if (debugBox) {
        debugBox.innerHTML += message + '\n';
        debugBox.scrollTop = debugBox.scrollHeight;
    }
};
window.onerror = function(message, source, lineno, colno, error) { debug(`🚨 Error @ ${source}:${lineno},${colno} \n${error ? error.stack : message}`); return true; };
// --- Fim DevTab.js ---

// --- Novo código MainMenu.js integrado ---
const watermark = document.createElement('div');
const dropdownMenu = document.createElement('div');

function setFeatureByPath(path, value) {
    let obj = window;
    const parts = path.split('.');
    while (parts.length > 1) obj = obj[parts.shift()];
    obj[parts[0]] = value;
}

function addFeature(features) {
    const feature = document.createElement('feature');
    features.forEach(attribute => {
        let element = attribute.type === 'nonInput' ? document.createElement('label') : document.createElement('input');
        if (attribute.type === 'nonInput') element.innerHTML = attribute.name;
        else { element.type = attribute.type; element.id = attribute.name; }

        if (attribute.attributes) {
            attribute.attributes.split(' ').map(attr => attr.split('=')).forEach(([key, value]) => {
                value = value ? value.replace(/"/g, '') : '';
                key === 'style' ? element.style.cssText = value : element.setAttribute(key, value);
            });
        }

        if (attribute.variable) element.setAttribute('setting-data', attribute.variable);
        if (attribute.dependent) element.setAttribute('dependent', attribute.dependent);
        if (attribute.className) element.classList.add(attribute.className);

        if (attribute.labeled) {
            const label = document.createElement('label');
            if (attribute.className) label.classList.add(attribute.className);
            if (attribute.attributes) {
                attribute.attributes.split(' ').map(attr => attr.split('=')).forEach(([key, value]) => {
                    value = value ? value.replace(/"/g, '') : '';
                    key === 'style' ? label.style.cssText = value : label.setAttribute(key, value);
                });
            }
            label.innerHTML = `${element.outerHTML} ${attribute.label}`;
            feature.appendChild(label);
        } else {
            feature.appendChild(element);
        }
    });
    dropdownMenu.innerHTML += feature.outerHTML;
}

function handleInput(ids, callback = null) {
    (Array.isArray(ids) ? ids.map(id => document.getElementById(id)) : [document.getElementById(ids)])
    .forEach(element => {
        if (!element) return;
        const setting = element.getAttribute('setting-data'),
            dependent = element.getAttribute('dependent'),
            handleEvent = (e, value) => {
                setFeatureByPath(setting, value);
                if (callback) callback(value, e);
            };

        if (element.type === 'checkbox') {
            element.addEventListener('change', (e) => {
                // playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/5os0bypi.wav'); // Áudio comentado para não sobrecarregar
                handleEvent(e, e.target.checked);
                if (dependent) dependent.split(',').forEach(dep =>
                    document.querySelectorAll(`.${dep}`).forEach(depEl =>
                        depEl.style.display = e.target.checked ? null : "none"));
                plppdo.emit('domChanged');
            });
        } else {
            element.addEventListener('input', (e) => handleEvent(e, e.target.value));
        }
    });
}

/* Watermark */
Object.assign(watermark.style, {
    position: 'fixed', top: '0', left: '85%', width: '150px', height: '30px', backgroundColor: 'RGB(0,0,0,0.5)',
    color: 'white', fontSize: '15px', fontFamily: 'MuseoSans, sans-serif', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    cursor: 'default', userSelect: 'none', padding: '0 10px',  borderRadius: '10px', zIndex: '1001', transition: 'transform 0.3s ease'
});

if (device.mobile) watermark.style.left = '55%';

watermark.innerHTML = `<span style="text-shadow: -1px 0.5px 0 #540b8a, -2px 0px 0 #3b0962;">KV</span> <span style="color:gray; padding-left:2px; font-family: Arial, sans-serif; font-size:10px">v1.0</span>`;

document.body.appendChild(watermark);

let isDraggingWatermark = false, offsetXWatermark, offsetYWatermark;

watermark.addEventListener('mousedown', e => {
    if (!dropdownMenu.contains(e.target)) {
        isDraggingWatermark = true;
        offsetXWatermark = e.clientX - watermark.offsetLeft;
        offsetYWatermark = e.clientY - watermark.offsetTop;
        watermark.style.transform = 'scale(0.9)';
    }
});
watermark.addEventListener('mouseup', () => { isDraggingWatermark = false; watermark.style.transform = 'scale(1)'; });

document.addEventListener('mousemove', e => {
    if (isDraggingWatermark) {
        let newX = Math.max(0, Math.min(e.clientX - offsetXWatermark, window.innerWidth - watermark.offsetWidth));
        let newY = Math.max(0, Math.min(e.clientY - offsetYWatermark, window.innerHeight - watermark.offsetHeight));
        Object.assign(watermark.style, { left: `${newX}px`, top: `${newY}px` });
        dropdownMenu.style.display = 'none';
    }
});

/* Dropdown */
Object.assign(dropdownMenu.style, {
    position: 'absolute', top: '100%', left: '0', width: '160px', backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '10px', color: 'white', fontSize: '13px', fontFamily: 'Monospace, sans-serif',
    display: 'none', flexDirection: 'column', zIndex: '1000', padding: '5px', cursor: 'default',
    userSelect: 'none', transition: 'transform 0.3s ease', backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)'
});

dropdownMenu.innerHTML = `
    <style>
        input[type="checkbox"] {appearance: none; width: 15px; height: 15px; background-color: #3a3a3b;
        border: 1px solid #acacac; border-radius: 3px; margin-right: 5px; cursor: pointer;}
        input[type="checkbox"]:checked {background-color: #540b8a; border-color: #720fb8;}
        input[type="text"], input[type="number"], input[type="range"] {width: calc(100% - 10px); border: 1px solid #343434;
        color: white; accent-color: #540b8a; background-color: #540b8a; padding: 3px; border-radius: 3px; background: none;}
        label {display: flex; align-items: center; color: #3a3a3b; padding-top: 3px;}
    </style>
`;

watermark.appendChild(dropdownMenu);

let featuresList = [
    { name: 'questionSpoof', type: 'checkbox', variable: 'features.questionSpoof', attributes: 'checked', labeled: true, label: 'Question Spoof' },
    { name: 'videoSpoof', type: 'checkbox', variable: 'features.videoSpoof', attributes: 'checked', labeled: true, label: 'Video Spoof' },
    { name: 'showAnswers', type: 'checkbox', variable: 'features.showAnswers', labeled: true, label: 'Answer Revealer' },
    { name: 'autoAnswer', type: 'checkbox', variable: 'features.autoAnswer', dependent: 'autoAnswerDelay,nextRecomendation,repeatQues
