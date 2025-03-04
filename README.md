# Choufli Hal Hackathon Portal

![Choufli Hal Hackathon](public/logo.png)

A modern, feature-rich hackathon registration portal built for Google Developer Group ISSAT Sousse's "Choufli Hal" event. This Next.js application provides an intuitive interface for participants to register for the hackathon, with a robust admin dashboard for event management.

## ✨ Features

- **Interactive Landing Page**: Engaging, culturally themed design with event information
- **Team Registration**: Support for teams of 1-4 members
- **Waitlist Management**: Automatic waitlisting when registration cap is reached
- **Project Submissions**: Multiple submission methods with file uploads and URL sharing
- **Submission Management**: Time-controlled submission periods with admin controls
- **Admin Dashboard**: Comprehensive management of teams, registrations, and submissions
- **Responsive Design**: Optimized for all devices
- **Real-time Statistics**: Track registration numbers and participant data

## 🛠️ Technologies

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://github.com/colinhacks/zod)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **File Storage**: Server-based storage for project submissions with [Supabase](https://supabase.com)

## 📋 Prerequisites

- Node.js 18.x or later
- MongoDB database (local or Atlas)
- npm or yarn package manager

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/choufli-hal-hackathon-portal.git
cd choufli-hal-hackathon-portal
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file based on the `.env.example` template:

```bash
cp .env.example .env.local
```

Update the environment variables with your own values:

```
MONGODB_URI=mongodb://localhost:27017/choufli-hal-db
NEXTAUTH_SECRET=your-secure-auth-secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure-password
BASE_URL=http://localhost:3000
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 💻 Usage

### Public Pages

- **Home**: Landing page with event information
- **Registration**: Team registration form with automatic waitlisting
- **Submissions**: Project submission system with multiple upload options:
  - GitHub repository links
  - Deployed project URLs
  - Presentation/design links (Figma, slides, etc.)
  - File uploads (up to 30MB) for code, PDFs, or presentations

### Admin Dashboard

1. Access the admin login at `/admin/login`
2. Use your admin credentials from the environment variables
3. Navigate through:
   - Dashboard: Overview of registrations and waitlist
   - Teams: Detailed list of registered teams
   - Waitlist: Manage teams on the waitlist
   - Submissions: Review and manage team project submissions, control submission period

## 📁 Project Structure

```
choufli-hal-hackathon-portal/
├── app/                   # Next.js App Router
│   ├── (routes)/          # Application routes
│   ├── actions/           # Server actions
│   ├── api/               # API routes
├── components/            # UI components
│   ├── admin/             # Admin dashboard components
│   ├── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── models/                # Database models
├── public/                # Static assets
├── .env.example           # Environment variables template
└── ...                    # Configuration files
```

## 📝 Administration

To access the admin dashboard:

1. Navigate to `/admin/login`
2. Log in with the credentials specified in your environment variables
3. Manage registrations, view statistics, and handle the waitlist
4. Control submission periods and review team submissions

### Managing Submissions

Admins have special controls for the submission system:
- Enable/disable the submission period
- View all team submissions with search and filtering
- Download submitted project files
- Access links to GitHub repositories, deployed projects, and presentations

## 🔧 Customization

- Update branding images in the `public/` directory
- Modify the maximum team limit in the registration page
- Customize the timeline and event details in the respective components

## 👥 Contributors

- [Aziz Bouali](https://github.com/saaya-code)
- [Daly Chouikh](https://github.com/DalyChouikh)

## 🌟 Acknowledgments

- Inspired by the Tunisian sitcom "Choufli Hal"
- Built with the Next.js App Router architecture
- UI components from shadcn/ui