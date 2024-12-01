import { type Address } from "viem";
import { base, baseSepolia } from "viem/chains";
type ContractAddressT = Record<number, Address>;

export const CONTEST_CONTRACT: ContractAddressT = {
    [baseSepolia.id]: "0xc7F418F3F46186C254e4C2cA12Ba7DCeC640F746",
    [base.id]: "0x6C7805f916bf30a9e7F698621e4EC8B554E4d0a9",
}

export const CONTEST_READER_CONTRACT: ContractAddressT = {
    [baseSepolia.id]: "0x7Ced64f361b2b646dbF629b04854293A3E554956",
    [base.id]: "0x1240EEb55bC00220D8acbCeC771F703AA2625Ed3",
}