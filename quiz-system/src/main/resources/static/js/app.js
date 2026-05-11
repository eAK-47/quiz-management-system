/* ============================================================
   app.js – Final Full-Stack Bridge for Group A8
   Amrita Online Quiz Management System (2026)
   ============================================================ */

const API_BASE_URL = window.location.origin + '/api';
/* ─────────────────────────────────────────
   1. NAVIGATION & SESSION UTILS
   ───────────────────────────────────────── */

function goTo(page) {
    window.location.href = "/";
}

/**
 * Saves user details after a successful backend authentication.
 */
function setSession(role, name, id) {
    sessionStorage.setItem(`${role}LoggedIn`, 'true');
    sessionStorage.setItem(`${role}Name`, name);
    sessionStorage.setItem(`${role}Id`, id);
}

function logout() {
    sessionStorage.clear();
    goTo('index.html');
}

/* ─────────────────────────────────────────
   2. AUTHENTICATION (Connects to AuthController)
   ───────────────────────────────────────── */

async function studentLogin(event) {
    event.preventDefault();
    const id = document.getElementById('student-id').value.trim();
    const name = document.getElementById('student-name').value.trim();
    const password = document.getElementById('student-password').value; // Requires HTML update
    const err = document.getElementById('login-error');

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login/student`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, password })
        });

        if (response.ok) {
            const userData = await response.json();
            setSession('student', userData.name, userData.rollNo);
            goTo('Student.html');
        } else {
            err.style.display = 'block';
        }
    } catch (e) {
        console.error("Backend offline:", e);
        document.getElementById('no-quiz-msg').style.display = 'block';
    }
}

async function teacherLogin(event) {
    event.preventDefault();
    const id = document.getElementById('teacher-id').value.trim();
    const password = document.getElementById('teacher-password').value;
    const err = document.getElementById('login-error');

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login/teacher`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, password })
        });

        if (response.ok) {
            const userData = await response.json();
            setSession('teacher', userData.name, userData.tchrID);
            goTo('Teacher.html');
        } else {
            err.style.display = 'block';
        }
    } catch (e) {
        alert("Backend server connection failed.");
    }
}

/* ─────────────────────────────────────────
   3. TEACHER: QUIZ CREATION (Connects to QuizController)
   ───────────────────────────────────────── */

let questionCount = 0;

function addQuestion() {
    questionCount++;
    const n = questionCount;
    const wrapper = document.getElementById('questions-wrapper');
    const cardNum = document.querySelectorAll('.quiz-card').length + 1;

    const card = document.createElement('div');
    card.className = 'quiz-card';
    card.id = `question-card-${n}`;
    card.dataset.qnum = n;

    card.innerHTML = `
        <div class="card-header">
            <h3>Question ${cardNum}</h3>
            <button type="button" class="btn-remove" onclick="removeQuestion(${n})">✕ Remove</button>
        </div>
        <div class="question-row">
            <div class="question-left">
                <span class="option-label">Question Text</span>
                <input type="text" name="q${n}" placeholder="Enter question..." required>
                <span class="option-label">Option A</span>
                <input type="text" name="q${n}_o1" required>
                <span class="option-label">Option B</span>
                <input type="text" name="q${n}_o2" required>
                <span class="option-label">Option C</span>
                <input type="text" name="q${n}_o3" required>
                <span class="option-label">Option D</span>
                <input type="text" name="q${n}_o4" required>
                <span class="correct-ans-label">✔ Correct Answer (A/B/C/D)</span>
                <input type="text" name="q${n}_ans" maxlength="1" required>
            </div>
            <div class="question-right">
                <h4>Marks</h4>
                <input type="number" name="q${n}_marks" min="1" value="1" required>
            </div>
        </div>
    `;
    wrapper.appendChild(card);
    updateBadge();
}

function removeQuestion(n) {
    document.getElementById(`question-card-${n}`).remove();
    updateBadge();
    document.querySelectorAll('.quiz-card').forEach((card, idx) => {
        card.querySelector('.card-header h3').textContent = `Question ${idx + 1}`;
    });
}

