class CourseManager {
    constructor() {
        this.questionGenerator = new QuestionGenerator();
        this.initializeNavbar();
        this.initializeCourseCards();
    }

    initializeNavbar() {
        // Set active nav item based on current page
        const currentPath = window.location.pathname;
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            if (item.getAttribute('href') && currentPath.includes(item.getAttribute('href'))) {
                item.classList.add('active');
            }
        });

        // Handle nav item clicks
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // Remove active class from all items
                navItems.forEach(i => i.classList.remove('active'));
                // Add active class to clicked item
                item.classList.add('active');
            });
        });
    }

    initializeCourseCards() {
        const quizButtons = document.querySelectorAll('.start-quiz');
        
        quizButtons.forEach(button => {
            button.addEventListener('click', () => {
                const course = button.dataset.course;
                const level = button.dataset.level;
                this.startQuiz(course, level);
            });
        });

        // Add click handlers for course cards
        const courseCards = document.querySelectorAll('.course-card');
        courseCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('start-quiz')) {
                    this.toggleCourseDetails(card);
                }
            });
        });
    }

    toggleCourseDetails(card) {
        const levelContainer = card.querySelector('.level-container');
        const isExpanded = levelContainer.style.maxHeight;

        if (!isExpanded) {
            levelContainer.style.maxHeight = levelContainer.scrollHeight + 'px';
            card.classList.add('expanded');
        } else {
            levelContainer.style.maxHeight = null;
            card.classList.remove('expanded');
        }
    }

    startQuiz(course, level) {
        // Generate questions based on course and level
        const questions = this.generateQuestions(course, level);
        
        // Store questions in localStorage
        localStorage.setItem('currentQuiz', JSON.stringify({
            course,
            level,
            questions
        }));

        // Redirect to quiz page
        window.location.href = 'quiz.html';
    }

    generateQuestions(course, level) {
        const numQuestions = 10;
        const questions = [];

        for (let i = 0; i < numQuestions; i++) {
            const question = this.questionGenerator.generateQuestion(course);
            
            // Adjust difficulty based on level
            question.difficulty = level;
            
            // Generate options
            question.options = this.questionGenerator.generateOptionsForQuestion(question);
            
            questions.push(question);
        }

        return questions;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const courseManager = new CourseManager();
}); 