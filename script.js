
const defaultTopics = [
    "Globalisasi",
    "Education",
    "Filsafat",
    "Technology",
    "Health",
    "Science"
];


let customTopics = JSON.parse(localStorage.getItem('customTopics')) || [];


let timerInterval = null;
let maxDuration = 60; 
let timeLeft = 60;
let isTimerRunning = false;


function updateCustomList() {
    const list = document.getElementById('custom-topics-list');
    if (!list) return;
    
    list.innerHTML = '';
    customTopics.forEach((topic, index) => {
        list.innerHTML += `
            <li>
                <span>${topic}</span> 
                <button onclick="deleteTopic(${index})">REMOVE</button>
            </li>`;
    });
}

function addCustomTopic() {
    const input = document.getElementById('custom-topic-field');
    if (!input) return;
    
    const value = input.value.trim();
    if (value) {
        customTopics.push(value);
        localStorage.setItem('customTopics', JSON.stringify(customTopics));
        input.value = ''; 
        updateCustomList();
    }
}

function deleteTopic(index) {
    customTopics.splice(index, 1);
    localStorage.setItem('customTopics', JSON.stringify(customTopics));
    updateCustomList();
}


function changeDuration() {
    const inputDuration = parseInt(document.getElementById('duration-input').value);
    if (!isNaN(inputDuration) && inputDuration >= 5) {
        maxDuration = inputDuration;
        if (!isTimerRunning) {
            timeLeft = maxDuration;
            displayTimer();
        }
    }
}


function spinTopic() {
    
    const checkedRadio = document.querySelector('input[name="topicMode"]:checked');
    const currentMode = checkedRadio ? checkedRadio.value : 'default';

    
    const pool = currentMode === 'default' ? defaultTopics : customTopics;
    
    
    if (currentMode === 'custom' && pool.length < 5) {
        alert(`Gagal memutar! Kamu wajib memasukkan minimal 5 topik kustom agar tantangan bervariasi. (Topik saat ini: ${pool.length}/5)`);
        return;
    }
    
    if (pool.length === 0) {
        alert("Daftar topik kosong. Masukkan topik terlebih dahulu.");
        return;
    }

    const container = document.getElementById('topic-container');
    if (!container) return;

    container.style.transition = 'none'; 
    container.style.transform = 'translateY(0)';

    let htmlContent = '';
    const spinCount = 15; 

    for (let i = 0; i < spinCount; i++) {
        const randomTopic = pool[Math.floor(Math.random() * pool.length)];
        htmlContent += `<div class="topic-row">${randomTopic.toUpperCase()}</div>`;
    }
    container.innerHTML = htmlContent;

    
    setTimeout(() => {
        container.style.transition = 'transform 3s cubic-bezier(0.15, 0.85, 0.35, 1)';
        const rowHeight = window.innerWidth >= 768 ? 108 : 88; 
        const offset = -(rowHeight * (spinCount - 1));
        container.style.transform = `translateY(${offset}px)`;
    }, 50);

    setTimeout(() => {
        const timerBtn = document.getElementById('timer-btn');
        if (timerBtn) timerBtn.disabled = false;
        resetTimer();
    }, 3050);
}


function toggleTimer() {
    const btn = document.getElementById('timer-btn');
    if (!btn) return;

    if (isTimerRunning) {
        clearInterval(timerInterval);
        btn.innerText = "START TIMER";
        isTimerRunning = false;
    } else {
        isTimerRunning = true;
        btn.innerText = "PAUSE";
        timerInterval = setInterval(() => {
            timeLeft--;
            displayTimer();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                document.getElementById('timer').innerText = "TIME OUT";
                btn.innerText = "START TIMER";
                btn.disabled = true;
                isTimerRunning = false;
            }
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = maxDuration; 
    displayTimer();
    const btn = document.getElementById('timer-btn');
    if (btn) btn.innerText = "START TIMER";
    isTimerRunning = false;
}

function displayTimer() {
    const timerDisplay = document.getElementById('timer');
    if (!timerDisplay) return;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.innerText = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}


document.addEventListener('DOMContentLoaded', () => {
   
    updateCustomList();

    
    const addBtn = document.getElementById('add-topic-btn');
    if (addBtn) {
        addBtn.addEventListener('click', addCustomTopic);
    }

    
    const durationInput = document.getElementById('duration-input');
    if (durationInput) {
        durationInput.addEventListener('change', changeDuration);
    }
});
