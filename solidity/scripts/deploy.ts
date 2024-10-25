import hre from "hardhat";

// Colour codes for terminal prints
const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const FUNCTIONS_ROUTER = {
  "84532": "0xf9B8fc078197181C841c296C876945aaa425B278",
}

const VRF_WRAPPER = {
  "84532": "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed",
}
interface ContractToVerify {
  name: string;
  address: string;
  constructorArguments: unknown[];
}
const contractsToVerify: ContractToVerify[] = [];

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const { chainId } = await deployer.provider.getNetwork();

  const boxes = await hre.ethers.deployContract("Boxes");
  await boxes.waitForDeployment();
  const boxesAddress = await boxes.getAddress();
  contractsToVerify.push({
    name: "Boxes",
    address: boxesAddress,
    constructorArguments: [],
  });
  console.log("Boxes deployed to: " + `${GREEN}${boxesAddress}${RESET}\n`);

  console.log({
    functionsRouter: FUNCTIONS_ROUTER[chainId.toString() as keyof typeof FUNCTIONS_ROUTER],
    deployer: await deployer.getAddress(),
  });
  const gameScoreOracleArgs = [
    FUNCTIONS_ROUTER[chainId.toString() as keyof typeof FUNCTIONS_ROUTER]
  ];
  const gameScoreOracle = await hre.ethers.deployContract("GameScoreOracle", gameScoreOracleArgs);
  await gameScoreOracle.waitForDeployment();
  const gameScoreOracleAddress = await gameScoreOracle.getAddress();
  contractsToVerify.push({
    name: "gameScoreOracle",
    address: gameScoreOracleAddress,
    constructorArguments: gameScoreOracleArgs,
  });
  console.log("gameScoreOracle deployed to: " + `${GREEN}${gameScoreOracleAddress}${RESET}\n`);

  const contestsArgs = [
    await deployer.getAddress(),
    boxesAddress,
    gameScoreOracleAddress,
    VRF_WRAPPER[chainId.toString() as keyof typeof VRF_WRAPPER],
  ];
  const contests = await hre.ethers.deployContract("Contests", contestsArgs);

  await contests.waitForDeployment();
  const contestsAddress = await contests.getAddress();
  contractsToVerify.push({
    name: "Contests",
    address: contestsAddress,
    constructorArguments: contestsArgs,
  });

  // set the contests in the boxes contract
  await boxes.setContests(contestsAddress);

  console.log("Contests deployed to: " + `${GREEN}${contestsAddress}${RESET}\n`);

  console.log(
    "Waiting 30 seconds before beginning the contract verification to allow the block explorer to index the contract...\n",
  );
  await delay(30000); // Wait for 30 seconds before verifying the contracts

  for (const contract of contractsToVerify) {
    console.log(`Verifying ${contract.name} at address: ${GREEN}${contract.address}${RESET}`);
    const { address, constructorArguments } = contract;
    await hre.run("verify:verify", {
      address, 
      constructorArguments
    });
    console.log(`Successfully verified ${contract.name} at address: ${GREEN}${contract.address}${RESET}\n`);
  }
  console.table(contractsToVerify.reduce((acc: Record<string, string>, contract) => {
    acc[contract.name] = contract.address;
    return acc;
  }, {}));
  // Uncomment if you want to enable the `tenderly` extension
  // await hre.tenderly.verify({
  //   name: "Greeter",
  //   address: contractAddress,
  // });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
