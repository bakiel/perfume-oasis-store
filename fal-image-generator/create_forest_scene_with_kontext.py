#!/usr/bin/env python3
"""
Perfume Oasis Forest Scene with FLUX KONTEXT
Creates perfume bottle on tree stump with logo applied using FLUX KONTEXT
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

# Output directory - using Downloads for accessibility
OUTPUT_DIR = Path(os.path.expanduser('~/Downloads/perfume-oasis-scenes'))
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Logo path
LOGO_PATH = Path(SCRIPT_DIR) / "assets" / "perfume-oasis-logo.png"

print("🌲 Perfume Oasis Forest Scene with FLUX KONTEXT")
print("="*50)
print("\nWorkflow:")
print("1. Generate perfume on tree stump in forest")
print("2. Apply logo using FLUX KONTEXT")
print("3. Create video with zoom effect")
print("="*50)

def encode_image_to_base64(image_path):
    """Convert image to base64 URL"""
    with open(image_path, "rb") as f:
        base64_data = base64.b64encode(f.read()).decode('utf-8')
    
    # Determine the image type
    if str(image_path).lower().endswith('.png'):
        mime_type = 'image/png'
    else:
        mime_type = 'image/jpeg'
    
    return f"data:{mime_type};base64,{base64_data}"

def create_branded_forest_scene():
    """Main workflow"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Step 1: Create base perfume scene on tree stump
    print("\n📸 Step 1: Creating Forest Scene with Perfume on Tree Stump")
    print("-"*40)
    
    scene_prompt = (
        "Elegant emerald green perfume bottle sitting on a weathered tree stump "
        "in a magical enchanted forest, early morning golden sunlight streaming "
        "through tall ancient trees, rays of light creating dramatic beams, "
        "moss and ferns covering the forest floor, dewdrops sparkling on leaves, "
        "mystical fog floating between trees, the perfume bottle in sharp focus "
        "on the textured tree stump surface, blurred dreamy forest background, "
        "professional luxury product photography, cinematic lighting, high-end commercial style"
    )
    
    print(f"Prompt: {scene_prompt[:100]}...")
    
    try:
        # Generate base scene
        result = fal.run(
            "fal-ai/imagen4/preview/fast",
            arguments={
                "prompt": scene_prompt,
                "image_size": "landscape_16_9",
                "num_images": 1
            }
        )
        
        if not result or 'images' not in result:
            print("❌ Failed to generate base scene")
            return None
        
        # Save base image
        base_url = result['images'][0]['url']
        response = requests.get(base_url)
        base_path = OUTPUT_DIR / f"base_forest_stump_{timestamp}.jpg"
        
        with open(base_path, 'wb') as f:
            f.write(response.content)
        
        print(f"✅ Base scene saved: {base_path.name}")
        
        # Step 2: Apply logo with FLUX KONTEXT
        print("\n🏷️ Step 2: Applying Logo with FLUX KONTEXT")
        print("-"*40)
        
        logo_prompt = (
            "Add the Perfume Oasis logo to the perfume bottle. The logo should be "
            "elegantly placed on the front center of the emerald green bottle, "
            "appearing as if it's professionally printed or embossed on the glass surface. "
            "The golden elements of the logo should catch the forest light beautifully. "
            "Maintain the bottle's position on the tree stump and keep all the magical "
            "forest atmosphere intact. The logo must be clearly visible and properly sized."
        )
        
        print("Converting images to base64...")
        
        # Convert both images to base64 data URLs
        base_data_url = encode_image_to_base64(base_path)
        logo_data_url = encode_image_to_base64(LOGO_PATH)
        
        print("Calling FLUX KONTEXT...")
        
        # Apply logo with FLUX KONTEXT
        kontext_result = fal.run(
            "fal-ai/flux-pro/kontext",
            arguments={
                "prompt": logo_prompt,
                "image_url": base_data_url,  # Main image
                "context_url": logo_data_url,  # Logo to apply
                "num_images": 1,
                "image_size": "landscape_16_9"
            }
        )
        
        if not kontext_result or 'images' not in kontext_result:
            print("❌ Failed to apply logo with FLUX KONTEXT")
            return None
        
        # Save branded image
        branded_url = kontext_result['images'][0]['url']
        response = requests.get(branded_url)
        branded_path = OUTPUT_DIR / f"branded_forest_stump_{timestamp}.jpg"
        
        with open(branded_path, 'wb') as f:
            f.write(response.content)
        
        print(f"✅ Logo applied: {branded_path.name}")
        
        # Step 3: Create video
        print("\n🎬 Step 3: Creating Video with Zoom Effect")
        print("-"*40)
        
        video_prompt = (
            "Cinematic camera movement starting with wide shot of magical forest, "
            "slowly pushing in through golden sunbeams and floating particles, "
            "smoothly zooming towards the elegant perfume bottle on the tree stump, "
            "focusing on the Perfume Oasis logo on the bottle, revealing all the "
            "beautiful details of the branded product, professional camera work"
        )
        
        print("Model: Hailuo AI (image-to-video)")
        print("Creating 6-second video...")
        
        # Convert branded image for video
        branded_data_url = encode_image_to_base64(branded_path)
        
        video_result = fal.run(
            "fal-ai/minimax-video",
            arguments={
                "prompt": video_prompt,
                "image_url": branded_data_url,
                "duration": 6
            }
        )
        
        if not video_result or 'video' not in video_result:
            print("❌ Failed to create video")
            return {
                'base_image': base_path,
                'branded_image': branded_path,
                'video': None
            }
        
        # Save video
        video_url = video_result['video']['url']
        response = requests.get(video_url)
        video_path = OUTPUT_DIR / f"branded_video_{timestamp}.mp4"
        
        with open(video_path, 'wb') as f:
            f.write(response.content)
        
        print(f"✅ Video saved: {video_path.name}")
        
        return {
            'base_image': base_path,
            'branded_image': branded_path,
            'video': video_path
        }
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

def main():
    print("\n🚀 Starting FLUX KONTEXT branded scene creation...")
    
    # Check logo
    if not LOGO_PATH.exists():
        print(f"\n❌ Logo not found at: {LOGO_PATH}")
        return
    
    # Create branded scene
    result = create_branded_forest_scene()
    
    if result:
        print("\n" + "="*50)
        print("✅ SUCCESS! Branded Forest Scene Complete")
        print("="*50)
        
        print("\n📁 Generated Files:")
        print(f"1. Base Scene: {result['base_image'].name}")
        print(f"2. With Logo: {result['branded_image'].name}")
        if result['video']:
            print(f"3. Video: {result['video'].name}")
        
        print(f"\n📂 Location: {OUTPUT_DIR}")
        
        print("\n🎥 Scene Description:")
        print("• Perfume bottle on tree stump in magical forest")
        print("• Your Perfume Oasis logo applied to bottle")
        print("• Beautiful golden light and atmosphere")
        if result['video']:
            print("• Cinematic zoom video showcasing the product")

if __name__ == "__main__":
    main()
