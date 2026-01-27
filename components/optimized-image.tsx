"use client";

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
    src: string;
    alt: string;
    fill?: boolean;
    priority?: boolean;
    className?: string;
    sizes?: string;
}

/**
 * Optimized Image Component with:
 * - WebP/AVIF auto-formatting (via Next.js)
 * - Lazy loading by default
 * - Blur placeholder during load
 * - Responsive sizing
 */
export function OptimizedImage({
    src,
    alt,
    fill = true,
    priority = false,
    className = '',
    sizes = '(max-width: 768px) 50vw, 25vw'
}: OptimizedImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    return (
        <div className="relative w-full h-full">
            {/* Loading placeholder */}
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}

            {/* Error fallback */}
            {hasError && (
                <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500 text-xs">Image unavailable</span>
                </div>
            )}

            <Image
                src={src}
                alt={alt}
                fill={fill}
                priority={priority}
                loading={priority ? 'eager' : 'lazy'}
                sizes={sizes}
                quality={75}
                className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                onLoad={() => setIsLoaded(true)}
                onError={() => setHasError(true)}
            />
        </div>
    );
}
