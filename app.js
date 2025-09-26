// Enhanced StudyFlow App with Scientific Focus Optimization
class StudyFlowApp {
    constructor() {
        // Timer modes with scientific backing
        this.timerModes = {
            pomodoro: { study: 25, shortBreak: 5, longBreak: 15, description: "Classic 25-minute focus blocks" },
            deepWork: { study: 90, shortBreak: 20, longBreak: 30, description: "Extended 90-minute deep focus sessions" },
            ultradian: { study: 120, shortBreak: 20, longBreak: 30, description: "Natural 120-minute attention cycles" },
            flowState: { study: 180, shortBreak: 30, longBreak: 45, description: "Extended flow state sessions" },
            custom: { study: 60, shortBreak: 10, longBreak: 20, description: "Customizable session lengths" }
        };

        // Focus sounds for concentration
        this.focusSounds = {
            'brown-noise': 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgyBjmBzvLZcyMFl',
            'forest': 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgyBjmBzvLZcyMFl',
            'rain': 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgyBjmBzvLZcyMFl',
            'ocean': 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgyBjmBzvLZcyMFl'
        };

        // Break activities based on wellness research
        this.breakActivities = [
            { title: "4-7-8 Breathing", description: "Inhale 4s, hold 7s, exhale 8s", duration: 60, icon: "🫁" },
            { title: "Eye Rest (20-20-20)", description: "Look at something 20 feet away for 20 seconds", duration: 20, icon: "👁️" },
            { title: "Neck Stretch", description: "Gently stretch neck muscles side to side", duration: 30, icon: "🤸" },
            { title: "Hydration Check", description: "Drink a glass of water", duration: 15, icon: "💧" },
            { title: "Posture Reset", description: "Adjust your sitting position and stretch", duration: 10, icon: "🪑" },
            { title: "Mental Reset", description: "Clear your mind for 30 seconds", duration: 30, icon: "🧘" },
            { title: "Quick Walk", description: "Take a few steps around your space", duration: 45, icon: "🚶" },
            { title: "Hand Exercises", description: "Stretch fingers and wrists", duration: 25, icon: "✋" }
        ];

        // Motivational messages based on psychology
        this.motivationalMessages = [
            "Excellent focus! Your brain is in the zone.",
            "You're building powerful concentration habits.",
            "Deep work is your superpower.",
            "Every focused minute compounds into mastery.",
            "Your attention is your most valuable resource.",
            "Flow state achieved - you're in the zone!",
            "Consistent practice creates lasting change.",
            "Your future self thanks you for this focus.",
            "Progress, not perfection. Keep going!",
            "You're strengthening your attention muscle."
        ];

        // Achievement system
        this.achievements = [
            { id: "first_session", title: "First Steps", description: "Complete your first study session", icon: "🎯", earned: false },
            { id: "daily_goal", title: "Daily Warrior", description: "Study for 2 hours in one day", icon: "⚡", earned: false },
            { id: "week_streak", title: "Consistency King", description: "Study 7 days in a row", icon: "👑", earned: false },
            { id: "deep_work", title: "Deep Thinker", description: "Complete a 90-minute deep work session", icon: "🧠", earned: false },
            { id: "idea_collector", title: "Idea Collector", description: "Capture 50 ideas", icon: "💡", earned: false },
            { id: "flow_master", title: "Flow Master", description: "Complete 10 flow state sessions", icon: "🌊", earned: false },
            { id: "focus_champion", title: "Focus Champion", description: "Achieve a focus score of 90+", icon: "🏆", earned: false },
            { id: "wellness_warrior", title: "Wellness Warrior", description: "Complete 20 break activities", icon: "💪", earned: false }
        ];

        this.state = {
            currentMode: 'pomodoro',
            isRunning: false,
            isPaused: false,
            isBreak: false,
            timeLeft: 25 * 60,
            totalTime: 25 * 60,
            sessionCount: 1,
            completedSessions: 0,
            tasks: [],
            ideas: [],
            focusScore: 0,
            currentBreakActivity: 0,
            settings: {
                soundEnabled: true,
                autoStartBreaks: true,
                customStudyTime: 60,
                customBreakTime: 10,
                eyeReminders: true,
                postureReminders: true,
                hydrationReminders: true,
                distractionFreeMode: false,
                focusSound: '',
                volume: 50
            }
        };

        this.stats = {
            totalStudyTime: 0,
            totalSessions: 0,
            totalTasksCompleted: 0,
            todayStudyTime: 0,
            todayTasks: 0,
            todayIdeas: 0,
            currentStreak: 0,
            bestStreak: 0,
            lastActiveDate: null,
            focusSessions: { pomodoro: 0, deepWork: 0, ultradian: 0, flowState: 0, custom: 0 },
            breakActivitiesCompleted: 0,
            averageFocusScore: 0
        };

        this.timerInterval = null;
        this.breakInterval = null;
        this.wellnessInterval = null;
        this.focusAudio = null;
        this.draggedTask = null;

        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.updateDisplay();
        this.updateStats();
        this.renderTasks();
        this.renderIdeas();
        this.renderAchievements();
        this.updateTimerMode();
        this.checkDailyReset();
        this.initializeFocusAudio();
        this.startWellnessReminders();
        this.calculateFocusScore();
    }

