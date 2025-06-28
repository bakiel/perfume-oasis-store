#!/usr/bin/env python3
"""
Fixed Perfume Oasis Forest Scene with FLUX KONTEXT
Creates perfume bottle on tree stump with logo applied
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

# Load config
with open('config.json', 'r') as f:
    config = json.load(f)

# Set API key
os.environ['FAL_KEY'] = config['api_key']

# Output directory
OUTPUT_DIR = Path(os.path.expanduser('~/Downloads/perfume-oasis-scenes'))
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Logo path
LOGO_PATH = Path(SCRIPT_DIR) / "assets" / "perfume-oasis-logo.png"

print("🌲 Perfume Oasis Forest Scene - FIXED VERSION")
print("="*50)

def create_scene_with_logo():
    """Create perfume scene and apply logo"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Step 1: Create base scene
    print("\n📸 Creating base forest scene...")
    
    scene_prompt = (
        "Luxury emerald green perfume bottle sitting on a weathered tree stump "
        "in an enchanted forest. Morning sunlight filters through tall trees, "
        "creating golden rays and magical atmosphere. The bottle is perfectly "
        "placed on the tree stump surface, surrounded by moss and ferns. "
        "Professional product photography, shallow depth of field."
    )
    
    try:
        # Generate base scene with FLUX
        result = fal.run(
            "fal-ai/flux/dev",
            arguments={
                "prompt": scene_prompt,
                "image_size": "landscape_16_9",
                "num_inference_steps": 28,
                "guidance_scale": 3.5,
                "num_images": 1,
                "enable_safety_checker": True
            }
        )
        
        if not result or 'images' not in result:
            print("❌ Failed to generate base scene")
            return None
        
        # Download base image
        base_url = result['images'][0]['url']
        response = requests.get(base_url)
        base_path = OUTPUT_DIR / f"base_scene_{timestamp}.jpg"
        
        with open(base_path, 'wb') as f:
            f.write(response.content)
        
        print(f"✅ Base scene saved: {base_path.name}")
        
        # Step 2: Apply logo with FLUX KONTEXT
        print("\n🏷️ Applying logo with FLUX KONTEXT...")
        
        # Upload images to fal
        with open(LOGO_PATH, 'rb') as f:
            logo_data = f.read()
        logo_url = fal.upload(logo_data, "image/png")
        
        with open(base_path, 'rb') as f:
            base_data = f.read()
        base_uploaded = fal.upload(base_data, "image/jpeg")
        
        # FLUX KONTEXT prompt
        kontext_prompt = (
            "Apply the Perfume Oasis logo to the emerald green perfume bottle. "
            "The logo should appear professionally printed on the bottle's surface, "
            "centered and clearly visible. The golden parts of the logo should catch "
            "the forest light. Keep all other elements exactly the same."
        )
        
        # Try FLUX PRO KONTEXT first
        try:
            kontext_result = fal.run(
                "fal-ai/flux-pro/v1.1",
                arguments={
                    "prompt": kontext_prompt,
                    "image_url": base_uploaded,
                    "loras": [{
                        "path": logo_url,
                        "scale": 1.0
                    }],
                    "image_size": "landscape_16_9",
                    "num_inference_steps": 28,
                    "guidance_scale": 3.5,
                    "num_images": 1
                }
            )
        except:
            # Fallback to FLUX DEV with control net
            print("Trying alternative approach...")
            kontext_result = fal.run(
                "fal-ai/flux/dev",
                arguments={
                    "prompt": f"{kontext_prompt} [IMG]{logo_url}[/IMG]",
                    "image_url": base_uploaded,
                    "image_size": "landscape_16_9",
                    "num_inference_steps": 28,
                    "guidance_scale": 3.5,
                    "num_images": 1,
                    "enable_safety_checker": True
                }
            )
        
        if not kontext_result or 'images' not in kontext_result:
            print("❌ Failed to apply logo")
            return {'base': base_path, 'branded': None, 'video': None}
        
        # Save branded image
        branded_url = kontext_result['images'][0]['url']
        response = requests.get(branded_url)
        branded_path = OUTPUT_DIR / f"branded_scene_{timestamp}.jpg"
        
        with open(branded_path, 'wb') as f:
            f.write(response.content)
        
        print(f"✅ Branded scene saved: {branded_path.name}")
        
        # Step 3: Create video
        print("\n🎬 Creating video...")
        
        video_prompt = (
            "Camera slowly zooms in through the magical forest toward the perfume bottle "
            "on the tree stump, revealing the Perfume Oasis logo clearly. Smooth cinematic "
            "movement with particles floating in sunbeams."
        )
        
        # Upload branded image for video
        with open(branded_path, 'rb') as f:
            branded_data = f.read()
        branded_for_video = fal.upload(branded_data, "image/jpeg")
        
        video_result = fal.run(
            "fal-ai/minimax/video-01",
            arguments={
                "prompt": video_prompt,
                "first_frame_image": branded_for_video
            }
        )
        
        if video_result and 'video' in video_result and 'url' in video_result['video']:
            video_url = video_result['video']['url']
            response = requests.get(video_url)
            video_path = OUTPUT_DIR / f"branded_video_{timestamp}.mp4"
            
            with open(video_path, 'wb') as f:
                f.write(response.content)
            
            print(f"✅ Video saved: {video_path.name}")
        else:
            print("❌ Failed to create video")
            video_path = None
        
        return {
            'base': base_path,
            'branded': branded_path,
            'video': video_path
        }
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

def main():
    print("\n🚀 Starting scene creation...")
    
    # Check logo exists
    if not LOGO_PATH.exists():
        print(f"\n❌ Logo not found at: {LOGO_PATH}")
        print("Please ensure perfume-oasis-logo.png is in the assets folder")
        return
    
    result = create_scene_with_logo()
    
    if result:
        print("\n" + "="*50)
        print("✅ SUCCESS! Scene Complete")
        print("="*50)
        print(f"\n📂 Files saved to: {OUTPUT_DIR}")
        
        if result['base']:
            print(f"• Base scene: {result['base'].name}")
        if result['branded']:
            print(f"• With logo: {result['branded'].name}")
        if result['video']:
            print(f"• Video: {result['video'].name}")

if __name__ == "__main__":
    main()
