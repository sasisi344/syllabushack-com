import os
import json
import random
import google.generativeai as genai
from colorama import Fore, Style, init

# Initialize colorama
init(autoreset=True)

SYLLABUS_FILE = "syllabus_data.json"

def configure_api():
    """Configures the Gemini API with a user-provided key."""
    print(f"{Fore.CYAN}=== Syllabus Hack: Essay Trainer (BYOK Edition) ==={Style.RESET_ALL}")
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        api_key = input(f"{Fore.YELLOW}Please paste your Google Gemini API Key: {Style.RESET_ALL}").strip()
    
    if not api_key:
        print(f"{Fore.RED}Error: API Key is required to proceed.{Style.RESET_ALL}")
        return False

    try:
        genai.configure(api_key=api_key)
        return True
    except Exception as e:
        print(f"{Fore.RED}Error configuring API: {e}{Style.RESET_ALL}")
        return False

def load_syllabus_data():
    """Loads questions from the local JSON file."""
    if not os.path.exists(SYLLABUS_FILE):
        return {}
    try:
        with open(SYLLABUS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"{Fore.RED}Error loading syllabus data: {e}{Style.RESET_ALL}")
        return {}

def get_question(model, category, local_data):
    """Gets a question from local data or generates one via AI."""
    
    # Try local data first
    if category in local_data and local_data[category]:
        print(f"\n{Fore.GREEN}Fetching a {category} question from local dataset...{Style.RESET_ALL}")
        item = random.choice(local_data[category])
        return item['question'], item.get('theme', 'General')

    # Fallback to AI generation
    print(f"\n{Fore.YELLOW}Local data not found for {category}. Generating via AI...{Style.RESET_ALL}")
    
    prompt = f"""
    You are an expert exam creator for the Applied Information Technology Engineer Examination (AP) in Japan.
    Create a descriptive/essay-style question (午後試験 記述式) regarding '{category}'.
    
    Requirements:
    1. The question should be challenging and realistic, similar to past exam questions.
    2. Provide a brief scenario or problem description (200-400 characters).
    3. Ask a specific question that requires a descriptive answer.
    4. Output ONLY the question content.
    5. Language: Japanese.
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text, "AI Generated"
    except Exception as e:
        print(f"{Fore.RED}Error generating question: {e}{Style.RESET_ALL}")
        return None, None

def grade_answer(model, question, theme, user_answer):
    """Grades the user's answer against the question."""
    print(f"\n{Fore.GREEN}Grading your answer... please wait...{Style.RESET_ALL}")
    
    prompt = f"""
    You are an expert grader for the Applied Information Technology Engineer Examination (AP).
    
    Theme: {theme}
    Question:
    {question}
    
    User's Answer:
    {user_answer}
    
    Task:
    1. Evaluate the user's answer based on the theme.
    2. Determine if it is Correct (Pass) or Incorrect (Fail).
    3. Provide a score out of 100.
    4. Provide a Model Answer (模範解答).
    5. Provide specific feedback on what keywords were missing or how to improve the logic.
    
    Output Format:
    【判定】: 合格 / 不合格
    【スコア】: X / 100
    【模範解答】: ...
    【解説・アドバイス】: ...
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"{Fore.RED}Error grading answer: {e}{Style.RESET_ALL}")
        return None

def main():
    if not configure_api():
        return

    model = genai.GenerativeModel('gemini-1.5-flash')
    syllabus_data = load_syllabus_data()

    while True:
        print(f"\n{Fore.CYAN}--- Menu ---{Style.RESET_ALL}")
        print("1. System Architecture")
        print("2. Network")
        print("3. Information Security")
        print("4. Project Management")
        print("5. IT Service Management")
        print("q. Quit")
        
        choice = input(f"{Fore.YELLOW}Select a category (1-5): {Style.RESET_ALL}").strip().lower()
        
        if choice == 'q':
            print("Goodbye!")
            break
            
        categories = {
            '1': 'System Architecture',
            '2': 'Network',
            '3': 'Information Security',
            '4': 'Project Management',
            '5': 'IT Service Management'
        }
        
        category = categories.get(choice)
        if not category:
            print("Invalid selection.")
            continue
            
        question, theme = get_question(model, category, syllabus_data)
        if not question:
            continue
            
        print(f"\n{Fore.WHITE}--------------------------------------------------{Style.RESET_ALL}")
        print(f"{Fore.MAGENTA}[Theme: {theme}]{Style.RESET_ALL}")
        print(f"{Fore.BOLD}Problem:{Style.RESET_ALL}\n{question}")
        print(f"{Fore.WHITE}--------------------------------------------------{Style.RESET_ALL}")
        
        print(f"\n{Fore.YELLOW}Your Answer (Input text, then press Enter twice to submit):{Style.RESET_ALL}")
        lines = []
        while True:
            line = input()
            if not line:
                break
            lines.append(line)
        user_answer = "\n".join(lines)
        
        if not user_answer.strip():
            print("No answer provided. Skipping grading.")
            continue
            
        result = grade_answer(model, question, theme, user_answer)
        if result:
            print(f"\n{Fore.WHITE}================ Result ================{Style.RESET_ALL}")
            print(result)
            print(f"{Fore.WHITE}======================================{Style.RESET_ALL}")
        
        input(f"\n{Fore.CYAN}Press Enter to return to menu...{Style.RESET_ALL}")

if __name__ == "__main__":
    main()