    // Data persistence
    loadData() {
        const savedState = localStorage.getItem('studyflow-state-v2');
        const savedStats = localStorage.getItem('studyflow-stats-v2');
        const savedTasks = localStorage.getItem('studyflow-tasks-v2');
        const savedIdeas = localStorage.getItem('studyflow-ideas-v2');
        const savedSettings = localStorage.getItem('studyflow-settings-v2');
        const savedAchievements = localStorage.getItem('studyflow-achievements-v2');

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

        if (savedIdeas) {
            this.state.ideas = JSON.parse(savedIdeas);
        }

        if (savedSettings) {
            this.state.settings = { ...this.state.settings, ...JSON.parse(savedSettings) };
        }

        if (savedAchievements) {
            const saved = JSON.parse(savedAchievements);
            this.achievements = this.achievements.map(achievement => {
                const savedAchievement = saved.find(s => s.id === achievement.id);
                return savedAchievement ? { ...achievement, earned: savedAchievement.earned } : achievement;
            });
        }
    }

    saveData() {
        localStorage.setItem('studyflow-state-v2', JSON.stringify({
            currentMode: this.state.currentMode,
            sessionCount: this.state.sessionCount,
            completedSessions: this.state.completedSessions,
            focusScore: this.state.focusScore
        }));
        localStorage.setItem('studyflow-stats-v2', JSON.stringify(this.stats));
        localStorage.setItem('studyflow-tasks-v2', JSON.stringify(this.state.tasks));
        localStorage.setItem('studyflow-ideas-v2', JSON.stringify(this.state.ideas));
        localStorage.setItem('studyflow-settings-v2', JSON.stringify(this.state.settings));
        localStorage.setItem('studyflow-achievements-v2', JSON.stringify(this.achievements.map(a => ({ id: a.id, earned: a.earned }))));
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

        // Ideas management
        document.getElementById('ideasToggle').addEventListener('click', () => this.toggleIdeasPanel());
        document.getElementById('ideasClose').addEventListener('click', () => this.toggleIdeasPanel());
        document.getElementById('addIdeaBtn').addEventListener('click', () => this.addIdea());
        document.getElementById('ideaInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) this.addIdea();
        });
        document.getElementById('exportIdeasBtn').addEventListener('click', () => this.exportIdeas());

        // Audio controls
        document.getElementById('focusSound').addEventListener('change', (e) => this.changeFocusSound(e.target.value));
        document.getElementById('volumeSlider').addEventListener('input', (e) => this.changeVolume(e.target.value));

        // Modals
        document.getElementById('statsBtn').addEventListener('click', () => this.openModal('statsModal'));
        document.getElementById('settingsBtn').addEventListener('click', () => this.openModal('settingsModal'));
        document.getElementById('closeStatsModal').addEventListener('click', () => this.closeModal('statsModal'));
        document.getElementById('closeSettingsModal').addEventListener('click', () => this.closeModal('settingsModal'));

        // Settings
        this.setupSettingsListeners();

        // Break activities
        document.getElementById('skipBreakBtn').addEventListener('click', () => this.skipBreak());
        document.getElementById('nextActivityBtn').addEventListener('click', () => this.nextBreakActivity());

