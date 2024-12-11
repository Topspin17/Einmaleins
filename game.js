// Canvas-Einstellungen
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const midX = canvas.width / 2;

// Globale Variablen
let tasksLeft = generateTasks(3, 100, 0, midX - 50);
let answersLeft = generateAnswers(tasksLeft, 0, midX - 50);
let tasksRight = generateTasks(3, 600, midX + 50, canvas.width - 50);
let answersRight = generateAnswers(tasksRight, midX + 50, canvas.width - 50);

let scoreLeft = 0;
let scoreRight = 0;
let selectedTaskLeft = null; // Ausgewählte Aufgabe für die linke Seite
let selectedTaskRight = null; // Ausgewählte Aufgabe für die rechte Seite

// Punktestand aktualisieren
function updateScores() {
    document.getElementById('leftScore').innerText = `Spieler Links: ${scoreLeft}`;
    document.getElementById('rightScore').innerText = `Spieler Rechts: ${scoreRight}`;
}

// Aufgaben und Lösungen generieren
function generateTasks(count, y, minX, maxX) {
    const tasks = [];
    for (let i = 0; i < count; i++) {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        tasks.push({
            x: Math.random() * (maxX - minX) + minX,
            y: y + i * 80,
            value: `${a} × ${b}`,
            answer: a * b,
            type: 'task'
        });
    }
    return tasks;
}

function generateAnswers(tasks, minX, maxX) {
    const answers = tasks.map(task => ({
        x: Math.random() * (maxX - minX) + minX,
        y: task.y + Math.random() * 50 - 25,
        value: task.answer,
        type: 'answer'
    }));
    return answers;
}

// Elemente zeichnen
function drawItems(items, color) {
    ctx.fillStyle = color;
    items.forEach(item => {
        ctx.beginPath();
        ctx.arc(item.x, item.y, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.fillText(item.value, item.x - 20, item.y + 5);
        ctx.fillStyle = color;
    });
}

// Elemente bewegen
function moveItems(items) {
    items.forEach(item => {
        item.y += 1; // Geschwindigkeit
        if (item.y > canvas.height) {
            item.y = 0; // Reset bei unterem Rand
        }
    });
}

// Klickverarbeitung
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Linke Seite
    if (x < midX) {
        const clickedTask = tasksLeft.find(task => 
            Math.abs(task.x - x) < 50 && Math.abs(task.y - y) < 30 && task.type === 'task');
        const clickedAnswer = answersLeft.find(answer => 
            Math.abs(answer.x - x) < 50 && Math.abs(answer.y - y) < 30 && answer.type === 'answer');

        // Aufgabe auswählen
        if (clickedTask) {
            selectedTaskLeft = clickedTask;
        } else if (clickedAnswer && selectedTaskLeft) {
            // Aufgabe lösen
            if (clickedAnswer.value === selectedTaskLeft.answer) {
                scoreLeft++;
                tasksLeft = tasksLeft.filter(t => t !== selectedTaskLeft);
                answersLeft = answersLeft.filter(a => a !== clickedAnswer);

                // Neue Aufgabe und Lösung hinzufügen
                tasksLeft.push(...generateTasks(1, 100, 0, midX - 50));
                answersLeft.push(...generateAnswers(tasksLeft.slice(-1), 0, midX - 50));
            }
            selectedTaskLeft = null; // Auswahl zurücksetzen
        }
    }

    // Rechte Seite
    if (x > midX) {
        const clickedTask = tasksRight.find(task => 
            Math.abs(task.x - x) < 50 && Math.abs(task.y - y) < 30 && task.type === 'task');
        const clickedAnswer = answersRight.find(answer => 
            Math.abs(answer.x - x) < 50 && Math.abs(answer.y - y) < 30 && answer.type === 'answer');

        // Aufgabe auswählen
        if (clickedTask) {
            selectedTaskRight = clickedTask;
        } else if (clickedAnswer && selectedTaskRight) {
            // Aufgabe lösen
            if (clickedAnswer.value === selectedTaskRight.answer) {
                scoreRight++;
                tasksRight = tasksRight.filter(t => t !== selectedTaskRight);
                answersRight = answersRight.filter(a => a !== clickedAnswer);

                // Neue Aufgabe und Lösung hinzufügen
                tasksRight.push(...generateTasks(1, 600, midX + 50, canvas.width - 50));
                answersRight.push(...generateAnswers(tasksRight.slice(-1), midX + 50, canvas.width - 50));
            }
            selectedTaskRight = null; // Auswahl zurücksetzen
        }
    }

    updateScores();
});

// Spiel-Schleife
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawItems(tasksLeft, "blue");
    drawItems(answersLeft, "lightblue");
    drawItems(tasksRight, "green");
    drawItems(answersRight, "lightgreen");
    moveItems(tasksLeft);
    moveItems(answersLeft);
    moveItems(tasksRight);
    moveItems(answersRight);
    requestAnimationFrame(gameLoop);
}

// Spiel starten
updateScores();
gameLoop();
