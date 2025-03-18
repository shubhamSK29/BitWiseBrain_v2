document.addEventListener('DOMContentLoaded', function() {
    // Navbar functionality
    const hamburger = document.querySelector('.hamburger');
    const navbar = document.querySelector('.left-navbar');
    const content = document.querySelector('.content-wrapper');

    hamburger.addEventListener('click', () => {
        navbar.classList.toggle('collapsed');
        content.classList.toggle('expanded');
    });

    // Get stored quiz results if they exist
    const previousResults = JSON.parse(localStorage.getItem('quizResults') || '{"totalQuestions": 0, "correctAnswers": 0}');
    const questionsElement = document.querySelector('.score-item:first-child .score-value');
    const accuracyElement = document.querySelector('.score-item:last-child .score-value');

    // Update score display
    function updateScoreDisplay() {
        const accuracy = previousResults.totalQuestions > 0 
            ? Math.round((previousResults.correctAnswers / previousResults.totalQuestions) * 100) 
            : 0;
        
        questionsElement.textContent = previousResults.totalQuestions;
        accuracyElement.textContent = `${accuracy}%`;
    }

    // Initialize score display
    updateScoreDisplay();

    // Quiz setup functionality
    const languageSelect = document.getElementById('language');
    const difficultySelect = document.getElementById('difficulty');
    const countButtons = document.querySelectorAll('.count-btn');
    const startButton = document.getElementById('start-quiz');

    let selectedCount = null;

    // Handle question count selection
    countButtons.forEach(button => {
        button.addEventListener('click', () => {
            countButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            selectedCount = parseInt(button.dataset.count);
            checkFormValidity();
        });
    });

    // Check if all options are selected
    function checkFormValidity() {
        const isValid = languageSelect.value && difficultySelect.value && selectedCount;
        startButton.disabled = !isValid;
    }

    // Listen for select changes
    languageSelect.addEventListener('change', checkFormValidity);
    difficultySelect.addEventListener('change', checkFormValidity);

    // Handle form submission
    startButton.addEventListener('click', () => {
        if (!startButton.disabled) {
            const quizSettings = {
                language: languageSelect.value,
                difficulty: difficultySelect.value,
                questionCount: selectedCount
            };
            
            // Save settings to localStorage
            localStorage.setItem('quizSettings', JSON.stringify(quizSettings));
            
            // Redirect to quiz page with animation
            startButton.textContent = 'Starting Quiz...';
            startButton.style.opacity = '0.7';
            startButton.disabled = true;
            
            setTimeout(() => {
                window.location.href = 'game.html';
            }, 500);
        }
    });

    // Add hover effects for buttons
    countButtons.forEach(button => {
        button.addEventListener('mouseover', () => {
            if (!button.classList.contains('selected')) {
                button.style.transform = 'translateY(-2px)';
                button.style.boxShadow = '0 5px 15px rgba(0, 255, 255, 0.2)';
            }
        });

        button.addEventListener('mouseout', () => {
            if (!button.classList.contains('selected')) {
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = 'none';
            }
        });
    });

    // Add animations for form elements
    function addEntryAnimations() {
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach((group, index) => {
            group.style.opacity = '0';
            group.style.transform = 'translateY(20px)';
            setTimeout(() => {
                group.style.transition = 'all 0.5s ease';
                group.style.opacity = '1';
                group.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    // Initialize animations
    addEntryAnimations();
});
