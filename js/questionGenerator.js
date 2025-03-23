// Question Generator
function generateQuestionsByLanguage(language, count, difficulty) {
    const questions = [
        {
            language: 'JavaScript',
            difficulty: 'easy',
            question: 'What is the output of: console.log(typeof [])?',
            options: ['object', 'array', 'undefined', 'null'],
            answer: 'object'
        },
        {
            language: 'JavaScript',
            difficulty: 'easy',
            question: 'Which method is used to add elements to the end of an array?',
            options: ['push()', 'pop()', 'shift()', 'unshift()'],
            answer: 'push()'
        },
        {
            language: 'JavaScript',
            difficulty: 'medium',
            question: 'What is the difference between == and ===?',
            options: [
                'No difference',
                '=== checks type and value, == only checks value',
                '== checks type and value, === only checks value',
                '=== is not a valid operator'
            ],
            answer: '=== checks type and value, == only checks value'
        },
        {
            language: 'Python',
            difficulty: 'easy',
            question: 'What is the correct way to create a list in Python?',
            options: ['[1, 2, 3]', '{1, 2, 3}', '(1, 2, 3)', '<1, 2, 3>'],
            answer: '[1, 2, 3]'
        },
        {
            language: 'Python',
            difficulty: 'medium',
            question: 'What is a lambda function in Python?',
            options: [
                'A named function',
                'An anonymous function',
                'A built-in function',
                'A recursive function'
            ],
            answer: 'An anonymous function'
        },
        {
            language: 'Java',
            difficulty: 'easy',
            question: 'What is the correct way to declare a variable in Java?',
            options: [
                'var x = 5;',
                'let x = 5;',
                'int x = 5;',
                'x = 5;'
            ],
            answer: 'int x = 5;'
        },
        {
            language: 'Java',
            difficulty: 'medium',
            question: 'What is inheritance in Java?',
            options: [
                'Creating multiple instances of a class',
                'A mechanism that allows a class to inherit properties from another class',
                'A way to declare variables',
                'A type of loop'
            ],
            answer: 'A mechanism that allows a class to inherit properties from another class'
        }
    ];

    // Filter questions by language and difficulty
    const filteredQuestions = questions.filter(q => 
        q.language.toLowerCase() === language.toLowerCase() &&
        q.difficulty.toLowerCase() === difficulty.toLowerCase()
    );

    // Shuffle the filtered questions
    for (let i = filteredQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filteredQuestions[i], filteredQuestions[j]] = [filteredQuestions[j], filteredQuestions[i]];
    }

    // Return the requested number of questions
    return filteredQuestions.slice(0, count);
}