const defaultTopics = [
    "Filsafat",
    "AI",
    "Globalisasi",
    "Politik dan Kemanusiaan",
    "Mental Health",
    "Pendidikan"
];

let customTopics = JSON.parse(localStorage.getItem('customTopics')) || [];
let currentMode = 'default';
let timerInterval = null;
let maxDuration = 60; 
let timeLeft = 60;
let isTimerRunning = false;

function updateCustomList() {
    const list = document.getElementById('topic-list');
    list.innerHTML = '';
    customTopics.forEach((topic, index) => {
        list.innerHTML += `<li><span>${topic}</span> <button onclick="deleteTopic(${index})">REMOVE</button></li>`;
    });
}
updateCustomList();

function switchSource() {
    const mode = document.querySelector('input[name="source"]:checked').value;
    currentMode = mode;
    const inputSection = document.getElementById('custom-input-section');
    if (mode === 'custom') {
        inputSection.classList.remove('hidden');
    } else {
        inputSection.classList.add('hidden');
    }
}

function addCustomTopic() {
    const input = document.getElementById('new-topic');
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
    const inputDuration = parseInt(document.getElementById('custom-duration').value);
    if (!isNaN(inputDuration) && inputDuration >= 5) {
        maxDuration = inputDuration;
        if (!isTimerRunning) {
            timeLeft = maxDuration;
            displayTimer();
        }
    }
}

function spinTopic() {
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
    container.style.transition = 'none'; 
    container.style.transform = 'translateY(0)';

    let htmlContent = '';
    const spinCount = 15; 
    let finalTopic = '';

    for (let i = 0; i < spinCount; i++) {
        const randomTopic = pool[Math.floor(Math.random() * pool.length)];
        htmlContent += `<div class="topic-row">${randomTopic.toUpperCase()}</div>`;
        if (i === spinCount - 1) finalTopic = randomTopic;
    }
    container.innerHTML = htmlContent;

    setTimeout(() => {
        container.style.transition = 'transform 3s cubic-bezier(0.15, 0.85, 0.35, 1)';
        const rowHeight = 108;  /* DISESUAIKAN: Mengikuti tinggi baris bingkai baru */
        const offset = -(rowHeight * (spinCount - 1));
        container.style.transform = `translateY(${offset}px)`;
    }, 50);

    setTimeout(() => {
        document.getElementById('timer-btn').disabled = false;
        resetTimer();
    }, 3050);
}

function toggleTimer() {
    const btn = document.getElementById('timer-btn');
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
    document.getElementById('timer-btn').innerText = "START TIMER";
    isTimerRunning = false;
}

function displayTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').innerText = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
