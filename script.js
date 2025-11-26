// ==================== 
// GAME STATE MANAGEMENT
// ====================
let gameState = {
    player1: { score: 0, answer: '', problem: {}, hasAnswered: false },
    player2: { score: 0, answer: '', problem: {}, hasAnswered: false },
    gameMode: '',
    level: 1,
    gameActive: false,
    ropePosition: 0,
    maxRopeMove: 100,
    gameTimer: null,
    timeLeft: 300 // 5 menit dalam detik
};

// ==================== 
// DOM ELEMENTS CACHE
// ====================
const elements = {
    mainMenu: document.getElementById('main-menu'),
    levelMenu: document.getElementById('level-menu'),
    victoryModal: document.getElementById('victory-modal'),
    victoryTitle: document.getElementById('victory-title'),
    victoryMessage: document.getElementById('victory-message'),
    levelTitle: document.getElementById('level-title'),
    levelDescription: document.getElementById('level-description'),
    levelGrid: document.querySelector('.level-grid'),
    gameContainer: document.getElementById('game-container'),
    countdownOverlay: document.getElementById('countdown-overlay'),
    countdown: document.getElementById('countdown'),
    soundAngka: document.getElementById('sound-angka'),
    soundKonfirmasi: document.getElementById('sound-konfirmasi'),
    soundMenuSelect: document.getElementById('sound-menu-select'),
    soundMainMenu: document.getElementById('sound-main-menu'),
    soundPemenang: document.getElementById('sound-pemenang'),
    feedbackP1: document.getElementById('feedback-p1'),
    feedbackP2: document.getElementById('feedback-p2'),
    problemP1: document.getElementById('problem-p1'),
    problemP2: document.getElementById('problem-p2'),
    answerP1: document.getElementById('answer-p1'),
    answerP2: document.getElementById('answer-p2'),
    keypadP1: document.getElementById('keypad-p1'),
    keypadP2: document.getElementById('keypad-p2'),
    tugIllustration: document.getElementById('tug-of-war-illustration'),
    statusMessage: document.getElementById('status-message'),
    gameTimer: document.getElementById('game-timer'),
    arenaScoreP1: document.getElementById('arena-score-p1'),
    arenaScoreP2: document.getElementById('arena-score-p2')
};

// ==================== 
// MODE CONFIGURATIONS
// ====================
const modeConfigs = {
    'addition': {
        title: 'Penjumlahan',
        description: 'Soal penjumlahan dua bilangan'
    },
    'addition3': {
        title: 'Penjumlahan 3 Bilangan',
        description: 'Soal penjumlahan tiga bilangan'
    },
    'subtraction': {
        title: 'Pengurangan', 
        description: 'Soal pengurangan dua bilangan'
    },
    'subtraction3': {
        title: 'Pengurangan 3 Bilangan',
        description: 'Soal pengurangan tiga bilangan'
    },
    'addition-or-subtraction': {
        title: 'Penjumlahan atau Pengurangan',
        description: 'Gabungan operasi penjumlahan atau pengurangan'
    },
    'mixed-addition-subtraction': {
        title: 'Campuran Penjumlahan & Pengurangan',
        description: 'Soal campuran 3 bilangan dengan operator + dan -'
    },
    'double-addition-subtraction': {
        title: 'Penjumlahan dan Pengurangan Ganda',
        description: 'Gabungan operasi penjumlahan dan pengurangan ganda'
    },
    'multiplication': {
        title: 'Perkalian',
        description: 'Soal perkalian dua bilangan'
    },
    'division': {
        title: 'Pembagian',
        description: 'Soal pembagian dua bilangan'
    },
    'multiplication-or-division': {
        title: 'Perkalian atau Pembagian',
        description: 'Gabungan perkalian dan pembagian'
    },
    'all-operations': {
        title: 'Semua Operasi',
        description: 'Gabungan semua operasi matematika'
    },
    'all-mixed-operations': {
        title: 'Campuran Semua Operasi (Sulit)',
        description: 'Soal yang melibatkan +, -, ×, dan ÷. Wajib urutan operasi (PEMDAS/BODMAS).'
    }
};

