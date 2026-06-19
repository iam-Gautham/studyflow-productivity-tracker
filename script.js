// ======================
// TASK DATA
// ======================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let time = 1500;
let interval;
let chart;

// ======================
// TASK MANAGEMENT
// ======================

function renderTasks() {

    const taskList = document.getElementById("taskList");

    if (!taskList) return;

    taskList.innerHTML = "";
    if(tasks.length === 0){

    taskList.innerHTML =
        "<li>No tasks added yet.</li>";

    updateDashboard();
    updateChart();

    return;
}

    tasks.forEach((task, index) => {

        const li = document.createElement("li");

        li.className = task.completed ? "completed" : "";

        li.innerHTML = `
            ${task.name}
            <button onclick="completeTask(${index})">✔</button>
            <button onclick="deleteTask(${index})">Delete</button>
        `;

        taskList.appendChild(li);
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));

    updateDashboard();
    updateChart();
}

function addTask() {

    const input = document.getElementById("taskInput");

    if (!input) return;

    if (input.value.trim() !== "") {

        tasks.push({
            name: input.value,
            completed: false
        });

        input.value = "";

        renderTasks();
    }
}

function completeTask(index) {

    tasks[index].completed = !tasks[index].completed;

    renderTasks();
}

function deleteTask(index) {

    tasks.splice(index, 1);

    renderTasks();
}

// ======================
// DASHBOARD
// ======================

function updateDashboard() {

    const total = tasks.length;

    const completed =
        tasks.filter(task => task.completed).length;

    const pending = total - completed;

    const rate =
        total === 0
            ? 0
            : Math.round((completed / total) * 100);

    document.getElementById("totalTasks").innerText = total;
    document.getElementById("completedTasks").innerText = completed;
    document.getElementById("pendingTasks").innerText = pending;
    document.getElementById("completionRate").innerText = rate;
}

// ======================
// DAILY GOAL
// ======================

function saveGoal() {

    const goal =
        document.getElementById("goalInput").value;

    localStorage.setItem("goal", goal);

    document.getElementById("goalDisplay").innerText =
        "Daily Goal: " + goal + " hours";
}

function loadGoal() {

    const savedGoal =
        localStorage.getItem("goal");

    if (savedGoal) {

        document.getElementById("goalDisplay").innerText =
            "Daily Goal: " + savedGoal + " hours";
    }
}

// ======================
// POMODORO TIMER
// ======================

function startTimer() {

    clearInterval(interval);

    interval = setInterval(() => {

        let minutes = Math.floor(time / 60);
        let seconds = time % 60;

        document.getElementById("timer").innerText =
            `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

        if (time <= 0) {

            clearInterval(interval);

            alert("Pomodoro Session Completed!");

            increaseStreak();
        }

        time--;

    }, 1000);
}

function resetTimer() {

    clearInterval(interval);

    time = 1500;

    document.getElementById("timer").innerText =
        "25:00";
}

// ======================
// STUDY STREAK
// ======================

function increaseStreak() {

    let streak =
        parseInt(localStorage.getItem("streak")) || 0;

    streak++;

    localStorage.setItem("streak", streak);

    document.getElementById("streak").innerText =
        streak + " Days";

    updateFocusScore();
}

function loadStreak() {

    document.getElementById("streak").innerText =
        (localStorage.getItem("streak") || 0) +
        " Days";
}

// ======================
// DARK MODE
// ======================

function toggleTheme() {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
    }
    else {
        localStorage.setItem("theme", "light");
    }
}

function loadTheme() {

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }
}

// ======================
// CHART
// ======================

function updateChart() {

    const canvas =
        document.getElementById("progressChart");

    if (!canvas) return;

    const completed =
        tasks.filter(task => task.completed).length;

    const pending =
        tasks.length - completed;

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(canvas, {
        type: "doughnut",
        data: {
            labels: ["Completed", "Pending"],
            datasets: [{
    data: [completed, pending],
    backgroundColor: [
        "#4CAF50",
        "#FF6B6B"
    ]
}]
        }
    });

    updateFocusScore();
}

// ======================
// FOCUS SCORE
// ======================

function updateFocusScore() {

    const completed =
        tasks.filter(task => task.completed).length;

    const total = tasks.length;

    const completionRate =
        total === 0
            ? 0
            : Math.round((completed / total) * 100);

    const streak =
        parseInt(localStorage.getItem("streak")) || 0;

    let score =
    Math.round(
        (completionRate * 0.8) +
        (streak * 2)
    );

    if (score > 100) {
        score = 100;
    }

    document.getElementById("focusScore").innerText =
        score;
}

// ======================
// INITIAL LOAD
// ======================

loadGoal();
loadStreak();
loadTheme();

renderTasks();
updateDashboard();
updateChart();
updateFocusScore();