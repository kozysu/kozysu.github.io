/** @type {import('next').NextConfig} */
const nextConfig = {
    /* Lets a second Next process (a verification build, say) use its own output
       directory instead of fighting the running dev server over .next. Only
       set when asked for: with a static export, a distDir also takes the
       exported site, and the deploy expects it in out/. */
    ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
    /* GitHub Pages serves files, so the site is built to plain HTML in out/.
       There is no image server there, and a trailing slash lets /publications/
       resolve to publications/index.html. */
    output: "export",
    images: { unoptimized: true },
    trailingSlash: true,
};

export default nextConfig;