// ==================== 
// LEVEL CONFIGURATIONS
// ====================
const levelConfigs = {
    1: { maxNumber: 10, difficulty: 'Mudah' },
    2: { maxNumber: 20, difficulty: 'Mudah' },
    3: { maxNumber: 50, difficulty: 'Sedang' },
    4: { maxNumber: 100, difficulty: 'Sedang' },
    5: { maxNumber: 200, difficulty: 'Sedang' },
    6: { maxNumber: 500, difficulty: 'Sulit' },
    7: { maxNumber: 1000, difficulty: 'Sulit' },
    8: { maxNumber: 2000, difficulty: 'Sulit' },
    9: { maxNumber: 5000, difficulty: 'Expert' },
    10: { maxNumber: 10000, difficulty: 'Expert' }
};

// ==================== 
// EVENT LISTENERS SETUP
// ====================
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    setTimeout(initializePositions, 100);
});

// FUNCTION: Initialize all event listeners
function initializeEventListeners() {
    // Listener untuk Mode Selection
    document.querySelectorAll('.mode-card').forEach(card => {
        card.addEventListener('click', function() {
            playSound(elements.soundMenuSelect);
            const selectedMode = this.dataset.mode;
            showLevelSelection(selectedMode);
        });
    });

    // Listener untuk Level Selection
    elements.levelGrid.addEventListener('click', function(event) {
        const levelCard = event.target.closest('.level-card');
        if (levelCard) {
            playSound(elements.soundMenuSelect);
            const level = parseInt(levelCard.dataset.level);
            startGameWithLevel(level);
        }
    });
}

// FUNCTION: Initialize character and rope positions
function initializePositions() {
    gameState.ropePosition = 0;
    updateRopePosition();
}

// ==================== 
// MENU NAVIGATION
// ====================

// FUNCTION: Show level selection for chosen mode
function showLevelSelection(mode) {
    gameState.gameMode = mode;
    
    elements.levelTitle.textContent = `Level ${modeConfigs[mode].title}`;
    elements.levelDescription.textContent = modeConfigs[mode].description;
    
    generateLevelCards();
    
    hideModal(elements.mainMenu);
    showModal(elements.levelMenu);
}

// FUNCTION: Generate level selection cards
function generateLevelCards() {
    elements.levelGrid.innerHTML = '';
    
    for (let level = 1; level <= 10; level++) {
        const levelCard = document.createElement('div');
        levelCard.className = `level-card ${getDifficultyClass(level)}`;
        levelCard.dataset.level = level;
        levelCard.innerHTML = `
            <div class="level-number">${level}</div>
            <div class="level-difficulty">${levelConfigs[level].difficulty}</div>
            <div class="level-range">Bilangan 1-${levelConfigs[level].maxNumber}</div>
        `;
        elements.levelGrid.appendChild(levelCard);
    }
}

// FUNCTION: Get CSS class for difficulty level
function getDifficultyClass(level) {
    if (level <= 2) return 'easy';
    if (level <= 5) return 'medium';
    return 'hard';
}

// FUNCTION: Show main menu
function showMainMenu() {
    playSound(elements.soundMainMenu);
    hideAllModals();
    showModal(elements.mainMenu);
    initializePositions();
}

// ==================== 
// MODAL FUNCTIONS
// ====================

// FUNCTION: Show modal with animation
function showModal(modal) {
    modal.classList.add('active');
}

// FUNCTION: Hide modal with animation
function hideModal(modal) {
    modal.classList.remove('active');
}

// FUNCTION: Hide all modals
function hideAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// FUNCTION: Show victory modal
function showVictoryModal(winner) {
    const victoryModal = elements.victoryModal;
    const playerName = winner === 1 ? 'Pemain 1' : 'Pemain 2';
    const playerColor = winner === 1 ? 'player1' : 'player2';
    
    elements.victoryTitle.textContent = `${playerName} Menang!`;
    elements.victoryMessage.textContent = `Selamat! ${playerName} berhasil memenangkan permainan dengan skor ${winner === 1 ? gameState.player1.score : gameState.player2.score}!`;
    
    victoryModal.className = `modal victory-modal ${playerColor}`;
    
    // Pastikan modal tidak aktif sebelum menampilkan
    victoryModal.classList.remove('active');
    
    playSound(elements.soundPemenang);
    
    // Gunakan timeout kecil untuk memastikan DOM update
    setTimeout(() => {
        showModal(victoryModal);
        createConfetti();
    }, 10);
}

