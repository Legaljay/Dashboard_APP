import { z } from "zod";

// Schema for form validation
const CompanySchema = z.object({
    name: z
      .string()
      .min(2, "Company name must be at least 2 characters")
      .max(100, "Company name must be less than 100 characters"),
    business_email: z.string().email("Please enter a valid email address"),
    website_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    country: z.string().min(1, "Please select a country"),
    category: z.string().min(1, "Please select a category"),
    otherCategory: z.string().optional().or(z.literal("")),
    description: z.string().min(1, "Please select your role"),
    otherDescription: z.string().optional().or(z.literal("")),
    team_size: z.string().min(1, "Please select a team size"),
    otherTeam_size: z.string().optional().or(z.literal("")),
    purpose_for_wano: z.string().optional().or(z.literal("")),
  }).refine(
    (data) => {
      if (data.category === "Other(Please Specify):") {
        return data.otherCategory && data.otherCategory.trim().length > 0;
      }
      return true;
    },
    {
      message: "Please specify your category",
      path: ["otherCategory"],
    }
  ).refine(
    (data) => {
      if (data.description === "Other(Please Specify):") {
        return data.otherDescription && data.otherDescription.trim().length > 0;
      }
      return true;
    },
    {
      message: "Please specify your role",
      path: ["otherDescription"],
    }
  ).refine(
    (data) => {
      if (data.team_size === "Other(Please Specify):") {
        return data.otherTeam_size && data.otherTeam_size.trim().length > 0;
      }
      return true;
    },
    {
      message: "Please specify your team size",
      path: ["otherTeam_size"],
    }
  );
  
  export type FormData = z.infer<typeof CompanySchema>;

  export { CompanySchema };