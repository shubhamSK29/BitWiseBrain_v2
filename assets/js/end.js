const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const finalScore = document.getElementById("finalScore");
const mostRecentScore = localStorage.getItem("mostRecentScore");

const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

// const correctScore = document.getElementById("correctScore");
// const incorrectScore = document.getElementById("incorrectScore");

const MAX_HIGH_SCORES = 5;

finalScore.innerText = mostRecentScore;
// correctScore.innerText = correctScore;
// incorrectScore.innerText = incorrectScore;

username.addEventListener("keyup", () => {
  saveScoreBtn.disabled = !username.value;
});

// Save High Score to Local Storage
saveHighScore = e => {
  e.preventDefault();

  const score = {
    score: finalScore.innerText,
    name: username.value
  };
  highScores.push(score);
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(5);

  localStorage.setItem("highScores", JSON.stringify(highScores));
  window.location.assign("../html/highscores.html");
};

document.addEventListener('DOMContentLoaded', () => {
    // Get elements
    const correctCount = document.getElementById('correctCount');
    const incorrectCount = document.getElementById('incorrectCount');
    const finalScore = document.getElementById('finalScore');

    // Get stored values from localStorage
    const results = {
        correct: parseInt(localStorage.getItem('correctAnswers')) || 0,
        incorrect: parseInt(localStorage.getItem('incorrectAnswers')) || 0,
        score: parseInt(localStorage.getItem('mostRecentScore')) || 0
    };

    // Update the display
    correctCount.textContent = results.correct;
    incorrectCount.textContent = results.incorrect;
    finalScore.textContent = results.score;

    // Add some animations
    const resultItems = document.querySelectorAll('.result-item');
    resultItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 200);
    });

    // Clear localStorage items we don't need anymore
    localStorage.removeItem('correctAnswers');
    localStorage.removeItem('incorrectAnswers');
    localStorage.removeItem('mostRecentScore');
});
