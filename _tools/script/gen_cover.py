"""
Cover Image Generator for Syllabus Hack
Uses Google AI Studio (Imagen 4) REST API

Usage:
    python gen_cover.py "<prompt>" "<output_path>"

Example:
    python gen_cover.py "Cyberpunk neural network, neon green" "content/blog/method/my-article/cover.jpg"
"""

import os
import argparse
import sys
import requests
import base64
from pathlib import Path
from dotenv import load_dotenv

# Load .env from project root
script_dir = Path(__file__).resolve().parent
project_root = script_dir.parent.parent  # _tools/script -> _tools -> project root
env_path = project_root / ".env"
load_dotenv(dotenv_path=env_path, override=True)


def main():
    parser = argparse.ArgumentParser(
        description="Generate images using Google AI Studio API (Imagen 4)."
    )
    parser.add_argument("prompt", type=str, help="The prompt for image generation.")
    parser.add_argument("output_path", type=str, help="Path to save the generated image.")
    args = parser.parse_args()

    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key or api_key == "YOUR_API_KEY_HERE":
        print("Error: GOOGLE_API_KEY is not set or is still the placeholder.")
        print(f"Please edit: {env_path}")
        sys.exit(1)

    # Imagen 4 endpoint
    url = "https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict"
    
    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": api_key
    }
    
    data = {
        "instances": [
            {
                "prompt": args.prompt
            }
        ],
        "parameters": {
            "sampleCount": 1
        }
    }

    print(f"[gen_cover] Prompt: {args.prompt[:60]}...")
    print(f"[gen_cover] Output: {args.output_path}")
    print("[gen_cover] Calling Imagen 4 API...")
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=120)
        response.raise_for_status()
        
        result = response.json()
        
        if "predictions" in result and len(result["predictions"]) > 0:
            # Look for image data in various possible keys
            prediction = result["predictions"][0]
            b64_image = prediction.get("bytesBase64Encoded") or prediction.get("image", {}).get("bytesBase64Encoded")
            
            if not b64_image:
                print("[gen_cover] Error: No image data in response.")
                print(f"Response structure: {list(prediction.keys())}")
                sys.exit(1)
                
            image_data = base64.b64decode(b64_image)
            
            # Determine output path
            output_path = Path(args.output_path)
            if not output_path.is_absolute():
                output_path = project_root / output_path
            
            # Ensure directory exists
            output_path.parent.mkdir(parents=True, exist_ok=True)
            
            with open(output_path, "wb") as f:
                f.write(image_data)
                
            print(f"[gen_cover] Success! Saved to: {output_path}")
        else:
            print("[gen_cover] Error: No predictions in response.")
            print(result)
            sys.exit(1)

    except requests.exceptions.Timeout:
        print("[gen_cover] Error: Request timed out.")
        sys.exit(1)
    except requests.exceptions.HTTPError as e:
        print(f"[gen_cover] HTTP Error: {e}")
        try:
            error_detail = response.json()
            print(f"Details: {error_detail}")
        except:
            print(response.text)
        sys.exit(1)
    except Exception as e:
        print(f"[gen_cover] Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
