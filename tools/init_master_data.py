import pandas as pd
import os

# Define the columns/headers
columns = [
    'ID', 
    'exam_type', 
    'category', 
    'difficulty', 
    'tags', 
    'question', 
    'options_1', 
    'options_2', 
    'options_3', 
    'options_4', 
    'answer_index', 
    'explanation', 
    'ai_hint'
]

# Create a sample row to verify it works (optional, but good for format)
sample_data = [
    [
        'AP-SEC-001', 
        'AP', 
        'security', 
        '1', 
        'security,cia', 
        '情報セキュリティの3要素（CIA）に含まれないものはどれか？', 
        '機密性', 
        '完全性', 
        '可用性', 
        '脆弱性', 
        3, 
        '脆弱性はセキュリティ上の欠陥を指します。3要素は機密性・完全性・可用性です。', 
        '英語でいうと...?'
    ]
]

# Create DataFrame
df = pd.DataFrame(sample_data, columns=columns)

# Ensure tools directory exists
os.makedirs('tools', exist_ok=True)

# Output file path
output_file = 'tools/master_data.xlsx'

# Write to Excel
try:
    df.to_excel(output_file, index=False)
    print(f"Successfully created {output_file}")
except Exception as e:
    print(f"Error creating Excel file: {e}")
