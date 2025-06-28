#!/usr/bin/env python3
"""
Alternative FLUX KONTEXT Approach - Using Inpainting
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

os.environ['FAL_KEY'] = config['api_key']

OUTPUT_DIR = Path(os.path.expanduser('~/Downloads/perfume-oasis-scenes'))
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
LOGO_PATH = Path(SCRIPT_DIR) / "assets" / "perfume-oasis-logo.png"

print("🌲 FLUX KONTEXT Alternative Method - Inpainting")
print("="*50)

def apply_logo_inpainting():
    """Use FLUX inpainting to add logo"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Step 1: Create base scene
    print("\n📸 Creating base scene...")
    
    result = fal.run(
        "fal-ai/flux/dev",
        arguments={
            "prompt": (
                "Elegant emerald green perfume bottle on weathered tree stump in enchanted forest. "
                "Golden morning light through trees, moss, ferns, magical atmosphere. "
                "The bottle has a smooth surface perfect for a logo."
            ),
            "image_size": "landscape_16_9",
            "num_inference_steps": 28,
            "guidance_scale": 3.5,
            "num_images": 1
        }
    )
    
    if not result or 'images' not in result:
        return None
    
    base_url = result['images'][0]['url']
    base_path = OUTPUT_DIR / f"base_{timestamp}.jpg"
    
    with open(base_path, 'wb') as f:
        f.write(requests.get(base_url).content)
    
    print(f"✅ Base saved: {base_path.name}")
    
    # Step 2: Use FLUX Fill (Inpainting) for logo
    print("\n🏷️ Applying logo with FLUX Fill...")
    
    # Upload base image
    with open(base_path, 'rb') as f:
        base_upload = fal.upload(f.read(), "image/jpeg")
    
    # Create a simple mask (you might need to adjust this)
    # For now, we'll use a prompt-based approach
    
    fill_result = fal.run(
        "fal-ai/flux/dev/image-to-image",
        arguments={
            "prompt": (
                "Emerald green perfume bottle with 'Perfume Oasis' logo in elegant gold lettering "
                "on the front of the bottle, sitting on tree stump in enchanted forest"
            ),
            "image_url": base_upload,
            "strength": 0.65,  # How much to change the image
            "image_size": "landscape_16_9",
            "num_inference_steps": 28,
            "guidance_scale": 3.5,
            "num_images": 1
        }
    )
    
    if not fill_result or 'images' not in fill_result:
        return None
    
    branded_url = fill_result['images'][0]['url']
    branded_path = OUTPUT_DIR / f"branded_{timestamp}.jpg"
    
    with open(branded_path, 'wb') as f:
        f.write(requests.get(branded_url).content)
    
    print(f"✅ Branded saved: {branded_path.name}")
    
    # Step 3: Create video
    print("\n🎬 Creating video...")
    
    with open(branded_path, 'rb') as f:
        video_upload = fal.upload(f.read(), "image/jpeg")
    
    video_result = fal.run(
        "fal-ai/minimax/video-01",
        arguments={
            "prompt": "Slow zoom through forest to perfume bottle, revealing logo",
            "first_frame_image": video_upload
        }
    )
    
    if video_result and 'video' in video_result:
        video_path = OUTPUT_DIR / f"video_{timestamp}.mp4"
        with open(video_path, 'wb') as f:
            f.write(requests.get(video_result['video']['url']).content)
        print(f"✅ Video saved: {video_path.name}")
        return True
    
    return False

if __name__ == "__main__":
    if apply_logo_inpainting():
        print(f"\n✅ Complete! Check {OUTPUT_DIR}")
    else:
        print("\n❌ Failed to complete workflow")
