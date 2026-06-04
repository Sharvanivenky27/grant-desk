/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@grantdesk/auth', '@grantdesk/api', '@grantdesk/db'],
};

module.exports = nextConfig;
