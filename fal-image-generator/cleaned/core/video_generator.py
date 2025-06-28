"""
Video Generator Module
Handles video generation with Hailuo and Seedance
"""
import os
import json
from pathlib import Path
from datetime import datetime
import fal_client as fal
from typing import Optional, Dict, Any
from .utils import save_output

class VideoGenerator:
    def __init__(self, config_path: str = None):
        self.config = self._load_config(config_path)
        os.environ['FAL_KEY'] = self.config['api_key']
        
    def _load_config(self, config_path: str = None) -> Dict:
        """Load configuration from file"""
        if config_path is None:
            config_path = Path(__file__).parent.parent / 'config.json'
        
        with open(config_path, 'r') as f:
            return json.load(f)
    
    def generate_hailuo(self, prompt: str, duration: int = 6,
                       image_path: Optional[str] = None,
                       logo_path: Optional[str] = None) -> str:
        """Generate video with Hailuo AI"""
        if duration not in [6, 10]:
            raise ValueError("Hailuo only supports 6 or 10 second durations")
        
        args = {
            "prompt": prompt,
            "duration": str(duration)
        }
        
        # Add image if provided (for image-to-video)
        if image_path:
            args["image_url"] = image_path
            
        # TODO: Add logo overlay in post-processing if logo_path provided
        
        result = fal.subscribe(
            self.config['models']['video']['hailuo']['api'],
            arguments=args
        )
        
        return save_output(result['video']['url'], 'hailuo-video', prompt, is_video=True)
    
    def generate_seedance(self, prompt: str, duration: int = 4,
                         seed: Optional[int] = None) -> str:
        """Generate cost-effective video with Seedance"""
        if duration > 6:
            raise ValueError("Seedance supports up to 6 second durations")
        
        args = {
            "prompt": prompt,
            "duration": duration,
            "video_size": "landscape_16_9"
        }
        
        if seed:
            args["seed"] = seed
            
        result = fal.subscribe(
            self.config['models']['video']['seedance']['api'],
            arguments=args
        )
        
        return save_output(result['video']['url'], 'seedance-video', prompt, is_video=True)
    
    def generate(self, prompt: str, model: str = "hailuo", **kwargs) -> str:
        """Main generation method - routes to appropriate model"""
        generators = {
            'hailuo': self.generate_hailuo,
            'seedance': self.generate_seedance
        }
        
        if model not in generators:
            raise ValueError(f"Unknown model: {model}. Choose from: {list(generators.keys())}")
        
        return generators[model](prompt, **kwargs)
