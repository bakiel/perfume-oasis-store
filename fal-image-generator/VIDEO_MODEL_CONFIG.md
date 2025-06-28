# Perfume Oasis Video Generation Configuration

## Primary Video Model: Hailuo AI ✅

### Why Hailuo AI?
As you correctly identified, Hailuo AI is a **no-brainer choice** for video generation:
- **Best quality/cost ratio**: $0.045/second
- **Supports both text-to-video and image-to-video**
- **Professional quality output**
- **Perfect for brand content**

### Video Model Configuration

```python
"hailuo": {
    "api": "fal-ai/minimax-video",
    "cost": "$0.045/second",
    "durations": [6, 10],  # Only accepts 6 or 10 seconds
    "supports_image": True
}
```

### Alternative (Budget Option)

```python
"seedance": {
    "api": "fal-ai/cogvideox-5b/video",  
    "cost": "$0.03/second",
    "max_duration": 6
}
```

## Usage Examples

### Basic Brand Video (6 seconds)
```bash
python visual_ai_studio_v2.py video "luxury perfume bottle on emerald silk" --duration 6
```
Cost: $0.27

### Premium Brand Video (10 seconds)
```bash
python visual_ai_studio_v2.py video "cinematic perfume commercial with golden particles" --duration 10
```
Cost: $0.45

### Video with Logo Integration
```bash
python visual_ai_studio_v2.py video "perfume bottle showcase" --duration 6 --with-logo
```
This will:
1. Generate branded product image with ImageN4
2. Create video from that image using Hailuo AI

### Budget Alternative (when needed)
```bash
python visual_ai_studio_v2.py video "simple product rotation" --duration 6 --budget
```
Uses Seedance instead (Cost: $0.18)

## Brand Elements for Videos

Always include these in prompts:
- **Colors**: "emerald green (#0E5C4A)", "gold (#C8A95B)"
- **Keywords**: "luxury", "elegant", "premium"
- **Lighting**: "studio lighting", "cinematic"

## Cost Comparison

| Model | 6-second video | 10-second video |
|-------|---------------|-----------------|
| Hailuo AI | $0.27 | $0.45 |
| Seedance | $0.18 | Not supported |
| Luma* | $0.40 | Not supported |

*Luma is premium but only 5 seconds

## Recommendation

**Use Hailuo AI for all brand videos** unless:
- Extremely tight budget → Use Seedance
- Need specific premium features → Consider Luma

Hailuo AI provides the perfect balance of quality, features, and cost for Perfume Oasis brand content.
