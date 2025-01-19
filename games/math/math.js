class MathGame {
    constructor() {
        this.score = 0;
        this.correctAnswers = 0;
        this.currentQuestion = 0;
        this.totalQuestions = 10;
        this.operations = ['+', '-', '*'];
        
        // DOM Elements
        this.screens = {
            welcome: document.getElementById('welcome-screen'),
            game: document.getElementById('game-screen'),
            result: document.getElementById('result-screen')
        };
        
        this.elements = {
            startBtn: document.getElementById('start-btn'),
            playAgainBtn: document.getElementById('play-again-btn'),
            question: document.getElementById('question'),
            options: document.getElementById('options'),
            score: document.getElementById('score'),
            finalScore: document.getElementById('final-score'),
            correctAnswers: document.getElementById('correct-answers'),
            progress: document.getElementById('progress')
        };
        
        // Event Listeners
        this.elements.startBtn.addEventListener('click', () => this.startGame());
        this.elements.playAgainBtn.addEventListener('click', () => this.startGame());
    }

    showScreen(screenId) {
        Object.values(this.screens).forEach(screen => screen.classList.remove('active'));
        this.screens[screenId].classList.add('active');
    }

    generateQuestion() {
        const operation = this.operations[Math.floor(Math.random() * this.operations.length)];
        let num1, num2;

        switch(operation) {
            case '+':
                num1 = Math.floor(Math.random() * 50) + 1;
                num2 = Math.floor(Math.random() * 50) + 1;
                break;
            case '-':
                num1 = Math.floor(Math.random() * 50) + 25;
                num2 = Math.floor(Math.random() * num1);
                break;
            case '*':
                num1 = Math.floor(Math.random() * 12) + 1;
                num2 = Math.floor(Math.random() * 12) + 1;
                break;
        }

        const question = `${num1} ${operation} ${num2}`;
        const correctAnswer = eval(question);

        return {
            question,
            correctAnswer,
            options: this.generateOptions(correctAnswer)
        };
    }

    generateOptions(correctAnswer) {
        const options = [correctAnswer];
        while (options.length < 4) {
            const offset = Math.floor(Math.random() * 10) - 5;
            const option = correctAnswer + offset;
            if (!options.includes(option) && option >= 0) {
                options.push(option);
            }
        }
        return this.shuffleArray(options);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    updateProgress() {
        const progress = (this.currentQuestion / this.totalQuestions) * 100;
        this.elements.progress.style.width = `${progress}%`;
    }

    checkAnswer(selectedAnswer, correctAnswer) {
        if (selectedAnswer === correctAnswer) {
            this.score += 10;
            this.correctAnswers++;
            this.elements.score.textContent = this.score;
            return true;
        }
        return false;
    }

    createOptionElement(option, correctAnswer) {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.textContent = option;
        
        optionDiv.addEventListener('click', () => {
            const isCorrect = this.checkAnswer(option, correctAnswer);
            
            // Visual feedback
            optionDiv.classList.add(isCorrect ? 'correct' : 'wrong');
            
            // Disable all options after selection
            const options = this.elements.options.children;
            Array.from(options).forEach(opt => opt.style.pointerEvents = 'none');
            
            // Show correct answer if wrong
            if (!isCorrect) {
                Array.from(options).forEach(opt => {
                    if (parseInt(opt.textContent) === correctAnswer) {
                        opt.classList.add('correct');
                    }
                });
            }
            
            // Next question after delay
            setTimeout(() => {
                this.currentQuestion++;
                if (this.currentQuestion < this.totalQuestions) {
                    this.displayQuestion();
                } else {
                    this.endGame();
                }
            }, 1000);
        });
        
        return optionDiv;
    }

    displayQuestion() {
        const { question, correctAnswer, options } = this.generateQuestion();
        this.elements.question.textContent = `Vad är ${question}?`;
        this.elements.options.innerHTML = '';
        
        options.forEach(option => {
            const optionElement = this.createOptionElement(option, correctAnswer);
            this.elements.options.appendChild(optionElement);
        });
        
        this.updateProgress();
    }

    startGame() {
        this.score = 0;
        this.correctAnswers = 0;
        this.currentQuestion = 0;
        this.elements.score.textContent = '0';
        this.showScreen('game');
        this.displayQuestion();
    }

    endGame() {
        this.elements.finalScore.textContent = this.score;
        this.elements.correctAnswers.textContent = this.correctAnswers;
        this.showScreen('result');
    }
}

// Initialize the game
const game = new MathGame();
