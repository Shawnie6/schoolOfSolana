const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.devnet.solana.com/ wss://api.devnet.solana.com/; img-src 'self' data: https: http:;"
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig

