import { type Address } from "viem";
import { base, baseSepolia } from "viem/chains";
type ContractAddressT = Record<number, Address>;

export const CONTEST_CONTRACT: ContractAddressT = {
    [baseSepolia.id]: "0xc7F418F3F46186C254e4C2cA12Ba7DCeC640F746",
    [base.id]: "0x0000000000000000000000000000000000000000",
}

export const CONTEST_READER_CONTRACT: ContractAddressT = {
    [baseSepolia.id]: "0x7Ced64f361b2b646dbF629b04854293A3E554956",
    [base.id]: "0x0000000000000000000000000000000000000000",
}