        // Export stats
        document.getElementById('exportStatsBtn').addEventListener('click', () => this.exportStats());

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

    setupSettingsListeners() {
        const settingsInputs = [
            'customStudyTime', 'customBreakTime', 'soundEnabled', 'autoStartBreaks',
            'eyeReminders', 'postureReminders', 'hydrationReminders', 'distractionFreeMode'
        ];

        settingsInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', (e) => {
                    const value = e.target.type === 'checkbox' ? e.target.checked : 
                                  e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
                    this.state.settings[id] = value;
                    
                    if (id === 'customStudyTime' || id === 'customBreakTime') {
                        this.updateTimerMode();
                    }
                    
                    if (id === 'distractionFreeMode') {
                        this.toggleDistractionFreeMode(value);
                    }
                    
                    this.saveData();
                });
            }
        });
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
        document.querySelector('.timer-circle').classList.add('running');
        
        // Start focus sound if enabled
        if (!this.state.isBreak && this.state.settings.focusSound) {
            this.playFocusSound();
        }
        
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
        document.querySelector('.timer-circle').classList.remove('running');
        this.stopFocusSound();
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
        this.stopFocusSound();
        document.getElementById('timerLabel').textContent = 'Ready to start';
        document.querySelector('.timer-progress').classList.remove('running');
        document.querySelector('.timer-circle').classList.remove('running');
    }

    timerComplete() {
        clearInterval(this.timerInterval);
        this.state.isRunning = false;
        document.querySelector('.timer-progress').classList.remove('running');
        document.querySelector('.timer-circle').classList.remove('running');
        this.stopFocusSound();
        
        if (this.state.settings.soundEnabled) {
            this.playNotificationSound();
        }
        
        if (this.state.isBreak) {
            // Break completed
            this.stats.breakActivitiesCompleted++;
            this.state.isBreak = false;
            this.state.sessionCount++;
            this.updateTimerMode();
            document.getElementById('timerLabel').textContent = 'Break complete! Ready for next session';
            this.closeModal('breakModal');
            this.checkAchievements();
        } else {
            // Study session completed
            this.state.completedSessions++;
            this.stats.totalSessions++;
            this.stats.focusSessions[this.state.currentMode]++;
            this.stats.totalStudyTime += this.state.totalTime / 60;
            this.stats.todayStudyTime += this.state.totalTime / 60;
            
            this.calculateFocusScore();
            this.startBreakSession();
            this.checkAchievements();
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
        
        // Show break modal with motivational message and activity
        const message = this.motivationalMessages[Math.floor(Math.random() * this.motivationalMessages.length)];
        document.getElementById('breakMessage').textContent = message;
        
        this.showBreakActivity();
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

    showBreakActivity() {
        const activity = this.breakActivities[this.state.currentBreakActivity];
        document.getElementById('activityTitle').textContent = `${activity.icon} ${activity.title}`;
        document.getElementById('activityDesc').textContent = activity.description;
        document.getElementById('activityDuration').textContent = `${activity.duration} seconds`;
    }

    nextBreakActivity() {
        this.state.currentBreakActivity = (this.state.currentBreakActivity + 1) % this.breakActivities.length;
        this.showBreakActivity();
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

    // Focus scoring system
    calculateFocusScore() {
        let score = 0;
        
        // Base score from session completion
        score += 20;
        
        // Bonus for longer sessions
        const sessionMinutes = this.state.totalTime / 60;
        if (sessionMinutes >= 90) score += 30;
        else if (sessionMinutes >= 60) score += 20;
        else if (sessionMinutes >= 45) score += 15;
        else if (sessionMinutes >= 25) score += 10;
        
        // Bonus for consistency
        if (this.stats.currentStreak >= 7) score += 20;
        else if (this.stats.currentStreak >= 3) score += 10;
        
        // Bonus for task completion
        const todayCompletedTasks = this.state.tasks.filter(t => 
            t.completed && new Date(t.completedAt || Date.now()).toDateString() === new Date().toDateString()
        ).length;
        score += Math.min(todayCompletedTasks * 5, 20);
        
        // Apply diminishing returns and cap at 100
        this.state.focusScore = Math.min(Math.round(score * 0.9), 100);
        
        // Update average
        const totalScores = this.stats.totalSessions + 1;
        this.stats.averageFocusScore = Math.round(
            (this.stats.averageFocusScore * (totalScores - 1) + this.state.focusScore) / totalScores
        );
        
        document.getElementById('focusScore').textContent = this.state.focusScore;
    }

    // Ideas management
    toggleIdeasPanel() {
        const panel = document.getElementById('ideasPanel');
        panel.classList.toggle('visible');
        
        if (panel.classList.contains('visible')) {
            document.getElementById('ideaInput').focus();
        }
    }

    addIdea() {
        const input = document.getElementById('ideaInput');
        const category = document.getElementById('ideaCategory').value;
        const ideaText = input.value.trim();
        
        if (ideaText) {
            const idea = {
                id: Date.now(),
                text: ideaText,
                category: category,
                timestamp: new Date().toISOString(),
                createdAt: new Date().toLocaleString()
            };
            
            this.state.ideas.unshift(idea); // Add to beginning
            this.stats.todayIdeas++;
            input.value = '';
            this.renderIdeas();
            this.updateStats();
            this.checkAchievements();
            this.saveData();
        }
    }

    deleteIdea(ideaId) {
        const ideaIndex = this.state.ideas.findIndex(i => i.id === ideaId);
        if (ideaIndex > -1) {
            this.state.ideas.splice(ideaIndex, 1);
            this.renderIdeas();
            this.saveData();
        }
    }

    renderIdeas() {
        const ideasList = document.getElementById('ideasList');
        ideasList.innerHTML = '';
        
        if (this.state.ideas.length === 0) {
            ideasList.innerHTML = '<p style="color: var(--color-text-muted); text-align: center; padding: 20px;">No ideas captured yet. Start brainstorming!</p>';
            return;
        }
        
        this.state.ideas.forEach(idea => {
            const ideaElement = document.createElement('div');
            ideaElement.className = 'idea-item';
            
            const categoryColors = {
                general: '#10b981',
                study: '#3b82f6',
                task: '#f59e0b',
                insight: '#8b5cf6',
                question: '#ef4444'
            };
            
            ideaElement.innerHTML = `
                <div class="idea-header">
                    <span class="idea-category-tag" style="background-color: ${categoryColors[idea.category] || '#10b981'}">${idea.category}</span>
                    <span class="idea-timestamp">${idea.createdAt}</span>
                </div>
                <div class="idea-text">${idea.text}</div>
                <button class="idea-delete">×</button>
            `;
            
            const deleteBtn = ideaElement.querySelector('.idea-delete');
            deleteBtn.addEventListener('click', () => this.deleteIdea(idea.id));
            
            ideasList.appendChild(ideaElement);
        });
    }

    exportIdeas() {
        if (this.state.ideas.length === 0) {
            alert('No ideas to export!');
            return;
        }
        
        const csv = this.convertIdeasToCSV(this.state.ideas);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `studyflow-ideas-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    convertIdeasToCSV(ideas) {
        const headers = ['Category', 'Idea', 'Date Created'];
        const rows = ideas.map(idea => [
            idea.category,
            `"${idea.text.replace(/"/g, '""')}"`,
            idea.createdAt
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    // Audio management
    initializeFocusAudio() {
        this.focusAudio = document.getElementById('focusAudio');
        this.focusAudio.volume = this.state.settings.volume / 100;
        
        // Update UI
        document.getElementById('focusSound').value = this.state.settings.focusSound || '';
        document.getElementById('volumeSlider').value = this.state.settings.volume;
    }

    changeFocusSound(soundKey) {
        this.state.settings.focusSound = soundKey;
        this.saveData();
        
        if (soundKey && this.focusSounds[soundKey]) {
            document.getElementById('focusAudioSource').src = this.focusSounds[soundKey];
            this.focusAudio.load();
        }
    }

    changeVolume(volume) {
        this.state.settings.volume = parseInt(volume);
        if (this.focusAudio) {
            this.focusAudio.volume = volume / 100;
        }
        this.saveData();
    }

    playFocusSound() {
        if (this.state.settings.focusSound && this.focusAudio) {
            this.focusAudio.play().catch(e => console.log('Focus audio play failed:', e));
        }
    }

    stopFocusSound() {
        if (this.focusAudio) {
            this.focusAudio.pause();
        }
    }

    // Wellness reminders
    startWellnessReminders() {
        this.wellnessInterval = setInterval(() => {
            if (!this.state.isRunning) return;
            
            const now = Date.now();
            const sessionTime = (this.state.totalTime - this.state.timeLeft) * 1000;
            
            // Eye reminder every 20 minutes
            if (this.state.settings.eyeReminders && sessionTime % (20 * 60 * 1000) < 1000) {
                this.showWellnessReminder('👁️ Eye Break', 'Look at something 20 feet away for 20 seconds');
            }
            
            // Posture reminder every 30 minutes
            if (this.state.settings.postureReminders && sessionTime % (30 * 60 * 1000) < 1000) {
                this.showWellnessReminder('🪑 Posture Check', 'Adjust your sitting position and stretch your back');
            }
            
            // Hydration reminder every 45 minutes
            if (this.state.settings.hydrationReminders && sessionTime % (45 * 60 * 1000) < 1000) {
                this.showWellnessReminder('💧 Hydration', 'Time to drink some water!');
            }
        }, 60000); // Check every minute
    }

    showWellnessReminder(title, message) {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.className = 'wellness-notification';
        notification.innerHTML = `
            <div class="wellness-content">
                <div class="wellness-title">${title}</div>
                <div class="wellness-message">${message}</div>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 2000;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    // Achievement system
    checkAchievements() {
        const earnedNew = [];
        
        // First session
        if (!this.achievements.find(a => a.id === 'first_session').earned && this.stats.totalSessions >= 1) {
            this.earnAchievement('first_session');
            earnedNew.push('first_session');
        }
        
        // Daily goal (2 hours)
        if (!this.achievements.find(a => a.id === 'daily_goal').earned && this.stats.todayStudyTime >= 120) {
            this.earnAchievement('daily_goal');
            earnedNew.push('daily_goal');
        }
        
        // Week streak
        if (!this.achievements.find(a => a.id === 'week_streak').earned && this.stats.currentStreak >= 7) {
            this.earnAchievement('week_streak');
            earnedNew.push('week_streak');
        }
        
        // Deep work
        if (!this.achievements.find(a => a.id === 'deep_work').earned && this.stats.focusSessions.deepWork >= 1) {
            this.earnAchievement('deep_work');
            earnedNew.push('deep_work');
        }
        
        // Idea collector
        if (!this.achievements.find(a => a.id === 'idea_collector').earned && this.state.ideas.length >= 50) {
            this.earnAchievement('idea_collector');
            earnedNew.push('idea_collector');
        }
        
        // Flow master
        if (!this.achievements.find(a => a.id === 'flow_master').earned && this.stats.focusSessions.flowState >= 10) {
            this.earnAchievement('flow_master');
            earnedNew.push('flow_master');
        }
        
        // Focus champion
        if (!this.achievements.find(a => a.id === 'focus_champion').earned && this.state.focusScore >= 90) {
            this.earnAchievement('focus_champion');
            earnedNew.push('focus_champion');
        }
        
        // Wellness warrior
        if (!this.achievements.find(a => a.id === 'wellness_warrior').earned && this.stats.breakActivitiesCompleted >= 20) {
            this.earnAchievement('wellness_warrior');
            earnedNew.push('wellness_warrior');
        }
        
        // Show achievement banner for new achievements
        if (earnedNew.length > 0) {
            this.showAchievementBanner(earnedNew[0]);
        }
    }

    earnAchievement(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (achievement) {
            achievement.earned = true;
            this.saveData();
        }
    }

    showAchievementBanner(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        const banner = document.getElementById('achievementBanner');
        
        document.getElementById('achievementTitle').textContent = `${achievement.icon} ${achievement.title}`;
        document.getElementById('achievementDesc').textContent = achievement.description;
        
        banner.classList.add('visible');
        
        setTimeout(() => {
            banner.classList.remove('visible');
        }, 4000);
    }

    renderAchievements() {
        const grid = document.getElementById('achievementsGrid');
        grid.innerHTML = '';
        
        this.achievements.forEach(achievement => {
            const card = document.createElement('div');
            card.className = `achievement-card ${achievement.earned ? 'earned' : ''}`;
            
            card.innerHTML = `
                <div class="achievement-card-icon">${achievement.icon}</div>
                <div class="achievement-card-title">${achievement.title}</div>
                <div class="achievement-card-desc">${achievement.description}</div>
            `;
            
            grid.appendChild(card);
        });
    }

    // Distraction-free mode
    toggleDistractionFreeMode(enabled) {
        document.body.classList.toggle('distraction-free', enabled);
    }

    // Task management (enhanced from original)
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
                task.completedAt = new Date().toISOString();
                this.stats.totalTasksCompleted++;
                this.stats.todayTasks++;
            } else {
                delete task.completedAt;
                this.stats.totalTasksCompleted--;
                this.stats.todayTasks--;
            }
            this.renderTasks();
            this.updateTaskStats();
            this.updateStats();
            this.calculateFocusScore();
            this.checkAchievements();
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
        
        if (this.state.tasks.length === 0) {
            tasksList.innerHTML = '<p style="color: var(--color-text-muted); text-align: center; padding: 20px;">No tasks yet. Add one above!</p>';
            return;
        }
        
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

    // Display updates (enhanced)
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

    // Statistics (enhanced)
    updateStats() {
        // Footer stats
        const studyHours = Math.floor(this.stats.todayStudyTime / 60);
        const studyMinutes = Math.floor(this.stats.todayStudyTime % 60);
        document.getElementById('todayStudyTime').textContent = `${studyHours}h ${studyMinutes}m`;
        document.getElementById('currentStreak').textContent = `${this.stats.currentStreak} days`;
        document.getElementById('todayTasks').textContent = this.stats.todayTasks;
        document.getElementById('todayIdeas').textContent = this.stats.todayIdeas;
        
        // Modal stats
        const totalHours = Math.floor(this.stats.totalStudyTime / 60);
        const totalMinutes = Math.floor(this.stats.totalStudyTime % 60);
        document.getElementById('totalStudyTime').textContent = `${totalHours}h ${totalMinutes}m`;
        document.getElementById('totalSessions').textContent = this.stats.totalSessions;
        document.getElementById('totalTasksCompleted').textContent = this.stats.totalTasksCompleted;
        document.getElementById('bestStreak').textContent = `${this.stats.bestStreak} days`;
        
        // Settings values
        document.getElementById('customStudyTime').value = this.state.settings.customStudyTime;
        document.getElementById('customBreakTime').value = this.state.settings.customBreakTime;
        document.getElementById('soundEnabled').checked = this.state.settings.soundEnabled;
        document.getElementById('autoStartBreaks').checked = this.state.settings.autoStartBreaks;
        document.getElementById('eyeReminders').checked = this.state.settings.eyeReminders;
        document.getElementById('postureReminders').checked = this.state.settings.postureReminders;
        document.getElementById('hydrationReminders').checked = this.state.settings.hydrationReminders;
        document.getElementById('distractionFreeMode').checked = this.state.settings.distractionFreeMode;
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
                    this.stats.currentStreak++;
                    if (this.stats.currentStreak > this.stats.bestStreak) {
                        this.stats.bestStreak = this.stats.currentStreak;
                    }
                } else if (daysDiff > 1) {
                    this.stats.currentStreak = 0;
                }
            } else {
                this.stats.currentStreak = 0;
            }
            
            // Reset daily stats
            this.stats.todayStudyTime = 0;
            this.stats.todayTasks = 0;
            this.stats.todayIdeas = 0;
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
            averageFocusScore: this.stats.averageFocusScore,
            sessionsPerMode: JSON.stringify(this.stats.focusSessions),
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
            this.renderAchievements();
        }
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
    }

    // Keyboard shortcuts (enhanced)
    handleKeyboardShortcuts(e) {
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
            case 'KeyI':
                e.preventDefault();
                this.toggleIdeasPanel();
                break;
            case 'KeyT':
                e.preventDefault();
                document.getElementById('taskInput').focus();
                break;
            case 'KeyS':
                if (e.ctrlKey || e.metaKey) return;
                e.preventDefault();
                this.openModal('settingsModal');
                break;
        }
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

// Handle page visibility changes
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