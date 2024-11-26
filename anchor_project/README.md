# 📊 campaign Anchor Program

This project is a Solana smart contract (program) built with Anchor that enables the creation of campaigns, donation to campaigns, and withdrawal of funds by campaign admins. It provides the following functionality:

- **🎯 Create a campaign**: Create a campaign with a specified target amount and project details.
- **💸 Donate to a campaign**: Donate funds to a campaign.
- **🏦 Withdraw funds**: campaign admins can withdraw funds donated to their campaign.
- **🔍 View campaign**: Get campaign details.

## 📋 Prerequisites

Ensure you have the following installed:

1. **🔧 Solana CLI**: [Install Solana CLI](https://docs.solana.com/cli/install-solana-cli)
2. **🛠 Anchor CLI**: [Install Anchor](https://project-serum.github.io/anchor/getting-started/installation.html)
3. **🦀 Rust**: [Install Rust](https://www.rust-lang.org/tools/install)
4. **🌐 Node.js & npm** (for interacting with the program via JavaScript/TypeScript, optional): [Install Node.js](https://nodejs.org/)

## ⚙️ Setting Up the Project

First, install all necessary dependencies using;

```bash
anchor install
```

Next, configure Solana to use the correct network (the default is devnet):

```bash
solana config set --url devnet
```

Now, generate a new wallet using Solana CLI:

```bash
solana-keygen new --outfile ~/my-wallet.json
solana config set --keypair ~/my-wallet.json
```

Make sure your wallet has enough SOL for transaction fees. You can get some SOL from the Solana faucet if you're using devnet:

```bash
solana airdrop 2
```
With your environment configured and wallet set up, build the project:

```bash
anchor build
```
Now you're ready to deploy the program to Solana. To deploy, run:

```bash
anchor deploy
```

### 🧾 Verify the Smart Contract Deployment on Solana Explorer

Once you have deployed the smart contract using `anchor deploy`, you can verify the deployment on the Solana Explorer. Follow these steps to ensure that the smart contract is correctly deployed on DevNET.

1. **📄 Get the Transaction Signature:**
   After running the `anchor deploy` command, you will receive a transaction signature in the console output. Copy this transaction signature.

2. **🌐 Open Solana Explorer:**
   Navigate to [Solana Explorer](https://explorer.solana.com/).

3. **🌍 Select the DevNET:**
   Make sure to select `DevNET` from the network options at the top right of the page.

4. **🔎 Search for the Transaction:**
   Paste the transaction signature into the search bar and press `Enter` or click the search icon.

5. **✅ Verify the Transaction:**
   The transaction details should appear, verifying that your smart contract has been deployed successfully. Check the status and ensure there are no errors.

Here is a visual representation of the steps described above:

![Verify Smart Contract](./campaigning/images/solana_explorer.png)

## 🛠 Running Tests on Localnet

To test your smart contracts locally:

1. Update the `Anchor.toml` file:
    - Change `[programs.devnet]` to `[programs.localnet]`.
    - Set the cluster to:
      ```toml
      cluster = "localnet"
      ```
    - Update the wallet path:
      ```toml
      wallet = "./keypairs/YOUR_KEYPAIR.JSON"
      ```

2. Run the test command:
   ```bash
   anchor test
   ```

## ❓ Help

For common issues, consider the following:

- Ensure your keypair file path in `Anchor.toml` is correct.
- Verify your Solana CLI is authenticated using:
  ```bash
  solana config get
  ```
- Ensure Anchor is installed globally and up-to-date:
  ```bash
  anchor --version
  ```

## 👥 Authors

Contributors:
- Shawn Rawjee - [GitHub Profile](https://github.com/Shawnie6)
