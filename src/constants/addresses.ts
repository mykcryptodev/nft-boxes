import { type Address } from "viem";
import { base, baseSepolia } from "viem/chains";
type ContractAddressT = Record<number, Address>;

export const CONTEST_CONTRACT: ContractAddressT = {
    [baseSepolia.id]: "0x18541F8F56D80e3875Bdcb7e1eE8566a64aBC48C",
    [base.id]: "0x0000000000000000000000000000000000000000",
}

export const CONTEST_READER_CONTRACT: ContractAddressT = {
    [baseSepolia.id]: "0x534Dc0b2Ac842D411d1e15C6B794c1ECEa9170C7",
    [base.id]: "0x0000000000000000000000000000000000000000",
}