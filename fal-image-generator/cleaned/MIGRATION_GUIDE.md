# Migration & Cleanup Guide

## Overview
The cleaned system consolidates ~50+ scattered files into a focused architecture with just 8 core files.

## What's Been Simplified

### Before (Scattered Approach):
- **30+ Python scripts** with overlapping functionality
- Multiple configuration methods
- Campaign-specific scripts mixed with tools
- Unclear model selection
- Redundant implementations

### After (Cleaned Architecture):
- **Single CLI tool** (`visual-ai`) for all operations
- **3 models for images**: ImageN4, GPT-Image, Flux Context
- **2 models for videos**: Hailuo, Seedance
- Clear use-case driven selection

## Migration Steps

### 1. Copy Your Assets
```bash
# Copy any logos or brand assets
cp /path/to/old/logos/* cleaned/assets/logos/
```

### 2. Update Your Workflows

#### Old Way:
```bash
python perfume-oasis-imagen4-campaign.py
python perfume-oasis-gpt-image-1.py
python flux-kontext-logo-application.py
```

#### New Way:
```bash
# All through single command
./visual-ai image "prompt" --model imagen4
./visual-ai image "prompt" --model gpt-image --style post
./visual-ai image "prompt" --model flux-context
```

### 3. Files to Keep (Reference Only)
- `PERFUME_OASIS_INSTAGRAM_GPT_GUIDE.md` - Campaign strategies
- `assets/` - Brand assets
- `projects/perfume-oasis/` - Project-specific content

### 4. Files to Archive/Delete
These can be safely removed after migration:

#### Redundant Generators:
- `perfume-oasis-gpt-image-*.py` (5 files)
- `perfume-oasis-imagen4-*.py` (1 file)
- `perfume-oasis-instagram-*.py` (3 files)
- `perfume-oasis-social-posts.py`
- `ogilvy-instagram-campaign.py`
- `multi-model-context-generator.py`
- `kontext-gpt-generator.py`
- `gpt-like-context-generator.py`

#### Test Files:
- `test_*.py` (4 files)
- `test-*.py` (4 files)
- `test-*.sh` (1 file)

#### Old Scripts:
- `generate-*.py` (3 files)
- `flux-kontext-*.py` (1 file)
- `setup-*.sh` (3 files)
- `run-*.sh` (1 file)

## Quick Reference

### Model Selection Guide

| Task | Old Script | New Command |
|------|------------|-------------|
| Product photos | `perfume-oasis-imagen4-campaign.py` | `./visual-ai image "..." --model imagen4` |
| Social posts | `perfume-oasis-gpt-image-campaign.py` | `./visual-ai image "..." --model gpt-image --style post` |
| Logos | `flux-kontext-logo-application.py` | `./visual-ai image "..." --model gpt-image --style logo` |
| Videos | `fal-gen-video` | `./visual-ai video "..." --model hailuo` |

## Benefits of Cleaned System

1. **Single Entry Point**: One command for everything
2. **Clear Model Purpose**: Each model has specific use cases
3. **Consistent Output**: All files saved in organized structure
4. **Easy to Extend**: Add new models by updating config
5. **Portable**: Can be moved/installed anywhere

## Next Steps

1. Run `./setup.sh` in the cleaned directory
2. Test with a simple command: `./visual-ai image "test" --model imagen4`
3. Gradually migrate your workflows
4. Archive old files once confirmed working
