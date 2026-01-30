interface QuizData {
    id: string;
    question: string;
    options: string[];
    answer_index: number;
    explanation: string;
    tags?: string[];
}

interface QuizResult {
    questionId: string;
    isCorrect: boolean;
    tags: string[];
    timestamp: number;
}

interface TagStats {
    correct: number;
    total: number;
}

interface StoredStats {
    results: QuizResult[];
    tagStats: { [tag: string]: TagStats };
}

class QuizApp {
    private container: HTMLElement;
    private category: string;
    private questions: QuizData[] = [];
    private currentQuestionIndex: number = 0;
    private score: number = 0;
    private sessionResults: QuizResult[] = [];
    private readonly STORAGE_KEY = 'syllabushack_quiz_stats';

    constructor(containerId: string) {
        this.container = document.getElementById(containerId) as HTMLElement;
        if (!this.container) return;

        this.category = this.container.dataset.category || 'default';
        this.init();
    }

    async init() {
        await this.fetchQuestions();
        if (this.questions.length > 0) {
            this.renderQuestion();
        } else {
            this.showError('問題が見つかりませんでした。');
        }
    }

    async fetchQuestions() {
        try {
            const response = await fetch(`/data/${this.category}.json`);

            if (!response.ok) {
                console.warn(`Failed to fetch /data/${this.category}.json, falling back to mock data.`);
                this.useMockData();
                return;
            }

            const data = await response.json();
            this.questions = this.shuffleArray(data).slice(0, 10);

        } catch (error) {
            console.error('Error fetching quiz data:', error);
            this.useMockData();
        }
    }

    useMockData() {
        this.questions = [
            {
                id: 'mock1',
                question: '【DEMO】情報セキュリティの3要素に含まれないものは？',
                options: ['機密性 (Confidentiality)', '完全性 (Integrity)', '可用性 (Availability)', '脆弱性 (Vulnerability)'],
                answer_index: 3,
                explanation: '情報セキュリティの3要素（CIA）は、機密性、完全性、可用性です。脆弱性はセキュリティ上の欠陥を指す言葉です。',
                tags: ['セキュリティ']
            },
            {
                id: 'mock2',
                question: '【DEMO】パスワードリスト攻撃の説明として適切なものは？',
                options: ['順列組み合わせですべてのパスワードを試す', 'よく使われるパスワードの辞書を用いて攻撃する', '別のサービスから流出したIDとパスワードの組み合わせを用いて攻撃する', 'キーロガーを使って入力を盗む'],
                answer_index: 2,
                explanation: 'パスワードリスト攻撃は、他サイトから流出したID/Passリストを使ってログインを試行する攻撃手法です。',
                tags: ['セキュリティ', '攻撃手法']
            }
        ];
    }

    shuffleArray(array: any[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    renderQuestion() {
        const q = this.questions[this.currentQuestionIndex];
        const questionEl = document.getElementById('question-text');
        const optionsEl = document.getElementById('options-container');
        const feedbackEl = document.getElementById('feedback-container');
        const progressEl = document.getElementById('progress-text');

        if (questionEl) questionEl.textContent = `Q${this.currentQuestionIndex + 1}. ${q.question}`;

        if (optionsEl) {
            optionsEl.innerHTML = '';
            q.options.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-option-btn';
                btn.textContent = opt;
                btn.onclick = () => this.checkAnswer(idx, btn);
                optionsEl.appendChild(btn);
            });
        }

        if (feedbackEl) {
            feedbackEl.classList.add('hidden');
            feedbackEl.classList.remove('result-correct', 'result-incorrect');
        }

        if (progressEl) progressEl.textContent = `${this.currentQuestionIndex + 1} / ${this.questions.length}`;
    }

