# Modern Hacker Portfolio

A personal portfolio website with a "modern hacker / systems developer" aesthetic, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Split Hero Layout**: Terminal-inspired design with neon accents.
- **Infinite Marquee**: Smooth scrolling project showcase.
- **Contact Form**: Integrated with a mock API endpoint (ready for Resend/SendGrid).
- **Responsive Design**: Optimized for mobile, tablet, and desktop.
- **Hacker Theme**: Custom Tailwind configuration for deep blacks and neon greens.

## Getting Started

Since this project was scaffolded manually in a restricted environment, you need to install dependencies first.

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable UI components.
- `lib/`: Utility functions.
- `public/`: Static assets.

## Customization

- **Theme**: Edit `tailwind.config.ts` to change colors or fonts.
- **Data**: Update `components/featured-projects.tsx` and `app/projects/page.tsx` with your own projects.
- **Contact**: Configure the API route in `app/api/contact/route.ts` to use a real email service.
