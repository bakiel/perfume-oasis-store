#!/usr/bin/env python3
"""
FLUX PRO KONTEXT - Correct Implementation
Uses the proper endpoint for applying logos/context to images
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

print("🌲 FLUX PRO KONTEXT - Perfume Forest Scene")
print("="*50)

def main():
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Step 1: Create the perfect base scene
    print("\n📸 Step 1: Creating base forest scene...")
    
    base_prompt = (
        "Professional product photography: Elegant emerald green glass perfume bottle "
        "sitting perfectly centered on a weathered tree stump in an enchanted forest. "
        "Early morning golden sunlight streaming through tall trees creating dramatic "
        "light beams. The bottle has a smooth, reflective surface. Moss and ferns "
        "surround the base. Shallow depth of field with dreamy bokeh background. "
        "Luxury commercial photography style."
    )
    
    result = fal.run(
        "fal-ai/flux/dev",
        arguments={
            "prompt": base_prompt,
            "image_size": "landscape_16_9",
            "num_inference_steps": 28,
            "guidance_scale": 3.5,
            "num_images": 1,
            "enable_safety_checker": True
        }
    )
    
    if not result or 'images' not in result:
        print("❌ Failed to generate base")
        return
    
    # Save base
    base_url = result['images'][0]['url']
    base_path = OUTPUT_DIR / f"forest_base_{timestamp}.jpg"
    
    with open(base_path, 'wb') as f:
        f.write(requests.get(base_url).content)
    
    print(f"✅ Base saved: {base_path.name}")
    
    # Step 2: Apply logo using FLUX PRO with KONTEXT
    print("\n🏷️ Step 2: Applying logo with FLUX PRO KONTEXT...")
    
    # Upload both images
    with open(base_path, 'rb') as f:
        base_upload = fal.upload(f.read(), "image/jpeg")
    
    with open(LOGO_PATH, 'rb') as f:
        logo_upload = fal.upload(f.read(), "image/png")
    
    # The correct KONTEXT prompt
    kontext_prompt = (
        "Place the logo from the reference image onto the front center of the "
        "emerald green perfume bottle. The logo should appear as if it's "
        "professionally printed or embossed on the glass surface. The golden "
        "elements of the logo should reflect the forest lighting. Keep everything "
        "else in the scene exactly the same - the tree stump, forest, and lighting."
    )
    
    # FLUX PRO with KONTEXT
    kontext_result = fal.run(
        "fal-ai/flux-pro/v1/redux",  # This is the correct endpoint for context
        arguments={
            "prompt": kontext_prompt,
            "image_url": base_upload,      # Main image
            "redux_image_url": logo_upload, # Context image (logo)
            "redux_strength": 0.75,         # How strongly to apply the context
            "num_images": 1,
            "image_size": "landscape_16_9",
            "num_inference_steps": 28,
            "guidance_scale": 3.5
        }
    )
    
    if not kontext_result or 'images' not in kontext_result:
        # Try alternative endpoint
        print("Trying alternative KONTEXT endpoint...")
        
        kontext_result = fal.run(
            "fal-ai/flux-pro",
            arguments={
                "prompt": f"[IMG]{logo_upload}[/IMG] {kontext_prompt}",
                "image_url": base_upload,
                "num_images": 1,
                "image_size": "landscape_16_9",
                "num_inference_steps": 50,
                "guidance_scale": 3.5,
                "safety_tolerance": 5
            }
        )
    
    if not kontext_result or 'images' not in kontext_result:
        print("❌ Failed to apply logo")
        return
    
    # Save branded
    branded_url = kontext_result['images'][0]['url']
    branded_path = OUTPUT_DIR / f"forest_branded_{timestamp}.jpg"
    
    with open(branded_path, 'wb') as f:
        f.write(requests.get(branded_url).content)
    
    print(f"✅ Branded saved: {branded_path.name}")
    
    # Step 3: Create video
    print("\n🎬 Step 3: Creating cinematic video...")
    
    video_prompt = (
        "Cinematic camera movement: Start with wide establishing shot of the "
        "enchanted forest with golden sunbeams. Slowly push in through the "
        "atmospheric fog and light rays, gradually revealing the emerald perfume "
        "bottle on the tree stump. End with a close-up hero shot of the bottle "
        "showing the Perfume Oasis logo clearly. Smooth, professional camera work."
    )
    
    # Upload branded for video
    with open(branded_path, 'rb') as f:
        video_upload = fal.upload(f.read(), "image/jpeg")
    
    video_result = fal.run(
        "fal-ai/minimax/video-01",
        arguments={
            "prompt": video_prompt,
            "first_frame_image": video_upload
        }
    )
    
    if video_result and 'video' in video_result and 'url' in video_result['video']:
        video_url = video_result['video']['url']
        video_path = OUTPUT_DIR / f"forest_video_{timestamp}.mp4"
        
        with open(video_path, 'wb') as f:
            f.write(requests.get(video_url).content)
        
        print(f"✅ Video saved: {video_path.name}")
    
    print("\n" + "="*50)
    print("✨ COMPLETE! Forest scene with logo created")
    print(f"📂 Files in: {OUTPUT_DIR}")
    print("="*50)

if __name__ == "__main__":
    if not LOGO_PATH.exists():
        print(f"❌ Logo not found: {LOGO_PATH}")
        print("Make sure perfume-oasis-logo.png is in the assets folder")
    else:
        main()
