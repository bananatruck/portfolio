/** @type {import('next').NextConfig} */
const nextConfig = {
    // For GitHub Pages deployment, uncomment the following line:
    // output: 'export',

    // For GitHub Pages subdirectory deployment, uncomment and set:
    // basePath: '/portfolio--main',

    images: {
        // For static export (GitHub Pages), set to true:
        // unoptimized: true,

        // Enable modern image formats for better compression
        formats: ['image/avif', 'image/webp'],
        // Allow remote images from picsum.photos
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'picsum.photos',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.transparenttextures.com',
                pathname: '/**',
            },
        ],
        // Optimize image loading
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    // Optimize for production
    poweredByHeader: false,
    compress: true,
};

module.exports = nextConfig;
