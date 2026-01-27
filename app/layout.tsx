import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import TargetCursor from "@/components/TargetCursor";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});

export const metadata: Metadata = {
    title: "Developer Portfolio",
    description: "A modern hacker / systems developer portfolio.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="light">
            <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-white text-black selection:bg-black/20`} style={{ backgroundColor: '#f5f5f0', color: '#000' }}>
                <TargetCursor
                    spinDuration={2}
                    hideDefaultCursor={true}
                    parallaxOn={true}
                />
                <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" disableTransitionOnChange>
                    <div className="relative flex min-h-screen flex-col bg-white" style={{ backgroundColor: '#f5f5f0' }}>
                        <Header />
                        <main className="flex-1">{children}</main>
                        <Footer />
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
