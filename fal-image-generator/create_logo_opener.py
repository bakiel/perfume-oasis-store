#!/usr/bin/env python3
"""
Perfume Oasis Logo Opener Video Creator
Creates a professional logo animation using GPT-Image + Hailuo AI
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
from PIL import Image
import io

# Load config
with open('config.json', 'r') as f:
    config = json.load(f)

# Set API key
os.environ['FAL_KEY'] = config['api_key']

# Brand configuration
BRAND = {
    'colors': {
        'emerald': '#0E5C4A',
        'gold': '#C8A95B',
        'sand': '#F6F3EF'
    },
    'logo_path': Path(SCRIPT_DIR) / 'assets' / 'perfume-oasis-logo.png'
}

# Output directory
OUTPUT_DIR = Path(os.path.expanduser('~/Pictures/perfume-oasis-ai'))
LOGO_OPENER_DIR = OUTPUT_DIR / 'logo-openers'
LOGO_OPENER_DIR.mkdir(parents=True, exist_ok=True)

print("🎬 Perfume Oasis Logo Opener Video Creator")
print("="*50)

def create_logo_opener():
    """Create a professional logo opener video"""
    
    print("\n📋 Logo Opener Creation Process:")
    print("1. Generate branded background with ImageN4")
    print("2. Create logo reveal frame with GPT-Image style")
    print("3. Generate animated video with Hailuo AI")
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Step 1: Create elegant background
    print("\n🎨 Step 1: Creating elegant background...")
    
    background_prompt = (
        f"elegant luxury background for logo reveal, "
        f"emerald green ({BRAND['colors']['emerald']}) silk fabric with golden ({BRAND['colors']['gold']}) particles, "
        f"soft lighting, premium aesthetic, blurred depth of field, cinematic quality"
    )
    
    try:
        # Generate background with ImageN4
        print("Generating background with ImageN4...")
        result = fal.run(
            "fal-ai/imagen4/preview/fast",
            arguments={
                "prompt": background_prompt,
                "image_size": "1920x1080"  # HD for video
            }
        )
        
        if result and 'images' in result:
            bg_url = result['images'][0]['url']
            
            # Download background
            response = requests.get(bg_url)
            bg_image = Image.open(io.BytesIO(response.content))
            
            # Save background
            bg_path = LOGO_OPENER_DIR / f"background_{timestamp}.jpg"
            bg_image.save(bg_path, 'JPEG', quality=95)
            print(f"✅ Background saved: {bg_path.name}")
            
            # Step 2: Create logo reveal frame
            print("\n🏷️ Step 2: Creating logo reveal frame...")
            
            # Since GPT-Image requires OpenAI key, we'll use Flux Context as alternative
            logo_prompt = (
                f"Perfume Oasis logo elegantly appearing on luxury emerald silk background, "
                f"golden particles surrounding the logo, premium brand reveal, "
                f"text 'PERFUME OASIS' in elegant gold lettering below logo, "
                f"cinematic lighting, high-end brand presentation"
            )
            
            print("Generating logo reveal frame with Flux Context...")
            result = fal.run(
                "fal-ai/flux-pro/kontext",
                arguments={
                    "prompt": logo_prompt,
                    "width": 1920,
                    "height": 1080
                }
            )
            
            if result and 'images' in result:
                logo_frame_url = result['images'][0]['url']
                
                # Download logo frame
                response = requests.get(logo_frame_url)
                logo_frame = Image.open(io.BytesIO(response.content))
                
                # Save logo frame
                logo_frame_path = LOGO_OPENER_DIR / f"logo_frame_{timestamp}.jpg"
                logo_frame.save(logo_frame_path, 'JPEG', quality=95)
                print(f"✅ Logo frame saved: {logo_frame_path.name}")
                
                # Step 3: Create animated video
                print("\n🎬 Step 3: Creating animated logo opener with Hailuo AI...")
                
                video_prompt = (
                    "elegant logo reveal animation, camera slowly zooming in, "
                    "golden particles swirling around logo, emerald silk fabric gently moving, "
                    "text 'PERFUME OASIS' fading in with golden glow, "
                    "premium brand introduction, cinematic quality, slow motion elegance"
                )
                
                print(f"Generating 6-second logo opener...")
                print(f"Model: Hailuo AI (fal-ai/minimax-video)")
                print(f"Cost: $0.045 × 6 = $0.27")
                
                # Generate video from the logo frame
                result = fal.run(
                    "fal-ai/minimax-video",
                    arguments={
                        "prompt": video_prompt,
                        "duration": 6  # Perfect for logo opener
                    }
                )
                
                if result and 'video' in result:
                    video_url = result['video']['url']
                    
                    # Download video
                    response = requests.get(video_url)
                    video_path = LOGO_OPENER_DIR / f"logo_opener_{timestamp}.mp4"
                    
                    with open(video_path, 'wb') as f:
                        f.write(response.content)
                    
                    print(f"\n✅ Logo opener video created!")
                    print(f"📁 Saved to: {video_path}")
                    print(f"📏 Size: {video_path.stat().st_size / 1024 / 1024:.2f} MB")
                    
                    # Create a simple HTML preview
                    create_preview_html(timestamp, bg_path.name, logo_frame_path.name, video_path.name)
                    
                    return video_path
                else:
                    print("❌ No video in response")
            else:
                print("❌ No logo frame generated")
                
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return None

def create_preview_html(timestamp, bg_name, logo_name, video_name):
    """Create HTML preview of the logo opener process"""
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Perfume Oasis Logo Opener - {timestamp}</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                background: #f6f3ef;
                padding: 20px;
                text-align: center;
            }}
            .container {{
                max-width: 1200px;
                margin: 0 auto;
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }}
            h1 {{
                color: #0E5C4A;
                margin-bottom: 10px;
            }}
            h2 {{
                color: #C8A95B;
                margin-top: 30px;
            }}
            .step {{
                margin: 20px 0;
                padding: 20px;
                background: #f9f9f9;
                border-radius: 8px;
            }}
            img {{
                max-width: 600px;
                margin: 10px;
                border: 2px solid #C8A95B;
                border-radius: 8px;
            }}
            video {{
                max-width: 800px;
                margin: 20px;
                border: 3px solid #0E5C4A;
                border-radius: 8px;
            }}
            .brand-colors {{
                display: flex;
                justify-content: center;
                gap: 20px;
                margin: 20px 0;
            }}
            .color-box {{
                width: 100px;
                height: 100px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎬 Perfume Oasis Logo Opener</h1>
            <p>Created: {timestamp}</p>
            
            <div class="brand-colors">
                <div class="color-box" style="background: #0E5C4A;">Emerald</div>
                <div class="color-box" style="background: #C8A95B;">Gold</div>
                <div class="color-box" style="background: #F6F3EF; color: #333;">Sand</div>
            </div>
            
            <div class="step">
                <h2>Step 1: Background</h2>
                <p>Elegant emerald silk with golden particles</p>
                <img src="{bg_name}" alt="Background">
            </div>
            
            <div class="step">
                <h2>Step 2: Logo Frame</h2>
                <p>Brand logo with elegant text placement</p>
                <img src="{logo_name}" alt="Logo Frame">
            </div>
            
            <div class="step">
                <h2>Step 3: Final Animation</h2>
                <p>6-second professional logo opener</p>
                <video controls autoplay muted loop>
                    <source src="{video_name}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </div>
            
            <div class="step">
                <h2>Technical Details</h2>
                <p><strong>Video Model:</strong> Hailuo AI (fal-ai/minimax-video)</p>
                <p><strong>Duration:</strong> 6 seconds</p>
                <p><strong>Resolution:</strong> 1920x1080 HD</p>
                <p><strong>Cost:</strong> $0.27</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    preview_path = LOGO_OPENER_DIR / f"preview_{timestamp}.html"
    with open(preview_path, 'w') as f:
        f.write(html_content)
    
    print(f"\n🌐 Preview created: {preview_path}")
    print(f"Open in browser: file://{preview_path.absolute()}")

def create_variations():
    """Create different logo opener variations"""
    
    print("\n\n🎨 Logo Opener Variations Available:")
    
    variations = {
        "elegant": {
            "description": "Classic elegant reveal with silk and particles",
            "prompt": "logo elegantly fading in on emerald silk, golden particles"
        },
        "dynamic": {
            "description": "Dynamic zoom with light streaks",
            "prompt": "logo appearing with dynamic light streaks, camera movement"
        },
        "minimal": {
            "description": "Minimalist fade with subtle animation",
            "prompt": "simple elegant logo fade in, minimal movement, premium feel"
        },
        "luxury": {
            "description": "Luxury reveal with golden shimmer",
            "prompt": "luxurious logo reveal with golden shimmer effect, premium"
        }
    }
    
    for name, info in variations.items():
        print(f"\n{name.upper()}:")
        print(f"  {info['description']}")
        print(f"  Prompt keywords: {info['prompt']}")

# Run the logo opener creation
if __name__ == "__main__":
    print("\n" + "="*50)
    print("Creating Professional Logo Opener")
    print("="*50)
    
    # Create main logo opener
    video_path = create_logo_opener()
    
    if video_path:
        print("\n✅ Logo Opener Creation Complete!")
        print(f"\n📁 All files saved in: {LOGO_OPENER_DIR}")
        print("\n💡 Usage Tips:")
        print("- Use at the beginning of brand videos")
        print("- Perfect for social media campaigns")
        print("- Can create variations with different styles")
        
        # Show variation options
        create_variations()
    else:
        print("\n❌ Logo opener creation failed")
        print("Note: GPT-Image requires OpenAI API key (BYOK)")
        print("Alternative: Using Flux Context for text rendering")
