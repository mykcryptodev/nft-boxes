import { z } from "zod";

import { env } from "~/env";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const safetyRouter = createTRPCRouter({
  checkForImageSafety: publicProcedure
    .input(z.object({ base64ImageString: z.string() }))
    .mutation(async ({ input }) => {
      const { base64ImageString } = input;
      const base64Data = base64ImageString.replace(/^data:image\/\w+;base64,/, "");
      const url = `https://vision.googleapis.com/v1/images:annotate?key=${env.GOOGLE_VISION_API_KEY}`;
      const requestBody = {
        requests: [
          {
            image: {
              content: base64Data
            },
            features: [
              {
                type: "SAFE_SEARCH_DETECTION"
              },
            ],
          },
        ],
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          console.log({ responseBody: response.body, text: response.text(), status: response.statusText });
          throw new Error(`Error: ${response.statusText}`);
        }

        interface SafeSearchAnnotation {
          adult: string;
          violence: string;
          medical: string;
          racy: string;
        }

        interface SafetyCheckResponse {
          responses: {
            safeSearchAnnotation?: SafeSearchAnnotation;
          }[];
        }

        const safetyCheckResult: SafetyCheckResponse = await response.json() as SafetyCheckResponse;
        const safeSearchAnnotation = safetyCheckResult.responses[0]?.safeSearchAnnotation;

        if (!safeSearchAnnotation) {
          throw new Error("SafeSearchAnnotation is missing in the response");
        }

        console.log({ safeSearchAnnotation });
        const isSafeForWork = safeSearchAnnotation.adult !== "VERY_LIKELY";
        const isSafeForViolence = safeSearchAnnotation.violence !== "VERY_LIKELY";
        const isSafeForMedical = safeSearchAnnotation.medical !== "VERY_LIKELY";

        return isSafeForWork && isSafeForViolence && isSafeForMedical;

      } catch (error) {
        console.error("Error posting image for safety check:", error);
        throw error;
      }
    }),
});