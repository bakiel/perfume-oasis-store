#!/usr/bin/env python3
"""
Perfume Oasis Logo Opener - Simplified Version
Using ImageN4 + Hailuo AI
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
OUTPUT_DIR = Path(os.path.expanduser('~/Pictures/perfume-oasis-ai/logo-openers'))
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

print("🎬 Perfume Oasis Logo Opener Creator")
print("="*50)

def create_logo_opener_video():
    """Create logo opener video using text-to-video"""
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    print("\n🎯 Creating Logo Opener Video")
    print("-"*40)
    
    # Logo opener prompt with all brand elements
    logo_prompt = (
        "elegant logo reveal animation for luxury perfume brand 'PERFUME OASIS', "
        "emerald green silk background with golden particles floating, "
        "text 'PERFUME OASIS' appearing in elegant gold lettering, "
        "camera slowly zooming in, particles swirling around text, "
        "premium brand introduction, cinematic quality, studio lighting, "
        "hexagon-shaped logo element with gold borders appearing first, "
        "then brand name fading in below, professional motion graphics"
    )
    
    print("📝 Video Details:")
    print(f"Model: Hailuo AI (fal-ai/minimax-video)")
    print(f"Duration: 6 seconds")
    print(f"Style: Elegant logo reveal")
    print(f"Cost: $0.045 × 6 = $0.27")
    
    try:
        print("\n🔄 Generating logo opener video...")
        
        result = fal.run(
            "fal-ai/minimax-video",
            arguments={
                "prompt": logo_prompt,
                "duration": 6
            }
        )
        
        if result and 'video' in result:
            video_url = result['video']['url']
            
            # Download video
            print("📥 Downloading video...")
            response = requests.get(video_url)
            
            video_path = OUTPUT_DIR / f"logo_opener_{timestamp}.mp4"
            with open(video_path, 'wb') as f:
                f.write(response.content)
            
            print(f"\n✅ Logo opener created successfully!")
            print(f"📁 Saved to: {video_path}")
            print(f"📏 Size: {video_path.stat().st_size / 1024 / 1024:.2f} MB")
            
            # Create storyboard images for reference
            create_storyboard()
            
            return video_path
            
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        return None

def create_storyboard():
    """Create storyboard frames for the logo opener"""
    
    print("\n📸 Creating storyboard frames...")
    
    storyboard_frames = [
        {
            "name": "frame_1_opening",
            "prompt": "emerald green silk fabric background with subtle golden particles, elegant lighting, no text",
            "description": "Opening shot - elegant background"
        },
        {
            "name": "frame_2_logo_appear",
            "prompt": "hexagonal golden frame appearing on emerald silk, golden particles gathering",
            "description": "Logo shape materializing"
        },
        {
            "name": "frame_3_text_reveal",
            "prompt": "elegant gold text 'PERFUME OASIS' on emerald background with golden hexagon frame above",
            "description": "Brand name reveal"
        }
    ]
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    for i, frame in enumerate(storyboard_frames, 1):
        print(f"\nGenerating frame {i}: {frame['description']}")
        
        try:
            result = fal.run(
                "fal-ai/imagen4/preview/fast",
                arguments={
                    "prompt": frame['prompt'] + ", professional brand design, luxury aesthetic",
                    "image_size": "1920x1080"
                }
            )
            
            if result and 'images' in result:
                image_url = result['images'][0]['url']
                
                # Download and save
                response = requests.get(image_url)
                frame_path = OUTPUT_DIR / f"storyboard_{timestamp}_{frame['name']}.jpg"
                
                with open(frame_path, 'wb') as f:
                    f.write(response.content)
                
                print(f"✅ Frame {i} saved: {frame_path.name}")
                
        except Exception as e:
            print(f"❌ Error creating frame {i}: {str(e)}")

def create_variations():
    """Show different logo opener styles available"""
    
    print("\n\n🎨 Logo Opener Variations")
    print("-"*40)
    
    variations = [
        {
            "name": "Elegant Reveal",
            "prompt": "elegant logo fade in with golden particles on emerald silk",
            "duration": 6,
            "cost": "$0.27"
        },
        {
            "name": "Dynamic Zoom",
            "prompt": "dynamic camera zoom into Perfume Oasis logo with light streaks",
            "duration": 6,
            "cost": "$0.27"
        },
        {
            "name": "Luxury Shimmer",
            "prompt": "luxurious golden shimmer revealing Perfume Oasis text",
            "duration": 10,
            "cost": "$0.45"
        },
        {
            "name": "Particle Formation",
            "prompt": "golden particles forming Perfume Oasis logo shape",
            "duration": 6,
            "cost": "$0.27"
        }
    ]
    
    print("\nAvailable Styles:")
    for var in variations:
        print(f"\n{var['name'].upper()}")
        print(f"  Prompt: {var['prompt']}")
        print(f"  Duration: {var['duration']} seconds")
        print(f"  Cost: {var['cost']}")
    
    print("\n💡 To create a variation, run:")
    print("python create_logo_opener.py --style <style_name>")

# Main execution
if __name__ == "__main__":
    print("\nStarting Logo Opener Creation...")
    print("="*50)
    
    # Create the main logo opener
    video_path = create_logo_opener_video()
    
    if video_path:
        print("\n" + "="*50)
        print("✅ Logo Opener Complete!")
        print("="*50)
        
        print("\n📋 Summary:")
        print(f"• Video Model: Hailuo AI")
        print(f"• Duration: 6 seconds")
        print(f"• Cost: $0.27")
        print(f"• Location: {OUTPUT_DIR}")
        
        print("\n🎯 Usage:")
        print("• Beginning of brand videos")
        print("• Social media campaigns")
        print("• Product launches")
        print("• Email marketing videos")
        
        # Show variations
        create_variations()
        
        print("\n🌐 Preview:")
        print(f"Open folder: {OUTPUT_DIR}")
        print("The video file can be played in any video player")
        
    else:
        print("\n❌ Failed to create logo opener")
        print("\n💡 Alternative approach:")
        print("1. Create static logo image with ImageN4")
        print("2. Use image-to-video with Hailuo AI")
        print("3. Add motion prompt for animation")
