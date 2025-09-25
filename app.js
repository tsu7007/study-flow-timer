// StudyFlow App - Complete functionality
class StudyFlowApp {
    constructor() {
        this.timerModes = {
            pomodoro: { study: 25, shortBreak: 5, longBreak: 15 },
            custom: { study: 60, shortBreak: 10, longBreak: 20 },
            deepWork: { study: 90, shortBreak: 20, longBreak: 30 }
        };
        
        this.motivationalMessages = [
            "Great job! Time for a well-deserved break.",
            "You're making excellent progress!",
            "Take a moment to stretch and hydrate.",
            "Your focus is paying off!",
            "Keep up the momentum!",
            "You're building great habits!",
            "Time to recharge for the next session.",
            "Consistency is key to success!",
            "Every session counts towards your goals!",
            "You're developing strong discipline!"
        ];

        this.state = {
            currentMode: 'pomodoro',
            isRunning: false,
            isPaused: false,
            isBreak: false,
            timeLeft: 25 * 60, // seconds
            totalTime: 25 * 60,
            sessionCount: 1,
            completedSessions: 0,
            tasks: [],
            settings: {
                soundEnabled: true,
                autoStartBreaks: true,
                customStudyTime: 60,
                customBreakTime: 10
            }
        };

        this.stats = {
            totalStudyTime: 0,
            totalSessions: 0,
            totalTasksCompleted: 0,
            todayStudyTime: 0,
            todayTasks: 0,
            currentStreak: 0,
            bestStreak: 0,
            lastActiveDate: null
        };

        this.timerInterval = null;
        this.breakInterval = null;
        this.draggedTask = null;

        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.updateDisplay();
        this.updateStats();
        this.renderTasks();
        this.updateTimerMode();
        this.checkDailyReset();
    }

    // Data persistence
    loadData() {
        const savedState = localStorage.getItem('studyflow-state');
        const savedStats = localStorage.getItem('studyflow-stats');
        const savedTasks = localStorage.getItem('studyflow-tasks');
        const savedSettings = localStorage.getItem('studyflow-settings');

        if (savedState) {
            const state = JSON.parse(savedState);
            this.state = { ...this.state, ...state, isRunning: false, isPaused: false };
        }

        if (savedStats) {
            this.stats = { ...this.stats, ...JSON.parse(savedStats) };
        }

        if (savedTasks) {
            this.state.tasks = JSON.parse(savedTasks);
        }

        if (savedSettings) {
            this.state.settings = { ...this.state.settings, ...JSON.parse(savedSettings) };
        }
    }

    saveData() {
        localStorage.setItem('studyflow-state', JSON.stringify({
            currentMode: this.state.currentMode,
            sessionCount: this.state.sessionCount,
            completedSessions: this.state.completedSessions
        }));
        localStorage.setItem('studyflow-stats', JSON.stringify(this.stats));
        localStorage.setItem('studyflow-tasks', JSON.stringify(this.state.tasks));
        localStorage.setItem('studyflow-settings', JSON.stringify(this.state.settings));
    }

    // Event listeners
    setupEventListeners() {
        // Timer controls
        document.getElementById('startBtn').addEventListener('click', () => this.startTimer());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pauseTimer());
        document.getElementById('stopBtn').addEventListener('click', () => this.stopTimer());

