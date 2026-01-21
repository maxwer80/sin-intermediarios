/**
 * SIN INTERMEDIARIOS - Main Application
 * Noticias Caracol - Gamified Question System
 */

// Supabase Configuration - Self-hosted VPS
const SUPABASE_URL = 'http://antigravity-supabase-7b4026-72-60-173-156.traefik.me';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjkwMDkxMjEsImV4cCI6MTg5MzQ1NjAwMCwicm9sZSI6ImFub24iLCJpc3MiOiJzdXBhYmFzZSJ9.QLLj2oEnrtyJHT7mnwP3TZtvkhnEqspaz5VMQDhA1aE';

// Supabase Client (using REST API directly for simplicity)
const supabase = {
    async fetchQuestions() {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/preguntas?estado=eq.aprobada&select=*`, {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Error fetching questions');
            return await response.json();
        } catch (error) {
            console.error('Supabase fetch error:', error);
            return null;
        }
    },

    async markAsUsed(questionId) {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/preguntas?id=eq.${questionId}`, {
                method: 'PATCH',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    estado: 'usada',
                    fecha_respuesta: new Date().toISOString()
                })
            });
            return response.ok;
        } catch (error) {
            console.error('Supabase update error:', error);
            return false;
        }
    }
};


class SinIntermediariosApp {
    constructor() {
        // Configuration
        this.config = {
            timerDuration: 60, // seconds
            questionsPerSession: 10,
            animationDuration: 3500, // milliseconds
            warningThreshold: 10 // seconds
        };

        // State
        this.state = {
            currentScreen: 'start',
            questions: [],
            usedQuestionIds: [],
            currentQuestion: null,
            currentQuestionNumber: 0,
            timerInterval: null,
            timeRemaining: this.config.timerDuration
        };

        // DOM Elements
        this.screens = {
            start: document.getElementById('start-screen'),
            animation: document.getElementById('animation-screen'),
            question: document.getElementById('question-screen'),
            complete: document.getElementById('complete-screen')
        };

        this.elements = {
            questionsCount: document.getElementById('questions-count'),
            btnComenzar: document.getElementById('btn-comenzar'),
            slotReel: document.getElementById('slot-reel'),
            socialIcon: document.getElementById('social-icon'),
            username: document.getElementById('username'),
            topicBadge: document.getElementById('topic-badge'),
            questionText: document.getElementById('question-text'),
            timerBar: document.getElementById('timer-bar'),
            timerValue: document.getElementById('timer-value'),
            currentQuestionNum: document.getElementById('current-question'),
            totalQuestions: document.getElementById('total-questions'),
            btnSiguiente: document.getElementById('btn-siguiente'),
            btnReiniciar: document.getElementById('btn-reiniciar')
        };

        this.init();
    }

    async init() {
        this.bindEvents();
        this.elements.totalQuestions.textContent = this.config.questionsPerSession;
        this.elements.questionsCount.textContent = 'Cargando...';

        // Load questions from Supabase (with fallback to mock data)
        await this.loadQuestions();
        this.updateQuestionsCount();
    }

    async loadQuestions() {
        // Try to fetch from Supabase first
        const supabaseQuestions = await supabase.fetchQuestions();

        if (supabaseQuestions && supabaseQuestions.length > 0) {
            console.log('✅ Loaded', supabaseQuestions.length, 'questions from Supabase');
            this.state.questions = supabaseQuestions;
            this.state.useSupabase = true;
        } else {
            // Fallback to mock data
            console.log('⚠️ Using mock data (Supabase unavailable)');
            this.state.questions = mockQuestions.filter(q => q.estado === 'aprobada');
            this.state.useSupabase = false;
        }
    }

    bindEvents() {
        this.elements.btnComenzar.addEventListener('click', () => this.startSession());
        this.elements.btnSiguiente.addEventListener('click', () => this.nextQuestion());
        this.elements.btnReiniciar.addEventListener('click', () => this.resetSession());
    }

    updateQuestionsCount() {
        const available = this.state.questions.length - this.state.usedQuestionIds.length;
        this.elements.questionsCount.textContent = available;
    }

    showScreen(screenName) {
        Object.keys(this.screens).forEach(key => {
            this.screens[key].classList.remove('active');
        });
        this.screens[screenName].classList.add('active');
        this.state.currentScreen = screenName;
    }

    startSession() {
        this.state.currentQuestionNumber = 0;
        this.state.usedQuestionIds = [];
        this.selectRandomQuestion();
    }

