import type { ScryptParams } from "scrypt-kdf";

export const SCRYPT_PARAMS: ScryptParams = { logN: 16, r: 8, p: 1 };
export const SECONDS_IN_A_WEEK = 60 * 60 * 24 * 7;
export const SESSION_TOKEN_NAME = "SESSION_TOKEN";
