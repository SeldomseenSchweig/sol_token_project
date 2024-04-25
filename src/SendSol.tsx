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
  getAssociatedTokenAddress,
  NATIVE_MINT,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";

window.Buffer = window.Buffer || require("buffer").Buffer;

function SendSol() {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const fromWallet = Keypair.generate();
  let mint: PublicKey;
  let fromTokenAccount: Account;
  let associatedTokenAccount: PublicKey;
  async function wrapSol() {
    try {
      const airdropSignature = await connection.requestAirdrop(
        fromWallet.publicKey,
        2 * LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(airdropSignature);
      associatedTokenAccount = await getAssociatedTokenAddress(
        NATIVE_MINT,
        fromWallet.publicKey
      );
      console.log(
        "Associated public account for creating wrapped sol ",
        associatedTokenAccount.toBase58()
      );
      const ataTransaction = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          fromWallet.publicKey,
          associatedTokenAccount,
          fromWallet.publicKey,
          NATIVE_MINT
        )
      );
    } catch (error: any) {
      console.log("something wentwrong:", error.message);
    }
  }
  return (
    <div>
      Send Sol Section
      <div>
        <button onClick={wrapSol}>Wrap SOL</button>
        <button onClick={unwrapSol}>Unwrap SOL</button>
        <button onClick={sendSol}>Send SOL</button>
      </div>
    </div>
  );
}

export default SendSol;
