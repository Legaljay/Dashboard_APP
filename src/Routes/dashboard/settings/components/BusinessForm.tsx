import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectField } from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/redux-slice/hooks";
import {
  setBusiness,
  updateBusinessProfile,
} from "@/redux-slice/business/business.slice";
import { BusinessCreate } from "@/types";
import { useToast } from "@/contexts/ToastContext";
import { useLocation, useNavigate } from "react-router-dom";
import React from "react";
import { Button } from "@/components/ui/button/button";

// Schema for form validation
const schema = z
  .object({
    name: z
      .string()
      .min(2, "Company name must be at least 2 characters")
      .max(100, "Company name must be less than 100 characters"),
    website_url: z
      .string()
      .url("Please enter a valid URL")
      .optional()
      .or(z.literal("")),
    category: z.string().min(1, "Please select a category"),
    otherCategory: z.string().optional().or(z.literal("")),
    description: z.string().min(1, "Please select your role"),
    team_size: z.string().min(1, "Please select a team size"),
    otherTeam_size: z.string().optional().or(z.literal("")),
  })
  .refine(
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
  )
  .refine(
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

type FormData = z.infer<typeof schema>;

// options for the select field business category
const businessCategories = [
  { label: "Agri Tech", value: "Agri Tech" },
  { label: "Financial Service", value: "Financial Service" },
  { label: "SaaS", value: "SaaS" },
  { label: "Education", value: "Education" },
  { label: "Health Tech", value: "Health Tech" },
  { label: "Transportation", value: "Transportation" },
  { label: "Other(Please Specify):", value: "Other(Please Specify):" },
];

// options for the select field role
const roles = [
  { label: "CEO or Founder", value: "CEO or Founder" },
  { label: "Software Developer", value: "Software Developer" },
  { label: "IT Manager", value: "IT Manager" },
  { label: "Customer Support Manager", value: "Customer Support Manager" },
  { label: "Project Manager", value: "Project Manager" },
  { label: "Sales Manager", value: "Sales Manager" },
  { label: "Other(Please Specify):", value: "Other(Please Specify):" },
];

// options for the select field company size
const companySize = [
  { label: "1 - 10", value: "1 - 10" },
  { label: "10 - 100", value: "10 - 100" },
  { label: "100 - 500", value: "100 - 500" },
  { label: "500+", value: "500+" },
  { label: "Other(Please Specify):", value: "Other(Please Specify):" },
];

const OTHER_CATEGORY = "Other(Please Specify):";

const BusinessForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const business = useAppSelector((state) => state.business.activeBusiness);

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: business?.name || "",
      website_url: business?.website_url || "",
      category: business?.category || "",
      otherCategory: business?.category || "",
      description: business?.description || "",
      team_size: business?.team_size || "",
      otherTeam_size: business?.team_size || "",
    },
  });

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  const selectedCategory = watch("category");
  const selectedSize = watch("team_size");

  const onSubmit = async (data: FormData) => {
    const transformedData: Omit<
      BusinessCreate,
      "purpose_for_wano" | "business_email" | "country"
    > = {
      name: data.name,
      website_url: data.website_url || "",
      category:
        data.category === OTHER_CATEGORY ? data.otherCategory! : data.category,
      description: data.description,
      team_size:
        data.team_size === OTHER_CATEGORY
          ? data.otherTeam_size!
          : data.team_size,
    };

    try {
      const response = await dispatch(
        updateBusinessProfile(transformedData)
      ).unwrap();
      // Handle success
      if (response.status === true) {
        addToast("success", response.message);
        // Set business data in store
        // dispatch(setBusiness(response.data));
      }
    } catch (error) {
      // Handle error
      const errorMessage =
        error || (error as any)?.message || "An unexpected error occurred";
      addToast("error", errorMessage);
    }
  };

  return (
    <div className="flex gap-8 w-full py-[30px]">
      <div className="w-[350px]">
        <h2 className="text-sm text-BLACK-_100 dark:text-WHITE-_100 font-medium">
          Business Profile
        </h2>
        <p className="text-sm text-gray-500">
          Set a description and look for your agent while it interacts with your
          customers
        </p>
      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 w-[520px] mx-auto px-[50px] "
        >
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Business Name
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full rounded-lg text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
              placeholder="Enter your business name"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Business Website <span className="!text-xs">Optional</span>
            </label>
            <input
              type="text"
              {...register("website_url")}
              className="w-full rounded-lg text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
              placeholder="Enter your website URL"
            />
            {errors.website_url && (
              <p className="text-sm text-red-500">
                {errors.website_url.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <SelectField
              name="category"
              label="What Category does your business fall under"
              options={businessCategories}
              required
              className="text-gray-700"
            />
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>

          {selectedCategory === "Other(Please Specify):" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Please specify category
              </label>
              <input
                type="text"
                {...register("otherCategory")}
                className="w-full rounded-lg text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter your business category"
              />
              {selectedCategory && errors.otherCategory && (
                <p className="text-sm text-red-500">
                  {errors.otherCategory.message}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Your Role
            </label>
            <input
              type="text"
              {...register("description")}
              className="w-full rounded-lg text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
              placeholder="Enter your role"
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <SelectField
              name="team_size"
              label="Team Size"
              options={companySize}
              required
              className="text-gray-700"
            />
            {errors.team_size && (
              <p className="text-sm text-red-500">{errors.team_size.message}</p>
            )}
          </div>

          {selectedSize === "Other(Please Specify):" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Please specify team size
              </label>
              <input
                type="text"
                {...register("otherTeam_size")}
                className="w-full rounded-lg text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter your team size"
              />
              {errors.otherTeam_size && (
                <p className="text-sm text-red-500">
                  {errors.otherTeam_size.message}
                </p>
              )}
            </div>
          )}

          {/* <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isSubmitting ? "Submitting..." : "Continue"}
          </button> */}
          <Button type="submit" variant={"black"}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default BusinessForm;
