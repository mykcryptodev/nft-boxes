import daisyui from "daisyui";
import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  theme: {},
  daisyui: {
    themes: ["cupcake"],
  },
  plugins: [daisyui],
} satisfies Config;
