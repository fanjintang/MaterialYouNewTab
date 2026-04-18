/*
 * Material You NewTab
 * Copyright (c) 2023-2025 XengShi
 * Licensed under the GNU General Public License v3.0 (GPL-3.0)
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 */

// Date Reminders - Important dates and countdowns
document.addEventListener('DOMContentLoaded', function () {
    // Storage key
    const REMINDERS_KEY = 'dateReminders';

    // Current reminders
    let reminders = [];

    // Initialize
    init();

    function init() {
        loadReminders();
        createRemindersUI();
        checkReminders();
        // Check every minute
        setInterval(checkReminders, 60000);
    }

    // Load reminders from localStorage
    function loadReminders() {
        const saved = localStorage.getItem(REMINDERS_KEY);
        if (saved) {
            reminders = JSON.parse(saved);
        } else {
            // Default reminders
            reminders = [];
        }
    }

    // Save reminders to localStorage
    function saveReminders() {
        localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
    }

    // Create reminders UI
    function createRemindersUI() {
        // Check if already exists
        if (document.getElementById('dateRemindersCont')) return;

        // Create icon container
        const remindersCont = document.createElement('div');
        remindersCont.id = 'dateRemindersCont';
        remindersCont.className = 'reminders-cont';
        remindersCont.innerHTML = `
            <svg id="remindersIcon" xmlns="http://www.w3.org/2000/svg" class="dot-icon" width="36" height="36" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
            </svg>
            <span class="tooltip-text" id="remindersHover">Reminders</span>
            <span class="reminders-badge" id="remindersBadge" style="display: none;"></span>
        `;

        // Create panel
        const remindersPanel = document.createElement('div');
        remindersPanel.id = 'remindersPanel';
        remindersPanel.className = 'reminders-panel';
        remindersPanel.style.display = 'none';
        remindersPanel.innerHTML = `
            <div class="reminders-header">
                <h3 id="remindersHeading">Important Dates</h3>
                <button class="add-reminder-btn" id="addReminderBtn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
            </div>
            <div class="reminders-list" id="remindersList"></div>
        `;

        // Insert into body (after todo list)
        const todoListCont = document.getElementById('todoListCont');
        if (todoListCont) {
            todoListCont.insertAdjacentElement('afterend', remindersCont);
        } else {
            document.body.appendChild(remindersCont);
        }
        document.body.appendChild(remindersPanel);

        bindEvents();
        renderReminders();
    }

    // Bind events
    function bindEvents() {
        // Toggle panel
        const remindersCont = document.getElementById('dateRemindersCont');
        const remindersPanel = document.getElementById('remindersPanel');
        
        if (remindersCont) {
            remindersCont.addEventListener('click', () => {
                const isVisible = remindersPanel.style.display === 'block';
                remindersPanel.style.display = isVisible ? 'none' : 'block';
                remindersCont.classList.toggle('active', !isVisible);
                if (!isVisible) renderReminders();
            });
        }

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!remindersCont?.contains(e.target) && !remindersPanel?.contains(e.target)) {
                remindersPanel.style.display = 'none';
                remindersCont?.classList.remove('active');
            }
        });

        // Add reminder button
        document.getElementById('addReminderBtn')?.addEventListener('click', showAddReminderDialog);
    }

    // Calculate days until date
    function getDaysUntil(dateStr) {
        const target = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        target.setHours(0, 0, 0, 0);
        
        const diffTime = target - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    // Format date
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('zh-CN', { 
            month: 'short', 
            day: 'numeric',
            year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
        });
    }

    // Get reminder text
    function getReminderText(days) {
        if (days < 0) return `已过去 ${Math.abs(days)} 天`;
        if (days === 0) return '就是今天！';
        if (days === 1) return '明天';
        if (days <= 7) return `${days} 天后`;
        return `${days} 天后`;
    }

    // Get urgency class
    function getUrgencyClass(days) {
        if (days < 0) return 'past';
        if (days === 0) return 'today';
        if (days <= 3) return 'urgent';
        if (days <= 7) return 'soon';
        return 'normal';
    }

    // Render reminders list
    function renderReminders() {
        const list = document.getElementById('remindersList');
        if (!list) return;

        // Sort by days until
        const sorted = [...reminders].sort((a, b) => {
            return getDaysUntil(a.date) - getDaysUntil(b.date);
        });

        if (sorted.length === 0) {
            list.innerHTML = `
                <div class="reminders-empty">
                    <p id="noRemindersText">No important dates</p>
                    <p class="reminders-hint">Click + to add one</p>
                </div>
            `;
            return;
        }

        list.innerHTML = sorted.map(reminder => {
            const days = getDaysUntil(reminder.date);
            return `
                <div class="reminder-item ${getUrgencyClass(days)}" data-id="${reminder.id}">
                    <div class="reminder-info">
                        <div class="reminder-title">${reminder.title}</div>
                        <div class="reminder-date">${formatDate(reminder.date)} · ${getReminderText(days)}</div>
                    </div>
                    <div class="reminder-actions">
                        <button class="reminder-edit" data-id="${reminder.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="reminder-delete" data-id="${reminder.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Bind edit/delete events
        list.querySelectorAll('.reminder-edit').forEach(btn => {
            btn.addEventListener('click', () => editReminder(btn.dataset.id));
        });
        list.querySelectorAll('.reminder-delete').forEach(btn => {
            btn.addEventListener('click', () => deleteReminder(btn.dataset.id));
        });
    }

    // Show add reminder dialog
    function showAddReminderDialog() {
        const today = new Date().toISOString().split('T')[0];
        const dialog = document.createElement('div');
        dialog.className = 'reminder-dialog';
        dialog.innerHTML = `
            <div class="reminder-dialog-content">
                <h3 id="addReminderTitle">Add Important Date</h3>
                <input type="text" id="reminderTitle" placeholder="Event name (e.g., Birthday, Anniversary)" maxlength="50">
                <input type="date" id="reminderDate" value="${today}">
                <div class="reminder-dialog-actions">
                    <button class="btn-cancel" id="cancelReminder">Cancel</button>
                    <button class="btn-save" id="saveReminder">Save</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);
        setTimeout(() => dialog.classList.add('visible'), 10);

        document.getElementById('cancelReminder').addEventListener('click', () => dialog.remove());
        document.getElementById('saveReminder').addEventListener('click', () => {
            const title = document.getElementById('reminderTitle').value.trim();
            const date = document.getElementById('reminderDate').value;
            if (title && date) {
                addReminder(title, date);
                dialog.remove();
            }
        });

        document.getElementById('reminderTitle').focus();
    }

    // Add reminder
    function addReminder(title, date) {
        const reminder = {
            id: 'reminder_' + Date.now(),
            title,
            date,
            createdAt: new Date().toISOString()
        };
        reminders.push(reminder);
        saveReminders();
        renderReminders();
        checkReminders();
    }

    // Edit reminder
    function editReminder(id) {
        const reminder = reminders.find(r => r.id === id);
        if (!reminder) return;

        const dialog = document.createElement('div');
        dialog.className = 'reminder-dialog';
        dialog.innerHTML = `
            <div class="reminder-dialog-content">
                <h3>Edit Date</h3>
                <input type="text" id="editReminderTitle" value="${reminder.title}" maxlength="50">
                <input type="date" id="editReminderDate" value="${reminder.date}">
                <div class="reminder-dialog-actions">
                    <button class="btn-cancel" id="cancelEdit">Cancel</button>
                    <button class="btn-save" id="saveEdit">Save</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);
        setTimeout(() => dialog.classList.add('visible'), 10);

        document.getElementById('cancelEdit').addEventListener('click', () => dialog.remove());
        document.getElementById('saveEdit').addEventListener('click', () => {
            const title = document.getElementById('editReminderTitle').value.trim();
            const date = document.getElementById('editReminderDate').value;
            if (title && date) {
                reminder.title = title;
                reminder.date = date;
                saveReminders();
                renderReminders();
                checkReminders();
                dialog.remove();
            }
        });
    }

    // Delete reminder
    function deleteReminder(id) {
        if (!confirm('Delete this reminder?')) return;
        reminders = reminders.filter(r => r.id !== id);
        saveReminders();
        renderReminders();
        checkReminders();
    }

    // Check reminders and update badge
    function checkReminders() {
        const badge = document.getElementById('remindersBadge');
        if (!badge) return;

        // Count upcoming reminders (within 7 days)
        const upcoming = reminders.filter(r => {
            const days = getDaysUntil(r.date);
            return days >= 0 && days <= 7;
        });

        if (upcoming.length > 0) {
            badge.textContent = upcoming.length;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }

    // Expose API
    window.dateReminders = {
        getReminders: () => [...reminders],
        add: addReminder,
        delete: deleteReminder,
        refresh: checkReminders
    };
});
