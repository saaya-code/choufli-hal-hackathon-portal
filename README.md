# Choufli Hal Hackathon Portal

![Choufli Hal Hackathon](public/logo.png)

A modern, feature-rich hackathon registration portal built for Google Developer Group ISSAT Sousse's "Choufli Hal" event. This Next.js application provides an intuitive interface for participants to register for the hackathon, with a robust admin dashboard for event management.

## ✨ Features

- **Interactive Landing Page**: Engaging, culturally themed design with event information
- **Team Registration**: Support for teams of 1-4 members
- **Waitlist Management**: Automatic waitlisting when registration cap is reached
- **Admin Dashboard**: Comprehensive management of teams and registrations
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

### Admin Dashboard

1. Access the admin login at `/admin/login`
2. Use your admin credentials from the environment variables
3. Navigate through:
   - Dashboard: Overview of registrations and waitlist
   - Teams: Detailed list of registered teams
   - Waitlist: Manage teams on the waitlist

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

## 🔧 Customization

- Update branding images in the `public/` directory
- Modify the maximum team limit in the registration page
- Customize the timeline and event details in the respective components

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributors

- Google Developer Group ISSAT Sousse

## 🌟 Acknowledgments

- Inspired by the Tunisian sitcom "Choufli Hal"
- Built with the Next.js App Router architecture
- UI components from shadcn/ui