interface QuizData {
    id: string;
    question: string;
    options: string[];
    answer_index: number;
    explanation: string;
    tags?: string[];
}

class QuizApp {
    private container: HTMLElement;
    private category: string;
    private questions: QuizData[] = [];
    private currentQuestionIndex: number = 0;
    private score: number = 0;

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
            // Note: In static generation, data often lives in /data/ or similar. 
            // Phase 1 plan said static/data/, so it would be available at /data/file.json
            const response = await fetch(`/data/${this.category}.json`);
            
            if (!response.ok) {
                // Determine if we should show mock data for demo purposes
                console.warn(`Failed to fetch /data/${this.category}.json, falling back to mock data.`);
                this.useMockData();
                return;
            }
            
            const data = await response.json();
            // Shuffle and pick 5-10
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
                explanation: '情報セキュリティの3要素（CIA）は、機密性、完全性、可用性です。脆弱性はセキュリティ上の欠陥を指す言葉です。'
            },
            {
                id: 'mock2',
                question: '【DEMO】パスワードリスト攻撃の説明として適切なものは？',
                options: ['順列組み合わせですべてのパスワードを試す', 'よく使われるパスワードの辞書を用いて攻撃する', '別のサービスから流出したIDとパスワードの組み合わせを用いて攻撃する', 'キーロガーを使って入力を盗む'],
                answer_index: 2,
                explanation: 'パスワードリスト攻撃は、他サイトから流出したID/Passリストを使ってログインを試行する攻撃手法です。'
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
        
        if(questionEl) questionEl.textContent = `Q${this.currentQuestionIndex + 1}. ${q.question}`;
        
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

        if(feedbackEl) {
            feedbackEl.classList.add('hidden');
            feedbackEl.classList.remove('result-correct', 'result-incorrect');
        } // Hide previous feedback
        
        if(progressEl) progressEl.textContent = `${this.currentQuestionIndex + 1} / ${this.questions.length}`;
    }

    checkAnswer(selectedIndex: number, btnClicked: HTMLButtonElement) {
        const q = this.questions[this.currentQuestionIndex];
        const isCorrect = selectedIndex === q.answer_index;
        
        if(isCorrect) this.score++;

        // Visual feedback on buttons
        const optionsEl = document.getElementById('options-container');
        if(optionsEl) {
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

    nextQuestion() {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.questions.length) {
            this.renderQuestion();
        } else {
            this.showResults();
        }
    }

    showResults() {
        this.container.innerHTML = `
            <div class="quiz-card" style="text-align: center;">
                <h3>結果発表</h3>
                <p style="font-size: 1.5rem; margin: 1rem 0;">
                    ${this.questions.length}問中 <span style="font-weight: bold; color: #1565c0;">${this.score}</span> 問正解！
                </p>
                <button class="quiz-next-btn" onclick="location.reload()">もう一度挑戦する</button>
            </div>
        `;
    }

    showError(msg: string) {
        if(this.container) {
            this.container.innerHTML = `<div class="quiz-card"><p style="color:red">${msg}</p></div>`;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Only init if the element exists
    if(document.getElementById('quiz-app')) {
        new QuizApp('quiz-app');
    }
});
