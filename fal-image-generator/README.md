# Perfume Oasis Visual AI Studio

Clean, unified system for AI-powered image and video generation.

## Quick Start

```bash
# Generate an image
python visual_ai_studio_unified.py image "elegant perfume bottle"

# Create a social post
python visual_ai_studio_unified.py post "luxury background" --text "New Collection"

# Generate a video
python visual_ai_studio_unified.py video "product showcase" --with-logo
```

## Models

- **ImageN4**: High-quality general images (default)
- **GPT Image**: Text-heavy social media posts
- **Flux Context**: Style transfers and edits
- **Hailuo**: Premium videos (6-10 seconds)

## Structure

```
fal-image-generator/
├── visual_ai_studio_unified.py  # Main script
├── config.json                  # Configuration
├── core/                        # Core modules
├── workflows/                   # Workflow templates
├── assets/                      # Brand assets
├── output/                      # Generated content
└── venv/                        # Python environment
```

## Documentation

- [Simplified Guide](README_SIMPLIFIED.md) - Detailed usage instructions
- [Migration Guide](MIGRATION_GUIDE.md) - Transitioning from old system
- [Cleanup Report](CLEANUP_AUDIT_REPORT.md) - What changed and why

## Installation

```bash
cd /Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/fal-image-generator
./venv/bin/pip install -r requirements.txt
```

## Brand Colors

- Emerald: #0E5C4A
- Gold: #C8A95B
- Sand: #F6F3EF
