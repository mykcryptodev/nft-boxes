import daisyui from "daisyui";
import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  theme: {},
  daisyui: {
    themes: ["light", "dark"],
  },
  plugins: [daisyui],
} satisfies Config;
