// Enhanced StudyFlow App with All Features
class StudyFlowApp {
    constructor() {
        // Configuration from application data
        this.spotifyConfig = {
            clientId: "your-spotify-client-id-here",
            redirectUri: window.location.origin,
            scopes: ["streaming", "user-read-email", "user-read-private", "user-read-playback-state", "user-modify-playback-state", "playlist-read-private"],
            deviceName: "StudyFlow Timer"
        };

        this.ambientSounds = {
            rain: { type: "noise", baseFreq: 1000, filterFreq: 400, gain: 0.3 },
            forest: { type: "nature", birdFreqs: [2000, 3000, 4000], windFreq: 100, gain: 0.25 },
            cafe: { type: "ambient", baseFreq: 200, chatterFreq: 1000, gain: 0.2 },
            ocean: { type: "wave", frequency: 0.5, gain: 0.3 },
            brownNoise: { type: "noise", baseFreq: 60, gain: 0.4 },
            whiteNoise: { type: "noise", baseFreq: 20000, gain: 0.3 }
        };

        this.focusPlaylists = [
            { name: "Deep Focus", spotifyId: "37i9dQZF1DWZeKCadgRdKQ", description: "Instrumental tracks for concentration" },
            { name: "Peaceful Piano", spotifyId: "37i9dQZF1DX4sWSpwq3LiO", description: "Calm piano music" },
            { name: "Lo-Fi Beats", spotifyId: "37i9dQZF1DWWQRwui0ExPn", description: "Chill lo-fi hip hop" },
            { name: "Classical Focus", spotifyId: "37i9dQZF1DWWEJlAGA9gs0", description: "Classical music for studying" },
            { name: "Ambient Chill", spotifyId: "37i9dQZF1DX3Ogo9pFvBkY", description: "Atmospheric ambient sounds" }
        ];

        this.audioPresets = {
            "pure-focus": { ambient: ["brownNoise"], volumes: [0.4], spotify: false },
            "nature-study": { ambient: ["rain", "forest"], volumes: [0.3, 0.2], spotify: true },
            "cafe-vibes": { ambient: ["cafe"], volumes: [0.3], spotify: true },
            "deep-work": { ambient: ["brownNoise"], volumes: [0.5], spotify: false },
            "creative-flow": { ambient: ["ocean"], volumes: [0.2], spotify: true }
        };

        this.ideasCategories = [
            { id: "study", name: "Study Ideas", icon: "📚", color: "#10b981" },
            { id: "task", name: "Tasks", icon: "✅", color: "#3b82f6" },
            { id: "insight", name: "Insights", icon: "💡", color: "#f59e0b" },
            { id: "question", name: "Questions", icon: "❓", color: "#ef4444" },
            { id: "creative", name: "Creative", icon: "🎨", color: "#8b5cf6" },
            { id: "research", name: "Research", icon: "🔍", color: "#06b6d4" }
        ];

        this.timerModes = {
            pomodoro: { study: 25, shortBreak: 5, longBreak: 15, description: "Classic focus technique" },
            deepWork: { study: 90, shortBreak: 20, longBreak: 30, description: "Extended concentration periods" },
            ultradian: { study: 120, shortBreak: 20, longBreak: 30, description: "Natural attention cycles" },
            flowState: { study: 180, shortBreak: 30, longBreak: 45, description: "Maximum focus sessions" },
            custom: { study: 60, shortBreak: 10, longBreak: 20, description: "Personalized timing" }
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

        // App State
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
            isAuthenticated: false,
            user: null,
            settings: {
                soundEnabled: true,
                autoStartBreaks: true,
                customStudyTime: 60,
                customBreakTime: 10,
                eyeReminders: true,
                postureReminders: true,
                hydrationReminders: true,
                distractionFreeMode: false,
                autoMusicBreaks: true,
                ambientMixMode: true
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

        // System instances
        this.audioSystem = null;
        this.spotifyPlayer = null;
        this.firebaseAuth = null;
        this.timerInterval = null;
        this.breakInterval = null;
        this.wellnessInterval = null;
        this.speechRecognition = null;

        this.init();
    }

    async init() {
        await this.initializeFirebase();
        this.initializeAudioSystem();
        this.initializeSpotify();
        this.initializeSpeechRecognition();
        this.loadData();
        this.setupEventListeners();
        this.updateDisplay();
        this.updateStats();
        this.renderTasks();
        this.renderIdeas();
        this.renderAchievements();
        this.updateTimerMode();
        this.checkDailyReset();
        this.startWellnessReminders();
        this.calculateFocusScore();
        this.showAuthModal();
    }

    // Firebase Authentication
    async initializeFirebase() {
        try {
            // Firebase is initialized in HTML head
            if (window.firebaseAuth) {
                this.firebaseAuth = window.firebaseAuth;
                
                // Listen for auth state changes
                this.firebaseAuth.onAuthStateChanged((user) => {
                    this.handleAuthStateChange(user);
                });
            }
        } catch (error) {
            console.error('Firebase initialization failed:', error);
            this.showNotification('Firebase connection failed. Working offline.', 'warning');
        }
    }

    async signInWithEmail(email, password) {
        try {
            const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js');
            const result = await signInWithEmailAndPassword(this.firebaseAuth, email, password);
            this.showNotification('Successfully signed in!', 'success');
            return result;
        } catch (error) {
            console.error('Sign in failed:', error);
            this.showNotification('Sign in failed: ' + error.message, 'error');
            throw error;
        }
    }

    async signUpWithEmail(email, password) {
        try {
            const { createUserWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js');
            const result = await createUserWithEmailAndPassword(this.firebaseAuth, email, password);
            this.showNotification('Account created successfully!', 'success');
            return result;
        } catch (error) {
            console.error('Sign up failed:', error);
            this.showNotification('Sign up failed: ' + error.message, 'error');
            throw error;
        }
    }

    async signInWithGoogle() {
        try {
            const { GoogleAuthProvider, signInWithPopup } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js');
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(this.firebaseAuth, provider);
            this.showNotification('Successfully signed in with Google!', 'success');
            return result;
        } catch (error) {
            console.error('Google sign in failed:', error);
            this.showNotification('Google sign in failed: ' + error.message, 'error');
            throw error;
        }
    }

    async signOut() {
        try {
            await this.firebaseAuth.signOut();
            this.showNotification('Signed out successfully', 'success');
        } catch (error) {
            console.error('Sign out failed:', error);
            this.showNotification('Sign out failed', 'error');
        }
    }

    handleAuthStateChange(user) {
        this.state.isAuthenticated = !!user;
        this.state.user = user;
        
        this.updateSyncStatus();
        this.updateUserInterface();
        
        if (user) {
            this.hideAuthModal();
            this.syncDataToFirebase();
            document.getElementById('userEmail').textContent = user.email;
        } else {
            this.updateSyncStatus(false);
            document.getElementById('userEmail').textContent = 'offline@studyflow.com';
        }
    }

    updateSyncStatus(online = true) {
        const indicator = document.querySelector('.sync-indicator');
        const text = document.querySelector('.sync-text');
        
        if (this.state.isAuthenticated && online) {
            indicator.className = 'sync-indicator online';
            text.textContent = 'Synced';
        } else if (this.state.isAuthenticated) {
            indicator.className = 'sync-indicator syncing';
            text.textContent = 'Syncing...';
        } else {
            indicator.className = 'sync-indicator offline';
            text.textContent = 'Offline';
        }
    }

    async syncDataToFirebase() {
        if (!this.state.isAuthenticated || !window.firebaseDb) return;
        
        try {
            const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js');
            const userDoc = doc(window.firebaseDb, 'users', this.state.user.uid);
            
            await setDoc(userDoc, {
                stats: this.stats,
                settings: this.state.settings,
                tasks: this.state.tasks,
                ideas: this.state.ideas,
                achievements: this.achievements.map(a => ({ id: a.id, earned: a.earned })),
                lastSync: new Date().toISOString()
            }, { merge: true });
            
            this.updateSyncStatus(true);
        } catch (error) {
            console.error('Firebase sync failed:', error);
            this.updateSyncStatus(false);
        }
    }

    // Audio System with Web Audio API
    initializeAudioSystem() {
        this.audioSystem = new AmbientAudioSystem(this.ambientSounds);
        this.setupAudioControls();
    }

    setupAudioControls() {
        // Master volume control
        document.getElementById('masterVolume').addEventListener('input', (e) => {
            this.audioSystem.setMasterVolume(e.target.value / 100);
        });

        // Individual sound controls
        document.querySelectorAll('.sound-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const soundName = e.target.dataset.sound;
                this.toggleAmbientSound(soundName);
            });
        });

        document.querySelectorAll('.volume-slider[data-sound]').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const soundName = e.target.dataset.sound;
                const volume = e.target.value / 100;
                this.audioSystem.setVolume(soundName, volume);
                
                // Update button state
                const btn = document.querySelector(`.sound-toggle[data-sound="${soundName}"]`);
                const source = document.querySelector(`.sound-source[data-sound="${soundName}"]`);
                
                if (volume > 0) {
                    btn.textContent = '⏸️';
                    btn.classList.add('playing');
                    source.classList.add('active');
                } else {
                    btn.textContent = '▶️';
                    btn.classList.remove('playing');
                    source.classList.remove('active');
                }
            });
        });

        // Audio presets
        document.getElementById('audioPresets').addEventListener('change', (e) => {
            this.loadAudioPreset(e.target.value);
        });

        // Initialize visualizer
        this.audioSystem.initializeVisualizer(document.getElementById('visualizerCanvas'));
    }

    toggleAmbientSound(soundName) {
        const isPlaying = this.audioSystem.toggleSound(soundName);
        const btn = document.querySelector(`.sound-toggle[data-sound="${soundName}"]`);
        const source = document.querySelector(`.sound-source[data-sound="${soundName}"]`);
        
        if (isPlaying) {
            btn.textContent = '⏸️';
            btn.classList.add('playing');
            source.classList.add('active');
            // Set slider to default volume
            const slider = document.querySelector(`.volume-slider[data-sound="${soundName}"]`);
            if (slider.value == 0) {
                slider.value = 30;
                this.audioSystem.setVolume(soundName, 0.3);
            }
        } else {
            btn.textContent = '▶️';
            btn.classList.remove('playing');
            source.classList.remove('active');
        }
    }

    loadAudioPreset(presetName) {
        if (!presetName || !this.audioPresets[presetName]) return;
        
        const preset = this.audioPresets[presetName];
        
        // Stop all sounds first
        this.audioSystem.stopAllSounds();
        this.resetAudioControls();
        
        // Apply preset
        preset.ambient.forEach((soundName, index) => {
            const volume = preset.volumes[index] || 0.3;
            this.audioSystem.setVolume(soundName, volume);
            
            // Update UI
            const slider = document.querySelector(`.volume-slider[data-sound="${soundName}"]`);
            const btn = document.querySelector(`.sound-toggle[data-sound="${soundName}"]`);
            const source = document.querySelector(`.sound-source[data-sound="${soundName}"]`);
            
            if (slider) slider.value = volume * 100;
            if (btn) {
                btn.textContent = '⏸️';
                btn.classList.add('playing');
            }
            if (source) source.classList.add('active');
        });
    }

    resetAudioControls() {
        document.querySelectorAll('.sound-toggle').forEach(btn => {
            btn.textContent = '▶️';
            btn.classList.remove('playing');
        });
        document.querySelectorAll('.sound-source').forEach(source => {
            source.classList.remove('active');
        });
        document.querySelectorAll('.volume-slider[data-sound]').forEach(slider => {
            slider.value = 0;
        });
    }

    // Spotify Integration
    initializeSpotify() {
        this.spotifyPlayer = new SpotifyPlayer(this.spotifyConfig);
        this.setupSpotifyControls();
        this.loadFocusPlaylists();
    }

    setupSpotifyControls() {
        document.getElementById('connectSpotify').addEventListener('click', () => {
            this.spotifyPlayer.connect();
        });

        document.getElementById('playPauseBtn').addEventListener('click', () => {
            this.spotifyPlayer.togglePlayback();
        });

        document.getElementById('prevBtn').addEventListener('click', () => {
            this.spotifyPlayer.previousTrack();
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            this.spotifyPlayer.nextTrack();
        });

        document.getElementById('spotifyVolume').addEventListener('input', (e) => {
            this.spotifyPlayer.setVolume(e.target.value);
        });

        document.getElementById('focusPlaylistSelect').addEventListener('change', (e) => {
            if (e.target.value) {
                this.spotifyPlayer.playPlaylist(e.target.value);
            }
        });
    }

    loadFocusPlaylists() {
        const select = document.getElementById('focusPlaylistSelect');
        this.focusPlaylists.forEach(playlist => {
            const option = document.createElement('option');
            option.value = playlist.spotifyId;
            option.textContent = playlist.name;
            option.title = playlist.description;
            select.appendChild(option);
        });
    }

    // Speech Recognition for Voice Ideas
    initializeSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.speechRecognition = new SpeechRecognition();
            this.speechRecognition.continuous = false;
            this.speechRecognition.interimResults = false;
            this.speechRecognition.lang = 'en-US';

            this.speechRecognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('ideaInput').value = transcript;
                this.showNotification('Voice captured: ' + transcript, 'success');
            };

            this.speechRecognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.showNotification('Voice recognition failed', 'error');
            };
        }
    }

    startVoiceRecognition() {
        if (!this.speechRecognition) {
            this.showNotification('Voice recognition not supported', 'error');
            return;
        }

        const btn = document.getElementById('voiceIdeaBtn');
        btn.classList.add('voice-recording');
        btn.textContent = '🔴';
        
        this.speechRecognition.start();
        
        this.speechRecognition.onend = () => {
            btn.classList.remove('voice-recording');
            btn.textContent = '🎤';
        };
    }

    // Timer functionality (enhanced)
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
        
        // Start ambient sounds if configured
        if (!this.state.isBreak && this.audioSystem) {
            this.audioSystem.resume();
        }
        
        // Pause Spotify during breaks if setting enabled
        if (this.state.isBreak && this.state.settings.autoMusicBreaks && this.spotifyPlayer) {
            this.spotifyPlayer.pause();
        }
        
        // Enable distraction-free mode if setting enabled
        if (this.state.settings.distractionFreeMode && !this.state.isBreak) {
            document.body.classList.add('distraction-free');
        }
        
        this.timerInterval = setInterval(() => {
            this.state.timeLeft--;
            this.updateDisplay();
            
            if (this.state.timeLeft <= 0) {
                this.timerComplete();
            }
        }, 1000);
        
        this.updateTimerButtons();
        this.saveData();
    }

    pauseTimer() {
        this.state.isRunning = false;
        this.state.isPaused = true;
        clearInterval(this.timerInterval);
        document.getElementById('timerLabel').textContent = 'Paused';
        document.querySelector('.timer-progress').classList.remove('running');
        document.querySelector('.timer-circle').classList.remove('running');
        document.body.classList.remove('distraction-free');
        
        if (this.audioSystem) {
            this.audioSystem.pause();
        }
        
        this.updateTimerButtons();
        this.saveData();
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
        document.body.classList.remove('distraction-free');
        
        if (this.audioSystem) {
            this.audioSystem.pause();
        }
        
        document.getElementById('timerLabel').textContent = 'Ready to start';
        document.querySelector('.timer-progress').classList.remove('running');
        document.querySelector('.timer-circle').classList.remove('running');
        this.saveData();
    }

    timerComplete() {
        clearInterval(this.timerInterval);
        this.state.isRunning = false;
        document.querySelector('.timer-progress').classList.remove('running');
        document.querySelector('.timer-circle').classList.remove('running');
        document.body.classList.remove('distraction-free');
        
        if (this.audioSystem) {
            this.audioSystem.pause();
        }
        
        this.playNotificationSound();
        
        if (this.state.isBreak) {
            // Break completed
            this.stats.breakActivitiesCompleted++;
            this.state.isBreak = false;
            this.state.sessionCount++;
            this.updateTimerMode();
            document.getElementById('timerLabel').textContent = 'Break complete! Ready for next session';
            this.closeModal('breakModal');
            this.checkAchievements();
            
            // Resume music after break
            if (this.state.settings.autoMusicBreaks && this.spotifyPlayer) {
                this.spotifyPlayer.resume();
            }
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
        this.syncDataToFirebase();
    }

    startBreakSession() {
        this.state.isBreak = true;
        const breakDuration = this.getBreakDuration();
        this.state.timeLeft = breakDuration * 60;
        this.state.totalTime = breakDuration * 60;
        
        this.showBreakActivity();
        this.openModal('breakModal');
        this.updateBreakDisplay();
        
        if (this.state.settings.autoStartBreaks) {
            setTimeout(() => this.startTimer(), 2000);
        }
        
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

    // Ideas Management (enhanced)
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
                createdAt: new Date().toLocaleString(),
                tags: this.extractTags(ideaText)
            };
            
            this.state.ideas.unshift(idea);
            this.stats.todayIdeas++;
            input.value = '';
            this.renderIdeas();
            this.updateStats();
            this.checkAchievements();
            this.saveData();
            this.syncDataToFirebase();
            
            this.showNotification('Idea captured!', 'success');
        }
    }

    extractTags(text) {
        const tagRegex = /#(\w+)/g;
        const tags = [];
        let match;
        
        while ((match = tagRegex.exec(text)) !== null) {
            tags.push(match[1].toLowerCase());
        }
        
        return tags;
    }

    deleteIdea(ideaId) {
        const ideaIndex = this.state.ideas.findIndex(i => i.id === ideaId);
        if (ideaIndex > -1) {
            this.state.ideas.splice(ideaIndex, 1);
            this.renderIdeas();
            this.saveData();
            this.syncDataToFirebase();
        }
    }

    filterIdeas() {
        const searchTerm = document.getElementById('ideasSearch').value.toLowerCase();
        const categoryFilter = document.getElementById('ideasFilter').value;
        
        let filteredIdeas = this.state.ideas;
        
        if (searchTerm) {
            filteredIdeas = filteredIdeas.filter(idea => 
                idea.text.toLowerCase().includes(searchTerm) ||
                idea.tags.some(tag => tag.includes(searchTerm))
            );
        }
        
        if (categoryFilter && categoryFilter !== 'all') {
            filteredIdeas = filteredIdeas.filter(idea => idea.category === categoryFilter);
        }
        
        this.renderIdeas(filteredIdeas);
    }

    renderIdeas(ideas = this.state.ideas) {
        const ideasList = document.getElementById('ideasList');
        ideasList.innerHTML = '';
        
        if (ideas.length === 0) {
            ideasList.innerHTML = '<p style="color: var(--color-text-muted); text-align: center; padding: 20px;">No ideas found. Start brainstorming!</p>';
            return;
        }
        
        ideas.forEach(idea => {
            const ideaElement = document.createElement('div');
            ideaElement.className = 'idea-item';
            
            const categoryInfo = this.ideasCategories.find(c => c.id === idea.category) || this.ideasCategories[0];
            
            ideaElement.innerHTML = `
                <div class="idea-header">
                    <span class="idea-category-tag" style="background-color: ${categoryInfo.color}">
                        ${categoryInfo.icon} ${categoryInfo.name}
                    </span>
                    <span class="idea-timestamp">${idea.createdAt}</span>
                </div>
                <div class="idea-text">${this.highlightTags(idea.text)}</div>
                <button class="idea-delete">×</button>
            `;
            
            const deleteBtn = ideaElement.querySelector('.idea-delete');
            deleteBtn.addEventListener('click', () => this.deleteIdea(idea.id));
            
            ideasList.appendChild(ideaElement);
        });
    }

    highlightTags(text) {
        return text.replace(/#(\w+)/g, '<span style="color: var(--color-primary); font-weight: 500;">#$1</span>');
    }

    exportIdeas() {
        if (this.state.ideas.length === 0) {
            this.showNotification('No ideas to export!', 'warning');
            return;
        }
        
        const format = prompt('Export format: (1) CSV, (2) Markdown, (3) JSON', '1');
        let content, filename, mimeType;
        
        switch (format) {
            case '2':
                content = this.convertIdeasToMarkdown(this.state.ideas);
                filename = `studyflow-ideas-${new Date().toISOString().split('T')[0]}.md`;
                mimeType = 'text/markdown';
                break;
            case '3':
                content = JSON.stringify(this.state.ideas, null, 2);
                filename = `studyflow-ideas-${new Date().toISOString().split('T')[0]}.json`;
                mimeType = 'application/json';
                break;
            default:
                content = this.convertIdeasToCSV(this.state.ideas);
                filename = `studyflow-ideas-${new Date().toISOString().split('T')[0]}.csv`;
                mimeType = 'text/csv';
        }
        
        this.downloadFile(content, filename, mimeType);
        this.showNotification('Ideas exported successfully!', 'success');
    }

    convertIdeasToMarkdown(ideas) {
        let markdown = '# StudyFlow Ideas Export\n\n';
        markdown += `Generated on: ${new Date().toLocaleString()}\n\n`;
        
        const categories = [...new Set(ideas.map(idea => idea.category))];
        
        categories.forEach(category => {
            const categoryInfo = this.ideasCategories.find(c => c.id === category);
            markdown += `## ${categoryInfo ? categoryInfo.icon + ' ' + categoryInfo.name : category}\n\n`;
            
            const categoryIdeas = ideas.filter(idea => idea.category === category);
            categoryIdeas.forEach(idea => {
                markdown += `- **${idea.createdAt}**: ${idea.text}\n`;
                if (idea.tags.length > 0) {
                    markdown += `  *Tags: ${idea.tags.map(tag => '#' + tag).join(', ')}*\n`;
                }
                markdown += '\n';
            });
        });
        
        return markdown;
    }

    convertIdeasToCSV(ideas) {
        const headers = ['Category', 'Idea', 'Tags', 'Date Created'];
        const rows = ideas.map(idea => [
            idea.category,
            `"${idea.text.replace(/"/g, '""')}"`,
            idea.tags.join(';'),
            idea.createdAt
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    clearAllIdeas() {
        if (confirm('Are you sure you want to delete all ideas? This cannot be undone.')) {
            this.state.ideas = [];
            this.renderIdeas();
            this.saveData();
            this.syncDataToFirebase();
            this.showNotification('All ideas cleared', 'success');
        }
    }

    // Task Management (enhanced with drag-drop)
    addTask() {
        const input = document.getElementById('taskInput');
        const taskText = input.value.trim();
        
        if (taskText) {
            const task = {
                id: Date.now(),
                text: taskText,
                completed: false,
                createdAt: new Date().toISOString(),
                priority: this.extractPriority(taskText),
                tags: this.extractTags(taskText)
            };
            
            this.state.tasks.push(task);
            input.value = '';
            this.renderTasks();
            this.updateTaskStats();
            this.saveData();
            this.syncDataToFirebase();
        }
    }

    extractPriority(text) {
        if (text.includes('!!!') || text.toLowerCase().includes('urgent')) return 'high';
        if (text.includes('!!') || text.toLowerCase().includes('important')) return 'medium';
        return 'normal';
    }

    toggleTask(taskId) {
        const task = this.state.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            if (task.completed) {
                task.completedAt = new Date().toISOString();
                this.stats.totalTasksCompleted++;
                this.stats.todayTasks++;
                this.showNotification('Task completed! 🎉', 'success');
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
            this.syncDataToFirebase();
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
            this.syncDataToFirebase();
        }
    }

    renderTasks() {
        const tasksList = document.getElementById('tasksList');
        tasksList.innerHTML = '';
        
        if (this.state.tasks.length === 0) {
            tasksList.innerHTML = '<p style="color: var(--color-text-muted); text-align: center; padding: 20px;">No tasks yet. Add one above!</p>';
            return;
        }
        
        // Sort tasks: incomplete first, then by priority
        const sortedTasks = [...this.state.tasks].sort((a, b) => {
            if (a.completed !== b.completed) return a.completed - b.completed;
            const priorityOrder = { high: 0, medium: 1, normal: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        
        sortedTasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task-item ${task.completed ? 'completed' : ''} priority-${task.priority}`;
            taskElement.draggable = true;
            taskElement.dataset.taskId = task.id;
            
            const priorityIndicator = task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '';
            
            taskElement.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-priority">${priorityIndicator}</span>
                <span class="task-text">${this.highlightTags(task.text)}</span>
                <button class="task-delete" title="Delete task">🗑️</button>
            `;
            
            const checkbox = taskElement.querySelector('.task-checkbox');
            const deleteBtn = taskElement.querySelector('.task-delete');
            
            checkbox.addEventListener('change', () => this.toggleTask(task.id));
            deleteBtn.addEventListener('click', () => this.deleteTask(task.id));
            
            tasksList.appendChild(taskElement);
        });
        
        this.setupTaskDragAndDrop();
    }

    setupTaskDragAndDrop() {
        const tasksList = document.getElementById('tasksList');
        let draggedTask = null;
        
        tasksList.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('task-item')) {
                draggedTask = e.target;
                e.target.classList.add('dragging');
            }
        });
        
        tasksList.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('task-item')) {
                e.target.classList.remove('dragging');
                draggedTask = null;
            }
        });
        
        tasksList.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = this.getDragAfterElement(tasksList, e.clientY);
            if (afterElement == null) {
                tasksList.appendChild(draggedTask);
            } else {
                tasksList.insertBefore(draggedTask, afterElement);
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
        this.syncDataToFirebase();
    }

    updateTaskStats() {
        const completed = this.state.tasks.filter(t => t.completed).length;
        const total = this.state.tasks.length;
        
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('totalTasks').textContent = total;
    }

    // Focus scoring system (enhanced)
    calculateFocusScore() {
        let score = 0;
        
        // Base score from session completion
        score += 20;
        
        // Bonus for longer sessions
        const sessionMinutes = this.state.totalTime / 60;
        if (sessionMinutes >= 180) score += 40;
        else if (sessionMinutes >= 120) score += 35;
        else if (sessionMinutes >= 90) score += 30;
        else if (sessionMinutes >= 60) score += 20;
        else if (sessionMinutes >= 45) score += 15;
        else if (sessionMinutes >= 25) score += 10;
        
        // Bonus for consistency
        if (this.stats.currentStreak >= 14) score += 30;
        else if (this.stats.currentStreak >= 7) score += 20;
        else if (this.stats.currentStreak >= 3) score += 10;
        
        // Bonus for task completion
        const todayCompletedTasks = this.state.tasks.filter(t => 
            t.completed && new Date(t.completedAt || Date.now()).toDateString() === new Date().toDateString()
        ).length;
        score += Math.min(todayCompletedTasks * 5, 25);
        
        // Bonus for idea generation
        score += Math.min(this.stats.todayIdeas * 2, 10);
        
        // Bonus for using ambient sounds
        if (this.audioSystem && this.audioSystem.hasActiveSounds()) {
            score += 5;
        }
        
        // Apply diminishing returns and cap at 100
        this.state.focusScore = Math.min(Math.round(score * 0.8), 100);
        
        // Update average
        const totalScores = this.stats.totalSessions + 1;
        this.stats.averageFocusScore = Math.round(
            (this.stats.averageFocusScore * (totalScores - 1) + this.state.focusScore) / totalScores
        );
        
        document.getElementById('focusScore').textContent = this.state.focusScore;
    }

    // Achievement system (enhanced)
    checkAchievements() {
        const earnedNew = [];
        
        // Check all achievements
        const checks = {
            first_session: () => this.stats.totalSessions >= 1,
            daily_goal: () => this.stats.todayStudyTime >= 120,
            week_streak: () => this.stats.currentStreak >= 7,
            deep_work: () => this.stats.focusSessions.deepWork >= 1,
            idea_collector: () => this.state.ideas.length >= 50,
            flow_master: () => this.stats.focusSessions.flowState >= 10,
            focus_champion: () => this.state.focusScore >= 90,
            wellness_warrior: () => this.stats.breakActivitiesCompleted >= 20
        };
        
        this.achievements.forEach(achievement => {
            if (!achievement.earned && checks[achievement.id] && checks[achievement.id]()) {
                achievement.earned = true;
                earnedNew.push(achievement.id);
            }
        });
        
        if (earnedNew.length > 0) {
            this.showAchievementBanner(earnedNew[0]);
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

    // Wellness reminders
    startWellnessReminders() {
        this.wellnessInterval = setInterval(() => {
            if (!this.state.isRunning || this.state.isBreak) return;
            
            const sessionTime = (this.state.totalTime - this.state.timeLeft) * 1000;
            
            // Eye reminder every 20 minutes
            if (this.state.settings.eyeReminders && sessionTime % (20 * 60 * 1000) < 1000) {
                this.showNotification('👁️ Eye Break: Look at something 20 feet away for 20 seconds', 'warning');
            }
            
            // Posture reminder every 30 minutes
            if (this.state.settings.postureReminders && sessionTime % (30 * 60 * 1000) < 1000) {
                this.showNotification('🪑 Posture Check: Adjust your sitting position and stretch', 'warning');
            }
            
            // Hydration reminder every 45 minutes
            if (this.state.settings.hydrationReminders && sessionTime % (45 * 60 * 1000) < 1000) {
                this.showNotification('💧 Hydration: Time to drink some water!', 'warning');
            }
        }, 60000);
    }

    // Event Listeners
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
        document.getElementById('clearIdeasBtn').addEventListener('click', () => this.clearAllIdeas());
        document.getElementById('voiceIdeaBtn').addEventListener('click', () => this.startVoiceRecognition());

        // Ideas filtering
        document.getElementById('ideasSearch').addEventListener('input', () => this.filterIdeas());
        document.getElementById('ideasFilter').addEventListener('change', () => this.filterIdeas());

        // Authentication
        this.setupAuthListeners();

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

        // User menu
        document.getElementById('userMenuBtn').addEventListener('click', () => {
            document.getElementById('userDropdown').classList.toggle('hidden');
        });
        document.getElementById('signOutBtn').addEventListener('click', () => this.signOut());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Close dropdowns/modals on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
            if (!e.target.closest('.user-menu')) {
                document.getElementById('userDropdown').classList.add('hidden');
            }
        });
    }

    setupAuthListeners() {
        // Auth tabs
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                
                const isSignUp = e.target.dataset.tab === 'signup';
                document.getElementById('authTitle').textContent = isSignUp ? 'Create Account' : 'Welcome Back';
                document.getElementById('authSubtitle').textContent = isSignUp ? 'Start your productivity journey' : 'Sign in to sync your progress';
                document.getElementById('authSubmit').textContent = isSignUp ? 'Sign Up' : 'Sign In';
                document.querySelector('.confirm-password-group').classList.toggle('hidden', !isSignUp);
            });
        });

        // Auth form
        document.getElementById('authForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('authEmail').value;
            const password = document.getElementById('authPassword').value;
            const confirmPassword = document.getElementById('authConfirmPassword').value;
            const isSignUp = document.querySelector('.auth-tab.active').dataset.tab === 'signup';
            
            if (isSignUp && password !== confirmPassword) {
                this.showAuthError('Passwords do not match');
                return;
            }
            
            try {
                if (isSignUp) {
                    await this.signUpWithEmail(email, password);
                } else {
                    await this.signInWithEmail(email, password);
                }
            } catch (error) {
                this.showAuthError(error.message);
            }
        });

        // Google sign in
        document.getElementById('googleSignIn').addEventListener('click', () => {
            this.signInWithGoogle();
        });

        // Continue offline
        document.getElementById('continueOffline').addEventListener('click', () => {
            this.hideAuthModal();
        });

        // Forgot password
        document.getElementById('forgotPassword').addEventListener('click', () => {
            const email = prompt('Enter your email address:');
            if (email) {
                this.sendPasswordReset(email);
            }
        });
    }

    async sendPasswordReset(email) {
        try {
            const { sendPasswordResetEmail } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js');
            await sendPasswordResetEmail(this.firebaseAuth, email);
            this.showNotification('Password reset email sent!', 'success');
        } catch (error) {
            this.showNotification('Failed to send reset email: ' + error.message, 'error');
        }
    }

    showAuthError(message) {
        const errorDiv = document.getElementById('authError');
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        
        setTimeout(() => {
            errorDiv.classList.add('hidden');
        }, 5000);
    }

    showAuthModal() {
        if (!this.state.isAuthenticated) {
            document.getElementById('authModal').classList.remove('hidden');
        }
    }

    hideAuthModal() {
        document.getElementById('authModal').classList.add('hidden');
    }

    updateUserInterface() {
        const isAuth = this.state.isAuthenticated;
        document.getElementById('userMenu').style.display = 'block';
        
        if (isAuth) {
            this.hideAuthModal();
        }
    }

    setupSettingsListeners() {
        const settingsInputs = [
            'customStudyTime', 'customBreakTime', 'soundEnabled', 'autoStartBreaks',
            'eyeReminders', 'postureReminders', 'hydrationReminders', 'distractionFreeMode',
            'autoMusicBreaks', 'ambientMixMode'
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
                    
                    this.saveData();
                    this.syncDataToFirebase();
                });
            }
        });
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
        const progress = ((this.state.totalTime - this.state.timeLeft) / this.state.totalTime) * 879;
        document.getElementById('timerProgress').style.strokeDashoffset = 879 - progress;
        
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
        Object.keys(this.state.settings).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = this.state.settings[key];
                } else {
                    element.value = this.state.settings[key];
                }
            }
        });
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
            this.syncDataToFirebase();
        }
    }

    // Data persistence
    loadData() {
        const savedState = localStorage.getItem('studyflow-state-v3');
        const savedStats = localStorage.getItem('studyflow-stats-v3');
        const savedTasks = localStorage.getItem('studyflow-tasks-v3');
        const savedIdeas = localStorage.getItem('studyflow-ideas-v3');
        const savedSettings = localStorage.getItem('studyflow-settings-v3');
        const savedAchievements = localStorage.getItem('studyflow-achievements-v3');

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
        localStorage.setItem('studyflow-state-v3', JSON.stringify({
            currentMode: this.state.currentMode,
            sessionCount: this.state.sessionCount,
            completedSessions: this.state.completedSessions,
            focusScore: this.state.focusScore,
            settings: this.state.settings
        }));
        localStorage.setItem('studyflow-stats-v3', JSON.stringify(this.stats));
        localStorage.setItem('studyflow-tasks-v3', JSON.stringify(this.state.tasks));
        localStorage.setItem('studyflow-ideas-v3', JSON.stringify(this.state.ideas));
        localStorage.setItem('studyflow-settings-v3', JSON.stringify(this.state.settings));
        localStorage.setItem('studyflow-achievements-v3', JSON.stringify(this.achievements.map(a => ({ id: a.id, earned: a.earned }))));
    }

    // Utility functions
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

    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        container.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    playNotificationSound() {
        if (this.state.settings.soundEnabled) {
            // Create and play notification sound
            if (this.audioSystem) {
                this.audioSystem.playNotification();
            }
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
        
        const csv = Object.keys(data).join(',') + '\n' + Object.values(data).join(',');
        this.downloadFile(csv, `studyflow-stats-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
    }

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
}

// Ambient Audio System using Web Audio API
class AmbientAudioSystem {
    constructor(soundConfig) {
        this.audioContext = null;
        this.sounds = {};
        this.masterGain = null;
        this.soundConfig = soundConfig;
        this.analyser = null;
        this.visualizerCanvas = null;
        this.animationId = null;
        
        this.initializeAudioContext();
    }

    initializeAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.masterGain.connect(this.analyser);
            
            this.initializeSounds();
        } catch (error) {
            console.error('Web Audio API not supported:', error);
        }
    }

    initializeSounds() {
        Object.keys(this.soundConfig).forEach(soundName => {
            this.sounds[soundName] = this.createSound(soundName, this.soundConfig[soundName]);
        });
    }

    createSound(name, config) {
        const sound = {
            oscillators: [],
            gainNode: this.audioContext.createGain(),
            isPlaying: false,
            config: config
        };
        
        sound.gainNode.connect(this.masterGain);
        sound.gainNode.gain.value = 0;
        
        return sound;
    }

    generateSound(soundName) {
        const sound = this.sounds[soundName];
        if (!sound || sound.isPlaying) return;
        
        const config = sound.config;
        
        switch (config.type) {
            case 'noise':
                this.generateNoise(sound, config);
                break;
            case 'nature':
                this.generateNature(sound, config);
                break;
            case 'ambient':
                this.generateAmbient(sound, config);
                break;
            case 'wave':
                this.generateWave(sound, config);
                break;
        }
        
        sound.isPlaying = true;
    }

    generateNoise(sound, config) {
        // Brown/White noise generation
        const bufferSize = 4096;
        const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
            if (config.baseFreq > 1000) {
                // White noise
                output[i] = Math.random() * 2 - 1;
            } else {
                // Brown noise
                const white = Math.random() * 2 - 1;
                output[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = output[i];
                output[i] *= 3.5;
            }
        }
        
        const noiseSource = this.audioContext.createBufferSource();
        noiseSource.buffer = noiseBuffer;
        noiseSource.loop = true;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = config.filterFreq || config.baseFreq;
        
        noiseSource.connect(filter);
        filter.connect(sound.gainNode);
        noiseSource.start();
        
        sound.oscillators.push(noiseSource);
    }

    generateNature(sound, config) {
        // Forest sounds with bird chirps and wind
        config.birdFreqs.forEach((freq, index) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            // Randomize bird chirps
            gain.gain.setValueAtTime(0, this.audioContext.currentTime);
            this.scheduleRandomChirps(gain, freq);
            
            osc.connect(gain);
            gain.connect(sound.gainNode);
            osc.start();
            
            sound.oscillators.push(osc);
        });
        
        // Wind sound
        const windOsc = this.audioContext.createOscillator();
        const windGain = this.audioContext.createGain();
        const windFilter = this.audioContext.createBiquadFilter();
        
        windOsc.type = 'sawtooth';
        windOsc.frequency.value = config.windFreq;
        windFilter.type = 'lowpass';
        windFilter.frequency.value = 200;
        
        windGain.gain.value = 0.1;
        this.modulateWind(windGain);
        
        windOsc.connect(windFilter);
        windFilter.connect(windGain);
        windGain.connect(sound.gainNode);
        windOsc.start();
        
        sound.oscillators.push(windOsc);
    }

    generateAmbient(sound, config) {
        // Café ambience with multiple layers
        for (let i = 0; i < 3; i++) {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            osc.type = 'brown';
            osc.frequency.value = config.baseFreq + (i * 50);
            filter.type = 'bandpass';
            filter.frequency.value = config.chatterFreq + (i * 200);
            filter.Q.value = 5;
            
            gain.gain.value = 0.05;
            this.modulateChatter(gain);
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(sound.gainNode);
            osc.start();
            
            sound.oscillators.push(osc);
        }
    }

    generateWave(sound, config) {
        // Ocean wave sounds
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        osc.type = 'sawtooth';
        osc.frequency.value = 50;
        filter.type = 'lowpass';
        filter.frequency.value = 300;
        
        gain.gain.value = 0;
        this.modulateWaves(gain, config.frequency);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(sound.gainNode);
        osc.start();
        
        sound.oscillators.push(osc);
    }

    scheduleRandomChirps(gainNode, baseFreq) {
        const scheduleNextChirp = () => {
            const delay = Math.random() * 5 + 2; // 2-7 seconds
            const duration = Math.random() * 0.5 + 0.1; // 0.1-0.6 seconds
            const now = this.audioContext.currentTime;
            
            gainNode.gain.setValueAtTime(0, now + delay);
            gainNode.gain.linearRampToValueAtTime(0.1, now + delay + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
            
            setTimeout(scheduleNextChirp, (delay + duration) * 1000);
        };
        
        scheduleNextChirp();
    }

    modulateWind(gainNode) {
        const modulate = () => {
            const now = this.audioContext.currentTime;
            const duration = Math.random() * 3 + 2;
            const intensity = Math.random() * 0.15 + 0.05;
            
            gainNode.gain.setValueAtTime(gainNode.gain.value, now);
            gainNode.gain.linearRampToValueAtTime(intensity, now + duration / 2);
            gainNode.gain.linearRampToValueAtTime(0.02, now + duration);
            
            setTimeout(modulate, duration * 1000);
        };
        
        modulate();
    }

    modulateChatter(gainNode) {
        const modulate = () => {
            const now = this.audioContext.currentTime;
            const duration = Math.random() * 2 + 0.5;
            const intensity = Math.random() * 0.08 + 0.02;
            
            gainNode.gain.setValueAtTime(gainNode.gain.value, now);
            gainNode.gain.linearRampToValueAtTime(intensity, now + duration / 2);
            gainNode.gain.linearRampToValueAtTime(0.01, now + duration);
            
            setTimeout(modulate, duration * 1000);
        };
        
        modulate();
    }

    modulateWaves(gainNode, frequency) {
        const modulate = () => {
            const now = this.audioContext.currentTime;
            const period = 1 / frequency;
            
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.3, now + period / 4);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + period);
            
            setTimeout(modulate, period * 1000);
        };
        
        modulate();
    }

    toggleSound(soundName) {
        const sound = this.sounds[soundName];
        if (!sound) return false;
        
        if (sound.isPlaying) {
            this.stopSound(soundName);
            return false;
        } else {
            this.generateSound(soundName);
            return true;
        }
    }

    stopSound(soundName) {
        const sound = this.sounds[soundName];
        if (!sound || !sound.isPlaying) return;
        
        sound.oscillators.forEach(osc => {
            try {
                osc.stop();
                osc.disconnect();
            } catch (error) {
                // Oscillator might already be stopped
            }
        });
        
        sound.oscillators = [];
        sound.isPlaying = false;
        sound.gainNode.gain.value = 0;
    }

    stopAllSounds() {
        Object.keys(this.sounds).forEach(soundName => {
            this.stopSound(soundName);
        });
    }

    setVolume(soundName, volume) {
        const sound = this.sounds[soundName];
        if (!sound) return;
        
        if (volume > 0 && !sound.isPlaying) {
            this.generateSound(soundName);
        } else if (volume === 0 && sound.isPlaying) {
            this.stopSound(soundName);
            return;
        }
        
        if (sound.gainNode) {
            sound.gainNode.gain.linearRampToValueAtTime(volume * sound.config.gain, this.audioContext.currentTime + 0.1);
        }
    }

    setMasterVolume(volume) {
        if (this.masterGain) {
            this.masterGain.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.1);
        }
    }

    hasActiveSounds() {
        return Object.values(this.sounds).some(sound => sound.isPlaying);
    }

    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    pause() {
        // Keep sounds running but reduce volume
    }

    playNotification() {
        // Simple notification beep
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.frequency.value = 800;
        osc.type = 'sine';
        
        gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + 0.3);
    }

    initializeVisualizer(canvas) {
        if (!canvas || !this.analyser) return;
        
        this.visualizerCanvas = canvas;
        const ctx = canvas.getContext('2d');
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        const draw = () => {
            this.animationId = requestAnimationFrame(draw);
            
            this.analyser.getByteFrequencyData(dataArray);
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;
            
            for (let i = 0; i < bufferLength; i++) {
                barHeight = (dataArray[i] / 255) * canvas.height;
                
                const r = Math.floor(16 + (barHeight / canvas.height) * 169);
                const g = Math.floor(185 + (barHeight / canvas.height) * 70);
                const b = Math.floor(129 + (barHeight / canvas.height) * 126);
                
                ctx.fillStyle = `rgb(${r},${g},${b})`;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                
                x += barWidth + 1;
            }
        };
        
        draw();
    }
}

// Spotify Player Integration
class SpotifyPlayer {
    constructor(config) {
        this.config = config;
        this.player = null;
        this.deviceId = null;
        this.accessToken = null;
        this.isConnected = false;
        this.currentTrack = null;
    }

    async connect() {
        try {
            // Redirect to Spotify authorization
            const scopes = this.config.scopes.join('%20');
            const authUrl = `https://accounts.spotify.com/authorize?client_id=${this.config.clientId}&response_type=token&redirect_uri=${encodeURIComponent(this.config.redirectUri)}&scope=${scopes}`;
            
            // Check if we're returning from Spotify auth
            const hash = window.location.hash.substring(1);
            const params = new URLSearchParams(hash);
            
            if (params.has('access_token')) {
                this.accessToken = params.get('access_token');
                window.location.hash = '';
                await this.initializePlayer();
            } else {
                window.location.href = authUrl;
            }
        } catch (error) {
            console.error('Spotify connection failed:', error);
        }
    }

    async initializePlayer() {
        if (!window.Spotify || !this.accessToken) {
            console.error('Spotify SDK not loaded');
            return;
        }

        this.player = new window.Spotify.Player({
            name: this.config.deviceName,
            getOAuthToken: cb => { cb(this.accessToken); },
            volume: 0.5
        });

        // Player event handlers
        this.player.addListener('ready', ({ device_id }) => {
            this.deviceId = device_id;
            this.isConnected = true;
            this.updateUI();
            console.log('Spotify player ready:', device_id);
        });

        this.player.addListener('not_ready', ({ device_id }) => {
            console.log('Spotify player not ready:', device_id);
            this.isConnected = false;
            this.updateUI();
        });

        this.player.addListener('player_state_changed', (state) => {
            if (!state) return;
            
            this.currentTrack = state.track_window.current_track;
            this.updateTrackDisplay();
        });

        // Connect to the player
        const connected = await this.player.connect();
        if (connected) {
            console.log('Successfully connected to Spotify');
        }
    }

    updateUI() {
        const authSection = document.getElementById('spotifyAuth');
        const controlsSection = document.getElementById('spotifyControls');
        
        if (this.isConnected) {
            authSection.classList.add('hidden');
            controlsSection.classList.remove('hidden');
        } else {
            authSection.classList.remove('hidden');
            controlsSection.classList.add('hidden');
        }
    }

    updateTrackDisplay() {
        if (!this.currentTrack) return;
        
        document.getElementById('trackName').textContent = this.currentTrack.name;
        document.getElementById('artistName').textContent = this.currentTrack.artists.map(a => a.name).join(', ');
        
        const albumArt = document.getElementById('albumArt');
        if (this.currentTrack.album.images.length > 0) {
            albumArt.src = this.currentTrack.album.images[0].url;
            albumArt.style.display = 'block';
        }
    }

    async togglePlayback() {
        if (!this.player) return;
        
        const state = await this.player.getCurrentState();
        if (state && state.paused) {
            this.player.resume();
            document.getElementById('playPauseBtn').textContent = '⏸️';
        } else {
            this.player.pause();
            document.getElementById('playPauseBtn').textContent = '▶️';
        }
    }

    async previousTrack() {
        if (this.player) {
            await this.player.previousTrack();
        }
    }

    async nextTrack() {
        if (this.player) {
            await this.player.nextTrack();
        }
    }

    async setVolume(volume) {
        if (this.player) {
            await this.player.setVolume(volume / 100);
        }
    }

    async playPlaylist(playlistId) {
        if (!this.accessToken || !this.deviceId) return;
        
        try {
            const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    context_uri: `spotify:playlist:${playlistId}`
                })
            });
            
            if (response.ok) {
                console.log('Playlist started');
            }
        } catch (error) {
            console.error('Failed to play playlist:', error);
        }
    }

    pause() {
        if (this.player) {
            this.player.pause();
        }
    }

    resume() {
        if (this.player) {
            this.player.resume();
        }
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
        window.studyFlowApp.syncDataToFirebase();
    }
});

// Save data before page unload
window.addEventListener('beforeunload', () => {
    if (window.studyFlowApp) {
        window.studyFlowApp.saveData();
        window.studyFlowApp.syncDataToFirebase();
    }
});

// Handle Spotify callback
window.addEventListener('load', () => {
    if (window.location.hash.includes('access_token')) {
        // Spotify auth callback handled in SpotifyPlayer.connect()
    }
});

// Spotify Web Playback SDK ready callback
window.onSpotifyWebPlaybackSDKReady = () => {
    console.log('Spotify Web Playback SDK is ready');
};