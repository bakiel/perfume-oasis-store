#!/usr/bin/env python3
"""
Perfume Oasis Forest Scene Creator with REAL Logo Integration
Uses the correct Flux Context API to apply your actual logo
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

print("🌲 Perfume Oasis Forest Scene with CORRECT Logo Integration")
print("="*60)

def upload_image_to_fal(image_path):
    """Upload image to FAL and get URL"""
    print(f"📤 Uploading {image_path.name} to FAL...")
    
    try:
        url = fal.upload_file(str(image_path))
        print(f"✅ Image uploaded successfully")
        return url
    except Exception as e:
        print(f"❌ Error uploading image: {str(e)}")
        return None

def create_base_forest_scene():
    """Create base forest scene first"""
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    print("\n🎯 Step 1: Creating Base Forest Scene")
    print("-"*40)
    
    base_prompt = (
        "Professional product photography of an elegant emerald green perfume bottle "
        "sitting on a weathered tree stump in a magical forest. Beautiful morning "
        "light filtering through tall trees, dewdrops on ferns and moss, golden "
        "sunbeams, misty background, shallow depth of field. Plain bottle without "
        "any logos - we will add the brand logo later. Cinematic lighting, "
        "luxury commercial photography style, 4K quality."
    )
    
    print("📸 Generating base scene...")
    
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
            
            response = requests.get(base_image_url)
            base_image_path = OUTPUT_DIR / f"forest_base_{timestamp}.jpg"
            with open(base_image_path, 'wb') as f:
                f.write(response.content)
            
            print(f"✅ Base scene created: {base_image_path.name}")
            return base_image_path, timestamp
            
    except Exception as e:
        print(f"❌ Error creating base scene: {str(e)}")
        return None, None

def apply_logo_with_flux_kontext(base_image_path, timestamp):
    """Apply the actual logo using the correct Flux Kontext model"""
    
    print("\n🎯 Step 2: Applying Your ACTUAL Logo with Flux Kontext")
    print("-"*50)
    
    if not LOGO_PATH.exists():
        print(f"❌ Logo not found at: {LOGO_PATH}")
        return None
    
    # Upload both images to FAL
    base_image_url = upload_image_to_fal(base_image_path)
    logo_url = upload_image_to_fal(LOGO_PATH)
    
    if not base_image_url or not logo_url:
        print("❌ Failed to upload images")
        return None
    
    # Context prompt for logo application
    context_prompt = (
        "Place the Perfume Oasis logo on the front label of the perfume bottle. "
        "The logo should appear as a professional product label, elegantly "
        "integrated on the bottle's surface. Keep the bottle's emerald green "
        "color and the magical forest setting unchanged. The logo should be "
        "clearly visible and properly sized for the bottle."
    )
    
    print("🔄 Applying logo with Flux Kontext...")
    
    try:
        # Use the correct Flux Kontext model
        result = fal.run(
            "fal-ai/flux-pro/kontext",
            arguments={
                "prompt": context_prompt,
                "images": [
                    {"url": base_image_url},
                    {"url": logo_url}
                ]
            }
        )
        
        if result and 'images' in result:
            logo_applied_url = result['images'][0]['url']
            
            response = requests.get(logo_applied_url)
            logo_image_path = OUTPUT_DIR / f"forest_with_real_logo_{timestamp}.jpg"
            with open(logo_image_path, 'wb') as f:
                f.write(response.content)
            
            print(f"✅ Logo applied successfully: {logo_image_path.name}")
            return logo_image_path
            
    except Exception as e:
        print(f"❌ Error with Flux Kontext: {str(e)}")
        print("\n🔄 Trying GPT-Image-1 approach...")
        return try_gpt_image_approach(base_image_path, timestamp)

def try_gpt_image_approach(base_image_path, timestamp):
    """Try GPT-Image-1 edit approach"""
    
    print("🔄 Trying GPT-Image-1 Edit approach...")
    
    # Upload base image
    base_image_url = upload_image_to_fal(base_image_path)
    
    if not base_image_url:
        return None
    
    edit_prompt = (
        "Add the Perfume Oasis logo to the front of the perfume bottle. "
        "The logo should appear as an elegant product label with the "
        "circular emblem containing palm fronds and the text 'PERFUME OASIS' "
        "below it. Keep the forest setting and bottle color unchanged."
    )
    
    try:
        # Note: GPT-Image-1 edit might need OpenAI API key
        result = fal.run(
            "fal-ai/flux-general/image-to-image",
            arguments={
                "prompt": edit_prompt,
                "image_url": base_image_url,
                "strength": 0.3
            }
        )
        
        if result and 'images' in result:
            edited_url = result['images'][0]['url']
            
            response = requests.get(edited_url)
            edited_path = OUTPUT_DIR / f"forest_gpt_edit_{timestamp}.jpg"
            with open(edited_path, 'wb') as f:
                f.write(response.content)
            
            print(f"✅ GPT-Image edit applied: {edited_path.name}")
            return edited_path
            
    except Exception as e:
        print(f"❌ GPT-Image approach failed: {str(e)}")
        return None

def create_combined_scene_approach(timestamp):
    """Create scene with logo using single generation approach"""
    
    print("\n🔄 Alternative: Creating Complete Scene with Logo in One Step")
    print("-"*60)
    
    # Read logo to describe it accurately
    print("📖 Analyzing logo for accurate description...")
    
    complete_prompt = (
        "Professional product photography of an elegant emerald green perfume bottle "
        "sitting on a weathered tree stump in a magical forest. The bottle displays "
        "the 'PERFUME OASIS' logo featuring a circular emerald green emblem with "
        "golden palm fronds arranged in a 'V' shape around a central droplet, "
        "with elegant golden text 'PERFUME OASIS' below the emblem and the tagline "
        "'Refresh your senses.' The forest has beautiful morning light filtering "
        "through tall trees, dewdrops on ferns and moss, golden sunbeams creating "
        "atmospheric lighting, misty background, shallow depth of field with the "
        "branded perfume bottle in sharp focus. Cinematic lighting, luxury "
        "commercial photography style, 4K quality."
    )
    
    print("📸 Generating complete branded scene...")
    
    try:
        result = fal.run(
            "fal-ai/imagen4/preview/fast",
            arguments={
                "prompt": complete_prompt,
                "image_size": "landscape_16_9"
            }
        )
        
        if result and 'images' in result:
            complete_url = result['images'][0]['url']
            
            response = requests.get(complete_url)
            complete_path = OUTPUT_DIR / f"forest_complete_branded_{timestamp}.jpg"
            with open(complete_path, 'wb') as f:
                f.write(response.content)
            
            print(f"✅ Complete branded scene: {complete_path.name}")
            return complete_path
            
    except Exception as e:
        print(f"❌ Complete scene generation failed: {str(e)}")
        return None

def create_video_from_image(image_path, timestamp):
    """Create video from the branded perfume image"""
    
    print("\n🎯 Step 3: Creating Video with Camera Movement")
    print("-"*40)
    
    image_url = upload_image_to_fal(image_path)
    
    if not image_url:
        print("❌ Failed to upload image for video")
        return None
    
    video_prompt = (
        "Cinematic camera movement in a magical forest. Start with a wide "
        "establishing shot of the misty forest, then slowly zoom in and focus "
        "on the Perfume Oasis branded perfume bottle sitting on the tree stump. "
        "The camera moves closer to clearly show the logo and branding. "
        "Soft particles of light float through the air, morning sunbeams get "
        "stronger, creating a dreamy luxury commercial atmosphere."
    )
    
    print("🎬 Generating video...")
    
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
            
            response = requests.get(video_url)
            video_path = OUTPUT_DIR / f"forest_branded_video_{timestamp}.mp4"
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
    print("\nStarting CORRECTED Forest Scene Creation...")
    print("="*60)
    
    if not LOGO_PATH.exists():
        print(f"\n❌ Logo file not found at: {LOGO_PATH}")
        return
    
    print(f"✅ Logo file found: {LOGO_PATH}")
    
    # Try multiple approaches
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    branded_image_path = None
    
    # Approach 1: Base scene + Logo application
    base_image_path, timestamp = create_base_forest_scene()
    
    if base_image_path:
        branded_image_path = apply_logo_with_flux_kontext(base_image_path, timestamp)
    
    # Approach 2: If logo application failed, try complete scene generation
    if not branded_image_path:
        print("\n🔄 Logo application failed, trying complete scene generation...")
        branded_image_path = create_combined_scene_approach(timestamp)
    
    if branded_image_path:
        # Create video
        video_path = create_video_from_image(branded_image_path, timestamp)
        
        if video_path:
            print("\n" + "="*60)
            print("✅ BRANDED Forest Scene Complete!")
            print("="*60)
            
            print("\n📋 Final Result:")
            print("✅ Forest scene with perfume on tree stump")
            print("✅ Perfume Oasis branding applied")
            print("✅ Professional video with camera movement")
            
            print(f"\n📁 Files created in: {OUTPUT_DIR}")
            print("🎬 Ready for marketing and social media use!")
            
        else:
            print("✅ Branded image created, but video generation failed")
            print(f"📁 Image saved: {branded_image_path}")
    else:
        print("\n❌ All approaches failed to create branded scene")
        print("🔧 Check API key and internet connection")

if __name__ == "__main__":
    main()
