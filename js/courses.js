// Course topics data
const courseTopics = {
    html: {
        title: 'HTML Topics',
        topics: [
            'Introduction to HTML',
            'Basic HTML Tags',
            'Links and Images',
            'Tables',
            'Forms and Input',
            'Semantic HTML',
            'Multimedia in HTML',
            'HTML Entities & Symbols',
            'IFrames',
            'Meta Tags & SEO Basics',
            'Advanced Form Features',
            'Accessibility in HTML',
            'HTML APIs (Advanced Integration)',
            'HTML5 Advanced Features'
        ]
    },
    css: {
        title: 'CSS Topics',
        topics: [
            'Introduction to CSS & Types (Inline, Internal, External)',
            'CSS Syntax, Selectors & Specificity',
            'Colors, Units & CSS Variables',
            'Text & Font Styling (Typography)',
            'Box Model (Margin, Padding, Border, Content)',
            'Backgrounds, Gradients & Borders',
            'CSS Positioning & Z-Index',
            'Flexbox Layout',
            'Grid Layout',
            'Responsive Design & Media Queries',
            'Pseudo-classes & Pseudo-elements',
            'CSS Transitions, Transformations & Animations',
            'Advanced Selectors & Combinators',
            'Clipping, Masking, Filters & Shadows',
            'Modern CSS Features'
        ]
    },
    javascript: {
        title: 'JavaScript Topics',
        topics: [
            'Introduction to JavaScript',
            'Operators & Expressions',
            'Conditional Statements',
            'Loops & Iteration',
            'Functions',
            'Arrays & Array Methods',
            'Objects & Object Methods',
            'String Methods & Manipulation',
            'DOM Manipulation & Events',
            'ES6 Features',
            'Advanced Functions',
            'Asynchronous JavaScript',
            'Error Handling & Debugging',
            'Object-Oriented JavaScript',
            'JavaScript APIs & Advanced Topics'
        ]
    },
    python: {
        title: 'Python Topics',
        topics: [
            'Introduction to Python Programming',
            'Variables and Data Types',
            'Control Flow Statements',
            'Functions and Modules',
            'Data Structures',
            'Object-Oriented Programming (OOP)',
            'File Handling',
            'Exception Handling',
            'Iterators and Generators',
            'Decorators and Closures',
            'Regular Expressions',
            'Concurrency and Parallelism',
            'Networking and Web Development',
            'Testing and Debugging',
            'Advanced Libraries and Frameworks'
        ]
    }
};

let currentCourse = '';
let currentTopic = '';
let currentQuestionIndex = 0;
let userAnswers = [];
let score = 0;
let correctAnswers = 0;
let questionsAnswered = 0;

// Get DOM elements
const modal = document.getElementById('topicsModal');
const modalTitle = document.getElementById('modalTitle');
const topicsList = document.getElementById('topicsList');
const closeModal = document.querySelector('.close-modal');
const startQuizButtons = document.querySelectorAll('.start-quiz-btn');
const moreDetailsBtn = document.querySelector('.more-details-btn');
const quizModal = document.getElementById('quizModal');
const questionsContainer = document.getElementById('questions-container');
const questionTemplate = document.getElementById('question-template');
const endQuizBtn = document.getElementById('end-quiz');
const popup = document.getElementById('end-quiz-popup');
const tryAgainBtn = document.getElementById('try-again');
const questionsAnsweredElement = document.getElementById('questions-answered');
const accuracyElement = document.getElementById('accuracy');
const scoreElement = document.getElementById('score');
const finalQuestions = document.getElementById('final-questions');
const finalAccuracy = document.getElementById('final-accuracy');
const finalScore = document.getElementById('final-score');

