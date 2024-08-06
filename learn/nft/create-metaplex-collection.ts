import { Connection, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
import "dotenv/config"
import {
  getKeypairFromFile,
  airdropIfRequired,
  getKeypairFromEnvironment
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
 
await airdropIfRequired(
  connection,
  user.publicKey,
  1 * LAMPORTS_PER_SOL,
  0.1 * LAMPORTS_PER_SOL,
);
 
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

  const collectionNftData = {
    name: "TestCollectionNFT",
    symbol: "TEST",
    description: "Test Description Collection",
    sellerFeeBasisPoints: 100,
    imageFile: ".\\nft\\success.png",
    isCollection: true,
    collectionAuthority: user,
  };

  // Load file into Metaplex
const buffer = readFileSync(collectionNftData.imageFile);
const file = toMetaplexFile(buffer, collectionNftData.imageFile);
 
// upload image and get image uri
const imageUri = await metaplex.storage().upload(file);
console.log("image uri:", imageUri);
 
// upload metadata and get metadata uri (off chain metadata)
const uploadMetadataOutput = await metaplex.nfts().uploadMetadata({
  name: collectionNftData.name,
  symbol: collectionNftData.symbol,
  description: collectionNftData.description,
  image: imageUri,
});
 
const collectionUri = uploadMetadataOutput.uri;
console.log("Collection offchain metadata URI:", collectionUri);

// create a collection NFT using the URI from the metadata
const createNftOutput = await metaplex.nfts().create(
  {
    uri: collectionUri,
    name: collectionNftData.name,
    sellerFeeBasisPoints: collectionNftData.sellerFeeBasisPoints,
    symbol: collectionNftData.symbol,
    isCollection: true,
  },
  { commitment: "finalized" }
);
 
const collectionNft = createNftOutput.nft;
 
console.log(
  `Collection NFT: https://explorer.solana.com/address/${collectionNft.address.toString()}?cluster=devnet`
);
 
console.log(`Collection NFT address is`, collectionNft.address.toString());
 
console.log("✅ Finished successfully!");

/*

Loaded user: DzBHG61yTGimgSk9t9yfc4JmJLbCLVLTzq6VaYyKS3Fo
image uri: https://arweave.net/FJeGoFm1Vpl4luRAXNVWOO8HY2Jo9aAiXx0h4NwiSEs
Collection offchain metadata URI: https://arweave.net/AUudMjYV6rOY_W6FEMM-oz9v9lNtsmKFTxP0pVx36VI
Collection NFT: https://explorer.solana.com/address/8xY873azdKPLKZSrDvKPamCa8ZovRz6iQaeWcMW7ytgu?cluster=devnet
Collection NFT address is 8xY873azdKPLKZSrDvKPamCa8ZovRz6iQaeWcMW7ytgu

*/