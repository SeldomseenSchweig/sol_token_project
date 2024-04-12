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

  async function createToken() {
    pubkey(fromWallet);
    const fromAirdropSignature = await connection.requestAirdrop(
      fromWallet.publicKey,
      LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(fromAirdropSignature);

    // create new token mint

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
    console.log(`create token account: ${fromTokenAccount.address.toBase58()}`);
  }
  function pubkey(fromWallet: Keypair) {
    console.log(fromWallet.publicKey);
  }
  return (
    <div>
      Mint Token Section
      <div>
        <button onClick={createToken}>Create Token</button>
        <button>Mint Token</button>
        <button>Check Balance</button>
        <button>Send Token</button>
      </div>
    </div>
  );
}

export default MintToken;