// Show modal with topics
function showTopics(course) {
    currentCourse = course;
    const courseData = courseTopics[course];
    modalTitle.textContent = courseData.title;
    
    // Clear previous topics
    topicsList.innerHTML = '';
    
    // Add topics
    courseData.topics.forEach((topic, index) => {
        const topicItem = document.createElement('div');
        topicItem.className = 'topic-item';
        topicItem.textContent = `${index + 1}. ${topic}`;
        topicsList.appendChild(topicItem);
    });
    
    // Show modal with animation
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Add click event listeners
if (startQuizButtons) {
    startQuizButtons.forEach(button => {
        button.addEventListener('click', () => {
            const course = button.getAttribute('data-course');
            showTopics(course);
        });
    });
}

// Handle More Details button click
if (moreDetailsBtn) {
    moreDetailsBtn.addEventListener('click', () => {
        if (!currentCourse) return;
        
        // Store the current course data in localStorage
        localStorage.setItem('currentCourseData', JSON.stringify({
            course: currentCourse,
            data: courseTopics[currentCourse]
        }));
        
        // Navigate to the course details page with correct path
        window.location.href = 'assets/html/course-details.html';
    });
}

// Load course content on the details page
function loadCourseContent() {
    const courseContent = document.getElementById('courseContent');
    if (courseContent) {
        const storedData = JSON.parse(localStorage.getItem('currentCourseData'));
        if (storedData) {
            const { data } = storedData;
            
            courseContent.innerHTML = `
                <h1>${data.title}</h1>
                <div class="topic-section">
                    ${data.topics.map((topic, index) => {
                        if (typeof topic === 'string') {
                            return `
                                <div class="topic-item">
                                    <div class="topic-content">
                                        <h3>${index + 1}. ${topic}</h3>
                                        <p>Learn about ${topic.toLowerCase()} and master the concepts through practical examples.</p>
                                    </div>
                                    <button class="quiz-btn" onclick="startQuiz('${index}')">
                                        <ion-icon name="arrow-forward"></ion-icon>
                                        Start Quiz
                                    </button>
                                </div>
                            `;
                        } else {
                            return `
                                <div class="topic-item">
                                    <div class="topic-content">
                                        <h3>${index + 1}. ${topic.title}</h3>
                                        <p>Learn about ${topic.title.toLowerCase()} and master the concepts through practical examples.</p>
                                    </div>
                                    <button class="quiz-btn" onclick="startQuiz('${index}')">
                                        <ion-icon name="arrow-forward"></ion-icon>
                                        Start Quiz
                                    </button>
                                </div>
                            `;
                        }
                    }).join('')}
                </div>
            `;
        } else {
            // If no data is found, redirect back to courses page
            window.location.href = 'courses.html';
        }
    }
}

// Close modal
if (closeModal) {
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    });
}

// Close modal when clicking outside
if (modal) {
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Handle keyboard events
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.style.display === 'block') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Navbar functionality
const hamburger = document.querySelector('.hamburger');
const navbar = document.querySelector('.left-navbar');

if (hamburger && navbar) {
    hamburger.addEventListener('click', () => {
        navbar.classList.toggle('expanded');
    });
}

// Start quiz for a specific topic
function startQuiz(topicId) {
    // Store current topic ID
    localStorage.setItem('currentTopic', topicId);
    
    // Initialize quiz variables
    currentQuestionIndex = 0;
    score = 0;
    questionsAnswered = 0;
    
    // Get the quiz modal and show it
    const quizModal = document.getElementById('quizModal');
    if (quizModal) {
        quizModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Display questions immediately
        displayQuestions();
        
        // Update UI
        updateUI();
    }
}

function displayQuestions() {
    const container = document.getElementById('questions-container');
    if (!container) return;
    
    // Clear previous questions
    container.innerHTML = '';
    
    // Get current topic and course data
    const currentTopic = localStorage.getItem('currentTopic');
    const storedData = JSON.parse(localStorage.getItem('currentCourseData'));
    
    if (!storedData || !storedData.data || !storedData.data.topics[currentTopic]) {
        console.error('Topic or questions not found');
        return;
    }
    
    const topic = storedData.data.topics[currentTopic];
    
    // Get the question template
    const template = document.getElementById('question-template');
    if (!template) {
        console.error('Question template not found');
        return;
    }
    
    // Display each question
    topic.questions.forEach((question, index) => {
        const questionElement = template.content.cloneNode(true);
        const questionSlide = questionElement.querySelector('.question-slide');
        const questionBox = questionElement.querySelector('#boxed');
        
        // Set question text
        const questionText = questionElement.querySelector('.question-text');
        questionText.textContent = question.question;
        
        // Set category and difficulty
        const category = questionElement.querySelector('.category');
        const difficulty = questionElement.querySelector('.difficulty');
        category.textContent = topic.title;
        difficulty.textContent = 'Multiple Choice';
        
        // Add choices
        const choicesContainer = questionElement.querySelector('.choices-container');
        question.options.forEach((option, optionIndex) => {
            const choice = document.createElement('div');
            choice.className = 'choice-container';
            choice.innerHTML = `
                <span class="choice-prefix">${String.fromCharCode(65 + optionIndex)}</span>
                <span class="choice-text">${option}</span>
            `;
            choice.addEventListener('click', () => handleAnswer(optionIndex, index));
            choicesContainer.appendChild(choice);
        });
        
        // Add to container
        container.appendChild(questionElement);
    });
}

