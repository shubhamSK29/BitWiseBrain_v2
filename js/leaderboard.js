document.addEventListener('DOMContentLoaded', function() {
    // Sample leaderboard data
    const leaderboardData = {
        'all-time': [
            { rank: 4, name: 'Emma Davis', avatar: 'assets/img/avatar4.jpg', quizzes: 42, accuracy: 92, points: 780 },
            { rank: 5, name: 'James Wilson', avatar: 'assets/img/avatar5.jpg', quizzes: 38, accuracy: 88, points: 750 },
            { rank: 6, name: 'Olivia Brown', avatar: 'assets/img/avatar6.jpg', quizzes: 35, accuracy: 85, points: 720 },
            { rank: 7, name: 'William Lee', avatar: 'assets/img/avatar7.jpg', quizzes: 32, accuracy: 82, points: 690 },
            { rank: 8, name: 'Sophia Garcia', avatar: 'assets/img/avatar8.jpg', quizzes: 30, accuracy: 80, points: 650 },
            { rank: 9, name: 'Lucas Martinez', avatar: 'assets/img/avatar9.jpg', quizzes: 28, accuracy: 78, points: 620 },
            { rank: 10, name: 'Ava Thompson', avatar: 'assets/img/avatar10.jpg', quizzes: 25, accuracy: 75, points: 580 }
        ],
        'this-month': [
            { rank: 4, name: 'William Lee', avatar: 'assets/img/avatar7.jpg', quizzes: 15, accuracy: 90, points: 450 },
            { rank: 5, name: 'Emma Davis', avatar: 'assets/img/avatar4.jpg', quizzes: 12, accuracy: 88, points: 420 },
            { rank: 6, name: 'Sophia Garcia', avatar: 'assets/img/avatar8.jpg', quizzes: 10, accuracy: 85, points: 380 },
            { rank: 7, name: 'James Wilson', avatar: 'assets/img/avatar5.jpg', quizzes: 8, accuracy: 82, points: 350 },
            { rank: 8, name: 'Lucas Martinez', avatar: 'assets/img/avatar9.jpg', quizzes: 7, accuracy: 80, points: 320 },
            { rank: 9, name: 'Olivia Brown', avatar: 'assets/img/avatar6.jpg', quizzes: 6, accuracy: 78, points: 290 },
            { rank: 10, name: 'Ava Thompson', avatar: 'assets/img/avatar10.jpg', quizzes: 5, accuracy: 75, points: 250 }
        ],
        'this-week': [
            { rank: 4, name: 'Sophia Garcia', avatar: 'assets/img/avatar8.jpg', quizzes: 5, accuracy: 95, points: 280 },
            { rank: 5, name: 'William Lee', avatar: 'assets/img/avatar7.jpg', quizzes: 4, accuracy: 92, points: 250 },
            { rank: 6, name: 'Emma Davis', avatar: 'assets/img/avatar4.jpg', quizzes: 4, accuracy: 88, points: 220 },
            { rank: 7, name: 'Lucas Martinez', avatar: 'assets/img/avatar9.jpg', quizzes: 3, accuracy: 85, points: 190 },
            { rank: 8, name: 'James Wilson', avatar: 'assets/img/avatar5.jpg', quizzes: 3, accuracy: 82, points: 170 },
            { rank: 9, name: 'Olivia Brown', avatar: 'assets/img/avatar6.jpg', quizzes: 2, accuracy: 80, points: 150 },
            { rank: 10, name: 'Ava Thompson', avatar: 'assets/img/avatar10.jpg', quizzes: 2, accuracy: 78, points: 130 }
        ]
    };

    // Function to populate leaderboard table
    function populateLeaderboard(timeFilter) {
        const tableBody = document.querySelector('.leaderboard-table');
        const data = leaderboardData[timeFilter];
        
        // Clear existing rows except header
        const rows = Array.from(tableBody.children);
        rows.slice(1).forEach(row => row.remove());

        // Add new rows with staggered animation
        data.forEach((player, index) => {
            const row = document.createElement('div');
            row.className = 'table-row';
            row.style.animationDelay = `${index * 0.1}s`;
            
            row.innerHTML = `
                <div class="rank">${player.rank}</div>
                <div class="player">
                    <img src="${player.avatar}" alt="${player.name}">
                    <span>${player.name}</span>
                </div>
                <div class="quiz-completed">${player.quizzes}</div>
                <div class="accuracy">${player.accuracy}%</div>
                <div class="points">${player.points}</div>
            `;
            
            tableBody.appendChild(row);
        });
    }

    // Handle filter button clicks
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update leaderboard
            const timeFilter = button.getAttribute('data-filter');
            populateLeaderboard(timeFilter);
        });
    });

    // Initialize with all-time data
    populateLeaderboard('all-time');

    // Navbar functionality
    const hamburger = document.querySelector('.hamburger');
    const navbar = document.querySelector('.left-navbar');
    
    hamburger.addEventListener('click', function() {
        navbar.classList.toggle('expanded');
    });

    // Add hover effect to table rows
    document.addEventListener('mouseover', function(e) {
        if (e.target.closest('.table-row')) {
            const row = e.target.closest('.table-row');
            const rows = document.querySelectorAll('.table-row');
            
            rows.forEach(r => {
                if (r !== row) {
                    r.style.opacity = '0.5';
                    r.style.transform = 'scale(0.98)';
                }
            });
        }
    });

    document.addEventListener('mouseout', function(e) {
        if (e.target.closest('.table-row')) {
            const rows = document.querySelectorAll('.table-row');
            rows.forEach(row => {
                row.style.opacity = '';
                row.style.transform = '';
            });
        }
    });
});
