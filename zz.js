

var musiques=['2_5359413840108851622.mp3', 'CYBERPUNK_2077_SOUNDTRACK_-_WHO_S_READY_FOR_TOMORROW_by_Rat_Boy___IBDY__Official_Video_(128k).m4a',
  'OVERDOSE_1(128k).m4a','LE_BIG_99(128k).m4a', 'Jujutsu_Kaisen_Season_2_-_Ending_FULL__AKARI__by_Soushi_Sakiyama__Lyrics_(128k).m4a',
 'TVアニメ『東京リベンジャーズ』聖夜決戦編_ノンクレジットOP【Official髭男dism「ホワイトノイズ」】(128k).m4a']
 var audio = new Audio();
 var currentTrackIndex = 0;
 var mmm=false;
 
function start() {
    if(!mmm)return;
    document.getElementById('mmm').textContent='changer de music';
    var musiqueAleatoire = musiques[Math.floor(Math.random() * musiques.length)];
    audio.src = musiqueAleatoire;
    audio.play();
}



function pause() {
    if(!mmm)return;
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
}

audio.addEventListener('ended', function() {
    start();
});
document.getElementById('mmm').addEventListener('click', function () {
    mmm=true;
    start();
})

var score = 0;
var wrongAttempts = 0;
var currentCalculation;
var timeLeft = 180; // Temps initial en secondes (3 minutes)
var resetTime = 180; // Temps de réinitialisation initial en secondes (3 minutes)
var reductionTime = 30; // Temps de réduction après une mauvaise réponse en secondes
var difficulty = 1; // Niveau de difficulté initial

function increaseDifficulty() {
    difficulty++;
}

function generateCalculation() {
    var maxOperand = 10 + difficulty * 5; // Augmenter le maximum en fonction du niveau de difficulté
    var operand1 = Math.floor(Math.random() * maxOperand) + 1;
    var operand2 = Math.floor(Math.random() * maxOperand) + 1;
    var operator = ['+', '-', '*', '/'][Math.floor(Math.random() * 4)];
    var result;

    switch (operator) {
        case '+':
            result = operand1 + operand2;
            break;
        case '-':
            result = operand1 - operand2;
            break;
        case '*':
            result = operand1 * operand2;
            break;
        case '/':
            result = operand1 / operand2;
            // Arrondir le résultat à deux décimales
            result = Math.round(result * 100) / 100;
            break;
    }

    return { question: operand1 + ' ' + operator + ' ' + operand2 + ' = ?', answer: result };
}

function displayCalculation() {
    currentCalculation = generateCalculation();
    document.getElementById('calcul').textContent = currentCalculation.question;

    var options = document.getElementById('options').getElementsByTagName('button');
    var correctAnswerIndex = Math.floor(Math.random() * 3);
    options[correctAnswerIndex].textContent = currentCalculation.answer;

    for (var i = 0; i < 3; i++) {
        if (i !== correctAnswerIndex) {
            var incorrectAnswer = currentCalculation.answer;
            while (incorrectAnswer === currentCalculation.answer) {
                // Générer un nombre aléatoire plus grand ou plus petit que la réponse correcte
                incorrectAnswer = currentCalculation.answer + Math.floor(Math.random() * 10 + 1) * (Math.random() < 0.5 ? -1 : 1);
            }
            options[i].textContent = incorrectAnswer;
        }
    }
}

function checkAnswer(selectedIndex) {
    var options = document.getElementById('options').getElementsByTagName('button');
    var selectedAnswer = parseFloat(options[selectedIndex].textContent);

    if (selectedAnswer === currentCalculation.answer) {
        score++;
        wrongAttempts = 0;
        options[selectedIndex].classList.add('correct');

        // Réinitialiser le temps à la valeur actuelle du temps restant
        timeLeft = resetTime;
    } else {
        wrongAttempts++;
        // Réduire le temps en fonction du nombre de mauvaises réponses
        timeLeft = Math.max(timeLeft - reductionTime, 30); // Réduire de 30 secondes, jusqu'à un minimum de 30 secondes
        resetTime = timeLeft; // Réinitialiser le temps de réinitialisation
        options[selectedIndex].classList.add('incorrect');

        // Vérifier si le temps restant est inférieur ou égal à 30 secondes
        if (timeLeft <= 30) {
            alert('Temps écoulé ! Votre score est de ' + score);
            resetGame();
            return; // Arrêter l'exécution de la fonction
        }
    }

    setTimeout(function () {
        resetOptions(options);
        displayCalculation();
    }, 1000);
}

function resetOptions(options) {
    for (var i = 0; i < options.length; i++) {
        options[i].classList.remove('correct', 'incorrect');
    }
}

function resetGame() {
    score = 0;
    wrongAttempts = 0;
    timeLeft = 180; // Réinitialiser le temps à 3min
    resetTime = 180; // Réinitialiser le temps de réinitialisation à 3min
    difficulty = 1; // Réinitialiser le niveau de difficulté
    displayCalculation();
    updateTimerDisplay();
}

function updateTimerDisplay() {
    var minutes = Math.floor(timeLeft / 60);
    var seconds = timeLeft % 60;
    document.getElementById('timer').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    if (timeLeft <= 0) {
        alert('Temps écoulé ! Votre score est de ' + score);
        resetGame();
    }
}

// Initialiser le jeu
displayCalculation();

// Mettre à jour le moniteur de temps toutes les secondes
var timerInterval = setInterval(function () {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        alert('Temps écoulé ! Votre score est de ' + score);
        resetGame();
    }
}, 1000);