// FUNCTION: Close victory modal
function closeVictoryModal() {
    // Hapus semua confetti yang tersisa
    const modalContent = elements.victoryModal.querySelector('.modal-content');
    const confettiElements = modalContent.querySelectorAll('.confetti');
    confettiElements.forEach(confetti => confetti.remove());
    
    hideModal(elements.victoryModal);
    resetGame();
}

// FUNCTION: Create confetti effect
function createConfetti() {
    const modalContent = elements.victoryModal.querySelector('.modal-content');
    const colors = ['#f39c12', '#e74c3c', '#3498db', '#27ae60', '#9b59b6'];
    
    // Hapus confetti lama jika ada
    const oldConfetti = modalContent.querySelectorAll('.confetti');
    oldConfetti.forEach(confetti => confetti.remove());
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        
        modalContent.appendChild(confetti);
        
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.remove();
            }
        }, 5000);
    }
}

// ==================== 
// GAME FLOW FUNCTIONS
// ====================

// FUNCTION: Start game with selected level - VERSI LENGKAP
function startGameWithLevel(level) {
    console.log('Starting game with level:', level);
    gameState.level = level;
    hideModal(elements.levelMenu);
    startCountdown();
}

// FUNCTION: Countdown before game starts
function startCountdown() {
    showModal(elements.countdownOverlay);
    let count = 3;
    
    const countdownInterval = setInterval(() => {
        elements.countdown.textContent = count > 0 ? count : 'MULAI!';
        
        if (count === -1) {
            clearInterval(countdownInterval);
            hideModal(elements.countdownOverlay);
            initializeGame();
        }
        count--;
    }, 1000);
}

// FUNCTION: Initialize the game
// FUNCTION: Initialize the game - VERSI LENGKAP
function initializeGame() {
    console.log('Initializing game...');
    
    // Reset game state
    gameState.player1.score = 0;
    gameState.player2.score = 0;
    gameState.player1.answer = '';
    gameState.player2.answer = '';
    gameState.player1.hasAnswered = false;
    gameState.player2.hasAnswered = false;
    gameState.ropePosition = 0;
    gameState.gameActive = true;
    gameState.timeLeft = 300;
    
    // Reset UI elements
    elements.arenaScoreP1.textContent = '0';
    elements.arenaScoreP2.textContent = '0';
    elements.statusMessage.textContent = 'Jawab soal dengan benar untuk menarik tambang!';
    elements.statusMessage.style.color = '#2c3e50';
    
    // Clear answer displays
    elements.answerP1.textContent = '';
    elements.answerP2.textContent = '';
    elements.answerP1.style.borderColor = '#bdc3c7';
    elements.answerP2.style.borderColor = '#bdc3c7';
    
    // Clear feedback
    elements.feedbackP1.textContent = '';
    elements.feedbackP2.textContent = '';
    elements.feedbackP1.className = 'feedback-box';
    elements.feedbackP2.className = 'feedback-box';
    
    // Reset timer display
    elements.gameTimer.textContent = '05:00';
    elements.gameTimer.classList.remove('timer-warning');
    
    // Generate game content
    generateKeypads();
    generateNewProblems();
    
    // Tampilkan game container dengan benar
    hideAllModals();
    elements.gameContainer.classList.remove('hidden');
    elements.gameContainer.style.display = 'flex';
    
    // Start game components
    startGameTimer();
    updateRopePosition();
    
    console.log('Game initialized successfully');
}

// FUNCTION: Start game timer
function startGameTimer() {
    updateTimerDisplay();
    
    if (gameState.gameTimer) {
        clearInterval(gameState.gameTimer);
    }
    
    gameState.gameTimer = setInterval(() => {
        gameState.timeLeft--;
        updateTimerDisplay();
        
        if (gameState.timeLeft <= 30) {
            elements.gameTimer.classList.add('timer-warning');
        }
        
        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.gameTimer);
            endGameByTime();
        }
    }, 1000);
}

