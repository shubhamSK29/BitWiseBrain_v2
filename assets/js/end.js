const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
const MAX_HIGH_SCORES = 5;

document.addEventListener('DOMContentLoaded', () => {
    // Get elements with more distinct variable names
    const correctCountDisplay = document.getElementById('correctCount');
    const incorrectCountDisplay = document.getElementById('incorrectCount');
    const finalScoreDisplay = document.getElementById('finalScore');

    // Get stored values from localStorage
    const storedCorrectCount = parseInt(localStorage.getItem('correctAnswers')) || 0;
    const storedIncorrectCount = parseInt(localStorage.getItem('incorrectAnswers')) || 0;
    const storedFinalScore = parseInt(localStorage.getItem('mostRecentScore')) || 0;

    // Debug logging to check values
    console.log('Stored values:', {
        correct: storedCorrectCount,
        incorrect: storedIncorrectCount,
        score: storedFinalScore
    });

    // Update the display
    correctCountDisplay.textContent = storedCorrectCount;
    incorrectCountDisplay.textContent = storedIncorrectCount;
    finalScoreDisplay.textContent = storedFinalScore;

    // Add animations
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
});

// Save High Score function
saveHighScore = e => {
    e.preventDefault();

    const score = {
        score: document.getElementById('finalScore').textContent,
        name: username.value
    };
    
    highScores.push(score);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(5);

    localStorage.setItem("highScores", JSON.stringify(highScores));
    window.location.assign("../html/highscores.html");
};

// Username input event listener
username.addEventListener("keyup", () => {
    saveScoreBtn.disabled = !username.value;
});
