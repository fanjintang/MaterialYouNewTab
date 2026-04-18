/*
 * Material You NewTab
 * Copyright (c) 2023-2025 XengShi
 * Licensed under the GNU General Public License v3.0 (GPL-3.0)
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 */

// Custom Widgets System - Countdown, Exchange Rate, Stock, Custom Scripts
document.addEventListener('DOMContentLoaded', function () {
    const WIDGETS_KEY = 'customWidgets';
    const WIDGETS_ENABLED_KEY = 'customWidgetsEnabled';
    
    let widgets = JSON.parse(localStorage.getItem(WIDGETS_KEY) || '[]');
    let widgetsEnabled = localStorage.getItem(WIDGETS_ENABLED_KEY) !== 'false';
    
    init();
    
    function init() {
        if (widgetsEnabled) {
            createWidgetsPanel();
            renderWidgets();
        }
        createSettingsUI();
    }
    
    function createWidgetsPanel() {
        if (document.getElementById('customWidgetsCont')) return;
        
        const widgetsCont = document.createElement('div');
        widgetsCont.id = 'customWidgetsCont';
        widgetsCont.className = 'custom-widgets-cont';
        widgetsCont.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="dot-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
            <span class="tooltip-text" id="widgetsHover">Widgets</span>
        `;
        
        const toolsCont = document.getElementById('quickToolsCont');
        if (toolsCont) {
            toolsCont.insertAdjacentElement('afterend', widgetsCont);
        } else {
            document.body.appendChild(widgetsCont);
        }
        
        // Create widgets panel
        const panel = document.createElement('div');
        panel.id = 'widgetsPanel';
        panel.className = 'widgets-panel';
        panel.style.display = 'none';
        panel.innerHTML = `
            <div class="widgets-header">
                <h3 id="widgetsHeading">My Widgets</h3>
                <button id="addWidgetBtn" class="add-widget-btn">+</button>
            </div>
            <div id="widgetsGrid" class="widgets-grid"></div>
        `;
        document.body.appendChild(panel);
        
        // Bind events
        widgetsCont.addEventListener('click', () => {
            const isVisible = panel.style.display === 'block';
            panel.style.display = isVisible ? 'none' : 'block';
            widgetsCont.classList.toggle('active', !isVisible);
        });
        
        document.addEventListener('click', (e) => {
            if (!widgetsCont.contains(e.target) && !panel.contains(e.target)) {
                panel.style.display = 'none';
                widgetsCont.classList.remove('active');
            }
        });
        
        document.getElementById('addWidgetBtn').addEventListener('click', showAddWidgetDialog);
    }
    
    function renderWidgets() {
        const grid = document.getElementById('widgetsGrid');
        if (!grid) return;
        
        if (widgets.length === 0) {
            grid.innerHTML = `
                <div class="widgets-empty">
                    <p>No widgets yet</p>
                    <p class="widgets-empty-hint">Click + to add countdown, exchange rate, or custom widgets</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = widgets.map((widget, index) => createWidgetHTML(widget, index)).join('');
        
        // Initialize each widget
        widgets.forEach((widget, index) => {
            initWidget(widget, index);
        });
    }
    
    function createWidgetHTML(widget, index) {
        const icons = {
            countdown: '⏱️',
            exchange: '💱',
            stock: '📈',
            custom: '🔧'
        };
        
        return `
            <div class="widget-card" data-index="${index}">
                <div class="widget-header">
                    <span class="widget-icon">${icons[widget.type] || '🔧'}</span>
                    <span class="widget-title">${escapeHtml(widget.name)}</span>
                    <button class="widget-edit" data-index="${index}">⋯</button>
                </div>
                <div class="widget-content" id="widget-content-${index}">
                    ${getWidgetContentHTML(widget)}
                </div>
            </div>
        `;
    }
    
    function getWidgetContentHTML(widget) {
        switch (widget.type) {
            case 'countdown':
                return `<div class="countdown-display">Loading...</div>`;
            case 'exchange':
                return `
                    <div class="exchange-display">
                        <div class="exchange-rate">Loading...</div>
                        <div class="exchange-pair">${widget.data.from} → ${widget.data.to}</div>
                    </div>
                `;
            case 'stock':
                return `
                    <div class="stock-display">
                        <div class="stock-symbol">${widget.data.symbol}</div>
                        <div class="stock-price">Loading...</div>
                    </div>
                `;
            case 'custom':
                return `
                    <div class="custom-widget-display">
                        <a href="${widget.data.url}" target="_blank" class="custom-widget-link">
                            ${widget.data.icon ? `<img src="${widget.data.icon}" class="custom-widget-img">` : '<span class="custom-widget-default">🔗</span>'}
                            <span>${escapeHtml(widget.name)}</span>
                        </a>
                    </div>
                `;
            default:
                return '<div>Unknown widget type</div>';
        }
    }
    
    function initWidget(widget, index) {
        const contentEl = document.getElementById(`widget-content-${index}`);
        if (!contentEl) return;
        
        switch (widget.type) {
            case 'countdown':
                initCountdown(widget, contentEl);
                break;
            case 'exchange':
                initExchangeRate(widget, contentEl);
                break;
            case 'stock':
                initStock(widget, contentEl);
                break;
        }
        
        // Edit button
        const editBtn = document.querySelector(`.widget-edit[data-index="${index}"]`);
        if (editBtn) {
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showWidgetContextMenu(index, editBtn);
            });
        }
    }
    
    function initCountdown(widget, el) {
        function update() {
            const target = new Date(widget.data.targetDate);
            const now = new Date();
            const diff = target - now;
            
            if (diff <= 0) {
                el.querySelector('.countdown-display').innerHTML = '<span class="countdown-done">Time\'s up!</span>';
                return;
            }
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            
            el.querySelector('.countdown-display').innerHTML = `
                <div class="countdown-numbers">
                    <span class="countdown-unit"><strong>${days}</strong><small>d</small></span>
                    <span class="countdown-unit"><strong>${hours}</strong><small>h</small></span>
                    <span class="countdown-unit"><strong>${minutes}</strong><small>m</small></span>
                </div>
            `;
        }
        
        update();
        widget.interval = setInterval(update, 60000);
    }
    
    async function initExchangeRate(widget, el) {
        try {
            const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${widget.data.from}`);
            const data = await response.json();
            const rate = data.rates[widget.data.to];
            
            el.querySelector('.exchange-rate').textContent = rate.toFixed(4);
        } catch (e) {
            el.querySelector('.exchange-rate').textContent = 'Error';
        }
    }
    
    async function initStock(widget, el) {
        // Using a free stock API (Alpha Vantage or similar would need API key)
        // For demo, showing placeholder
        el.querySelector('.stock-price').innerHTML = `
            <span class="stock-value">--.--</span>
            <span class="stock-change">Live data requires API key</span>
        `;
    }
    
    function showAddWidgetDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'widget-dialog';
        dialog.innerHTML = `
            <div class="widget-dialog-content">
                <h3>Add Widget</h3>
                <div class="widget-type-grid">
                    <button class="widget-type-btn" data-type="countdown">
                        <span class="widget-type-icon">⏱️</span>
                        <span>Countdown</span>
                    </button>
                    <button class="widget-type-btn" data-type="exchange">
                        <span class="widget-type-icon">💱</span>
                        <span>Exchange Rate</span>
                    </button>
                    <button class="widget-type-btn" data-type="stock">
                        <span class="widget-type-icon">📈</span>
                        <span>Stock</span>
                    </button>
                    <button class="widget-type-btn" data-type="custom">
                        <span class="widget-type-icon">🔗</span>
                        <span>Custom Link</span>
                    </button>
                </div>
                <div class="widget-dialog-actions">
                    <button class="btn-cancel">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        dialog.querySelectorAll('.widget-type-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.type;
                dialog.remove();
                showWidgetConfigDialog(type);
            });
        });
        
        dialog.querySelector('.btn-cancel').addEventListener('click', () => dialog.remove());
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) dialog.remove();
        });
    }
    
    function showWidgetConfigDialog(type, editIndex = -1) {
        const isEdit = editIndex >= 0;
        const widget = isEdit ? widgets[editIndex] : null;
        
        const configs = {
            countdown: {
                title: 'Countdown Timer',
                fields: `
                    <input type="text" id="widgetName" placeholder="Event name" value="${isEdit ? widget.name : ''}">
                    <input type="datetime-local" id="targetDate" value="${isEdit ? widget.data.targetDate : ''}">
                `
            },
            exchange: {
                title: 'Exchange Rate',
                fields: `
                    <input type="text" id="widgetName" placeholder="Widget name (optional)" value="${isEdit ? widget.name : ''}">
                    <div class="currency-selects">
                        <select id="fromCurrency">
                            ${['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'KRW', 'AUD', 'CAD', 'CHF', 'HKD', 'SGD'].map(c => 
                                `<option value="${c}" ${isEdit && widget.data.from === c ? 'selected' : ''}>${c}</option>`
                            ).join('')}
                        </select>
                        <span>→</span>
                        <select id="toCurrency">
                            ${['CNY', 'USD', 'EUR', 'GBP', 'JPY', 'KRW', 'AUD', 'CAD', 'CHF', 'HKD', 'SGD'].map(c => 
                                `<option value="${c}" ${isEdit && widget.data.to === c ? 'selected' : ''}>${c}</option>`
                            ).join('')}
                        </select>
                    </div>
                `
            },
            stock: {
                title: 'Stock Tracker',
                fields: `
                    <input type="text" id="widgetName" placeholder="Widget name (optional)" value="${isEdit ? widget.name : ''}">
                    <input type="text" id="stockSymbol" placeholder="Stock symbol (e.g., AAPL)" value="${isEdit ? widget.data.symbol : ''}">
                `
            },
            custom: {
                title: 'Custom Link',
                fields: `
                    <input type="text" id="widgetName" placeholder="Name" value="${isEdit ? widget.name : ''}">
                    <input type="url" id="customUrl" placeholder="https://..." value="${isEdit ? widget.data.url : ''}">
                    <div class="icon-selector">
                        <p>Choose icon:</p>
                        <div class="icon-grid">
                            ${['🔗', '📱', '💻', '🎮', '🎵', '📺', '📚', '🛒', '✈️', '🏦', '🏥', '🎓', '⚽', '🍔', '🏠', '🔍'].map(icon => 
                                `<button class="icon-option-btn ${isEdit && widget.data.iconType === icon ? 'selected' : ''}" data-icon="${icon}">${icon}</button>`
                            ).join('')}
                        </div>
                    </div>
                `
            }
        };
        
        const config = configs[type];
        const dialog = document.createElement('div');
        dialog.className = 'widget-dialog';
        dialog.innerHTML = `
            <div class="widget-dialog-content">
                <h3>${config.title}</h3>
                ${config.fields}
                <div class="widget-dialog-actions">
                    <button class="btn-cancel">Cancel</button>
                    <button class="btn-create">${isEdit ? 'Save' : 'Add'}</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        // Icon selection
        let selectedIcon = isEdit ? widget.data.iconType : '🔗';
        dialog.querySelectorAll('.icon-option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                dialog.querySelectorAll('.icon-option-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedIcon = btn.dataset.icon;
            });
        });
        
        dialog.querySelector('.btn-cancel').addEventListener('click', () => dialog.remove());
        dialog.querySelector('.btn-create').addEventListener('click', () => {
            const name = dialog.querySelector('#widgetName')?.value || getDefaultName(type);
            
            let data = {};
            switch (type) {
                case 'countdown':
                    data = { targetDate: dialog.querySelector('#targetDate').value };
                    break;
                case 'exchange':
                    data = { 
                        from: dialog.querySelector('#fromCurrency').value,
                        to: dialog.querySelector('#toCurrency').value
                    };
                    break;
                case 'stock':
                    data = { symbol: dialog.querySelector('#stockSymbol').value.toUpperCase() };
                    break;
                case 'custom':
                    data = { 
                        url: dialog.querySelector('#customUrl').value,
                        iconType: selectedIcon
                    };
                    break;
            }
            
            if (isEdit) {
                widgets[editIndex] = { type, name, data };
            } else {
                widgets.push({ type, name, data });
            }
            
            saveWidgets();
            renderWidgets();
            dialog.remove();
        });
        
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) dialog.remove();
        });
    }
    
    function showWidgetContextMenu(index, btn) {
        const existing = document.querySelector('.widget-context-menu');
        if (existing) existing.remove();
        
        const menu = document.createElement('div');
        menu.className = 'widget-context-menu';
        menu.innerHTML = `
            <button class="context-item edit">Edit</button>
            <button class="context-item delete">Delete</button>
        `;
        
        const rect = btn.getBoundingClientRect();
        menu.style.position = 'fixed';
        menu.style.top = rect.bottom + 'px';
        menu.style.left = rect.left + 'px';
        menu.style.zIndex = '10000';
        
        document.body.appendChild(menu);
        
        menu.querySelector('.edit').addEventListener('click', () => {
            menu.remove();
            showWidgetConfigDialog(widgets[index].type, index);
        });
        
        menu.querySelector('.delete').addEventListener('click', () => {
            if (widgets[index].interval) clearInterval(widgets[index].interval);
            widgets.splice(index, 1);
            saveWidgets();
            renderWidgets();
            menu.remove();
        });
        
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 10);
    }
    
    function getDefaultName(type) {
        const names = {
            countdown: 'New Countdown',
            exchange: 'Exchange Rate',
            stock: 'Stock',
            custom: 'Custom Link'
        };
        return names[type] || 'Widget';
    }
    
    function saveWidgets() {
        localStorage.setItem(WIDGETS_KEY, JSON.stringify(widgets));
    }
    
    function createSettingsUI() {
        const settingsSection = document.querySelector('.sectionInner');
        if (!settingsSection || document.getElementById('customWidgetsSettings')) return;
        
        const html = `
            <div class="ttcont" id="customWidgetsSettings">
                <div class="texts">
                    <div class="bigText" id="customWidgetsTitle">Custom Widgets</div>
                    <div class="infoText" id="customWidgetsInfo">Enable custom widgets (countdown, exchange rate, stock)</div>
                </div>
                <label class="switch">
                    <input id="customWidgetsCheckbox" type="checkbox" ${widgetsEnabled ? 'checked' : ''}>
                    <span class="toggle"></span>
                </label>
            </div>
        `;
        
        const target = settingsSection.querySelector('#quickToolsSettings') || settingsSection.querySelector('.ttcont:last-child');
        if (target) {
            target.insertAdjacentHTML('afterend', html);
        }
        
        document.getElementById('customWidgetsCheckbox')?.addEventListener('change', (e) => {
            widgetsEnabled = e.target.checked;
            localStorage.setItem(WIDGETS_ENABLED_KEY, widgetsEnabled);
            showToast(widgetsEnabled ? 'Custom Widgets enabled. Refresh to see changes.' : 'Custom Widgets disabled. Refresh to see changes.');
        });
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function showToast(message) {
        let toast = document.getElementById('widgetToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'widgetToast';
            toast.className = 'shortcut-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }
    
    // Expose API
    window.customWidgets = {
        add: (type, name, data) => {
            widgets.push({ type, name, data });
            saveWidgets();
            renderWidgets();
        },
        remove: (index) => {
            if (widgets[index]?.interval) clearInterval(widgets[index].interval);
            widgets.splice(index, 1);
            saveWidgets();
            renderWidgets();
        },
        toggle: () => {
            widgetsEnabled = !widgetsEnabled;
            localStorage.setItem(WIDGETS_ENABLED_KEY, widgetsEnabled);
            location.reload();
        }
    };
});
