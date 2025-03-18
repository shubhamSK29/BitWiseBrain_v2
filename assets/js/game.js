// Quiz questions generation
function generateQuestionsByLanguage(language, count, difficulty) {
    const questions = [];
    
    // JavaScript Questions
    const jsQuestions = [
        {
            question: "What is JavaScript?",
            options: [
                "A programming language for the web",
                "A markup language",
                "A database system",
                "An operating system"
            ],
            answer: "A programming language for the web"
        },
        {
            question: "Which keyword is used to declare variables in JavaScript?",
            options: ["var", "let", "const", "All of the above"],
            answer: "All of the above"
        },
        {
            question: "What is the correct way to write a JavaScript array?",
            options: [
                "var colors = ['red', 'green', 'blue']",
                "var colors = 'red', 'green', 'blue'",
                "var colors = (red, green, blue)",
                "var colors = 1 = red, 2 = green, 3 = blue"
            ],
            answer: "var colors = ['red', 'green', 'blue']"
        },
        {
            question: "What is the purpose of 'typeof' operator in JavaScript?",
            options: [
                "Returns the type of a variable",
                "Returns the value of a variable",
                "Creates a new variable",
                "Deletes a variable"
            ],
            answer: "Returns the type of a variable"
        },
        {
            question: "Which method is used to add elements to the end of an array?",
            options: ["push()", "pop()", "shift()", "unshift()"],
            answer: "push()"
        }
    ];

    // Python Questions
    const pythonQuestions = [
        {
            question: "What is Python?",
            options: [
                "A high-level programming language",
                "A snake species",
                "A database system",
                "A web browser"
            ],
            answer: "A high-level programming language"
        },
        {
            question: "How do you create a variable in Python?",
            options: [
                "Just write the variable name and value",
                "Use 'var' keyword",
                "Use 'let' keyword",
                "Use 'variable' keyword"
            ],
            answer: "Just write the variable name and value"
        },
        {
            question: "What is the correct way to create a list in Python?",
            options: [
                "my_list = [1, 2, 3]",
                "my_list = (1, 2, 3)",
                "my_list = {1, 2, 3}",
                "my_list = '1, 2, 3'"
            ],
            answer: "my_list = [1, 2, 3]"
        },
        {
            question: "Which of these is NOT a Python data type?",
            options: ["Integer", "Float", "Character", "String"],
            answer: "Character"
        },
        {
            question: "What is the purpose of 'pip' in Python?",
            options: [
                "Package installer for Python",
                "Python code editor",
                "Python debugger",
                "Python compiler"
            ],
            answer: "Package installer for Python"
        }
    ];

    // Java Questions
    const javaQuestions = [
        {
            question: "What is Java?",
            options: [
                "A platform-independent programming language",
                "A coffee brand",
                "An operating system",
                "A web browser"
            ],
            answer: "A platform-independent programming language"
        },
        {
            question: "Which keyword is used to declare a class in Java?",
            options: ["class", "struct", "object", "type"],
            answer: "class"
        },
        {
            question: "What is the entry point of a Java program?",
            options: [
                "public static void main(String[] args)",
                "start()",
                "run()",
                "main()"
            ],
            answer: "public static void main(String[] args)"
        },
        {
            question: "What is the purpose of JVM?",
            options: [
                "Runs Java bytecode",
                "Compiles Java code",
                "Creates Java files",
                "Formats Java code"
            ],
            answer: "Runs Java bytecode"
        },
        {
            question: "Which is NOT a valid Java access modifier?",
            options: ["friendly", "public", "private", "protected"],
            answer: "friendly"
        }
    ];

    let selectedQuestions = [];
    switch (language.toLowerCase()) {
        case 'javascript':
            selectedQuestions = jsQuestions;
            break;
        case 'python':
            selectedQuestions = pythonQuestions;
            break;
        case 'java':
            selectedQuestions = javaQuestions;
            break;
        default:
            selectedQuestions = jsQuestions;
    }

    // Shuffle and select questions based on count
    const shuffled = selectedQuestions.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

document.addEventListener('DOMContentLoaded', function() {
    // Check if quiz settings exist
    const quizSettings = JSON.parse(localStorage.getItem('quizSettings'));
    if (!quizSettings) {
        window.location.href = 'quiz-setup.html';
        return;
    }

    const questionsContainer = document.getElementById('questions-container');
    const scoreElement = document.getElementById('score');
    const questionTemplate = document.getElementById('question-template');
    const questionsAnsweredElement = document.getElementById('questions-answered');
    const accuracyElement = document.getElementById('accuracy');
    const endQuizBtn = document.getElementById('end-quiz');
    const popup = document.getElementById('end-quiz-popup');
    const tryAgainBtn = document.getElementById('try-again');
    const finalQuestions = document.getElementById('final-questions');
    const finalAccuracy = document.getElementById('final-accuracy');
    const finalScore = document.getElementById('final-score');

    let score = 0;
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let questionsAnswered = 0;
    let currentQuestionIndex = 0;
    let questions = [];
    let isLoading = false;

    // Initialize the quiz
    async function startQuiz() {
        try {
            // Show loading state
            questionsContainer.innerHTML = `
                <div class="question-slide">
                    <div id="boxed">
                        <h2 class="question-text">Loading questions...</h2>
                    </div>
                </div>
            `;

            // Load questions based on quiz settings
            await loadQuestions(quizSettings);
            
            // Set up keyboard navigation
            setupKeyboardNavigation();
            
            // Set up scroll behavior
            setupScrollBehavior();
            
        } catch (error) {
            console.error('Error starting quiz:', error);
            showError();
        }
    }

    // Load questions from your question bank
    async function loadQuestions({ language, difficulty, questionCount }) {
        // Generate questions based on settings
        questions = generateQuestionsByLanguage(language, questionCount, difficulty);
        displayQuestions();
    }

    // Display questions
    function displayQuestions() {
        questionsContainer.innerHTML = '';
        
        questions.forEach((q, index) => {
            const slide = questionTemplate.content.cloneNode(true);
            
            // Set question text
            slide.querySelector('.question-text').textContent = q.question;
            
            // Set metadata
            slide.querySelector('.category').textContent = 'Programming';
            const difficultyElement = slide.querySelector('.difficulty');
            difficultyElement.textContent = 'easy';
            difficultyElement.classList.add('easy');
            
            // Add choices
            const choicesContainer = slide.querySelector('.choices-container');
            q.options.forEach((option, choiceIndex) => {
                const choiceElement = document.createElement('div');
                choiceElement.className = 'choice-container';
                choiceElement.tabIndex = 0;
                choiceElement.innerHTML = `
                    <span class="choice-prefix">${String.fromCharCode(65 + choiceIndex)}</span>
                    <span class="choice-text">${option}</span>
                `;
                
                choiceElement.addEventListener('click', () => handleAnswer(choiceElement, option, q.answer, index));
                choiceElement.addEventListener('keydown', (e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        handleAnswer(choiceElement, option, q.answer, index);
                    }
                });
                
                choicesContainer.appendChild(choiceElement);
            });
            
            questionsContainer.appendChild(slide);
        });
    }

    // Handle answer selection
    function handleAnswer(choiceElement, selectedAnswer, correctAnswer, questionIndex) {
        const questionSlide = choiceElement.closest('.question-slide');
        if (questionSlide.querySelector('.correct') || questionSlide.querySelector('.incorrect')) {
            return;
        }
        
        const isCorrect = selectedAnswer === correctAnswer;
        
        // Update scores and styling
        if (isCorrect) {
            score += 5;
            correctAnswers++;
            choiceElement.classList.add('correct');
        } else {
            score = Math.max(0, score - 1);
            incorrectAnswers++;
            choiceElement.classList.add('incorrect');
            
            // Show correct answer
            const choices = questionSlide.querySelectorAll('.choice-container');
            choices.forEach(choice => {
                if (choice.querySelector('.choice-text').textContent === correctAnswer) {
                    choice.classList.add('correct');
                }
            });
        }
        
        // Update UI
        questionsAnswered++;
        updateUI();
        
        // Check if all questions are answered
        if (questionsAnswered === questions.length) {
            setTimeout(() => {
                showEndQuizPopup();
            }, 1000);
        } else if (currentQuestionIndex < questions.length - 1) {
            // Scroll to next question after delay
            setTimeout(() => {
                scrollToNextQuestion();
            }, 1000);
        }
    }

    // Update UI elements
    function updateUI() {
        scoreElement.textContent = score;
        questionsAnsweredElement.textContent = questionsAnswered;
        
        const accuracy = questionsAnswered > 0 
            ? Math.round((correctAnswers / questionsAnswered) * 100) 
            : 0;
        
        accuracyElement.textContent = `${accuracy}%`;
        
        // Color code accuracy
        if (accuracy >= 70) {
            accuracyElement.style.color = '#4ade80';
        } else if (accuracy >= 40) {
            accuracyElement.style.color = '#facc15';
        } else {
            accuracyElement.style.color = '#f87171';
        }
    }

    // Keyboard navigation
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            const currentSlide = getCurrentSlide();
            if (!currentSlide) return;
            
            switch (e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    scrollToPreviousQuestion();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    scrollToNextQuestion();
                    break;
                case 'Escape':
                    e.preventDefault();
                    endQuiz();
                    break;
            }
        });
    }

    // Scroll behavior
    function setupScrollBehavior() {
        const container = document.querySelector('.container');
        let scrollTimeout;
        
        container.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const newIndex = getCurrentQuestionIndex();
                if (newIndex !== currentQuestionIndex) {
                    currentQuestionIndex = newIndex;
                }
            }, 50);
        });
    }

    // Get current visible slide
    function getCurrentSlide() {
        const slides = document.querySelectorAll('.question-slide');
        for (const slide of slides) {
            const rect = slide.getBoundingClientRect();
            if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
                return slide;
            }
        }
        return null;
    }

    // Get current question index
    function getCurrentQuestionIndex() {
        const currentSlide = getCurrentSlide();
        if (!currentSlide) return currentQuestionIndex;
        
        const slides = Array.from(document.querySelectorAll('.question-slide'));
        return slides.indexOf(currentSlide);
    }

    // Navigation functions
    function scrollToPreviousQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            const slides = document.querySelectorAll('.question-slide');
            slides[currentQuestionIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function scrollToNextQuestion() {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            const slides = document.querySelectorAll('.question-slide');
            slides[currentQuestionIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // End quiz
    function endQuiz() {
        // Save stats to localStorage
        localStorage.setItem('mostRecentScore', score);
        localStorage.setItem('correctAnswers', correctAnswers);
        localStorage.setItem('incorrectAnswers', incorrectAnswers);
        
        // Navigate to end page
        window.location.href = '../html/end.html';
    }

    // Show error
    function showError() {
        questionsContainer.innerHTML = `
            <div class="question-slide">
                <div id="boxed">
                    <h2 class="question-text">Error loading questions. Please try again.</h2>
                    <div class="choices-container">
                        <div class="choice-container" onclick="location.reload()">
                            <span class="choice-prefix">↻</span>
                            <span class="choice-text">Reload</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // End Quiz functionality
    endQuizBtn.addEventListener('click', () => {
        showEndQuizPopup();
    });

    function showEndQuizPopup() {
        // Get current stats
        const questionsAnswered = document.getElementById('questions-answered').textContent;
        const accuracy = document.getElementById('accuracy').textContent;
        const score = document.getElementById('score').textContent;

        // Update popup content
        finalQuestions.textContent = questionsAnswered;
        finalAccuracy.textContent = accuracy;
        finalScore.textContent = score;

        // Show popup
        popup.classList.add('active');
    }

    // Try Again functionality
    tryAgainBtn.addEventListener('click', () => {
        window.location.href = 'quiz-setup.html';
    });

    // Start the quiz
    startQuiz();
});
