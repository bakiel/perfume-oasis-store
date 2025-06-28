#!/bin/bash

# Copy Design Assets to Next.js Public Folder
echo "🎨 Copying Perfume Oasis design assets to Next.js project..."

# Source directories
HORIZONTAL_DIR="/Users/mac/Downloads/Perfume images/horizontal-designs"
SQUARE_DIR="/Users/mac/Downloads/Perfume images/square-designs"
VERTICAL_DIR="/Users/mac/Downloads/Perfume images/vertical-designs"

# Destination directory
PUBLIC_DIR="/Users/mac/Downloads/PERFUME-OASIS-AUTOMATION-HUB/perfume-oasis/public/images"

# Create directory structure
mkdir -p "$PUBLIC_DIR/banners"
mkdir -p "$PUBLIC_DIR/logos"
mkdir -p "$PUBLIC_DIR/square-designs/logos"
mkdir -p "$PUBLIC_DIR/square-designs/social-media"
mkdir -p "$PUBLIC_DIR/vertical-designs/stories"
mkdir -p "$PUBLIC_DIR/vertical-designs/banners"

# Copy horizontal designs
echo "📋 Copying horizontal designs..."
cp -r "$HORIZONTAL_DIR/banners/"* "$PUBLIC_DIR/banners/" 2>/dev/null
cp -r "$HORIZONTAL_DIR/logos/"* "$PUBLIC_DIR/logos/" 2>/dev/null

# Copy square designs
echo "⬜ Copying square designs..."
cp -r "$SQUARE_DIR/logos/"* "$PUBLIC_DIR/square-designs/logos/" 2>/dev/null
cp -r "$SQUARE_DIR/social-media/"* "$PUBLIC_DIR/square-designs/social-media/" 2>/dev/null

# Copy vertical designs
echo "📱 Copying vertical designs..."
cp -r "$VERTICAL_DIR/stories/"* "$PUBLIC_DIR/vertical-designs/stories/" 2>/dev/null
cp -r "$VERTICAL_DIR/banners/"* "$PUBLIC_DIR/vertical-designs/banners/" 2>/dev/null

echo ""
echo "✅ Design assets copied successfully!"
echo ""
echo "📁 Assets are now available at:"
echo "   $PUBLIC_DIR"
echo ""
echo "🚀 You can now use these in your components with paths like:"
echo "   /images/banners/PO-horizontal-banner-hero-emerald-gold.jpg"
echo "   /images/logos/PO-horizontal-logo-gold-on-green.jpg"
echo "   /images/square-designs/logos/PO-square-logo-main.jpg"
echo "   /images/vertical-designs/stories/PO-vertical-story-main.jpg"
