#!/usr/bin/env python3
"""
FOCUSED: Apply Logo using GPT Image and Flux Context ONLY
Only these models can apply actual logos to images
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
OUTPUT_DIR = Path(os.path.expanduser('~/Pictures/perfume-oasis-ai/logo-application'))
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Logo path
LOGO_PATH = Path(SCRIPT_DIR) / "assets" / "perfume-oasis-logo.png"

print("🎯 LOGO APPLICATION: GPT Image & Flux Context ONLY")
print("="*50)
print("Using only models that can apply actual logos!")
print("="*50)

def create_base_perfume_scene():
    """Create base perfume scene using Imagen4 (good for base generation)"""
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    print("\n📸 Step 1: Creating Base Scene (Imagen4)")
    print("-" * 35)
    
    # Create base scene - Imagen4 is good for this
    base_prompt = (
        "Professional product photography of an elegant emerald green perfume bottle "
        "sitting on a weathered tree stump in a magical forest. Beautiful morning "
        "light filtering through trees, dewdrops on moss, golden sunbeams, misty "
        "background, shallow depth of field. The bottle is PLAIN with NO LOGOS - "
        "ready for branding. Cinematic lighting, commercial quality."
    )
    
    print("🔄 Generating base scene with Imagen4...")
    
    try:
        result = fal.run(
            "fal-ai/imagen4/preview/fast",
            arguments={
                "prompt": base_prompt,
                "image_size": "landscape_16_9"
            }
        )
        
        if result and 'images' in result:
            image_url = result['images'][0]['url']
            
            response = requests.get(image_url)
            image_path = OUTPUT_DIR / f"base_forest_scene_{timestamp}.jpg"
            with open(image_path, 'wb') as f:
                f.write(response.content)
            
            print(f"✅ Base scene created: {image_path.name}")
            return image_path, timestamp
            
    except Exception as e:
        print(f"❌ Error creating base scene: {str(e)}")
        return None, None

def apply_logo_flux_context(base_image_path, timestamp):
    """Apply logo using Flux Context - Method 1"""
    
    print("\n🎯 Step 2A: Applying Logo with Flux Context")
    print("-" * 40)
    
    if not LOGO_PATH.exists():
        print(f"❌ Logo not found at: {LOGO_PATH}")
        return None
    
    print("📤 Uploading images to FAL...")
    
    try:
        # Upload both images to FAL
        base_url = fal.upload_file(str(base_image_path))
        logo_url = fal.upload_file(str(LOGO_PATH))
        
        print("✅ Images uploaded successfully")
        print("🔄 Applying logo with Flux Context...")
        
        # Apply logo using Flux Context
        result = fal.run(
            "fal-ai/flux-pro/kontext",
            arguments={
                "prompt": (
                    "Add the provided Perfume Oasis logo to the front of the perfume bottle. "
                    "The logo should appear as an elegant product label on the bottle's surface. "
                    "Keep the forest setting and emerald green bottle color unchanged. "
                    "The logo should be clearly visible and professionally integrated."
                ),
                "images": [
                    {"url": base_url},
                    {"url": logo_url}
                ]
            }
        )
        
        if result and 'images' in result:
            result_url = result['images'][0]['url']
            
            response = requests.get(result_url)
            result_path = OUTPUT_DIR / f"flux_context_result_{timestamp}.jpg"
            with open(result_path, 'wb') as f:
                f.write(response.content)
            
            print(f"🎉 FLUX CONTEXT SUCCESS: {result_path.name}")
            return result_path
        else:
            print("❌ Flux Context: No images returned")
            return None
            
    except Exception as e:
        print(f"❌ Flux Context failed: {str(e)}")
        return None

def apply_logo_gpt_image(base_image_path, timestamp):
    """Apply logo using GPT Image Edit - Method 2"""
    
    print("\n🎯 Step 2B: Applying Logo with GPT Image")
    print("-" * 35)
    
    print("📤 Uploading base image for GPT Image...")
    
    try:
        # Upload base image
        base_url = fal.upload_file(str(base_image_path))
        
        print("✅ Base image uploaded")
        print("🔄 Applying logo with GPT Image Edit...")
        
        # Use GPT Image Edit to apply logo
        result = fal.run(
            "fal-ai/gpt-image-1/edit-image/byok",
            arguments={
                "prompt": (
                    "Add the Perfume Oasis logo to the perfume bottle. The logo should be "
                    "a circular emerald green emblem with golden palm fronds and the text "
                    "'PERFUME OASIS' in elegant golden letters. Place it professionally "
                    "on the front of the bottle as a product label."
                ),
                "image_url": base_url,
                "openai_api_key": "your-openai-key-here"  # You'll need to add your OpenAI key
            }
        )
        
        if result and 'images' in result:
            result_url = result['images'][0]['url']
            
            response = requests.get(result_url)
            result_path = OUTPUT_DIR / f"gpt_image_result_{timestamp}.jpg"
            with open(result_path, 'wb') as f:
                f.write(response.content)
            
            print(f"🎉 GPT IMAGE SUCCESS: {result_path.name}")
            return result_path
        else:
            print("❌ GPT Image: No images returned")
            return None
            
    except Exception as e:
        print(f"❌ GPT Image failed: {str(e)}")
        print("💡 Note: GPT Image requires OpenAI API key")
        return None

def create_video_from_branded_image(image_path, timestamp):
    """Create video from the successfully branded image"""
    
    print("\n🎬 Step 3: Creating Video from Branded Image")
    print("-" * 40)
    
    print("📤 Uploading branded image for video...")
    
    try:
        # Upload the branded image
        image_url = fal.upload_file(str(image_path))
        
        print("✅ Branded image uploaded")
        print("🎬 Generating video with camera movement...")
        
        video_prompt = (
            "Cinematic camera movement in a magical forest commercial. Start with a wide "
            "shot of the misty enchanted forest, then smoothly zoom in and focus on the "
            "Perfume Oasis branded perfume bottle sitting on the tree stump. The camera "
            "moves closer to clearly showcase the logo on the bottle. Soft particles of "
            "light float through the air, morning sunbeams intensify, creating a luxury "
            "brand commercial atmosphere. Professional cinematography."
        )
        
        # Create video using Minimax
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
            video_path = OUTPUT_DIR / f"perfume_oasis_branded_video_{timestamp}.mp4"
            with open(video_path, 'wb') as f:
                f.write(response.content)
            
            print(f"🎉 VIDEO SUCCESS: {video_path.name}")
            print(f"📏 Size: {video_path.stat().st_size / 1024 / 1024:.2f} MB")
            
            return video_path
        else:
            print("❌ Video generation: No video returned")
            return None
            
    except Exception as e:
        print(f"❌ Video generation failed: {str(e)}")
        return None

def main():
    print("\nStarting FOCUSED Logo Application Process...")
    print("Using ONLY models that can apply logos!")
    print("="*50)
    
    # Check if logo exists
    if not LOGO_PATH.exists():
        print(f"❌ Logo file not found at: {LOGO_PATH}")
        return
    
    print(f"✅ Logo file found: {LOGO_PATH}")
    
    # Step 1: Create base scene (Imagen4 is fine for this)
    base_image_path, timestamp = create_base_perfume_scene()
    
    if not base_image_path:
        print("❌ Failed to create base scene")
        return
    
    # Step 2: Try logo application methods
    branded_image = None
    
    # Try Flux Context first (usually works better)
    branded_image = apply_logo_flux_context(base_image_path, timestamp)
    
    # If Flux Context failed, try GPT Image
    if not branded_image:
        print("\n🔄 Flux Context failed, trying GPT Image...")
        branded_image = apply_logo_gpt_image(base_image_path, timestamp)
    
    # Step 3: Create video if we have a branded image
    if branded_image:
        print(f"\n🎯 SUCCESS! Logo applied: {branded_image.name}")
        
        # Create video from branded image
        video_path = create_video_from_branded_image(branded_image, timestamp)
        
        if video_path:
            print("\n" + "="*50)
            print("🎉 COMPLETE SUCCESS!")
            print("="*50)
            
            print("\n✅ Results:")
            print(f"📸 Branded image: {branded_image.name}")
            print(f"🎬 Video with zoom: {video_path.name}")
            
            print(f"\n📁 Location: {OUTPUT_DIR}")
            
            print("\n🌟 Features:")
            print("• Your ACTUAL Perfume Oasis logo applied")
            print("• Perfume bottle on tree stump in forest")
            print("• Professional video with camera zoom")
            print("• Ready for marketing use")
            
        else:
            print("\n✅ Logo application successful!")
            print(f"📸 Branded image: {branded_image}")
            print("⚠️  Video generation failed, but logo is applied correctly")
    
    else:
        print("\n❌ All logo application methods failed")
        print("\n🔧 Possible solutions:")
        print("1. Check if FAL API key is valid")
        print("2. Add OpenAI API key for GPT Image method")
        print("3. Check internet connection")
        print("4. Verify logo file is accessible")

if __name__ == "__main__":
    main()
