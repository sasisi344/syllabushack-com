import pandas as pd
import json
import os
import math

def convert_excel_to_json():
    # Input/Output paths
    input_file = 'tools/master_data.xlsx'
    output_dir = 'static/data'  # For Hugo, this will be served at /data/

    if not os.path.exists(input_file):
        print(f"Error: {input_file} not found.")
        return

    # Create output directory if needed
    os.makedirs(output_dir, exist_ok=True)

    print(f"Reading {input_file}...")
    try:
        df = pd.read_excel(input_file)
    except Exception as e:
        print(f"Error reading Excel: {e}")
        return

    # Check for required columns
    required_columns = ['question', 'options_1', 'options_2', 'options_3', 'options_4', 'answer_index', 'category']
    if not all(col in df.columns for col in required_columns):
        print("Error: Missing required columns in Excel file.")
        print(f"Expected at least: {required_columns}")
        return

    # Group by category
    grouped = df.groupby('category')

    for category, group in grouped:
        if pd.isna(category) or category == "":
            continue
            
        print(f"Processing category: {category} ({len(group)} items)")
        
        quiz_list = []
        for index, row in group.iterrows():
            # Skip empty rows (if any)
            if pd.isna(row['question']):
                continue

            # Format options
            options = [
                str(row['options_1']) if not pd.isna(row['options_1']) else "",
                str(row['options_2']) if not pd.isna(row['options_2']) else "",
                str(row['options_3']) if not pd.isna(row['options_3']) else "",
                str(row['options_4']) if not pd.isna(row['options_4']) else ""
            ]
            
            # Remove empty options if you want dynamic length, 
            # but usually quizzes have fixed 4 for these exams.
            # Keeping 4 for consistency with UI.

            # Parse tags
            tags = []
            if 'tags' in row and not pd.isna(row['tags']):
                tags = [t.strip() for t in str(row['tags']).split(',')]

            # Create quiz object
            quiz_item = {
                "id": str(row['ID']) if 'ID' in row and not pd.isna(row['ID']) else f"q_{index}",
                "question": str(row['question']),
                "options": options,
                "answer_index": int(row['answer_index']) if not pd.isna(row['answer_index']) else 0,
                "explanation": str(row['explanation']) if 'explanation' in row and not pd.isna(row['explanation']) else "",
                "tags": tags,
                "difficulty": int(row['difficulty']) if 'difficulty' in row and not pd.isna(row['difficulty']) else 1
            }
            
            quiz_list.append(quiz_item)

        # Output to JSON
        filename = f"{category}.json"
        output_path = os.path.join(output_dir, filename)
        
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(quiz_list, f, indent=4, ensure_ascii=False)
            print(f"  -> Saved {output_path}")
        except Exception as e:
            print(f"  -> Error saving {filename}: {e}")

    print("Conversion complete.")

if __name__ == "__main__":
    convert_excel_to_json()
