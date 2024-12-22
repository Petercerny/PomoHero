// Default times in seconds
const DEFAULT_FOCUS = 25 * 60;
const DEFAULT_SHORT_BREAK = 5 * 60;
const DEFAULT_LONG_BREAK = 20 * 60;

// Retrieve times from localStorage or use default values
let focusTime = parseInt(localStorage.getItem("focusTime")) || DEFAULT_FOCUS;
let shortBreakTime =
  parseInt(localStorage.getItem("shortBreakTime")) || DEFAULT_SHORT_BREAK;
let longBreakTime =
  parseInt(localStorage.getItem("longBreakTime")) || DEFAULT_LONG_BREAK;

// Current time and session type
let currentTime = parseInt(localStorage.getItem("currentTime")) || focusTime;
let sessionType = localStorage.getItem("sessionType") || "focus";
let focusSessions = parseInt(localStorage.getItem("focusSessions")) || 0;

// Timer interval and running state
let timerInterval;
let isRunning = false;

// DOM elements
const timerDisplay = document.getElementById("timer");
const startStopButton = document.getElementById("startStop");
const resetButton = document.getElementById("reset");
const focusCounterDisplay = document.getElementById("focusCounter");
const settingsButton = document.getElementById("settings");
const modal = document.getElementById("modal");
const overlay = document.getElementById("overlay");
const saveSettings = document.getElementById("saveSettings");
const cancelSettings = document.getElementById("cancelSettings");
const focusInput = document.getElementById("focusTime");
const shortBreakInput = document.getElementById("shortBreakTime");
const longBreakInput = document.getElementById("longBreakTime");

// Tabs for focus, short break, and long break
const tabs = {
  focus: document.getElementById("focusTab"),
  shortBreak: document.getElementById("shortBreakTab"),
  longBreak: document.getElementById("longBreakTab")
};

// Timer section and header elements
const timerSection = document.querySelector(".timer-section");
const header = document.querySelector("header");

// Save progress to localStorage
function saveProgress() {
  localStorage.setItem("currentTime", currentTime);
  localStorage.setItem("sessionType", sessionType);
  localStorage.setItem("focusSessions", focusSessions);
  localStorage.setItem("focusTime", focusTime);
  localStorage.setItem("shortBreakTime", shortBreakTime);
  localStorage.setItem("longBreakTime", longBreakTime);
}

// Update the timer display
function updateTimerDisplay() {
  const minutes = String(Math.floor(currentTime / 60)).padStart(2, "0");
  const seconds = String(currentTime % 60).padStart(2, "0");
  timerDisplay.textContent = `${minutes}:${seconds}`;
  updateTabTitle(minutes, seconds); // Update the tab title
}
// Update the tab title with the timer
function updateTabTitle(minutes, seconds) {
  document.title = `PomoHero - ${minutes}:${seconds}`;
}

// Start or stop the timer
function startTimer() {
  if (!isRunning) {
    isRunning = true;
    startStopButton.textContent = "Stop";
    timerInterval = setInterval(() => {
      currentTime--;
      updateTimerDisplay();
      saveProgress();

      if (currentTime <= 0) {
        clearInterval(timerInterval);
        isRunning = false;
        startStopButton.textContent = "Start";
        handleSessionEnd();
      }
    }, 1000);
  } else {
    clearInterval(timerInterval);
    isRunning = false;
    startStopButton.textContent = "Start";
  }
}

// Reset the timer
function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  startStopButton.textContent = "Start";
  setSession(sessionType);
}

// Handle the end of a session
function handleSessionEnd() {
  if (sessionType === "focus") {
    focusSessions++;
    focusCounterDisplay.textContent = `Focus Sessions: ${focusSessions}`;
    if (focusSessions % 4 === 0) {
      setSession("longBreak");
    } else {
      setSession("shortBreak");
    }
  } else {
    setSession("focus");
  }
  saveProgress();
}

// Set the current session type and update the timer section and header background
function setSession(type) {
  sessionType = type;
  if (type === "focus") {
    currentTime = focusTime;
    tabs.focus.classList.add("active");
    tabs.shortBreak.classList.remove("active");
    tabs.longBreak.classList.remove("active");
    timerSection.className = "timer-section focus-active"; // Update timer section background
    header.className = "focus-active"; // Update header background
  } else if (type === "shortBreak") {
    currentTime = shortBreakTime;
    tabs.focus.classList.remove("active");
    tabs.shortBreak.classList.add("active");
    tabs.longBreak.classList.remove("active");
    timerSection.className = "timer-section short-break-active"; // Update timer section background
    header.className = "short-break-active"; // Update header background
  } else if (type === "longBreak") {
    currentTime = longBreakTime;
    tabs.focus.classList.remove("active");
    tabs.shortBreak.classList.remove("active");
    tabs.longBreak.classList.add("active");
    timerSection.className = "timer-section long-break-active"; // Update timer section background
    header.className = "long-break-active"; // Update header background
  }
  updateTimerDisplay();
  saveProgress();
}

// Open settings modal
settingsButton.addEventListener("click", () => {
  modal.style.display = "block";
  overlay.style.display = "block";
  focusInput.value = focusTime / 60;
  shortBreakInput.value = shortBreakTime / 60;
  longBreakInput.value = longBreakTime / 60;
});

// Close settings modal without saving
cancelSettings.addEventListener("click", () => {
  modal.style.display = "none";
  overlay.style.display = "none";
});

// Save settings and close modal
saveSettings.addEventListener("click", () => {
  focusTime = parseInt(focusInput.value) * 60 || DEFAULT_FOCUS;
  shortBreakTime = parseInt(shortBreakInput.value) * 60 || DEFAULT_SHORT_BREAK;
  longBreakTime = parseInt(longBreakInput.value) * 60 || DEFAULT_LONG_BREAK;
  setSession("focus");
  modal.style.display = "none";
  overlay.style.display = "none";
});

// Close modal when clicking on the overlay
overlay.addEventListener("click", () => {
  modal.style.display = "none";
  overlay.style.display = "none";
});

// Prevent modal from closing when clicking inside the modal
modal.addEventListener("click", (event) => {
  event.stopPropagation(); // Stop the click event from reaching the overlay
});

// Start/Stop timer
startStopButton.addEventListener("click", startTimer);
// Reset timer
resetButton.addEventListener("click", resetTimer);
// Set focus session
tabs.focus.addEventListener("click", () => setSession("focus"));
// Set short break session
tabs.shortBreak.addEventListener("click", () => setSession("shortBreak"));
// Set long break session
tabs.longBreak.addEventListener("click", () => setSession("longBreak"));

// Initialize focus counter display
focusCounterDisplay.textContent = `Focus Sessions: ${focusSessions}`;
// Set initial session
setSession(sessionType);
// Update timer display
updateTimerDisplay();
// Reset the focus sessions counter
function resetFocusSessions() {
  focusSessions = 0; // Reset the counter
  focusCounterDisplay.textContent = `Focus Sessions: ${focusSessions}`; // Update the display
  saveProgress(); // Save the updated value to localStorage
}

// Add event listener for the reset counter button
document
  .getElementById("resetCounter")
  .addEventListener("click", resetFocusSessions);
