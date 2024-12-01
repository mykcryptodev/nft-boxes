import { createPublicClient, http, verifyMessage } from 'viem';
import { optimism } from 'viem/chains';

// ID Registry Contract
const ID_REGISTRY_ADDRESS = '0x00000000Fc6c5F01Fc30151999387Bb99A9f489b';
const ID_REGISTRY_ABI = [
  {
    "inputs": [{"internalType": "uint256", "name": "fid", "type": "uint256"}],
    "name": "custodyOf",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

async function main() {
  // Get the values from your farcaster.json.ts
  const {
    header: encodedHeader,
    payload: encodedPayload,
    signature: encodedSignature,
  } = {
    header: "eyJmaWQiOjIxNzI0OCwidHlwZSI6ImN1c3RvZHkiLCJzaWduZXIiOiIweGViYTc4NzE3YjZmMDU5Y2ZlMGI3NWU3NWMyZWQ0YmI3Y2E2NTE1NGYifQ",
    payload: "eyJkb21haW4iOiJzdXBlcmJvd2wtb25jaGFpbi52ZXJjZWwuYXBwIn0",
    signature: "MHg5YWFhMzM1ZmUxM2FhYjdjYmU3ODg4NzE2NTY5NDNiNGU2MTljYWNkZmM1MGEyYjZmMWI4MzM0NWU3ZDBmYmM2MTMwYTc5NGZmNzY3Y2ZiOTQ1NTVhYWQzZjJhMzU0ZDcxMjE1Yjk5YjI4ZTY2Y2UxMGY3NjEwOTAyYWQ4YmRiMzFj"
  };

  console.log('Step 1: Decoding and validating header...');
  // Decode and validate header
  const headerData = JSON.parse(Buffer.from(encodedHeader, 'base64url').toString('utf-8'));
  console.log('Header data:', headerData);

  const { fid, type, signer } = headerData;

  if (type !== 'custody') {
    throw new Error("Invalid type - must be 'custody'");
  }

  console.log('Step 2: Decoding and validating payload...');
  // Decode and validate payload
  const payloadData = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf-8'));
  console.log('Payload data:', payloadData);

  console.log('\nStep 3: Verifying signature...');
  // Decode signature from base64url
  const signature = Buffer.from(encodedSignature, 'base64url').toString();
  
  // Verify the signature
  const valid = await verifyMessage({
    address: signer as `0x${string}`,
    message: `${encodedHeader}.${encodedPayload}`,
    signature: signature as `0x${string}`,
  });

  if (!valid) {
    throw new Error("Invalid signature");
  }
  console.log('✅ Signature is valid');

  console.log('\nStep 4: Verifying custody address from ID Registry...');
  // Create a client to interact with the ID Registry contract
  const client = createPublicClient({
    chain: optimism,
    transport: http(),
  });

  // Query the ID Registry contract
  const resolvedCustodyAddress = await client.readContract({
    address: ID_REGISTRY_ADDRESS,
    abi: ID_REGISTRY_ABI,
    functionName: 'custodyOf',
    args: [BigInt(fid)],
  });

  console.log('Resolved custody address:', resolvedCustodyAddress);
  console.log('Signer from header:', signer);

  if (resolvedCustodyAddress.toLowerCase() !== signer.toLowerCase()) {
    throw new Error("Wrong custody address");
  }
  console.log('✅ Custody address matches');

  console.log('\n✅ All validations passed successfully!');
}

main().catch((error) => {
  console.error('\n❌ Validation failed:', error.message);
  process.exit(1);
}); 