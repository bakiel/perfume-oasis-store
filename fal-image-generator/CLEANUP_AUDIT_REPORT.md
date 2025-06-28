# Perfume Oasis Visual AI Studio - Cleanup Audit Report

## Current State Analysis

### 🔍 Issues Identified

1. **Too Many Duplicate Scripts**: Multiple Python files doing similar things:
   - Multiple perfume-oasis-*.py files with overlapping functionality
   - Various test scripts that could be consolidated
   - Separate scripts for each model instead of a unified interface

2. **Unclear Purpose Separation**: 
   - GPT Image vs Flux Context overlap
   - Multiple "campaign" scripts doing similar things
   - No clear workflow for when to use which model

3. **Scattered Documentation**: 
   - Multiple markdown guides that could be consolidated
   - Redundant information across different files

4. **Inefficient Structure**:
   - Shell scripts that could be Python functions
   - Duplicate configuration across files

## Proposed Clean Architecture

### Core System Structure
```
perfume-oasis-visual-ai/
├── config.json                 # Unified configuration
├── README.md                   # Single comprehensive guide
├── requirements.txt            # Python dependencies
├── setup.py                    # Installation script
│
├── core/                       # Core functionality
│   ├── __init__.py
│   ├── image_generator.py      # All image generation logic
│   ├── video_generator.py      # All video generation logic
│   ├── brand_manager.py        # Brand assets & consistency
│   └── utils.py               # Shared utilities
│
├── workflows/                  # Pre-configured workflows
│   ├── __init__.py
│   ├── general_images.py       # ImageN4 for general content
│   ├── text_posts.py           # GPT Image for text-heavy content
│   ├── logo_videos.py          # Video with logo integration
│   └── campaigns.py            # Campaign generation workflows
│
├── cli.py                      # Unified command-line interface
├── web_ui.py                   # Optional web interface
│
├── assets/                     # Brand assets
│   ├── logos/
│   ├── templates/
│   └── examples/
│
└── output/                     # Generated content
    ├── images/
    └── videos/
```

## Model Usage Strategy

### 1. ImageN4 (Primary General Image Generator)
- **Use for**: Product shots, lifestyle images, general marketing visuals
- **Strengths**: High quality, consistent style, good understanding of prompts
- **API**: `fal-ai/imagen4/preview/fast`

### 2. GPT Image Generator (Text & Logo Applications)
- **Use for**: 
  - Social media posts with text overlays
  - Promotional content with embedded text
  - Logo integration for videos
- **Strengths**: Excellent text rendering, understanding of layouts
- **APIs**: 
  - `fal-ai/gpt-image-1/text-to-image/byok` (text generation)
  - `fal-ai/gpt-image-1/edit-image/byok` (logo integration)

### 3. Flux Context (Alternative to GPT Image)
- **Use for**: Context-aware edits when GPT Image isn't suitable
- **Strengths**: Good at maintaining context, style transfers
- **APIs**: 
  - `fal-ai/flux-pro/kontext`
  - `fal-ai/flux-kontext/max` (premium with better typography)

### 4. Video Models
- **Hailuo AI**: Primary video generation (6-10 seconds)
- **Seedance/CogVideoX**: Budget-friendly alternative

## Cleanup Actions

### Phase 1: Consolidate Core Functionality
1. Merge all image generation scripts into `core/image_generator.py`
2. Merge all video generation scripts into `core/video_generator.py`
3. Create unified brand management in `core/brand_manager.py`

### Phase 2: Create Clear Workflows
1. Build workflow modules for specific use cases
2. Each workflow should have clear parameters and outputs
3. Include examples and best practices

### Phase 3: Simplify Interface
1. Single CLI tool with subcommands:
   ```bash
   visual-ai generate image --model imagen4 "luxury perfume bottle"
   visual-ai generate post --text "New Collection" --background "elegant perfume"
   visual-ai generate video --with-logo "product showcase"
   visual-ai campaign instagram --theme "summer collection"
   ```

### Phase 4: Clean Up Files
1. Archive old scripts to `archive/` directory
2. Consolidate documentation into single README
3. Remove duplicate configuration files

## Implementation Plan

### Step 1: Create New Structure
```bash
# Create new directories
mkdir -p core workflows assets/logos assets/templates assets/examples output/images output/videos
```

### Step 2: Consolidate Core Files
- Merge functionality from multiple scripts
- Create clean APIs for each component
- Ensure proper error handling

### Step 3: Build Unified CLI
- Simple, intuitive commands
- Clear help documentation
- Progress indicators for long operations

### Step 4: Test & Validate
- Ensure all models work correctly
- Test brand consistency features
- Validate output quality

## Benefits of Cleanup

1. **Simplified Usage**: One tool, clear commands
2. **Better Organization**: Know exactly where everything is
3. **Easier Maintenance**: Less code duplication
4. **Clear Model Selection**: Obvious when to use which model
5. **Consistent Brand Output**: Automated brand compliance

## Next Steps

1. Review this audit report
2. Approve the proposed structure
3. Begin implementation phase by phase
4. Test each component thoroughly
5. Archive old code for reference
