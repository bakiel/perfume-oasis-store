# Perfume Oasis Visual AI Studio

A simplified, unified system for generating images and videos using AI models optimized for the Perfume Oasis brand.

## Quick Start

```bash
# Generate a product image
python visual_ai_studio_unified.py image "elegant perfume bottle on silk"

# Create a social media post with text
python visual_ai_studio_unified.py post "summer collection background" --text "New Summer Collection 2024"

# Generate a video with logo
python visual_ai_studio_unified.py video "perfume bottle rotating slowly" --with-logo

# Get model recommendations
python visual_ai_studio_unified.py recommend
```

## Model Strategy

### 1. **ImageN4** - General High-Quality Images
- **Best for**: Product shots, lifestyle images, marketing visuals
- **Quality**: Highest quality output
- **Speed**: Moderate
- **Usage**: `--model imagen4` (default for images)

### 2. **GPT Image** - Text-Heavy Content
- **Best for**: Social media posts, promotional content with text
- **Strengths**: Excellent text rendering and layout understanding
- **Usage**: `--model gpt-image` (default for posts)

### 3. **Flux Context** - Smart Edits
- **Best for**: Style transfers, context-aware modifications
- **When to use**: Alternative to GPT Image for complex edits
- **Usage**: `--model flux-context`

### 4. **Video Models**
- **Hailuo**: Premium quality (6-10 seconds)
- **Seedance**: Budget-friendly alternative

## Brand Consistency

The system automatically enhances prompts with Perfume Oasis brand elements:
- **Emerald Green**: #0E5C4A
- **Royal Gold**: #C8A95B
- **Soft Sand**: #F6F3EF

## Output Structure

All generated content is organized in:
```
~/Pictures/perfume-oasis-ai/
├── images/      # General images
├── posts/       # Social media posts
├── videos/      # Video content
└── campaigns/   # Campaign materials
```

## Examples

### Product Photography
```bash
python visual_ai_studio_unified.py image "luxury perfume bottle with emerald liquid, gold cap, professional product photography"
```

### Instagram Post
```bash
python visual_ai_studio_unified.py post "elegant perfume bottles arrangement" --text "Discover Your Signature Scent"
```

### Product Video
```bash
python visual_ai_studio_unified.py video "perfume bottle on rotating platform, elegant lighting" --duration 6 --with-logo
```

## Tips for Best Results

1. **Be Specific**: Include details about lighting, angle, and style
2. **Use Brand Keywords**: Mention "emerald", "gold", or "luxury" for brand consistency
3. **Model Selection**: Let the system recommend or specify with `--model`
4. **Image Sizes**: Use `--size 1920x1080` for custom dimensions

## Troubleshooting

If you encounter issues:
1. Check API key in the script
2. Ensure all dependencies are installed: `pip install fal-client pillow requests`
3. Verify output directories exist and are writable

## Architecture

The simplified system consists of:
- **One unified script**: All functionality in one place
- **Clear model separation**: Each model has a specific purpose
- **Automatic enhancements**: Brand consistency built-in
- **Organized outputs**: Clear directory structure
