import { Keypair } from "@solana/web3.js";

const keypair = Keypair.generate();

console.log(`The public key is: `, keypair.publicKey.toBase58());
console.log(`The secret key is: `, keypair.secretKey);

// DzBHG61yTGimgSk9t9yfc4JmJLbCLVLTzq6VaYyKS3Fo

console.log(`✅ Generated keypair!`)