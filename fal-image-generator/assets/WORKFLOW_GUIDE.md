# Media Generation Workflow Guide

## Quick Decision Tree

```
Need Branding? 
├─ NO → Use Imagen 4 (general images)
└─ YES → Premium Quality Needed?
         ├─ YES → Use GPT-Image-1 → FLUX Kontext → Hailuo (if video)
         └─ NO → Use FLUX Kontext directly
```

## Common Workflows

### 1. Instagram Post Creation

**Single Image Post**
```bash
# Step 1: Generate base image
cd /Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/fal-image-generator
python perfume-oasis-gpt-image-1.py

# Output: /assets/gpt-image-content/instagram/
```

**Carousel Post (Multiple Images)**
```bash
# Generate themed set
python perfume-oasis-gpt-image-campaign.py
# Creates 6 coordinated images
```

### 2. Product Photography

**Without Branding**
```bash
# Use Imagen 4 for clean product shots
python perfume-oasis-imagen4-campaign.py
# Output: /assets/general-images/luxury/
```

**With Brand Integration**
```bash
# Generate and brand in one workflow
python perfume-oasis-gpt-image-advanced.py
# Combines GPT-Image-1 + FLUX Kontext
```

### 3. Video Content Creation

**Instagram Reel**
```bash
# Full pipeline with video
python perfume-oasis-gpt-image-advanced.py --with-video
# Creates image + 6-second video
```

**Story Content**
```bash
# Vertical format optimization
python universal-vai.py --format "story" --video
```

### 4. Campaign Creation

**Full 6-Post Campaign**
```bash
# Ogilvy-style campaign
python ogilvy-instagram-campaign.py
# Generates complete campaign with metadata
```

## File Organization

### After Generation

1. **Review Output**
   ```
   ~/Pictures/fal-ai-generated/[model]-campaign/
   ```

2. **Move to Project**
   ```bash
   # Example: Move GPT-Image-1 content
   mv ~/Pictures/fal-ai-generated/gpt-image-1-campaign/* \
      /Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/assets/gpt-image-content/campaigns/
   ```

3. **Organize by Purpose**
   - Instagram → `/instagram/`
   - Website → `/hero-images/`
   - Ads → `/social-media/`

## Batch Processing

### Multiple Variations
```python
# In script, modify:
variations = ["emerald", "gold", "pearl"]
for variant in variations:
    # Generate with variant
```

### A/B Testing
```bash
# Generate variations
python multi-model-context-generator.py --variations 3
# Output: /assets/variations/a-b-tests/
```

## Platform-Specific Outputs

### Instagram Feed (Square)
- Size: 1080x1080
- Models: GPT-Image-1 preferred
- Location: `/instagram/`

### Instagram Stories (Vertical)
- Size: 1080x1920
- Leave space for UI elements
- Location: `/social-media/`

### Website Hero Images
- Size: 1920x1080 or larger
- High quality required
- Location: `/hero-images/`

### Email Marketing
- Size: 600px width
- Optimized file size
- Location: `/campaigns/`

## Cost-Effective Strategies

### Testing Phase
1. Start with Imagen 4 (cheapest)
2. Test concepts and compositions
3. Refine prompts
4. Generate finals with GPT-Image-1

### Production Phase
1. Batch similar requests
2. Use FLUX Kontext for variations
3. Create video only for hero content

### Budget Allocation
- Exploration: 20% (Imagen 4)
- Finals: 60% (GPT-Image-1)
- Videos: 20% (Hailuo)

## Quality Control Checklist

### Before Generation
- [ ] Clear prompt prepared
- [ ] Brand colors specified
- [ ] Output size determined
- [ ] Budget confirmed

### After Generation
- [ ] Resolution correct
- [ ] Brand colors accurate
- [ ] Composition balanced
- [ ] Text space available (if needed)

### Before Publishing
- [ ] File optimized
- [ ] Metadata added
- [ ] Backup created
- [ ] Rights cleared

## Troubleshooting

### Poor Quality Output
1. Enhance prompt specificity
2. Add quality modifiers
3. Try different model
4. Adjust parameters

### Wrong Colors
1. Use hex codes
2. Reference brand guide
3. Use FLUX Kontext for correction

### Composition Issues
1. Specify exact layout
2. Use rule of thirds
3. Define focal points
4. Add spacing instructions

## Integration with Next.js

### Image Optimization
```javascript
// In Next.js component
import Image from 'next/image'

<Image
  src="/assets/gpt-image-content/hero-images/hero-1.jpg"
  alt="Luxury perfume"
  width={1920}
  height={1080}
  priority
/>
```

### Dynamic Loading
```javascript
// Load from organized folders
const campaignImages = await loadImages('/campaigns/summer-2024/')
```

## Maintenance

### Regular Tasks
1. Archive old campaigns
2. Update prompt templates
3. Review model performance
4. Optimize storage

### Folder Cleanup
```bash
# Archive old content
mv /assets/campaigns/old-campaign /archive/2024/

# Clear test images
rm /assets/variations/test-*
```

## Quick Commands Reference

```bash
# Instagram post
python perfume-oasis-gpt-image-1.py

# Full campaign
python ogilvy-instagram-campaign.py

# Add branding
python flux-kontext-logo-application.py

# Create video
python perfume-oasis-gpt-image-advanced.py --with-video

# General images
python perfume-oasis-imagen4-campaign.py

# Test new concept
python universal-vai.py --test-mode
```

## Next Steps

1. **Start Simple**: Test with Imagen 4
2. **Build Library**: Create reusable assets
3. **Establish Style**: Develop consistent prompts
4. **Scale Up**: Move to advanced pipelines
5. **Automate**: Create batch scripts

Remember: The system is modular - use only what you need for each project!
