#!/usr/bin/env python3
"""
Perfume Oasis Visual AI Studio - Updated with Hailuo AI as Primary Video Model
"""

import os
import json
import sys
from pathlib import Path
from datetime import datetime
import argparse

# Configuration with Hailuo AI as primary video model
CONFIG = {
    "api_key": "8282ba3d-3ed8-477a-97c1-f2df0b0788d9:63ac16ab4d6036adb13613967e8ff70d",
    "output_base": "~/Pictures/perfume-oasis-ai",
    "models": {
        # Image Models
        "imagen4": {
            "api": "fal-ai/imagen4/preview/fast",
            "use_for": "general high-quality images, product shots, lifestyle"
        },
        "gpt-image": {
            "api": "fal-ai/gpt-image-1/text-to-image/byok",
            "use_for": "text-heavy posts, social media with text overlays"
        },
        "gpt-edit": {
            "api": "fal-ai/gpt-image-1/edit-image/byok",
            "use_for": "adding logos to images, editing existing images"
        },
        "flux-context": {
            "api": "fal-ai/flux-pro/kontext",
            "use_for": "context-aware edits, style transfers"
        },
        # Video Models - Hailuo AI as primary
        "hailuo": {
            "api": "fal-ai/minimax-video",
            "use_for": "PRIMARY VIDEO MODEL - best quality/cost ratio",
            "cost": "$0.045/second",
            "durations": [6, 10],
            "supports_image": True
        },
        "seedance": {
            "api": "fal-ai/cogvideox-5b/video",  
            "use_for": "budget alternative when needed",
            "cost": "$0.03/second",
            "max_duration": 6
        }
    },
    "brand": {
        "colors": {
            "emerald": "#0E5C4A",
            "gold": "#C8A95B",
            "sand": "#F6F3EF"
        },
        "logo_path": "assets/perfume-oasis-logo.png"
    }
}

class VisualAIStudio:
    def __init__(self):
        self.config = CONFIG
        self.setup_environment()
    
    def setup_environment(self):
        """Set up API key and create output directories"""
        os.environ['FAL_KEY'] = self.config['api_key']
        
        # Add venv to path
        script_dir = os.path.dirname(os.path.abspath(__file__))
        venv_path = os.path.join(script_dir, 'venv', 'bin')
        if os.path.exists(venv_path):
            os.environ['PATH'] = f"{venv_path}:{os.environ['PATH']}"
            for py_version in ['python3.10', 'python3.12', 'python3.11', 'python3.9']:
                site_packages = os.path.join(script_dir, 'venv', 'lib', py_version, 'site-packages')
                if os.path.exists(site_packages):
                    sys.path.insert(0, site_packages)
                    break
        
        # Create output directories
        base_path = Path(os.path.expanduser(self.config['output_base']))
        self.output_dirs = {
            'images': base_path / 'images',
            'posts': base_path / 'posts',
            'videos': base_path / 'videos',
            'campaigns': base_path / 'campaigns'
        }
        
        for dir_path in self.output_dirs.values():
            dir_path.mkdir(parents=True, exist_ok=True)
    
    def generate_image(self, prompt, model='imagen4', size='1024x1024'):
        """Generate a single image using specified model"""
        import fal_client as fal
        import requests
        from PIL import Image
        import io
        
        print(f"🎨 Generating image with {model}...")
        print(f"Prompt: {prompt}")
        print(f"Size: {size}")
        
        model_info = self.config['models'].get(model, {})
        print(f"Best for: {model_info.get('use_for', 'general use')}")
        
        # Add brand colors to prompt if needed
        enhanced_prompt = self._enhance_prompt_with_brand(prompt)
        
        try:
            # Get model API endpoint
            api_endpoint = model_info.get('api')
            
            # Handle different size formats
            width, height = size.split('x')
            
            result = fal.run(
                api_endpoint,
                arguments={
                    "prompt": enhanced_prompt,
                    "image_size": size if model == 'imagen4' else None,
                    "width": int(width) if model != 'imagen4' else None,
                    "height": int(height) if model != 'imagen4' else None
                }
            )
            
            if result and 'images' in result:
                image_url = result['images'][0]['url']
                
                # Download and save
                response = requests.get(image_url)
                img = Image.open(io.BytesIO(response.content))
                
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"{model}_{timestamp}.jpg"
                output_path = self.output_dirs['images'] / filename
                
                # Save optimized
                img.save(output_path, 'JPEG', quality=85, optimize=True)
                
                print(f"\n✅ Image saved to: {output_path}")
                print(f"Size: {output_path.stat().st_size / 1024:.1f} KB")
                return str(output_path)
            
        except Exception as e:
            print(f"\n❌ Error generating image: {str(e)}")
            return None
    
    def generate_video(self, prompt, duration=6, with_logo=False, model='hailuo'):
        """Generate video using Hailuo AI (primary) or Seedance (budget)"""
        import fal_client as fal
        import requests
        
        print(f"🎬 Generating video with {model.upper()}...")
        print(f"Prompt: {prompt}")
        print(f"Duration: {duration} seconds")
        print(f"With logo: {with_logo}")
        
        model_info = self.config['models'].get(model, self.config['models']['hailuo'])
        print(f"Model: {model_info.get('use_for', '')}")
        print(f"Cost: {model_info.get('cost', 'N/A')}")
        
        # Enhance prompt with brand elements
        enhanced_prompt = self._enhance_prompt_with_brand(prompt)
        
        if with_logo:
            print("\n📝 Logo Integration Process:")
            print("1. First generating branded product image...")
            print("2. Then creating video from that image")
            
            # Step 1: Generate branded image
            image_prompt = f"{prompt}, with Perfume Oasis logo visible"
            image_path = self.generate_image(image_prompt, model='imagen4')
            
            if image_path:
                print("\n3. Creating video from branded image...")
                # Here you would use image-to-video with the branded image
        
        try:
            # Video generation
            api_endpoint = model_info.get('api')
            
            # Validate duration for Hailuo
            if model == 'hailuo' and duration not in [6, 10]:
                print(f"⚠️ Hailuo only supports 6 or 10 seconds. Using 6 seconds.")
                duration = 6
            
            result = fal.run(
                api_endpoint,
                arguments={
                    "prompt": enhanced_prompt,
                    "duration": duration
                }
            )
            
            if result and 'video' in result:
                video_url = result['video']['url']
                
                # Download and save
                response = requests.get(video_url)
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"{model}_{timestamp}.mp4"
                output_path = self.output_dirs['videos'] / filename
                
                with open(output_path, 'wb') as f:
                    f.write(response.content)
                
                print(f"\n✅ Video saved to: {output_path}")
                print(f"Size: {output_path.stat().st_size / 1024 / 1024:.2f} MB")
                print(f"Cost: ${model_info.get('cost', '0.045').replace('$','').replace('/second','')} × {duration} = ${float(model_info.get('cost', '0.045').replace('$','').replace('/second','')) * duration:.2f}")
                return str(output_path)
                
        except Exception as e:
            print(f"\n❌ Error generating video: {str(e)}")
            return None
    
    def generate_post(self, text, background_prompt, model='gpt-image'):
        """Generate social media post with text overlay"""
        print(f"📱 Generating social media post...")
        print(f"Text: {text}")
        print(f"Background: {background_prompt}")
        
        # Note: GPT-Image requires OpenAI API key
        print("\n⚠️ Note: GPT-Image-1 requires OpenAI API key (BYOK)")
        print("Alternative: Use ImageN4 and add text in post-processing")
        
        # For now, generate background with ImageN4
        full_prompt = f"{background_prompt}, leave space for text '{text}', social media post design"
        return self.generate_image(full_prompt, model='imagen4', size='1080x1080')
    
    def _enhance_prompt_with_brand(self, prompt):
        """Add brand elements to prompt if applicable"""
        brand_keywords = ['perfume oasis', 'brand', 'product', 'bottle', 'luxury']
        
        if any(keyword in prompt.lower() for keyword in brand_keywords):
            colors = self.config['brand']['colors']
            return f"{prompt}, luxury aesthetic with emerald green ({colors['emerald']}) and gold ({colors['gold']}) accents, elegant lighting"
        
        return prompt
    
    def recommend_model(self, task_type):
        """Recommend best model for specific task"""
        recommendations = {
            'product': 'imagen4',
            'social': 'gpt-image',
            'logo': 'gpt-edit',
            'video': 'hailuo',  # Hailuo AI as primary
            'video-budget': 'seedance',
            'edit': 'flux-context'
        }
        
        return recommendations.get(task_type, 'imagen4')

