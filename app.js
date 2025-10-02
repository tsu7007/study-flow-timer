// Firebase Configuration and App Setup
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    onAuthStateChanged,
    deleteUser
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc,
    onSnapshot,
    serverTimestamp,
    deleteDoc
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Firebase configuration - users should replace with their own
// To set up Firebase:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project
// 3. Enable Authentication with Email/Password and Google providers
// 4. Enable Firestore Database
// 5. Replace the config below with your project's config
const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789012",
    appId: "your-app-id"
};

// Check if Firebase config is properly set up
const isFirebaseConfigured = firebaseConfig.apiKey !== "your-api-key-here";

let app, auth, db, googleProvider;

// Initialize Firebase only if configured
if (isFirebaseConfigured) {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        googleProvider = new GoogleAuthProvider();
    } catch (error) {
        console.error('Firebase initialization error:', error);
    }
}

// StudyFlow App with Firebase Integration
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
            timeLeft: 25 * 60,
            totalTime: 25 * 60,
            sessionCount: 1,
            completedSessions: 0,
            tasks: [],
            settings: {
                soundEnabled: true,
                autoStartBreaks: true,
                customStudyTime: 60,
                customBreakTime: 10,
                syncEnabled: true
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

        this.user = null;
        this.timerInterval = null;
        this.breakInterval = null;
        this.draggedTask = null;
        this.unsubscribeUser = null;
        this.isOnline = navigator.onLine;
        this.pendingSync = false;
        this.isFirebaseEnabled = isFirebaseConfigured;

        this.init();
    }

    async init() {
        this.showLoading();
        this.setupEventListeners();
        this.setupOnlineStatus();
        
        if (this.isFirebaseEnabled) {
            // Initialize auth state listener
            onAuthStateChanged(auth, (user) => {
                this.handleAuthStateChange(user);
            });
        } else {
            // Run in offline mode
            this.handleAuthStateChange(null);
        }
    }

    showLoading() {
        document.getElementById('loadingScreen').classList.remove('hidden');
        document.getElementById('authContainer').classList.add('hidden');
        document.getElementById('appContainer').classList.add('hidden');
    }

    hideLoading() {
        document.getElementById('loadingScreen').classList.add('hidden');
    }

    async handleAuthStateChange(user) {
        this.user = user;
        
        if (user || !this.isFirebaseEnabled) {
            // User is signed in or Firebase is not configured (offline mode)
            await this.showMainApp();
            if (user && this.isFirebaseEnabled) {
                await this.syncUserData();
            }
        } else {
            // User is signed out and Firebase is available
            this.showAuthScreen();
        }
        
        this.hideLoading();
    }

    showAuthScreen() {
        if (!this.isFirebaseEnabled) {
            this.showFirebaseSetupMessage();
            return;
        }
        
        document.getElementById('authContainer').classList.remove('hidden');
        document.getElementById('appContainer').classList.add('hidden');
        this.showSignInForm();
    }

    showFirebaseSetupMessage() {
        // Show authentication screen with a message about Firebase setup
        document.getElementById('authContainer').classList.remove('hidden');
        document.getElementById('appContainer').classList.add('hidden');
        
        // Temporarily modify the auth screen to show setup instructions
        const authCard = document.querySelector('.auth-card');
        authCard.innerHTML = `
            <div class="auth-header">
                <h1 class="auth-title">StudyFlow</h1>
                <p class="auth-subtitle">Your productivity companion</p>
            </div>
            <div class="firebase-setup-notice">
                <h2>Firebase Setup Required</h2>
                <p class="auth-description">
                    To enable authentication and cloud sync, please set up Firebase:
                </p>
                <ol class="setup-steps">
                    <li>Create a project at <a href="https://console.firebase.google.com/" target="_blank">Firebase Console</a></li>
                    <li>Enable Authentication (Email/Password & Google)</li>
                    <li>Enable Firestore Database</li>
                    <li>Replace the config in app.js with your project's config</li>
                </ol>
                <button class="btn btn--primary btn--full-width" id="continueOfflineBtn">
                    Continue in Offline Mode
                </button>
                <p class="offline-note">You can use StudyFlow without authentication, but data won't sync across devices.</p>
            </div>
        `;
        
        // Add event listener for offline mode
        document.getElementById('continueOfflineBtn').addEventListener('click', () => {
            this.handleAuthStateChange(null);
        });
    }

    async showMainApp() {
        document.getElementById('authContainer').classList.add('hidden');
        document.getElementById('appContainer').classList.remove('hidden');
        
        // Update user info in header
        if (this.user) {
            const displayName = this.user.displayName || this.user.email.split('@')[0];
            document.getElementById('userDisplayName').textContent = displayName;
        } else {
            document.getElementById('userDisplayName').textContent = 'Offline User';
            // Hide sync-related features in offline mode
            document.getElementById('syncEnabled').parentElement.style.display = 'none';
        }
        
        // Load and display app data
        this.loadLocalData();
        this.updateDisplay();
        this.updateStats();
        this.renderTasks();
        this.updateTimerMode();
        this.checkDailyReset();
        
        // Set up real-time sync only if Firebase is available and user is authenticated
        if (this.user && this.isFirebaseEnabled && this.state.settings.syncEnabled) {
            this.setupRealtimeSync();
        }
    }

    // Authentication Methods
    showSignInForm() {
        document.getElementById('signInForm').classList.remove('hidden');
        document.getElementById('signUpForm').classList.add('hidden');
        document.getElementById('forgotPasswordForm').classList.add('hidden');
    }

    showSignUpForm() {
        document.getElementById('signInForm').classList.add('hidden');
        document.getElementById('signUpForm').classList.remove('hidden');
        document.getElementById('forgotPasswordForm').classList.add('hidden');
    }

    showForgotPasswordForm() {
        document.getElementById('signInForm').classList.add('hidden');
        document.getElementById('signUpForm').classList.add('hidden');
        document.getElementById('forgotPasswordForm').classList.remove('hidden');
    }

    showAuthError(message) {
        const errorEl = document.getElementById('authError');
        const messageEl = document.getElementById('authErrorMessage');
        messageEl.textContent = message;
        errorEl.classList.remove('hidden');
        
        setTimeout(() => {
            errorEl.classList.add('hidden');
        }, 5000);
    }

    showAuthSuccess(message) {
        const successEl = document.getElementById('authSuccess');
        const messageEl = document.getElementById('authSuccessMessage');
        messageEl.textContent = message;
        successEl.classList.remove('hidden');
        
        setTimeout(() => {
            successEl.classList.add('hidden');
        }, 5000);
    }

    async signInWithEmail(email, password) {
        if (!this.isFirebaseEnabled) {
            this.showAuthError('Firebase is not configured. Please set up Firebase or use offline mode.');
            return;
        }
        
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            this.showAuthError(this.getAuthErrorMessage(error.code));
        }
    }

    async signUpWithEmail(email, password, displayName) {
        if (!this.isFirebaseEnabled) {
            this.showAuthError('Firebase is not configured. Please set up Firebase or use offline mode.');
            return;
        }
        
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName });
            
            // Initialize user data in Firestore
            await this.initializeUserData(userCredential.user);
        } catch (error) {
            this.showAuthError(this.getAuthErrorMessage(error.code));
        }
    }

    async signInWithGoogle() {
        if (!this.isFirebaseEnabled) {
            this.showAuthError('Firebase is not configured. Please set up Firebase or use offline mode.');
            return;
        }
        
        try {
            const result = await signInWithPopup(auth, googleProvider);
            
            // Check if this is a new user
            const userDoc = await getDoc(doc(db, 'users', result.user.uid));
            if (!userDoc.exists()) {
                await this.initializeUserData(result.user);
            }
        } catch (error) {
            console.error('Google sign-in error:', error);
            if (error.code === 'auth/popup-closed-by-user') {
                this.showAuthError('Sign-in was cancelled.');
            } else if (error.code === 'auth/popup-blocked') {
                this.showAuthError('Pop-up was blocked by your browser. Please allow pop-ups and try again.');
            } else {
                this.showAuthError('Google sign-in failed. Please try again or use email/password.');
            }
        }
    }

    async sendPasswordReset(email) {
        if (!this.isFirebaseEnabled) {
            this.showAuthError('Firebase is not configured. Please set up Firebase.');
            return;
        }
        
        try {
            await sendPasswordResetEmail(auth, email);
            this.showAuthSuccess('Password reset email sent! Check your inbox.');
        } catch (error) {
            this.showAuthError(this.getAuthErrorMessage(error.code));
        }
    }

    async signOutUser() {
        try {
            if (this.unsubscribeUser) {
                this.unsubscribeUser();
            }
            
            if (this.isFirebaseEnabled && this.user) {
                await signOut(auth);
            }
            
            this.cleanup();
        } catch (error) {
            console.error('Sign out error:', error);
        }
    }

    getAuthErrorMessage(errorCode) {
        switch (errorCode) {
            case 'auth/user-not-found':
                return 'No account found with this email address.';
            case 'auth/wrong-password':
                return 'Incorrect password.';
            case 'auth/email-already-in-use':
                return 'An account with this email already exists.';
            case 'auth/weak-password':
                return 'Password should be at least 6 characters.';
            case 'auth/invalid-email':
                return 'Please enter a valid email address.';
            case 'auth/popup-closed-by-user':
                return 'Sign-in was cancelled.';
            case 'auth/network-request-failed':
                return 'Network error. Please check your connection.';
            default:
                return 'An error occurred. Please try again.';
        }
    }

    // Firestore Data Management
    async initializeUserData(user) {
        if (!this.isFirebaseEnabled) return;
        
        const userData = {
            profile: {
                displayName: user.displayName || 'User',
                email: user.email,
                photoURL: user.photoURL || null,
                createdAt: serverTimestamp(),
                lastActiveAt: serverTimestamp()
            },
            settings: this.state.settings,
            stats: this.stats,
            tasks: [],
            ideas: []
        };

        await setDoc(doc(db, 'users', user.uid), userData);
        
        // Migrate local data if exists
        await this.migrateLocalData();
    }

    async migrateLocalData() {
        if (!this.isFirebaseEnabled || !this.user) return;
        
        const localTasks = localStorage.getItem('studyflow-tasks');
        const localStats = localStorage.getItem('studyflow-stats');
        const localSettings = localStorage.getItem('studyflow-settings');
        
        if (localTasks || localStats || localSettings) {
            const updates = {};
            
            if (localTasks) {
                updates.tasks = JSON.parse(localTasks);
            }
            
            if (localStats) {
                updates.stats = { ...this.stats, ...JSON.parse(localStats) };
            }
            
            if (localSettings) {
                updates.settings = { ...this.state.settings, ...JSON.parse(localSettings) };
            }
            
            await updateDoc(doc(db, 'users', this.user.uid), updates);
            
            // Clear local storage after migration
            localStorage.removeItem('studyflow-tasks');
            localStorage.removeItem('studyflow-stats');
            localStorage.removeItem('studyflow-settings');
            localStorage.removeItem('studyflow-state');
        }
    }

    setupRealtimeSync() {
        if (!this.isFirebaseEnabled || !this.user) return;
        
        this.unsubscribeUser = onSnapshot(doc(db, 'users', this.user.uid), (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                this.handleRemoteDataUpdate(data);
            }
        });
    }

    handleRemoteDataUpdate(data) {
        if (data.settings) {
            this.state.settings = { ...this.state.settings, ...data.settings };
        }
        
        if (data.stats) {
            this.stats = { ...this.stats, ...data.stats };
        }
        
        if (data.tasks) {
            this.state.tasks = data.tasks;
            this.renderTasks();
            this.updateTaskStats();
        }
        
        this.updateStats();
        this.updateSyncStatus('synced');
    }

    async syncUserData() {
        if (!this.user || !this.state.settings.syncEnabled || !this.isOnline || !this.isFirebaseEnabled) {
            return;
        }
        
        try {
            this.updateSyncStatus('syncing');
            
            await updateDoc(doc(db, 'users', this.user.uid), {
                settings: this.state.settings,
                stats: this.stats,
                tasks: this.state.tasks,
                'profile.lastActiveAt': serverTimestamp()
            });
            
            this.updateSyncStatus('synced');
            this.pendingSync = false;
        } catch (error) {
            console.error('Sync error:', error);
            this.updateSyncStatus('error');
            this.pendingSync = true;
        }
    }

    updateSyncStatus(status) {
        const syncDot = document.getElementById('syncStatus');
        const syncText = document.getElementById('syncStatusText');
        
        if (!syncDot || !syncText) return;
        
        syncDot.className = 'sync-dot';
        
        switch (status) {
            case 'synced':
                syncText.textContent = this.isFirebaseEnabled ? 'Synced' : 'Offline Mode';
                break;
            case 'syncing':
                syncDot.classList.add('syncing');
                syncText.textContent = 'Syncing...';
                break;
            case 'error':
                syncDot.classList.add('error');
                syncText.textContent = 'Sync failed';
                break;
        }
    }

    setupOnlineStatus() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            if (this.pendingSync && this.user && this.isFirebaseEnabled) {
                this.syncUserData();
            }
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.updateSyncStatus('error');
        });
    }

    // Event Listeners
    setupEventListeners() {
        // Authentication form handlers
        const signInForm = document.getElementById('signInFormElement');
        const signUpForm = document.getElementById('signUpFormElement');
        const forgotForm = document.getElementById('forgotPasswordFormElement');
        
        if (signInForm) {
            signInForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('signInEmail').value;
                const password = document.getElementById('signInPassword').value;
                this.signInWithEmail(email, password);
            });
        }

        if (signUpForm) {
            signUpForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('signUpEmail').value;
                const password = document.getElementById('signUpPassword').value;
                const displayName = document.getElementById('signUpName').value;
                this.signUpWithEmail(email, password, displayName);
            });
        }

        if (forgotForm) {
            forgotForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('forgotPasswordEmail').value;
                this.sendPasswordReset(email);
            });
        }

        // Safe event listener attachment with null checks
        const attachListener = (id, event, handler) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener(event, handler);
            }
        };

        attachListener('googleSignInBtn', 'click', () => this.signInWithGoogle());
        attachListener('googleSignUpBtn', 'click', () => this.signInWithGoogle());

        // Auth form navigation
        attachListener('showSignUpBtn', 'click', () => this.showSignUpForm());
        attachListener('showSignInBtn', 'click', () => this.showSignInForm());
        attachListener('showForgotPasswordBtn', 'click', () => this.showForgotPasswordForm());
        attachListener('backToSignInBtn', 'click', () => this.showSignInForm());

        // User menu
        attachListener('userMenuBtn', 'click', () => this.toggleUserMenu());
        attachListener('profileBtn', 'click', () => this.openProfile());
        attachListener('exportDataBtn', 'click', () => this.exportAllData());
        attachListener('signOutBtn', 'click', () => this.signOutUser());

        // Timer controls
        attachListener('startBtn', 'click', () => this.startTimer());
        attachListener('pauseBtn', 'click', () => this.pauseTimer());
        attachListener('stopBtn', 'click', () => this.stopTimer());

        // Mode selection
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchMode(e.target.dataset.mode));
        });

        // Task management
        attachListener('addTaskBtn', 'click', () => this.addTask());
        const taskInput = document.getElementById('taskInput');
        if (taskInput) {
            taskInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.addTask();
            });
        }

        // Modals
        attachListener('statsBtn', 'click', () => this.openModal('statsModal'));
        attachListener('settingsBtn', 'click', () => this.openModal('settingsModal'));
        attachListener('closeStatsModal', 'click', () => this.closeModal('statsModal'));
        attachListener('closeSettingsModal', 'click', () => this.closeModal('settingsModal'));
        attachListener('closeProfileModal', 'click', () => this.closeModal('profileModal'));

        // Settings
        attachListener('customStudyTime', 'change', (e) => {
            this.state.settings.customStudyTime = parseInt(e.target.value);
            this.updateTimerMode();
            this.saveData();
        });
        attachListener('customBreakTime', 'change', (e) => {
            this.state.settings.customBreakTime = parseInt(e.target.value);
            this.saveData();
        });
        attachListener('soundEnabled', 'change', (e) => {
            this.state.settings.soundEnabled = e.target.checked;
            this.saveData();
        });
        attachListener('autoStartBreaks', 'change', (e) => {
            this.state.settings.autoStartBreaks = e.target.checked;
            this.saveData();
        });
        attachListener('syncEnabled', 'change', (e) => {
            this.state.settings.syncEnabled = e.target.checked;
            if (e.target.checked && this.user && this.isFirebaseEnabled) {
                this.setupRealtimeSync();
            } else if (this.unsubscribeUser) {
                this.unsubscribeUser();
            }
            this.saveData();
        });

        // Break modal
        attachListener('skipBreakBtn', 'click', () => this.skipBreak());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Close modals and dropdowns on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
            if (!e.target.closest('.user-menu')) {
                const dropdown = document.getElementById('userDropdown');
                if (dropdown) dropdown.classList.add('hidden');
            }
        });

        // Drag and drop for tasks
        this.setupDragAndDrop();
    }

    // User Interface Methods
    toggleUserMenu() {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.classList.toggle('hidden');
        }
    }

    openProfile() {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) dropdown.classList.add('hidden');
        
        if (this.user) {
            // Update profile info
            const profileName = document.getElementById('profileDisplayName');
            const profileEmail = document.getElementById('profileEmail');
            const userInitials = document.getElementById('userInitials');
            const joinDate = document.getElementById('profileJoinDate');
            
            if (profileName) profileName.textContent = this.user.displayName || 'User';
            if (profileEmail) profileEmail.textContent = this.user.email;
            if (userInitials) userInitials.textContent = (this.user.displayName || this.user.email).charAt(0).toUpperCase();
            
            // Format join date
            if (this.user.metadata && this.user.metadata.creationTime && joinDate) {
                const date = new Date(this.user.metadata.creationTime).toLocaleDateString();
                joinDate.textContent = date;
            }
        }
        
        this.openModal('profileModal');
    }

    async exportAllData() {
        const userData = {
            profile: this.user ? {
                displayName: this.user.displayName,
                email: this.user.email,
                joinDate: this.user.metadata?.creationTime
            } : { offline: true },
            settings: this.state.settings,
            stats: this.stats,
            tasks: this.state.tasks,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `studyflow-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    // Timer Methods (keeping all original functionality)
    startTimer() {
        if (this.state.isPaused) {
            this.state.isPaused = false;
        } else {
            this.state.timeLeft = this.state.totalTime;
        }
        
        this.state.isRunning = true;
        const timerLabel = document.getElementById('timerLabel');
        if (timerLabel) timerLabel.textContent = this.state.isBreak ? 'Break time' : 'Focus time';
        
        const progress = document.querySelector('.timer-progress');
        if (progress) progress.classList.add('running');
        
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
        
        const timerLabel = document.getElementById('timerLabel');
        if (timerLabel) timerLabel.textContent = 'Paused';
        
        const progress = document.querySelector('.timer-progress');
        if (progress) progress.classList.remove('running');
        
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
        
        const timerLabel = document.getElementById('timerLabel');
        if (timerLabel) timerLabel.textContent = 'Ready to start';
        
        const progress = document.querySelector('.timer-progress');
        if (progress) progress.classList.remove('running');
    }

    timerComplete() {
        clearInterval(this.timerInterval);
        this.state.isRunning = false;
        
        const progress = document.querySelector('.timer-progress');
        if (progress) progress.classList.remove('running');
        
        if (this.state.settings.soundEnabled) {
            this.playNotificationSound();
        }
        
        if (this.state.isBreak) {
            this.state.isBreak = false;
            this.state.sessionCount++;
            this.updateTimerMode();
            const timerLabel = document.getElementById('timerLabel');
            if (timerLabel) timerLabel.textContent = 'Break complete! Ready for next session';
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
        const breakMessage = document.getElementById('breakMessage');
        if (breakMessage) breakMessage.textContent = message;
        
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
        const timerLabel = document.getElementById('timerLabel');
        if (timerLabel) timerLabel.textContent = 'Break skipped! Ready for next session';
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

    updateDisplay() {
        const minutes = Math.floor(this.state.timeLeft / 60);
        const seconds = this.state.timeLeft % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        const timerDisplay = document.getElementById('timerDisplay');
        const sessionType = document.getElementById('sessionType');
        const sessionCount = document.getElementById('sessionCount');
        const timerProgress = document.getElementById('timerProgress');
        
        if (timerDisplay) timerDisplay.textContent = timeString;
        if (sessionType) sessionType.textContent = this.state.isBreak ? 'Break Session' : 'Study Session';
        if (sessionCount) sessionCount.textContent = `Session ${this.state.sessionCount}`;
        
        // Update progress circle
        if (timerProgress) {
            const progress = ((this.state.totalTime - this.state.timeLeft) / this.state.totalTime) * 754;
            timerProgress.style.strokeDashoffset = 754 - progress;
        }
        
        document.title = `${timeString} - StudyFlow`;
    }

    updateBreakDisplay() {
        const minutes = Math.floor(this.state.timeLeft / 60);
        const seconds = this.state.timeLeft % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        const breakTimeDisplay = document.getElementById('breakTimeDisplay');
        if (breakTimeDisplay) breakTimeDisplay.textContent = timeString;
    }

    updateTimerButtons() {
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const stopBtn = document.getElementById('stopBtn');
        
        if (!startBtn || !pauseBtn || !stopBtn) return;
        
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

    // Task Management
    addTask() {
        const input = document.getElementById('taskInput');
        if (!input) return;
        
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
        if (!tasksList) return;
        
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
        
        const completedEl = document.getElementById('completedTasks');
        const totalEl = document.getElementById('totalTasks');
        
        if (completedEl) completedEl.textContent = completed;
        if (totalEl) totalEl.textContent = total;
    }

    // Drag and Drop (keeping original implementation)
    setupDragAndDrop() {
        const tasksList = document.getElementById('tasksList');
        if (!tasksList) return;
        
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
            if (!this.draggedTask) return;
            
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

    // Statistics and Data Management
    updateStats() {
        const studyHours = Math.floor(this.stats.todayStudyTime / 60);
        const studyMinutes = Math.floor(this.stats.todayStudyTime % 60);
        
        const elements = {
            todayStudyTime: `${studyHours}h ${studyMinutes}m`,
            currentStreak: `${this.stats.currentStreak} days`,
            todayTasks: this.stats.todayTasks,
            totalStudyTime: `${Math.floor(this.stats.totalStudyTime / 60)}h ${Math.floor(this.stats.totalStudyTime % 60)}m`,
            totalSessions: this.stats.totalSessions,
            totalTasksCompleted: this.stats.totalTasksCompleted,
            bestStreak: `${this.stats.bestStreak} days`,
            customStudyTime: this.state.settings.customStudyTime,
            customBreakTime: this.state.settings.customBreakTime,
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                if (typeof value === 'boolean') {
                    element.checked = value;
                } else {
                    element.textContent = value;
                    if (element.type === 'number') {
                        element.value = value;
                    }
                }
            }
        });
        
        // Handle checkboxes separately
        const checkboxes = {
            soundEnabled: this.state.settings.soundEnabled,
            autoStartBreaks: this.state.settings.autoStartBreaks,
            syncEnabled: this.state.settings.syncEnabled
        };
        
        Object.entries(checkboxes).forEach(([id, checked]) => {
            const element = document.getElementById(id);
            if (element) element.checked = checked;
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
            
            this.stats.todayStudyTime = 0;
            this.stats.todayTasks = 0;
            this.stats.lastActiveDate = today;
            this.saveData();
        }
    }

    // Data persistence methods
    loadLocalData() {
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
        // Save locally as backup
        localStorage.setItem('studyflow-state', JSON.stringify({
            currentMode: this.state.currentMode,
            sessionCount: this.state.sessionCount,
            completedSessions: this.state.completedSessions
        }));
        localStorage.setItem('studyflow-stats', JSON.stringify(this.stats));
        localStorage.setItem('studyflow-tasks', JSON.stringify(this.state.tasks));
        localStorage.setItem('studyflow-settings', JSON.stringify(this.state.settings));
        
        // Sync to Firebase if user is logged in and Firebase is enabled
        if (this.user && this.state.settings.syncEnabled && this.isFirebaseEnabled) {
            this.syncUserData();
        }
    }

    // Modal and UI helpers
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            if (modalId === 'statsModal') {
                this.updateStats();
            }
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
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
            case 'KeyR':
                if (e.ctrlKey || e.metaKey) return;
                e.preventDefault();
                this.stopTimer();
                break;
            case 'KeyT':
                e.preventDefault();
                const taskInput = document.getElementById('taskInput');
                if (taskInput) taskInput.focus();
                break;
        }
    }

    playNotificationSound() {
        const audio = document.getElementById('notificationSound');
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log('Audio play failed:', e));
        }
    }

    cleanup() {
        clearInterval(this.timerInterval);
        clearInterval(this.breakInterval);
        if (this.unsubscribeUser) {
            this.unsubscribeUser();
        }
        this.state.isRunning = false;
        this.state.isPaused = false;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.studyFlowApp = new StudyFlowApp();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && window.studyFlowApp && window.studyFlowApp.user) {
        window.studyFlowApp.saveData();
    }
});

// Save data before page unload
window.addEventListener('beforeunload', () => {
    if (window.studyFlowApp && window.studyFlowApp.user) {
        window.studyFlowApp.saveData();
    }
});