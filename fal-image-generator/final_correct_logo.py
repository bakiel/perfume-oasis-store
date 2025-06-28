#!/usr/bin/env python3
"""
CORRECT API ENDPOINTS: Using exact APIs from config.json
Apply logo using the working model endpoints
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

# Set API key
os.environ['FAL_KEY'] = config['api_key']

# Output directory
OUTPUT_DIR = Path(os.path.expanduser('~/Pictures/perfume-oasis-ai/correct-api-tests'))
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Logo path
LOGO_PATH = Path(SCRIPT_DIR) / "assets" / "perfume-oasis-logo.png"

print("🎯 USING CORRECT API ENDPOINTS FROM CONFIG")
print("="*50)
print("Using exact model APIs from your config.json")
print("="*50)

def create_base_scene():
    """Create base scene for logo application"""
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    print("\n📸 Creating Base Scene")
    print("-" * 25)
    
    prompt = (
        "Professional product photography: elegant emerald green perfume bottle "
        "sitting on weathered tree stump in magical forest, morning light, "
        "plain bottle ready for branding, no existing logos, cinematic lighting"
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

def try_flux_pro_kontext(base_image_path, timestamp):
    """Method 1: FLUX Pro Kontext (from config)"""
    
    print("\n🎯 Method 1: fal-ai/flux-pro/kontext")
    print("-" * 35)
    
    try:
        base_url = fal.upload_file(str(base_image_path))
        logo_url = fal.upload_file(str(LOGO_PATH))
        
        print("✅ Images uploaded")
        print("🔄 Using fal-ai/flux-pro/kontext...")
        
        # Using the exact API from config
        result = fal.run(
            "fal-ai/flux-pro/kontext",
            arguments={
                "prompt": (
                    "Add the provided logo to the front of the perfume bottle. "
                    "Apply it as an elegant product label."
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
            result_path = OUTPUT_DIR / f"flux_pro_kontext_{timestamp}.jpg"
            with open(result_path, 'wb') as f:
                f.write(response.content)
            
            print(f"🎉 FLUX PRO KONTEXT SUCCESS: {result_path.name}")
            return result_path
        else:
            print("❌ No images returned")
            
    except Exception as e:
        print(f"❌ Flux Pro Kontext failed: {str(e)}")
        return None

def try_flux_general_image_to_image(base_image_path, timestamp):
    """Method 2: Flux General Image-to-Image (from config)"""
    
    print("\n🎯 Method 2: fal-ai/flux-general/image-to-image")
    print("-" * 40)
    
    try:
        base_url = fal.upload_file(str(base_image_path))
        
        print("✅ Base image uploaded")
        print("🔄 Using fal-ai/flux-general/image-to-image...")
        
        # Using image-to-image approach with logo description
        result = fal.run(
            "fal-ai/flux-general/image-to-image",
            arguments={
                "prompt": (
                    "Add the Perfume Oasis logo to this perfume bottle. The logo is "
                    "a circular emerald green emblem with golden palm fronds in a V-shape "
                    "around a central golden droplet, with 'PERFUME OASIS' text in "
                    "elegant golden letters below the emblem. Apply it professionally "
                    "as a product label on the bottle front."
                ),
                "image_url": base_url,
                "strength": 0.4
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
        else:
            print("❌ No images returned")
            
    except Exception as e:
        print(f"❌ Flux General failed: {str(e)}")
        return None

def try_comprehensive_generation_approach(timestamp):
    """Method 3: Generate complete scene with logo in one step"""
    
    print("\n🎯 Method 3: Complete Scene Generation")
    print("-" * 35)
    
    # Ultra-detailed prompt with exact logo description
    complete_prompt = (
        "Ultra-realistic professional product photography of an elegant emerald green "
        "perfume bottle sitting on a weathered tree stump in an enchanted forest. "
        "The bottle prominently displays the 'PERFUME OASIS' brand logo: a circular "
        "emerald green emblem with golden palm fronds arranged in a perfect V-shape "
        "around a central golden droplet, with elegant golden text 'PERFUME OASIS' "
        "in sophisticated typography below the circular emblem, and 'Refresh your senses.' "
        "tagline in smaller text underneath. The forest setting features magical morning "
        "light filtering through tall ancient trees, sparkling dewdrops on moss and ferns, "
        "golden sunbeams creating ethereal atmosphere, soft mist in background. "
        "Shallow depth of field with bottle and logo in sharp focus. Cinematic lighting, "
        "luxury commercial photography, 8K quality, award-winning advertising style."
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
            image_url = result['images'][0]['url']
            
            response = requests.get(image_url)
            image_path = OUTPUT_DIR / f"complete_branded_{timestamp}.jpg"
            with open(image_path, 'wb') as f:
                f.write(response.content)
            
            print(f"🎉 COMPLETE SCENE SUCCESS: {image_path.name}")
            return image_path
            
    except Exception as e:
        print(f"❌ Complete generation failed: {str(e)}")
        return None

def create_video_from_best_image(image_path, timestamp):
    """Create video from the best result"""
    
    print("\n🎬 Creating Video")
    print("-" * 15)
    
    try:
        image_url = fal.upload_file(str(image_path))
        
        video_prompt = (
            "Cinematic luxury perfume commercial: Start with wide magical forest shot, "
            "smoothly zoom in to focus on Perfume Oasis branded bottle on tree stump, "
            "camera reveals logo clearly, soft golden light particles, luxury atmosphere"
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
            video_path = OUTPUT_DIR / f"final_video_{timestamp}.mp4"
            with open(video_path, 'wb') as f:
                f.write(response.content)
            
            print(f"🎉 VIDEO SUCCESS: {video_path.name}")
            return video_path
            
    except Exception as e:
        print(f"❌ Video failed: {str(e)}")
        return None

def main():
    print("\nStarting CORRECT API Logo Application...")
    print("="*45)
    
    if not LOGO_PATH.exists():
        print(f"❌ Logo not found: {LOGO_PATH}")
        return
    
    print(f"✅ Logo found: {LOGO_PATH}")
    
    # Try multiple approaches
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    successful_results = []
    
    # Create base scene first
    base_image_path, timestamp = create_base_scene()
    
    if base_image_path:
        # Method 1: Try Flux Pro Kontext
        result1 = try_flux_pro_kontext(base_image_path, timestamp)
        if result1:
            successful_results.append(("Flux Pro Kontext", result1))
        
        # Method 2: Try Flux General
        result2 = try_flux_general_image_to_image(base_image_path, timestamp)
        if result2:
            successful_results.append(("Flux General", result2))
    
    # Method 3: Complete generation approach
    result3 = try_comprehensive_generation_approach(timestamp)
    if result3:
        successful_results.append(("Complete Generation", result3))
    
    # Show results and create video from best one
    if successful_results:
        print(f"\n🎉 SUCCESS! {len(successful_results)} method(s) worked:")
        for method, path in successful_results:
            print(f"   ✅ {method}: {path.name}")
        
        # Use the first successful result for video
        best_method, best_image = successful_results[0]
        print(f"\n🎯 Using {best_method} result for video...")
        
        video_path = create_video_from_best_image(best_image, timestamp)
        
        if video_path:
            print("\n" + "="*50)
            print("🎉 COMPLETE SUCCESS!")
            print("="*50)
            print(f"📸 Best image: {best_image.name}")
            print(f"🎬 Video: {video_path.name}")
            print(f"📁 Location: {OUTPUT_DIR}")
            
            print("\n🔍 Please check results to see if logo is properly applied!")
        else:
            print(f"\n✅ Logo application successful!")
            print(f"📸 Results in: {OUTPUT_DIR}")
            print("⚠️  Video creation failed")
    else:
        print("\n❌ All methods failed")
        print("💡 Check if API key is valid and logo file exists")

if __name__ == "__main__":
    main()
