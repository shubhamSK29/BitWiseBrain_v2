import questions from './questions.js';

const scoreText = document.getElementById("score");
const questionsContainer = document.getElementById("questions-container");
let score = 0;
let currentCorrectCount = 0;
let currentIncorrectCount = 0;
let availableQuesions = [];

// CONSTANTS
const CORRECT_TAX = 10;
const INCORRECT_TAX = 5;
const MAX_QUESTIONS = 5; // Change this to the number of questions you want to display
const BATCH_SIZE = 5;

let loadedQuestions = [];
let isLoading = false;

function addControlsInfo() {
    const controlsBox = document.createElement('div');
    controlsBox.id = 'controls-info';
    controlsBox.innerHTML = `
        <div class="controls-content">
            <p>Controls:</p>
            <ul>
                <li>↹ Tab: Navigate options</li>
                <li>↵ Enter: Select option</li>
                <li>␣ Space: Next question</li>
                <li>⌫ Backspace: Previous question</li>
            </ul>
        </div>
    `;
    document.body.appendChild(controlsBox);
}

function startGame() {
    score = 0;
    currentCorrectCount = 0;
    currentIncorrectCount = 0;
    scoreText.innerText = "0";
    localStorage.setItem('correctAnswers', '0');
    localStorage.setItem('incorrectAnswers', '0');
    localStorage.setItem('mostRecentScore', '0');
    
    availableQuesions = _.shuffle([...questions]).slice(0, MAX_QUESTIONS);
    loadInitialQuestions();
    setupScrollListener();
    setupKeyListener();
    addControlsInfo();
    
    setTimeout(() => {
        const firstSlide = document.querySelector('.question-slide');
        if (firstSlide) {
            const firstChoice = firstSlide.querySelector('.choice-container');
            if (firstChoice) {
                firstChoice.focus();
                document.querySelector('.container').scrollTo(0, 0);
            }
        }
    }, 100);
}

function loadInitialQuestions() {
    questionsContainer.innerHTML = ''; // Clear existing questions
    for (let i = 0; i < BATCH_SIZE; i++) {
        if (availableQuesions.length > 0) {
            loadNextQuestion();
        }
    }
}

function loadNextQuestion() {
    if (availableQuesions.length === 0) return;

    // Get random question
    const questionIndex = Math.floor(Math.random() * availableQuesions.length);
    const question = availableQuesions[questionIndex];
    availableQuesions.splice(questionIndex, 1);

    // Create and append the question slide
    const questionSlide = createQuestionSlide(question);
    if (!questionSlide) return;

    questionsContainer.appendChild(questionSlide);
    loadedQuestions.push(question);

    // Verify choices were added
    const choices = questionSlide.querySelectorAll('.choice-container');
    if (choices.length === 0) {
        console.error('No choices loaded for question:', question);
        // Retry loading choices with randomization
        const choicesContainer = questionSlide.querySelector('.choices-container');
        
        // Create array of choice numbers and shuffle them
        const choiceNumbers = _.shuffle([1, 2, 3, 4]);
        
        choiceNumbers.forEach((num) => {
            const choice = createChoiceElement(
                question[`choice${num}`],
                num,
                question.answer === num
            );
            choicesContainer.appendChild(choice);
        });
    }
}

function createQuestionSlide(questionData) {
    const template = document.getElementById('question-template');
    const slide = template.content.cloneNode(true);
    const slideElement = slide.querySelector('.question-slide');
    
    slideElement.querySelector('.question-text').textContent = questionData.question;
    
    const choicesContainer = slideElement.querySelector('.choices-container');
    choicesContainer.innerHTML = '';
    
    const choiceNumbers = _.shuffle([1, 2, 3, 4]);
    
    choiceNumbers.forEach((num) => {
        const choice = createChoiceElement(
            questionData[`choice${num}`],
            num,
            questionData.answer === num
        );
        choicesContainer.appendChild(choice);
    });
    
    return slideElement;
}

function createChoiceElement(text, number, isCorrect) {
    const choice = document.createElement('div');
    choice.className = 'choice-container';
    choice.tabIndex = 0; // Make element focusable
    choice.innerHTML = `
        <p class="choice-prefix">${String.fromCharCode(64 + number)}</p>
        <p class="choice-text">${text}</p>
    `;
    
    choice.dataset.correct = isCorrect;
    choice.addEventListener('click', handleChoiceClick);
    
    // Remove the old focus styles since we're handling them in CSS now
    choice.addEventListener('focus', () => {
        // Only add focus styles if the question hasn't been answered yet
        if (!choice.closest('.question-slide').querySelector('.correct, .incorrect')) {
            choice.classList.add('focused');
        }
    });
    
    choice.addEventListener('blur', () => {
        choice.classList.remove('focused');
    });
    
    return choice;
}

