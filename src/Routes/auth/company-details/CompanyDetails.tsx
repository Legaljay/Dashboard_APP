import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectField } from "@/components/ui/select";
import { useAppDispatch } from "@/redux-slice/hooks";
import { createBusiness, setBusiness } from "@/redux-slice/business/business.slice";
import { BusinessCreate } from "@/types";
import { useToast } from "@/contexts/ToastContext";
import { useLocation, useNavigate } from "react-router-dom";
import FormHeader from "@/components/ui/form/FormHeader";
import WanoLogo from "@/assets/wano logo 1 1.png";
import { CompanySchema as schema, FormData } from "@/constants/FormSchemas/Company.schema";



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

// Define countries data
const countries = [
  { value: "United States", label: "🇺🇸 United States" },
  { value: "United Kingdom", label: "🇬🇧 United Kingdom" },
  { value: "Canada", label: "🇨🇦 Canada" },
  { value: "Australia", label: "🇦🇺 Australia" },
  { value: "Germany", label: "🇩🇪 Germany" },
  { value: "France", label: "🇫🇷 France" },
  { value: "Italy", label: "🇮🇹 Italy" },
  { value: "Spain", label: "🇪🇸 Spain" },
  { value: "Brazil", label: "🇧🇷 Brazil" },
  { value: "India", label: "🇮🇳 India" },
  { value: "China", label: "🇨🇳 China" },
  { value: "Japan", label: "🇯🇵 Japan" },
  { value: "Russia", label: "🇷🇺 Russia" },
  { value: "South Africa", label: "🇿🇦 South Africa" },
  { value: "Nigeria", label: "🇳🇬 Nigeria" },
  // Add more countries as needed
];

const OTHER_CATEGORY = "Other(Please Specify):";

const CompanyDetails = () => {
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      business_email: "",
      website_url: "",
      country: "Nigeria",
      category: "",
      otherCategory: "",
      description: "",
      otherDescription: "",
      team_size: "",
      otherTeam_size: "",
      purpose_for_wano: "",
    },
  });

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  const selectedCategory = watch("category");
  const selectedRole = watch("description");
  const selectedSize = watch("team_size");

  const isFromDashboard = location.state?.fromDashboard;

  const onSubmit = async (data: FormData) => {
    const transformedData: BusinessCreate = {
      name: data.name,
      business_email: data.business_email,
      website_url: data.website_url || "",
      country: data.country,
      category: data.category === OTHER_CATEGORY ? data.otherCategory! : data.category,
      description: data.description === OTHER_CATEGORY ? data.otherDescription! : data.description,
      team_size: data.team_size === OTHER_CATEGORY ? data.otherTeam_size! : data.team_size,
      purpose_for_wano: "Not required",
    };
    
    try {
      const response = await dispatch(createBusiness(transformedData)).unwrap();
      // Handle success
      if (response.status) {
        addToast('success', response.message);
        // Set business data in store
        dispatch(setBusiness(response.data));
        // Navigate to next page
        navigate(`auth/customize-assistant/${response.data.id}`);
      }
    } catch (error) {
      // Handle error
      const errorMessage = error || (error as any)?.message || 'An unexpected error occurred';
      addToast('error', errorMessage);
      console.log('Error creating business:', error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-[520px] mx-auto shadow py-[30px] px-[50px] rounded-xl bg-white dark:bg-gray-800">
        <FormHeader
          allowNavigation={isFromDashboard}
          Logo={WanoLogo}
          title="Create your business"
          text="Tell us about your business"
          width={300}
          padddown="mt-[20px]"
          description="This information will be used to set up your business profile."
        />
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Business Name
          </label>
          <input
            type="text"
            {...register("name")}
            className="w-full rounded-lg text-gray-700 bg-white border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
            placeholder="Enter your business name"
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Business Email
          </label>
          <input
            type="text"
            {...register("business_email")}
            className="w-full rounded-lg text-gray-700 bg-white border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
            placeholder="Enter your business email"
          />
          {errors.business_email && (
            <p className="text-sm text-red-500">
              {errors.business_email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Business Website <span className="!text-xs">Optional</span>
          </label>
          <input
            type="text"
            {...register("website_url")}
            className="w-full rounded-lg text-gray-700 bg-white border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
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
            name="country"
            label="Business Country"
            options={countries}
            required
            className="text-gray-700"
          />
          {errors.country && (
            <p className="text-sm text-red-500">{errors.country.message}</p>
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
              className="w-full rounded-lg text-gray-700 bg-white border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
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
          <SelectField
            name="description"
            label="Your Role"
            options={roles}
            required
            className="text-gray-700"
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        {selectedRole === "Other(Please Specify):" && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Please specify role
            </label>
            <input
              type="text"
              {...register("otherDescription")}
              className="w-full rounded-lg text-gray-700 bg-white border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
              placeholder="Enter your role"
            />
            {errors.otherDescription && (
              <p className="text-sm text-red-500">
                {errors.otherDescription.message}
              </p>
            )}
          </div>
        )}

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
              className="w-full rounded-lg text-gray-700 bg-white border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
              placeholder="Enter your team size"
            />
            {errors.otherTeam_size && (
              <p className="text-sm text-red-500">
                {errors.otherTeam_size.message}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2 hidden">
          <label className="block text-sm font-medium text-gray-700">
            Purpose for using Wano
          </label>
          <input
            type="hidden"
            {...register("purpose_for_wano")}
            value="Not required"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isSubmitting ? 'Submitting...' : 'Continue'}
        </button>
      </form>
    </FormProvider>
  );
};

export default CompanyDetails;
