import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "./providers";
import dynamic from "next/dynamic";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

const TargetCursor = dynamic(() => import("@/components/TargetCursor"), {
    ssr: false,
});

const LoadingScreen = dynamic(() => import("@/components/LoadingScreen"), {
    ssr: false,
});

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});

export const metadata: Metadata = {
    title: "Kesh",
    description: "Full stack and AI developer based in Long Beach. Building thoughtful systems and user-focused applications.",
    icons: {
        icon: [
            { url: '/favicon.png', type: 'image/png' },
            { url: '/favicon.ico', type: 'image/x-icon' },
        ],
        shortcut: '/favicon.png',
        apple: '/apple-touch-icon.png',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground selection:bg-primary/20`}>
                <LoadingScreen />
                <TargetCursor
                    spinDuration={2}
                    hideDefaultCursor={true}
                    parallaxOn={true}
                />
                <Providers>
                    <div className="relative flex min-h-screen flex-col bg-background">
                        <Header />
                        <main className="flex-1">{children}</main>
                        <Footer />
                    </div>
                </Providers>
            </body>
        </html>
    );
}