        // Mode selection
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchMode(e.target.dataset.mode));
        });

        // Task management
        document.getElementById('addTaskBtn').addEventListener('click', () => this.addTask());
        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // Modals
        document.getElementById('statsBtn').addEventListener('click', () => this.openModal('statsModal'));
        document.getElementById('settingsBtn').addEventListener('click', () => this.openModal('settingsModal'));
        document.getElementById('closeStatsModal').addEventListener('click', () => this.closeModal('statsModal'));
        document.getElementById('closeSettingsModal').addEventListener('click', () => this.closeModal('settingsModal'));

        // Settings
        document.getElementById('customStudyTime').addEventListener('change', (e) => {
            this.state.settings.customStudyTime = parseInt(e.target.value);
            this.updateTimerMode();
            this.saveData();
        });
        document.getElementById('customBreakTime').addEventListener('change', (e) => {
            this.state.settings.customBreakTime = parseInt(e.target.value);
            this.saveData();
        });
        document.getElementById('soundEnabled').addEventListener('change', (e) => {
            this.state.settings.soundEnabled = e.target.checked;
            this.saveData();
        });
        document.getElementById('autoStartBreaks').addEventListener('change', (e) => {
            this.state.settings.autoStartBreaks = e.target.checked;
            this.saveData();
        });

        // Export stats
        document.getElementById('exportStatsBtn').addEventListener('click', () => this.exportStats());

        // Break modal
        document.getElementById('skipBreakBtn').addEventListener('click', () => this.skipBreak());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Close modals on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });

        // Drag and drop for tasks
        this.setupDragAndDrop();
    }

    // Timer functionality
    startTimer() {
        if (this.state.isPaused) {
            this.state.isPaused = false;
        } else {
            this.state.timeLeft = this.state.totalTime;
        }
        
        this.state.isRunning = true;
        document.getElementById('timerLabel').textContent = this.state.isBreak ? 'Break time' : 'Focus time';
        document.querySelector('.timer-progress').classList.add('running');
        
        this.timerInterval = setInterval(() => {
            this.state.timeLeft--;
            this.updateDisplay();
            
            if (this.state.timeLeft <= 0) {
                this.timerComplete();
            }
        }, 1000);
        
        this.updateTimerButtons();
    }

    pauseTimer() {
        this.state.isRunning = false;
        this.state.isPaused = true;
        clearInterval(this.timerInterval);
        document.getElementById('timerLabel').textContent = 'Paused';
        document.querySelector('.timer-progress').classList.remove('running');
        this.updateTimerButtons();
    }

    stopTimer() {
        this.state.isRunning = false;
        this.state.isPaused = false;
        this.state.isBreak = false;
        clearInterval(this.timerInterval);
        clearInterval(this.breakInterval);
        
        this.updateTimerMode();
        this.updateTimerButtons();
        this.closeModal('breakModal');
        document.getElementById('timerLabel').textContent = 'Ready to start';
        document.querySelector('.timer-progress').classList.remove('running');
    }

    timerComplete() {
        clearInterval(this.timerInterval);
        this.state.isRunning = false;
        document.querySelector('.timer-progress').classList.remove('running');
        
        if (this.state.settings.soundEnabled) {
            this.playNotificationSound();
        }
        
        if (this.state.isBreak) {
            // Break completed, start new study session
            this.state.isBreak = false;
            this.state.sessionCount++;
            this.updateTimerMode();
            document.getElementById('timerLabel').textContent = 'Break complete! Ready for next session';
            this.closeModal('breakModal');
        } else {
            // Study session completed
            this.state.completedSessions++;
            this.stats.totalSessions++;
            this.stats.totalStudyTime += this.state.totalTime / 60; // Convert to minutes
            this.stats.todayStudyTime += this.state.totalTime / 60;
            
            this.startBreakSession();
        }
        
        this.updateStats();
        this.updateTimerButtons();
        this.saveData();
    }

    startBreakSession() {
        this.state.isBreak = true;
        const breakDuration = this.getBreakDuration();
        this.state.timeLeft = breakDuration * 60;
        this.state.totalTime = breakDuration * 60;
        
        // Show break modal with motivational message
        const message = this.motivationalMessages[Math.floor(Math.random() * this.motivationalMessages.length)];
        document.getElementById('breakMessage').textContent = message;
        this.openModal('breakModal');
        
        this.updateBreakDisplay();
        
        if (this.state.settings.autoStartBreaks) {
            setTimeout(() => this.startTimer(), 2000);
        }
        
        // Update break timer display
        this.breakInterval = setInterval(() => {
            this.updateBreakDisplay();
        }, 1000);
    }

    getBreakDuration() {
        const mode = this.timerModes[this.state.currentMode];
        if (this.state.currentMode === 'custom') {
            return this.state.settings.customBreakTime;
        }
        
        // For Pomodoro: every 4th break is long
        if (this.state.currentMode === 'pomodoro' && this.state.completedSessions % 4 === 0) {
            return mode.longBreak;
        }
        
        return mode.shortBreak;
    }

    skipBreak() {
        clearInterval(this.breakInterval);
        this.closeModal('breakModal');
        this.state.isBreak = false;
        this.state.sessionCount++;
        this.updateTimerMode();
        document.getElementById('timerLabel').textContent = 'Break skipped! Ready for next session';
    }

    switchMode(mode) {
        this.stopTimer();
        this.state.currentMode = mode;
        this.updateModeButtons();
        this.updateTimerMode();
        this.saveData();
    }

    updateTimerMode() {
        let duration;
        if (this.state.currentMode === 'custom') {
            duration = this.state.settings.customStudyTime;
        } else {
            duration = this.timerModes[this.state.currentMode].study;
        }
        
        this.state.timeLeft = duration * 60;
        this.state.totalTime = duration * 60;
        this.updateDisplay();
    }

    // Display updates
    updateDisplay() {
        const minutes = Math.floor(this.state.timeLeft / 60);
        const seconds = this.state.timeLeft % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('timerDisplay').textContent = timeString;
        document.getElementById('sessionType').textContent = this.state.isBreak ? 'Break Session' : 'Study Session';
        document.getElementById('sessionCount').textContent = `Session ${this.state.sessionCount}`;
        
        // Update progress circle
        const progress = ((this.state.totalTime - this.state.timeLeft) / this.state.totalTime) * 754;
        document.getElementById('timerProgress').style.strokeDashoffset = 754 - progress;
        
        document.title = `${timeString} - StudyFlow`;
    }

    updateBreakDisplay() {
        const minutes = Math.floor(this.state.timeLeft / 60);
        const seconds = this.state.timeLeft % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('breakTimeDisplay').textContent = timeString;
    }

    updateTimerButtons() {
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const stopBtn = document.getElementById('stopBtn');
        
        if (this.state.isRunning) {
            startBtn.style.display = 'none';
            pauseBtn.style.display = 'inline-flex';
            stopBtn.style.display = 'inline-flex';
        } else if (this.state.isPaused) {
            startBtn.style.display = 'inline-flex';
            startBtn.innerHTML = '▶️ Resume';
            pauseBtn.style.display = 'none';
            stopBtn.style.display = 'inline-flex';
        } else {
            startBtn.style.display = 'inline-flex';
            startBtn.innerHTML = '▶️ Start';
            pauseBtn.style.display = 'none';
            stopBtn.style.display = 'inline-flex';
        }
    }

    updateModeButtons() {
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === this.state.currentMode);
        });
    }

    // Task management
    addTask() {
        const input = document.getElementById('taskInput');
        const taskText = input.value.trim();
        
        if (taskText) {
            const task = {
                id: Date.now(),
                text: taskText,
                completed: false,
                createdAt: new Date().toISOString()
            };
            
            this.state.tasks.push(task);
            input.value = '';
            this.renderTasks();
            this.updateTaskStats();
            this.saveData();
        }
    }

    toggleTask(taskId) {
        const task = this.state.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            if (task.completed) {
                this.stats.totalTasksCompleted++;
                this.stats.todayTasks++;
            } else {
                this.stats.totalTasksCompleted--;
                this.stats.todayTasks--;
            }
            this.renderTasks();
            this.updateTaskStats();
            this.updateStats();
            this.saveData();
        }
    }

    deleteTask(taskId) {
        const taskIndex = this.state.tasks.findIndex(t => t.id === taskId);
        if (taskIndex > -1) {
            const task = this.state.tasks[taskIndex];
            if (task.completed) {
                this.stats.totalTasksCompleted--;
                this.stats.todayTasks--;
            }
            this.state.tasks.splice(taskIndex, 1);
            this.renderTasks();
            this.updateTaskStats();
            this.updateStats();
            this.saveData();
        }
    }

    renderTasks() {
        const tasksList = document.getElementById('tasksList');
        tasksList.innerHTML = '';
        
        this.state.tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskElement.draggable = true;
            taskElement.dataset.taskId = task.id;
            
            taskElement.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${task.text}</span>
                <button class="task-delete">🗑️</button>
            `;
            
            // Event listeners for task actions
            const checkbox = taskElement.querySelector('.task-checkbox');
            const deleteBtn = taskElement.querySelector('.task-delete');
            
            checkbox.addEventListener('change', () => this.toggleTask(task.id));
            deleteBtn.addEventListener('click', () => this.deleteTask(task.id));
            
            tasksList.appendChild(taskElement);
        });
    }

    updateTaskStats() {
        const completed = this.state.tasks.filter(t => t.completed).length;
        const total = this.state.tasks.length;
        
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('totalTasks').textContent = total;
    }

    // Drag and drop for tasks
    setupDragAndDrop() {
        const tasksList = document.getElementById('tasksList');
        
        tasksList.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('task-item')) {
                this.draggedTask = e.target;
                e.target.classList.add('dragging');
            }
        });
        
        tasksList.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('task-item')) {
                e.target.classList.remove('dragging');
                this.draggedTask = null;
            }
        });
        
        tasksList.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = this.getDragAfterElement(tasksList, e.clientY);
            if (afterElement == null) {
                tasksList.appendChild(this.draggedTask);
            } else {
                tasksList.insertBefore(this.draggedTask, afterElement);
            }
        });
        
        tasksList.addEventListener('drop', (e) => {
            e.preventDefault();
            this.reorderTasks();
        });
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    reorderTasks() {
        const taskElements = document.querySelectorAll('.task-item');
        const newOrder = [];
        
        taskElements.forEach(element => {
            const taskId = parseInt(element.dataset.taskId);
            const task = this.state.tasks.find(t => t.id === taskId);
            if (task) newOrder.push(task);
        });
        
        this.state.tasks = newOrder;
        this.saveData();
    }

    // Statistics
    updateStats() {
        // Update footer stats
        const studyHours = Math.floor(this.stats.todayStudyTime / 60);
        const studyMinutes = Math.floor(this.stats.todayStudyTime % 60);
        document.getElementById('todayStudyTime').textContent = `${studyHours}h ${studyMinutes}m`;
        document.getElementById('currentStreak').textContent = `${this.stats.currentStreak} days`;
        document.getElementById('todayTasks').textContent = this.stats.todayTasks;
        
        // Update modal stats
        const totalHours = Math.floor(this.stats.totalStudyTime / 60);
        const totalMinutes = Math.floor(this.stats.totalStudyTime % 60);
        document.getElementById('totalStudyTime').textContent = `${totalHours}h ${totalMinutes}m`;
        document.getElementById('totalSessions').textContent = this.stats.totalSessions;
        document.getElementById('totalTasksCompleted').textContent = this.stats.totalTasksCompleted;
        document.getElementById('bestStreak').textContent = `${this.stats.bestStreak} days`;
        
        // Update settings values
        document.getElementById('customStudyTime').value = this.state.settings.customStudyTime;
        document.getElementById('customBreakTime').value = this.state.settings.customBreakTime;
        document.getElementById('soundEnabled').checked = this.state.settings.soundEnabled;
        document.getElementById('autoStartBreaks').checked = this.state.settings.autoStartBreaks;
    }

    checkDailyReset() {
        const today = new Date().toDateString();
        const lastActive = this.stats.lastActiveDate;
        
        if (lastActive !== today) {
            if (lastActive) {
                const lastDate = new Date(lastActive);
                const currentDate = new Date(today);
                const daysDiff = Math.floor((currentDate - lastDate) / (1000 * 60 * 60 * 24));
                
                if (daysDiff === 1) {
                    // Consecutive day
                    this.stats.currentStreak++;
                    if (this.stats.currentStreak > this.stats.bestStreak) {
                        this.stats.bestStreak = this.stats.currentStreak;
                    }
                } else if (daysDiff > 1) {
                    // Streak broken
                    this.stats.currentStreak = 0;
                }
            } else {
                // First time user
                this.stats.currentStreak = 0;
            }
            
            // Reset daily stats
            this.stats.todayStudyTime = 0;
            this.stats.todayTasks = 0;
            this.stats.lastActiveDate = today;
            this.saveData();
        }
    }

    exportStats() {
        const data = {
            totalStudyTime: this.stats.totalStudyTime,
            totalSessions: this.stats.totalSessions,
            totalTasksCompleted: this.stats.totalTasksCompleted,
            currentStreak: this.stats.currentStreak,
            bestStreak: this.stats.bestStreak,
            exportDate: new Date().toISOString()
        };
        
        const csv = this.convertToCSV(data);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `studyflow-stats-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    convertToCSV(data) {
        const headers = Object.keys(data).join(',');
        const values = Object.values(data).join(',');
        return `${headers}\n${values}`;
    }

    // Modal handling
    openModal(modalId) {
        document.getElementById(modalId).classList.remove('hidden');
        if (modalId === 'statsModal') {
            this.updateStats();
        }
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
    }

    // Keyboard shortcuts
    handleKeyboardShortcuts(e) {
        // Don't trigger shortcuts when typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                if (this.state.isRunning) {
                    this.pauseTimer();
                } else {
                    this.startTimer();
                }
                break;
            case 'Escape':
                this.stopTimer();
                break;
            case 'KeyR':
                if (e.ctrlKey || e.metaKey) return;
                e.preventDefault();
                this.stopTimer();
                break;
            case 'KeyS':
                if (e.ctrlKey || e.metaKey) return;
                e.preventDefault();
                this.openModal('settingsModal');
                break;
            case 'KeyT':
                e.preventDefault();
                document.getElementById('taskInput').focus();
                break;
        }
    }

    // Audio
    playNotificationSound() {
        const audio = document.getElementById('notificationSound');
        audio.currentTime = 0;
        audio.play().catch(e => console.log('Audio play failed:', e));
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.studyFlowApp = new StudyFlowApp();
});

// Handle page visibility changes to save data
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && window.studyFlowApp) {
        window.studyFlowApp.saveData();
    }
});

// Save data before page unload
window.addEventListener('beforeunload', () => {
    if (window.studyFlowApp) {
        window.studyFlowApp.saveData();
    }
});