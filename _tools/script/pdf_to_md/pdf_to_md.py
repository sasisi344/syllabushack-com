"""
PDF to Markdown Text Extractor (with Auto-Detection & Gemini Vision OCR)
Automatically detects if PDF is text-based or image-based (scanned).
Falls back to Gemini Vision API for OCR on image-based PDFs.

Usage:
    python pdf_to_md.py <path_to_pdf> [--output-dir <dir>] [--page-markers] [--force-ocr]

Requirements:
    - PyMuPDF: pip install pymupdf
    - For Gemini OCR: pip install google-generativeai pillow
    - GOOGLE_API_KEY environment variable (or .env file)
"""

import sys
import os
import argparse
import base64
import io
import time
from pathlib import Path
from dotenv import load_dotenv

# Load .env from project root
script_dir = Path(__file__).resolve().parent
project_root = script_dir.parent.parent.parent  # pdf_to_md -> script -> _tools -> project root
env_path = project_root / ".env"
load_dotenv(dotenv_path=env_path, override=True)


def check_dependencies():
    """Check which dependencies are available."""
    deps = {
        "fitz": False,
        "genai": False,
        "PIL": False,
    }
    
    try:
        import fitz
        deps["fitz"] = True
    except ImportError:
        pass
    
    try:
        import google.generativeai as genai
        deps["genai"] = True
    except ImportError:
        pass
    
    try:
        from PIL import Image
        deps["PIL"] = True
    except ImportError:
        pass
    
    return deps


def is_text_extractable(doc, sample_pages: int = 3, min_chars_per_page: int = 50) -> bool:
    """
    Check if PDF has extractable text by sampling a few pages.
    """
    total_chars = 0
    pages_to_check = min(sample_pages, len(doc))
    
    for i in range(pages_to_check):
        text = doc[i].get_text("text")
        total_chars += len(text.strip())
    
    avg_chars = total_chars / pages_to_check if pages_to_check > 0 else 0
    return avg_chars >= min_chars_per_page


def extract_text_native(doc) -> list:
    """Extract text using PyMuPDF's native text extraction."""
    pages_text = []
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        text = page.get_text("text")
        if text.strip():
            pages_text.append(text.strip())
    return pages_text


def extract_text_gemini_ocr(pdf_path: str, api_key: str) -> list:
    """
    Extract text using Gemini Vision API for OCR.
    Converts PDF pages to images and sends to Gemini for text extraction.
    """
    try:
        import fitz
        import google.generativeai as genai
        from PIL import Image
    except ImportError as e:
        print(f"[pdf_to_md] Missing dependency: {e}")
        return []
    
    genai.configure(api_key=api_key)
    
    # Use Gemini 2.0 Flash for vision tasks
    model = genai.GenerativeModel("gemini-2.0-flash")
    
    doc = fitz.open(pdf_path)
    pages_text = []
    total_pages = len(doc)
    
    print(f"[pdf_to_md] Using Gemini Vision OCR for {total_pages} pages...")
    
    for page_num in range(total_pages):
        print(f"[pdf_to_md] OCR page {page_num + 1}/{total_pages}...", end="\r")
        
        page = doc.load_page(page_num)
        
        # Render page to image (higher DPI for better OCR)
        mat = fitz.Matrix(2, 2)  # 2x zoom = ~144 DPI
        pix = page.get_pixmap(matrix=mat)
        
        # Convert to PIL Image
        img_data = pix.tobytes("png")
        img = Image.open(io.BytesIO(img_data))
        
        # Convert to base64 for API
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        img_base64 = base64.b64encode(buffered.getvalue()).decode()
        
        # Send to Gemini
        try:
            response = model.generate_content([
                {
                    "mime_type": "image/png",
                    "data": img_base64
                },
                "この画像に含まれるすべてのテキストを正確に抽出してください。レイアウトは無視して、テキストのみをプレーンテキストで出力してください。"
            ])
            
            if response.text:
                pages_text.append(response.text.strip())
            
            # Rate limiting (Gemini has rate limits)
            time.sleep(0.5)
            
        except Exception as e:
            print(f"\n[pdf_to_md] Gemini OCR error on page {page_num + 1}: {e}")
    
    doc.close()
    print()  # New line after progress
    return pages_text


