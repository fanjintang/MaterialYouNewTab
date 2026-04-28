/*
 * Material You NewTab
 * Copyright (c) 2023-2025 XengShi
 * Licensed under the GNU General Public License v3.0 (GPL-3.0)
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 */

// Keyboard Shortcuts System
document.addEventListener('DOMContentLoaded', function () {
    // Help panel state
    let helpPanelVisible = false;

    // Initialize keyboard shortcuts
    initKeyboardShortcuts();

    function initKeyboardShortcuts() {
        document.addEventListener('keydown', handleKeyDown);
    }

    function handleKeyDown(e) {
        // If help panel is open, only respond to Escape or ?
        if (helpPanelVisible) {
            if (e.key === 'Escape' || e.key === '?') {
                e.preventDefault();
                toggleHelpPanel(false);
            }
            return;
        }

        // Check if user is typing in an input field
        const isInputField = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable;
        
        // Handle Escape key globally
        if (e.key === 'Escape') {
            e.preventDefault();
            closeAllPanels();
            if (isInputField) {
                e.target.blur();
            }
            return;
        }

        // Handle ? key to show help (when not in input)
        if (e.key === '?' && !isInputField) {
            e.preventDefault();
            toggleHelpPanel(true);
            return;
        }

        // Ignore other shortcuts when in input field
        if (isInputField) {
            return;
        }

        const isCtrl = e.ctrlKey || e.metaKey;
        const key = e.key.toLowerCase();

        // Ctrl/Cmd + K or / - Focus search box
        if ((isCtrl && key === 'k') || key === '/') {
            e.preventDefault();
            focusSearchBox();
            return;
        }

        // Ctrl/Cmd + B - Toggle bookmarks
        if (isCtrl && key === 'b') {
            e.preventDefault();
            toggleBookmarks();
            return;
        }

        // Ctrl/Cmd + T - Toggle todo list
        if (isCtrl && key === 't') {
            e.preventDefault();
            toggleTodoList();
            return;
        }

        // Ctrl/Cmd + , - Open settings
        if (isCtrl && key === ',') {
            e.preventDefault();
            openSettings();
            return;
        }

        // Ctrl/Cmd + D - Add current page to bookmarks
        if (isCtrl && key === 'd') {
            e.preventDefault();
            addCurrentPageToBookmarks();
            return;
        }

        // 1-9 - Quick open shortcuts
        if (!isCtrl && /^[1-9]$/.test(e.key)) {
            e.preventDefault();
            openShortcutByIndex(parseInt(e.key) - 1);
            return;
        }

        // Ctrl/Cmd + 1-9 - Switch search engine
        if (isCtrl && /^[1-9]$/.test(e.key)) {
            e.preventDefault();
            switchSearchEngine(parseInt(e.key) - 1);
            return;
        }
    }

    // Focus search box
    function focusSearchBox() {
        const searchInput = document.getElementById('searchQ');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }

    // Toggle bookmarks - auto-enable if disabled
    function toggleBookmarks() {
        const bookmarkButton = document.getElementById('bookmarkButton');
        const bookmarksCheckbox = document.getElementById('bookmarksCheckbox');
        
        // Check if bookmarks are enabled
        if (!bookmarkButton || bookmarkButton.style.display === 'none') {
            // Enable bookmarks
            if (bookmarksCheckbox) {
                bookmarksCheckbox.checked = true;
                localStorage.setItem('bookmarksCheckboxState', 'checked');
                localStorage.setItem('bookmarksDisplayStatus', 'flex');
            }
            // Show toast and refresh
            showShortcutToast('Enabling Bookmarks...');
            setTimeout(() => location.reload(), 500);
            return;
        }
        
        // Toggle if already enabled
        bookmarkButton.click();
    }

    // Toggle todo list - auto-enable if disabled
    function toggleTodoList() {
        const todoListCont = document.getElementById('todoListCont');
        const todoContainer = document.getElementById('todoContainer');
        const todoCheckbox = document.getElementById('todoListCheckbox');
        
        // Check if todo is enabled
        if (!todoListCont || todoListCont.style.display === 'none') {
            // Enable todo
            if (todoCheckbox) {
                todoCheckbox.checked = true;
                localStorage.setItem('todoListCheckboxState', 'checked');
                localStorage.setItem('todoListDisplayStatus', 'flex');
            }
            // Show toast and refresh
            showShortcutToast('Enabling Todo List...');
            setTimeout(() => location.reload(), 500);
            return;
        }
        
        // Toggle if already enabled
        if (todoContainer) {
            const isVisible = todoContainer.style.display === 'block';
            if (isVisible) {
                todoContainer.style.display = 'none';
            } else {
                todoListCont.click();
            }
        }
    }

    // Open settings panel
    function openSettings() {
        const settingsIcon = document.getElementById('settingsIcon');
        if (settingsIcon) {
            settingsIcon.click();
        }
    }

    // Close all panels
    function closeAllPanels() {
        // Close todo
        const todoContainer = document.getElementById('todoContainer');
        if (todoContainer) todoContainer.style.display = 'none';

        // Close bookmarks
        const bookmarkContainer = document.getElementById('bookmarkContainer');
        if (bookmarkContainer) bookmarkContainer.style.display = 'none';

        // Close AI tools
        const aiToolsContainer = document.getElementById('aiToolsContainer');
        if (aiToolsContainer) aiToolsContainer.style.display = 'none';

        // Close Google apps
        const googleAppsCont = document.getElementById('googleAppsCont');
        if (googleAppsCont) {
            const iconContainer = document.getElementById('iconContainer');
            if (iconContainer) iconContainer.style.display = 'none';
        }

        // Close settings
        const menuCloseButton = document.getElementById('menuCloseButton');
        if (menuCloseButton && menuCloseButton.style.display !== 'none') {
            menuCloseButton.click();
        }
    }

    // Add current page to bookmarks
    function addCurrentPageToBookmarks() {
        // This would need to be implemented based on your bookmark system
        // For now, show a message
        showShortcutToast('Add to bookmarks - Coming soon!');
    }

    // Open shortcut by index (1-9)
    function openShortcutByIndex(index) {
        const shortcuts = document.querySelectorAll('#shortcutsContainer .shortcut');
        if (shortcuts[index]) {
            const link = shortcuts[index].querySelector('a');
            if (link) {
                link.click();
            }
        }
    }

    // Switch search engine by index
    function switchSearchEngine(index) {
        const searchEngines = document.querySelectorAll('.search-engine-option');
        if (searchEngines[index]) {
            searchEngines[index].click();
            showShortcutToast(`Switched to ${searchEngines[index].dataset.engine || 'search engine'}`);
        }
    }

    // Toggle help panel
    function toggleHelpPanel(show) {
        helpPanelVisible = show;
        let helpPanel = document.getElementById('keyboardShortcutsHelp');
        
        if (show) {
            if (!helpPanel) {
                helpPanel = createHelpPanel();
            }
            helpPanel.style.display = 'flex';
            setTimeout(() => helpPanel.classList.add('visible'), 10);
        } else if (helpPanel) {
            helpPanel.classList.remove('visible');
            setTimeout(() => helpPanel.style.display = 'none', 300);
        }
    }

    // Create help panel
    function createHelpPanel() {
        const panel = document.createElement('div');
        panel.id = 'keyboardShortcutsHelp';
        panel.className = 'shortcuts-help-panel';
        panel.innerHTML = `
            <div class="shortcuts-help-content">
                <div class="shortcuts-help-header">
                    <h3>Keyboard Shortcuts</h3>
                    <button class="close-help" id="closeShortcutsHelp">×</button>
                </div>
                <div class="shortcuts-list">
                    <div class="shortcut-item">
                        <kbd>Ctrl</kbd> + <kbd>K</kbd> or <kbd>/</kbd>
                        <span>Focus search box</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Esc</kbd>
                        <span>Close all panels / Cancel</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Ctrl</kbd> + <kbd>B</kbd>
                        <span>Toggle bookmarks</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Ctrl</kbd> + <kbd>T</kbd>
                        <span>Toggle todo list</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Ctrl</kbd> + <kbd>,</kbd>
                        <span>Open settings</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Ctrl</kbd> + <kbd>D</kbd>
                        <span>Add to bookmarks</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>1</kbd> - <kbd>9</kbd>
                        <span>Open shortcut</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Ctrl</kbd> + <kbd>1</kbd> - <kbd>9</kbd>
                        <span>Switch search engine</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>?</kbd>
                        <span>Show this help</span>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
        
        // Bind close button click event
        const closeBtn = panel.querySelector('#closeShortcutsHelp');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleHelpPanel(false);
            });
        }
        
        // Click outside to close
        panel.addEventListener('click', (e) => {
            if (e.target === panel) {
                toggleHelpPanel(false);
            }
        });
        
        return panel;
    }

    // Show toast notification
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
});
