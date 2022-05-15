/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: "./",
  compiler: {
    styledComponents: true,
  },

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Important: return the modified config
    config.plugins.push(
      new webpack.DefinePlugin({
        SC_DISABLE_SPEEDY: true,
      })
    )
    return config
  },
}

module.exports = nextConfig
