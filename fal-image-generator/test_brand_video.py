#!/usr/bin/env python3
"""
Perfume Oasis Brand Video Test
Testing video generation with logo integration
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

# Load config
with open('config.json', 'r') as f:
    config = json.load(f)

# Set API key
os.environ['FAL_KEY'] = config['api_key']

# Brand configuration
BRAND_COLORS = {
    'emerald': '#0E5C4A',
    'gold': '#C8A95B',
    'sand': '#F6F3EF'
}

LOGO_PATH = Path(SCRIPT_DIR) / 'assets' / 'perfume-oasis-logo.png'
OUTPUT_DIR = Path(os.path.expanduser('~/Pictures/perfume-oasis-ai/videos'))
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

print("🎬 Perfume Oasis Brand Video Test")
print("="*50)

# Video models available
VIDEO_MODELS = {
    'hailuo': {
        'api': 'fal-ai/minimax-video/generate',
        'name': 'Hailuo AI (MiniMax)',
        'cost_per_second': 0.045,
        'durations': [6, 10],
        'supports_image': True
    },
    'cogvideox': {
        'api': 'fal-ai/cogvideox-5b/video',
        'name': 'CogVideoX-5B', 
        'cost_per_second': 0.03,
        'max_duration': 6,
        'supports_image': False
    },
    'luma': {
        'api': 'fal-ai/luma-dream-machine',
        'name': 'Luma Dream Machine',
        'cost_per_second': 0.08,
        'duration': 5,
        'supports_image': True
    }
}

print("\n📊 Available Video Models:")
for model_key, model_info in VIDEO_MODELS.items():
    print(f"\n{model_key}:")
    print(f"  - Name: {model_info['name']}")
    print(f"  - Cost: ${model_info['cost_per_second']}/second")
    print(f"  - Image support: {model_info.get('supports_image', False)}")

# Test scenarios
print("\n🧪 Test Scenarios:")
print("\n1. Text-to-Video with Brand Elements")
print("2. Image-to-Video with Logo (if supported)")
print("3. Brand Campaign Video")

def generate_brand_prompt(base_prompt):
    """Enhance prompt with brand elements"""
    return f"{base_prompt}, luxury aesthetic with emerald green ({BRAND_COLORS['emerald']}) and gold ({BRAND_COLORS['gold']}) accents, elegant lighting"

def test_text_to_video():
    """Test 1: Generate video from text prompt"""
    print("\n\n🎬 Test 1: Text-to-Video Generation")
    print("-"*40)
    
    prompt = generate_brand_prompt("elegant perfume bottle on rotating platform, studio lighting")
    model = 'hailuo'  # Using Hailuo for this test
    duration = 6
    
    print(f"Model: {VIDEO_MODELS[model]['name']}")
    print(f"Duration: {duration} seconds")
    print(f"Prompt: {prompt}")
    print(f"Estimated cost: ${VIDEO_MODELS[model]['cost_per_second'] * duration}")
    
    try:
        print("\n🔄 Generating video...")
        
        result = fal.run(
            VIDEO_MODELS[model]['api'],
            arguments={
                "prompt": prompt,
                "duration": duration
            }
        )
        
        if result and 'video' in result:
            # Download and save video
            video_url = result['video']['url']
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_path = OUTPUT_DIR / f"brand_test_text_{model}_{timestamp}.mp4"
            
            import requests
            response = requests.get(video_url)
            with open(output_path, 'wb') as f:
                f.write(response.content)
            
            print(f"✅ Video saved to: {output_path}")
            print(f"Size: {output_path.stat().st_size / 1024 / 1024:.2f} MB")
            return output_path
        else:
            print("❌ No video URL in response")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return None

def test_image_to_video_with_logo():
    """Test 2: Generate video from image (logo integration)"""
    print("\n\n🎬 Test 2: Image-to-Video with Logo")
    print("-"*40)
    
    if not LOGO_PATH.exists():
        print(f"❌ Logo not found at {LOGO_PATH}")
        return None
    
    model = 'hailuo'  # Hailuo supports image-to-video
    duration = 6
    prompt = "camera slowly panning around luxury perfume bottle, elegant lighting, premium aesthetic"
    
    print(f"Model: {VIDEO_MODELS[model]['name']}")
    print(f"Logo: {LOGO_PATH.name}")
    print(f"Motion prompt: {prompt}")
    
    # Note: For actual logo integration, you might need to:
    # 1. First generate a product shot with logo using GPT-Image-1 edit
    # 2. Then use that as input for video generation
    
    print("\n📝 Logo Integration Strategy:")
    print("1. Use GPT-Image-1 Edit to add logo to product image")
    print("2. Use resulting image as input for video generation")
    print("3. This ensures brand consistency in video")
    
    # For now, we'll demonstrate the video model being used
    print(f"\n🎯 Would use: {VIDEO_MODELS[model]['api']}")
    print(f"With image input support: {VIDEO_MODELS[model]['supports_image']}")

def test_campaign_video():
    """Test 3: Full brand campaign video"""
    print("\n\n🎬 Test 3: Brand Campaign Video")
    print("-"*40)
    
    # For campaign videos, we might want to use Luma for higher quality
    model = 'luma'
    
    prompt = generate_brand_prompt(
        "cinematic perfume commercial, bottle emerging from emerald silk, "
        "golden particles floating, text 'Perfume Oasis' appearing elegantly"
    )
    
    print(f"Model: {VIDEO_MODELS[model]['name']} (Premium)")
    print(f"Duration: {VIDEO_MODELS[model]['duration']} seconds")
    print(f"Prompt: {prompt}")
    print(f"Estimated cost: ${VIDEO_MODELS[model]['cost_per_second'] * VIDEO_MODELS[model]['duration']}")
    
    print("\n💡 Campaign Video Best Practices:")
    print("- Include brand colors in prompt")
    print("- Mention text/logo appearance for branding")
    print("- Use cinematic keywords for premium feel")
    print("- Consider Luma for highest quality output")

# Run tests
if __name__ == "__main__":
    print("\n" + "="*50)
    print("Starting Brand Video Tests")
    print("="*50)
    
    # Test 1: Basic text-to-video
    video_path = test_text_to_video()
    
    # Test 2: Logo integration explanation
    test_image_to_video_with_logo()
    
    # Test 3: Campaign video strategy
    test_campaign_video()
    
    print("\n\n📊 Summary:")
    print(f"✅ Output directory: {OUTPUT_DIR}")
    print(f"✅ Logo available at: {LOGO_PATH}")
    print("\n🎯 Recommended Workflow:")
    print("1. For quick videos: Use Hailuo (good quality, reasonable cost)")
    print("2. For logo integration: GPT-Image-1 Edit → Hailuo/Luma")
    print("3. For premium campaigns: Use Luma Dream Machine")
    print("4. For budget options: Use CogVideoX")
