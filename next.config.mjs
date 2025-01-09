/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "png.pngtree.com",
            },
            {
                hostname: "lh3.googleusercontent.com",
            },
            {
                hostname: "avatars.githubusercontent.com",
            },
            {
                hostname: "img.freepik.com",
            },
        ]
    },
};

export default nextConfig;
