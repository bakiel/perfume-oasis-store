#!/usr/bin/env python3
"""
FLUX KONTEXT Perfume Scene - Working Version
Creates perfume on tree stump with logo applied
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
OUTPUT_DIR = Path(os.path.expanduser('~/Downloads/perfume-oasis-final'))
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
LOGO_PATH = Path(SCRIPT_DIR) / "assets" / "perfume-oasis-logo.png"

print("🌲 PERFUME OASIS - Forest Scene Creator")
print("="*50)

def main():
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Step 1: Create perfume on tree stump scene
    print("\n📸 Creating perfume on tree stump scene...")
    
    scene_prompt = (
        "Professional product photography: Elegant emerald green glass perfume bottle "
        "sitting on a weathered tree stump in an enchanted forest. The bottle has a "
        "smooth surface perfect for a logo. Early morning golden sunlight filters "
        "through tall trees creating dramatic light beams. Moss and ferns surround "
        "the tree stump. Shallow depth of field with the perfume bottle in sharp focus. "
        "Mystical fog in the background. Luxury product photography style."
    )
    
    # Generate base scene with FLUX
    result1 = fal.run(
        "fal-ai/flux/dev",
        arguments={
            "prompt": scene_prompt,
            "image_size": "landscape_16_9",
            "num_inference_steps": 28,
            "guidance_scale": 3.5,
            "num_images": 1
        }
    )
    
    if not result1 or 'images' not in result1:
        print("❌ Failed to generate base scene")
        return
    
    # Download base image
    base_url = result1['images'][0]['url']
    base_response = requests.get(base_url)
    base_path = OUTPUT_DIR / f"1_base_forest_stump_{timestamp}.jpg"
    
    with open(base_path, 'wb') as f:
        f.write(base_response.content)
    
    print(f"✅ Base scene saved: {base_path.name}")
    
    # Step 2: Apply logo with FLUX KONTEXT
    print("\n🏷️ Applying Perfume Oasis logo...")
    
    # Encode images to base64
    with open(base_path, "rb") as f:
        base_b64 = base64.b64encode(f.read()).decode('utf-8')
    
    with open(LOGO_PATH, "rb") as f:
        logo_b64 = base64.b64encode(f.read()).decode('utf-8')
    
    # Apply logo
    logo_prompt = (
        "Apply the Perfume Oasis logo to the perfume bottle. The logo should be "
        "elegantly placed on the front center of the emerald green bottle, appearing "
        "as if professionally printed on the glass. The golden elements should catch "
        "the forest light. Keep everything else in the scene exactly the same."
    )
    
    result2 = fal.run(
        "fal-ai/flux-pro/kontext",
        arguments={
            "prompt": logo_prompt,
            "image_url": f"data:image/jpeg;base64,{base_b64}",
            "context_url": f"data:image/png;base64,{logo_b64}"
        }
    )
    
    if not result2 or 'images' not in result2:
        print("❌ Failed to apply logo")
        return
    
    # Download branded image
    branded_url = result2['images'][0]['url']
    branded_response = requests.get(branded_url)
    branded_path = OUTPUT_DIR / f"2_branded_forest_stump_{timestamp}.jpg"
    
    with open(branded_path, 'wb') as f:
        f.write(branded_response.content)
    
    print(f"✅ Logo applied: {branded_path.name}")
    
    # Step 3: Create video with Minimax
    print("\n🎬 Creating cinematic zoom video...")
    
    video_prompt = (
        "Cinematic camera movement: Start with wide shot of magical forest, then "
        "slowly push in through golden sunbeams and floating particles, smoothly "
        "zooming toward the elegant perfume bottle on the tree stump, ending with "
        "a close-up that clearly shows the Perfume Oasis logo on the bottle. "
        "Professional product showcase with smooth camera work."
    )
    
    # Re-encode branded image for video
    with open(branded_path, "rb") as f:
        branded_b64_video = base64.b64encode(f.read()).decode('utf-8')
    
    print("Generating 6-second video...")
    
    result3 = fal.run(
        "fal-ai/minimax-video",
        arguments={
            "prompt": video_prompt,
            "image_url": f"data:image/jpeg;base64,{branded_b64_video}",
            "duration": 6
        }
    )
    
    if result3 and 'video' in result3:
        video_url = result3['video']['url']
        video_response = requests.get(video_url)
        video_path = OUTPUT_DIR / f"3_perfume_oasis_video_{timestamp}.mp4"
        
        with open(video_path, 'wb') as f:
            f.write(video_response.content)
        
        print(f"✅ Video saved: {video_path.name}")
        print(f"📏 Size: {video_path.stat().st_size / 1024 / 1024:.2f} MB")
    else:
        print("❌ Failed to create video")
    
    # Summary
    print("\n" + "="*50)
    print("✨ PERFUME OASIS SCENE COMPLETE!")
    print("="*50)
    print(f"\n📂 Files saved to: {OUTPUT_DIR}")
    print("\n📁 Generated assets:")
    print(f"  1. Base scene: {base_path.name}")
    print(f"  2. With logo: {branded_path.name}")
    if 'video_path' in locals():
        print(f"  3. Video: {video_path.name}")
    
    print("\n🎥 Scene features:")
    print("  • Perfume bottle on tree stump")
    print("  • Your Perfume Oasis logo applied")
    print("  • Magical forest atmosphere")
    print("  • Cinematic zoom video")
    
    print("\n✅ Ready for your marketing campaigns!")

if __name__ == "__main__":
    main()
