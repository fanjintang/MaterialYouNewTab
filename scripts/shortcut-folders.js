/*
 * Material You NewTab
 * Copyright (c) 2023-2025 XengShi
 * Licensed under the GNU General Public License v3.0 (GPL-3.0)
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 */

// Shortcut Folders - Organize shortcuts into folders
document.addEventListener('DOMContentLoaded', function () {
    // Storage key
    const FOLDERS_KEY = 'shortcutFolders';
    const ACTIVE_FOLDER_KEY = 'activeShortcutFolder';

    // Default folders
    const defaultFolders = [
        { id: 'default', name: 'All', icon: 'grid', shortcuts: [] },
        { id: 'work', name: 'Work', icon: 'briefcase', shortcuts: [] },
        { id: 'social', name: 'Social', icon: 'users', shortcuts: [] },
        { id: 'entertainment', name: 'Entertainment', icon: 'play', shortcuts: [] }
    ];

    // Current state
    let folders = [];
    let activeFolderId = 'default';

    // Initialize
    init();

    function init() {
        loadFolders();
        createFolderUI();
        bindEvents();
        renderFolders();
    }

    // Load folders from localStorage
    function loadFolders() {
        const saved = localStorage.getItem(FOLDERS_KEY);
        folders = saved ? JSON.parse(saved) : [...defaultFolders];
        activeFolderId = localStorage.getItem(ACTIVE_FOLDER_KEY) || 'default';
    }

    // Save folders to localStorage
    function saveFolders() {
        localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
        localStorage.setItem(ACTIVE_FOLDER_KEY, activeFolderId);
    }

    // Create folder UI
    function createFolderUI() {
        const shortcutsSection = document.getElementById('shortcuts-section');
        if (!shortcutsSection) return;

        // Check if already exists
        if (document.getElementById('shortcutFoldersBar')) return;

        const folderBar = document.createElement('div');
        folderBar.id = 'shortcutFoldersBar';
        folderBar.className = 'shortcut-folders-bar';
        folderBar.innerHTML = `
            <div class="folders-list" id="foldersList"></div>
            <button class="folder-add-btn" id="addFolderBtn" title="Add Folder">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </button>
        `;

        // Insert into shortcuts section
        const shortcutsContainer = document.getElementById('shortcutsContainer');
        if (shortcutsContainer && shortcutsContainer.parentNode === shortcutsSection) {
            shortcutsSection.insertBefore(folderBar, shortcutsContainer);
        } else {
            // If shortcutsContainer is not a direct child, append to section
            shortcutsSection.appendChild(folderBar);
        }
    }

    // Render folders
    function renderFolders() {
        const list = document.getElementById('foldersList');
        if (!list) return;

        list.innerHTML = folders.map(folder => `
            <div class="folder-tab ${folder.id === activeFolderId ? 'active' : ''}" 
                 data-folder-id="${folder.id}"
                 ${folder.id !== 'default' ? 'data-editable="true"' : ''}>
                <span class="folder-icon">${getFolderIcon(folder.icon)}</span>
                <span class="folder-name">${folder.name}</span>
                ${folder.id !== 'default' ? `
                    <button class="folder-edit" data-folder-id="${folder.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="19" cy="12" r="1"></circle>
                            <circle cx="5" cy="12" r="1"></circle>
                        </svg>
                    </button>
                ` : ''}
            </div>
        `).join('');

        // Filter shortcuts based on active folder
        filterShortcuts();
    }

    // Get folder icon SVG
    function getFolderIcon(iconName) {
        const icons = {
            grid: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
            briefcase: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>',
            users: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
            play: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>',
            star: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
            heart: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>',
            code: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>',
            book: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>'
        };
        return icons[iconName] || icons.grid;
    }

    // Filter shortcuts based on active folder
    function filterShortcuts() {
        const shortcuts = document.querySelectorAll('#shortcutsContainer .shortcut');
        const activeFolder = folders.find(f => f.id === activeFolderId);
        
        if (!activeFolder || activeFolderId === 'default') {
            // Show all shortcuts
            shortcuts.forEach(s => s.style.display = '');
            return;
        }

        // Filter shortcuts
        shortcuts.forEach(shortcut => {
            const shortcutId = shortcut.dataset.id || shortcut.dataset.name;
            const isInFolder = activeFolder.shortcuts.includes(shortcutId);
            shortcut.style.display = isInFolder ? '' : 'none';
        });
    }

    // Bind events
    function bindEvents() {
        // Folder tab click
        document.addEventListener('click', (e) => {
            const folderTab = e.target.closest('.folder-tab');
            if (folderTab) {
                const folderId = folderTab.dataset.folderId;
                if (folderId) {
                    activeFolderId = folderId;
                    saveFolders();
                    renderFolders();
                }
            }

            // Add folder button
            if (e.target.closest('#addFolderBtn')) {
                showAddFolderDialog();
            }

            // Folder edit button
            const editBtn = e.target.closest('.folder-edit');
            if (editBtn) {
                e.stopPropagation();
                showFolderContextMenu(editBtn.dataset.folderId, editBtn);
            }
        });
    }

    // Show add folder dialog
    function showAddFolderDialog() {
        const icons = ['briefcase', 'users', 'play', 'star', 'heart', 'code', 'book'];
        const dialog = document.createElement('div');
        dialog.className = 'folder-dialog';
        dialog.innerHTML = `
            <div class="folder-dialog-content">
                <h3>New Folder</h3>
                <input type="text" id="newFolderName" placeholder="Folder name" maxlength="20">
                <div class="folder-icon-selector">
                    ${icons.map(icon => `
                        <button class="icon-option" data-icon="${icon}">
                            ${getFolderIcon(icon)}
                        </button>
                    `).join('')}
                </div>
                <div class="folder-dialog-actions">
                    <button class="btn-cancel">Cancel</button>
                    <button class="btn-create">Create</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);
        setTimeout(() => dialog.classList.add('visible'), 10);

        let selectedIcon = 'briefcase';

        // Icon selection
        dialog.querySelectorAll('.icon-option').forEach(btn => {
            btn.addEventListener('click', () => {
                dialog.querySelectorAll('.icon-option').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedIcon = btn.dataset.icon;
            });
        });

        // Select first icon by default
        dialog.querySelector('.icon-option')?.classList.add('selected');

        // Cancel
        dialog.querySelector('.btn-cancel').addEventListener('click', () => {
            dialog.remove();
        });

        // Create
        dialog.querySelector('.btn-create').addEventListener('click', () => {
            const name = document.getElementById('newFolderName').value.trim();
            if (name) {
                createFolder(name, selectedIcon);
                dialog.remove();
            }
        });

        // Enter key
        document.getElementById('newFolderName').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                dialog.querySelector('.btn-create').click();
            }
        });

        // Focus input
        document.getElementById('newFolderName').focus();
    }

    // Create new folder
    function createFolder(name, icon) {
        const id = 'folder_' + Date.now();
        folders.push({ id, name, icon, shortcuts: [] });
        saveFolders();
        renderFolders();
    }

    // Show folder context menu
    function showFolderContextMenu(folderId, triggerBtn) {
        const existingMenu = document.querySelector('.folder-context-menu');
        if (existingMenu) existingMenu.remove();

        const menu = document.createElement('div');
        menu.className = 'folder-context-menu';
        menu.innerHTML = `
            <button class="context-item" data-action="rename">Rename</button>
            <button class="context-item" data-action="manage">Manage Shortcuts</button>
            <button class="context-item delete" data-action="delete">Delete</button>
        `;

        const rect = triggerBtn.getBoundingClientRect();
        menu.style.position = 'absolute';
        menu.style.top = `${rect.bottom + 5}px`;
        menu.style.left = `${rect.left}px`;

        document.body.appendChild(menu);

        menu.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            menu.remove();

            switch (action) {
                case 'rename':
                    renameFolder(folderId);
                    break;
                case 'manage':
                    manageFolderShortcuts(folderId);
                    break;
                case 'delete':
                    deleteFolder(folderId);
                    break;
            }
        });

        // Close on outside click
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            }, { once: true });
        }, 0);
    }

    // Rename folder
    function renameFolder(folderId) {
        const folder = folders.find(f => f.id === folderId);
        if (!folder) return;

        const newName = prompt('Folder name:', folder.name);
        if (newName && newName.trim()) {
            folder.name = newName.trim();
            saveFolders();
            renderFolders();
        }
    }

    // Delete folder
    function deleteFolder(folderId) {
        if (!confirm('Delete this folder? Shortcuts will not be deleted.')) return;
        
        folders = folders.filter(f => f.id !== folderId);
        if (activeFolderId === folderId) {
            activeFolderId = 'default';
        }
        saveFolders();
        renderFolders();
    }

    // Manage folder shortcuts
    function manageFolderShortcuts(folderId) {
        const folder = folders.find(f => f.id === folderId);
        if (!folder) return;

        const shortcuts = document.querySelectorAll('#shortcutsContainer .shortcut');
        
        const dialog = document.createElement('div');
        dialog.className = 'folder-dialog manage-shortcuts-dialog';
        dialog.innerHTML = `
            <div class="folder-dialog-content">
                <h3>Manage "${folder.name}" Shortcuts</h3>
                <div class="shortcuts-checklist">
                    ${Array.from(shortcuts).map(s => {
                        const name = s.querySelector('.shortcut-name')?.textContent || 'Shortcut';
                        const id = s.dataset.id || s.dataset.name || name;
                        s.dataset.id = id; // Ensure ID is set
                        const isChecked = folder.shortcuts.includes(id);
                        return `
                            <label class="shortcut-check-item">
                                <input type="checkbox" value="${id}" ${isChecked ? 'checked' : ''}>
                                <span>${name}</span>
                            </label>
                        `;
                    }).join('')}
                </div>
                <div class="folder-dialog-actions">
                    <button class="btn-cancel">Cancel</button>
                    <button class="btn-save">Save</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);
        setTimeout(() => dialog.classList.add('visible'), 10);

        dialog.querySelector('.btn-cancel').addEventListener('click', () => dialog.remove());
        dialog.querySelector('.btn-save').addEventListener('click', () => {
            const checked = dialog.querySelectorAll('.shortcut-check-item input:checked');
            folder.shortcuts = Array.from(checked).map(cb => cb.value);
            saveFolders();
            renderFolders();
            dialog.remove();
        });
    }

    // Expose API
    window.shortcutFolders = {
        getFolders: () => [...folders],
        getActiveFolder: () => activeFolderId,
        setActiveFolder: (id) => {
            activeFolderId = id;
            saveFolders();
            renderFolders();
        },
        addShortcutToFolder: (shortcutId, folderId) => {
            const folder = folders.find(f => f.id === folderId);
            if (folder && !folder.shortcuts.includes(shortcutId)) {
                folder.shortcuts.push(shortcutId);
                saveFolders();
                renderFolders();
            }
        }
    };
});