    checkAnswer(selectedIndex: number, btnClicked: HTMLButtonElement) {
        const q = this.questions[this.currentQuestionIndex];
        const isCorrect = selectedIndex === q.answer_index;

        if (isCorrect) this.score++;

        // Record result for this question
        const result: QuizResult = {
            questionId: q.id,
            isCorrect: isCorrect,
            tags: q.tags || [],
            timestamp: Date.now()
        };
        this.sessionResults.push(result);
        this.saveResult(result);

        // Visual feedback on buttons
        const optionsEl = document.getElementById('options-container');
        if (optionsEl) {
            const buttons = optionsEl.querySelectorAll('button');
            buttons.forEach((btn, idx) => {
                btn.disabled = true;
                if (idx === q.answer_index) {
                    btn.classList.add('correct-highlight');
                } else if (idx === selectedIndex && !isCorrect) {
                    btn.classList.add('wrong-highlight');
                }
            });
        }

        // Show explanation
        const feedbackEl = document.getElementById('feedback-container');
        const resultMsg = document.getElementById('result-message');
        const explanation = document.getElementById('explanation-text');
        const nextBtn = document.getElementById('next-button');

        if (feedbackEl && resultMsg && explanation && nextBtn) {
            feedbackEl.classList.remove('hidden');
            feedbackEl.style.borderLeftColor = isCorrect ? '#198754' : '#dc3545';

            resultMsg.textContent = isCorrect ? '正解！⭕' : '不正解... ❌';
            resultMsg.style.color = isCorrect ? '#198754' : '#dc3545';

            explanation.textContent = q.explanation;

            nextBtn.onclick = () => this.nextQuestion();
        }
    }

