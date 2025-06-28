#!/usr/bin/env python3
"""
Perfume Oasis Image Analyzer
Analyzes perfume product images using Vision AI
"""

import os
import base64
import requests
import json
import shutil
from pathlib import Path
from datetime import datetime

# Configuration
API_KEY = "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"
SOURCE_DIR = "/Users/mac/Downloads/Perfume images"
OUTPUT_DIR = "/Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/renamed_images"
API_URL = "https://openrouter.ai/api/v1/chat/completions"

def encode_image(image_path):
    """Encode image to base64"""
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode('utf-8')

def analyze_image(image_path, use_gemini=False):
    """Analyze image using Vision AI"""
    base64_image = encode_image(image_path)
    
    model = "google/gemini-flash-1.5-8b" if use_gemini else "qwen/qwen-2-vl-7b-instruct"
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    prompt = """You are analyzing a perfume product image. Extract:
1. Brand name
2. Product/perfume name
3. Type (Eau de Parfum/Toilette)
4. Size in ml
5. Gender (Men/Women/Unisex)

Return ONLY a JSON object like:
{"brand": "Dior", "product": "Sauvage", "type": "EDT", "size": "100", "gender": "Men"}

If it's a logo, return:
{"type": "logo", "brand": "Brand Name"}"""
    
    data = {
        "model": model,
        "messages": [{
            "role": "user",
            "content": [
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
            ]
        }],
        "temperature": 0.1,
        "max_tokens": 200
    }
    
    try:
        response = requests.post(API_URL, headers=headers, json=data, timeout=30)
        if response.status_code == 200:
            content = response.json()['choices'][0]['message']['content']
            # Extract JSON
            start = content.find('{')
            end = content.rfind('}') + 1
            if start >= 0 and end > 0:
                return json.loads(content[start:end])
    except Exception as e:
        print(f"Error: {e}")
    
    return None

def generate_filename(data):
    """Generate filename from analysis data"""
    if not data:
        return None
    
    if data.get('type') == 'logo':
        return f"{data.get('brand', 'unknown').lower().replace(' ', '-')}-logo"
    
    parts = []
    if data.get('brand'):
        parts.append(data['brand'].lower().replace(' ', '-'))
    if data.get('product'):
        parts.append(data['product'].lower().replace(' ', '-'))
    if data.get('type'):
        parts.append(data['type'].lower())
    if data.get('size'):
        parts.append(f"{data['size']}ml")
    if data.get('gender'):
        parts.append(data['gender'].lower())
    
    return '-'.join(parts) if parts else None

def process_images():
    """Process all images"""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Get all images
    images = list(Path(SOURCE_DIR).glob('*.[jp][pn]g'))
    total = len(images)
    
    print(f"Found {total} images to process\n")
    
    results = []
    
    for i, img_path in enumerate(images, 1):
        print(f"[{i}/{total}] Processing: {img_path.name}")
        
        # Try Qwen first, then Gemini
        analysis = analyze_image(str(img_path))
        if not analysis:
            print("  → Trying Gemini...")
            analysis = analyze_image(str(img_path), use_gemini=True)
        
        if analysis:
            filename = generate_filename(analysis)
            if filename:
                # Add extension
                new_name = f"{filename}{img_path.suffix}"
                new_path = Path(OUTPUT_DIR) / new_name
                
                # Handle duplicates
                counter = 1
                while new_path.exists():
                    base = new_name.rsplit('.', 1)[0]
                    ext = img_path.suffix
                    new_path = Path(OUTPUT_DIR) / f"{base}-{counter}{ext}"
                    counter += 1
                
                # Copy file
                shutil.copy2(img_path, new_path)
                print(f"  ✓ Renamed to: {new_path.name}")
                
                results.append({
                    "original": img_path.name,
                    "renamed": new_path.name,
                    "analysis": analysis
                })
            else:
                print("  ✗ Could not generate filename")
                results.append({
                    "original": img_path.name,
                    "error": "No filename generated",
                    "analysis": analysis
                })
        else:
            print("  ✗ Analysis failed")
            results.append({
                "original": img_path.name,
                "error": "Analysis failed"
            })
    
    # Save results
    results_file = Path(OUTPUT_DIR) / "analysis_results.json"
    with open(results_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    # Summary
    successful = sum(1 for r in results if 'renamed' in r)
    print(f"\n{'='*50}")
    print(f"Complete! {successful}/{total} images renamed")
    print(f"Results saved to: {results_file}")
    print(f"Images saved to: {OUTPUT_DIR}")

if __name__ == "__main__":
    process_images()
