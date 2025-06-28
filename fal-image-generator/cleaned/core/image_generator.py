"""
Image Generator Module
Handles all image generation tasks with different models
"""
import os
import json
from pathlib import Path
from datetime import datetime
import fal_client as fal
from typing import Optional, Dict, Any
from .utils import optimize_image, save_output

class ImageGenerator:
    def __init__(self, config_path: str = None):
        self.config = self._load_config(config_path)
        os.environ['FAL_KEY'] = self.config['api_key']
        
    def _load_config(self, config_path: str = None) -> Dict:
        """Load configuration from file"""
        if config_path is None:
            config_path = Path(__file__).parent.parent / 'config.json'
        
        with open(config_path, 'r') as f:
            return json.load(f)
    
    def generate_imagen4(self, prompt: str, size: str = "1024x1024", 
                        seed: Optional[int] = None) -> str:
        """Generate high-quality images with ImageN4"""
        width, height = map(int, size.split('x'))
        
        args = {
            "prompt": prompt,
            "output_format": "jpeg",
            "width": width,
            "height": height,
            "inference_steps": 50,
            "guidance_scale": 7.5
        }
        
        if seed:
            args["seed"] = seed
            
        result = fal.subscribe(
            self.config['models']['imagen4']['api'],
            arguments=args
        )
        
        return save_output(result['images'][0]['url'], 'imagen4', prompt)
    
    def generate_gpt_image(self, prompt: str, style: str = "post",
                          size: str = "1024x1024", openai_key: str = None) -> str:
        """Generate text-heavy images with GPT-Image"""
        openai_key = openai_key or os.environ.get('OPENAI_API_KEY')
        if not openai_key:
            raise ValueError("OpenAI API key required for GPT-Image")
        
        width, height = map(int, size.split('x'))
        
        # Add style-specific enhancements
        if style == "post":
            prompt = f"Social media post design: {prompt}. Clean typography, readable text"
        elif style == "logo":
            prompt = f"Logo design: {prompt}. Vector-style, clean lines, scalable"
            
        args = {
            "prompt": prompt,
            "image_size": f"{width}x{height}",
            "api_key": openai_key
        }
        
        result = fal.subscribe(
            self.config['models']['gpt-image']['text']['api'],
            arguments=args
        )
        
        return save_output(result['images'][0]['url'], 'gpt-image', prompt)
    
    def generate_flux_context(self, prompt: str, context: str = "",
                             size: str = "1024x1024", seed: Optional[int] = None) -> str:
        """Generate context-aware images with Flux Context"""
        width, height = map(int, size.split('x'))
        
        # Enhance prompt with context
        full_prompt = f"{prompt}. Context: {context}" if context else prompt
        
        args = {
            "prompt": full_prompt,
            "image_size": {"width": width, "height": height},
            "num_inference_steps": 28,
            "guidance_scale": 3.5
        }
        
        if seed:
            args["seed"] = seed
            
        result = fal.subscribe(
            self.config['models']['flux-context']['api'],
            arguments=args
        )
        
        return save_output(result['images'][0]['url'], 'flux-context', prompt)
    
    def generate(self, prompt: str, model: str = "imagen4", **kwargs) -> str:
        """Main generation method - routes to appropriate model"""
        generators = {
            'imagen4': self.generate_imagen4,
            'gpt-image': self.generate_gpt_image,
            'flux-context': self.generate_flux_context
        }
        
        if model not in generators:
            raise ValueError(f"Unknown model: {model}. Choose from: {list(generators.keys())}")
        
        return generators[model](prompt, **kwargs)
