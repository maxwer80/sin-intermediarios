/**
 * SIN INTERMEDIARIOS - Main Application
 * Noticias Caracol - Gamified Question System
 */

// Supabase Configuration - Self-hosted VPS
// Supabase Configuration - Proxy Inverso
const SUPABASE_URL = ''; // Se usa ruta relativa /rest/v1
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjkwMDkxMjEsImV4cCI6MTg5MzQ1NjAwMCwicm9sZSI6ImFub24iLCJpc3MiOiJzdXBhYmFzZSJ9.QLLj2oEnrtyJHT7mnwP3TZtvkhnEqspaz5VMQDhA1aE';

// Supabase Client (using REST API directly for simplicity)
const supabase = {
    async fetchQuestions() {
        try {
            // Usar ruta relativa para que Nginx la procese
            const response = await fetch(`${SUPABASE_URL}/rest/v1/preguntas?select=*&estado=eq.aprobada`, {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                }
            });
            if (!response.ok) throw new Error('Error fetching questions');
            return await response.json();
        } catch (error) {
            console.error('Supabase fetch error:', error);
            return null;
        }
    },

    async logAuditoria(accion, detalle) {
        try {
            await fetch(`${SUPABASE_URL}/rest/v1/auditoria`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({ accion, detalle })
            });
        } catch (error) {
            console.error('Error logging auditoria:', error);
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
            obligatoryQuestions: [], // Preguntas marcadas como obligatorias
            selectedQuestions: [], // Las 10 preguntas para esta ronda
            usedQuestionIds: [],
            currentQuestion: null,
            currentQuestionNumber: 0,
            timerInterval: null,
            timeRemaining: this.config.timerDuration,
            useSupabase: false
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

            // Separar las preguntas obligatorias
            this.state.obligatoryQuestions = supabaseQuestions.filter(q => q.obligatoria === true);
            console.log('🔒 Preguntas obligatorias:', this.state.obligatoryQuestions.length);
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

        // Pre-seleccionar las 10 preguntas (obligatorias + aleatorias)
        this.preselectQuestionsWithObligatory();

        // Iniciar inmediatamente con la primera pregunta
        this.selectNextPreselectedQuestion();
    }

    preselectQuestionsWithObligatory() {
        // 1. Obtener todas las preguntas obligatorias primero
        const obligatory = this.state.obligatoryQuestions.filter(q => q.estado === 'aprobada');

        // 2. Obtener preguntas NO obligatorias
        const nonObligatory = this.state.questions.filter(
            q => !q.obligatoria && q.estado === 'aprobada'
        );

        // 3. Mezclar las no obligatorias
        const shuffledNonObligatory = this.shuffleArray([...nonObligatory]);

        // 4. Calcular cuántas aleatorias necesitamos
        const neededRandom = this.config.questionsPerSession - obligatory.length;

        // 5. Tomar las aleatorias necesarias
        const randomQuestions = shuffledNonObligatory.slice(0, Math.max(0, neededRandom));

        // 6. Combinar: obligatorias + aleatorias, luego mezclar para que no sea obvio
        const allSelected = [...obligatory, ...randomQuestions];
        this.state.selectedQuestions = this.shuffleArray(allSelected).slice(0, this.config.questionsPerSession);

        console.log('📋 Ronda preparada:');
        console.log('   - Obligatorias incluidas:', obligatory.length);
        console.log('   - Aleatorias añadidas:', randomQuestions.length);
        console.log('   - Total seleccionadas:', this.state.selectedQuestions.length);
    }

    selectNextPreselectedQuestion() {
        // Check if session is complete
        if (this.state.currentQuestionNumber >= this.state.selectedQuestions.length) {
            this.showScreen('complete');
            return;
        }

        // Get the next pre-selected question
        const question = this.state.selectedQuestions[this.state.currentQuestionNumber];

        // Show animation screen
        this.showScreen('animation');
        this.runSlotMachineAnimation(question);
    }

    runSlotMachineAnimation(winningQuestion) {
        const reel = this.elements.slotReel;
        reel.innerHTML = '';

        // Create slot items with all questions (repeated for scroll effect)
        const allItems = [];

        // Add questions multiple times for scroll effect
        for (let i = 0; i < 5; i++) {
            this.state.selectedQuestions.forEach(q => {
                allItems.push(q);
            });
        }

        // Shuffle for randomness appearance
        const shuffled = this.shuffleArray([...allItems]);

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

        // Reset bar immediately without animation
        this.elements.timerBar.style.transition = 'none';
        this.updateTimerDisplay();

        // Force reflow
        this.elements.timerBar.offsetHeight;

        // Restore transition
        this.elements.timerBar.style.transition = 'width 1s linear, background-color 0.3s ease';

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
        const { timerDuration } = this.config;

        // Update value
        this.elements.timerValue.textContent = timeRemaining;

        // Update bar width
        const percentage = (timeRemaining / timerDuration) * 100;
        this.elements.timerBar.style.width = `${percentage}%`;

        // Update color
        if (percentage > 50) {
            this.elements.timerBar.style.backgroundColor = 'var(--color-success)';
            this.elements.timerValue.classList.remove('warning');
        } else if (percentage > 20) {
            this.elements.timerBar.style.backgroundColor = 'var(--topic-economia)'; // Using yellow/orange color
            this.elements.timerValue.classList.remove('warning');
        } else {
            this.elements.timerBar.style.backgroundColor = 'var(--color-danger)';
            this.elements.timerValue.classList.add('warning');
        }
    }

    async nextQuestion() {
        this.stopTimer();

        // Mark current question as used in Supabase
        if (this.state.useSupabase && this.state.currentQuestion) {
            await supabase.markAsUsed(this.state.currentQuestion.id);
        }

        this.updateQuestionsCount();
        this.selectNextPreselectedQuestion();
    }

    resetSession() {
        this.stopTimer();
        this.state.usedQuestionIds = [];
        this.state.currentQuestionNumber = 0;
        this.state.currentQuestion = null;
        this.state.selectedQuestions = [];
        this.updateQuestionsCount();
        this.showScreen('start');
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SinIntermediariosApp();
});
