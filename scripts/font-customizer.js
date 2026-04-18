/*
 * Material You NewTab
 * Copyright (c) 2023-2025 XengShi
 * Licensed under the GNU General Public License v3.0 (GPL-3.0)
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 */

// Font Customizer - Change page fonts
document.addEventListener('DOMContentLoaded', function () {
    // Storage keys
    const FONT_FAMILY_KEY = 'customFontFamily';
    const FONT_SIZE_KEY = 'customFontSize';
    const FONT_WEIGHT_KEY = 'customFontWeight';

    // Available fonts (Google Fonts + system fonts)
    const availableFonts = [
        { name: 'Default', value: 'Poppins, sans-serif', category: 'default' },
        { name: 'Poppins', value: 'Poppins, sans-serif', category: 'sans' },
        { name: 'Roboto', value: 'Roboto, sans-serif', category: 'sans', google: true },
        { name: 'Open Sans', value: 'Open Sans, sans-serif', category: 'sans', google: true },
        { name: 'Noto Sans SC', value: 'Noto Sans SC, sans-serif', category: 'sans', google: true },
        { name: 'Inter', value: 'Inter, sans-serif', category: 'sans', google: true },
        { name: 'Nunito', value: 'Nunito, sans-serif', category: 'sans', google: true },
        { name: 'Lato', value: 'Lato, sans-serif', category: 'sans', google: true },
        { name: 'Montserrat', value: 'Montserrat, sans-serif', category: 'sans', google: true },
        { name: 'Merriweather', value: 'Merriweather, serif', category: 'serif', google: true },
        { name: 'Playfair Display', value: 'Playfair Display, serif', category: 'serif', google: true },
        { name: 'JetBrains Mono', value: 'JetBrains Mono, monospace', category: 'mono', google: true },
        { name: 'Fira Code', value: 'Fira Code, monospace', category: 'mono', google: true },
        { name: 'System UI', value: 'system-ui, -apple-system, sans-serif', category: 'system' },
        { name: 'Arial', value: 'Arial, sans-serif', category: 'system' },
        { name: 'Georgia', value: 'Georgia, serif', category: 'system' }
    ];

    // Default settings
    const defaults = {
        fontFamily: 'Poppins, sans-serif',
        fontSize: 100, // percentage
        fontWeight: 400
    };

    // Current settings
    let settings = { ...defaults };

    // Initialize
    init();

    function init() {
        loadSettings();
        loadGoogleFonts();
        createFontSettingsUI();
        applySettings();
    }

    // Load settings from localStorage
    function loadSettings() {
        settings.fontFamily = localStorage.getItem(FONT_FAMILY_KEY) || defaults.fontFamily;
        settings.fontSize = parseInt(localStorage.getItem(FONT_SIZE_KEY)) || defaults.fontSize;
        settings.fontWeight = parseInt(localStorage.getItem(FONT_WEIGHT_KEY)) || defaults.fontWeight;
    }

    // Save settings to localStorage
    function saveSettings() {
        localStorage.setItem(FONT_FAMILY_KEY, settings.fontFamily);
        localStorage.setItem(FONT_SIZE_KEY, settings.fontSize);
        localStorage.setItem(FONT_WEIGHT_KEY, settings.fontWeight);
    }

    // Load Google Fonts dynamically
    function loadGoogleFonts() {
        const googleFonts = availableFonts.filter(f => f.google);
        if (googleFonts.length === 0) return;

        const fontFamilies = googleFonts.map(f => f.value.split(',')[0].replace(/'/g, ''));
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${fontFamilies.map(f => f.replace(/\s/g, '+')).join('&family=')}&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }

    // Apply settings
    function applySettings() {
        document.documentElement.style.setProperty('--main-font-family', settings.fontFamily);
        document.documentElement.style.setProperty('--base-font-size', `${settings.fontSize}%`);
        document.documentElement.style.setProperty('--base-font-weight', settings.fontWeight);
        
        // Update UI
        updateUI();
    }

    // Create font settings UI
    function createFontSettingsUI() {
        // Find settings section
        const settingsSection = document.querySelector('.sectionInner');
        if (!settingsSection) return;

        // Check if already exists
        if (document.getElementById('fontSettings')) return;

        const fontSettingsHTML = `
            <div class="ttcont unflex font-settings" id="fontSettings">
                <div class="texts">
                    <div class="bigText" id="fontSettingsTitle">Font Settings</div>
                </div>
                
                <!-- Font Family Select -->
                <div class="font-control">
                    <label class="font-label" id="fontFamilyLabel">Font Family</label>
                    <select id="fontFamilySelect" class="font-select">
                        <optgroup label="Default">
                            ${availableFonts.filter(f => f.category === 'default').map(f => `
                                <option value="${f.value}" ${settings.fontFamily === f.value ? 'selected' : ''}>${f.name}</option>
                            `).join('')}
                        </optgroup>
                        <optgroup label="Sans Serif">
                            ${availableFonts.filter(f => f.category === 'sans').map(f => `
                                <option value="${f.value}" ${settings.fontFamily === f.value ? 'selected' : ''}>${f.name}</option>
                            `).join('')}
                        </optgroup>
                        <optgroup label="Serif">
                            ${availableFonts.filter(f => f.category === 'serif').map(f => `
                                <option value="${f.value}" ${settings.fontFamily === f.value ? 'selected' : ''}>${f.name}</option>
                            `).join('')}
                        </optgroup>
                        <optgroup label="Monospace">
                            ${availableFonts.filter(f => f.category === 'mono').map(f => `
                                <option value="${f.value}" ${settings.fontFamily === f.value ? 'selected' : ''}>${f.name}</option>
                            `).join('')}
                        </optgroup>
                        <optgroup label="System Fonts">
                            ${availableFonts.filter(f => f.category === 'system').map(f => `
                                <option value="${f.value}" ${settings.fontFamily === f.value ? 'selected' : ''}>${f.name}</option>
                            `).join('')}
                        </optgroup>
                    </select>
                </div>

                <!-- Font Size Slider -->
                <div class="slider-control">
                    <label class="slider-label">
                        <span id="fontSizeLabel">Font Size</span>
                        <span class="slider-value" id="fontSizeValue">${settings.fontSize}%</span>
                    </label>
                    <input type="range" id="fontSizeSlider" min="80" max="150" value="${settings.fontSize}">
                </div>

                <!-- Font Weight Slider -->
                <div class="slider-control">
                    <label class="slider-label">
                        <span id="fontWeightLabel">Font Weight</span>
                        <span class="slider-value" id="fontWeightValue">${settings.fontWeight}</span>
                    </label>
                    <input type="range" id="fontWeightSlider" min="300" max="700" step="100" value="${settings.fontWeight}">
                </div>

                <!-- Preview Text -->
                <div class="font-preview">
                    <span id="fontPreviewLabel">Preview:</span>
                    <p class="preview-text" id="fontPreviewText">
                        The quick brown fox jumps over the lazy dog.
                    </p>
                </div>

                <!-- Reset Button -->
                <div class="font-settings-actions">
                    <button class="reset-btn" id="resetFontSettings">
                        <span id="resetFontLabel">Reset to Default</span>
                    </button>
                </div>
            </div>
        `;

        // Insert into settings
        const target = settingsSection.querySelector('.ttcont.unflex:last-child');
        if (target) {
            target.insertAdjacentHTML('afterend', fontSettingsHTML);
        } else {
            settingsSection.insertAdjacentHTML('beforeend', fontSettingsHTML);
        }

        bindEvents();
    }

    // Bind events
    function bindEvents() {
        // Font family select
        const fontSelect = document.getElementById('fontFamilySelect');
        if (fontSelect) {
            fontSelect.addEventListener('change', (e) => {
                settings.fontFamily = e.target.value;
                applySettings();
                saveSettings();
            });
        }

        // Font size slider
        const sizeSlider = document.getElementById('fontSizeSlider');
        if (sizeSlider) {
            sizeSlider.addEventListener('input', (e) => {
                settings.fontSize = parseInt(e.target.value);
                document.getElementById('fontSizeValue').textContent = `${settings.fontSize}%`;
                applySettings();
                saveSettings();
            });
        }

        // Font weight slider
        const weightSlider = document.getElementById('fontWeightSlider');
        if (weightSlider) {
            weightSlider.addEventListener('input', (e) => {
                settings.fontWeight = parseInt(e.target.value);
                document.getElementById('fontWeightValue').textContent = settings.fontWeight;
                applySettings();
                saveSettings();
            });
        }

        // Reset button
        const resetBtn = document.getElementById('resetFontSettings');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                settings = { ...defaults };
                applySettings();
                saveSettings();
            });
        }
    }

    // Update UI to match settings
    function updateUI() {
        const fontSelect = document.getElementById('fontFamilySelect');
        const sizeSlider = document.getElementById('fontSizeSlider');
        const weightSlider = document.getElementById('fontWeightSlider');
        const previewText = document.getElementById('fontPreviewText');

        if (fontSelect) fontSelect.value = settings.fontFamily;
        if (sizeSlider) {
            sizeSlider.value = settings.fontSize;
            document.getElementById('fontSizeValue').textContent = `${settings.fontSize}%`;
        }
        if (weightSlider) {
            weightSlider.value = settings.fontWeight;
            document.getElementById('fontWeightValue').textContent = settings.fontWeight;
        }
        if (previewText) {
            previewText.style.fontFamily = settings.fontFamily;
            previewText.style.fontWeight = settings.fontWeight;
        }
    }

    // Expose API
    window.fontCustomizer = {
        getSettings: () => ({ ...settings }),
        setFont: (family) => {
            settings.fontFamily = family;
            applySettings();
            saveSettings();
        },
        setSize: (size) => {
            settings.fontSize = size;
            applySettings();
            saveSettings();
        },
        reset: () => {
            settings = { ...defaults };
            applySettings();
            saveSettings();
        }
    };
});
