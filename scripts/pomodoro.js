/*
 * Material You New Tab
 * Copyright (c) 2023-2025 XengShi
 * Licensed under the GNU General Public License v3.0 (GPL-3.0)
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 */

// ----------------------------------- Pomodoro Timer ----------------------------------------
// DOM Variables
const pomodoroCont = document.getElementById("pomodoroCont");
const pomodoroContainer = document.getElementById("pomodoroContainer");
const pomodoroTimeDisplay = document.getElementById("pomodoroTimeDisplay");
const pomodoroModeLabel = document.getElementById("pomodoroModeLabel");
const pomodoroStartPauseBtn = document.getElementById("pomodoroStartPauseBtn");
const pomodoroResetBtn = document.getElementById("pomodoroResetBtn");
const pomodoroSkipBtn = document.getElementById("pomodoroSkipBtn");
const pomodoroWorkIndicators = document.getElementById("pomodoroWorkIndicators");

const pomodoroWorkInput = document.getElementById("pomodoroWorkInput");
const pomodoroShortBreakInput = document.getElementById("pomodoroShortBreakInput");
const pomodoroLongBreakInput = document.getElementById("pomodoroLongBreakInput");

// Pomodoro State
let pomodoroState = {
  mode: "work", // "work" | "shortBreak" | "longBreak"
  timeRemaining: 25 * 60, // in seconds
  isRunning: false,
  workCount: 0,
  isCycleComplete: false, // Tracks if a complete cycle (3 work sessions + breaks) is finished
  settings: {
    workDuration: 25,
    shortBreak: 5,
    longBreak: 15
  }
};

let pomodoroInterval = null;

// Helper: Format time as MM:SS
function formatPomodoroTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// Helper: Update display
function updatePomodoroDisplay() {
  pomodoroTimeDisplay.textContent = formatPomodoroTime(pomodoroState.timeRemaining);

  // Update mode label
  let modeKey = "pomodoroWork";
  if (pomodoroState.mode === "shortBreak") {
    modeKey = "pomodoroShortBreak";
  } else if (pomodoroState.mode === "longBreak") {
    modeKey = "pomodoroLongBreak";
  }
  pomodoroModeLabel.textContent = translations[currentLanguage]?.[modeKey] || translations["en"]?.[modeKey] || "Focus Time";

  // Update button text
  if (pomodoroState.isRunning) {
    pomodoroStartPauseBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><rect class="accentColor aiDarkIcons" width="100%" height="100%" rx="5"/><g style="transform: scale(0.5); transform-origin: center;"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></g></svg> ${translations[currentLanguage]?.pomodoroPause || translations["en"]?.pomodoroPause || "Pause"}`;
  } else {
    pomodoroStartPauseBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><rect class="accentColor aiDarkIcons" width="100%" height="100%" rx="5"/><g style="transform: scale(0.5); transform-origin: center;"><polygon points="5 3 19 12 5 21 5 3"/></g></svg> ${translations[currentLanguage]?.pomodoroStart || translations["en"]?.pomodoroStart || "Start"}`;
  }

  // Update Reset and Skip button text
  pomodoroResetBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><rect class="accentColor aiDarkIcons" width="100%" height="100%" rx="5"/><g style="transform: scale(0.5); transform-origin: center;"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></g></svg> ${translations[currentLanguage]?.pomodoroReset || translations["en"]?.pomodoroReset || "Reset"}`;
  pomodoroSkipBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><rect class="accentColor aiDarkIcons" width="100%" height="100%" rx="5"/><g style="transform: scale(0.5); transform-origin: center;"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></g></svg> ${translations[currentLanguage]?.pomodoroSkip || translations["en"]?.pomodoroSkip || "Skip"}`;

  // Update work indicators
  updatePomodoroIndicators();
}

// Helper: Update work count indicators
function updatePomodoroIndicators() {
  const totalDots = 3;
  const filledDots = pomodoroState.workCount % 3;
  pomodoroWorkIndicators.innerHTML = "";

  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement("span");
    dot.className = "pomodoro-indicator" + (i < filledDots ? " active" : "");
    pomodoroWorkIndicators.appendChild(dot);
  }
}

