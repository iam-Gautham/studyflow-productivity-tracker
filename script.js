let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
    const taskList = document.getElementById("taskList");

    taskList.innerHTML = "";

    tasks.forEach((task,index)=>{

        const li=document.createElement("li");

        li.innerHTML=`
            ${task}
            <button onclick="deleteTask(${index})">
                Delete
            </button>
        `;

        taskList.appendChild(li);
    });

    localStorage.setItem("tasks",JSON.stringify(tasks));
}

function addTask(){

    const input=document.getElementById("taskInput");

    if(input.value.trim()!==""){

        tasks.push(input.value);

        input.value="";

        renderTasks();
    }
}

function deleteTask(index){

    tasks.splice(index,1);

    renderTasks();
}

renderTasks();

function saveGoal(){

    const goal=document.getElementById("goalInput").value;

    localStorage.setItem("goal",goal);

    document.getElementById("goalDisplay").innerText=
        "Daily Goal: "+goal+" hours";
}

const savedGoal=localStorage.getItem("goal");

if(savedGoal){

    document.getElementById("goalDisplay").innerText=
        "Daily Goal: "+savedGoal+" hours";
}

let time=1500;
let interval;

function startTimer(){

    clearInterval(interval);

    interval=setInterval(()=>{

        let minutes=Math.floor(time/60);
        let seconds=time%60;

        document.getElementById("timer").innerText=
        `${minutes}:${seconds<10?'0':''}${seconds}`;

        if(time<=0){

            clearInterval(interval);

            alert("Pomodoro Session Completed!");

            increaseStreak();
        }

        time--;

    },1000);
}

function resetTimer(){

    clearInterval(interval);

    time=1500;

    document.getElementById("timer").innerText="25:00";
}

function increaseStreak(){

    let streak=localStorage.getItem("streak") || 0;

    streak++;

    localStorage.setItem("streak",streak);

    document.getElementById("streak").innerText=
    streak+" Days";
}

document.getElementById("streak").innerText=
(localStorage.getItem("streak") || 0)+" Days";