# Haya

Seamless infrastructure for onchain UX analytics, empowering builders to identify and fix friction points in minutes, not weeks.

Haya is a modern web application that provides AI-powered UX audits for websites, focusing on visual hierarchy, conversion psychology, and industry-specific best practices.

## 🚀 Features

- **AI-Powered UX Audits**: Automatically analyze websites for UX violations and improvement opportunities.
- **Comprehensive Analysis**:
  - **Visual Hierarchy & Information Architecture**: Evaluate element order and layout effectiveness.
  - **Conversion Psychology**: Analyze hero communication, CTAs, and cognitive load.
  - **UX Laws**: Check compliance with Jakob's Law, Fitts's Law, Miller's Law, and more.
  - **Accessibility**: Assess WCAG contrast, alt text, and navigation support.
  - **Industry Best Practices**: Specific insights for AI SaaS, Blockchain, B2B, and Web3.
- **Actionable Insights**: Get concrete suggestions to fix UX violations.
- **Modern Dashboard**: Manage and review your audit history in a clean, responsive interface.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (v16)
- **UI Library**: [React](https://react.dev/) (v19)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Icons**: [Iconsax](https://iconsax-reactjs.vercel.app/) & [Lucide](https://lucide.dev/)
- **Code Quality**: [Biome](https://biomejs.dev/) (formatter & linter)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- pnpm (recommended), npm, or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/haya.git
   cd haya
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🛠️ Development

- **Run the development server**: `pnpm dev`
- **Build for production**: `pnpm build`
- **Start production server**: `pnpm start`
- **Lint & Format**: `pnpm lint` / `pnpm format`

## 📂 Project Structure

```
.
├── public/              # Static files
├── src/
│   ├── app/             # Next.js App Router
│   ├── components/      # Shared components (including shadcn/ui)
│   ├── features/        # Feature-based modules (audits, auth)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and API configuration
│   └── styles/          # Global styles
├── biome.json          # Biome configuration
├── next.config.ts      # Next.js configuration
└── package.json        # Project dependencies
```

## 🌟 Design System

Haya uses a custom design system implemented with Tailwind CSS v4 and shadcn/ui components. The design prioritizes:

- **Clean Aesthetics**: Minimalist interface to focus on data.
- **Responsiveness**: Fully functional on mobile and desktop.
- **Accessibility**: Built with accessible primitives.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
