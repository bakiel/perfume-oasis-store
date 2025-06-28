# General Images - Quick Integration Guide

## For Perfume Oasis

### Hero Sections
- **Location**: `backgrounds/` or `abstract/`
- **Use**: Soft gradients, luxury textures
- **Example**: `background-gradient-soft-001.jpg`

### Product Displays
- **Location**: `luxury/` or `backgrounds/`
- **Use**: Marble surfaces, silk fabrics, elegant backdrops
- **Example**: `luxury-marble-minimal-002.jpg`

### Category Headers
- **Location**: `nature/` or `concepts/`
- **Use**: Flowers for floral scents, woods for woody scents
- **Example**: `nature-roses-macro-003.jpg`

### About/Story Pages
- **Location**: `lifestyle/` or `nature/`
- **Use**: Ingredient origins, craftsmanship scenes
- **Example**: `lifestyle-perfume-creation-001.jpg`

## For Other Projects

### E-commerce
- Product backgrounds from `backgrounds/`
- Lifestyle shots from `lifestyle/`
- Category images from relevant folders

### Corporate/Business
- Abstract concepts from `abstract/`
- Professional backgrounds from `backgrounds/`
- Team/culture images from `lifestyle/`

### Creative/Design
- All folders applicable
- Mix and match for unique compositions
- Use as base for further editing

## Quick Copy Commands

### Copy entire folder to new project:
```bash
cp -r /Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/assets/general-images /path/to/new/project/assets/
```

### Copy specific category:
```bash
cp -r /Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/assets/general-images/luxury /path/to/new/project/images/
```

## Image Processing Tips

### Web Optimization
```bash
# Using ImageMagick
convert input.jpg -quality 85 -resize 1920x1920\> output.jpg

# Batch process
for img in *.jpg; do convert "$img" -quality 85 "optimized-$img"; done
```

### Multiple Sizes
```bash
# Generate responsive images
convert input.jpg -resize 400x400 small.jpg
convert input.jpg -resize 800x800 medium.jpg
convert input.jpg -resize 1200x1200 large.jpg
```

## Remember
- These images are project-agnostic
- No branding or specific product placement
- High quality suitable for professional use
- Can be freely moved between projects
