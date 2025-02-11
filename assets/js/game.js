const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];

let questions = [
  {
    question: "Inside which HTML element do we put the JavaScript?",
    choice1: "<script>",
    choice2: "<javascript>",
    choice3: "<js>",
    choice4: "<scripting>",
    answer: 1
  },
  {
    question: "What is the correct syntax for referring to an external script called 'example.js'?",
    choice1: "<script href='example.js'>",
    choice2: "<script name='example.js'>",
    choice3: "<script src='example.js'>",
    choice4: "<script file='example.js'>",
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
    question: "How can you add a comment in JavaScript?",
    choice1: "<!-- This is a comment -->",
    choice2: "// This is a comment",
    choice3: "'This is a comment",
    choice4: "**This is a comment**",
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
const MAX_QUESTIONS = 13; //13 Questions available

// Start Game & Timer
startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuesions = [...questions];
  getNewQuestion();

  // Timer
  setInterval(function () {
    scoreText.innerText = score;
    if (score === 100) { //CHANGED FROM 0 -> 100
      localStorage.setItem("mostRecentScore", score);
      return window.location.assign("../../assets/html/end.html");
    }
  }, 1000);
};

// Display Next Random Question and Answers
getNewQuestion = () => {
  if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    return window.location.assign("../html/end.html");
  }

  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuesions.length);
  currentQuestion = availableQuesions[questionIndex];
  question.innerText = currentQuestion.question;

  // Shuffle answer options and assign text
  const choiceNumbers = _.shuffle([1, 2, 3, 4]);

  choices.forEach((choice, index) => {
    const randomChoiceNumber = choiceNumbers[index];
    choice.innerText = currentQuestion["choice" + randomChoiceNumber];
    
    // Set data attributes to track the answer numbers
    choice.dataset["number"] = randomChoiceNumber;

    // Set 'data-correct' attribute only on the correct answer choice
    if (randomChoiceNumber === currentQuestion.answer) {
      choice.dataset["correct"] = "true";
    } else {
      delete choice.dataset["correct"];
    }

    // Remove previous listeners, then add new ones with updated scope
    choice.removeEventListener("click", handleChoiceClick);
    choice.addEventListener("click", handleChoiceClick);
  });

  availableQuesions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

// Choice Click Handler
function handleChoiceClick(e) {
  if (!acceptingAnswers) return;

  acceptingAnswers = false;
  const selectedChoice = e.target;
  const classToApply = selectedChoice.dataset["correct"] === "true" ? "correct" : "incorrect";

  if (classToApply === "correct") {
    incrementScore(CORRECT_TAX);
  } else {
    decrementScore(INCORRECT_TAX);
  }

  selectedChoice.parentElement.classList.add(classToApply);

  setTimeout(() => {
    selectedChoice.parentElement.classList.remove(classToApply);
    getNewQuestion();
  }, 1000);
}


// Reward for Correct answer
incrementScore = num => {
  score += num;
  scoreText.innerText = score;
};

// Penalty for Incorrect answer
decrementScore = num => {
  score -= num;
  scoreText.innerText = score;
};

startGame();
