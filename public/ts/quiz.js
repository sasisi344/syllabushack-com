(() => {
  // <stdin>
  var QuizApp = class {
    container;
    category;
    questions = [];
    currentQuestionIndex = 0;
    score = 0;
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container) return;
      this.category = this.container.dataset.category || "default";
      this.init();
    }
    async init() {
      await this.fetchQuestions();
      if (this.questions.length > 0) {
        this.renderQuestion();
      } else {
        this.showError("\u554F\u984C\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3067\u3057\u305F\u3002");
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
        console.error("Error fetching quiz data:", error);
        this.useMockData();
      }
    }
    useMockData() {
      this.questions = [
        {
          id: "mock1",
          question: "\u3010DEMO\u3011\u60C5\u5831\u30BB\u30AD\u30E5\u30EA\u30C6\u30A3\u306E3\u8981\u7D20\u306B\u542B\u307E\u308C\u306A\u3044\u3082\u306E\u306F\uFF1F",
          options: ["\u6A5F\u5BC6\u6027 (Confidentiality)", "\u5B8C\u5168\u6027 (Integrity)", "\u53EF\u7528\u6027 (Availability)", "\u8106\u5F31\u6027 (Vulnerability)"],
          answer_index: 3,
          explanation: "\u60C5\u5831\u30BB\u30AD\u30E5\u30EA\u30C6\u30A3\u306E3\u8981\u7D20\uFF08CIA\uFF09\u306F\u3001\u6A5F\u5BC6\u6027\u3001\u5B8C\u5168\u6027\u3001\u53EF\u7528\u6027\u3067\u3059\u3002\u8106\u5F31\u6027\u306F\u30BB\u30AD\u30E5\u30EA\u30C6\u30A3\u4E0A\u306E\u6B20\u9665\u3092\u6307\u3059\u8A00\u8449\u3067\u3059\u3002"
        },
        {
          id: "mock2",
          question: "\u3010DEMO\u3011\u30D1\u30B9\u30EF\u30FC\u30C9\u30EA\u30B9\u30C8\u653B\u6483\u306E\u8AAC\u660E\u3068\u3057\u3066\u9069\u5207\u306A\u3082\u306E\u306F\uFF1F",
          options: ["\u9806\u5217\u7D44\u307F\u5408\u308F\u305B\u3067\u3059\u3079\u3066\u306E\u30D1\u30B9\u30EF\u30FC\u30C9\u3092\u8A66\u3059", "\u3088\u304F\u4F7F\u308F\u308C\u308B\u30D1\u30B9\u30EF\u30FC\u30C9\u306E\u8F9E\u66F8\u3092\u7528\u3044\u3066\u653B\u6483\u3059\u308B", "\u5225\u306E\u30B5\u30FC\u30D3\u30B9\u304B\u3089\u6D41\u51FA\u3057\u305FID\u3068\u30D1\u30B9\u30EF\u30FC\u30C9\u306E\u7D44\u307F\u5408\u308F\u305B\u3092\u7528\u3044\u3066\u653B\u6483\u3059\u308B", "\u30AD\u30FC\u30ED\u30AC\u30FC\u3092\u4F7F\u3063\u3066\u5165\u529B\u3092\u76D7\u3080"],
          answer_index: 2,
          explanation: "\u30D1\u30B9\u30EF\u30FC\u30C9\u30EA\u30B9\u30C8\u653B\u6483\u306F\u3001\u4ED6\u30B5\u30A4\u30C8\u304B\u3089\u6D41\u51FA\u3057\u305FID/Pass\u30EA\u30B9\u30C8\u3092\u4F7F\u3063\u3066\u30ED\u30B0\u30A4\u30F3\u3092\u8A66\u884C\u3059\u308B\u653B\u6483\u624B\u6CD5\u3067\u3059\u3002"
        }
      ];
    }
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
    renderQuestion() {
      const q = this.questions[this.currentQuestionIndex];
      const questionEl = document.getElementById("question-text");
      const optionsEl = document.getElementById("options-container");
      const feedbackEl = document.getElementById("feedback-container");
      const progressEl = document.getElementById("progress-text");
      if (questionEl) questionEl.textContent = `Q${this.currentQuestionIndex + 1}. ${q.question}`;
      if (optionsEl) {
        optionsEl.innerHTML = "";
        q.options.forEach((opt, idx) => {
          const btn = document.createElement("button");
          btn.className = "quiz-option-btn";
          btn.textContent = opt;
          btn.onclick = () => this.checkAnswer(idx, btn);
          optionsEl.appendChild(btn);
        });
      }
      if (feedbackEl) {
        feedbackEl.classList.add("hidden");
        feedbackEl.classList.remove("result-correct", "result-incorrect");
      }
      if (progressEl) progressEl.textContent = `${this.currentQuestionIndex + 1} / ${this.questions.length}`;
    }
    checkAnswer(selectedIndex, btnClicked) {
      const q = this.questions[this.currentQuestionIndex];
      const isCorrect = selectedIndex === q.answer_index;
      if (isCorrect) this.score++;
      const optionsEl = document.getElementById("options-container");
      if (optionsEl) {
        const buttons = optionsEl.querySelectorAll("button");
        buttons.forEach((btn, idx) => {
          btn.disabled = true;
          if (idx === q.answer_index) {
            btn.classList.add("correct-highlight");
          } else if (idx === selectedIndex && !isCorrect) {
            btn.classList.add("wrong-highlight");
          }
        });
      }
      const feedbackEl = document.getElementById("feedback-container");
      const resultMsg = document.getElementById("result-message");
      const explanation = document.getElementById("explanation-text");
      const nextBtn = document.getElementById("next-button");
      if (feedbackEl && resultMsg && explanation && nextBtn) {
        feedbackEl.classList.remove("hidden");
        feedbackEl.style.borderLeftColor = isCorrect ? "#198754" : "#dc3545";
        resultMsg.textContent = isCorrect ? "\u6B63\u89E3\uFF01\u2B55" : "\u4E0D\u6B63\u89E3... \u274C";
        resultMsg.style.color = isCorrect ? "#198754" : "#dc3545";
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
                <h3>\u7D50\u679C\u767A\u8868</h3>
                <p style="font-size: 1.5rem; margin: 1rem 0;">
                    ${this.questions.length}\u554F\u4E2D <span style="font-weight: bold; color: #1565c0;">${this.score}</span> \u554F\u6B63\u89E3\uFF01
                </p>
                <button class="quiz-next-btn" onclick="location.reload()">\u3082\u3046\u4E00\u5EA6\u6311\u6226\u3059\u308B</button>
            </div>
        `;
    }
    showError(msg) {
      if (this.container) {
        this.container.innerHTML = `<div class="quiz-card"><p style="color:red">${msg}</p></div>`;
      }
    }
  };
  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("quiz-app")) {
      new QuizApp("quiz-app");
    }
  });
})();
