const { hostname } = require("os");

/** @type {import('next').NextConfig} */
module.exports = {
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "homely-images.s3.ap-southeast-1.amazonaws.com",
            },
            {
                protocol: "https",
                hostname: "img.daisyui.com",
            },
        ],
    },
};
