import React from "react";
import "./App.css";
import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  clusterApiUrl,
} from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  Account,
  createSetAuthorityInstruction,
  AuthorityType,
} from "@solana/spl-token";

window.Buffer = window.Buffer || require("buffer").Buffer;

function MintNft() {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const fromWallet = Keypair.generate();
  let mint: PublicKey;
  let fromTokenAccount: Account;

  async function createNFT() {
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
        0 // only allow whole token
      );
      console.log(`create NFT: ${mint.toBase58()} `);

      fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        fromWallet.publicKey
      );
      console.log(`create NFT account: ${fromTokenAccount.address.toBase58()}`);
    } catch (error: any) {
      console.log("something went wrong with create mint" + error.message);
    }
  }
  async function mintNft() {
    try {
      const signature = await mintTo(
        connection,
        fromWallet,
        mint,
        fromTokenAccount.address,
        fromWallet.publicKey,
        1 // there can only be one nft
      );
      console.log(`Mint signature: ${signature}`);
    } catch (error: any) {
      console.log("something went wrong minting token" + error);
    }
  }

  async function lockNft() {
    try {
      let transaction = new Transaction().add(
        createSetAuthorityInstruction(
          mint,
          fromWallet.publicKey,
          AuthorityType.MintTokens,
          null
        )
      );

      // send transaction

      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [fromWallet]
      );
      console.log("lock signature", signature);
    } catch (error: any) {
      console.log(`There was an error in lockNFT: ${error.message}`);
    }
  }

  return (
    <div>
      Mint NFT Section
      <div>
        <button onClick={createNFT}>Create NFT</button>
        <button onClick={mintNft}>Mint NFT</button>
        <button onClick={lockNft}>Lock NFT</button>
      </div>
    </div>
  );
}

export default MintNft;
