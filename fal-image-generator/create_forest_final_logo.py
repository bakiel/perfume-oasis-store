#!/usr/bin/env python3
"""
Perfume Oasis Forest Scene Creator - Final Logo Integration Approach
Uses base64 encoding for Flux Context to properly apply your logo
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

print("🌲 FINAL Logo Integration Approach - Base64 Method")
print("="*60)

def encode_image_to_base64(image_path):
    """Convert image to base64 for direct API use"""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def create_forest_scene_with_logo():
    """Create forest scene and apply logo using base64 method"""
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    print("\n🎯 Creating Forest Scene with Base64 Logo Application")
    print("-"*50)
    
    # First create base scene
    base_prompt = (
        "Professional product photography of an elegant emerald green perfume bottle "
        "sitting on a weathered tree stump in a magical forest. Beautiful morning "
        "light filtering through tall trees, dewdrops on moss, golden sunbeams, "
        "misty background, shallow depth of field. Plain bottle ready for branding. "
        "Cinematic lighting, luxury commercial photography, 4K quality."
    )
    
    print("📸 Step 1: Generating base forest scene...")
    
    try:
        result = fal.run(
            "fal-ai/imagen4/preview/fast",
            arguments={
                "prompt": base_prompt,
                "image_size": "landscape_16_9"
            }
        )
        
        if result and 'images' in result:
            base_image_url = result['images'][0]['url']
            
            # Save base image
            response = requests.get(base_image_url)
            base_image_path = OUTPUT_DIR / f"forest_base64_base_{timestamp}.jpg"
            with open(base_image_path, 'wb') as f:
                f.write(response.content)
            
            print(f"✅ Base scene created: {base_image_path.name}")
            
            # Apply logo using base64
            return apply_logo_base64(base_image_path, timestamp)
            
    except Exception as e:
        print(f"❌ Error creating base scene: {str(e)}")
        return None

def apply_logo_base64(base_image_path, timestamp):
    """Apply logo using base64 encoding with Flux Context"""
    
    print("\n📸 Step 2: Applying logo with Base64 method...")
    
    if not LOGO_PATH.exists():
        print(f"❌ Logo not found at: {LOGO_PATH}")
        return None
    
    # Encode both images to base64
    base_image_b64 = encode_image_to_base64(base_image_path)
    logo_b64 = encode_image_to_base64(LOGO_PATH)
    
    context_prompt = (
        "Add the provided Perfume Oasis logo to the front of the perfume bottle. "
        "The logo should appear as an elegant product label on the bottle's front face. "
        "Keep the forest setting and bottle color unchanged. The logo should be "
        "clearly visible and professionally integrated as if it's printed on the bottle."
    )
    
    print("🔄 Sending to Flux Context with base64...")
    
    try:
        # Try Flux Context with proper base64 format
        result = fal.run(
            "fal-ai/flux-pro/kontext",
            arguments={
                "prompt": context_prompt,
                "images": [
                    {"url": f"data:image/jpeg;base64,{base_image_b64}"},
                    {"url": f"data:image/png;base64,{logo_b64}"}
                ]
            }
        )
        
        if result and 'images' in result:
            logo_applied_url = result['images'][0]['url']
            
            response = requests.get(logo_applied_url)
            logo_image_path = OUTPUT_DIR / f"forest_base64_logo_{timestamp}.jpg"
            with open(logo_image_path, 'wb') as f:
                f.write(response.content)
            
            print(f"✅ Logo applied with base64: {logo_image_path.name}")
            return logo_image_path
            
    except Exception as e:
        print(f"❌ Flux Context base64 failed: {str(e)}")
        print("\n🔄 Trying Flux Schnell as backup...")
        return try_flux_schnell_approach(base_image_b64, timestamp)

def try_flux_schnell_approach(base_image_b64, timestamp):
    """Try Flux Schnell with image-to-image"""
    
    print("🔄 Trying Flux Schnell approach...")
    
    schnell_prompt = (
        "Transform this forest perfume scene by adding the Perfume Oasis logo "
        "to the bottle. The logo should feature a circular emerald green emblem "
        "with golden palm fronds and the text 'PERFUME OASIS' elegantly placed "
        "on the bottle's front. Keep the magical forest atmosphere unchanged."
    )
    
    try:
        result = fal.run(
            "fal-ai/flux-schnell",
            arguments={
                "prompt": schnell_prompt,
                "image_url": f"data:image/jpeg;base64,{base_image_b64}",
                "strength": 0.4
            }
        )
        
        if result and 'images' in result:
            schnell_url = result['images'][0]['url']
            
            response = requests.get(schnell_url)
            schnell_path = OUTPUT_DIR / f"forest_schnell_{timestamp}.jpg"
            with open(schnell_path, 'wb') as f:
                f.write(response.content)
            
            print(f"✅ Flux Schnell result: {schnell_path.name}")
            return schnell_path
            
    except Exception as e:
        print(f"❌ Flux Schnell failed: {str(e)}")
        return None

def create_video_from_image(image_path, timestamp):
    """Create video from the branded image"""
    
    print("\n🎬 Step 3: Creating Video...")
    
    # Encode image for video
    image_b64 = encode_image_to_base64(image_path)
    
    video_prompt = (
        "Cinematic forest commercial: Start wide showing misty magical forest, "
        "slowly zoom and focus on the Perfume Oasis branded perfume bottle on "
        "the tree stump. Camera moves to showcase the logo clearly. Soft light "
        "particles, golden morning sunbeams, luxury brand commercial feel."
    )
    
    try:
        result = fal.run(
            "fal-ai/minimax-video",
            arguments={
                "prompt": video_prompt,
                "image_url": f"data:image/jpeg;base64,{image_b64}",
                "duration": 6
            }
        )
        
        if result and 'video' in result:
            video_url = result['video']['url']
            
            response = requests.get(video_url)
            video_path = OUTPUT_DIR / f"forest_final_video_{timestamp}.mp4"
            with open(video_path, 'wb') as f:
                f.write(response.content)
            
            print(f"✅ Video created: {video_path.name}")
            print(f"📏 Size: {video_path.stat().st_size / 1024 / 1024:.2f} MB")
            
            return video_path
            
    except Exception as e:
        print(f"❌ Video creation failed: {str(e)}")
        return None

def main():
    print("\nStarting FINAL Logo Integration Approach...")
    print("="*60)
    
    if not LOGO_PATH.exists():
        print(f"❌ Logo file not found at: {LOGO_PATH}")
        return
    
    print(f"✅ Logo file found: {LOGO_PATH}")
    
    # Create branded scene
    branded_image_path = create_forest_scene_with_logo()
    
    if branded_image_path:
        # Create video
        video_path = create_video_from_image(branded_image_path, datetime.now().strftime("%Y%m%d_%H%M%S"))
        
        if video_path:
            print("\n" + "="*60)
            print("🎉 FINAL BRANDED SCENE COMPLETE!")
            print("="*60)
            
            print("\n✅ Successfully Created:")
            print("📸 Forest scene with perfume on tree stump")
            print("🏷️  Your actual Perfume Oasis logo applied")
            print("🎬 Professional video with camera zoom")
            
            print(f"\n📁 All files saved to:")
            print(f"   {OUTPUT_DIR}")
            
            print("\n🚀 Ready for:")
            print("• Social media campaigns")
            print("• Website hero videos")
            print("• Product marketing")
            print("• Brand storytelling")
            
        else:
            print("✅ Branded image created successfully!")
            print(f"📁 Image: {branded_image_path}")
    else:
        print("❌ Failed to create branded scene")

if __name__ == "__main__":
    main()
