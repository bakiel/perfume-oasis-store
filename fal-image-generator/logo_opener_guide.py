#!/usr/bin/env python3
"""
Perfume Oasis Logo Opener Guide
Shows how to create a logo opener video
"""

import os
from datetime import datetime
from pathlib import Path

print("🎬 Perfume Oasis Logo Opener Guide")
print("="*50)

# Configuration
BRAND_COLORS = {
    'emerald': '#0E5C4A',
    'gold': '#C8A95B', 
    'sand': '#F6F3EF'
}

OUTPUT_DIR = Path(os.path.expanduser('~/Pictures/perfume-oasis-ai/logo-openers'))
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

print("\n📋 Logo Opener Creation Process:")
print("\nOPTION 1: Direct Text-to-Video (Recommended)")
print("-"*40)

# Logo opener prompt
logo_prompt = f"""
elegant logo reveal animation for luxury perfume brand PERFUME OASIS,
emerald green ({BRAND_COLORS['emerald']}) silk background,
golden ({BRAND_COLORS['gold']}) particles floating and swirling,
text 'PERFUME OASIS' appearing in elegant gold lettering,
hexagonal logo shape with gold borders materializing,
camera slowly zooming in with particles gathering around logo,
premium brand introduction, cinematic quality, studio lighting,
professional motion graphics, luxury aesthetic
"""

print("\n🎯 Hailuo AI Configuration:")
print(f"Endpoint: fal-ai/minimax-video")
print(f"Duration: 6 seconds (perfect for logo opener)")
print(f"Cost: $0.045 × 6 = $0.27")

print("\n📝 Example Code:")
print("""
import fal_client as fal

result = fal.run(
    "fal-ai/minimax-video",
    arguments={
        "prompt": logo_prompt,
        "duration": 6
    }
)
""")

print("\n\nOPTION 2: Image-to-Video (More Control)")
print("-"*40)

print("\nStep 1: Create static logo frame with ImageN4")
static_prompt = """
Perfume Oasis luxury brand logo design,
elegant gold text 'PERFUME OASIS' on emerald green background,
hexagonal golden frame element above text,
golden particles scattered around,
premium brand identity, professional design
"""

print(f"\nPrompt: {static_prompt[:100]}...")

print("\nStep 2: Animate with Hailuo AI")
motion_prompt = """
camera slowly zooming into logo,
golden particles swirling and gathering,
subtle silk fabric movement in background,
elegant light rays appearing,
premium logo reveal animation
"""

print(f"\nMotion prompt: {motion_prompt[:100]}...")

print("\n\n🎨 Logo Opener Variations:")
print("-"*40)

variations = {
    "Elegant Fade": {
        "description": "Soft fade-in with particle effects",
        "duration": 6,
        "keywords": "fade in, soft particles, elegant reveal"
    },
    "Dynamic Zoom": {
        "description": "Camera zooming with light streaks",
        "duration": 6,
        "keywords": "dynamic zoom, light streaks, energy"
    },
    "Luxury Shimmer": {
        "description": "Golden shimmer effect revealing logo",
        "duration": 10,
        "keywords": "shimmer, luxury, golden glow"
    },
    "Particle Formation": {
        "description": "Particles forming the logo shape",
        "duration": 6,
        "keywords": "particle formation, assembly, magical"
    }
}

for name, details in variations.items():
    print(f"\n{name}:")
    print(f"  • {details['description']}")
    print(f"  • Duration: {details['duration']}s (${0.045 * details['duration']:.2f})")
    print(f"  • Keywords: {details['keywords']}")

print("\n\n📁 Output Structure:")
print(f"Logo openers will be saved to: {OUTPUT_DIR}")

print("\n\n💡 Best Practices:")
print("• Keep duration at 6 seconds for quick impact")
print("• Include brand colors in every prompt")
print("• Mention 'PERFUME OASIS' text explicitly")
print("• Use keywords: elegant, luxury, premium, golden")
print("• Add 'studio lighting' for professional look")

print("\n\n🚀 Quick Start Commands:")
print("\n# Generate elegant logo opener:")
print("python visual_ai_studio_v2.py video \"elegant PERFUME OASIS logo reveal, emerald silk, golden particles\" --duration 6")

print("\n# Generate with existing logo image:")
print("python visual_ai_studio_v2.py video \"camera zoom into logo, particles swirling\" --duration 6 --with-logo")

print("\n" + "="*50)
print("✅ Ready to create logo openers!")
print(f"📁 Videos will be saved to: {OUTPUT_DIR}")
