#!/usr/bin/env python3
"""
Unified Visual AI Studio for Perfume Oasis
Simplified interface for all image and video generation needs
"""

import os
import json
import sys
from pathlib import Path
from datetime import datetime
import argparse

# Configuration
CONFIG = {
    "api_key": "8282ba3d-3ed8-477a-97c1-f2df0b0788d9:63ac16ab4d6036adb13613967e8ff70d",
    "output_base": "~/Pictures/perfume-oasis-ai",
    "models": {
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
        "hailuo": {
            "api": "fal-ai/minimax-video",
            "use_for": "PRIMARY VIDEO MODEL - best quality/cost ratio, 6-10 seconds"
        },
        "seedance": {
            "api": "fal-ai/cogvideox-5b/video",
            "use_for": "budget video alternative"
        }
    },
    "brand": {
        "colors": {
            "emerald": "#0E5C4A",
            "gold": "#C8A95B",
            "sand": "#F6F3EF"
        },
        "logo_path": "assets/logos/perfume-oasis-logo.png"
    }
}

class VisualAIStudio:
    def __init__(self):
        self.config = CONFIG
        self.setup_environment()
    
    def setup_environment(self):
        """Set up API key and create output directories"""
        os.environ['FAL_KEY'] = self.config['api_key']
        
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
        print(f"🎨 Generating image with {model}...")
        print(f"Prompt: {prompt}")
        print(f"Size: {size}")
        
        # Model recommendation
        model_info = self.config['models'].get(model, {})
        print(f"Best for: {model_info.get('use_for', 'general use')}")
        
        # Add brand colors to prompt if needed
        enhanced_prompt = self._enhance_prompt_with_brand(prompt)
        
        # TODO: Actual fal_client implementation here
        print(f"\n✅ Image would be generated and saved to: {self.output_dirs['images']}")
        
        return f"{self.output_dirs['images']}/generated_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
    
    def generate_post(self, text, background_prompt, model='gpt-image'):
        """Generate social media post with text overlay"""
        print(f"📱 Generating social media post...")
        print(f"Text: {text}")
        print(f"Background: {background_prompt}")
        
        # TODO: Implementation for text overlay posts
        print(f"\n✅ Post would be generated and saved to: {self.output_dirs['posts']}")
        
        return f"{self.output_dirs['posts']}/post_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
    
    def generate_video(self, prompt, duration=6, with_logo=False):
        """Generate video with optional logo integration"""
        print(f"🎬 Generating video...")
        print(f"Prompt: {prompt}")
        print(f"Duration: {duration} seconds")
        print(f"With logo: {with_logo}")
        
        if with_logo:
            print("Will integrate Perfume Oasis logo into video")
        
        # TODO: Video generation implementation
        print(f"\n✅ Video would be generated and saved to: {self.output_dirs['videos']}")
        
        return f"{self.output_dirs['videos']}/video_{datetime.now().strftime('%Y%m%d_%H%M%S')}.mp4"
    
    def _enhance_prompt_with_brand(self, prompt):
        """Add brand elements to prompt if applicable"""
        brand_keywords = ['perfume oasis', 'brand', 'product', 'bottle']
        
        if any(keyword in prompt.lower() for keyword in brand_keywords):
            colors = self.config['brand']['colors']
            return f"{prompt} with emerald green ({colors['emerald']}) and gold ({colors['gold']}) accents"
        
        return prompt
    
    def recommend_model(self, task_type):
        """Recommend best model for specific task"""
        recommendations = {
            'product': 'imagen4',
            'social': 'gpt-image',
            'logo': 'gpt-edit',
            'video': 'hailuo',
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
        studio.generate_video(args.prompt, args.duration, args.with_logo)
    
    elif args.command == 'recommend':
        print("\n🤖 Model Recommendations:")
        print("\n1. General Images (products, lifestyle): use 'imagen4'")
        print("2. Social Media Posts with Text: use 'gpt-image'")
        print("3. Logo Integration: use 'gpt-edit'")
        print("4. Videos: use 'hailuo' (6-10 seconds)")
        print("5. Style Transfer/Edits: use 'flux-context'")

if __name__ == '__main__':
    main()
