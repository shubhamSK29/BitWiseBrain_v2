const scoreText = document.getElementById("score");
const questionsContainer = document.getElementById("questions-container");
let currentQuestion = {};
let score = 0;
let questionCounter = 0;
let availableQuesions = [];

let questions = [
    {
        question: "Which HTML tag is used for JavaScript code?",
        choice1: "［script］",
        choice2: "［javascript］",
        choice3: "［js］",
        choice4: "［scripting］",
        answer: 1
    },
    {
        question: "What is the correct syntax for referring to an external script called 'example.js'?",
        choice1: "［script href='example.js'］",
        choice2: "［script name='example.js'］",
        choice3: "［script src='example.js'］",
        choice4: "［script file='example.js'］",
        answer: 3
    },
    {
        question: "How do you write 'Hello World' in an alert box?",
        choice1: "msgBox('Hello World');",
        choice2: "alertBox('Hello World');",
        choice3: "msg('Hello World');",
        choice4: "alert('Hello World');",
        answer: 4
    },
    {
        question: "How do you create a function in JavaScript?",
        choice1: "function = myFunction()",
        choice2: "function:myFunction()",
        choice3: "function myFunction()",
        choice4: "create.myFunction()",
        answer: 3
    },
    {
        question: "How do you call a function named 'myFunction'?",
        choice1: "call myFunction()",
        choice2: "call function myFunction()",
        choice3: "myFunction()",
        choice4: "Call.myFunction()",
        answer: 3
    },
    {
        question: "How do you write a comment in JavaScript?",
        choice1: "-- This is a comment",
        choice2: "// This is a comment",
        choice3: "# This is a comment",
        choice4: "/* This is a comment */",
        answer: 2
    },
    {
        question: "What is the correct way to write a JavaScript array?",
        choice1: "var colors = 'red', 'green', 'blue'",
        choice2: "var colors = (1:'red', 2:'green', 3:'blue')",
        choice3: "var colors = ['red', 'green', 'blue']",
        choice4: "var colors = 1 = ('red'), 2 = ('green'), 3 = ('blue')",
        answer: 3
    },
    {
        question: "How do you round the number 7.25 to the nearest integer?",
        choice1: "Math.rnd(7.25)",
        choice2: "Math.round(7.25)",
        choice3: "rnd(7.25)",
        choice4: "round(7.25)",
        answer: 2
    },
    {
        question: "Which event occurs when the user clicks on an HTML element?",
        choice1: "onmouseclick",
        choice2: "onchange",
        choice3: "onclick",
        choice4: "onmouseover",
        answer: 3
    },
    {
        question: "How do you declare a JavaScript variable?",
        choice1: "var carName;",
        choice2: "variable carName;",
        choice3: "v carName;",
        choice4: "declare carName;",
        answer: 1
    },
    {
        question: "Which operator is used to assign a value to a variable?",
        choice1: "*",
        choice2: "x",
        choice3: "=",
        choice4: "-",
        answer: 3
    },
    {
        question: "What will the following code return: Boolean(10 > 9)?",
        choice1: "false",
        choice2: "NaN",
        choice3: "true",
        choice4: "undefined",
        answer: 3
    },
    {
        question: "How to get full attendance in lectures?",
        choice1: "Attend the lecture",
        choice2: "Let your friend proxy in your attendance",
        choice3: "Submit a doctor's certificate",
        choice4: "All of the above",
        answer: 4
    }
];

// CONSTANTS
const CORRECT_TAX = 10;
const INCORRECT_TAX = 5;
const MAX_QUESTIONS = 13; // Change this to the number of questions you want to display
const BATCH_SIZE = 5;
const TOTAL_QUESTIONS = questions.length;

let loadedQuestions = [];
let currentViewingIndex = 0;
let isLoading = false;

function startGame() {
    score = 0;
    scoreText.innerText = "0";
    // Only take MAX_QUESTIONS number of questions randomly
    availableQuesions = _.shuffle([...questions]).slice(0, MAX_QUESTIONS);
    loadInitialQuestions();
    setupScrollListener();
    setupKeyListener();
    addStylesheet();
    
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
    
    // Add focus styles
    choice.addEventListener('focus', () => {
        choice.style.transform = 'scale(1.02)';
        choice.style.boxShadow = '0 0 20px rgba(78, 84, 200, 0.5)';
    });
    
    choice.addEventListener('blur', () => {
        choice.style.transform = '';
        choice.style.boxShadow = '';
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
    } else {
        decrementScore(INCORRECT_TAX);
    }

    selectedChoice.classList.add(classToApply);

    currentSlide.querySelectorAll('.choice-container').forEach(choice => {
        choice.style.pointerEvents = 'none';
    });

    // Check if this was the last question
    const answeredQuestions = document.querySelectorAll('.correct, .incorrect').length;
    if (answeredQuestions >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
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

        // Don't allow navigation if question already answered
        if (currentSlide.querySelector('.correct') || 
            currentSlide.querySelector('.incorrect')) {
            if (e.key === 'Enter') {
                const nextSlide = currentSlide.nextElementSibling;
                if (nextSlide) {
                    nextSlide.scrollIntoView({ behavior: 'smooth' });
                    const firstChoice = nextSlide.querySelector('.choice-container');
                    if (firstChoice) {
                        setTimeout(() => firstChoice.focus(), 100);
                    }
                }
            }
            return;
        }

        const choices = currentSlide.querySelectorAll('.choice-container');
        let focusedChoice = currentSlide.querySelector('.choice-container:focus');
        
        switch (e.key) {
            case 'Tab':
                e.preventDefault();
                if (!focusedChoice) {
                    choices[0].focus();
                } else {
                    const currentIndex = Array.from(choices).indexOf(focusedChoice);
                    let nextIndex;
                    
                    if (e.shiftKey) {
                        // Move backwards with Shift+Tab
                        nextIndex = currentIndex <= 0 ? choices.length - 1 : currentIndex - 1;
                    } else {
                        // Move forwards with Tab
                        nextIndex = (currentIndex + 1) % choices.length;
                    }
                    choices[nextIndex].focus();
                }
                break;

            case 'Enter':
                if (focusedChoice) {
                    focusedChoice.click();
                } else {
                    const nextSlide = currentSlide.nextElementSibling;
                    if (nextSlide) {
                        nextSlide.scrollIntoView({ behavior: 'smooth' });
                        const firstChoice = nextSlide.querySelector('.choice-container');
                        if (firstChoice) {
                            setTimeout(() => firstChoice.focus(), 100);
                        }
                    }
                }
                break;
        }
    });
}

// Update CSS for focus state
function addStylesheet() {
    const style = document.createElement('style');
    style.textContent = `
        .choice-container:focus {
            outline: none;
            transform: scale(1.02);
            box-shadow: 0 0 20px rgba(78, 84, 200, 0.5);
        }
    `;
    document.head.appendChild(style);
}

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', startGame);
