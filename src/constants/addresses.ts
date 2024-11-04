import { type Address } from "viem";
import { base, baseSepolia } from "viem/chains";
type ContractAddressT = Record<number, Address>;

export const CONTEST_CONTRACT: ContractAddressT = {
    [baseSepolia.id]: "0xb9647d7982cEfb104D332Ba818b8971d76E7fA1F",
    [base.id]: "0x0000000000000000000000000000000000000000",
}