import { z } from "zod";

// Define the schema
const ScheduledFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(8, "Description must be at least 8 characters"),
    how_it_works: z.string().min(8, "Instructions must be at least 8 characters"),
    support_channel: z
      .array(
        z.object({
          support_channel: z.string(),
          website: z.string().min(1, "url is required"),
        })
      )
      .min(1, "At least one support channel is required")
      .max(3, "Maximum of 3 support channels allowed"),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    tags: z
      .array(
        z.object({
          applicationPluginId: z.string(),
          slug: z.string(),
        })
      )
      .optional(),
  });

  export { ScheduledFormSchema };