// FUNCTION: Update timer display
function updateTimerDisplay() {
    const minutes = Math.floor(gameState.timeLeft / 60);
    const seconds = gameState.timeLeft % 60;
    elements.gameTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// FUNCTION: End game by time
function endGameByTime() {
    gameState.gameActive = false;
    
    let winner;
    if (gameState.player1.score > gameState.player2.score) {
        winner = 1;
    } else if (gameState.player2.score > gameState.player1.score) {
        winner = 2;
    } else {
        winner = gameState.ropePosition < 0 ? 1 : 2;
    }
    
    elements.statusMessage.textContent = `Waktu habis! ${winner === 1 ? 'Pemain 1' : 'Pemain 2'} menang dengan skor lebih tinggi!`;
    elements.statusMessage.style.color = winner === 1 ? '#3498db' : '#e74c3c';
    
    // Hentikan timer
    if (gameState.gameTimer) {
        clearInterval(gameState.gameTimer);
        gameState.gameTimer = null;
    }
    
    setTimeout(() => {
        showVictoryModal(winner);
    }, 1500);
}

// FUNCTION: Generate keypads for both players
function generateKeypads() {
    // Keypad for Player 1
    elements.keypadP1.innerHTML = '';
    const keypadButtons1 = [
        '1', '2', '3',
        '4', '5', '6', 
        '7', '8', '9',
        '←', '0', '✓'
    ];
    
    keypadButtons1.forEach(button => {
        const btn = document.createElement('button');
        btn.textContent = button;
        btn.className = button === '✓' ? 'action' : button === '←' ? 'clear' : '';
        btn.addEventListener('click', () => handleKeypadInput(1, button));
        elements.keypadP1.appendChild(btn);
    });
    
    // Keypad for Player 2
    elements.keypadP2.innerHTML = '';
    const keypadButtons2 = [
        '1', '2', '3',
        '4', '5', '6', 
        '7', '8', '9',
        '←', '0', '✓'
    ];
    
    keypadButtons2.forEach(button => {
        const btn = document.createElement('button');
        btn.textContent = button;
        btn.className = button === '✓' ? 'action' : button === '←' ? 'clear' : '';
        btn.addEventListener('click', () => handleKeypadInput(2, button));
        elements.keypadP2.appendChild(btn);
    });
}

// FUNCTION: Handle keypad input
function handleKeypadInput(player, key) {
    if (!gameState.gameActive) return;
    
    const playerState = player === 1 ? gameState.player1 : gameState.player2;
    const answerDisplay = player === 1 ? elements.answerP1 : elements.answerP2;
    
    if (key === '←') {
        playSound(elements.soundAngka);
        playerState.answer = playerState.answer.slice(0, -1);
    } else if (key === '✓') {
        playSound(elements.soundKonfirmasi);
        checkAnswer(player);
        return;
    } else {
        playSound(elements.soundAngka);
        if (playerState.answer.length < 6) {
            playerState.answer += key;
        }
    }
    
    answerDisplay.textContent = playerState.answer;
}

// FUNCTION: Generate new math problems
function generateNewProblems() {
    gameState.player1.problem = generateMathProblem();
    gameState.player2.problem = generateMathProblem();
    
    elements.problemP1.textContent = gameState.player1.problem.text;
    elements.problemP2.textContent = gameState.player2.problem.text;
    
    gameState.player1.answer = '';
    gameState.player2.answer = '';
    gameState.player1.hasAnswered = false;
    gameState.player2.hasAnswered = false;
    elements.answerP1.textContent = '';
    elements.answerP2.textContent = '';
}

// FUNCTION: Generate new problem for specific player only
function generateNewProblemForPlayer(player) {
    const playerState = player === 1 ? gameState.player1 : gameState.player2;
    playerState.problem = generateMathProblem();
    
    if (player === 1) {
        elements.problemP1.textContent = playerState.problem.text;
    } else {
        elements.problemP2.textContent = playerState.problem.text;
    }
    
    playerState.answer = '';
    playerState.hasAnswered = false;
    
    if (player === 1) {
        elements.answerP1.textContent = '';
    } else {
        elements.answerP2.textContent = '';
    }
}

// FUNCTION: Generate a math problem based on game mode and level
function generateMathProblem() {
    const maxNumber = levelConfigs[gameState.level].maxNumber;
    let problem = {};
    
    switch(gameState.gameMode) {
        case 'addition':
            problem = generateAdditionProblem(maxNumber, 2);
            break;
        case 'addition3':
            problem = generateAdditionProblem(maxNumber, 3);
            break;
        case 'subtraction':
            problem = generateSubtractionProblem(maxNumber, 2);
            break;
        case 'subtraction3':
            problem = generateSubtractionProblem(maxNumber, 3);
            break;
        case 'addition-or-subtraction':
            problem = Math.random() > 0.5 ? 
                generateAdditionProblem(maxNumber, 2) : 
                generateSubtractionProblem(maxNumber, 2);
            break;
        case 'double-addition-subtraction':
            problem = Math.random() > 0.5 ? 
                generateAdditionProblem(maxNumber, 3) : 
                generateSubtractionProblem(maxNumber, 3);
            break;
        case 'mixed-addition-subtraction':
            problem = generateMixedAdditionSubtractionProblem(maxNumber);
            break;
        case 'multiplication':
            problem = generateMultiplicationProblem(maxNumber);
            break;
        case 'division':
            problem = generateDivisionProblem(maxNumber);
            break;
        case 'multiplication-or-division':
            problem = Math.random() > 0.5 ? 
                generateMultiplicationProblem(maxNumber) : 
                generateDivisionProblem(maxNumber);
            break;
        case 'all-operations':
            const rand = Math.random();
            if (rand < 0.4) {
                problem = generateAdditionProblem(maxNumber, 2);
            } else if (rand < 0.7) {
                problem = generateSubtractionProblem(maxNumber, 2);
            } else if (rand < 0.9) {
                problem = generateMultiplicationProblem(maxNumber);
            } else {
                problem = generateDivisionProblem(maxNumber);
            }
            break;
        case 'all-mixed-operations':
            problem = generateAllMixedOperationsProblem(maxNumber);
            break;
        default:
            problem = generateAdditionProblem(maxNumber, 2);
    }
    
    return problem;
}

// FUNCTION: Generate addition problem
function generateAdditionProblem(maxNumber, numOperands) {
    let numbers = [];
    let sum = 0;
    let text = '';
    
    for (let i = 0; i < numOperands; i++) {
        const num = Math.floor(Math.random() * maxNumber) + 1;
        numbers.push(num);
        sum += num;
        
        if (i > 0) {
            text += ' + ';
        }
        text += num;
    }
    
    return {
        numbers: numbers,
        answer: sum,
        text: text + ' = ?',
        operation: 'addition'
    };
}

// FUNCTION: Generate subtraction problem
function generateSubtractionProblem(maxNumber, numOperands) {
    let numbers = [];
    let result = 0;
    let text = '';

    if (numOperands === 2) {
        const num2 = Math.floor(Math.random() * maxNumber) + 1;
        const num1 = Math.floor(Math.random() * (maxNumber - num2 + 1)) + num2;

        numbers = [num1, num2];
        result = num1 - num2;
        text = `${num1} - ${num2}`;

    } else if (numOperands === 3) {
        const limit = Math.floor(maxNumber / 2) || maxNumber;
        const N2 = Math.floor(Math.random() * limit) + 1;
        const N3 = Math.floor(Math.random() * limit) + 1;
        const N_sum = N2 + N3;

        let N1;
        if (maxNumber <= N_sum) {
            N1 = N_sum;
        } else {
            N1 = Math.floor(Math.random() * (maxNumber - N_sum + 1)) + N_sum;
        }

        numbers = [N1, N2, N3];
        result = N1 - N2 - N3;
        text = `${N1} - ${N2} - ${N3}`;
    } else {
        let resultCalc = 0;
        let textCalc = '';
        for (let i = 0; i < numOperands; i++) {
            const num = Math.floor(Math.random() * maxNumber) + 1;
            numbers.push(num);
            if (i === 0) {
                resultCalc = num;
                textCalc += num;
            } else {
                resultCalc -= num;
                textCalc += ' - ' + num;
            }
        }
        
        if (resultCalc < 0) {
             numbers.sort((a, b) => b - a);
             result = numbers[0];
             text = numbers[0].toString();
             for (let i = 1; i < numbers.length; i++) {
                 result -= numbers[i];
                 text += ' - ' + numbers[i];
             }
        } else {
            result = resultCalc;
            text = textCalc;
        }
    }

    return {
        numbers: numbers,
        answer: result,
        text: text + ' = ?',
        operation: 'subtraction'
    };
}

// FUNCTION: Generate multiplication problem
function generateMultiplicationProblem(maxNumber) {
    const adjustedMax = Math.min(maxNumber, 20);
    const num1 = Math.floor(Math.random() * adjustedMax) + 1;
    const num2 = Math.floor(Math.random() * adjustedMax) + 1;
    
    return {
        numbers: [num1, num2],
        answer: num1 * num2,
        text: `${num1} × ${num2} = ?`,
        operation: 'multiplication'
    };
}

// FUNCTION: Generate division problem
function generateDivisionProblem(maxNumber) {
    const adjustedMax = Math.min(maxNumber, 50);
    const divisor = Math.floor(Math.random() * 10) + 1;
    const quotient = Math.floor(Math.random() * adjustedMax) + 1;
    const dividend = divisor * quotient;
    
    return {
        numbers: [dividend, divisor],
        answer: quotient,
        text: `${dividend} ÷ ${divisor} = ?`,
        operation: 'division'
    };
}

// FUNCTION: Generate mixed addition and subtraction problem
function generateMixedAdditionSubtractionProblem(maxNumber) {
    let result;
    let text;
    let numbers;

    if (Math.random() > 0.5) {
        num1 = Math.floor(Math.random() * (maxNumber - 10)) + 10; 
        num2 = Math.floor(Math.random() * (num1 / 2)) + 1;
        num3 = Math.floor(Math.random() * (num1 + num2 - 1)) + 1;
        
        result = num1 + num2 - num3;
        text = `${num1} + ${num2} - ${num3}`;
        numbers = [num1, num2, num3];
        
    } else {
        num1 = Math.floor(Math.random() * maxNumber) + 1;
        num2 = Math.floor(Math.random() * num1) + 1; 
        num3 = Math.floor(Math.random() * maxNumber) + 1; 
        
        result = num1 - num2 + num3;
        text = `${num1} - ${num2} + ${num3}`;
        numbers = [num1, num2, num3];
    }

    return {
        numbers: numbers,
        answer: result,
        text: text + ' = ?',
        operation: 'mixed-addition-subtraction'
    };
}

// FUNCTION: Generate all mixed operations problem
function generateAllMixedOperationsProblem(maxNumber) {
    let finalResult = -1;
    let problemDetails;

    while (finalResult < 0 || !Number.isInteger(finalResult)) {
        const operandCap = Math.min(maxNumber, 20);
        let N1 = Math.floor(Math.random() * operandCap) + 1;
        let N2 = Math.floor(Math.random() * operandCap) + 1;
        let N3 = Math.floor(Math.random() * operandCap) + 1;
        let N4 = Math.floor(Math.random() * operandCap) + 1;
        let N5 = Math.floor(Math.random() * operandCap) + 1;
        
        const numbers = [N1, N2, N3, N4, N5];
        let operators = ['+', '-', '×', '÷'];
        
        for (let i = operators.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [operators[i], operators[j]] = [operators[j], operators[i]];
        }
        
        let tokens = [numbers[0]];
        for (let i = 0; i < 4; i++) {
            tokens.push(operators[i]);
            tokens.push(numbers[i + 1]);
        }
        
        let hasNonIntegerDivision = false;
        for (let i = 1; i < tokens.length; i += 2) {
            if (tokens[i] === '÷' && tokens[i-1] % tokens[i+1] !== 0) {
                hasNonIntegerDivision = true;
                break;
            }
        }
        
        if (hasNonIntegerDivision) {
            continue;
        }

        let calcTokens = [...tokens];

        for (let i = 1; i < calcTokens.length; i += 2) {
            const op = calcTokens[i];
            if (op === '×' || op === '÷') {
                const N_left = calcTokens[i - 1];
                const N_right = calcTokens[i + 1];
                let partialResult;
                
                if (op === '×') {
                    partialResult = N_left * N_right;
                } else {
                    partialResult = N_left / N_right;
                }
                
                calcTokens.splice(i - 1, 3, partialResult);
                i = -1;
            }
        }
        
        finalResult = calcTokens[0];
        for (let i = 1; i < calcTokens.length; i += 2) {
            const op = calcTokens[i];
            const N = calcTokens[i + 1];
            
            if (op === '+') {
                finalResult += N;
            } else if (op === '-') {
                finalResult -= N;
            }
        }
        
        if (finalResult >= 0 && Number.isInteger(finalResult)) {
            let problemText = `${numbers[0]}`;
            for (let i = 0; i < 4; i++) {
                problemText += ` ${operators[i]} ${numbers[i + 1]}`;
            }
            
            problemDetails = {
                answer: finalResult,
                text: problemText + ' = ?',
                operation: 'all-mixed-operations'
            };
            break;
        }
    }

    return problemDetails;
}

// FUNCTION: Check player's answer
function checkAnswer(player) {
    if (!gameState.gameActive) return;
    
    const playerState = player === 1 ? gameState.player1 : gameState.player2;
    const opponentState = player === 1 ? gameState.player2 : gameState.player1;
    const answerDisplay = player === 1 ? elements.answerP1 : elements.answerP2;
    
    const playerAnswer = parseInt(playerState.answer);
    
    if (isNaN(playerAnswer)) {
        answerDisplay.style.borderColor = '#e74c3c';
        elements.statusMessage.textContent = 'Masukkan jawaban yang valid!';
        setTimeout(() => {
            answerDisplay.style.borderColor = '#bdc3c7';
            elements.statusMessage.textContent = 'Jawab soal dengan benar untuk menarik tambang!';
        }, 1000);
        return;
    }
    
    playerState.hasAnswered = true;
    
    if (playerAnswer === playerState.problem.answer) {
        showFeedback(player, true);
        answerDisplay.style.borderColor = '#27ae60';
        
        playerState.score++;
        
        if (player === 1) {
            elements.arenaScoreP1.textContent = playerState.score;
            gameState.ropePosition -= 5;
        } else {
            elements.arenaScoreP2.textContent = playerState.score;
            gameState.ropePosition += 5;
        }
        
    } else {
        showFeedback(player, false);
        answerDisplay.style.borderColor = '#e74c3c';
        
        opponentState.score++;
        
        if (player === 1) {
            elements.arenaScoreP2.textContent = opponentState.score;
            gameState.ropePosition += 5;
        } else {
            elements.arenaScoreP1.textContent = opponentState.score;
            gameState.ropePosition -= 5;
        }
    }
    
    updateRopePosition();
    checkVictory();
    
    setTimeout(() => {
        if (gameState.gameActive) {
            generateNewProblemForPlayer(player);
            answerDisplay.style.borderColor = '#bdc3c7';
        }
    }, 800);
}

// FUNCTION: Update rope position
function updateRopePosition() {
    gameState.ropePosition = Math.max(-gameState.maxRopeMove, 
        Math.min(gameState.maxRopeMove, gameState.ropePosition));
    
    elements.tugIllustration.style.transform = `translate(calc(-50% + ${gameState.ropePosition}px), -50%)`;
}

// FUNCTION: Check for victory
function checkVictory() {
    const scoreDiff = Math.abs(gameState.player1.score - gameState.player2.score);
    if (scoreDiff >= 10) {
        const winner = gameState.player1.score > gameState.player2.score ? 1 : 2;
        endGame(winner);
        return;
    }
    
    if (gameState.ropePosition <= -gameState.maxRopeMove) {
        endGame(1);
    } else if (gameState.ropePosition >= gameState.maxRopeMove) {
        endGame(2);
    }
}

// FUNCTION: End the game
function endGame(winner) {
    gameState.gameActive = false;
    
    // Hentikan timer dengan benar
    if (gameState.gameTimer) {
        clearInterval(gameState.gameTimer);
        gameState.gameTimer = null;
    }
    
    if (winner === 1) {
        elements.statusMessage.textContent = 'Pemain 1 Menang!';
        elements.statusMessage.style.color = '#3498db';
    } else {
        elements.statusMessage.textContent = 'Pemain 2 Menang!';
        elements.statusMessage.style.color = '#e74c3c';
    }
    
    // Gunakan timeout yang lebih panjang untuk memastikan state sudah reset
    setTimeout(() => {
        showVictoryModal(winner);
    }, 1500);
}

// FUNCTION: Reset the game - VERSI LENGKAP
function resetGame() {
    console.log('Resetting game...');
    
    // Hentikan timer game
    if (gameState.gameTimer) {
        clearInterval(gameState.gameTimer);
        gameState.gameTimer = null;
    }
    
    // Reset semua state
    gameState.player1.score = 0;
    gameState.player2.score = 0;
    gameState.player1.answer = '';
    gameState.player2.answer = '';
    gameState.player1.hasAnswered = false;
    gameState.player2.hasAnswered = false;
    gameState.ropePosition = 0;
    gameState.gameActive = false;
    
    // Reset UI
    elements.arenaScoreP1.textContent = '0';
    elements.arenaScoreP2.textContent = '0';
    elements.answerP1.textContent = '';
    elements.answerP2.textContent = '';
    elements.statusMessage.textContent = 'Jawab soal dengan benar untuk menarik tambang!';
    elements.statusMessage.style.color = '#2c3e50';
    
    // Reset border colors
    elements.answerP1.style.borderColor = '#bdc3c7';
    elements.answerP2.style.borderColor = '#bdc3c7';
    
    // Reset timer display
    elements.gameTimer.textContent = '05:00';
    elements.gameTimer.classList.remove('timer-warning');

    // Clear feedback
    elements.feedbackP1.textContent = '';
    elements.feedbackP2.textContent = '';
    
    // Sembunyikan victory modal jika aktif
    hideModal(elements.victoryModal);
    
    // Mulai game baru
    initializeGame();
}

// FUNCTION: Debug game state - VERSI LENGKAP
function debugGameState() {
    console.log('=== GAME STATE DEBUG ===');
    console.log('Game Active:', gameState.gameActive);
    console.log('Game Container Visible:', !elements.gameContainer.classList.contains('hidden'));
    console.log('Game Container Display:', window.getComputedStyle(elements.gameContainer).display);
    console.log('Player 1 Score:', gameState.player1.score);
    console.log('Player 2 Score:', gameState.player2.score);
    console.log('Rope Position:', gameState.ropePosition);
    console.log('Time Left:', gameState.timeLeft);
    console.log('Game Timer:', gameState.gameTimer);
    
    // Check if keypads are generated
    const keypad1Buttons = elements.keypadP1.querySelectorAll('button');
    const keypad2Buttons = elements.keypadP2.querySelectorAll('button');
    console.log('Keypad 1 buttons:', keypad1Buttons.length);
    console.log('Keypad 2 buttons:', keypad2Buttons.length);
    
    // Check if problems are generated
    console.log('Player 1 Problem:', elements.problemP1.textContent);
    console.log('Player 2 Problem:', elements.problemP2.textContent);
}

// ==================== 
// UI UTILITY FUNCTIONS
// ====================

// FUNCTION: Display temporary feedback
function showFeedback(player, isCorrect) {
    const feedbackElement = player === 1 ? elements.feedbackP1 : elements.feedbackP2;
    
    if (isCorrect) {
        feedbackElement.textContent = 'BENAR';
        feedbackElement.classList.add('correct');
        feedbackElement.classList.remove('wrong');
    } else {
        feedbackElement.textContent = 'SALAH';
        feedbackElement.classList.add('wrong');
        feedbackElement.classList.remove('correct');
    }
    
    feedbackElement.classList.add('active');
    
    setTimeout(() => {
        feedbackElement.classList.remove('active', 'correct', 'wrong');
        feedbackElement.textContent = '';
    }, 800);
}

// ==================== 
// AUDIO UTILITY FUNCTION
// ====================

function playSound(audioElement) {
    if (audioElement) {
        const soundClone = audioElement.cloneNode(true);
        soundClone.currentTime = 0;
        soundClone.play().catch(e => {
            console.log("Gagal memutar audio:", e);
        });
    }
}

// FUNCTION: Share game
function shareGame() {
    if (navigator.share) {
        navigator.share({
            title: 'Tarik Tambang Matematika',
            text: 'Mainkan game matematika seru ini!',
            url: window.location.href
        })
        .catch(error => console.log('Error sharing:', error));
    } else {
        alert('Salin tautan ini untuk berbagi: ' + window.location.href);
    }
}
