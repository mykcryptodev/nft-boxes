import { type Address } from "viem";
import { base, baseSepolia } from "viem/chains";
type ContractAddressT = Record<number, Address>;

export const CONTEST_CONTRACT: ContractAddressT = {
    [baseSepolia.id]: "0x2865EbbC977D43DC79e29fBe52153A6F3EBF1502",
    [base.id]: "0x0000000000000000000000000000000000000000",
}