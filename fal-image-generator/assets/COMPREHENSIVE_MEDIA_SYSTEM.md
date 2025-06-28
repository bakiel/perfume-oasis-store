# Comprehensive Media Generation System

## Overview
This system provides a structured approach to using multiple AI models for different content generation needs across Perfume Oasis and other projects.

## Model Hierarchy & Use Cases

### 1. **Imagen 4** - Base General Model
- **Purpose**: High-quality general images without branding
- **Location**: `/assets/general-images/`
- **Use Cases**:
  - Product backgrounds
  - Lifestyle scenes
  - Nature/ingredient shots
  - Abstract concepts
- **Advantages**:
  - Best photorealistic quality
  - No context needed
  - Portable across projects
- **Scripts**: 
  - `perfume-oasis-imagen4-campaign.py`

### 2. **GPT-Image-1** - Premium Instagram Content
- **Purpose**: Best-in-class image generation for social media
- **Location**: `/assets/gpt-image-content/`
- **Use Cases**:
  - Instagram posts
  - Social media campaigns
  - Marketing visuals
  - Hero images
- **Advantages**:
  - Superior quality
  - Understanding of composition
  - Professional aesthetics
- **Scripts**:
  - `perfume-oasis-gpt-image-1.py` (basic)
  - `perfume-oasis-gpt-image-advanced.py` (multi-model)
  - `perfume-oasis-gpt-image-campaign.py`

### 3. **FLUX Kontext** - Context-Aware Branding
- **Purpose**: Brand integration and context-aware editing
- **Location**: `/assets/branded-content/`
- **Use Cases**:
  - Logo placement
  - Brand element integration
  - Product customization
  - Iterative refinements
- **Advantages**:
  - Understands context
  - Preserves brand elements
  - Fast generation (8-10s)
  - Cost-effective
- **Scripts**:
  - `flux-kontext-logo-application.py`
  - `kontext-gpt-generator.py`
  - `multi-model-context-generator.py`

### 4. **FLUX Redux** - Variations
- **Purpose**: Create variations of existing images
- **Location**: `/assets/variations/`
- **Use Cases**:
  - A/B testing visuals
  - Multiple options from one concept
  - Style variations
- **Advantages**:
  - Fast variations
  - Maintains core concept
  - Good for exploration

### 5. **Hailuo AI** - Video Generation
- **Purpose**: Create short videos from images
- **Location**: `/assets/videos/`
- **Use Cases**:
  - Instagram Reels
  - Product animations
  - Story content
  - Dynamic ads
- **Advantages**:
  - 6-second clips perfect for social
  - Smooth animations
  - Professional quality

## Workflow Pipelines

### Basic Product Image
```
Imagen 4 (base) → Manual editing → Export
```

### Instagram Post
```
GPT-Image-1 (creation) → FLUX Kontext (branding) → Export
```

### Full Campaign
```
GPT-Image-1 (base) → GPT-Image-1 Edit (refinement) → 
FLUX Kontext (branding) → Hailuo AI (video) → Export
```

### Brand Variations
```
Existing image → FLUX Redux (variations) → 
FLUX Kontext (brand consistency) → Export
```

## Directory Structure

```
/assets/
├── general-images/          # Imagen 4 outputs
│   ├── concepts/
│   ├── backgrounds/
│   ├── luxury/
│   ├── lifestyle/
│   ├── abstract/
│   └── nature/
├── gpt-image-content/       # GPT-Image-1 outputs
│   ├── instagram/
│   ├── campaigns/
│   ├── hero-images/
│   └── social-media/
├── branded-content/         # FLUX Kontext outputs
│   ├── logo-integrated/
│   ├── brand-campaigns/
│   └── product-shots/
├── variations/             # FLUX Redux outputs
│   ├── a-b-tests/
│   ├── style-variations/
│   └── concept-exploration/
└── videos/                 # Hailuo AI outputs
    ├── reels/
    ├── stories/
    └── product-demos/
```

## Model Selection Guide

### When to Use Each Model:

**Imagen 4:**
- Need general, non-branded images
- Creating reusable assets
- Building image libraries
- Background/texture generation

**GPT-Image-1:**
- Instagram posts and social media
- Marketing campaigns
- Premium quality requirements
- Creative compositions

**FLUX Kontext:**
- Adding logos or brand elements
- Editing existing images
- Context-aware modifications
- Quick iterations with branding

**FLUX Redux:**
- Need multiple variations
- A/B testing visuals
- Exploring different styles
- Creating options for clients

**Hailuo AI:**
- Instagram Reels
- Dynamic content
- Product animations
- Video ads

## Cost Optimization

### Budget Tiers:

**Basic** (~$0.20/asset):
- Imagen 4 only
- Simple generation
- No iterations

**Standard** (~$0.50/asset):
- GPT-Image-1 base
- FLUX Kontext branding
- 1-2 iterations

**Premium** (~$2.50/campaign):
- Full pipeline
- Multiple models
- Video generation
- Extensive iterations

## Integration Scripts

### Universal Generator
```bash
# Use for any model combination
python universal-vai.py --models "gpt,kontext,video" --campaign "luxury"
```

### Quick Commands
```bash
# Instagram post
python perfume-oasis-gpt-image-1.py

# Full campaign
python perfume-oasis-gpt-image-advanced.py

# Logo integration
python flux-kontext-logo-application.py

# General images
python perfume-oasis-imagen4-campaign.py
```

## Best Practices

### 1. Start Simple
- Use Imagen 4 for exploration
- Move to GPT-Image-1 for finals
- Add branding with FLUX Kontext

### 2. Batch Processing
- Generate multiple options
- Use Redux for variations
- Select best for video

### 3. Brand Consistency
- Always use FLUX Kontext for logos
- Maintain color schemes
- Follow brand guidelines

### 4. Quality Control
- Review at each stage
- Test on target platforms
- Get feedback before video creation

## Project Portability

### For New Projects:
1. Copy entire `/assets/` structure
2. Update brand colors in scripts
3. Replace logo files
4. Adjust prompts for new brand

### Shared Assets:
- Keep `/general-images/` separate
- Brand-specific in dedicated folders
- Use clear naming conventions

## Summary

This comprehensive system leverages:
- **Imagen 4** for general imagery
- **GPT-Image-1** for premium content
- **FLUX Kontext** for brand integration
- **FLUX Redux** for variations
- **Hailuo AI** for video content

Together, they provide a complete solution for all visual content needs, from basic product shots to full multi-platform campaigns.
