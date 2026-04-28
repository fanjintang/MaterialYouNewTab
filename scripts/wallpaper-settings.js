/*
 * Material You NewTab
 * Copyright (c) 2023-2025 XengShi
 * Licensed under the GNU General Public License v3.0 (GPL-3.0)
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 */

// Wallpaper Settings - Opacity, Blur, and Overlay
document.addEventListener('DOMContentLoaded', function () {
    // Storage keys
    const BG_OPACITY_KEY = 'bgOpacity';
    const BG_BLUR_KEY = 'bgBlur';
    const BG_OVERLAY_OPACITY_KEY = 'bgOverlayOpacity';
    const BG_OVERLAY_COLOR_KEY = 'bgOverlayColor';

    // Default values
    const defaults = {
        opacity: 0.5,
        blur: 0,
        overlayOpacity: 0.3,
        overlayColor: '#000000'
    };

    // Current settings
    let settings = { ...defaults };

    // Initialize
    loadSettings();
    initUI();
    applySettings();

    // Load settings from localStorage
    function loadSettings() {
        settings.opacity = parseFloat(localStorage.getItem(BG_OPACITY_KEY)) || defaults.opacity;
        settings.blur = parseInt(localStorage.getItem(BG_BLUR_KEY)) || defaults.blur;
        settings.overlayOpacity = parseFloat(localStorage.getItem(BG_OVERLAY_OPACITY_KEY)) || defaults.overlayOpacity;
        settings.overlayColor = localStorage.getItem(BG_OVERLAY_COLOR_KEY) || defaults.overlayColor;
    }

    // Save settings to localStorage
    function saveSettings() {
        localStorage.setItem(BG_OPACITY_KEY, settings.opacity);
        localStorage.setItem(BG_BLUR_KEY, settings.blur);
        localStorage.setItem(BG_OVERLAY_OPACITY_KEY, settings.overlayOpacity);
        localStorage.setItem(BG_OVERLAY_COLOR_KEY, settings.overlayColor);
    }

    // Apply settings to CSS variables
    function applySettings() {
        document.body.style.setProperty('--bg-opacity', settings.opacity);
        document.body.style.setProperty('--bg-blur', `${settings.blur}px`);
        document.body.style.setProperty('--bg-overlay-color', settings.overlayColor);
        document.body.style.setProperty('--bg-overlay-opacity', settings.overlayOpacity);
        
        // Update UI controls
        updateUIControls();
    }

    // Initialize UI controls
    function initUI() {
        // Create settings UI if it doesn't exist
        createWallpaperSettingsUI();

        // Bind events
        bindEvents();
    }

    // Create wallpaper settings UI
    function createWallpaperSettingsUI() {
        // Check if already exists
        if (document.getElementById('wallpaperSettings')) return;

        // Find the wallpaper section
        const wallpaperSection = document.querySelector('.wallpaper-section') || 
                                 document.getElementById('uploadTrigger')?.closest('.sectionInner');
        
        if (!wallpaperSection) return;

        const settingsHTML = `
            <div class="ttcont unflex wallpaper-settings" id="wallpaperSettings">
                <div class="texts">
                    <div class="bigText" id="wallpaperSettingsTitle">Wallpaper Settings</div>
                </div>
                
                <!-- Opacity Slider -->
                <div class="slider-control">
                    <label class="slider-label">
                        <span id="bgOpacityLabel">Image Opacity</span>
                        <span class="slider-value" id="opacityValue">${Math.round(settings.opacity * 100)}%</span>
                    </label>
                    <input type="range" id="bgOpacitySlider" min="10" max="100" value="${Math.round(settings.opacity * 100)}">
                </div>

                <!-- Blur Slider -->
                <div class="slider-control">
                    <label class="slider-label">
                        <span id="bgBlurLabel">Blur Effect</span>
                        <span class="slider-value" id="blurValue">${settings.blur}px</span>
                    </label>
                    <input type="range" id="bgBlurSlider" min="0" max="20" value="${settings.blur}">
                </div>

                <!-- Overlay Opacity Slider -->
                <div class="slider-control">
                    <label class="slider-label">
                        <span id="overlayOpacityLabel">Overlay Darkness</span>
                        <span class="slider-value" id="overlayOpacityValue">${Math.round(settings.overlayOpacity * 100)}%</span>
                    </label>
                    <input type="range" id="overlayOpacitySlider" min="0" max="80" value="${Math.round(settings.overlayOpacity * 100)}">
                </div>

                <!-- Overlay Color -->
                <div class="color-control">
                    <label class="color-label" id="overlayColorLabel">Overlay Color</label>
                    <div class="color-options">
                        <button class="color-btn ${settings.overlayColor === '#000000' ? 'active' : ''}" data-color="#000000" style="background: #000000;"></button>
                        <button class="color-btn ${settings.overlayColor === '#1a1a2e' ? 'active' : ''}" data-color="#1a1a2e" style="background: #1a1a2e;"></button>
                        <button class="color-btn ${settings.overlayColor === '#16213e' ? 'active' : ''}" data-color="#16213e" style="background: #16213e;"></button>
                        <button class="color-btn ${settings.overlayColor === '#0f3460' ? 'active' : ''}" data-color="#0f3460" style="background: #0f3460;"></button>
                        <button class="color-btn ${settings.overlayColor === '#533483' ? 'active' : ''}" data-color="#533483" style="background: #533483;"></button>
                    </div>
                </div>

                <!-- Reset Button -->
                <div class="wallpaper-settings-actions">
                    <button class="reset-btn" id="resetWallpaperSettings">
                        <span id="resetWallpaperLabel">Reset to Default</span>
                    </button>
                </div>
            </div>
        `;

        // Insert after upload section
        const uploadContainer = document.querySelector('.uploadClearContainer');
        if (uploadContainer) {
            uploadContainer.insertAdjacentHTML('afterend', settingsHTML);
        }
    }

    // Bind event listeners
    function bindEvents() {
        // Opacity slider
        const opacitySlider = document.getElementById('bgOpacitySlider');
        if (opacitySlider) {
            opacitySlider.addEventListener('input', (e) => {
                settings.opacity = parseInt(e.target.value) / 100;
                document.getElementById('opacityValue').textContent = `${e.target.value}%`;
                applySettings();
                saveSettings();
            });
        }

        // Blur slider
        const blurSlider = document.getElementById('bgBlurSlider');
        if (blurSlider) {
            blurSlider.addEventListener('input', (e) => {
                settings.blur = parseInt(e.target.value);
                document.getElementById('blurValue').textContent = `${e.target.value}px`;
                applySettings();
                saveSettings();
            });
        }

        // Overlay opacity slider
        const overlaySlider = document.getElementById('overlayOpacitySlider');
        if (overlaySlider) {
            overlaySlider.addEventListener('input', (e) => {
                settings.overlayOpacity = parseInt(e.target.value) / 100;
                document.getElementById('overlayOpacityValue').textContent = `${e.target.value}%`;
                applySettings();
                saveSettings();
            });
        }

        // Color buttons
        const colorBtns = document.querySelectorAll('.color-btn');
        colorBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                colorBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                settings.overlayColor = btn.dataset.color;
                applySettings();
                saveSettings();
            });
        });

        // Reset button
        const resetBtn = document.getElementById('resetWallpaperSettings');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                settings = { ...defaults };
                applySettings();
                saveSettings();
            });
        }
    }

    // Update UI controls to match current settings
    function updateUIControls() {
        const opacitySlider = document.getElementById('bgOpacitySlider');
        const blurSlider = document.getElementById('bgBlurSlider');
        const overlaySlider = document.getElementById('overlayOpacitySlider');

        if (opacitySlider) {
            opacitySlider.value = Math.round(settings.opacity * 100);
            document.getElementById('opacityValue').textContent = `${Math.round(settings.opacity * 100)}%`;
        }
        if (blurSlider) {
            blurSlider.value = settings.blur;
            document.getElementById('blurValue').textContent = `${settings.blur}px`;
        }
        if (overlaySlider) {
            overlaySlider.value = Math.round(settings.overlayOpacity * 100);
            document.getElementById('overlayOpacityValue').textContent = `${Math.round(settings.overlayOpacity * 100)}%`;
        }

        // Update color buttons
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.color === settings.overlayColor);
        });
    }

    // Expose functions globally
    window.wallpaperSettings = {
        getSettings: () => ({ ...settings }),
        setOpacity: (value) => {
            settings.opacity = value;
            applySettings();
            saveSettings();
        },
        setBlur: (value) => {
            settings.blur = value;
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
