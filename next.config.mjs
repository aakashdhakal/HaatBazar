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
            {
                hostname: "havmor.ca",
            },
            {
                hostname: "images.unsplash.com",
            },
            {
                hostname: "cdn.pixabay.com",
            },
            {
                hostname: "i.pinimg.com",
            },
            {
                hostname: "cdn.dribbble.com",
            },
            {
                hostname: "source.unsplash.com",
            },
            {
                hostname: "randomuser.me",
            }
        ]
    },
    async headers() {
        return [
            {
                // Apply headers to all routes
                source: '/(.*)',
                headers: [
                    {
                        key: 'Access-Control-Allow-Credentials',
                        value: 'true',
                    },
                    {
                        key: 'Access-Control-Allow-Origin',
                        // Replace with your domain
                        value: '*',
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
                    },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value:

                            'X-CSRF-Token, X-Requested-With, Accept, Accept- Version, Content - Length, Content - MD5, Content - Type, Date, X - Api - Version',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
