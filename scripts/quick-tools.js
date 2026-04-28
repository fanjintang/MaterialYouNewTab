/*
 * Material You NewTab
 * Copyright (c) 2023-2025 XengShi
 * Licensed under the GNU General Public License v3.0 (GPL-3.0)
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 */

// Quick Tools Panel - Calculator, Translator, QR Code, Unit Converter, Screenshot, Screen Recorder
document.addEventListener('DOMContentLoaded', function () {
    const TOOLS_ENABLED_KEY = 'quickToolsEnabled';
    
    let toolsEnabled = localStorage.getItem(TOOLS_ENABLED_KEY) !== 'false';
    
    init();
    
    function init() {
        if (toolsEnabled) {
            createToolsIcon();
            createToolsPanel();
            bindEvents();
        }
        createSettingsUI();
    }
    
    function createToolsIcon() {
        if (document.getElementById('quickToolsCont')) return;
        
        const toolsCont = document.createElement('div');
        toolsCont.id = 'quickToolsCont';
        toolsCont.className = 'quick-tools-cont';
        toolsCont.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="dot-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                <rect x="9" y="9" width="6" height="6"></rect>
                <line x1="9" y1="1" x2="9" y2="4"></line>
                <line x1="15" y1="1" x2="15" y2="4"></line>
                <line x1="9" y1="20" x2="9" y2="23"></line>
                <line x1="15" y1="20" x2="15" y2="23"></line>
                <line x1="20" y1="9" x2="23" y2="9"></line>
                <line x1="20" y1="14" x2="23" y2="14"></line>
                <line x1="1" y1="9" x2="4" y2="9"></line>
                <line x1="1" y1="14" x2="4" y2="14"></line>
            </svg>
            <span class="tooltip-text" id="quickToolsHover">Tools</span>
        `;
        
        // Insert at appropriate position
        const aiCont = document.getElementById('aiAssistantCont');
        if (aiCont) {
            aiCont.insertAdjacentElement('afterend', toolsCont);
        } else {
            document.body.appendChild(toolsCont);
        }
    }
    
    function createToolsPanel() {
        if (document.getElementById('quickToolsPanel')) return;
        
        const panel = document.createElement('div');
        panel.id = 'quickToolsPanel';
        panel.className = 'quick-tools-panel';
        panel.style.display = 'none';
        panel.innerHTML = `
            <div class="quick-tools-header">
                <h3 id="quickToolsHeading">Quick Tools</h3>
            </div>
            <div class="quick-tools-grid">
                <button class="tool-btn" data-tool="calculator">
                    <span class="tool-icon">🧮</span>
                    <span class="tool-name">Calculator</span>
                </button>
                <button class="tool-btn" data-tool="translator">
                    <span class="tool-icon">🌐</span>
                    <span class="tool-name">Translate</span>
                </button>
                <button class="tool-btn" data-tool="qrcode">
                    <span class="tool-icon">📱</span>
                    <span class="tool-name">QR Code</span>
                </button>
                <button class="tool-btn" data-tool="converter">
                    <span class="tool-icon">⚖️</span>
                    <span class="tool-name">Converter</span>
                </button>
                <button class="tool-btn" data-tool="screenshot">
                    <span class="tool-icon">📸</span>
                    <span class="tool-name">Screenshot</span>
                </button>
                <button class="tool-btn" data-tool="recorder">
                    <span class="tool-icon">🎥</span>
                    <span class="tool-name">Recorder</span>
                </button>
            </div>
        `;
        
        document.body.appendChild(panel);
        createToolModals();
    }
    
    function createToolModals() {
        // Calculator Modal
        const calcModal = document.createElement('div');
        calcModal.id = 'calculatorModal';
        calcModal.className = 'tool-modal';
        calcModal.style.display = 'none';
        calcModal.innerHTML = `
            <div class="tool-modal-content">
                <div class="tool-modal-header">
                    <h3>Calculator</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="calculator">
                    <div class="calc-display">0</div>
                    <div class="calc-buttons">
                        <button class="calc-btn clear">C</button>
                        <button class="calc-btn operator">/</button>
                        <button class="calc-btn operator">*</button>
                        <button class="calc-btn delete">&larr;</button>
                        <button class="calc-btn">7</button>
                        <button class="calc-btn">8</button>
                        <button class="calc-btn">9</button>
                        <button class="calc-btn operator">-</button>
                        <button class="calc-btn">4</button>
                        <button class="calc-btn">5</button>
                        <button class="calc-btn">6</button>
                        <button class="calc-btn operator">+</button>
                        <button class="calc-btn">1</button>
                        <button class="calc-btn">2</button>
                        <button class="calc-btn">3</button>
                        <button class="calc-btn equals" rowspan="2">=</button>
                        <button class="calc-btn zero">0</button>
                        <button class="calc-btn">.</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(calcModal);
        
        // Translator Modal
        const transModal = document.createElement('div');
        transModal.id = 'translatorModal';
        transModal.className = 'tool-modal';
        transModal.style.display = 'none';
        transModal.innerHTML = `
            <div class="tool-modal-content">
                <div class="tool-modal-header">
                    <h3>Translator</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="translator">
                    <div class="trans-lang-select">
                        <select id="transFrom">
                            <option value="auto">Auto Detect</option>
                            <option value="zh">Chinese</option>
                            <option value="en">English</option>
                            <option value="ja">Japanese</option>
                            <option value="ko">Korean</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="es">Spanish</option>
                            <option value="ru">Russian</option>
                        </select>
                        <button id="transSwap">⇄</button>
                        <select id="transTo">
                            <option value="en">English</option>
                            <option value="zh">Chinese</option>
                            <option value="ja">Japanese</option>
                            <option value="ko">Korean</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="es">Spanish</option>
                            <option value="ru">Russian</option>
                        </select>
                    </div>
                    <textarea id="transInput" placeholder="Enter text to translate..."></textarea>
                    <button id="transBtn" class="tool-action-btn">Translate</button>
                    <div id="transOutput" class="trans-output"></div>
                </div>
            </div>
        `;
        document.body.appendChild(transModal);
        
        // QR Code Modal
        const qrModal = document.createElement('div');
        qrModal.id = 'qrcodeModal';
        qrModal.className = 'tool-modal';
        qrModal.style.display = 'none';
        qrModal.innerHTML = `
            <div class="tool-modal-content">
                <div class="tool-modal-header">
                    <h3>QR Code Generator</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="qrcode-generator">
                    <input type="text" id="qrInput" placeholder="Enter text or URL...">
                    <button id="qrGenerateBtn" class="tool-action-btn">Generate</button>
                    <div id="qrOutput" class="qr-output"></div>
                    <button id="qrDownloadBtn" class="tool-action-btn secondary" style="display:none;">Download</button>
                </div>
            </div>
        `;
        document.body.appendChild(qrModal);
        
        // Unit Converter Modal
        const convModal = document.createElement('div');
        convModal.id = 'converterModal';
        convModal.className = 'tool-modal';
        convModal.style.display = 'none';
        convModal.innerHTML = `
            <div class="tool-modal-content">
                <div class="tool-modal-header">
                    <h3>Unit Converter</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="unit-converter">
                    <div class="conv-type-tabs">
                        <button class="conv-tab active" data-type="length">Length</button>
                        <button class="conv-tab" data-type="weight">Weight</button>
                        <button class="conv-tab" data-type="temperature">Temp</button>
                        <button class="conv-tab" data-type="area">Area</button>
                        <button class="conv-tab" data-type="volume">Volume</button>
                    </div>
                    <div class="conv-inputs">
                        <div class="conv-group">
                            <input type="number" id="convFromValue" value="1">
                            <select id="convFromUnit"></select>
                        </div>
                        <div class="conv-equals">=</div>
                        <div class="conv-group">
                            <input type="number" id="convToValue" readonly>
                            <select id="convToUnit"></select>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(convModal);
        
        initCalculator();
        initTranslator();
        initQRCode();
        initConverter();
    }
    
    function initCalculator() {
        const modal = document.getElementById('calculatorModal');
        const display = modal.querySelector('.calc-display');
        let currentValue = '0';
        let previousValue = '';
        let operator = '';
        let shouldResetDisplay = false;
        
        modal.querySelectorAll('.calc-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const value = btn.textContent;
                
                if (value === 'C') {
                    currentValue = '0';
                    previousValue = '';
                    operator = '';
                } else if (value === '←') {
                    currentValue = currentValue.slice(0, -1) || '0';
                } else if (['+', '-', '*', '/'].includes(value)) {
                    previousValue = currentValue;
                    operator = value;
                    shouldResetDisplay = true;
                } else if (value === '=') {
                    if (previousValue && operator) {
                        currentValue = String(eval(previousValue + operator + currentValue));
                        previousValue = '';
                        operator = '';
                    }
                } else {
                    if (currentValue === '0' || shouldResetDisplay) {
                        currentValue = value;
                        shouldResetDisplay = false;
                    } else {
                        currentValue += value;
                    }
                }
                
                display.textContent = currentValue;
            });
        });
    }
    
    function initTranslator() {
        const modal = document.getElementById('translatorModal');
        const input = modal.querySelector('#transInput');
        const output = modal.querySelector('#transOutput');
        const btn = modal.querySelector('#transBtn');
        const swapBtn = modal.querySelector('#transSwap');
        const fromSelect = modal.querySelector('#transFrom');
        const toSelect = modal.querySelector('#transTo');
        
        btn.addEventListener('click', async () => {
            const text = input.value.trim();
            if (!text) return;
            
            const from = fromSelect.value;
            const to = toSelect.value;
            
            output.innerHTML = '<div class="loading">Translating...</div>';
            
            try {
                // Use Google Translate API via mymemory
                const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`);
                const data = await response.json();
                output.textContent = data.responseData.translatedText;
            } catch (e) {
                output.innerHTML = '<div class="error">Translation failed. Please try again.</div>';
            }
        });
        
        swapBtn.addEventListener('click', () => {
            const temp = fromSelect.value;
            fromSelect.value = toSelect.value;
            toSelect.value = temp;
        });
    }
    
    function initQRCode() {
        const modal = document.getElementById('qrcodeModal');
        const input = modal.querySelector('#qrInput');
        const generateBtn = modal.querySelector('#qrGenerateBtn');
        const output = modal.querySelector('#qrOutput');
        const downloadBtn = modal.querySelector('#qrDownloadBtn');
        
        generateBtn.addEventListener('click', () => {
            const text = input.value.trim();
            if (!text) return;
            
            // Use QRCode.js library or API
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
            output.innerHTML = `<img src="${qrUrl}" alt="QR Code">`;
            downloadBtn.style.display = 'block';
            
            downloadBtn.onclick = () => {
                const link = document.createElement('a');
                link.href = qrUrl;
                link.download = 'qrcode.png';
                link.click();
            };
        });
    }
    
    function initConverter() {
        const modal = document.getElementById('converterModal');
        const tabs = modal.querySelectorAll('.conv-tab');
        const fromValue = modal.querySelector('#convFromValue');
        const toValue = modal.querySelector('#convToValue');
        const fromUnit = modal.querySelector('#convFromUnit');
        const toUnit = modal.querySelector('#convToUnit');
        
        const units = {
            length: {
                m: 1, km: 1000, cm: 0.01, mm: 0.001, 
                mi: 1609.34, yd: 0.9144, ft: 0.3048, in: 0.0254
            },
            weight: {
                kg: 1, g: 0.001, mg: 0.000001, 
                lb: 0.453592, oz: 0.0283495, t: 1000
            },
            temperature: {
                C: 'celsius', F: 'fahrenheit', K: 'kelvin'
            },
            area: {
                m2: 1, km2: 1000000, cm2: 0.0001, 
                ha: 10000, acre: 4046.86, ft2: 0.092903
            },
            volume: {
                l: 1, ml: 0.001, m3: 1000, 
                gal: 3.78541, qt: 0.946353, pt: 0.473176
            }
        };
        
        let currentType = 'length';
        
        function updateUnitOptions() {
            const unitList = units[currentType];
            const options = Object.keys(unitList).map(u => `<option value="${u}">${u}</option>`).join('');
            fromUnit.innerHTML = options;
            toUnit.innerHTML = options;
            toUnit.selectedIndex = 1;
            convert();
        }
        
        function convert() {
            const value = parseFloat(fromValue.value);
            if (isNaN(value)) {
                toValue.value = '';
                return;
            }
            
            const from = fromUnit.value;
            const to = toUnit.value;
            let result;
            
            if (currentType === 'temperature') {
                // Temperature conversion
                let celsius;
                if (from === 'C') celsius = value;
                else if (from === 'F') celsius = (value - 32) * 5/9;
                else if (from === 'K') celsius = value - 273.15;
                
                if (to === 'C') result = celsius;
                else if (to === 'F') result = celsius * 9/5 + 32;
                else if (to === 'K') result = celsius + 273.15;
            } else {
                // Other conversions
                const fromFactor = units[currentType][from];
                const toFactor = units[currentType][to];
                result = value * fromFactor / toFactor;
            }
            
            toValue.value = result.toFixed(4).replace(/\.?0+$/, '');
        }
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentType = tab.dataset.type;
                updateUnitOptions();
            });
        });
        
        fromValue.addEventListener('input', convert);
        fromUnit.addEventListener('change', convert);
        toUnit.addEventListener('change', convert);
        
        updateUnitOptions();
    }
    
    function bindEvents() {
        // Toggle panel
        const toolsCont = document.getElementById('quickToolsCont');
        const toolsPanel = document.getElementById('quickToolsPanel');
        
        if (toolsCont && toolsPanel) {
            toolsCont.addEventListener('click', () => {
                const isVisible = toolsPanel.style.display === 'block';
                toolsPanel.style.display = isVisible ? 'none' : 'block';
                toolsCont.classList.toggle('active', !isVisible);
            });
        }
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!toolsCont?.contains(e.target) && !toolsPanel?.contains(e.target)) {
                toolsPanel.style.display = 'none';
                toolsCont?.classList.remove('active');
            }
        });
        
        // Tool buttons
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tool = btn.dataset.tool;
                if (tool === 'screenshot') {
                    // Open browser screenshot tool
                    alert('Press Cmd+Shift+4 (Mac) or Win+Shift+S (Windows) for screenshot');
                } else if (tool === 'recorder') {
                    // Open screen recorder
                    startScreenRecorder();
                } else {
                    const modal = document.getElementById(tool + 'Modal');
                    if (modal) {
                        modal.style.display = 'flex';
                        setTimeout(() => modal.classList.add('visible'), 10);
                    }
                }
                toolsPanel.style.display = 'none';
                toolsCont?.classList.remove('active');
            });
        });
        
        // Close modals
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.tool-modal');
                modal.classList.remove('visible');
                setTimeout(() => modal.style.display = 'none', 300);
            });
        });
        
        document.querySelectorAll('.tool-modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('visible');
                    setTimeout(() => modal.style.display = 'none', 300);
                }
            });
        });
    }
    
    async function startScreenRecorder() {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: { mediaSource: 'screen' }
            });
            
            const mediaRecorder = new MediaRecorder(stream);
            const chunks = [];
            
            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };
            
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'screen-recording.webm';
                a.click();
                URL.revokeObjectURL(url);
            };
            
            mediaRecorder.start();
            showShortcutToast('Recording started. Click stop sharing to save.');
            
        } catch (err) {
            console.error('Screen recording failed:', err);
        }
    }
    
    function createSettingsUI() {
        // Add to settings panel
        const settingsSection = document.querySelector('.sectionInner');
        if (!settingsSection || document.getElementById('quickToolsSettings')) return;
        
        const html = `
            <div class="ttcont" id="quickToolsSettings">
                <div class="texts">
                    <div class="bigText" id="quickToolsTitle">Quick Tools</div>
                    <div class="infoText" id="quickToolsInfo">Enable quick tools panel (calculator, translator, etc.)</div>
                </div>
                <label class="switch">
                    <input id="quickToolsCheckbox" type="checkbox" ${toolsEnabled ? 'checked' : ''}>
                    <span class="toggle"></span>
                </label>
            </div>
        `;
        
        const target = settingsSection.querySelector('.ttcont:last-child');
        if (target) {
            target.insertAdjacentHTML('afterend', html);
        }
        
        document.getElementById('quickToolsCheckbox')?.addEventListener('change', (e) => {
            toolsEnabled = e.target.checked;
            localStorage.setItem(TOOLS_ENABLED_KEY, toolsEnabled);
            showShortcutToast(toolsEnabled ? 'Quick Tools enabled. Refresh to see changes.' : 'Quick Tools disabled. Refresh to see changes.');
        });
    }
    
    function showShortcutToast(message) {
        let toast = document.getElementById('shortcutToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'shortcutToast';
            toast.className = 'shortcut-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }
    
    // Expose API
    window.quickTools = {
        toggle: () => {
            toolsEnabled = !toolsEnabled;
            localStorage.setItem(TOOLS_ENABLED_KEY, toolsEnabled);
            location.reload();
        }
    };
});
