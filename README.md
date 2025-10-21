# Haya

Seamless infrastructure for onchain UX analytics, empowering builders to identify and fix friction points in minutes, not weeks.

A modern web application built with Next.js, React, and Tailwind CSS. Haya features a clean, responsive design with a focus on user experience.

## 🚀 Features

- **Modern Stack**: Built with Next.js 15, React 19, and TypeScript
- **Styling**: Styled with Tailwind CSS and shadcn/ui components
- **Performance**: Optimized for performance with Turbopack
- **Code Quality**: Enforced with Biome (formatting and linting)
- **Responsive**: Fully responsive design that works on all devices

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (v15.5.6)
- **UI Library**: [React](https://react.dev/) (v19.1.0)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4)
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/) (v5)
- **Icons**: [Iconsax](https://iconsax-reactjs.vercel.app/)
- **Code Quality**: [Biome](https://biomejs.dev/) (formatter & linter)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, pnpm, or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/haya.git
   cd haya
   ```

2. Install dependencies:

   ```bash
   # Using pnpm (recommended)
   pnpm install

   # Or using npm
   npm install

   # Or using yarn
   yarn install
   ```

3. Start the development server:

   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🛠️ Development

- **Run the development server**: `pnpm dev`
- **Build for production**: `pnpm build`
- **Start production server**: `pnpm start`
- **Lint code**: `pnpm lint`
- **Format code**: `pnpm format`

## 📂 Project Structure

```
.
├── public/              # Static files
│   ├── logo.svg         # Main logo
│   └── logo-icon.svg    # Favicon and app icon
├── src/
│   ├── app/             # App router
│   │   ├── dashboard/   # Dashboard pages
│   │   ├── globals.css  # Global styles
│   │   └── layout.tsx   # Root layout
│   ├── components/      # Reusable components
│   │   └── ui/          # UI components (shadcn/ui)
│   └── lib/             # Utility functions
├── .gitignore          # Git ignore file
├── biome.json          # Biome configuration
├── components.json     # shadcn/ui configuration
├── next.config.ts      # Next.js configuration
├── package.json        # Project dependencies
├── postcss.config.mjs  # PostCSS configuration
└── tailwind.config.ts  # Tailwind CSS configuration
```

## 🌟 Design System

Haya uses a custom design system implemented with Tailwind CSS and shadcn/ui components. The design follows modern UI/UX principles with a focus on accessibility and responsiveness.

### Colors

Primary colors and design tokens are defined in the Tailwind configuration.

### Typography

The application uses a clean, readable typography system with system fonts for optimal performance.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Figma Design](https://www.figma.com/design/f83Gu5pmNssnGaAIcCPrGW/Haya-Project--Copy-?node-id=44-47&t=ymWhh81ATVZnIrsZ-0)
