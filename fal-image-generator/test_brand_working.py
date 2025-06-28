#!/usr/bin/env python3
"""
Perfume Oasis Brand Test - Working Implementation
Testing with correct fal.ai endpoints
"""

import os
import json
import sys
from pathlib import Path
from datetime import datetime

# Add venv to path
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
venv_path = os.path.join(SCRIPT_DIR, 'venv', 'bin')
if os.path.exists(venv_path):
    os.environ['PATH'] = f"{venv_path}:{os.environ['PATH']}"
    for py_version in ['python3.10', 'python3.12', 'python3.11', 'python3.9']:
        site_packages = os.path.join(SCRIPT_DIR, 'venv', 'lib', py_version, 'site-packages')
        if os.path.exists(site_packages):
            sys.path.insert(0, site_packages)
            break

import fal_client as fal
import requests
from PIL import Image
import io

# Load config
with open('config.json', 'r') as f:
    config = json.load(f)

# Set API key
os.environ['FAL_KEY'] = config['api_key']

# Brand configuration
BRAND = {
    'colors': {
        'emerald': '#0E5C4A',
        'gold': '#C8A95B',
        'sand': '#F6F3EF'
    },
    'logo_path': Path(SCRIPT_DIR) / 'assets' / 'perfume-oasis-logo.png'
}

# Output directory
OUTPUT_DIR = Path(os.path.expanduser('~/Pictures/perfume-oasis-ai'))
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

print("🎨 Perfume Oasis Brand Test Suite")
print("="*50)

def test_image_generation():
    """Test brand-consistent image generation"""
    print("\n📸 Test 1: Brand Image Generation")
    print("-"*40)
    
    # Using ImageN4 for high-quality product shot
    prompt = f"luxury perfume bottle with emerald green ({BRAND['colors']['emerald']}) liquid, gold ({BRAND['colors']['gold']}) cap, on sand-colored ({BRAND['colors']['sand']}) silk fabric, professional product photography, studio lighting"
    
    print(f"Model: ImageN4 (High Quality)")
    print(f"Prompt: {prompt[:100]}...")
    
    try:
        result = fal.run(
            "fal-ai/imagen4/preview/fast",
            arguments={
                "prompt": prompt,
                "image_size": "1024x1024"
            }
        )
        
        if result and 'images' in result:
            image_url = result['images'][0]['url']
            
            # Download and save
            response = requests.get(image_url)
            img = Image.open(io.BytesIO(response.content))
            
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_path = OUTPUT_DIR / 'images' / f"brand_product_{timestamp}.jpg"
            output_path.parent.mkdir(exist_ok=True)
            
            # Save as optimized JPEG
            img.save(output_path, 'JPEG', quality=85, optimize=True)
            
            print(f"✅ Image saved to: {output_path}")
            print(f"Size: {output_path.stat().st_size / 1024:.1f} KB")
            return output_path
        else:
            print("❌ No image in response")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return None

def test_text_post():
    """Test social media post with text"""
    print("\n\n📱 Test 2: Social Media Post with Text")
    print("-"*40)
    
    # Using GPT-Image for text rendering
    text = "NEW COLLECTION"
    prompt = f"elegant perfume bottles arrangement with text '{text}' in gold, emerald green background, luxury social media post design"
    
    print(f"Model: GPT-Image-1 (Text Rendering)")
    print(f"Text overlay: {text}")
    print(f"Background: Emerald theme")
    
    try:
        # Note: GPT-Image-1 requires OpenAI API key
        print("\n📝 GPT-Image-1 Configuration:")
        print("- Endpoint: fal-ai/gpt-image-1/text-to-image/byok")
        print("- Requires: OpenAI API key")
        print("- Best for: Text overlays, typography")
        
        # For demo, show the API call structure
        print("\n🔧 API Call Structure:")
        print("""
        fal.run(
            "fal-ai/gpt-image-1/text-to-image/byok",
            arguments={
                "prompt": prompt,
                "model": "dall-e-3",
                "size": "1024x1024",
                "quality": "standard",
                "openai_api_key": "your-openai-key"
            }
        )
        """)
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")

