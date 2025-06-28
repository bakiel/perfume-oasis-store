#!/usr/bin/env python3
"""
Example usage of the Visual AI Generator
"""
import subprocess
import os

def run_example(command):
    """Run command and print output"""
    print(f"\n🎯 Running: {command}")
    print("-" * 50)
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    if result.returncode == 0:
        print("✅ Success!")
        if result.stdout:
            print(result.stdout)
    else:
        print("❌ Error:")
        print(result.stderr)

# Examples
examples = [
    # ImageN4 - High quality product photo
    "./visual-ai image 'luxury perfume bottle on marble surface with soft lighting' --model imagen4",
    
    # GPT-Image - Social media post
    "./visual-ai image 'SALE: 30% OFF all fragrances this weekend only' --model gpt-image --style post",
    
    # GPT-Image - Logo
    "./visual-ai image 'Perfume Oasis minimalist logo' --model gpt-image --style logo",
    
    # Flux Context - Artistic with context
    "./visual-ai image 'elegant perfume advertisement' --model flux-context --context 'luxury brand targeting millennials'",
    
    # Video - Hailuo
    "./visual-ai video 'perfume bottle rotating slowly with golden particles' --model hailuo --duration 6",
]

print("🎨 Visual AI Generator Examples")
print("================================")

# Note about API key
if not os.environ.get('OPENAI_API_KEY'):
    print("\n⚠️  Note: Set OPENAI_API_KEY for GPT-Image examples:")
    print("   export OPENAI_API_KEY='your-key-here'")

# Run examples
for example in examples:
    input(f"\nPress Enter to run next example...")
    run_example(example)

print("\n✨ All examples complete!")
