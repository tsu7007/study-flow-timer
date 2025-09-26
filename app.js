// StudyFlow Pro App with Real Working Ambient Sounds
class AmbientAudioSystem {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.sounds = {
            rain: { generator: null, gain: null, volume: 0 },
            forest: { generator: null, gain: null, volume: 0 },
            cafe: { generator: null, gain: null, volume: 0 },
            waves: { generator: null, gain: null, volume: 0 }
        };
        this.masterVolume = 0.5;
        this.isEnabled = false;
        this.analyser = null;
        this.visualizerActive = false;
        this.animationId = null;
    }

    async initialize() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.analyser = this.audioContext.createAnalyser();
            
            this.masterGain.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            
            this.analyser.fftSize = 256;
            this.analyser.smoothingTimeConstant = 0.8;
            
            this.masterGain.gain.value = this.masterVolume;
            this.isEnabled = true;
            
            return true;
        } catch (error) {
            console.error('Failed to initialize audio context:', error);
            return false;
        }
    }

    createRainSound() {
        if (!this.audioContext) return null;

        const bufferSize = this.audioContext.sampleRate * 2;
        const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = this.audioContext.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const bandpass = this.audioContext.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.value = 1000;
        bandpass.Q.value = 0.3;

        const lowpass = this.audioContext.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = 400;

        const gain = this.audioContext.createGain();
        gain.gain.value = 0;

        whiteNoise.connect(bandpass);
        bandpass.connect(lowpass);
        lowpass.connect(gain);
        gain.connect(this.masterGain);

        return { source: whiteNoise, gain, filter: bandpass };
    }

    createForestSound() {
        if (!this.audioContext) return null;

        const gain = this.audioContext.createGain();
        gain.gain.value = 0;
        gain.connect(this.masterGain);

        // Wind sound (low frequency noise)
        const windBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 4, this.audioContext.sampleRate);
        const windOutput = windBuffer.getChannelData(0);
        
        for (let i = 0; i < windOutput.length; i++) {
            windOutput[i] = (Math.random() * 2 - 1) * 0.3;
        }

        const windSource = this.audioContext.createBufferSource();
        windSource.buffer = windBuffer;
        windSource.loop = true;

        const windFilter = this.audioContext.createBiquadFilter();
        windFilter.type = 'lowpass';
        windFilter.frequency.value = 100;

        windSource.connect(windFilter);
        windFilter.connect(gain);

        // Bird chirps (random oscillators)
        const birdGain = this.audioContext.createGain();
        birdGain.gain.value = 0.1;
        birdGain.connect(gain);

        const sources = [windSource];
        
        // Create intermittent bird sounds
        const createBirdChirp = () => {
            if (!this.sounds.forest.volume > 0) return;

            const osc = this.audioContext.createOscillator();
            const chirpGain = this.audioContext.createGain();
            const freq = 2000 + Math.random() * 2000;
            
            osc.frequency.value = freq;
            osc.type = 'sine';
            
            chirpGain.gain.setValueAtTime(0, this.audioContext.currentTime);
            chirpGain.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.1);
            chirpGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
            
            osc.connect(chirpGain);
            chirpGain.connect(birdGain);
            
            osc.start(this.audioContext.currentTime);
            osc.stop(this.audioContext.currentTime + 0.5);

            // Schedule next chirp randomly
            setTimeout(createBirdChirp, Math.random() * 5000 + 2000);
        };

        // Start bird chirps
        setTimeout(createBirdChirp, Math.random() * 3000);

        return { sources, gain };
    }

    createCafeSound() {
        if (!this.audioContext) return null;

        const gain = this.audioContext.createGain();
        gain.gain.value = 0;
        gain.connect(this.masterGain);

        // Base ambient noise
        const ambientBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 3, this.audioContext.sampleRate);
        const ambientOutput = ambientBuffer.getChannelData(0);

        for (let i = 0; i < ambientOutput.length; i++) {
            ambientOutput[i] = (Math.random() * 2 - 1) * 0.2;
        }

        const ambientSource = this.audioContext.createBufferSource();
        ambientSource.buffer = ambientBuffer;
        ambientSource.loop = true;

        const ambientFilter = this.audioContext.createBiquadFilter();
        ambientFilter.type = 'bandpass';
        ambientFilter.frequency.value = 200;
        ambientFilter.Q.value = 2;

        ambientSource.connect(ambientFilter);
        ambientFilter.connect(gain);

        // Chatter simulation (random frequency modulation)
        const chatterOsc = this.audioContext.createOscillator();
        const chatterGain = this.audioContext.createGain();
        const chatterFilter = this.audioContext.createBiquadFilter();
        
        chatterOsc.type = 'sawtooth';
        chatterOsc.frequency.value = 1000;
        chatterGain.gain.value = 0.05;
        chatterFilter.type = 'lowpass';
        chatterFilter.frequency.value = 800;

        // Random frequency modulation for chatter effect
        const lfo = this.audioContext.createOscillator();
        const lfoGain = this.audioContext.createGain();
        lfo.frequency.value = 0.5;
        lfoGain.gain.value = 200;

        lfo.connect(lfoGain);
        lfoGain.connect(chatterOsc.frequency);

        chatterOsc.connect(chatterFilter);
        chatterFilter.connect(chatterGain);
        chatterGain.connect(gain);

        const sources = [ambientSource, chatterOsc, lfo];
        return { sources, gain };
    }

    createWaveSound() {
        if (!this.audioContext) return null;

        const gain = this.audioContext.createGain();
        gain.gain.value = 0;
        gain.connect(this.masterGain);

        // Main wave oscillator
        const waveOsc = this.audioContext.createOscillator();
        const waveGain = this.audioContext.createGain();
        const waveFilter = this.audioContext.createBiquadFilter();

        waveOsc.type = 'sine';
        waveOsc.frequency.value = 80;
        waveFilter.type = 'lowpass';
        waveFilter.frequency.value = 200;

        // LFO for wave movement
        const waveLfo = this.audioContext.createOscillator();
        const waveLfoGain = this.audioContext.createGain();
        waveLfo.frequency.value = 0.3;
        waveLfoGain.gain.value = 20;

        // Amplitude modulation for wave crashing effect
        const ampLfo = this.audioContext.createOscillator();
        const ampLfoGain = this.audioContext.createGain();
        ampLfo.frequency.value = 0.1;
        ampLfoGain.gain.value = 0.3;
        waveGain.gain.value = 0.3;

        waveLfo.connect(waveLfoGain);
        waveLfoGain.connect(waveOsc.frequency);

        ampLfo.connect(ampLfoGain);
        ampLfoGain.connect(waveGain.gain);

        waveOsc.connect(waveFilter);
        waveFilter.connect(waveGain);
        waveGain.connect(gain);

        // White noise for foam/crash effect
        const foamBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate, this.audioContext.sampleRate);
        const foamOutput = foamBuffer.getChannelData(0);

        for (let i = 0; i < foamOutput.length; i++) {
            foamOutput[i] = (Math.random() * 2 - 1) * 0.1;
        }

        const foamSource = this.audioContext.createBufferSource();
        foamSource.buffer = foamBuffer;
        foamSource.loop = true;

        const foamFilter = this.audioContext.createBiquadFilter();
        foamFilter.type = 'highpass';
        foamFilter.frequency.value = 2000;

        const foamGain = this.audioContext.createGain();
        foamGain.gain.value = 0.1;

        foamSource.connect(foamFilter);
        foamFilter.connect(foamGain);
        foamGain.connect(gain);

        const sources = [waveOsc, waveLfo, ampLfo, foamSource];
        return { sources, gain };
    }

    startSound(soundType) {
        if (!this.isEnabled || !this.audioContext) return;

        this.stopSound(soundType);

        let soundData = null;
        switch (soundType) {
            case 'rain':
                soundData = this.createRainSound();
                break;
            case 'forest':
                soundData = this.createForestSound();
                break;
            case 'cafe':
                soundData = this.createCafeSound();
                break;
            case 'waves':
                soundData = this.createWaveSound();
                break;
        }

        if (soundData) {
            this.sounds[soundType].generator = soundData;
            this.sounds[soundType].gain = soundData.gain;

            if (soundData.source) {
                soundData.source.start();
            } else if (soundData.sources) {
                soundData.sources.forEach(source => {
                    try { source.start(); } catch (e) { /* Already started */ }
                });
            }
        }
    }

    stopSound(soundType) {
        const sound = this.sounds[soundType];
        if (sound.generator) {
            try {
                if (sound.generator.source) {
                    sound.generator.source.stop();
                } else if (sound.generator.sources) {
                    sound.generator.sources.forEach(source => {
                        try { source.stop(); } catch (e) { /* Already stopped */ }
                    });
                }
            } catch (e) {
                console.warn('Error stopping sound:', e);
            }
            sound.generator = null;
            sound.gain = null;
        }
    }

    setSoundVolume(soundType, volume) {
        this.sounds[soundType].volume = volume;
        if (this.sounds[soundType].gain) {
            this.sounds[soundType].gain.gain.setValueAtTime(volume, this.audioContext.currentTime);
        }

        if (volume > 0 && !this.sounds[soundType].generator) {
            this.startSound(soundType);
        } else if (volume === 0 && this.sounds[soundType].generator) {
            this.stopSound(soundType);
        }
    }

    setMasterVolume(volume) {
        this.masterVolume = volume;
        if (this.masterGain) {
            this.masterGain.gain.setValueAtTime(volume, this.audioContext.currentTime);
        }
    }

    playTimerSound(type) {
        if (!this.isEnabled || !this.audioContext) return;

        const frequencies = type === 'study' ? [523.25, 659.25, 783.99] : [440, 554.37];
        
        frequencies.forEach((freq, index) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.frequency.value = freq;
            osc.type = 'sine';
            
            const startTime = this.audioContext.currentTime + index * 0.2;
            const duration = 0.3;
            
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.3, startTime + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
            
            osc.connect(gain);
            gain.connect(this.masterGain);
            
            osc.start(startTime);
            osc.stop(startTime + duration);
        });
    }

    startVisualizer(canvas) {
        if (!this.analyser || this.visualizerActive) return;
        
        const ctx = canvas.getContext('2d');
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        this.visualizerActive = true;
        
        const draw = () => {
            if (!this.visualizerActive) return;
            
            this.animationId = requestAnimationFrame(draw);
            
            this.analyser.getByteFrequencyData(dataArray);
            
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-bg-1');
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const barWidth = canvas.width / bufferLength * 2;
            let x = 0;
            
            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
                
                const hue = (i / bufferLength) * 360;
                ctx.fillStyle = `hsla(${hue}, 50%, 60%, 0.8)`;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                
                x += barWidth + 1;
            }
        };
        
        draw();
    }

    stopVisualizer() {
        this.visualizerActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    cleanup() {
        Object.keys(this.sounds).forEach(soundType => {
            this.stopSound(soundType);
        });
        
        this.stopVisualizer();
        
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
        }
    }
}

