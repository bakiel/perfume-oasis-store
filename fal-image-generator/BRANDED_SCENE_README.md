# Perfume Oasis Branded Scene Creator

## Overview
This tool creates professional branded videos of your Perfume Oasis products in beautiful settings, with your logo applied using AI technology.

## Workflow Process

### 1. **Scene Generation** (ImageN4)
   - Creates a high-quality perfume bottle in a forest setting
   - Professional product photography style
   - 1920x1080 resolution

### 2. **Logo Application** (Flux Context)
   - Takes your logo from `assets/perfume-oasis-logo.png`
   - Intelligently applies it to the perfume bottle
   - Maintains natural appearance as if printed/etched on glass

### 3. **Video Creation** (Hailuo AI)
   - Converts the branded image to video
   - Adds cinematic camera movement
   - 6-second duration with zoom effect
   - Showcases the logo clearly

## Installation

1. Ensure you're in the project directory:
   ```bash
   cd /Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/fal-image-generator
   ```

2. Activate the virtual environment:
   ```bash
   source venv/bin/activate
   ```

3. Your logo should be at:
   ```
   assets/perfume-oasis-logo.png
   ```

## Usage

### Quick Start - Create Branded Scene
```bash
python create_branded_scene.py
```

This will:
- Generate a forest scene with perfume bottle
- Apply your logo to the bottle
- Create a 6-second video with camera zoom

### Advanced - Forest Scene with Options
```bash
python create_forest_perfume_scene.py
```

This provides more control and alternative scene options.

## Output

All files are saved to:
```
~/Pictures/perfume-oasis-ai/branded-scenes/
```

You'll get:
1. `base_scene_[timestamp].jpg` - Original forest scene
2. `branded_scene_[timestamp].jpg` - Scene with your logo applied
3. `branded_video_[timestamp].mp4` - Final video with camera movement

## Scene Variations

The scripts can create different moods:
- **Morning Mist** - Ethereal, soft lighting
- **Waterfall Background** - Dynamic, fresh
- **Enchanted Glade** - Magical, fairy-tale style
- **Autumn Forest** - Warm, cozy atmosphere

## Cost Breakdown

- Image Generation (ImageN4): ~$0.02
- Logo Application (Flux Context): ~$0.02
- Video Creation (Hailuo AI): $0.27 (6 seconds @ $0.045/sec)
- **Total: ~$0.31 per branded video**

## Tips for Best Results

1. **Logo Format**: Use a high-quality PNG with transparent background
2. **Brand Colors**: The scripts automatically enhance with your emerald green and gold palette
3. **Video Length**: 6 seconds is optimal for social media
4. **Multiple Versions**: Create variations for different campaigns

## Troubleshooting

### "Logo not found"
- Ensure `perfume-oasis-logo.png` is in the `assets` folder
- Check file permissions

### "API Error"
- Verify your API key in `config.json`
- Check internet connection
- Ensure you have credits in your FAL account

### "Import Error"
- Make sure virtual environment is activated
- Run: `pip install -r requirements.txt`

## Example Use Cases

1. **Product Launch Video**
   - Forest scene emphasizes natural ingredients
   - Logo prominently displayed
   - Perfect for Instagram/TikTok

2. **Website Hero Video**
   - Professional quality
   - Seamless loop potential
   - Brand recognition

3. **Email Campaign**
   - Eye-catching preview
   - Short loading time
   - Clear branding

## Next Steps

1. Run the script to create your first branded video
2. Review the output in the Pictures folder
3. Try different scene variations
4. Use in your marketing campaigns

## Support

For issues or questions:
- Check the error messages for specific guidance
- Review the troubleshooting section
- Ensure all dependencies are installed

---

**Remember**: Your Perfume Oasis logo will be elegantly applied to every scene, creating professional branded content automatically!
