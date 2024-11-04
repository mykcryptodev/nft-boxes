import { type Hex } from "viem";
import { base, baseSepolia, type Chain } from "wagmi/chains";
export const APP_NAME = "Onchain NFL Boxes";
export const APP_DESCRIPTION = "Create an Onchain Game!";
export const APP_URL = "https://yourgame.com";
export const SUPPORTED_CHAINS: readonly [Chain, ...Chain[]] = [baseSepolia, base];
export const DEFAULT_CHAIN = SUPPORTED_CHAINS[0];
export const EAS_SCHEMA_ID = "0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9";

export const CHAINLINK_SUBSCRIPTION_ID: Record<number, bigint> = {
  [baseSepolia.id]: 208n,
}
export const CHAINLINK_JOB_ID: Record<number, Hex> = {
  [base.id]: "0x66756e2d626173652d6d61696e6e65742d310000000000000000000000000000",
  [baseSepolia.id]: "0x66756e2d626173652d7365706f6c69612d310000000000000000000000000000",
}
export const CHAINLINK_GAS_LIMIT = 300000;

export const EMOJI_TEAM_MAP: Record<string, string> = {
  ["49ers"]: "🌉",
  ["Bears"]: "🐻",
  ["Bengals"]: "🐅",
  ["Bills"]: "🦬",
  ["Broncos"]: "🐴",
  ["Browns"]: "🐶",
  ["Buccaneers"]: "🏴‍☠️",
  ["Cardinals"]: "🐓",
  ["Chargers"]: "⚡",
  ["Chiefs"]: "🪶",
  ["Colts"]: "🐎",
  ["Cowboys"]: "⭐️",
  ["Dolphins"]: "🐬",
  ["Eagles"]: "🦅",
  ["Falcons"]: "🐦",
  ["Giants"]: "🗽",
  ["Jaguars"]: "🐆",
  ["Jets"]: "🛩",
  ["Lions"]: "🦁",
  ["Packers"]: "🧀",
  ["Panthers"]: "🐈‍⬛",
  ["Patriots"]: "🇺🇸",
  ["Raiders"]: "☠️",
  ["Rams"]: "🐏",
  ["Ravens"]: "🐦‍⬛",
  ["Saints"]: "⚜️",
  ["Seahawks"]: "🦚",
  ["Steelers"]: "🔨",
  ["Texans"]: "🤠",
  ["Titans"]: "🎖️",
  ["Vikings"]: "🗡️",
  ["Washington"]: "🏛",
}