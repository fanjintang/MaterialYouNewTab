/*
 * Material You NewTab
 * Copyright (c) 2023-2025 XengShi
 * Licensed under the GNU General Public License v3.0 (GPL-3.0)
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 */

// AI Assistant Integration - Doubao and DeepSeek
document.addEventListener('DOMContentLoaded', function () {
    // Storage keys
    const AI_SETTINGS_KEY = 'aiAssistantSettings';
    const DEFAULT_AI_KEY = 'defaultAI';

    // AI Providers configuration
    const aiProviders = {
        doubao: {
            name: '豆包',
            icon: '🤖',
            url: 'https://www.doubao.com/chat/',
            searchParam: 'q',
            color: '#4A90D9'
        },
        deepseek: {
            name: 'DeepSeek',
            icon: '🐋',
            url: 'https://chat.deepseek.com/',
            searchParam: 'q',
            color: '#4F6FEF'
        },
        kimi: {
            name: 'Kimi',
            icon: '🌙',
            url: 'https://kimi.moonshot.cn/',
            searchParam: 'q',
            color: '#6B4FEF'
        },
        tongyi: {
            name: '通义千问',
            icon: '✨',
            url: 'https://tongyi.aliyun.com/qianwen/',
            searchParam: 'q',
            color: '#FF6A00'
        },
        chatgpt: {
            name: 'ChatGPT',
            icon: '💬',
            url: 'https://chat.openai.com/',
            searchParam: 'q',
            color: '#10A37F'
        },
        claude: {
            name: 'Claude',
            icon: '🧠',
            url: 'https://claude.ai/',
            searchParam: 'q',
            color: '#CC785C'
        }
    };

    // Current settings
    let settings = {
        defaultAI: 'doubao',
        enabled: true,
        showInSearch: true,
        quickAccess: true
    };

    // Initialize
    init();

    function init() {
        loadSettings();
        createAIIcon();
        createAIChatPanel();
        createSettingsUI();
        bindEvents();
    }

    // Load settings
    function loadSettings() {
        const saved = localStorage.getItem(AI_SETTINGS_KEY);
        if (saved) {
            settings = { ...settings, ...JSON.parse(saved) };
        }
        const savedDefault = localStorage.getItem(DEFAULT_AI_KEY);
        if (savedDefault && aiProviders[savedDefault]) {
            settings.defaultAI = savedDefault;
        }
    }

    // Save settings
    function saveSettings() {
        localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(settings));
        localStorage.setItem(DEFAULT_AI_KEY, settings.defaultAI);
    }

    // Create AI icon
    function createAIIcon() {
        if (!settings.enabled || document.getElementById('aiAssistantCont')) return;

        const aiCont = document.createElement('div');
        aiCont.id = 'aiAssistantCont';
        aiCont.className = 'ai-assistant-cont';
        aiCont.innerHTML = `
            <svg id="aiAssistantIcon" xmlns="http://www.w3.org/2000/svg" class="dot-icon" width="36" height="36" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            <span class="tooltip-text" id="aiAssistantHover">AI Assistant</span>
        `;

        // Insert after pomodoro or at the end
        const pomodoroCont = document.getElementById('pomodoroCont');
        if (pomodoroCont) {
            pomodoroCont.insertAdjacentElement('afterend', aiCont);
        } else {
            document.body.appendChild(aiCont);
        }
    }

    // Create AI chat panel
    function createAIChatPanel() {
        if (document.getElementById('aiChatPanel')) return;

        const panel = document.createElement('div');
        panel.id = 'aiChatPanel';
        panel.className = 'ai-chat-panel';
        panel.style.display = 'none';
        panel.innerHTML = `
            <div class="ai-chat-header">
                <h3 id="aiChatHeading">AI Assistant</h3>
                <button class="ai-settings-btn" id="aiSettingsBtn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                </button>
            </div>
            <div class="ai-providers-list">
                ${Object.entries(aiProviders).map(([key, provider]) => `
                    <a href="${provider.url}" target="_blank" class="ai-provider-item ${key === settings.defaultAI ? 'default' : ''}" data-provider="${key}">
                        <span class="ai-provider-icon">${provider.icon}</span>
                        <span class="ai-provider-name">${provider.name}</span>
                        ${key === settings.defaultAI ? '<span class="default-badge">Default</span>' : ''}
                    </a>
                `).join('')}
            </div>
            <div class="ai-chat-input-area">
                <input type="text" id="aiChatInput" placeholder="Ask AI anything...">
                <button id="aiSendBtn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </div>
        `;

        document.body.appendChild(panel);
    }

    // Create settings UI
    function createSettingsUI() {
        // Find settings section
        const settingsSection = document.querySelector('.sectionInner');
        if (!settingsSection || document.getElementById('aiSettings')) return;

        const aiSettingsHTML = `
            <div class="ttcont unflex ai-settings-section" id="aiSettings">
                <div class="texts">
                    <div class="bigText" id="aiSettingsTitle">AI Assistant</div>
                </div>
                
                <!-- Enable AI Assistant -->
                <div class="ttcont">
                    <div class="texts">
                        <div class="bigText" id="aiEnableTitle">Enable AI Assistant</div>
                        <div class="infoText" id="aiEnableInfo">Show AI assistant icon on the page</div>
                    </div>
                    <label class="switch">
                        <input id="aiEnableCheckbox" type="checkbox" ${settings.enabled ? 'checked' : ''}>
                        <span class="toggle"></span>
                    </label>
                </div>

                <!-- Default AI Selection -->
                <div class="font-control">
                    <label class="font-label" id="defaultAILabel">Default AI</label>
                    <select id="defaultAISelect" class="font-select">
                        ${Object.entries(aiProviders).map(([key, provider]) => `
                            <option value="${key}" ${settings.defaultAI === key ? 'selected' : ''}>
                                ${provider.icon} ${provider.name}
                            </option>
                        `).join('')}
                    </select>
                </div>

                <!-- Show in Search -->
                <div class="ttcont">
                    <div class="texts">
                        <div class="bigText" id="aiSearchTitle">AI in Search</div>
                        <div class="infoText" id="aiSearchInfo">Add AI option to search dropdown</div>
                    </div>
                    <label class="switch">
                        <input id="aiSearchCheckbox" type="checkbox" ${settings.showInSearch ? 'checked' : ''}>
                        <span class="toggle"></span>
                    </label>
                </div>
            </div>
        `;

        const target = settingsSection.querySelector('.ttcont.unflex:last-child');
        if (target) {
            target.insertAdjacentHTML('afterend', aiSettingsHTML);
        }
    }

    // Bind events
    function bindEvents() {
        // AI icon click
        const aiCont = document.getElementById('aiAssistantCont');
        const aiPanel = document.getElementById('aiChatPanel');
        
        if (aiCont && aiPanel) {
            aiCont.addEventListener('click', () => {
                const isVisible = aiPanel.style.display === 'block';
                aiPanel.style.display = isVisible ? 'none' : 'block';
                aiCont.classList.toggle('active', !isVisible);
            });
        }

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!aiCont?.contains(e.target) && !aiPanel?.contains(e.target)) {
                aiPanel.style.display = 'none';
                aiCont?.classList.remove('active');
            }
        });

        // AI provider click
        document.querySelectorAll('.ai-provider-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const provider = item.dataset.provider;
                if (e.shiftKey || e.ctrlKey) {
                    // Set as default
                    e.preventDefault();
                    setDefaultAI(provider);
                }
            });
        });

        // AI chat input
        const aiInput = document.getElementById('aiChatInput');
        const aiSendBtn = document.getElementById('aiSendBtn');

        if (aiInput && aiSendBtn) {
            aiSendBtn.addEventListener('click', () => sendToAI(aiInput.value));
            aiInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendToAI(aiInput.value);
            });
        }

        // Settings events
        const enableCheckbox = document.getElementById('aiEnableCheckbox');
        if (enableCheckbox) {
            enableCheckbox.addEventListener('change', () => {
                settings.enabled = enableCheckbox.checked;
                saveSettings();
                if (settings.enabled) {
                    createAIIcon();
                } else {
                    document.getElementById('aiAssistantCont')?.remove();
                }
            });
        }

        const defaultSelect = document.getElementById('defaultAISelect');
        if (defaultSelect) {
            defaultSelect.addEventListener('change', () => {
                setDefaultAI(defaultSelect.value);
            });
        }

        const searchCheckbox = document.getElementById('aiSearchCheckbox');
        if (searchCheckbox) {
            searchCheckbox.addEventListener('change', () => {
                settings.showInSearch = searchCheckbox.checked;
                saveSettings();
                updateSearchDropdown();
            });
        }

        // Settings button in panel
        document.getElementById('aiSettingsBtn')?.addEventListener('click', () => {
            openSettings();
        });

        // Add AI to search if enabled
        if (settings.showInSearch) {
            updateSearchDropdown();
        }
    }

    // Set default AI
    function setDefaultAI(provider) {
        settings.defaultAI = provider;
        saveSettings();
        
        // Update UI
        document.querySelectorAll('.ai-provider-item').forEach(item => {
            item.classList.toggle('default', item.dataset.provider === provider);
            const badge = item.querySelector('.default-badge');
            if (item.dataset.provider === provider) {
                if (!badge) {
                    item.insertAdjacentHTML('beforeend', '<span class="default-badge">Default</span>');
                }
            } else {
                badge?.remove();
            }
        });

        // Update select
        const select = document.getElementById('defaultAISelect');
        if (select) select.value = provider;
    }

    // Send to AI
    function sendToAI(query) {
        if (!query.trim()) return;
        
        const provider = aiProviders[settings.defaultAI];
        if (!provider) return;

        // Open AI chat with query
        const url = `${provider.url}?${provider.searchParam}=${encodeURIComponent(query)}`;
        window.open(url, '_blank');

        // Clear input
        const input = document.getElementById('aiChatInput');
        if (input) input.value = '';
    }

    // Update search dropdown
    function updateSearchDropdown() {
        // This would integrate with your existing search system
        // Add AI as a search option
        const searchWithContainer = document.getElementById('searchWithContainer');
        if (!searchWithContainer) return;

        let aiOption = document.getElementById('aiSearchOption');
        
        if (settings.showInSearch) {
            if (!aiOption) {
                aiOption = document.createElement('button');
                aiOption.id = 'aiSearchOption';
                aiOption.className = 'search-engine-option ai-search-option';
                aiOption.innerHTML = `
                    <span class="ai-icon">🤖</span>
                    <span>Ask AI</span>
                `;
                aiOption.addEventListener('click', () => {
                    const query = document.getElementById('searchQ')?.value;
                    if (query) sendToAI(query);
                });
                searchWithContainer.appendChild(aiOption);
            }
        } else {
            aiOption?.remove();
        }
    }

    // Open settings
    function openSettings() {
        const settingsIcon = document.getElementById('settingsIcon');
        if (settingsIcon) {
            settingsIcon.click();
            // Scroll to AI settings
            setTimeout(() => {
                document.getElementById('aiSettings')?.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        }
    }

    // Expose API
    window.aiAssistant = {
        getSettings: () => ({ ...settings }),
        setDefaultAI,
        sendToAI,
        getProviders: () => ({ ...aiProviders })
    };
});