def pdf_to_markdown(
    pdf_path: str,
    output_dir: str = None,
    include_page_markers: bool = False,
    force_ocr: bool = False,
) -> None:
    """
    Extract text from a PDF file and save as Markdown.
    Automatically detects if OCR is needed.
    """
    deps = check_dependencies()
    
    if not deps["fitz"]:
        print("Error: PyMuPDF is not installed.")
        print("Please run: pip install pymupdf")
        sys.exit(1)

    import fitz

    if not os.path.exists(pdf_path):
        print(f"Error: File not found: {pdf_path}")
        return

    # Determine output path
    base_name = os.path.splitext(os.path.basename(pdf_path))[0]
    if len(base_name) > 100:
        base_name = base_name[:100]
    
    if output_dir:
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, base_name + ".md")
    else:
        output_path = os.path.splitext(pdf_path)[0] + ".md"
    
    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        print(f"Error: Failed to open PDF: {e}")
        return

    page_count = len(doc)
    print(f"[pdf_to_md] PDF has {page_count} pages.")
    
    # Detect PDF type
    use_ocr = force_ocr
    if not force_ocr:
        if is_text_extractable(doc):
            print("[pdf_to_md] Detected: TEXT-BASED PDF (native extraction)")
            use_ocr = False
        else:
            print("[pdf_to_md] Detected: IMAGE-BASED PDF (OCR required)")
            use_ocr = True
    else:
        print("[pdf_to_md] Force OCR mode enabled.")
    
    # Extract text
    if use_ocr:
        doc.close()
        
        # Check for Gemini API key
        api_key = os.environ.get("GOOGLE_API_KEY")
        if not api_key or api_key == "YOUR_API_KEY_HERE":
            print("[pdf_to_md] Error: GOOGLE_API_KEY not set for OCR.")
            print(f"[pdf_to_md] Please set it in: {env_path}")
            return
        
        if not deps["genai"] or not deps["PIL"]:
            print("[pdf_to_md] Error: Gemini OCR requires google-generativeai and pillow.")
            print("[pdf_to_md] Install with: pip install google-generativeai pillow")
            return
        
        pages_text = extract_text_gemini_ocr(pdf_path, api_key)
        if not pages_text:
            print("[pdf_to_md] OCR extraction failed or returned no text.")
            return
    else:
        pages_text = extract_text_native(doc)
        doc.close()
    
    if not pages_text:
        print("[pdf_to_md] No text could be extracted from the PDF.")
        return
    
    # Format output
    if include_page_markers:
        md_content = []
        for i, text in enumerate(pages_text):
            md_content.append(f"## Page {i + 1}\n\n{text}\n")
        full_text = "\n".join(md_content)
    else:
        full_text = "\n\n".join(pages_text)
    
    # Write output
    try:
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(full_text)
        print(f"[pdf_to_md] Success! Extracted {len(pages_text)} pages to: {output_path}")
    except Exception as e:
        print(f"Error: Failed to write output file: {e}")


def main():
    parser = argparse.ArgumentParser(
        description="Extract text from PDF files to Markdown (with auto-detection and Gemini OCR fallback)."
    )
    parser.add_argument("pdf_files", nargs="+", help="PDF file(s) to process")
    parser.add_argument("--output-dir", "-o", help="Directory to save output files")
    parser.add_argument("--page-markers", "-p", action="store_true", help="Add '## Page N' headers")
    parser.add_argument("--force-ocr", action="store_true", help="Always use OCR even for text PDFs")
    
    args = parser.parse_args()

    # Show dependency status
    deps = check_dependencies()
    print("[pdf_to_md] Dependencies:")
    print(f"  - PyMuPDF: {'OK' if deps['fitz'] else 'MISSING'}")
    print(f"  - google-generativeai: {'OK' if deps['genai'] else 'MISSING (for OCR)'}")
    print(f"  - Pillow: {'OK' if deps['PIL'] else 'MISSING (for OCR)'}")
    
    api_key = os.environ.get("GOOGLE_API_KEY")
    print(f"  - GOOGLE_API_KEY: {'OK' if api_key and api_key != 'YOUR_API_KEY_HERE' else 'MISSING (for OCR)'}")
    print()

    for pdf_path in args.pdf_files:
        print(f"[pdf_to_md] Processing: {os.path.basename(pdf_path)}")
        pdf_to_markdown(
            pdf_path,
            args.output_dir,
            args.page_markers,
            args.force_ocr,
        )
        print()


if __name__ == "__main__":
    main()
