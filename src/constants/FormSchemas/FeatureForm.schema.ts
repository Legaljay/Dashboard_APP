import { z } from "zod";

// Support channel schema
const SupportChannelSchema = z.object({
    support_channel: z.enum([
      "Email Address",
      "Instagram Handle",
      "App Store (IOS)",
      "Android PlayStore",
      "Twitter Handle",
      "WhatsApp Link",
      "Phone Number",
      "Website"
    ]),
    value: z.string().max(255, "Input too long").optional()
  })
  .refine(
    (data) => {
      const { support_channel, value } = data;

      if (!value) return true; // Allow empty `value`

      switch (support_channel) {
        case "Email Address":
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        case "Instagram Handle":
          return /^@[a-zA-Z0-9._]{1,30}$/.test(value); // Starts with @ and max 30 chars
        case "App Store (IOS)":
        case "Android PlayStore":
          return /^https?:\/\/[^\s]+$/.test(value); // Valid URL
        case "Twitter Handle":
          return /^@[a-zA-Z0-9_]{1,15}$/.test(value); // Starts with @ and max 15 chars
        case "WhatsApp Link":
          return /^https:\/\/wa\.me\/\d{7,15}$/.test(value); // WhatsApp link
        case "Phone Number":
          return /^\+?\d{7,15}$/.test(value); // International phone number
        case "Website":
          return /^https?:\/\/[^\s]+$/.test(value); // Valid URL
        default:
          return true;
      }
    },
    {
      message: "Invalid value for the selected support channel.",
      path: ["value"],
    }
  );

// Feature form schema with dynamic support channels
const FeatureFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(8, "Description must be at least 8 characters"),
    how_it_works: z.string().min(8, "Instructions must be at least 8 characters"),
    support_channels: z
      .array(SupportChannelSchema)
      .min(1, "At least one support channel is required"),
    tags: z
      .array(
        z.object({
          applicationPluginId: z.string(),
          slug: z.string(),
        })
      )
      .optional(),
  });

export { SupportChannelSchema, FeatureFormSchema };
