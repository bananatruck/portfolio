/**
 * The site is served from the root locally but deployed to GitHub Pages under a
 * basePath (injected by actions/configure-pages at build time). Next rewrites
 * that path into next/image and next/link, but not into raw asset URLs or into
 * static files under public/, which the secret game relies on.
 *
 * Reading it back off an already-emitted asset gets the right answer in every
 * environment without having to keep a second copy of the config in sync.
 */
export function getBasePath(): string {
    if (typeof document === "undefined") return "";

    const asset =
        document.querySelector<HTMLScriptElement>('script[src*="/_next/"]')?.src ??
        document.querySelector<HTMLLinkElement>('link[href*="/_next/"]')?.href;

    if (!asset) return "";

    try {
        return new URL(asset).pathname.split("/_next/")[0] ?? "";
    } catch {
        return "";
    }
}
