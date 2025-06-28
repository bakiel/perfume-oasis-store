#!/usr/bin/env python3
"""
Perfume Oasis Logo Application + Video Generation
Using GPT-1 Edit for logo application and image-to-video conversion
"""

import os
import json
import sys
from pathlib import Path
from datetime import datetime
import base64

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

# Output directory
OUTPUT_DIR = Path(os.path.expanduser('~/Pictures/perfume-oasis-ai/branded-scenes'))
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Logo path
LOGO_PATH = Path(SCRIPT_DIR) / "assets" / "perfume-oasis-logo.png"

print("🎨 Perfume Oasis Branded Scene Creator")
print("="*50)
print("\nWorkflow:")
print("1. Generate perfume in forest scene")
print("2. Apply logo using GPT-1 Edit or Flux Context")
print("3. Create video with zoom effect")
print("="*50)

def encode_image_to_base64(image_path):
    """Convert image to base64"""
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode('utf-8')

def create_branded_scene():
    """Main workflow"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Step 1: Create base perfume scene
    print("\n📸 Step 1: Creating Forest Perfume Scene")
    print("-"*40)
    
    scene_prompt = (
        "luxury emerald green perfume bottle on moss-covered rock in enchanted forest, "
        "morning sunlight filtering through trees creating golden rays, "
        "dewdrops sparkling on leaves, mystical atmosphere with soft fog, "
        "bottle in sharp focus with blurred forest background, "
        "professional product photography style, cinematic lighting"
    )
    
    print(f"Prompt: {scene_prompt[:100]}...")
    
    try:
        # Generate with ImageN4
        result = fal.run(
            "fal-ai/imagen4/preview/fast",
            arguments={
                "prompt": scene_prompt,
                "image_size": "1920x1080"
            }
        )
        
        if not result or 'images' not in result:
            print("❌ Failed to generate base scene")
            return None
        
        # Save base image
        base_url = result['images'][0]['url']
        response = requests.get(base_url)
        base_path = OUTPUT_DIR / f"base_scene_{timestamp}.jpg"
        
        with open(base_path, 'wb') as f:
            f.write(response.content)
        
        print(f"✅ Base scene saved: {base_path.name}")
        
        # Step 2: Apply logo
        print("\n🏷️ Step 2: Applying Perfume Oasis Logo")
        print("-"*40)
        
        # Note about GPT-1 Edit
        print("⚠️ Note: GPT-1 Edit requires OpenAI API key (BYOK)")
        print("Using Flux Context as alternative...")
        
        # Apply logo with Flux Context
        logo_prompt = (
            "Add the Perfume Oasis logo to the perfume bottle. "
            "The logo should be elegantly placed on the front of the bottle, "
            "appearing as if professionally printed or etched on the glass. "
            "Keep the emerald green color and forest setting intact."
        )
        
        # Encode images
        base_b64 = encode_image_to_base64(base_path)
        logo_b64 = encode_image_to_base64(LOGO_PATH)
        
        result = fal.run(
            "fal-ai/flux-pro/kontext",
            arguments={
                "prompt": logo_prompt,
                "images": [
                    {"url": f"data:image/jpeg;base64,{base_b64}"},
                    {"url": f"data:image/png;base64,{logo_b64}"}
                ]
            }
        )
        
        if not result or 'images' not in result:
            print("❌ Failed to apply logo")
            return None
        
        # Save branded image
        branded_url = result['images'][0]['url']
        response = requests.get(branded_url)
        branded_path = OUTPUT_DIR / f"branded_scene_{timestamp}.jpg"
        
        with open(branded_path, 'wb') as f:
            f.write(response.content)
        
        print(f"✅ Logo applied: {branded_path.name}")
        
        # Step 3: Create video
        print("\n🎬 Step 3: Creating Video with Camera Movement")
        print("-"*40)
        
        video_prompt = (
            "Cinematic camera movement through magical forest, "
            "slowly zooming in on the elegant perfume bottle, "
            "revealing the Perfume Oasis logo clearly, "
            "golden particles floating in sunbeams, "
            "professional product showcase with smooth camera work"
        )
        
        print("Model: Hailuo AI (image-to-video)")
        print("Duration: 6 seconds")
        print("Cost: $0.27")
        
        # Encode branded image for video
        branded_b64 = encode_image_to_base64(branded_path)
        
        result = fal.run(
            "fal-ai/minimax-video",
            arguments={
                "prompt": video_prompt,
                "duration": 6,
                "image_url": f"data:image/jpeg;base64,{branded_b64}"
            }
        )
        
        if not result or 'video' not in result:
            print("❌ Failed to create video")
            return None
        
        # Save video
        video_url = result['video']['url']
        response = requests.get(video_url)
        video_path = OUTPUT_DIR / f"branded_video_{timestamp}.mp4"
        
        with open(video_path, 'wb') as f:
            f.write(response.content)
        
        print(f"✅ Video saved: {video_path.name}")
        print(f"📏 Size: {video_path.stat().st_size / 1024 / 1024:.2f} MB")
        
        return {
            'base_image': base_path,
            'branded_image': branded_path,
            'video': video_path
        }
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return None

def main():
    print("\n🚀 Starting branded scene creation...")
    
    # Check logo
    if not LOGO_PATH.exists():
        print(f"\n❌ Logo not found at: {LOGO_PATH}")
        print("Please ensure perfume-oasis-logo.png is in the assets folder")
        return
    
    # Create branded scene
    result = create_branded_scene()
    
    if result:
        print("\n" + "="*50)
        print("✅ SUCCESS! Branded Scene Complete")
        print("="*50)
        
        print("\n📁 Generated Files:")
        print(f"1. Base Scene: {result['base_image'].name}")
        print(f"2. With Logo: {result['branded_image'].name}")
        print(f"3. Video: {result['video'].name}")
        
        print(f"\n📂 Location: {OUTPUT_DIR}")
        
        print("\n🎥 Video Description:")
        print("• Beautiful forest scene with perfume")
        print("• Your logo applied to the bottle")
        print("• Camera zooms in to showcase branded product")
        print("• Professional quality output")
        
        print("\n💡 Next Steps:")
        print("• Use for social media posts")
        print("• Add to website hero section")
        print("• Include in email campaigns")
        print("• Create variations with different scenes")
        
    else:
        print("\n❌ Scene creation failed")
        print("\n🔧 Troubleshooting:")
        print("1. Check your API key in config.json")
        print("2. Ensure logo file exists and is readable")
        print("3. Check internet connection")
        print("4. Try running with smaller image size")

if __name__ == "__main__":
    main()