    // Save result to localStorage
    saveResult(result: QuizResult) {
        try {
            const stored = this.getStoredStats();

            // Add to results history
            stored.results.push(result);

            // Update tag stats
            result.tags.forEach(tag => {
                if (!stored.tagStats[tag]) {
                    stored.tagStats[tag] = { correct: 0, total: 0 };
                }
                stored.tagStats[tag].total++;
                if (result.isCorrect) {
                    stored.tagStats[tag].correct++;
                }
            });

            // Keep only last 100 results to prevent storage bloat
            if (stored.results.length > 100) {
                stored.results = stored.results.slice(-100);
            }

            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stored));
        } catch (e) {
            console.warn('Failed to save quiz result to localStorage:', e);
        }
    }

    getStoredStats(): StoredStats {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (data) {
                return JSON.parse(data);
            }
        } catch (e) {
            console.warn('Failed to read quiz stats from localStorage:', e);
        }
        return { results: [], tagStats: {} };
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.questions.length) {
            this.renderQuestion();
        } else {
            this.showResults();
        }
    }

    showResults() {
        const stored = this.getStoredStats();
        const isPerfectScore = this.score === this.questions.length;

        // Save perfect score achievement
        if (isPerfectScore) {
            this.unlockReward();
        }

        // Calculate weak areas (tags with < 70% accuracy and at least 2 attempts)
        const weakAreas: { tag: string; accuracy: number; total: number }[] = [];
        const strongAreas: { tag: string; accuracy: number; total: number }[] = [];

        Object.entries(stored.tagStats).forEach(([tag, stats]) => {
            if (stats.total >= 2) {
                const accuracy = Math.round((stats.correct / stats.total) * 100);
                if (accuracy < 70) {
                    weakAreas.push({ tag, accuracy, total: stats.total });
                } else {
                    strongAreas.push({ tag, accuracy, total: stats.total });
                }
            }
        });

        // Sort weak areas by accuracy (lowest first)
        weakAreas.sort((a, b) => a.accuracy - b.accuracy);
        strongAreas.sort((a, b) => b.accuracy - a.accuracy);

        // Build weak areas HTML
        let weakAreasHtml = '';
        if (weakAreas.length > 0) {
            weakAreasHtml = `
                <div class="weak-areas-section">
                    <h4>📚 重点復習が必要な分野</h4>
                    <ul class="weak-areas-list">
                        ${weakAreas.slice(0, 5).map(w => `
                            <li class="weak-area-item">
                                <span class="tag-name">${w.tag}</span>
                                <span class="tag-accuracy" style="color: ${w.accuracy < 50 ? '#dc3545' : '#f0ad4e'}">
                                    ${w.accuracy}% (${w.total}問)
                                </span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }

        // Build strong areas HTML
        let strongAreasHtml = '';
        if (strongAreas.length > 0) {
            strongAreasHtml = `
                <div class="strong-areas-section">
                    <h4>✅ 得意な分野</h4>
                    <ul class="strong-areas-list">
                        ${strongAreas.slice(0, 3).map(s => `
                            <li class="strong-area-item">
                                <span class="tag-name">${s.tag}</span>
                                <span class="tag-accuracy" style="color: #198754">
                                    ${s.accuracy}% (${s.total}問)
                                </span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }

        // Build session summary
        const sessionCorrect = this.sessionResults.filter(r => r.isCorrect).length;
        const sessionTotal = this.sessionResults.length;
        const sessionWrong = this.sessionResults.filter(r => !r.isCorrect);

        let sessionWrongHtml = '';
        if (sessionWrong.length > 0) {
            const wrongTags = new Set<string>();
            sessionWrong.forEach(r => r.tags.forEach(t => wrongTags.add(t)));
            sessionWrongHtml = `
                <div class="session-wrong-tags">
                    <p>今回間違えた分野: ${Array.from(wrongTags).map(t => `<span class="wrong-tag">${t}</span>`).join(' ')}</p>
                </div>
            `;
        }

        // Calculate overall stats
        const totalAttempts = stored.results.length;
        const totalCorrect = stored.results.filter(r => r.isCorrect).length;
        const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

        // Build perfect score reward HTML
        let rewardHtml = '';
        if (isPerfectScore) {
            rewardHtml = `
                <div class="perfect-score-reward">
                    <div class="reward-confetti">🎊</div>
                    <h4>🏆 全問正解おめでとう！</h4>
                    <p class="reward-message">あなたは見事にクイズをマスターしました！</p>
                    <div class="reward-unlock">
                        <span class="unlock-icon">🔓</span>
                        <span class="unlock-text">特別コンテンツがアンロックされました</span>
                    </div>
                    <a href="/docs/hack_prototype/reward/" class="reward-link-btn">
                        📖 このクイズシステムの作り方を学ぶ
                    </a>
                </div>
            `;
        }

        const headerEmoji = isPerfectScore ? '🎉' : '🎯';
        const headerText = isPerfectScore ? 'パーフェクト！' : '結果発表';

        this.container.innerHTML = `
            <div class="quiz-card quiz-results ${isPerfectScore ? 'perfect-score' : ''}">
                <h3>${headerEmoji} ${headerText}</h3>
                
                <div class="score-display">
                    <p class="score-main">
                        ${this.questions.length}問中 <span class="score-number ${isPerfectScore ? 'perfect' : ''}">${this.score}</span> 問正解！
                    </p>
                    <p class="score-rate">正答率: ${Math.round((this.score / this.questions.length) * 100)}%</p>
                </div>
                
                ${rewardHtml}
                
                ${sessionWrongHtml}
                
                <hr class="results-divider">
                
                <div class="cumulative-stats">
                    <h4>📊 累計成績 (全${totalAttempts}問)</h4>
                    <p>累計正答率: <strong>${overallAccuracy}%</strong></p>
                </div>
                
                ${weakAreasHtml}
                ${strongAreasHtml}
                
                <div class="results-actions">
                    <button class="quiz-next-btn" onclick="location.reload()">もう一度挑戦する</button>
                    <button class="quiz-reset-btn" onclick="localStorage.removeItem('syllabushack_quiz_stats'); location.reload();">履歴をリセット</button>
                </div>
            </div>
        `;

        // Trigger confetti animation for perfect score
        if (isPerfectScore) {
            this.showConfetti();
        }
    }

    unlockReward() {
        try {
            const stored = this.getStoredStats();
            (stored as any).rewardUnlocked = true;
            (stored as any).rewardUnlockedAt = Date.now();
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stored));
        } catch (e) {
            console.warn('Failed to save reward unlock:', e);
        }
    }

    showConfetti() {
        // Create confetti container
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        this.container.appendChild(confettiContainer);

        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#fd79a8', '#a29bfe'];
        const confettiCount = 50;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            confettiContainer.appendChild(confetti);
        }

        // Remove confetti after animation
        setTimeout(() => {
            confettiContainer.remove();
        }, 5000);
    }

    showError(msg: string) {
        if (this.container) {
            this.container.innerHTML = `<div class="quiz-card"><p style="color:red">${msg}</p></div>`;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('quiz-app')) {
        new QuizApp('quiz-app');
    }
});
