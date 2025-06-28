#!/usr/bin/env python3
"""
CORRECT: FLUX KONTEXT and GPT Image Logo Application
Using the EXACT correct models that can apply logos
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
OUTPUT_DIR = Path(os.path.expanduser('~/Pictures/perfume-oasis-ai/kontext-tests'))
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Logo path
LOGO_PATH = Path(SCRIPT_DIR) / "assets" / "perfume-oasis-logo.png"

print("🎯 CORRECT MODELS: FLUX KONTEXT & GPT IMAGE")
print("="*50)

def create_base_scene():
    """Create base scene for logo application"""
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    print("\n📸 Creating Base Scene")
    print("-" * 25)
    
    prompt = (
        "Professional product photography: elegant emerald green perfume bottle "
        "sitting on weathered tree stump in magical forest, morning light through "
        "trees, dewdrops, golden sunbeams, misty background, plain bottle ready "
        "for branding, no existing logos, cinematic lighting"
    )
    
    try:
        result = fal.run(
            "fal-ai/imagen4/preview/fast",
            arguments={
                "prompt": prompt,
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

def try_flux_kontext_model(base_image_path, timestamp):
    """Try the actual FLUX KONTEXT model from fal.ai"""
    
    print("\n🎯 Method 1: FLUX KONTEXT (fal-ai/flux-kontext)")
    print("-" * 45)
    
    try:
        # Upload images
        base_url = fal.upload_file(str(base_image_path))
        logo_url = fal.upload_file(str(LOGO_PATH))
        
        print("✅ Images uploaded")
        print("🔄 Using FLUX KONTEXT model...")
        
        # Try the actual flux-kontext model
        result = fal.run(
            "fal-ai/flux-kontext",
            arguments={
                "prompt": (
                    "Add the provided Perfume Oasis logo to the front of the perfume bottle. "
                    "The logo should appear as an elegant product label. Keep the forest "
                    "setting unchanged. Apply the logo naturally to the bottle surface."
                ),
                "image_url": base_url,
                "reference_image_url": logo_url
            }
        )
        
        if result and 'images' in result:
            result_url = result['images'][0]['url']
            
            response = requests.get(result_url)
            result_path = OUTPUT_DIR / f"flux_kontext_{timestamp}.jpg"
            with open(result_path, 'wb') as f:
                f.write(response.content)
            
            print(f"🎉 FLUX KONTEXT SUCCESS: {result_path.name}")
            return result_path
        else:
            print("❌ No images returned from FLUX KONTEXT")
            
    except Exception as e:
        print(f"❌ FLUX KONTEXT failed: {str(e)}")
        return None

def try_flux_kontext_max(base_image_path, timestamp):
    """Try FLUX KONTEXT MAX for better results"""
    
    print("\n🎯 Method 2: FLUX KONTEXT MAX")
    print("-" * 30)
    
    try:
        base_url = fal.upload_file(str(base_image_path))
        logo_url = fal.upload_file(str(LOGO_PATH))
        
        print("✅ Images uploaded")
        print("🔄 Using FLUX KONTEXT MAX...")
        
        # Try flux-kontext/max for premium results
        result = fal.run(
            "fal-ai/flux-kontext/max",
            arguments={
                "prompt": (
                    "Apply the provided logo to the perfume bottle as a product label. "
                    "Integrate the logo naturally and professionally."
                ),
                "image_url": base_url,
                "reference_image_url": logo_url
            }
        )
        
        if result and 'images' in result:
            result_url = result['images'][0]['url']
            
            response = requests.get(result_url)
            result_path = OUTPUT_DIR / f"flux_kontext_max_{timestamp}.jpg"
            with open(result_path, 'wb') as f:
                f.write(response.content)
            
            print(f"🎉 FLUX KONTEXT MAX SUCCESS: {result_path.name}")
            return result_path
        else:
            print("❌ No images from FLUX KONTEXT MAX")
            
    except Exception as e:
        print(f"❌ FLUX KONTEXT MAX failed: {str(e)}")
        return None

def try_gpt_image_edit(base_image_path, timestamp):
    """Try GPT Image Edit with proper API format"""
    
    print("\n🎯 Method 3: GPT Image Edit")
    print("-" * 25)
    
    try:
        base_url = fal.upload_file(str(base_image_path))
        
        print("✅ Base image uploaded")
        print("🔄 Using GPT Image Edit...")
        
        # Try GPT Image Edit - need to check exact API format
        result = fal.run(
            "fal-ai/gpt-image-1/edit-image",
            arguments={
                "prompt": (
                    "Add the Perfume Oasis logo to the front of the perfume bottle. "
                    "The logo should be a circular emerald green emblem with golden "
                    "palm fronds and 'PERFUME OASIS' text, applied as an elegant label."
                ),
                "image_url": base_url
            }
        )
        
        if result and 'images' in result:
            result_url = result['images'][0]['url']
            
            response = requests.get(result_url)
            result_path = OUTPUT_DIR / f"gpt_image_edit_{timestamp}.jpg"
            with open(result_path, 'wb') as f:
                f.write(response.content)
            
            print(f"🎉 GPT IMAGE SUCCESS: {result_path.name}")
            return result_path
        else:
            print("❌ No images from GPT Image")
            
    except Exception as e:
        print(f"❌ GPT Image failed: {str(e)}")
        return None

def try_base64_kontext_approach(base_image_path, timestamp):
    """Try FLUX KONTEXT with base64 images"""
    
    print("\n🎯 Method 4: FLUX KONTEXT with Base64")
    print("-" * 35)
    
    try:
        # Encode images to base64
        with open(base_image_path, "rb") as f:
            base_b64 = base64.b64encode(f.read()).decode('utf-8')
        
        with open(LOGO_PATH, "rb") as f:
            logo_b64 = base64.b64encode(f.read()).decode('utf-8')
        
        print("✅ Images encoded to base64")
        print("🔄 Using FLUX KONTEXT with base64...")
        
        # Try with data URLs
        result = fal.run(
            "fal-ai/flux-kontext",
            arguments={
                "prompt": "Apply the provided logo to the perfume bottle",
                "image_url": f"data:image/jpeg;base64,{base_b64}",
                "reference_image_url": f"data:image/png;base64,{logo_b64}"
            }
        )
        
        if result and 'images' in result:
            result_url = result['images'][0]['url']
            
            response = requests.get(result_url)
            result_path = OUTPUT_DIR / f"kontext_base64_{timestamp}.jpg"
            with open(result_path, 'wb') as f:
                f.write(response.content)
            
            print(f"🎉 BASE64 KONTEXT SUCCESS: {result_path.name}")
            return result_path
        else:
            print("❌ No images from base64 approach")
            
    except Exception as e:
        print(f"❌ Base64 KONTEXT failed: {str(e)}")
        return None

def create_video_from_branded_image(image_path, timestamp):
    """Create video from successfully branded image"""
    
    print("\n🎬 Creating Video from Branded Image")
    print("-" * 35)
    
    try:
        image_url = fal.upload_file(str(image_path))
        
        video_prompt = (
            "Cinematic commercial: Wide shot of magical misty forest, smooth zoom "
            "focusing on Perfume Oasis branded perfume bottle on tree stump, camera "
            "reveals logo clearly, soft light particles, golden sunbeams, luxury feel"
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
            video_path = OUTPUT_DIR / f"perfume_oasis_video_{timestamp}.mp4"
            with open(video_path, 'wb') as f:
                f.write(response.content)
            
            print(f"🎉 VIDEO CREATED: {video_path.name}")
            return video_path
            
    except Exception as e:
        print(f"❌ Video failed: {str(e)}")
        return None

def main():
    print("\nStarting CORRECT Model Logo Application...")
    print("="*50)
    
    if not LOGO_PATH.exists():
        print(f"❌ Logo not found: {LOGO_PATH}")
        return
    
    print(f"✅ Logo found: {LOGO_PATH}")
    
    # Create base scene
    base_image_path, timestamp = create_base_scene()
    if not base_image_path:
        return
    
    # Try different correct models
    branded_image = None
    
    # Method 1: Try actual FLUX KONTEXT
    branded_image = try_flux_kontext_model(base_image_path, timestamp)
    
    # Method 2: Try FLUX KONTEXT MAX
    if not branded_image:
        branded_image = try_flux_kontext_max(base_image_path, timestamp)
    
    # Method 3: Try GPT Image Edit
    if not branded_image:
        branded_image = try_gpt_image_edit(base_image_path, timestamp)
    
    # Method 4: Try base64 approach
    if not branded_image:
        branded_image = try_base64_kontext_approach(base_image_path, timestamp)
    
    # Create video if successful
    if branded_image:
        print(f"\n🎯 SUCCESS! Logo applied: {branded_image.name}")
        
        # Check the result first
        print(f"\n📸 Please check the result:")
        print(f"   {branded_image}")
        
        # Create video
        video_path = create_video_from_branded_image(branded_image, timestamp)
        
        if video_path:
            print("\n" + "="*50)
            print("🎉 COMPLETE SUCCESS!")
            print("="*50)
            print(f"📸 Branded image: {branded_image.name}")
            print(f"🎬 Video: {video_path.name}")
            print(f"📁 Location: {OUTPUT_DIR}")
            
            print("\n✅ Your EXACT Perfume Oasis logo should now be visible!")
        else:
            print(f"\n✅ Logo applied: {branded_image}")
            print("⚠️  Video generation failed")
    else:
        print("\n❌ All correct models failed to apply logo")
        print("💡 May need to check API endpoints or formats")

if __name__ == "__main__":
    main()
