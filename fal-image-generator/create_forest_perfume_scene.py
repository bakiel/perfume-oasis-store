#!/usr/bin/env python3
"""
Perfume Oasis Forest Scene Creator
Creates a perfume bottle with logo in a forest setting using Flux Context
Then converts to video with camera movement
"""

import os
import json
import sys
from pathlib import Path
from datetime import datetime
import argparse

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
import io
import base64

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

print("🌲 Perfume Oasis Forest Scene Creator")
print("="*50)

def encode_image_to_base64(image_path):
    """Convert image to base64 for API use"""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def create_perfume_forest_scene():
    """Create perfume bottle with logo in forest using flux context"""
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    print("\n🎯 Step 1: Creating Perfume Bottle in Forest Scene")
    print("-"*40)
    
    # First, generate a base perfume bottle in forest scene
    base_prompt = (
        "elegant emerald green perfume bottle standing on moss-covered rock "
        "in a magical forest, soft morning light filtering through trees, "
        "dewdrops on leaves, golden sunbeams, misty atmosphere, "
        "professional product photography, luxury perfume advertisement, "
        "shallow depth of field with bottle in sharp focus"
    )
    
    print("📸 Generating base forest scene...")
    print(f"Model: ImageN4")
    
    try:
        # Generate base image
        result = fal.run(
            "fal-ai/imagen4/preview/fast",
            arguments={
                "prompt": base_prompt,
                "image_size": "1920x1080"
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
            
            # Now apply logo using flux context
            print("\n🎯 Step 2: Applying Perfume Oasis Logo with Flux Context")
            print("-"*40)
            
            return apply_logo_with_flux(base_image_path, timestamp)
            
    except Exception as e:
        print(f"❌ Error creating base scene: {str(e)}")
        return None

def apply_logo_with_flux(base_image_path, timestamp):
    """Apply logo to the bottle using Flux Context"""
    
    print("🔄 Applying logo to perfume bottle...")
    
    # Read logo
    if not LOGO_PATH.exists():
        print(f"❌ Logo not found at: {LOGO_PATH}")
        return None
    
    # Context prompt for logo application
    context_prompt = (
        "Add the provided logo to the perfume bottle in the image. "
        "The logo should appear elegantly on the front of the bottle, "
        "integrated naturally as if it's etched or printed on the glass. "
        "Maintain the bottle's emerald green color and the forest atmosphere. "
        "The logo should be clearly visible but sophisticated."
    )
    
    try:
        # Encode images
        base_image_b64 = encode_image_to_base64(base_image_path)
        logo_b64 = encode_image_to_base64(LOGO_PATH)
        
        print("📤 Sending to Flux Context...")
        
        # Use flux context to apply logo
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
            
            # Save logo-applied image
            response = requests.get(logo_applied_url)
            logo_image_path = OUTPUT_DIR / f"forest_with_logo_{timestamp}.jpg"
            with open(logo_image_path, 'wb') as f:
                f.write(response.content)
            
            print(f"✅ Logo applied successfully: {logo_image_path.name}")
            
            # Create video from the branded image
            return create_video_from_image(logo_image_path, timestamp)
            
    except Exception as e:
        print(f"❌ Error applying logo: {str(e)}")
        return None

def create_video_from_image(image_path, timestamp):
    """Create video from the branded perfume image"""
    
    print("\n🎯 Step 3: Creating Video with Camera Movement")
    print("-"*40)
    
    # Read and encode the image
    image_b64 = encode_image_to_base64(image_path)
    
    video_prompt = (
        "Cinematic camera movement starting with wide shot of forest, "
        "slowly zooming in to focus on the perfume bottle with logo, "
        "gentle pan around the bottle showing the brand name clearly, "
        "soft particles floating in the air, morning light getting stronger"
    )
    
    print("🎬 Generating video...")
    print(f"Model: Hailuo AI")
    print(f"Duration: 6 seconds")
    print(f"Cost: $0.27")
    
    try:
        # Image to video with Hailuo
        result = fal.run(
            "fal-ai/minimax-video",
            arguments={
                "prompt": video_prompt,
                "duration": 6,
                "image_url": f"data:image/jpeg;base64,{image_b64}"
            }
        )
        
        if result and 'video' in result:
            video_url = result['video']['url']
            
            # Download video
            print("📥 Downloading video...")
            response = requests.get(video_url)
            
            video_path = OUTPUT_DIR / f"forest_perfume_video_{timestamp}.mp4"
            with open(video_path, 'wb') as f:
                f.write(response.content)
            
            print(f"\n✅ Video created successfully!")
            print(f"📁 Saved to: {video_path}")
            print(f"📏 Size: {video_path.stat().st_size / 1024 / 1024:.2f} MB")
            
            return video_path
            
    except Exception as e:
        print(f"❌ Error creating video: {str(e)}")
        return None

def create_alternative_scenes():
    """Show different scene variations available"""
    
    print("\n\n🎨 Alternative Forest Scenes")
    print("-"*40)
    
    scenes = [
        {
            "name": "Morning Mist",
            "prompt": "perfume bottle on tree stump, morning mist, golden hour light"
        },
        {
            "name": "Waterfall Background",
            "prompt": "perfume bottle near waterfall, rainbow in mist, lush greenery"
        },
        {
            "name": "Enchanted Glade",
            "prompt": "perfume bottle in fairy tale forest clearing, butterflies, magical lighting"
        },
        {
            "name": "Autumn Forest",
            "prompt": "perfume bottle among autumn leaves, warm golden tones, cozy atmosphere"
        }
    ]
    
    print("\nAvailable Scene Variations:")
    for scene in scenes:
        print(f"\n• {scene['name']}")
        print(f"  {scene['prompt']}")

def main():
    print("\nStarting Forest Scene Creation...")
    print("="*50)
    
    # Check if logo exists
    if not LOGO_PATH.exists():
        print(f"\n❌ Logo file not found!")
        print(f"Expected at: {LOGO_PATH}")
        print("\n💡 Please ensure your logo is at:")
        print("   assets/perfume-oasis-logo.png")
        return
    
    # Create the scene
    video_path = create_perfume_forest_scene()
    
    if video_path:
        print("\n" + "="*50)
        print("✅ Forest Scene Complete!")
        print("="*50)
        
        print("\n📋 Process Summary:")
        print("1. ✅ Created forest scene with perfume bottle")
        print("2. ✅ Applied Perfume Oasis logo using Flux Context")
        print("3. ✅ Generated video with camera zoom to branded bottle")
        
        print(f"\n📁 Output Location: {OUTPUT_DIR}")
        
        print("\n🎥 Video Features:")
        print("• Starts with wide forest shot")
        print("• Zooms in to perfume bottle")
        print("• Shows logo clearly on bottle")
        print("• Professional cinematography")
        
        # Show alternative scenes
        create_alternative_scenes()
        
        print("\n💡 Usage Ideas:")
        print("• Product showcase videos")
        print("• Social media campaigns")
        print("• Website hero videos")
        print("• Email marketing")
        
    else:
        print("\n❌ Failed to create forest scene")
        print("\n🔧 Troubleshooting:")
        print("1. Check API key in config.json")
        print("2. Ensure logo file exists")
        print("3. Check internet connection")

if __name__ == "__main__":
    main()