function handleChoiceClick(e) {
    const selectedChoice = e.target.closest('.choice-container');
    const currentSlide = selectedChoice.closest('.question-slide');
    
    if (!selectedChoice || 
        currentSlide.querySelector('.correct') || 
        currentSlide.querySelector('.incorrect')) return;

    const isCorrect = selectedChoice.dataset.correct === "true";
    const classToApply = isCorrect ? "correct" : "incorrect";
    
    if (isCorrect) {
        incrementScore(CORRECT_TAX);
        currentCorrectCount++;
        localStorage.setItem('correctAnswers', currentCorrectCount.toString());
    } else {
        decrementScore(INCORRECT_TAX);
        currentIncorrectCount++;
        localStorage.setItem('incorrectAnswers', currentIncorrectCount.toString());
    }

    selectedChoice.classList.add(classToApply);

    // Log current counts for debugging
    console.log('Current counts:', {
        correct: currentCorrectCount,
        incorrect: currentIncorrectCount,
        score: score
    });

    currentSlide.querySelectorAll('.choice-container').forEach(choice => {
        choice.style.pointerEvents = 'none';
    });

    // Check if this was the last question
    const answeredQuestions = document.querySelectorAll('.correct, .incorrect').length;
    if (answeredQuestions >= MAX_QUESTIONS) {
        // Final save of all values before redirect
        localStorage.setItem('mostRecentScore', score.toString());
        localStorage.setItem('correctAnswers', currentCorrectCount.toString());
        localStorage.setItem('incorrectAnswers', currentIncorrectCount.toString());
        
        // Log final values before redirect
        console.log('Final values saved:', {
            correct: currentCorrectCount,
            incorrect: currentIncorrectCount,
            score: score
        });

        setTimeout(() => {
            window.location.assign('../html/end.html');
        }, 1000);
        return;
    }

    // If not the last question, continue with normal scroll behavior
    setTimeout(() => {
        const nextSlide = currentSlide.nextElementSibling;
        if (nextSlide) {
            const container = document.querySelector('.container');
            const slideRect = nextSlide.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const scrollOffset = (slideRect.height - containerRect.height) / 2;
            
            container.scrollTo({
                top: nextSlide.offsetTop - scrollOffset,
                behavior: 'smooth'
            });
            
            const firstChoice = nextSlide.querySelector('.choice-container');
            if (firstChoice) {
                setTimeout(() => firstChoice.focus(), 500);
            }
        }
    }, 500);
}

function setupScrollListener() {
    const container = document.querySelector('.container');
    
    container.addEventListener('scroll', _.throttle(() => {
        // Load more questions when near the bottom
        if (container.scrollHeight - container.scrollTop - container.clientHeight < 500) {
            if (!isLoading && availableQuesions.length > 0) {
                isLoading = true;
                loadMoreQuestions();
            }
        }
    }, 200)); // Increased throttle time
}

function loadMoreQuestions() {
    // Add a small delay to prevent race conditions
    setTimeout(() => {
        for (let i = 0; i < BATCH_SIZE; i++) {
            if (availableQuesions.length > 0) {
                loadNextQuestion();
            }
        }
        isLoading = false;
    }, 100);
}

function incrementScore(num) {
    score += num;
    scoreText.innerText = score.toString();
}

function decrementScore(num) {
    score -= num;
    scoreText.innerText = score.toString();
}

function setupKeyListener() {
    document.addEventListener('keydown', (e) => {
        const currentSlide = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2)
            .closest('.question-slide');
        
        if (!currentSlide) return;

        switch (e.key) {
            case 'Tab':
                e.preventDefault();
                handleTabNavigation(currentSlide, e.shiftKey);
                break;

            case 'Enter':
                handleEnterKey(currentSlide);
                break;

            case 'Backspace':
                e.preventDefault();
                const previousSlide = currentSlide.previousElementSibling;
                if (previousSlide) {
                    previousSlide.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => {
                        const firstChoice = previousSlide.querySelector('.choice-container');
                        if (firstChoice) firstChoice.focus();
                    }, 500);
                }
                break;

            case ' ': // Space key
                e.preventDefault();
                const nextSlide = currentSlide.nextElementSibling;
                if (nextSlide) {
                    nextSlide.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => {
                        const firstChoice = nextSlide.querySelector('.choice-container');
                        if (firstChoice) firstChoice.focus();
                    }, 500);
                }
                break;
        }
    });
}

// Helper functions to keep the code clean
function handleTabNavigation(currentSlide, isShiftKey) {
    const choices = currentSlide.querySelectorAll('.choice-container');
    let focusedChoice = currentSlide.querySelector('.choice-container:focus');
    
    if (!focusedChoice) {
        choices[0].focus();
    } else {
        const currentIndex = Array.from(choices).indexOf(focusedChoice);
        let nextIndex;
        
        if (isShiftKey) {
            nextIndex = currentIndex <= 0 ? choices.length - 1 : currentIndex - 1;
        } else {
            nextIndex = (currentIndex + 1) % choices.length;
        }
        choices[nextIndex].focus();
    }
}

function handleEnterKey(currentSlide) {
    const focusedChoice = currentSlide.querySelector('.choice-container:focus');
    if (focusedChoice) {
        focusedChoice.click();
    } else {
        const nextSlide = currentSlide.nextElementSibling;
        if (nextSlide) {
            nextSlide.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                const firstChoice = nextSlide.querySelector('.choice-container');
                if (firstChoice) firstChoice.focus();
            }, 500);
        }
    }
}

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', startGame);
