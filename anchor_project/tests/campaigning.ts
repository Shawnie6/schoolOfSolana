import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Campaigning } from "../target/types/campaigning";
import { PublicKey } from "@solana/web3.js";
import { assert } from "chai";

const CAMPAIGNING_SEED = "CAMPAIGNING";

describe("campaigning", () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.Campaigning as Program<Campaigning>;

    const admin = anchor.web3.Keypair.generate();
    const donor = anchor.web3.Keypair.generate();

    const campaignDetails = {
        name: "Green Energy Initiative",
        description: "Supporting projects focused on renewable energy solutions.",
        targetAmount: new anchor.BN(5), // Smaller target amount in SOL
        projectUrl: "https://greenenergy.com",
        progressUpdateUrl: "https://updates.greenenergy.com",
        projectImageUrl: "https://image.greenenergy.com",
        category: "Environment",
    };

    let campaignPda: PublicKey;
    let campaignBump: number;

    describe("Create Campaign", async () => {
        it("Admin creates a campaign successfully", async () => {
            await airdrop(provider.connection, admin.publicKey, 2); // Airdrop 2 SOL to admin

            [campaignPda, campaignBump] = getCampaignAddress(admin.publicKey, program.programId);

            await program.methods
                .create(
                    campaignDetails.name,
                    campaignDetails.description,
                    campaignDetails.targetAmount,
                    campaignDetails.projectUrl,
                    campaignDetails.progressUpdateUrl,
                    campaignDetails.projectImageUrl,
                    campaignDetails.category
                )
                .accounts({
                    campaign: campaignPda,
                    user: admin.publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                })
                .signers([admin])
                .rpc({ commitment: "confirmed" });

            await checkCampaign(program, campaignPda, admin.publicKey, campaignDetails, 0, 0, campaignBump);
        });
    });

    describe("Donations", async () => {
        it("User donates to the campaign", async () => {
            await airdrop(provider.connection, donor.publicKey, 1); // Airdrop 1 SOL to donor

            const donationAmount = new anchor.BN(0.1 * anchor.web3.LAMPORTS_PER_SOL); // Donate 0.1 SOL

            await program.methods
                .donate(donationAmount)
                .accounts({
                    campaign: campaignPda,
                    user: donor.publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                })
                .signers([donor])
                .rpc({ commitment: "confirmed" });

            const campaignData = await program.account.campaign.fetch(campaignPda);
            assert.strictEqual(campaignData.amountDonated.toString(), donationAmount.toString());
        });
    });

    describe("Withdrawals", async () => {
        it("Admin withdraws the donated funds", async () => {
            const withdrawalAmount = new anchor.BN(0.1 * anchor.web3.LAMPORTS_PER_SOL); // Withdraw 0.1 SOL

            await program.methods
                .withdraw(withdrawalAmount)
                .accounts({
                    campaign: campaignPda,
                    user: admin.publicKey,
                })
                .signers([admin])
                .rpc({ commitment: "confirmed" });

            const campaignData = await program.account.campaign.fetch(campaignPda);
            assert.strictEqual(campaignData.amountWithdrawn.toString(), withdrawalAmount.toString());
        });

        it("Non-admin cannot withdraw funds", async () => {
            const withdrawalAmount = new anchor.BN(0.1 * anchor.web3.LAMPORTS_PER_SOL);

            let shouldFail = "This should fail";
            try {
                await program.methods
                    .withdraw(withdrawalAmount)
                    .accounts({
                        campaign: campaignPda,
                        user: donor.publicKey,
                    })
                    .signers([donor])
                    .rpc({ commitment: "confirmed" });
            } catch (error: any) {
                shouldFail = "Failed";
                assert.isTrue(error.message.includes("IncorrectProgramId"), "Expected IncorrectProgramId error");
            }
            assert.strictEqual(shouldFail, "Failed");
        });
    });

    describe("Edge Cases", async () => {
        it("Admin cannot withdraw more than available funds", async () => {
            const excessiveWithdrawalAmount = new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL);

            let shouldFail = "This should fail";
            try {
                await program.methods
                    .withdraw(excessiveWithdrawalAmount)
                    .accounts({
                        campaign: campaignPda,
                        user: admin.publicKey,
                    })
                    .signers([admin])
                    .rpc({ commitment: "confirmed" });
            } catch (error: any) {
                shouldFail = "Failed";
                assert.isTrue(error.message.includes("InsufficientFunds"), "Expected InsufficientFunds error");
            }
            assert.strictEqual(shouldFail, "Failed");
        });
    });
});

// Utility Functions

async function airdrop(connection: any, address: PublicKey, amount: number) {
    const lamports = amount * anchor.web3.LAMPORTS_PER_SOL; // Convert SOL to lamports
    await connection.confirmTransaction(
        await connection.requestAirdrop(address, lamports),
        "confirmed"
    );
}

function getCampaignAddress(admin: PublicKey, programID: PublicKey) {
    return PublicKey.findProgramAddressSync(
        [anchor.utils.bytes.utf8.encode(CAMPAIGNING_SEED), admin.toBuffer()],
        programID
    );
}

async function checkCampaign(
    program: Program<Campaigning>,
    campaign: PublicKey,
    admin: PublicKey,
    details: any,
    amountDonated: number,
    amountWithdrawn: number,
    bump: number
) {
    const campaignData = await program.account.campaign.fetch(campaign);

    assert.strictEqual(campaignData.admin.toString(), admin.toString());
    assert.strictEqual(campaignData.name, details.name);
    assert.strictEqual(campaignData.description, details.description);
    assert.strictEqual(campaignData.targetAmount.toString(), details.targetAmount.toString());
    assert.strictEqual(campaignData.projectUrl, details.projectUrl);
    assert.strictEqual(campaignData.progressUpdateUrl, details.progressUpdateUrl);
    assert.strictEqual(campaignData.projectImageUrl, details.projectImageUrl);
    assert.strictEqual(campaignData.category, details.category);
    assert.strictEqual(campaignData.amountDonated.toString(), amountDonated.toString());
    assert.strictEqual(campaignData.amountWithdrawn.toString(), amountWithdrawn.toString());
}
