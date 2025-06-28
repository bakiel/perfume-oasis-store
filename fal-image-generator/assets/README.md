# Assets Directory - Comprehensive Media System

## Overview
This directory contains a complete media generation system using multiple AI models for different content needs. The system is designed to be modular and portable across projects.

## Directory Structure

```
assets/
├── general-images/          # Imagen 4 - Non-branded, reusable
├── gpt-image-content/       # GPT-Image-1 - Premium social media
├── branded-content/         # FLUX Kontext - Brand integration
├── variations/              # FLUX Redux - A/B testing
├── videos/                  # Hailuo AI - Dynamic content
├── COMPREHENSIVE_MEDIA_SYSTEM.md
├── WORKFLOW_GUIDE.md
└── README.md (this file)
```

## Quick Start

### 1. Generate Your First Image

**For Instagram:**
```bash
cd /Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/fal-image-generator
python perfume-oasis-gpt-image-1.py
```

**For General Use:**
```bash
python perfume-oasis-imagen4-campaign.py
```

### 2. Add Branding
```bash
python flux-kontext-logo-application.py
```

### 3. Create Video
```bash
python perfume-oasis-gpt-image-advanced.py --with-video
```

## Model Selection Guide

| Need | Model | Location | Script |
|------|-------|----------|--------|
| Product backgrounds | Imagen 4 | `/general-images/` | `imagen4-campaign.py` |
| Instagram posts | GPT-Image-1 | `/gpt-image-content/` | `gpt-image-1.py` |
| Logo integration | FLUX Kontext | `/branded-content/` | `kontext-logo.py` |
| Variations | FLUX Redux | `/variations/` | `multi-model.py` |
| Videos | Hailuo AI | `/videos/` | `gpt-advanced.py` |

## Cost Overview

- **Basic Image**: ~$0.03 (Imagen 4)
- **Instagram Post**: ~$0.08 (GPT-Image-1)
- **Branded Image**: ~$0.12 (GPT + Kontext)
- **With Video**: ~$0.39 (Full pipeline)
- **Full Campaign**: ~$2.34 (6 posts + videos)

## Key Features

### 1. **Modular System**
- Use only what you need
- Mix and match models
- Scale up or down

### 2. **Project Portability**
- General images work anywhere
- Easy to copy structure
- Clear organization

### 3. **Brand Consistency**
- Centralized prompts
- Color management
- Style guidelines

### 4. **Platform Optimization**
- Instagram formats
- Web specifications
- Video requirements

## Workflow Examples

### Simple Product Shot
```
Imagen 4 → Save to /general-images/
```

### Instagram Campaign
```
GPT-Image-1 → FLUX Kontext → Save to /gpt-image-content/
```

### Full Marketing Asset
```
GPT-Image-1 → Edit → Kontext → Hailuo → All formats
```

## File Naming Convention

```
[category]-[subject]-[style]-[number].[ext]

Examples:
- luxury-perfume-hero-001.jpg
- instagram-story-elegant-002.jpg
- product-emerald-minimal-003.jpg
- brand-campaign-summer-004.jpg
```

## Integration Points

### With Next.js
- Images in `public/images/`
- Import from assets as needed
- Optimize with Next Image

### With Social Media
- Direct upload ready
- Proper dimensions
- Optimized quality

### With Email
- Compressed versions
- HTML-friendly names
- CDN-ready structure

## Maintenance

### Weekly
- Archive completed campaigns
- Clear test images
- Update prompt docs

### Monthly
- Review model performance
- Optimize folder structure
- Backup important assets

## Support Files

### Prompt Guides
- `IMAGEN4_PROMPTS.md` - General image prompts
- `GPT_IMAGE_1_PROMPTS.md` - Social media prompts
- `FLUX_KONTEXT_PROMPTS.md` - Branding prompts
- `HAILUO_VIDEO_PROMPTS.md` - Video creation

### Documentation
- `COMPREHENSIVE_MEDIA_SYSTEM.md` - Full system overview
- `WORKFLOW_GUIDE.md` - Step-by-step workflows
- `QUICK_INTEGRATION.md` - Fast implementation

## Tips for Success

1. **Start with Imagen 4** for concept testing
2. **Move to GPT-Image-1** for final quality
3. **Use FLUX Kontext** for all branding
4. **Create videos** only for hero content
5. **Organize immediately** after generation

## Common Commands

```bash
# Check what's in each folder
ls -la general-images/
ls -la gpt-image-content/instagram/

# Move generated content
mv ~/Pictures/fal-ai-generated/* ./gpt-image-content/campaigns/

# Archive old campaigns
mkdir -p archive/2024/
mv campaigns/old-campaign/ archive/2024/

# Find specific images
find . -name "*emerald*" -type f

# Count images by type
find . -name "*.jpg" | wc -l
```

## Next Steps

1. Read `COMPREHENSIVE_MEDIA_SYSTEM.md` for full details
2. Follow `WORKFLOW_GUIDE.md` for specific tasks
3. Check model-specific prompt guides
4. Start generating content!

---

**Remember**: This system is designed to grow with your needs. Start simple, expand as required.