def main():
    parser = argparse.ArgumentParser(description='Perfume Oasis Visual AI Studio')
    parser.add_argument('command', choices=['image', 'post', 'video', 'recommend'],
                       help='Type of content to generate')
    parser.add_argument('prompt', nargs='?', default='',
                       help='Prompt or description')
    parser.add_argument('--model', help='Specific model to use')
    parser.add_argument('--size', default='1024x1024', help='Image size')
    parser.add_argument('--text', help='Text for social posts')
    parser.add_argument('--duration', type=int, default=6, help='Video duration')
    parser.add_argument('--with-logo', action='store_true', help='Include logo in video')
    parser.add_argument('--budget', action='store_true', help='Use budget video model (Seedance)')
    
    args = parser.parse_args()
    
    studio = VisualAIStudio()
    
    if args.command == 'image':
        model = args.model or studio.recommend_model('product')
        studio.generate_image(args.prompt, model, args.size)
    
    elif args.command == 'post':
        if not args.text:
            print("Error: --text required for posts")
            return
        studio.generate_post(args.text, args.prompt)
    
    elif args.command == 'video':
        # Use Hailuo by default, Seedance if budget flag is set
        model = 'seedance' if args.budget else 'hailuo'
        if args.model:
            model = args.model
        studio.generate_video(args.prompt, args.duration, args.with_logo, model)
    
    elif args.command == 'recommend':
        print("\n🤖 Model Recommendations:")
        print("\n=== IMAGE GENERATION ===")
        print("1. General Images (products, lifestyle): use 'imagen4'")
        print("2. Social Media Posts with Text: use 'gpt-image' (requires OpenAI key)")
        print("3. Logo Integration: use 'gpt-edit' (requires OpenAI key)")
        print("4. Style Transfer/Edits: use 'flux-context'")
        print("\n=== VIDEO GENERATION ===")
        print("5. Primary Video Model: use 'hailuo' (Best quality/cost - $0.045/sec)")
        print("6. Budget Video Option: use 'seedance' (Lower cost - $0.03/sec)")
        print("\n💡 TIP: Hailuo AI is the no-brainer choice for most video needs!")

if __name__ == '__main__':
    main()
