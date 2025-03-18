import { z } from "zod";

export const BannerSchema = z.object({
  title: z.string({ required_error: "Title is required." }),
  image: z.string({ required_error: "Image is required." }),
  link: z.string({ required_error: "Link is required." }),
  type: z.string({ required_error: "Type is required." }),
  description: z.string().optional(),
});

export type BannerSchemaType = z.infer<typeof BannerSchema>;