// Helper: Get duration for current mode
function getDurationForMode(mode) {
  switch (mode) {
    case "work":
      return pomodoroState.settings.workDuration * 60;
    case "shortBreak":
      return pomodoroState.settings.shortBreak * 60;
    case "longBreak":
      return pomodoroState.settings.longBreak * 60;
    default:
      return pomodoroState.settings.workDuration * 60;
  }
}

// Start/Pause button handler
pomodoroStartPauseBtn.addEventListener("click", function () {
  if (pomodoroState.isRunning) {
    pausePomodoro();
  } else {
    startPomodoro();
  }
});

// Start Pomodoro
function startPomodoro() {
  pomodoroState.isRunning = true;
  pomodoroInterval = setInterval(tickPomodoro, 1000);
  updatePomodoroDisplay();
  savePomodoroState(); // Save state for restoration after refresh
}

// Pause Pomodoro
function pausePomodoro() {
  pomodoroState.isRunning = false;
  clearInterval(pomodoroInterval);
  pomodoroInterval = null;
  updatePomodoroDisplay();
  savePomodoroState(); // Save state
}

// Reset button handler
pomodoroResetBtn.addEventListener("click", function () {
  pausePomodoro();
  pomodoroState.workCount = 0;
  pomodoroState.isCycleComplete = false;
  pomodoroState.mode = "work";
  pomodoroState.timeRemaining = getDurationForMode(pomodoroState.mode);
  updatePomodoroDisplay();
});

// Skip button handler
pomodoroSkipBtn.addEventListener("click", function (event) {
  event.stopPropagation(); // Prevent event bubbling to pomodoroCont
  // If a complete cycle has finished, Skip can start a new one
  if (pomodoroState.isCycleComplete) {
    pomodoroState.isCycleComplete = false;
    pomodoroState.workCount = 0;
  }
  completePomodoroMode(true);
});

// Tick function - runs every second
function tickPomodoro() {
  if (pomodoroState.timeRemaining > 0) {
    pomodoroState.timeRemaining--;
    updatePomodoroDisplay();
    savePomodoroState(); // Save state every tick to persist remaining time
  } else {
    completePomodoroMode(false);
  }
}

// Complete current mode and switch to next
function completePomodoroMode(skipped) {
  // In skip mode: pause the timer first, then switch states
  pausePomodoro();

  if (pomodoroState.mode === "work") {
    // Skip work phase: go directly to short break, don't increment workCount
    if (skipped) {
      pomodoroState.mode = "shortBreak";
    } else {
      // Work phase completed normally
      pomodoroState.workCount++;
      // After every 3 work sessions, use long break
      if (pomodoroState.workCount % 3 === 0) {
        pomodoroState.mode = "longBreak";
      } else {
        pomodoroState.mode = "shortBreak";
      }
    }
  } else if (pomodoroState.mode === "longBreak") {
    // Long break ended, mark cycle as complete, stop timer
    pomodoroState.isCycleComplete = true;
    pomodoroState.mode = "work";
    pomodoroState.timeRemaining = getDurationForMode(pomodoroState.mode);
    updatePomodoroDisplay();
    return; // Don't auto-start next round
  } else {
    // Short break ended (normal or skipped), return to work state
    pomodoroState.mode = "work";
  }

  pomodoroState.timeRemaining = getDurationForMode(pomodoroState.mode);
  updatePomodoroDisplay();

  // Auto-start next session
  startPomodoro();
}

// Save/Load Settings
function savePomodoroSettings() {
  localStorage.setItem("pomodoroSettings", JSON.stringify(pomodoroState.settings));
}

// Save complete state (including timer state)
function savePomodoroState() {
  const stateToSave = {
    mode: pomodoroState.mode,
    timeRemaining: pomodoroState.timeRemaining,
    isRunning: pomodoroState.isRunning,
    workCount: pomodoroState.workCount,
    isCycleComplete: pomodoroState.isCycleComplete
  };
  localStorage.setItem("pomodoroState", JSON.stringify(stateToSave));
}