    selectRandomQuestion() {
        // Check if session is complete
        if (this.state.currentQuestionNumber >= this.config.questionsPerSession) {
            this.showScreen('complete');
            return;
        }

        // Get available questions
        const available = this.state.questions.filter(
            q => !this.state.usedQuestionIds.includes(q.id)
        );

        if (available.length === 0) {
            this.showScreen('complete');
            return;
        }

        // Show animation screen
        this.showScreen('animation');
        this.runSlotMachineAnimation(available);
    }

    runSlotMachineAnimation(availableQuestions) {
        const reel = this.elements.slotReel;
        reel.innerHTML = '';

        // Create slot items with all questions (repeated for scroll effect)
        const allItems = [];

        // Add questions multiple times for scroll effect
        for (let i = 0; i < 5; i++) {
            availableQuestions.forEach(q => {
                allItems.push(q);
            });
        }

        // Shuffle for randomness appearance
        const shuffled = this.shuffleArray([...allItems]);

        // Select the winning question
        const winningQuestion = availableQuestions[
            Math.floor(Math.random() * availableQuestions.length)
        ];

        // Add shuffled items to reel
        shuffled.forEach((q, index) => {
            const item = document.createElement('div');
            item.className = 'slot-item';
            item.textContent = q.pregunta.substring(0, 80) + (q.pregunta.length > 80 ? '...' : '');
            reel.appendChild(item);
        });

        // Add the winning question at the end
        const winningItem = document.createElement('div');
        winningItem.className = 'slot-item selected';
        winningItem.textContent = winningQuestion.pregunta.substring(0, 80) +
            (winningQuestion.pregunta.length > 80 ? '...' : '');
        reel.appendChild(winningItem);

        // Reset animation
        reel.style.animation = 'none';
        reel.offsetHeight; // Trigger reflow
        reel.style.animation = `spin ${this.config.animationDuration}ms ease-out forwards`;

        // After animation completes, show question
        setTimeout(() => {
            this.state.currentQuestion = winningQuestion;
            this.state.usedQuestionIds.push(winningQuestion.id);
            this.state.currentQuestionNumber++;
            this.displayQuestion(winningQuestion);
        }, this.config.animationDuration);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    displayQuestion(question) {
        // Update UI elements
        this.elements.socialIcon.textContent = socialIcons[question.red_social] || '🌐';
        this.elements.username.textContent = question.usuario_red_social;
        this.elements.topicBadge.textContent = question.tema;
        this.elements.topicBadge.setAttribute('data-topic', topicMapping[question.tema] || 'otros');
        this.elements.questionText.textContent = question.pregunta;
        this.elements.currentQuestionNum.textContent = this.state.currentQuestionNumber;

        // Show question screen
        this.showScreen('question');

        // Start timer
        this.startTimer();
    }

    startTimer() {
        this.stopTimer();
        this.state.timeRemaining = this.config.timerDuration;
        this.updateTimerDisplay();

        this.state.timerInterval = setInterval(() => {
            this.state.timeRemaining--;
            this.updateTimerDisplay();

            if (this.state.timeRemaining <= 0) {
                this.stopTimer();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.state.timerInterval) {
            clearInterval(this.state.timerInterval);
            this.state.timerInterval = null;
        }
    }

    updateTimerDisplay() {
        const { timeRemaining } = this.state;
        const { timerDuration, warningThreshold } = this.config;

        // Update value
        this.elements.timerValue.textContent = timeRemaining;

        // Update bar
        const percentage = (timeRemaining / timerDuration) * 100;
        this.elements.timerBar.style.width = `${percentage}%`;

        // Warning state
        if (timeRemaining <= warningThreshold) {
            this.elements.timerValue.classList.add('warning');
            this.elements.timerBar.classList.add('warning');
        } else {
            this.elements.timerValue.classList.remove('warning');
            this.elements.timerBar.classList.remove('warning');
        }
    }

    async nextQuestion() {
        this.stopTimer();

        // Mark current question as used in Supabase
        if (this.state.useSupabase && this.state.currentQuestion) {
            await supabase.markAsUsed(this.state.currentQuestion.id);
        }

        this.updateQuestionsCount();
        this.selectRandomQuestion();
    }

    resetSession() {
        this.stopTimer();
        this.state.usedQuestionIds = [];
        this.state.currentQuestionNumber = 0;
        this.state.currentQuestion = null;
        this.updateQuestionsCount();
        this.showScreen('start');
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SinIntermediariosApp();
});
