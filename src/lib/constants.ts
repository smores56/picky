import type { ScryptParams } from "scrypt-kdf";

export const SCRYPT_PARAMS: ScryptParams = { logN: 16, r: 8, p: 1 };
export const SECONDS_IN_A_WEEK = 60 * 60 * 24 * 7;
export const LOGIN_TOKEN_NAME = "LOGIN_TOKEN";
