import sys
import os

def pdf_to_markdown(pdf_path):
    import fitz  # PyMuPDF

    if not os.path.exists(pdf_path):
        print(f"Error: File not found: {pdf_path}")
        return

    output_path = os.path.splitext(pdf_path)[0] + ".md"
    
    doc = fitz.open(pdf_path)
    md_content = []

    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        # Extract text blocks with sorting for reading order
        # Block format: (x0, y0, x1, y1, "text", block_no, block_type)
        # block_type: 0 = text, 1 = image
        blocks = page.get_text("blocks", sort=True)
        page_text = []
        for block in blocks:
            if block[6] == 0:  # Text block only
                page_text.append(block[4].strip())
        md_content.append(f"## Page {page_num + 1}\n\n" + "\n\n".join(page_text) + "\n")

    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(md_content))

    print(f"Successfully extracted text to: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python pdf_to_md.py <path_to_pdf> [path_to_pdf ...]")
    else:
        for pdf_path in sys.argv[1:]:
            print(f"Processing: {pdf_path}")
            pdf_to_markdown(pdf_path)
