import "dotenv/config";
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import {
  approve,
  getOrCreateAssociatedTokenAccount,
  revoke,
} from "@solana/spl-token";
 
const connection = new Connection(clusterApiUrl("devnet"));
 
const user = getKeypairFromEnvironment("SECRET_KEY");
 
console.log(
  `🔑 Loaded our keypair securely, using an env file! Our public key is: ${user.publicKey.toBase58()}`,
);
 
// Add the delegate public key here.
const delegate = new PublicKey("9aRbQN5Gpj31RkrUyGYXoWsDeNMnznPpzozor9RgtpRP");
 
// Substitute in your token mint account
const tokenMintAccount = new PublicKey("2Y7pKYnirWndY5nqGVdsvHnehcHnBKMFv2H7ptSuto1m");
 
// Get or create the source and destination token accounts to store this token
const sourceTokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  user,
  tokenMintAccount,
  user.publicKey,
);
 
// Our token has two decimal places
const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);
 
const approveTransactionSignature = await approve(
  connection,
  user,
  sourceTokenAccount.address,
  delegate,
  user.publicKey,
  50 * MINOR_UNITS_PER_MAJOR_UNITS,
);
 
console.log(
  `Approve Delegate Transaction: ${getExplorerLink(
    "transaction",
    approveTransactionSignature,
    "devnet",
  )}`,
);