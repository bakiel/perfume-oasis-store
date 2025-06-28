# Perfume Oasis Development Guide

## Project Overview
Perfume Oasis is a luxury perfume e-commerce platform built with:
- **Frontend**: Next.js with TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI Integration**: OpenRouter (Qwen/Gemini Flash 2.5)
- **Deployment**: Vercel

## MCP Server Architecture

### 1. Alexander-Zuev MCP
Primary Supabase interface handling:
- Database operations (queries, migrations)
- Auth management
- Storage operations
- API requests
- Safety controls

### 2. PostgreSQL MCP
Direct database access for:
- Complex queries
- Performance tuning
- Bulk operations

### 3. Filesystem MCP
Local file management:
- Image processing
- File uploads
- Cache management

### 4. Supabase Official MCP
Standard Supabase operations

## Development Workflow

### Initial Setup
1. Clone the automation hub
2. Run `npm install` in each MCP server directory
3. Configure environment variables
4. Run database migrations
5. Deploy to Vercel

### Database Operations
```bash
# Enable unsafe mode for writes
alexander-zuev:live_dangerously service:"database" enable_unsafe_mode:true

# Run migration
alexander-zuev:execute_postgresql query:"[SQL HERE]" migration_name:"descriptive_name"

# Check tables
alexander-zuev:get_tables schema_name:"public"
```

### Common Tasks

#### Adding a New Product
1. Upload images to Supabase Storage
2. Create product record
3. Add product images
4. Set product attributes (fragrance notes)
5. Assign to categories

#### Setting Up Authentication
1. Configure Supabase Auth settings
2. Enable email/password authentication
3. Set up OAuth providers if needed
4. Configure email templates

#### Implementing Search
1. Create full-text search indexes
2. Implement search API endpoints
3. Add frontend search UI

## API Structure

### Products API
- `GET /api/products` - List products with filters
- `GET /api/products/[slug]` - Get single product
- `GET /api/products/search` - Search products

### Cart API
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update quantity
- `DELETE /api/cart/remove` - Remove item
- `GET /api/cart` - Get cart contents

### Orders API
- `POST /api/orders/create` - Create order
- `GET /api/orders/[id]` - Get order details
- `GET /api/orders` - List user orders

## Frontend Components

### Key Pages
- `/` - Homepage with featured products
- `/products` - Product listing with filters
- `/products/[slug]` - Product detail page
- `/cart` - Shopping cart
- `/checkout` - Checkout flow
- `/account` - User account area

### Shared Components
- `ProductCard` - Product display card
- `CartDrawer` - Shopping cart sidebar
- `SearchBar` - Product search
- `FilterPanel` - Category/brand filters

## OpenRouter AI Integration

### Product Recommendations
Use Qwen model for:
- Personalized recommendations
- Fragrance matching
- Customer preferences

### Content Generation
- Product descriptions
- SEO metadata
- Email campaigns

## Deployment

### Vercel Setup
1. Connect GitHub repository
2. Configure environment variables
3. Set up custom domain
4. Enable preview deployments

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENROUTER_API_KEY=
```

## Security Best Practices
1. Use RLS policies for data access
2. Validate all user inputs
3. Sanitize HTML content
4. Implement rate limiting
5. Regular security audits

## Performance Optimization
1. Image optimization with Next.js Image
2. Database query optimization
3. Implement caching strategies
4. Lazy loading for products
5. CDN for static assets

## Monitoring & Analytics
1. Set up Vercel Analytics
2. Configure error tracking
3. Monitor API performance
4. Track conversion rates

## Support & Maintenance
- Regular database backups
- Monitor storage usage
- Update dependencies
- Review security logs
- Customer support integration
