# Blueprint AI - Startup Execution Engine

Blueprint AI is a high-performance, AI-powered platform designed to turn startup ideas into detailed, actionable execution plans. Built with a premium aesthetic and modern tech stack, it provides founders with everything from technical architecture to brutal market analysis.

## ✨ Features

- **AI Blueprint Generation**: Instantly generate structured execution plans for any business idea.
- **Executive Summaries**: High-level overviews of your project goals and mission.
- **Technical Architecture**: Recommended tech stacks, database schemas, and API endpoint designs.
- **Development Roadmap**: Phased implementation strategies with clear deliverables.
- **Brutal Critic Mode**: Unfiltered AI analysis of market risks, execution barriers, and competitive threats.
- **Google OAuth Integration**: Seamless and secure sign-in experience.
- **Premium Dashboard**: A sleek "Command Center" to manage all your active blueprints.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (Google OAuth)
- **AI Engine**: Advanced LLM integration for precision strategy generation
- **Styling**: Vanilla CSS with modern premium design tokens
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Validation**: [Zod](https://zod.dev/)

## 🚀 Getting Started

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Noor1805/Project.git
   cd startup
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory and add the following:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   GOOGLE_CLIENT_ID=your_google_id
   GOOGLE_CLIENT_SECRET=your_google_secret
   OPENROUTER_API_KEY=your_api_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## 📜 Documentation

The project includes built-in identity resolution and automated user mapping to ensure a smooth transition from idea to data-driven plan.

---

_Built for founders who demand precision._
