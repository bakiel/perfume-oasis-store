#!/usr/bin/env python3
"""
FIXED: Apply Logo using CORRECT API formats
Fixed the API call formats for Flux Context and GPT Image
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

print("🎯 FIXED LOGO APPLICATION - Correct API Formats")
print("="*50)

def create_base_perfume_scene():
    """Create base perfume scene"""
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    print("\n📸 Step 1: Creating Base Scene")
    print("-" * 30)
    
    base_prompt = (
        "Professional product photography of an elegant emerald green perfume bottle "
        "sitting on a weathered tree stump in a magical forest. Beautiful morning "
        "light filtering through trees, dewdrops on moss, golden sunbeams, misty "
        "background, shallow depth of field. The bottle is PLAIN with NO LOGOS. "
        "Cinematic lighting, commercial quality."
    )
    
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
            image_path = OUTPUT_DIR / f"base_scene_{timestamp}.jpg"
            with open(image_path, 'wb') as f:
                f.write(response.content)
            
            print(f"✅ Base scene: {image_path.name}")
            return image_path, timestamp
            
    except Exception as e:
        print(f"❌ Base scene failed: {str(e)}")
        return None, None

def apply_logo_flux_context_fixed(base_image_path, timestamp):
    """Apply logo using CORRECT Flux Context API format"""
    
    print("\n🎯 Step 2: Flux Context (FIXED API)")
    print("-" * 35)
    
    try:
        # Upload images
        base_url = fal.upload_file(str(base_image_path))
        logo_url = fal.upload_file(str(LOGO_PATH))
        
        print("✅ Images uploaded")
        print("🔄 Applying logo with CORRECT Flux Context format...")
        
        # CORRECTED API format for Flux Context
        result = fal.run(
            "fal-ai/flux-pro/kontext",
            arguments={
                "prompt": (
                    "Add the provided logo to the front of the perfume bottle as an elegant label. "
                    "Keep the forest setting unchanged."
                ),
                "image_url": base_url,  # Main image
                "context_url": logo_url  # Context/logo image
            }
        )
        
        if result and 'images' in result:
            result_url = result['images'][0]['url']
            
            response = requests.get(result_url)
            result_path = OUTPUT_DIR / f"flux_fixed_{timestamp}.jpg"
            with open(result_path, 'wb') as f:
                f.write(response.content)
            
            print(f"🎉 FLUX SUCCESS: {result_path.name}")
            return result_path
            
    except Exception as e:
        print(f"❌ Flux Context: {str(e)}")
        return None

def apply_logo_with_base64_approach(base_image_path, timestamp):
    """Try base64 approach for logo application"""
    
    print("\n🎯 Step 2B: Base64 Context Approach")
    print("-" * 35)
    
    try:
        # Encode images to base64
        with open(base_image_path, "rb") as f:
            base_b64 = base64.b64encode(f.read()).decode('utf-8')
        
        with open(LOGO_PATH, "rb") as f:
            logo_b64 = base64.b64encode(f.read()).decode('utf-8')
        
        print("✅ Images encoded to base64")
        print("🔄 Trying base64 context approach...")
        
        # Try with base64 data URLs
        result = fal.run(
            "fal-ai/flux-pro/kontext",
            arguments={
                "prompt": "Apply the provided logo to the perfume bottle as a product label",
                "image_url": f"data:image/jpeg;base64,{base_b64}",
                "context_url": f"data:image/png;base64,{logo_b64}"
            }
        )
        
        if result and 'images' in result:
            result_url = result['images'][0]['url']
            
            response = requests.get(result_url)
            result_path = OUTPUT_DIR / f"base64_approach_{timestamp}.jpg"
            with open(result_path, 'wb') as f:
                f.write(response.content)
            
            print(f"🎉 BASE64 SUCCESS: {result_path.name}")
            return result_path
            
    except Exception as e:
        print(f"❌ Base64 approach: {str(e)}")
        return None

def try_alternative_flux_models(base_image_path, timestamp):
    """Try alternative Flux models that might work"""
    
    print("\n🎯 Step 2C: Alternative Flux Models")
    print("-" * 35)
    
    try:
        base_url = fal.upload_file(str(base_image_path))
        
        print("✅ Base image uploaded")
        print("🔄 Trying Flux General Image-to-Image...")
        
        # Try Flux General with logo description
        result = fal.run(
            "fal-ai/flux-general/image-to-image",
            arguments={
                "prompt": (
                    "Add the Perfume Oasis logo to this perfume bottle. The logo is a "
                    "circular emerald green emblem with golden palm fronds in a V-shape "
                    "around a central droplet, with 'PERFUME OASIS' text in elegant "
                    "golden letters below. Apply it as a professional product label."
                ),
                "image_url": base_url,
                "strength": 0.3
            }
        )
        
        if result and 'images' in result:
            result_url = result['images'][0]['url']
            
            response = requests.get(result_url)
            result_path = OUTPUT_DIR / f"flux_general_{timestamp}.jpg"
            with open(result_path, 'wb') as f:
                f.write(response.content)
            
            print(f"🎉 FLUX GENERAL SUCCESS: {result_path.name}")
            return result_path
            
    except Exception as e:
        print(f"❌ Flux General: {str(e)}")
        return None

def create_video_from_branded_image(image_path, timestamp):
    """Create video from branded image"""
    
    print("\n🎬 Step 3: Creating Video")
    print("-" * 25)
    
    try:
        image_url = fal.upload_file(str(image_path))
        
        video_prompt = (
            "Cinematic forest commercial: Wide shot of magical forest, then smooth zoom "
            "to focus on the Perfume Oasis branded perfume bottle on tree stump. Camera "
            "reveals the logo clearly. Soft light particles, golden sunbeams, luxury feel."
        )
        
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
            video_path = OUTPUT_DIR / f"branded_video_{timestamp}.mp4"
            with open(video_path, 'wb') as f:
                f.write(response.content)
            
            print(f"🎉 VIDEO SUCCESS: {video_path.name}")
            return video_path
            
    except Exception as e:
        print(f"❌ Video failed: {str(e)}")
        return None

def main():
    print("\nStarting FIXED Logo Application...")
    print("="*40)
    
    if not LOGO_PATH.exists():
        print(f"❌ Logo not found: {LOGO_PATH}")
        return
    
    print(f"✅ Logo found: {LOGO_PATH}")
    
    # Create base scene
    base_image_path, timestamp = create_base_perfume_scene()
    if not base_image_path:
        return
    
    # Try different logo application methods
    branded_image = None
    
    # Method 1: Fixed Flux Context
    branded_image = apply_logo_flux_context_fixed(base_image_path, timestamp)
    
    # Method 2: Base64 approach
    if not branded_image:
        branded_image = apply_logo_with_base64_approach(base_image_path, timestamp)
    
    # Method 3: Alternative Flux models
    if not branded_image:
        branded_image = try_alternative_flux_models(base_image_path, timestamp)
    
    # Create video if successful
    if branded_image:
        print(f"\n🎯 Logo applied successfully: {branded_image.name}")
        
        video_path = create_video_from_branded_image(branded_image, timestamp)
        
        if video_path:
            print("\n" + "="*40)
            print("🎉 COMPLETE SUCCESS!")
            print("="*40)
            print(f"📸 Branded image: {branded_image.name}")
            print(f"🎬 Video: {video_path.name}")
            print(f"📁 Location: {OUTPUT_DIR}")
        else:
            print(f"\n✅ Logo applied: {branded_image}")
            print("⚠️  Video generation failed")
    else:
        print("\n❌ All logo application methods failed")
        print("💡 The logo file exists, but API formats may need adjustment")

if __name__ == "__main__":
    main()
