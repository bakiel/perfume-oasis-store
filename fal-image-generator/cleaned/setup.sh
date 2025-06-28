#!/bin/bash
# Setup script for Visual AI Generator

echo "🚀 Setting up Visual AI Generator..."

# Check if we're in the right directory
if [ ! -f "config.json" ]; then
    echo "❌ Error: Please run this script from the cleaned directory"
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install --upgrade pip
pip install fal-client requests Pillow

# Create directories
echo "📁 Creating directories..."
mkdir -p assets/logos
mkdir -p output/images
mkdir -p output/videos

echo "✅ Setup complete!"
echo ""
echo "To use Visual AI Generator:"
echo "1. Set your OpenAI API key (for GPT-Image):"
echo "   export OPENAI_API_KEY='your-key-here'"
echo ""
echo "2. Run commands:"
echo "   ./visual-ai image 'your prompt' --model imagen4"
echo "   ./visual-ai video 'your prompt' --model hailuo"
