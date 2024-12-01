import { createWalletClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { mnemonicToAccount } from 'viem/accounts';

// Replace with your seed phrase
const MNEMONIC = ''; // 12 or 24 words separated by spaces
const DOMAIN = 'superbowl-onchain-git-frames-v2-mykcryptodevs-projects.vercel.app';
const FID = 217248;
const CUSTODY_ADDRESS = '0xeba78717b6f059cfe0b75e75c2ed4bb7ca65154f';

async function main() {
  // Create the header object
  const header = {
    fid: FID,
    type: "custody",
    key: CUSTODY_ADDRESS,
  };

  // Create the payload object
  const payload = {
    domain: DOMAIN,
  };

  // Convert to base64
  const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64');
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64');

  // Create the message to sign
  const messageToSign = `${headerB64}.${payloadB64}`;

  // Create account from mnemonic
  const account = mnemonicToAccount(MNEMONIC);
  
  console.log('Derived address:', account.address);
  console.log('Make sure this matches your custody address!');
  
  const client = createWalletClient({
    account,
    chain: mainnet,
    transport: http()
  });

  // Sign the message
  const signature = await client.signMessage({
    message: messageToSign,
  });

  console.log('\nCopy these values to your farcaster.json.ts file:');
  console.log('\nHeader:');
  console.log(headerB64);
  console.log('\nPayload:');
  console.log(payloadB64);
  console.log('\nSignature:');
  console.log(signature);
}

main().catch(console.error); 