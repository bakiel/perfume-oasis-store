"""
Utility functions for Visual AI Generator
"""
import os
import json
import requests
from pathlib import Path
from datetime import datetime
from PIL import Image
import io

def load_config(config_path: str = None) -> dict:
    """Load configuration file"""
    if config_path is None:
        config_path = Path(__file__).parent.parent / 'config.json'
    
    with open(config_path, 'r') as f:
        return json.load(f)

def optimize_image(image_data: bytes, quality: int = 60, 
                  keep_png: bool = False) -> bytes:
    """Optimize image for size and quality"""
    img = Image.open(io.BytesIO(image_data))
    
    # Convert RGBA to RGB if not keeping PNG
    if img.mode == 'RGBA' and not keep_png:
        background = Image.new('RGB', img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[3])
        img = background
    
    output = io.BytesIO()
    
    if keep_png:
        img.save(output, format='PNG', optimize=True)
    else:
        img.save(output, format='JPEG', quality=quality, optimize=True)
    
    return output.getvalue()

def save_output(url: str, model_name: str, prompt: str, 
                is_video: bool = False, optimize: bool = True) -> str:
    """Download and save generated content"""
    config = load_config()
    
    # Set up paths
    base_dir = Path(os.path.expanduser(config['output_dir']))
    if is_video:
        output_dir = base_dir / 'videos' / model_name
    else:
        output_dir = base_dir / 'images' / model_name
    
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    safe_prompt = "".join(c for c in prompt[:50] if c.isalnum() or c in ' -_')
    safe_prompt = safe_prompt.strip().replace(' ', '_')
    
    if is_video:
        filename = f"{safe_prompt}_{timestamp}.mp4"
    else:
        keep_png = 'logo' in prompt.lower() or 'transparent' in prompt.lower()
        filename = f"{safe_prompt}_{timestamp}.{'png' if keep_png else 'jpg'}"
    
    filepath = output_dir / filename
    
    # Download content
    response = requests.get(url)
    response.raise_for_status()
    
    # Optimize images if requested
    if not is_video and optimize and not keep_png:
        content = optimize_image(response.content, keep_png=keep_png)
    else:
        content = response.content
    
    # Save file
    with open(filepath, 'wb') as f:
        f.write(content)
    
    print(f"✅ Saved to: {filepath}")
    return str(filepath)

def format_size(size_str: str) -> tuple:
    """Convert size string to width, height tuple"""
    if 'x' not in size_str:
        raise ValueError("Size must be in format WIDTHxHEIGHT (e.g., 1024x1024)")
    
    width, height = map(int, size_str.split('x'))
    return width, height