function handleAnswer(selectedIndex, questionIndex) {
    const currentTopic = localStorage.getItem('currentTopic');
    const storedData = JSON.parse(localStorage.getItem('currentCourseData'));
    
    if (!storedData || !storedData.data || !storedData.data.topics[currentTopic]) return;
    
    const topic = storedData.data.topics[currentTopic];
    const question = topic.questions[questionIndex];
    
    if (!question) return;
    
    const choices = document.querySelectorAll(`.question-slide:nth-child(${questionIndex + 1}) .choice-container`);
    
    // Disable all choices
    choices.forEach(choice => {
        choice.style.pointerEvents = 'none';
    });
    
    // Mark correct and incorrect answers
    choices.forEach((choice, index) => {
        if (index === question.answer) {
            choice.classList.add('correct');
        } else if (index === selectedIndex) {
            choice.classList.add('incorrect');
        }
    });
    
    // Update score
    if (selectedIndex === question.answer) {
        score += 10;
        correctAnswers++;
    }
    questionsAnswered++;
    
    // Update UI
    updateUI();
    
    // Move to next question after a delay
    setTimeout(() => {
        if (questionIndex < topic.questions.length - 1) {
            currentQuestionIndex = questionIndex + 1;
            displayQuestions();
        } else {
            showEndQuizPopup();
        }
    }, 1500);
}

// Update UI elements
function updateUI() {
    const accuracy = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0;
    
    document.getElementById('questions-answered').textContent = questionsAnswered;
    document.getElementById('accuracy').textContent = `${accuracy}%`;
    document.getElementById('score').textContent = score;

    // Update accuracy color based on value
    const accuracyElement = document.getElementById('accuracy');
    if (accuracy >= 80) {
        accuracyElement.style.color = '#4CAF50';
    } else if (accuracy >= 60) {
        accuracyElement.style.color = '#FFC107';
    } else {
        accuracyElement.style.color = '#F44336';
    }
}

// Show end quiz popup
function showEndQuizPopup() {
    const popup = document.getElementById('end-quiz-popup');
    const finalQuestions = document.getElementById('final-questions');
    const finalAccuracy = document.getElementById('final-accuracy');
    const finalScore = document.getElementById('final-score');
    
    const accuracy = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0;
    
    finalQuestions.textContent = questionsAnswered;
    finalAccuracy.textContent = `${accuracy}%`;
    finalScore.textContent = score;
    
    popup.classList.add('active');
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Load course content
    loadCourseContent();
    
    // Set up end quiz button
    const endQuizBtn = document.getElementById('end-quiz');
    if (endQuizBtn) {
        endQuizBtn.addEventListener('click', () => {
            showEndQuizPopup();
        });
    }
    
    // Set up try again button
    const tryAgainBtn = document.getElementById('try-again');
    if (tryAgainBtn) {
        tryAgainBtn.addEventListener('click', () => {
            const popup = document.getElementById('end-quiz-popup');
            if (popup) popup.classList.remove('active');
            startQuiz(currentTopic);
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const startQuizBtn = document.getElementById('start-quiz');
    const quizModal = document.querySelector('.quiz-modal');
    const topicsContainer = document.querySelector('.topics-container');

    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', function() {
            // Hide topics container
            topicsContainer.style.display = 'none';
            
            // Show quiz modal
            quizModal.style.display = 'block';
            
            // Initialize quiz
            initializeQuiz();
        });
    }
});

function initializeQuiz() {
    // Get current topic from localStorage or set default
    const currentTopic = localStorage.getItem('currentTopic') || 'Introduction to HTML';
    
    // Display questions for the current topic
    displayQuestions();
    
    // Initialize score and stats
    score = 0;
    questionsAnswered = 0;
    correctAnswers = 0;
    updateUI();
} 