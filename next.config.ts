import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        domains: [
            'firebasestorage.googleapis.com',
            'static.vecteezy.com',
            'i.pinimg.com',
        ],
    },
};

export default nextConfig;