// Enhanced StudyFlow App with Audio
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

        this.soundPresets = [
            {name: "Deep Focus", sounds: ["rain", "cafe"], volumes: [30, 10]},
            {name: "Nature Study", sounds: ["forest", "waves"], volumes: [40, 20]},
            {name: "Café Vibes", sounds: ["cafe"], volumes: [30]},
            {name: "Pure Rain", sounds: ["rain"], volumes: [40]}
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
            settings: {
                soundEnabled: true,
                autoStartBreaks: true,
                ambientDuringBreaks: true,
                customStudyTime: 60,
                customBreakTime: 10,
                highQualityAudio: true
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
        this.audioSystem = new AmbientAudioSystem();

        this.init();
    }

    async init() {
        this.loadData();
        this.setupEventListeners();
        this.updateDisplay();
        this.updateStats();
        this.renderTasks();
        this.updateTimerMode();
        this.checkDailyReset();
        this.setupAudioControls();
    }

    setupAudioControls() {
        // Volume sliders
        ['rain', 'forest', 'cafe', 'waves'].forEach(sound => {
            const slider = document.getElementById(`${sound}Volume`);
            const valueDisplay = slider.nextElementSibling;
            
            slider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                valueDisplay.textContent = `${value}%`;
                this.audioSystem.setSoundVolume(sound, value / 100);
                this.updateSoundStatus(sound, value > 0);
            });
        });

        // Master volume
        const masterSlider = document.getElementById('masterVolume');
        const masterValueDisplay = masterSlider.nextElementSibling;
        masterSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            masterValueDisplay.textContent = `${value}%`;
            this.audioSystem.setMasterVolume(value / 100);
        });

        // Sound buttons
        document.querySelectorAll('.sound-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sound = btn.dataset.sound;
                const slider = document.getElementById(`${sound}Volume`);
                const currentVolume = parseInt(slider.value);
                
                if (currentVolume > 0) {
                    slider.value = 0;
                    this.audioSystem.setSoundVolume(sound, 0);
                    this.updateSoundStatus(sound, false);
                } else {
                    slider.value = 30;
                    this.audioSystem.setSoundVolume(sound, 0.3);
                    this.updateSoundStatus(sound, true);
                }
                
                slider.nextElementSibling.textContent = `${slider.value}%`;
            });
        });

        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                this.loadSoundPreset(index);
            });
        });

        // Audio modal
        document.getElementById('audioBtn').addEventListener('click', () => this.openModal('audioModal'));
        document.getElementById('closeAudioModal').addEventListener('click', () => this.closeModal('audioModal'));
        
        // Enable audio button
        document.getElementById('enableAudioBtn').addEventListener('click', async () => {
            await this.enableAudio();
        });
    }

    async enableAudio() {
        const success = await this.audioSystem.initialize();
        
        if (success) {
            document.getElementById('audioPermission').classList.add('hidden');
            document.getElementById('audioControls').classList.remove('hidden');
            
            // Start visualizer
            const canvas = document.getElementById('audioVisualizer');
            this.audioSystem.startVisualizer(canvas);
            
            // Enable high quality audio if setting is on
            if (this.state.settings.highQualityAudio) {
                document.getElementById('highQualityAudio').checked = true;
            }
        } else {
            alert('Failed to initialize audio. Please check your browser permissions.');
        }
    }

    updateSoundStatus(soundType, isPlaying) {
        const btn = document.querySelector(`[data-sound="${soundType}"]`);
        const status = btn.querySelector('.sound-status');
        
        if (isPlaying) {
            btn.classList.add('active');
            status.classList.add('playing');
        } else {
            btn.classList.remove('active');
            status.classList.remove('playing');
        }
    }

    loadSoundPreset(presetIndex) {
        const preset = this.soundPresets[presetIndex];
        if (!preset) return;

        // Reset all volumes to 0
        ['rain', 'forest', 'cafe', 'waves'].forEach(sound => {
            const slider = document.getElementById(`${sound}Volume`);
            slider.value = 0;
            slider.nextElementSibling.textContent = '0%';
            this.audioSystem.setSoundVolume(sound, 0);
            this.updateSoundStatus(sound, false);
        });

        // Set preset volumes
        preset.sounds.forEach((sound, index) => {
            const volume = preset.volumes[index];
            const slider = document.getElementById(`${sound}Volume`);
            slider.value = volume;
            slider.nextElementSibling.textContent = `${volume}%`;
            this.audioSystem.setSoundVolume(sound, volume / 100);
            this.updateSoundStatus(sound, true);
        });

        // Update preset button states
        document.querySelectorAll('.preset-btn').forEach((btn, index) => {
            btn.classList.toggle('active', index === presetIndex);
        });
    }

    // Data persistence
    loadData() {
        const savedState = JSON.parse(localStorage.getItem('studyflow-state') || '{}');
        const savedStats = JSON.parse(localStorage.getItem('studyflow-stats') || '{}');
        const savedTasks = JSON.parse(localStorage.getItem('studyflow-tasks') || '[]');
        const savedSettings = JSON.parse(localStorage.getItem('studyflow-settings') || '{}');

        this.state = { ...this.state, ...savedState, isRunning: false, isPaused: false };
        this.stats = { ...this.stats, ...savedStats };
        this.state.tasks = savedTasks;
        this.state.settings = { ...this.state.settings, ...savedSettings };
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
        document.getElementById('ambientDuringBreaks').addEventListener('change', (e) => {
            this.state.settings.ambientDuringBreaks = e.target.checked;
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
        
        if (this.state.settings.soundEnabled && this.audioSystem.isEnabled) {
            this.audioSystem.playTimerSound(this.state.isBreak ? 'break' : 'study');
        }
        
        if (this.state.isBreak) {
            this.state.isBreak = false;
            this.state.sessionCount++;
            this.updateTimerMode();
            document.getElementById('timerLabel').textContent = 'Break complete! Ready for next session';
            this.closeModal('breakModal');
        } else {
            this.state.completedSessions++;
            this.stats.totalSessions++;
            this.stats.totalStudyTime += this.state.totalTime / 60;
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
        
        const message = this.motivationalMessages[Math.floor(Math.random() * this.motivationalMessages.length)];
        document.getElementById('breakMessage').textContent = message;
        this.openModal('breakModal');
        
        this.updateBreakDisplay();
        
        if (this.state.settings.autoStartBreaks) {
            setTimeout(() => this.startTimer(), 2000);
        }
        
        this.breakInterval = setInterval(() => {
            this.updateBreakDisplay();
        }, 1000);
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

    // Display updates
    updateDisplay() {
        const minutes = Math.floor(this.state.timeLeft / 60);
        const seconds = this.state.timeLeft % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('timerDisplay').textContent = timeString;
        document.getElementById('sessionType').textContent = this.state.isBreak ? 'Break Session' : 'Study Session';
        document.getElementById('sessionCount').textContent = `Session ${this.state.sessionCount}`;
        
        const progress = ((this.state.totalTime - this.state.timeLeft) / this.state.totalTime) * 754;
        document.getElementById('timerProgress').style.strokeDashoffset = 754 - progress;
        
        document.title = `${timeString} - StudyFlow Pro`;
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
        const studyHours = Math.floor(this.stats.todayStudyTime / 60);
        const studyMinutes = Math.floor(this.stats.todayStudyTime % 60);
        document.getElementById('todayStudyTime').textContent = `${studyHours}h ${studyMinutes}m`;
        document.getElementById('currentStreak').textContent = `${this.stats.currentStreak} days`;
        document.getElementById('todayTasks').textContent = this.stats.todayTasks;
        
        const totalHours = Math.floor(this.stats.totalStudyTime / 60);
        const totalMinutes = Math.floor(this.stats.totalStudyTime % 60);
        document.getElementById('totalStudyTime').textContent = `${totalHours}h ${totalMinutes}m`;
        document.getElementById('totalSessions').textContent = this.stats.totalSessions;
        document.getElementById('totalTasksCompleted').textContent = this.stats.totalTasksCompleted;
        document.getElementById('bestStreak').textContent = `${this.stats.bestStreak} days`;
        
        document.getElementById('customStudyTime').value = this.state.settings.customStudyTime;
        document.getElementById('customBreakTime').value = this.state.settings.customBreakTime;
        document.getElementById('soundEnabled').checked = this.state.settings.soundEnabled;
        document.getElementById('autoStartBreaks').checked = this.state.settings.autoStartBreaks;
        document.getElementById('ambientDuringBreaks').checked = this.state.settings.ambientDuringBreaks;
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
            case 'KeyM':
                e.preventDefault();
                // Toggle master volume mute
                const masterSlider = document.getElementById('masterVolume');
                const currentValue = parseInt(masterSlider.value);
                if (currentValue > 0) {
                    masterSlider.dataset.previousValue = currentValue;
                    masterSlider.value = 0;
                    this.audioSystem.setMasterVolume(0);
                } else {
                    const previousValue = parseInt(masterSlider.dataset.previousValue) || 50;
                    masterSlider.value = previousValue;
                    this.audioSystem.setMasterVolume(previousValue / 100);
                }
                masterSlider.nextElementSibling.textContent = `${masterSlider.value}%`;
                break;
        }
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

// Save data and cleanup audio before page unload
window.addEventListener('beforeunload', () => {
    if (window.studyFlowApp) {
        window.studyFlowApp.saveData();
        window.studyFlowApp.audioSystem.cleanup();
    }
});