// Load state and restore timer
function loadPomodoroState() {
  try {
    const saved = localStorage.getItem("pomodoroState");
    if (saved) {
      const parsed = JSON.parse(saved);
      pomodoroState.mode = parsed.mode || "work";
      pomodoroState.timeRemaining = parsed.timeRemaining || pomodoroState.settings.workDuration * 60;
      pomodoroState.workCount = parsed.workCount || 0;
      pomodoroState.isCycleComplete = parsed.isCycleComplete || false;

      // If it was running before, restore the timer
      if (parsed.isRunning) {
        startPomodoro();
      }
    }
  } catch (error) {
    console.error("Error loading pomodoro state:", error);
  }
}

function loadPomodoroSettings() {
  try {
    const saved = localStorage.getItem("pomodoroSettings");
    if (saved) {
      const parsed = JSON.parse(saved);
      pomodoroState.settings = {
        workDuration: parsed.workDuration || 25,
        shortBreak: parsed.shortBreak || 5,
        longBreak: parsed.longBreak || 15
      };
    }
  } catch (error) {
    console.error("Error loading pomodoro settings:", error);
  }
}

// Apply settings from inputs
function applyPomodoroSettings() {
  pomodoroState.settings.workDuration = parseInt(pomodoroWorkInput.value) || 25;
  pomodoroState.settings.shortBreak = parseInt(pomodoroShortBreakInput.value) || 5;
  pomodoroState.settings.longBreak = parseInt(pomodoroLongBreakInput.value) || 15;

  // Only reset time if not running
  if (!pomodoroState.isRunning) {
    pomodoroState.timeRemaining = getDurationForMode(pomodoroState.mode);
  }

  savePomodoroSettings();
  updatePomodoroDisplay();
}

// Input event listeners for settings
pomodoroWorkInput.addEventListener("change", applyPomodoroSettings);
pomodoroShortBreakInput.addEventListener("change", applyPomodoroSettings);
pomodoroLongBreakInput.addEventListener("change", applyPomodoroSettings);

// Initialize settings display
function initializePomodoroDisplay() {
  pomodoroWorkInput.value = pomodoroState.settings.workDuration;
  pomodoroShortBreakInput.value = pomodoroState.settings.shortBreak;
  pomodoroLongBreakInput.value = pomodoroState.settings.longBreak;
}

// Toggle menu visibility
pomodoroCont.addEventListener("click", function (event) {
  const isMenuVisible = pomodoroContainer.style.display === "grid";

  if (!isMenuVisible) {
    pomodoroContainer.style.display = "grid";
    pomodoroContainer.style.animation = "panelScaleIn 200ms cubic-bezier(0.4, 0, 0.2, 1) forwards";
    pomodoroCont.classList.add("menu-open");
    pomodoroWorkInput.focus();
  } else {
    pomodoroContainer.style.display = "none";
    pomodoroCont.classList.remove("menu-open");
  }
});

// Close menu when clicking outside
document.addEventListener("click", function (event) {
  const isClickInside =
    pomodoroContainer.contains(event.target) || pomodoroCont.contains(event.target);

  if (!isClickInside && pomodoroContainer.style.display === "grid") {
    pomodoroContainer.style.display = "none";
    pomodoroCont.classList.remove("menu-open");
  }

  event.stopPropagation();
});

// ----------------------- Pomodoro Toggle -----------------------------
document.addEventListener("DOMContentLoaded", function () {
  const pomodoroCheckbox = document.getElementById("pomodoroCheckbox");

  pomodoroCheckbox.addEventListener("change", function () {
    saveCheckboxState("pomodoroCheckboxState", pomodoroCheckbox);
    if (pomodoroCheckbox.checked) {
      pomodoroCont.style.display = "flex";
      saveDisplayStatus("pomodoroDisplayStatus", "flex");
    } else {
      pomodoroCont.style.display = "none";
      saveDisplayStatus("pomodoroDisplayStatus", "none");
    }
  });

  loadCheckboxState("pomodoroCheckboxState", pomodoroCheckbox);
  loadDisplayStatus("pomodoroDisplayStatus", pomodoroCont);

  // Always hide the panel on page load (unless it was explicitly open)
  pomodoroContainer.style.display = "none";
});

// Initialize on load
loadPomodoroSettings();
loadPomodoroState(); // Restore timer state
initializePomodoroDisplay();
updatePomodoroDisplay();