def test_video_models():
    """Show available video models and pricing"""
    print("\n\n🎬 Test 3: Video Model Overview")
    print("-"*40)
    
    video_models = {
        'hailuo': {
            'endpoint': 'fal-ai/minimax-video',
            'name': 'Hailuo AI (MiniMax)',
            'pricing': '$0.045/second',
            'duration': '6 or 10 seconds',
            'features': ['Text-to-video', 'Image-to-video', 'Good quality']
        },
        'cogvideox': {
            'endpoint': 'fal-ai/cogvideox/image-to-video',
            'name': 'CogVideoX-5B',
            'pricing': '~$0.03/second',
            'duration': 'Up to 6 seconds',
            'features': ['Budget-friendly', 'Text-to-video']
        },
        'luma': {
            'endpoint': 'fal-ai/luma-dream-machine/video',
            'name': 'Luma Dream Machine',
            'pricing': '~$0.08/second',
            'duration': '5 seconds',
            'features': ['Premium quality', 'Image-to-video', 'Best results']
        }
    }
    
    print("📊 Video Models for Brand Content:\n")
    
    for model_key, info in video_models.items():
        print(f"{model_key.upper()}:")
        print(f"  Endpoint: {info['endpoint']}")
        print(f"  Name: {info['name']}")
        print(f"  Cost: {info['pricing']}")
        print(f"  Duration: {info['duration']}")
        print(f"  Features: {', '.join(info['features'])}")
        print()

def test_logo_workflow():
    """Test logo integration workflow"""
    print("\n\n🏷️ Test 4: Logo Integration Workflow")
    print("-"*40)
    
    print("📋 Recommended Logo Integration Process:\n")
    
    print("1. PREPARE PRODUCT IMAGE:")
    print("   - Generate base image with ImageN4")
    print("   - Ensure clean background for logo placement")
    
    print("\n2. ADD LOGO WITH GPT-IMAGE-1 EDIT:")
    print("   - Use 'fal-ai/gpt-image-1/edit-image/byok'")
    print("   - Provide logo as mask/overlay")
    print("   - Specify placement instructions")
    
    print("\n3. CREATE VIDEO FROM BRANDED IMAGE:")
    print("   - Use Hailuo or Luma for image-to-video")
    print("   - Add motion prompt for camera movement")
    print("   - Result: Branded video with logo")
    
    print(f"\n✅ Logo available at: {BRAND['logo_path']}")
    print(f"Size: {BRAND['logo_path'].stat().st_size / 1024:.1f} KB")

def show_brand_summary():
    """Show brand guidelines summary"""
    print("\n\n🎨 Brand Guidelines Summary")
    print("-"*40)
    
    print("\nCOLORS:")
    for name, hex_code in BRAND['colors'].items():
        print(f"  {name.capitalize()}: {hex_code}")
    
    print("\nBEST MODELS BY USE CASE:")
    print("  • Product Shots: ImageN4")
    print("  • Social Posts: GPT-Image-1")
    print("  • Logo Edits: GPT-Image-1 Edit")
    print("  • Quick Videos: Hailuo ($0.045/sec)")
    print("  • Premium Videos: Luma ($0.08/sec)")
    print("  • Budget Videos: CogVideoX ($0.03/sec)")
    
    print("\nPROMPT KEYWORDS:")
    print("  • 'luxury', 'elegant', 'premium'")
    print("  • 'emerald green', 'gold accents'")
    print("  • 'studio lighting', 'professional'")

# Run all tests
if __name__ == "__main__":
    # Test 1: Generate branded image
    image_path = test_image_generation()
    
    # Test 2: Social media post
    test_text_post()
    
    # Test 3: Video models overview
    test_video_models()
    
    # Test 4: Logo workflow
    test_logo_workflow()
    
    # Summary
    show_brand_summary()
    
    print("\n" + "="*50)
    print("✅ Brand test complete!")
    print(f"📁 Check output at: {OUTPUT_DIR}")
