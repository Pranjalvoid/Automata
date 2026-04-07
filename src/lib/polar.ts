import { Polar } from "@polar-sh/sdk";

// const accessToken =
//   process.env.POLAR_ACCESS_TOKEN ?? process.env.POLAR_SUCCESS_TOKEN;

export const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: "sandbox",
});
