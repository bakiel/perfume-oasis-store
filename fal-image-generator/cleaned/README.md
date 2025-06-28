# Visual AI Generator - Cleaned Architecture

A streamlined image and video generation system using fal.ai APIs.

## Core Components

### 1. Image Generation (`image_generator.py`)
- **ImageN4**: High-quality general images
- **GPT-Image**: Text-heavy posts, logos, branded content
- **Flux Context**: Alternative context-aware generation

### 2. Video Generation (`video_generator.py`)
- **Hailuo AI**: Best quality (6 or 10 seconds)
- **Seedance**: Cost-effective option (up to 6 seconds)

### 3. Unified CLI (`visual-ai`)
Single command for all generation tasks

## Quick Start

```bash
# Generate high-quality image with ImageN4
./visual-ai image "luxury perfume bottle" --model imagen4

# Generate text-heavy post with GPT-Image
./visual-ai image "Sale: 30% OFF" --model gpt-image --style post

# Generate logo with GPT-Image
./visual-ai image "Perfume Oasis logo" --model gpt-image --style logo

# Generate video with logo overlay
./visual-ai video "perfume commercial" --model hailuo --logo assets/logo.png

# Use Flux Context as GPT alternative
./visual-ai image "elegant perfume ad" --model flux-context --context "luxury brand"
```

## Model Selection Guide

| Use Case | Recommended Model | Why |
|----------|-------------------|-----|
| Product photos | ImageN4 | Best quality, photorealistic |
| Social posts | GPT-Image | Excellent text rendering |
| Logos | GPT-Image | Clean vector-like output |
| Artistic | Flux Context | Creative interpretations |
| Videos | Hailuo | Best motion quality |

## Directory Structure

```
cleaned/
├── README.md              # This file
├── config.json           # Unified configuration
├── visual-ai             # Main CLI tool
├── core/                 # Core modules
│   ├── __init__.py
│   ├── image_generator.py
│   ├── video_generator.py
│   └── utils.py
├── assets/               # Brand assets
│   └── logos/
└── output/              # Generated content
    ├── images/
    └── videos/
```
