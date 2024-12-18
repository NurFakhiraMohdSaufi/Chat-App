import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        domains: [
            'firebasestorage.googleapis.com',
            'static.vecteezy.com',
            'i.pinimg.com',
            'lh3.googleusercontent.com',
        ],
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.(png|jpe?g|gif|svg)$/i,
            type: 'asset/resource',
        });
        return config;
    },
};

export default nextConfig;
