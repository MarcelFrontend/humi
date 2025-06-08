/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'github.com',
                pathname: '/MarcelFrontend/humi/**',
            },
        ],
    },
};

export default nextConfig;
