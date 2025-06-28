# Migration Guide: From Multiple Scripts to Unified System

## Old vs New Command Mapping

### Image Generation

#### Old Way:
```bash
# Multiple different scripts for similar tasks
./venv/bin/python perfume-oasis-imagen4-campaign.py
./venv/bin/python perfume-oasis-gpt-image-1.py
./venv/bin/python flux-kontext-logo-application.py
./venv/bin/python fal-gen "prompt" flux-pro
```

#### New Way:
```bash
# One command with clear model selection
python visual_ai_studio_unified.py image "prompt" --model imagen4
python visual_ai_studio_unified.py image "prompt" --model gpt-image
python visual_ai_studio_unified.py image "prompt" --model flux-context
```

### Social Media Posts

#### Old Way:
```bash
./venv/bin/python perfume-oasis-instagram-gpt-style.py
./venv/bin/python perfume-oasis-social-posts.py
./venv/bin/python ogilvy-instagram-campaign.py
```

#### New Way:
```bash
python visual_ai_studio_unified.py post "background" --text "Your Text Here"
```

### Video Generation

#### Old Way:
```bash
./venv/bin/python fal-gen-video "prompt" hailuo 6
```

#### New Way:
```bash
python visual_ai_studio_unified.py video "prompt" --duration 6
python visual_ai_studio_unified.py video "prompt" --duration 6 --with-logo
```

## Feature Mapping

| Old Feature | New Implementation |
|-------------|-------------------|
| Multiple campaign scripts | Single `workflows/campaigns.py` module |
| Separate logo integration | Built-in `--with-logo` flag |
| Different config files | Unified `config.json` |
| Shell script wrappers | Direct Python commands |
| Test scripts everywhere | Organized examples in `assets/examples/` |

## Data Migration

1. **Images**: Move from `~/Pictures/fal-ai-generated/` to `~/Pictures/perfume-oasis-ai/images/`
2. **Videos**: Move from `~/Pictures/fal-ai-generated/videos/` to `~/Pictures/perfume-oasis-ai/videos/`
3. **Logos**: Copy to `assets/logos/`
4. **Config**: Merge all configs into single `config.json`

## Cleanup Steps

1. **Run the cleanup script**:
   ```bash
   chmod +x cleanup.sh
   ./cleanup.sh
   ```

2. **Archive old files** (already done by cleanup script)

3. **Test new system**:
   ```bash
   python visual_ai_studio_unified.py recommend
   python visual_ai_studio_unified.py image "test prompt"
   ```

4. **Gradually migrate workflows**:
   - Start with simple image generation
   - Move to social media posts
   - Finally migrate video workflows

## Benefits After Migration

1. **Simpler Commands**: No need to remember multiple script names
2. **Consistent Output**: All files organized in one place
3. **Better Model Selection**: Clear when to use which model
4. **Maintainable Code**: Less duplication, easier updates
5. **Brand Consistency**: Automatic brand color integration

## Keeping Old Scripts

All old scripts are archived in `archive/old_scripts/` for reference. You can:
- Check old implementations
- Copy specific functions if needed
- Compare outputs

## Need Help?

If you need to:
- Find an old feature: Check `archive/old_scripts/`
- Understand model selection: Run `python visual_ai_studio_unified.py recommend`
- See all options: Run `python visual_ai_studio_unified.py --help`
