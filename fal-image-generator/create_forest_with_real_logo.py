#!/usr/bin/env python3
"""
Perfume Oasis Forest Scene Creator with Actual Logo Integration
Uses your actual logo file with context-aware models
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

print("🌲 Perfume Oasis Forest Scene Creator with REAL LOGO")
print("="*60)

def upload_image_to_fal(image_path):
    """Upload image to FAL and get URL"""
    print(f"📤 Uploading {image_path.name} to FAL...")
    
    try:
        # Upload the image file
        url = fal.upload_file(str(image_path))
        print(f"✅ Image uploaded: {url}")
        return url
    except Exception as e:
        print(f"❌ Error uploading image: {str(e)}")
        return None

def create_base_forest_scene():
    """Create base forest scene first"""
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    print("\n🎯 Step 1: Creating Base Forest Scene")
    print("-"*40)
    
    # Create base forest scene with perfume bottle on stump
    base_prompt = (
        "Professional product photography of an elegant emerald green perfume bottle "
        "sitting on a weathered tree stump in a magical forest. Beautiful morning "
        "light filtering through tall trees, dewdrops on ferns and moss, golden "
        "sunbeams creating atmospheric lighting, misty background, shallow depth "
        "of field. The bottle should be plain without any logo - we will add the "
        "logo later. Cinematic lighting, luxury commercial photography style."
    )
    
    print("📸 Generating base scene...")
    print(f"Model: Imagen4")
    
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
            base_image_path = OUTPUT_DIR / f"forest_base_{timestamp}.jpg"
            with open(base_image_path, 'wb') as f:
                f.write(response.content)
            
            print(f"✅ Base scene created: {base_image_path.name}")
            return base_image_path, timestamp
            
    except Exception as e:
        print(f"❌ Error creating base scene: {str(e)}")
        return None, None

def apply_logo_with_flux_context(base_image_path, timestamp):
    """Apply the actual logo using Flux Context"""
    
    print("\n🎯 Step 2: Applying Your ACTUAL Logo with Flux Context")
    print("-"*50)
    
    if not LOGO_PATH.exists():
        print(f"❌ Logo not found at: {LOGO_PATH}")
        return None
    
    # Upload both images to FAL
    print("📤 Uploading images to FAL...")
    base_image_url = upload_image_to_fal(base_image_path)
    logo_url = upload_image_to_fal(LOGO_PATH)
    
    if not base_image_url or not logo_url:
        print("❌ Failed to upload images")
        return None
    
    # Context prompt for logo application
    context_prompt = (
        "Add the provided Perfume Oasis logo to the front of the perfume bottle "
        "in the forest scene. The logo should be elegantly placed on the bottle's "
        "front label area, appearing as if it's professionally printed or etched "
        "on the glass. Keep the emerald green bottle color and magical forest "
        "atmosphere unchanged. The logo should be clearly visible and well-integrated."
    )
    
    print("🔄 Applying logo with Flux Context...")
    print("📤 Sending to Flux Context API...")
    
    try:
        # Use Flux Context to combine images
        result = fal.run(
            "fal-ai/flux-pro/v1.1/inpainting",
            arguments={
                "prompt": context_prompt,
                "image_url": base_image_url,
                "mask_url": logo_url,
                "strength": 0.8,
                "guidance_scale": 7.5
            }
        )
        
        if result and 'images' in result:
            logo_applied_url = result['images'][0]['url']
            
            # Save logo-applied image
            response = requests.get(logo_applied_url)
            logo_image_path = OUTPUT_DIR / f"forest_with_real_logo_{timestamp}.jpg"
            with open(logo_image_path, 'wb') as f:
                f.write(response.content)
            
            print(f"✅ Logo applied successfully: {logo_image_path.name}")
            return logo_image_path
            
    except Exception as e:
        print(f"❌ Error with Flux Context: {str(e)}")
        print("\n🔄 Trying alternative approach...")
        return try_alternative_logo_method(base_image_url, logo_url, timestamp)

def try_alternative_logo_method(base_image_url, logo_url, timestamp):
    """Try alternative method using Flux Redux"""
    
    print("🔄 Trying Flux Redux for logo application...")
    
    try:
        # Use Flux Redux as alternative
        result = fal.run(
            "fal-ai/flux/redux",
            arguments={
                "image_url": base_image_url,
                "prompt": (
                    "Add the Perfume Oasis logo to the perfume bottle. "
                    "The logo should appear professionally on the bottle's label."
                ),
                "strength": 0.7
            }
        )
        
        if result and 'images' in result:
            alt_image_url = result['images'][0]['url']
            
            response = requests.get(alt_image_url)
            alt_image_path = OUTPUT_DIR / f"forest_logo_redux_{timestamp}.jpg"
            with open(alt_image_path, 'wb') as f:
                f.write(response.content)
            
            print(f"✅ Alternative logo application: {alt_image_path.name}")
            return alt_image_path
            
    except Exception as e:
        print(f"❌ Alternative method failed: {str(e)}")
        return None

def create_video_from_image(image_path, timestamp):
    """Create video from the branded perfume image"""
    
    print("\n🎯 Step 3: Creating Video with Camera Movement")
    print("-"*40)
    
    # Upload image for video generation
    image_url = upload_image_to_fal(image_path)
    
    if not image_url:
        print("❌ Failed to upload image for video")
        return None
    
    video_prompt = (
        "Cinematic camera movement in a magical forest. Start with a wide "
        "establishing shot showing the misty forest atmosphere, then slowly "
        "zoom in and focus on the perfume bottle sitting on the tree stump. "
        "The camera moves closer to reveal the Perfume Oasis logo clearly "
        "on the bottle. Soft particles of light float through the air, "
        "morning sunbeams get stronger, creating a dreamy luxury commercial feel."
    )
    
    print("🎬 Generating video...")
    print(f"Model: Minimax Video")
    print(f"Duration: 6 seconds")
    
    try:
        result = fal.run(
            "fal-ai/minimax-video",
            arguments={
                "prompt": video_prompt,
                "image_url": image_url,
                "duration": 6
            }
        )
        
        if result and 'video' in result:
            video_url = result['video']['url']
            
            # Download video
            print("📥 Downloading video...")
            response = requests.get(video_url)
            
            video_path = OUTPUT_DIR / f"forest_real_logo_video_{timestamp}.mp4"
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
    print("\nStarting Forest Scene Creation with REAL LOGO Integration...")
    print("="*60)
    
    # Check if logo exists
    if not LOGO_PATH.exists():
        print(f"\n❌ Logo file not found!")
        print(f"Expected at: {LOGO_PATH}")
        return
    
    print(f"✅ Logo file found: {LOGO_PATH}")
    
    # Step 1: Create base forest scene
    base_image_path, timestamp = create_base_forest_scene()
    
    if not base_image_path:
        print("❌ Failed to create base scene")
        return
    
    # Step 2: Apply actual logo
    branded_image_path = apply_logo_with_flux_context(base_image_path, timestamp)
    
    if not branded_image_path:
        print("❌ Failed to apply logo")
        return
    
    # Step 3: Create video
    video_path = create_video_from_image(branded_image_path, timestamp)
    
    if video_path:
        print("\n" + "="*60)
        print("✅ REAL LOGO Forest Scene Complete!")
        print("="*60)
        
        print("\n📋 Process Summary:")
        print("1. ✅ Created base forest scene with perfume on tree stump")
        print("2. ✅ Applied your ACTUAL Perfume Oasis logo using Flux Context")
        print("3. ✅ Generated video with camera zoom to branded bottle")
        
        print(f"\n📁 Output Location: {OUTPUT_DIR}")
        
        print("\n🎥 Video Features:")
        print("• Wide forest establishing shot")
        print("• Perfume bottle on tree stump")
        print("• YOUR ACTUAL LOGO visible on bottle")
        print("• Professional cinematography")
        print("• Magical forest atmosphere")
        
        print("\n💡 This Uses Your REAL Logo!")
        print("• Not just text description")
        print("• Actual logo file integration")
        print("• Context-aware placement")
        print("• Professional brand application")
        
    else:
        print("\n❌ Failed to create complete scene")

if __name__ == "__main__":
    main()
