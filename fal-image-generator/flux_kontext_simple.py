#!/usr/bin/env python3
"""
Simple FLUX KONTEXT Logo Application
"""

import os
import json
import sys
from pathlib import Path
from datetime import datetime
import base64
import requests

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

os.environ['FAL_KEY'] = config['api_key']

# Paths
OUTPUT_DIR = Path(os.path.expanduser('~/Downloads/perfume-oasis-scenes'))
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
LOGO_PATH = Path(SCRIPT_DIR) / "assets" / "perfume-oasis-logo.png"

print("🌲 FLUX KONTEXT Perfume Scene Creator")
print("="*50)

def main():
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Step 1: Create base scene
    print("\n📸 Creating base perfume scene...")
    
    scene_prompt = (
        "Luxury emerald green perfume bottle sitting on a weathered tree stump "
        "in an enchanted forest. Morning sunlight filters through tall trees, "
        "creating golden rays and magical atmosphere. The bottle is perfectly "
        "placed on the tree stump surface, surrounded by moss and ferns. "
        "Professional product photography, shallow depth of field."
    )
    
    result1 = fal.run(
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
    
    if not result1 or 'images' not in result1:
        print("❌ Failed to generate base scene")
        return
    
    # Download base image
    base_url = result1['images'][0]['url']
    base_response = requests.get(base_url)
    base_path = OUTPUT_DIR / f"base_scene_{timestamp}.jpg"
    
    with open(base_path, 'wb') as f:
        f.write(base_response.content)
    
    print(f"✅ Base scene saved: {base_path.name}")
    
    # Step 2: Apply logo with FLUX KONTEXT
    print("\n🏷️ Applying logo with FLUX KONTEXT...")
    
    # Read and encode logo
    with open(LOGO_PATH, 'rb') as f:
        logo_bytes = f.read()
    
    # Upload logo to fal
    logo_upload = fal.upload(logo_bytes, "image/png")
    
    # Apply logo using FLUX KONTEXT
    kontext_prompt = (
        "Apply the Perfume Oasis logo to the emerald green perfume bottle. "
        "The logo should appear professionally printed on the bottle's surface, "
        "centered and clearly visible. Maintain all other elements of the scene."
    )
    
    result2 = fal.run(
        "fal-ai/flux-pro/v1/kontext",
        arguments={
            "prompt": kontext_prompt,
            "control_image_url": logo_upload,
            "image_url": base_url,
            "control_scale": 0.8,
            "num_inference_steps": 28,
            "guidance_scale": 3.5,
            "num_images": 1
        }
    )
    
    if not result2 or 'images' not in result2:
        print("❌ Failed to apply logo")
        return
    
    # Download branded image
    branded_url = result2['images'][0]['url']
    branded_response = requests.get(branded_url)
    branded_path = OUTPUT_DIR / f"branded_scene_{timestamp}.jpg"
    
    with open(branded_path, 'wb') as f:
        f.write(branded_response.content)
    
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
        branded_bytes = f.read()
    branded_upload = fal.upload(branded_bytes, "image/jpeg")
    
    result3 = fal.run(
        "fal-ai/minimax/video-01",
        arguments={
            "prompt": video_prompt,
            "first_frame_image": branded_upload
        }
    )
    
    if result3 and 'video' in result3 and 'url' in result3['video']:
        video_url = result3['video']['url']
        video_response = requests.get(video_url)
        video_path = OUTPUT_DIR / f"branded_video_{timestamp}.mp4"
        
        with open(video_path, 'wb') as f:
            f.write(video_response.content)
        
        print(f"✅ Video saved: {video_path.name}")
    else:
        print("❌ Failed to create video")
    
    print(f"\n📂 All files saved to: {OUTPUT_DIR}")
    print("\n✨ Done! Your branded perfume scene is ready.")

if __name__ == "__main__":
    main()
