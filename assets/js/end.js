const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
const MAX_HIGH_SCORES = 5;

document.addEventListener('DOMContentLoaded', function() {
    const username = document.getElementById('username');
    const saveScoreBtn = document.getElementById('saveScoreBtn');
    const finalScore = document.getElementById('finalScore');
    const correctCount = document.getElementById('correctCount');
    const incorrectCount = document.getElementById('incorrectCount');
    
    const score = localStorage.getItem('mostRecentScore') || 0;
    const correct = localStorage.getItem('correctAnswers') || 0;
    const incorrect = localStorage.getItem('incorrectAnswers') || 0;

    finalScore.innerText = score;
    correctCount.innerText = correct;
    incorrectCount.innerText = incorrect;

    username.addEventListener('keyup', () => {
        saveScoreBtn.disabled = !username.value;
    });

    saveHighScore = (e) => {
        e.preventDefault();

        const scoreData = {
            score: score,
            name: username.value,
            correct: correct,
            incorrect: incorrect,
            date: new Date().toISOString()
        };

        let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        highScores.push(scoreData);
        highScores.sort((a, b) => b.score - a.score);
        highScores = highScores.slice(0, 5);
        
        localStorage.setItem('highScores', JSON.stringify(highScores));
        window.location.assign('highscores.html');
    };
});
