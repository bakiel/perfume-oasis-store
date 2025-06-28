# Perfume Oasis - Design Implementation Guide

## 🎨 Design Assets Application Strategy

### Available Design Assets
- **8 Horizontal Banners** - Emerald green with gold accents
- **1 Horizontal Logo** - Gold text on emerald background
- **2 Square Designs** - Perfect for product cards and social proof
- **2 Vertical Designs** - Mobile-first elements

### Implementation Areas

## 1. Homepage Hero Section
**Asset**: `PO-horizontal-banner-hero-emerald-gold.jpg`
```jsx
// components/HeroSection.jsx
<div className="relative h-[600px] w-full">
  <Image 
    src="/images/banners/PO-horizontal-banner-hero-emerald-gold.jpg"
    alt="Perfume Oasis Luxury Collection"
    fill
    className="object-cover"
    priority
  />
  <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/50 to-transparent">
    <div className="container mx-auto h-full flex items-center">
      <div className="max-w-2xl text-white">
        <h1 className="text-5xl font-bold mb-4">Discover Your Signature Scent</h1>
        <p className="text-xl mb-8">Luxury fragrances delivered across South Africa</p>
        <button className="bg-gold-500 text-emerald-900 px-8 py-4 rounded-lg font-semibold">
          Shop Collection
        </button>
      </div>
    </div>
  </div>
</div>
```

## 2. Navigation Header
**Asset**: `PO-horizontal-logo-gold-on-green.jpg` (extract logo portion)
```jsx
// components/Navigation.jsx
<nav className="bg-emerald-900 shadow-lg">
  <div className="container mx-auto px-4">
    <div className="flex justify-between items-center h-20">
      <div className="flex items-center">
        <Image 
          src="/images/logos/PO-horizontal-logo-gold-on-green.jpg"
          alt="Perfume Oasis"
          width={200}
          height={60}
          className="h-12 w-auto"
        />
      </div>
      {/* Navigation items */}
    </div>
  </div>
</nav>
```

## 3. Product Category Cards
**Asset**: `PO-square-logo-main.jpg` as overlay pattern
```jsx
// components/CategoryCard.jsx
<div className="relative overflow-hidden rounded-lg group">
  <div className="aspect-square bg-emerald-50">
    <Image 
      src={category.image}
      alt={category.name}
      fill
      className="object-cover group-hover:scale-110 transition-transform"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 to-transparent">
      <div className="absolute bottom-0 p-6">
        <h3 className="text-2xl font-bold text-gold-400">{category.name}</h3>
        <p className="text-white mt-2">{category.count} Products</p>
      </div>
    </div>
  </div>
</div>
```

## 4. Mobile App Splash Screen
**Asset**: `PO-vertical-story-main.jpg`
```jsx
// app/loading.jsx
<div className="fixed inset-0 z-50">
  <Image 
    src="/images/vertical/PO-vertical-story-main.jpg"
    alt="Loading"
    fill
    className="object-cover"
  />
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="animate-pulse">
      <div className="w-16 h-16 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
    </div>
  </div>
</div>
```

## 5. Promotional Banners
**Assets**: Various horizontal banners for different sections
```jsx
// components/PromoBanner.jsx
const banners = {
  luxury: 'PO-horizontal-banner-luxury-gradient.jpg',
  collection: 'PO-horizontal-banner-collection.jpg',
  homepage: 'PO-horizontal-banner-homepage-palm.jpg',
  promo: 'PO-horizontal-banner-promo-emerald.jpg'
};

<div className="relative h-[400px] rounded-xl overflow-hidden my-8">
  <Image 
    src={`/images/banners/${banners[type]}`}
    alt={title}
    fill
    className="object-cover"
  />
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="text-center text-white">
      <h2 className="text-4xl font-bold mb-4">{title}</h2>
      <Button variant="gold">{cta}</Button>
    </div>
  </div>
</div>
```

## 6. Instagram Feed Integration
**Asset**: `PO-square-instagram-profile.jpg`
```jsx
// components/InstagramFeed.jsx
<section className="py-16 bg-sand-50">
  <div className="container mx-auto">
    <h2 className="text-3xl font-bold text-emerald-900 text-center mb-8">
      Follow @PerfumeOasisZA
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {instagramPosts.map((post) => (
        <div className="aspect-square relative group cursor-pointer">
          <Image 
            src={post.image}
            alt={post.caption}
            fill
            className="object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-emerald-900/0 group-hover:bg-emerald-900/70 transition-colors rounded-lg flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center p-4">
              <Heart className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">{post.likes} likes</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

## 7. Email Template Headers
**Asset**: `PO-horizontal-banner-dark-green.jpg`
```html
<!-- Email Header -->
<table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td style="background-color: #0E5C4A;">
      <img src="https://perfumeoasis.co.za/images/banners/PO-horizontal-banner-dark-green.jpg" 
           alt="Perfume Oasis" 
           width="600" 
           style="display: block; max-width: 100%; height: auto;">
    </td>
  </tr>
</table>
```

## 8. Mobile Story Ads
**Asset**: `PO-vertical-banner-main.jpg`
```jsx
// components/StoryAd.jsx
<div className="fixed inset-0 bg-black z-50 md:hidden">
  <div className="relative h-full">
    <Image 
      src="/images/vertical/PO-vertical-banner-main.jpg"
      alt="Special Offer"
      fill
      className="object-cover"
    />
    <div className="absolute top-4 right-4">
      <button onClick={onClose} className="text-white p-2">
        <X className="w-6 h-6" />
      </button>
    </div>
    <div className="absolute bottom-20 left-0 right-0 px-6">
      <button className="w-full bg-gold-400 text-emerald-900 py-4 rounded-full font-bold">
        Shop Now - 20% Off
      </button>
    </div>
  </div>
</div>
```

## Color Variables for Tailwind Config
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        emerald: {
          50: '#f0fdf4',
          // ... other shades
          900: '#0E5C4A', // Primary brand color
        },
        gold: {
          400: '#C8A95B', // Accent color
          500: '#B39A4C',
          600: '#9E863D',
        },
        sand: {
          50: '#F6F3EF', // Background color
          100: '#EDE7DD',
        },
        charcoal: {
          900: '#2C2C2C', // Text color
        }
      }
    }
  }
}
```

## Implementation Priority
1. **Phase 1**: Update navigation with logo and homepage hero
2. **Phase 2**: Implement promotional banners throughout site
3. **Phase 3**: Add Instagram feed and social proof sections
4. **Phase 4**: Create mobile-specific features (stories, splash screens)
5. **Phase 5**: Update email templates and marketing materials

## Asset Optimization
- Convert JPGs to WebP for better performance
- Create multiple sizes for responsive images
- Use lazy loading for non-critical images
- Implement blur placeholders for better UX
