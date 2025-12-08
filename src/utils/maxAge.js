import dotenv from 'dotenv';
dotenv.config();
// COOKIE-PARSER EXPIRATION
export const EXPIRES = Number(process.env.EXPIRES_IN);
export const REFRESH_EXPIRES = Number(process.env.REFRESH_EXPIRES);
export const RESET = Number(process.env.PASS_EXPIREs);