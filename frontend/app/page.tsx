'use client'

import { useState, useEffect } from 'react'
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'
import { Program, AnchorProvider, web3, utils, BN } from '@project-serum/anchor'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import idl from '@/idl.json'
import CreateCampaign from '@/components/CreateCampaign'
import CampaignDetails from '@/components/CampaignDetails'
import WithdrawForm from '@/components/WithdrawForm'
import SolanaLogo from '@/components/SolanaLogo'

const { SystemProgram } = web3

const programID = new PublicKey(idl.metadata.address)
const network = clusterApiUrl('devnet')
const opts = {
  preflightCommitment: 'processed'
}

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [userPublicKey, setUserPublicKey] = useState<string | null>(null);

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected()
    }
    window.addEventListener('load', onLoad)
    return () => window.removeEventListener('load', onLoad)
  }, [])

  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching campaigns...')
      getAllCampaigns()
    }
  }, [walletAddress])

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window as any

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!')
          const response = await solana.connect({ onlyIfTrusted: true })
          console.log(
              'Connected with Public Key:',
              response.publicKey.toString()
          )
          setWalletAddress(response.publicKey.toString())
          setUserPublicKey(response.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const connectWallet = async () => {
    const { solana } = window as any

    if (solana) {
      const response = await solana.connect()
      console.log('Connected with Public Key:', response.publicKey.toString())
      setWalletAddress(response.publicKey.toString())
      setUserPublicKey(response.publicKey.toString());
    }
  }

  const getProvider = () => {
    const connection = new Connection(network, {
      commitment: opts.preflightCommitment,
      wsEndpoint: network.replace('https', 'wss')
    })
    const provider = new AnchorProvider(
        connection,
        (window as any).solana,
        opts
    )
    return provider
  }

  const checkConnection = async () => {
    const connection = new Connection(network, opts.preflightCommitment);
    try {
      const version = await connection.getVersion();
      console.log('Connection to cluster established:', version);
      return true;
    } catch (error) {
      console.error('Error connecting to the network:', error);
      return false;
    }
  };

  const createCampaign = async (campaignData: any) => {
    if (!(await checkConnection())) {
      alert('Failed to connect to the Solana network. Please check your internet connection and try again.');
      return;
    }
    try {
      const provider = getProvider();
      const program = new Program(idl as any, programID, provider);

      const [campaignPda] = await PublicKey.findProgramAddress(
          [
            utils.bytes.utf8.encode("CAMPAIGNING"),
            provider.wallet.publicKey.toBuffer(),
          ],
          program.programId
      );

      await program.methods
          .create(
              campaignData.name,
              campaignData.description,
              new BN(campaignData.targetAmount * web3.LAMPORTS_PER_SOL),
              campaignData.projectUrl,
              campaignData.progressUpdateUrl,
              campaignData.projectImageUrl,
              campaignData.category
          )
          .accounts({
            campaign: campaignPda,
            user: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

      console.log("Created a new campaign:", campaignPda.toString());
      getAllCampaigns();
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
  };

  const getAllCampaigns = async () => {
    const connection = new Connection(network, {
      commitment: opts.preflightCommitment,
      wsEndpoint: network.replace('https', 'wss')
    });
    const provider = getProvider();
    const program = new Program(idl as any, programID, provider);

    try {
      const campaigns = await program.account.campaign.all();
      console.log("Fetched campaigns:", campaigns);

      setCampaigns(
          campaigns.map((campaign) => ({
            pubkey: campaign.publicKey,
            admin: campaign.account.admin,
            name: campaign.account.name,
            description: campaign.account.description,
            amountDonated: campaign.account.amountDonated,
            targetAmount: campaign.account.targetAmount,
            projectUrl: campaign.account.projectUrl,
            progressUpdateUrl: campaign.account.progressUpdateUrl,
            projectImageUrl: campaign.account.projectImageUrl,
            category: campaign.account.category,
          }))
      );
    } catch (error) {
      console.log("Error fetching campaigns:", error);
    }
  };

  const donateToCampaign = async (publicKey: string, amount: number) => {
    try {
      const provider = getProvider()
      const program = new Program(idl as any, programID, provider)

      await program.methods
          .donate(new BN(amount * web3.LAMPORTS_PER_SOL))
          .accounts({
            campaign: new PublicKey(publicKey),
            user: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc()

      console.log('Donated to campaign', publicKey)
      getAllCampaigns()
    } catch (error) {
      console.error('Error donating to campaign:', error)
    }
  }

  const withdrawFromCampaign = async (publicKey: string, amount: number) => {
    try {
      const provider = getProvider()
      const program = new Program(idl as any, programID, provider)

      await program.methods
          .withdraw(new BN(amount * web3.LAMPORTS_PER_SOL))
          .accounts({
            campaign: new PublicKey(publicKey),
            user: provider.wallet.publicKey,
          })
          .rpc()

      console.log('Withdrawn from campaign', publicKey)
      getAllCampaigns()
    } catch (error) {
      console.error('Error withdrawing from campaign:', error)
    }
  }

  if (!walletAddress) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4 sm:px-6">
          <div className="text-center space-y-4 sm:space-y-6 p-4 sm:p-8 max-w-md w-full">
            <SolanaLogo className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 sm:mb-6" />
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Solana campaigning
            </h1>
            <p className="
text-sm sm:text-lg text-gray-600 max-w-md mx-auto">
              Connect your Phantom wallet to create and support campaigns on the Solana blockchain
            </p>
            <Button
                onClick={connectWallet}
                size="lg"
                className="w-full sm:w-auto font-semibold text-base sm:text-lg py-2 sm:py-3"
            >
              Connect Phantom Wallet
            </Button>
          </div>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-6 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-6 sm:space-y-12">
          <div className="text-center space-y-2 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Solana campaigning
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Create and support campaigns on Solana blockchain
            </p>
          </div>

          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="create" className="text-sm sm:text-base py-2 sm:py-3">Create Campaign</TabsTrigger>
              <TabsTrigger value="existing" className="text-sm sm:text-base py-2 sm:py-3">Existing Campaigns</TabsTrigger>
            </TabsList>
            <TabsContent value="create" className="space-y-4">
              <CreateCampaign createCampaign={createCampaign} />
            </TabsContent>
            <TabsContent value="existing" className="space-y-6 sm:space-y-8">
              {campaigns.map((campaign) => (
                  <div key={campaign.pubkey.toString()} className="space-y-4 sm:space-y-6">
                    <CampaignDetails campaign={campaign} donate={donateToCampaign} />
                    {userPublicKey && campaign.admin.toString() === userPublicKey && (
                        <WithdrawForm campaignAddress={campaign.pubkey} withdraw={withdrawFromCampaign} />
                    )}
                  </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
  )
}

