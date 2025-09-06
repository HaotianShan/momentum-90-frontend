# Momentum 90 - AI-Powered 90-Day Goal Achievement Platform

![Momentum 90](https://img.shields.io/badge/Momentum-90-blue?style=for-the-badge&logo=target)
![Next.js](https://img.shields.io/badge/Next.js-15.2.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?style=for-the-badge&logo=postgresql)

Transform your ambitious goals into epic 90-day adventures with AI-powered quest generation, progress tracking, and gamified achievement system.

## 🎯 Overview

Momentum 90 is a modern web application that helps users break down their ambitious goals into structured 90-day adventures. The platform uses AI to generate personalized weekly quests, tracks progress with an XP system, and provides a gamified experience to keep users motivated throughout their journey.

### Key Features

- **🎮 Gamified Goal Setting**: Transform any goal into an epic 90-day adventure
- **🤖 AI-Powered Quest Generation**: Automatically break down goals into weekly challenges
- **📊 Progress Tracking**: Visual roadmap with XP system and achievement levels
- **🔐 Secure Authentication**: Multiple login options (Email/Password, Google, GitHub)
- **📱 Responsive Design**: Beautiful UI that works on all devices
- **🎨 Modern UI/UX**: Built with Tailwind CSS and shadcn/ui components
- **💾 Persistent Storage**: PostgreSQL database with Drizzle ORM

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 15.2.2 with App Router
- **Language**: TypeScript 5.6.3
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: shadcn/ui with Radix UI primitives
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js v5 (beta)
- **State Management**: React hooks and server actions
- **Deployment**: Vercel-ready with Docker support

### Project Structure

```
momentum90-frontend/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/               # Login page
│   │   ├── register/            # Registration page
│   │   ├── auth.ts              # NextAuth configuration
│   │   └── auth.config.ts       # Auth configuration
│   ├── (home)/                  # Main application routes
│   │   ├── page.tsx             # Home page
│   │   └── adventure/           # Adventure pages
│   ├── api/                     # API routes
│   │   └── adventure/           # Adventure-related endpoints
│   ├── actions.ts               # Server actions
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── adventure-roadmap.tsx    # Adventure visualization
│   ├── ongoing-adventures.tsx   # Adventure list
│   ├── super-goal-input.tsx     # Goal input form
│   └── hero.tsx                 # Hero section
├── lib/                         # Utility libraries
│   ├── db/                      # Database configuration
│   │   ├── schema.ts            # Database schema
│   │   ├── queries.ts           # Database queries
│   │   └── migrations/          # Database migrations
│   └── utils.ts                 # Utility functions
├── hooks/                       # Custom React hooks
└── public/                      # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database
- Google OAuth credentials (optional)
- GitHub OAuth credentials (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd momentum90-frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   POSTGRES_URL="postgresql://username:password@localhost:5432/momentum90"
   
   # NextAuth
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # OAuth Providers (optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   
   # External API
   NEXT_PUBLIC_X_API_KEY="your-api-key"
   ```

4. **Set up the database**
   ```bash
   # Generate migrations
   pnpm db:generate
   
   # Run migrations
   pnpm db:migrate
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE "user" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" varchar(64) NOT NULL,
  "password" varchar(64)
);
```

### User Plans Table
```sql
CREATE TABLE "user_plans" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "created_at" timestamp with time zone DEFAULT now(),
  "super_goal" text,
  "start_date" date DEFAULT now(),
  "quests" jsonb,
  "completed_quests" jsonb DEFAULT '[]',
  "total_xp" jsonb DEFAULT '0'
);
```

## 🔧 Available Scripts

- `pnpm dev` - Start development server with Turbo
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint and Biome
- `pnpm lint:fix` - Fix linting issues
- `pnpm format` - Format code with Biome
- `pnpm test` - Run Playwright tests
- `pnpm db:generate` - Generate database migrations
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open Drizzle Studio
- `pnpm db:push` - Push schema changes to database

## 🎮 How It Works

### 1. Goal Setting
Users start by entering their "Super Goal" - any ambitious objective they want to achieve in 90 days.

### 2. AI Quest Generation
The application calls an external AI service to break down the goal into:
- 12 weekly milestones
- Structured monthly actions
- Progressive difficulty levels

### 3. Adventure Roadmap
Each goal becomes an interactive adventure with:
- **Quest System**: 12 weekly challenges with increasing difficulty
- **XP System**: Earn experience points for completing quests
- **Achievement Levels**: Novice → Explorer → Adventurer → Hero → Legend
- **Progress Tracking**: Visual progress bars and completion status

### 4. Gamification Elements
- **Difficulty Progression**: Quests get harder as you advance
- **Reward System**: Each quest completion unlocks new rewards
- **Visual Feedback**: Animated progress indicators and achievement badges
- **Social Elements**: Share progress and compete with others

## 🔐 Authentication

The application supports multiple authentication methods:

### Email/Password Authentication
- Secure password hashing with bcrypt
- Form validation and error handling
- Session management with NextAuth.js

### OAuth Providers
- **Google OAuth**: One-click sign-in with Google
- **GitHub OAuth**: Developer-friendly GitHub integration
- Automatic account creation for new OAuth users

### Security Features
- CSRF protection
- Secure session handling
- Password strength requirements
- Rate limiting on authentication endpoints

## 🎨 UI/UX Features

### Design System
- **Color Scheme**: Custom CSS variables for theming
- **Typography**: Geist font family for modern readability
- **Components**: Consistent shadcn/ui component library
- **Animations**: Smooth transitions and micro-interactions

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interface elements
- Optimized for both desktop and mobile

### Accessibility
- ARIA labels and semantic HTML
- Keyboard navigation support
- High contrast mode compatibility
- Screen reader friendly

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**
   ```bash
   vercel --prod
   ```

2. **Set environment variables** in Vercel dashboard

3. **Deploy**
   ```bash
   git push origin main
   ```

### Docker Deployment

1. **Build the image**
   ```bash
   docker build -t momentum90 .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 momentum90
   ```

### Environment Variables for Production

Ensure all required environment variables are set in your production environment:
- Database connection string
- NextAuth configuration
- OAuth provider credentials
- External API keys

## 🧪 Testing

The project includes comprehensive testing setup:

### Playwright E2E Tests
```bash
pnpm test
```

### Linting and Formatting
```bash
pnpm lint        # Check for issues
pnpm lint:fix    # Fix auto-fixable issues
pnpm format      # Format code
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use conventional commit messages
- Ensure all tests pass
- Update documentation for new features
- Follow the existing code style

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing React framework
- **Vercel** for hosting and deployment platform
- **shadcn/ui** for the beautiful component library
- **Drizzle Team** for the excellent ORM
- **Tailwind CSS** for the utility-first CSS framework

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**Built with ❤️ for goal achievers everywhere**

Transform your dreams into reality with Momentum 90! 🚀
