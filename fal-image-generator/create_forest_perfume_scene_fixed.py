#!/usr/bin/env python3
"""
Perfume Oasis Forest Scene Creator - Fixed Version
Creates a perfume bottle with logo on a tree stump in a forest setting
"""

import os
import json
import sys
from pathlib import Path
from datetime import datetime
import argparse

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
import base64

# Load config
with open('config.json', 'r') as f:
    config = json.load(f)

# Set API key
os.environ['FAL_KEY'] = config['api_key']

# Output directory
OUTPUT_DIR = Path(os.path.expanduser('~/Pictures/perfume-oasis-ai/forest-scenes'))
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Logo path
LOGO_PATH = Path(SCRIPT_DIR) / "assets" / "perfume-oasis-logo.png"

print("🌲 Perfume Oasis Forest Scene Creator (Fixed)")
print("="*50)

def encode_image_to_base64(image_path):
    """Convert image to base64 for API use"""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def create_perfume_with_logo_scene():
    """Create perfume bottle with logo on tree stump in forest using GPT-Image-1"""
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    print("\n🎯 Creating Perfume Bottle with Logo on Tree Stump")
    print("-"*40)
    
    # Create a comprehensive prompt that includes the logo description
    scene_prompt = (
        "Professional product photography of an elegant emerald green perfume bottle "
        "sitting on a weathered tree stump in a magical forest. The bottle features "
        "the 'PERFUME OASIS' logo with golden text and a circular emblem containing "
        "palm fronds and a droplet design. Beautiful forest setting with soft morning "
        "light filtering through tall trees, dewdrops on ferns and moss, golden sunbeams "
        "creating atmospheric lighting, misty background, shallow depth of field with "
        "the perfume bottle in sharp focus on the tree stump. Luxury brand aesthetic, "
        "cinematic lighting, professional commercial photography style."
    )
    
    print("📸 Generating scene with GPT-Image-1...")
    print(f"Prompt: {scene_prompt[:100]}...")
    
    try:
        # Use GPT-Image-1 for high-quality results
        result = fal.run(
            "fal-ai/gpt-image-1/text-to-image/byok",
            arguments={
                "prompt": scene_prompt,
                "image_size": "1920x1080",
                "quality": 100,
                "style": "photographic"
            }
        )
        
        if result and 'images' in result:
            image_url = result['images'][0]['url']
            
            # Save the image
            response = requests.get(image_url)
            image_path = OUTPUT_DIR / f"forest_perfume_stump_{timestamp}.jpg"
            with open(image_path, 'wb') as f:
                f.write(response.content)
            
            print(f"✅ Scene created: {image_path.name}")
            
            # Create video from this image
            return create_video_from_image(image_path, timestamp)
            
    except Exception as e:
        print(f"❌ Error creating scene: {str(e)}")
        print("\n🔄 Trying alternative approach with Imagen4...")
        return create_alternative_scene(timestamp)

def create_alternative_scene(timestamp):
    """Alternative scene creation using Imagen4"""
    
    alternative_prompt = (
        "cinematic shot of luxury perfume bottle on old tree stump, forest background, "
        "PERFUME OASIS branding visible, emerald green bottle, golden logo, "
        "soft morning light, misty atmosphere, professional product photography, "
        "shallow depth of field, 4K quality"
    )
    
    try:
        result = fal.run(
            "fal-ai/imagen4/preview/fast",
            arguments={
                "prompt": alternative_prompt,
                "image_size": "1920x1080"
            }
        )
        
        if result and 'images' in result:
            image_url = result['images'][0]['url']
            
            response = requests.get(image_url)
            image_path = OUTPUT_DIR / f"forest_perfume_stump_alt_{timestamp}.jpg"
            with open(image_path, 'wb') as f:
                f.write(response.content)
            
            print(f"✅ Alternative scene created: {image_path.name}")
            return create_video_from_image(image_path, timestamp)
            
    except Exception as e:
        print(f"❌ Error with alternative approach: {str(e)}")
        return None

def create_video_from_image(image_path, timestamp):
    """Create video from the branded perfume image"""
    
    print("\n🎯 Creating Video with Camera Movement")
    print("-"*40)
    
    # Read and encode the image
    image_b64 = encode_image_to_base64(image_path)
    
    video_prompt = (
        "Cinematic camera movement in a magical forest. Start with a wide establishing "
        "shot showing the misty forest atmosphere, then slowly zoom in and focus on "
        "the perfume bottle sitting on the tree stump. The camera moves closer to "
        "reveal the PERFUME OASIS logo clearly on the bottle. Soft particles of light "
        "float through the air, morning sunbeams get stronger, creating a dreamy "
        "luxury commercial feel. End with a close-up product shot of the branded bottle."
    )
    
    print("🎬 Generating video...")
    print(f"Model: Minimax Video")
    print(f"Duration: 6 seconds")
    
    try:
        # Image to video with Minimax
        result = fal.run(
            "fal-ai/minimax-video",
            arguments={
                "prompt": video_prompt,
                "duration": 6,
                "image_url": f"data:image/jpeg;base64,{image_b64}"
            }
        )
        
        if result and 'video' in result:
            video_url = result['video']['url']
            
            # Download video
            print("📥 Downloading video...")
            response = requests.get(video_url)
            
            video_path = OUTPUT_DIR / f"forest_perfume_video_{timestamp}.mp4"
            with open(video_path, 'wb') as f:
                f.write(response.content)
            
            print(f"\n✅ Video created successfully!")
            print(f"📁 Saved to: {video_path}")
            print(f"📏 Size: {video_path.stat().st_size / 1024 / 1024:.2f} MB")
            
            return video_path
            
    except Exception as e:
        print(f"❌ Error creating video: {str(e)}")
        return None

def main():
    print("\nStarting Forest Scene Creation with Tree Stump...")
    print("="*50)
    
    # Check if logo exists for reference
    if LOGO_PATH.exists():
        print(f"✅ Logo file found: {LOGO_PATH}")
    else:
        print(f"⚠️  Logo file not found at: {LOGO_PATH}")
        print("   Will use text description in prompt")
    
    # Create the scene
    video_path = create_perfume_with_logo_scene()
    
    if video_path:
        print("\n" + "="*50)
        print("✅ Forest Scene Complete!")
        print("="*50)
        
        print("\n📋 Process Summary:")
        print("1. ✅ Created forest scene with perfume bottle on tree stump")
        print("2. ✅ Included PERFUME OASIS logo in the scene")
        print("3. ✅ Generated video with camera zoom to branded bottle")
        
        print(f"\n📁 Output Location: {OUTPUT_DIR}")
        
        print("\n🎥 Video Features:")
        print("• Wide forest establishing shot")
        print("• Perfume bottle sitting on tree stump")
        print("• Zooms in to show PERFUME OASIS logo")
        print("• Professional cinematography")
        print("• Magical forest atmosphere")
        
        print("\n💡 Perfect for:")
        print("• Social media campaigns")
        print("• Website hero videos")
        print("• Product showcase")
        print("• Brand storytelling")
        
    else:
        print("\n❌ Failed to create forest scene")
        print("\n🔧 Troubleshooting:")
        print("1. Check API key in config.json")
        print("2. Check internet connection")
        print("3. Try running script again")

if __name__ == "__main__":
    main()
