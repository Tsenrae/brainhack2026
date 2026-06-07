import Groq from 'groq-sdk';

export const groqClient = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

export const isGroqEnabled = groqClient !== null;

// llama-3.3-70b-versatile: best quality, 6k TPM free
// llama-3.1-8b-instant: faster, 30k TPM free — swap if you hit rate limits
export const GROQ_MODEL = 'llama-3.3-70b-versatile';
