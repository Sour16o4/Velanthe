/** Next.js config. SVG is allowed so the placeholder product art in public/img can go through next/image. */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};
export default nextConfig;
