# House of Peptides - MVP E-Commerce Storefront

A production-quality MVP e-commerce storefront for a US-only peptide shop built with **Nuxt 3** and **Strapi v4**.

## Tech Stack

- **Frontend**: Nuxt 3 (Vue 3 Composition API), Tailwind CSS, Pinia
- **Backend**: Strapi v4 (Products, Variants, Orders)
- **Payments**: Stripe Checkout (guest checkout)
- **Database**: SQLite (development) / PostgreSQL (production)

## Features

- ✅ Product catalog with variants (e.g., 5mg, 10mg)
- ✅ Dark scientific aesthetic with gradient placeholders
- ✅ Compliance gate (21+ / qualified professional / research use)
- ✅ Cart with localStorage persistence
- ✅ Stripe Checkout integration (US-only shipping)
- ✅ Webhook for order creation in Strapi
- ✅ Server-side price validation
- ✅ Flat-rate shipping ($10)

## Project Structure

```
houseofpeptides/
├── frontend/           # Nuxt 3 application
│   ├── components/     # Vue components
│   ├── composables/    # Composable functions
│   ├── constants/      # App constants (shipping, currency)
│   ├── layouts/        # Page layouts
│   ├── pages/          # Route pages
│   ├── server/api/     # Server API routes (Stripe)
│   ├── stores/         # Pinia stores
│   └── types/          # TypeScript types
│
└── backend/            # Strapi v4 application
    ├── config/         # Strapi configuration
    ├── database/       # Seeds and migrations
    └── src/api/        # Content type definitions
        ├── product/
        ├── variant/
        ├── order/
        └── order-item/
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Stripe account (for payments)

### 1. Backend Setup (Strapi)

```bash
cd backend
npm install
npm run develop
```

On first run, Strapi will:
1. Create the admin panel at http://localhost:1337/admin
2. Prompt you to create an admin user
3. Generate the database

**Configure Permissions:**
1. Go to Settings → Users & Permissions → Roles → Public
2. Enable `find` and `findOne` for **Product** and **Variant**
3. Keep **Order** and **OrderItem** private (created via webhook only)

**Create API Token (for webhook):**
1. Go to Settings → API Tokens
2. Create a new token with full access to Orders and OrderItems
3. Copy the token for frontend `.env`

**Seed Sample Data:**
1. Go to Content Manager
2. Create products using the sample data in `database/seeds/seed-data.js`
3. Or use the Strapi API programmatically

### 2. Frontend Setup (Nuxt)

```bash
cd frontend
npm install
```

Create `.env` file:
```env
# Strapi
STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=your_strapi_api_token

# Stripe
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# App
APP_URL=http://localhost:3000
```

Run development server:
```bash
npm run dev
```

### 3. Stripe Setup

1. Get your test API keys from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Set up webhook endpoint:
   - For local development, use [Stripe CLI](https://stripe.com/docs/stripe-cli):
     ```bash
     stripe listen --forward-to localhost:3000/api/stripe/webhook
     ```
   - Copy the webhook signing secret to `.env`

3. For production, add webhook endpoint in Stripe Dashboard:
   - URL: `https://yourdomain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`

## Environment Variables

### Frontend (.env)

| Variable | Description |
|----------|-------------|
| `STRAPI_URL` | Strapi API URL (default: http://localhost:1337) |
| `STRAPI_TOKEN` | API token for server-side Strapi requests |
| `STRIPE_SECRET_KEY` | Stripe secret key (sk_test_... or sk_live_...) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `APP_URL` | Frontend URL for Stripe redirects |

### Backend (.env)

| Variable | Description |
|----------|-------------|
| `HOST` | Server host (default: 0.0.0.0) |
| `PORT` | Server port (default: 1337) |
| `APP_KEYS` | Comma-separated app keys |
| `API_TOKEN_SALT` | Salt for API tokens |
| `ADMIN_JWT_SECRET` | Admin JWT secret |
| `JWT_SECRET` | JWT secret |

## MVP Constants

Edit `frontend/constants/index.ts` to customize:

```typescript
export const SHIPPING = {
  FLAT_RATE_CENTS: 1000,  // $10.00
  LABEL: 'Standard Shipping (US Only)',
}

export const CURRENCY = {
  CODE: 'usd',
  SYMBOL: '$',
}
```

## Content Types

### Product
- `name` (string, required)
- `slug` (uid from name)
- `shortDescription` (text)
- `description` (richtext)
- `active` (boolean, default: true)
- `requiresConfirmation` (boolean, default: true)
- `badgeText` (string, default: "Research Use Only")
- `variants` (relation: one-to-many Variant)

### Variant
- `name` (string, e.g., "5mg")
- `sku` (string, unique)
- `price` (decimal)
- `active` (boolean)
- `inventory` (integer, optional)
- `product` (relation: many-to-one Product)

### Order
- `stripeSessionId` (string, unique)
- `stripePaymentIntentId` (string)
- `email` (email)
- `amountSubtotal` / `amountTotal` / `shippingAmount` (decimal)
- `currency` (string)
- `shippingName`, `shippingAddressLine1`, etc.
- `confirmationAccepted` (boolean)
- `status` (enum: pending, paid, failed, refunded)
- `orderItems` (relation: one-to-many OrderItem)

### OrderItem
- `productNameSnapshot` (string)
- `variantNameSnapshot` (string)
- `skuSnapshot` (string)
- `unitPriceSnapshot` (decimal)
- `quantity` (integer)
- `order` (relation: many-to-one Order)

## Compliance Flow

1. User attempts to add item to cart
2. If not confirmed, ComplianceModal appears
3. User must check all 3 boxes:
   - 21+ years old
   - Qualified professional/researcher
   - Understands research use only
4. Confirmation stored in localStorage (`peptideConfirmedV1`)
5. Checkout page requires final checkbox confirmation
6. Server validates `confirmationAccepted` before creating Stripe session

## Future Enhancements (Not in MVP)

- [ ] Discount/promo codes
- [ ] User accounts
- [ ] Order history
- [ ] Email notifications
- [ ] Inventory management
- [ ] Admin dashboard analytics

## License

Private - All rights reserved.
