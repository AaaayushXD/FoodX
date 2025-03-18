import { CookieOptions } from "express";

export const options: CookieOptions = {
  httpOnly: true,
  secure: true,
};
