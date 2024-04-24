import React from "react";
import "./App.css";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
  Account,
  getMint,
  getAccount,
} from "@solana/spl-token";

window.Buffer = window.Buffer || require("buffer").Buffer;

function MintNft() {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const fromWallet = Keypair.generate();
  let mint: PublicKey;
  let fromTokenAccount: Account;
  const toWallet = new PublicKey(
    "Cx22XfUoXsn3X3A5sJbAiNAQnJG455rA8gRDrGkJ6MUG"
  );

  async function createToken() {
    // pubkey(fromWallet);
    try {
      const fromAirdropSignature = await connection.requestAirdrop(
        fromWallet.publicKey,
        LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(fromAirdropSignature);
    } catch (error: any) {
      console.log(`Something went wrong with create token: ${error.message}`);
    }

    // create new token mint
    try {
      mint = await createMint(
        connection,
        fromWallet,
        fromWallet.publicKey,
        null,
        9
      );
      console.log(`create token: ${mint.toBase58()} `);

      fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        fromWallet.publicKey
      );
      console.log(
        `create token account: ${fromTokenAccount.address.toBase58()}`
      );
    } catch (error: any) {
      console.log("something went wrong with create mint" + error.message);
    }
  }
  async function mintToken() {
    try {
      const signature = await mintTo(
        connection,
        fromWallet,
        mint,
        fromTokenAccount.address,
        fromWallet.publicKey,
        10000000000
      );
      console.log(`Mint signature: ${signature}`);
    } catch (error: any) {
      console.log("something went wrong minting token" + error.message);
    }
  }

  async function checkBalance() {
    try {
      const mintInfo = await getMint(connection, mint);
      console.log(mintInfo.supply);

      const tokenAccountInfo = await getAccount(
        connection,
        fromTokenAccount.address
      );
      console.log(tokenAccountInfo.amount);
    } catch (error: any) {
      console.log(`error checking balance: ${error.message}`);
    }
  }

  async function sendToken() {
    try {
      const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        toWallet
      );
      console.log(`To Account ${toTokenAccount.address}`);
      const signature = await transfer(
        connection,
        fromWallet,
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet.publicKey,
        1000000000
      );
      console.log(`finished transfer to ${signature}`);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      Mint NFT Section
      <div>
        <button onClick={createToken}>Create NFT</button>
        <button onClick={mintToken}>Mint NFT</button>
        <button onClick={checkBalance}>Lock NFT</button>
      </div>
    </div>
  );
}

export default MintNft;
