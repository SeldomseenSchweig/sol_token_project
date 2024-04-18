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

function MintToken() {
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
    } catch (error) {
      console.log("somtething went wron with create token");
      alert(error);
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
    } catch (error) {
      console.log("something went wrong with create mint");
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
    } catch (error) {
      console.log("something went wrong minting token");
    }
  }

  async function checkBalance() {
    const mintInfo = await getMint(connection, mint);
    console.log(mintInfo.supply);

    const tokenAccountInfo = await getAccount(
      connection,
      fromTokenAccount.address
    );
    console.log(tokenAccountInfo.amount);
  }

  async function sendToken() {
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
  }
  return (
    <div>
      Mint Token Section
      <div>
        <button onClick={createToken}>Create Token</button>
        <button onClick={mintToken}>Mint Token</button>
        <button onClick={checkBalance}>Check Balance</button>
        <button onClick={sendToken}>Send Token</button>
      </div>
    </div>
  );
}

export default MintToken;
