import { Connection, clusterApiUrl, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import "dotenv/config"
import {
  getKeypairFromFile,
  airdropIfRequired,
  getKeypairFromEnvironment,
  getExplorerLink
} from "@solana-developers/helpers";
import {
  Metaplex,
  keypairIdentity,
  irysStorage,
  toMetaplexFile,
} from "@metaplex-foundation/js";
import { readFileSync } from "fs";

// create a new connection to the cluster's API
const connection = new Connection(clusterApiUrl("devnet"));
 
// initialize a keypair for the user
const user = getKeypairFromEnvironment("SECRET_KEY");//await getKeypairFromFile();
 
console.log("Loaded user:", user.publicKey.toBase58());

// metaplex set up
const metaplex = Metaplex.make(connection)
  .use(keypairIdentity(user))
  .use(
    irysStorage({
      address: "https://devnet.irys.xyz",
      providerUrl: "https://api.devnet.solana.com",
      timeout: 60000,
    }),
  );

  // Load the NFT using the mint address
const nftAddress: PublicKey = new PublicKey("6JYdyzK2uzNV9MZVXHz3pzfB2Xp2fLotPoYHxyFs7n8M");
const nft = await metaplex.nfts().findByMint({ mintAddress: nftAddress });
 
// example data for updating an existing NFT
const updatedNftData = {
  name: "Updated",
  symbol: "UPDATED",
  description: "Updated Description",
  sellerFeeBasisPoints: 100,
  imageFile: "success.png",
};

// Load the image file into Metaplex
const buffer = readFileSync(updatedNftData.imageFile);
const file = toMetaplexFile(buffer, updatedNftData.imageFile);
 
// Upload the new image and get image URI
const imageUri = await metaplex.storage().upload(file);
console.log("image uri:", imageUri);
 
// Upload new offchain metadata
const uploadMetadataOutput = await metaplex.nfts().uploadMetadata({
  name: updatedNftData.name,
  symbol: updatedNftData.symbol,
  description: updatedNftData.description,
  image: imageUri,
});
 
const updatedUri = uploadMetadataOutput.uri;
 
// update the NFT metadata
const { response } = await metaplex.nfts().update(
  {
    nftOrSft: nft,
    uri: updatedUri,
  },
  { commitment: "finalized" },
);
 
console.log(
  `NFT updated with new metadata URI: ${getExplorerLink(
    "transaction",
    response.signature,
    "devnet",
  )}`,
);
 
console.log("✅ Finished successfully!");