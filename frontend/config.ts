import { Connection } from '@solana/web3.js'

const SOLANA_RPC_HOST = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST || 'https://api.devnet.solana.com'

export const getConnection = () => new Connection(SOLANA_RPC_HOST)

