/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  transpilePackages: [
    '@farcaster/frame-sdk',
    '@farcaster/frame-core',
    '@metamask/sdk',
    '@wagmi/connectors',
    'wagmi',
    '@rainbow-me/rainbowkit'
  ],
  webpack: (config) => {
    // Ignore all map files and TypeScript declaration files
    config.module.rules.push({
      test: /\.(js\.map|d\.ts|d\.ts\.map)$/,
      loader: 'ignore-loader'
    });

    // Ignore source maps in production
    if (config.mode === 'production') {
      config.devtool = false;
    }

    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts'],
      '.mjs': ['.mjs', '.mts'],
      '.cjs': ['.cjs', '.cts'],
    };
    
    return config;
  },
  reactStrictMode: true,

  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/.well-known/farcaster.json',
        destination: '/api/.well-known/farcaster.json',
      },
    ];
  },
};

export default config;
