import os
import base64
import requests
import json
import shutil
from pathlib import Path

# Configuration
API_KEY = "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"
SOURCE_DIR = "/Users/mac/Downloads/Perfume images"
OUTPUT_DIR = "/Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/renamed_images"

# Create output directory
os.makedirs(OUTPUT_DIR, exist_ok=True)

def encode_image(image_path):
    """Encode image to base64"""
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode('utf-8')

def analyze_image_with_vision(image_path):
    """Analyze single image using vision API"""
    base64_image = encode_image(image_path)
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    prompt = """Analyze this perfume image. Extract:
1. Brand name (if visible)
2. Product name
3. Type (Eau de Parfum/EDT/etc)
4. Size in ml (if visible)
5. Gender (Men/Women/Unisex)

If it's a logo, identify the brand.

Return ONLY JSON like:
{"brand": "Dior", "product": "Sauvage", "type": "EDT", "size": "100", "gender": "Men"}
or
{"type": "logo", "brand": "Brand Name"}"""
    
    data = {
        "model": "qwen/qwen-2-vl-7b-instruct",
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
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=data,
            timeout=30
        )
        
        if response.status_code == 200:
            content = response.json()['choices'][0]['message']['content']
            # Extract JSON from response
            start = content.find('{')
            end = content.rfind('}') + 1
            if start >= 0 and end > 0:
                return json.loads(content[start:end])
        else:
            # Try Gemini as fallback
            data["model"] = "google/gemini-flash-1.5-8b"
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=data,
                timeout=30
            )
            if response.status_code == 200:
                content = response.json()['choices'][0]['message']['content']
                start = content.find('{')
                end = content.rfind('}') + 1
                if start >= 0 and end > 0:
                    return json.loads(content[start:end])
    except Exception as e:
        print(f"Error: {e}")
    
    return None

# Get all images
all_images = sorted([f for f in os.listdir(SOURCE_DIR) if f.endswith(('.jpg', '.jpeg', '.png', '.JPG', '.PNG'))])

print(f"Found {len(all_images)} images to process\n")

results = []
product_list = []

for i, img_name in enumerate(all_images, 1):
    img_path = os.path.join(SOURCE_DIR, img_name)
    print(f"[{i}/{len(all_images)}] Analyzing: {img_name}")
    
    analysis = analyze_image_with_vision(img_path)
    
    if analysis:
        print(f"  Result: {json.dumps(analysis)}")
        
        # Generate filename
        if analysis.get('type') == 'logo':
            new_name = f"{analysis.get('brand', 'unknown').lower().replace(' ', '-')}-logo"
        else:
            parts = []
            if analysis.get('brand'):
                parts.append(analysis['brand'].lower().replace(' ', '-'))
            if analysis.get('product'):
                parts.append(analysis['product'].lower().replace(' ', '-'))
            if analysis.get('type'):
                type_clean = analysis['type'].lower().replace('eau de ', '').replace(' ', '-')
                parts.append(type_clean)
            if analysis.get('size'):
                parts.append(f"{analysis['size']}ml")
            if analysis.get('gender'):
                parts.append(analysis['gender'].lower())
            
            new_name = '-'.join(parts) if parts else f"unknown-{img_name}"
            
            # Add to product list
            if analysis.get('brand') and analysis.get('product'):
                product_list.append({
                    "brand": analysis.get('brand'),
                    "product": analysis.get('product'),
                    "type": analysis.get('type', ''),
                    "size": analysis.get('size', ''),
                    "gender": analysis.get('gender', ''),
                    "original_image": img_name,
                    "new_image": f"{new_name}{Path(img_path).suffix}"
                })
        
        # Add extension
        ext = Path(img_path).suffix
        final_name = f"{new_name}{ext}"
        
        # Handle duplicates
        counter = 1
        new_path = os.path.join(OUTPUT_DIR, final_name)
        while os.path.exists(new_path):
            base_name = new_name
            new_path = os.path.join(OUTPUT_DIR, f"{base_name}-{counter}{ext}")
            final_name = f"{base_name}-{counter}{ext}"
            counter += 1
        
        # Copy file
        shutil.copy2(img_path, new_path)
        
        print(f"  Renamed to: {final_name}")
        
        results.append({
            "original": img_name,
            "renamed": final_name,
            "analysis": analysis
        })
    else:
        print("  Failed to analyze")
        results.append({"original": img_name, "error": "Failed to analyze"})

# Save results
with open(os.path.join(OUTPUT_DIR, "analysis_results.json"), 'w') as f:
    json.dump(results, f, indent=2)

# Save product list
with open(os.path.join(OUTPUT_DIR, "product_list.json"), 'w') as f:
    json.dump(product_list, f, indent=2)

print(f"\n\nComplete! Processed {len(results)} images")
print(f"Successfully renamed: {len([r for r in results if 'renamed' in r])}")
print(f"Products identified: {len(product_list)}")
print(f"\nResults saved to: {OUTPUT_DIR}")
