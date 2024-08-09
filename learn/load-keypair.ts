import "dotenv/config"
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import bs58 from 'bs58';

const keypair = getKeypairFromEnvironment("SECRET_KEY");

console.log(
  `✅ Finished! We've loaded our secret key securely, using an env file!`
);

console.log(`The public key is: `, keypair.publicKey.toBase58());
console.log(`The secret key is: `, keypair.secretKey);


const bytes = Uint8Array.from(keypair.secretKey);
const address = bs58.encode(bytes);
console.log(address);