function updateBadge() {
    const count = document.querySelectorAll('.quiz-card').length;
    const badge = document.getElementById('q-count-badge');
    if (badge) badge.textContent = `${count} Question${count !== 1 ? 's' : ''}`;
}

async function publishQuiz(event) {
    event.preventDefault();
    const title = document.getElementById('quiz-title').value;
    const cards = document.querySelectorAll('.quiz-card');
    const questions = [];

    cards.forEach(card => {
        const n = card.dataset.qnum;
        questions.push({
            questionText: card.querySelector(`input[name="q${n}"]`).value,
            options: [
                card.querySelector(`input[name="q${n}_o1"]`).value,
                card.querySelector(`input[name="q${n}_o2"]`).value,
                card.querySelector(`input[name="q${n}_o3"]`).value,
                card.querySelector(`input[name="q${n}_o4"]`).value
            ],
            // Maps A,B,C,D to 0,1,2,3 for Java Integer compatibility
            correctOption: ['A', 'B', 'C', 'D'].indexOf(card.querySelector(`input[name="q${n}_ans"]`).value.toUpperCase())
        });
    });

    const response = await fetch(`${API_BASE_URL}/quizzes/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, questions })
    });

    if (response.ok) {
        alert("✅ Quiz Successfully Published to Database!");
        goTo('QuizLogin.html');
    }
}

/* ─────────────────────────────────────────
   4. STUDENT: ATTEMPT & EVALUATE
   ───────────────────────────────────────── */

async function initStudentDashboard() {
    const name = sessionStorage.getItem('studentName');
    const id = sessionStorage.getItem('studentId');
    if (name) document.getElementById('student-name-label').textContent = `👤 ${name} (${id})`;

    const response = await fetch(`${API_BASE_URL}/quizzes/list`);
    const quizzes = await response.json();
    const container = document.getElementById('quiz-list-container');

    container.innerHTML = quizzes.map(q => `
        <div class="role-card">
            <h3>${q.title}</h3>
            <p>${q.questions.length} Questions</p>
            <button onclick="startQuiz(${q.id})" class="role-btn">Start Quiz</button>
        </div>
    `).join('');
}

async function startQuiz(quizId) {
    const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}`);
    const quiz = await response.json();
    sessionStorage.setItem('activeQuizId', quizId);
    sessionStorage.setItem('activeQuizQuestions', JSON.stringify(quiz.questions));

    document.getElementById('quiz-selection-section').style.display = 'none';
    document.getElementById('active-quiz-section').style.display = 'block';
    renderQuiz(quiz);
}

function renderQuiz(quiz) {
    const form = document.getElementById('quiz-form');
    form.innerHTML = quiz.questions.map((q, idx) => `
        <div class="quiz-card">
            <h3>Q${idx+1}. ${q.questionText}</h3>
            ${q.options.map((opt, i) => `
                <div class="option-group">
                    <input type="radio" name="q${idx}" value="${i}" id="q${idx}_${i}">
                    <label for="q${idx}_${i}">${opt}</label>
                </div>
            `).join('')}
        </div>
    `).join('') + `<button type="submit" class="btn-submit">Submit Quiz Answers</button>`;
}

async function submitQuiz(event) {
    event.preventDefault();
    const quizId = sessionStorage.getItem('activeQuizId');
    const questions = JSON.parse(sessionStorage.getItem('activeQuizQuestions'));
    const answers = [];

    questions.forEach((_, idx) => {
        const selected = document.querySelector(`input[name="q${idx}"]:checked`);
        answers.push(selected ? parseInt(selected.value) : -1);
    });

    const studentName = sessionStorage.getItem('studentName');
    const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}/submit?studentName=${studentName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers)
    });

    if (response.ok) {
        const result = await response.json();
        showResultPanel(result.score, questions.length);
    }
}

function showResultPanel(score, total) {
    document.getElementById('active-quiz-section').style.display = 'none';
    const panel = document.getElementById('result-panel');
    panel.style.display = 'block';
    document.getElementById('result-detail').textContent = `Final Score: ${score} / ${total}`;
}
