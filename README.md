# B2B Vegetables Wholesale Platform

A modern B2B platform for vegetable and legume wholesale sales, built with Next.js 14, TypeScript, and Prisma.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd b2b-vegetables
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with:
   ```env
   DATABASE_URL="your-postgresql-connection-string"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   NEXT_PUBLIC_COMPANY_NAME="Your Company Name"
   NEXT_PUBLIC_COMPANY_EMAIL="contact@yourcompany.com"
   NEXT_PUBLIC_COMPANY_PHONE="+40 123 456 789"
   ADMIN_NOTIFICATION_EMAIL="admin@yourcompany.com"
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js v4
- **Styling**: Tailwind CSS + Radix UI
- **Internationalization**: next-intl (EN/RO)
- **File Upload**: UploadThing
- **PDF Generation**: jsPDF
- **Email**: Resend

## 📋 Features

### Customer Features
- Product catalog with search and filtering
- RFQ (Request for Quote) creation and management
- Dashboard with order tracking
- Multi-language support (English/Romanian)

### Admin Features
- User management and approval system
- Product and category management
- RFQ processing and offer creation
- Analytics and reporting dashboard
- Bulk operations

## 🔐 Demo Accounts

- **Admin**: `admin@demo.local` / `Admin123!`
- **Customer**: `customer@demo.local` / `Customer123!`
- **Pending**: `pending@demo.local` / `Pending123!`

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Other Platforms

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── [locale]/          # Internationalized routes
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── navigation/        # Header, Footer, Language Switcher
│   ├── providers/         # Context providers
│   └── ui/               # Base UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions & configurations
├── messages/             # i18n translation files
├── types/                # TypeScript type definitions
└── middleware.ts         # Next.js middleware
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes
- `npm run db:seed` - Seed database with demo data
- `npm run db:studio` - Open Prisma Studio

## 📝 License

This project is private and proprietary.

## 🤝 Support

For support, email admin@yourcompany.com