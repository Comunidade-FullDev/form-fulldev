import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  env: {
    NEXT_PUBLIC_API_FORM_URL: process.env.NEXT_PUBLIC_API_FORM_URL,
    NEXT_PUBLIC_API_GENERATE_QUESTIONS_URL: process.env.NEXT_PUBLIC_API_GENERATE_QUESTIONS_URL,
    NEXT_API_KEY_GENERATE_QUESTIONS: process.env.NEXT_API_KEY_GENERATE_QUESTIONS,
  },
};

export default nextConfig;
