import { ChevronRightIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BreadCrumbs = () => {
  const location = useLocation();
  const breadcrumbs = generateBreadcrumbs(location.pathname);

  return (
    <nav aria-label="breadcrumb">
      {breadcrumbs.length > 0 && (
        <div className="flex px-6 py-4">
          <nav aria-label="Breadcrumb" className="mr-4">
            <ol className="flex justify-center items-center space-x-2">
              {breadcrumbs.map((breadcrumb, index) => (
                <li key={index} className="flex gap-2 items-center">
                  <Link
                    to={breadcrumb.href}
                    className={`text-gray-500 dark:text-[#ccc] hover:text-gray-700 text-sm focus:outline-none  ${
                      index === breadcrumbs.length - 1
                        ? "font-medium text-gray-900 cursor-default"
                        : "cursor-pointer"
                    }`}
                  >
                    {breadcrumb.label}
                  </Link>
                  {index < breadcrumbs.length - 1 && (
                    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      )}
    </nav>
  );
};
// focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-white
export default BreadCrumbs;

/**
 * Capitalizes the first letter of a given string.
 * Returns the original string if it is empty.
 *
 * @param {string} str - The string to capitalize.
 * @returns {string} - The capitalized string.
 */
function capitalizeFirstLetter(str: string): string {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}

/**
 * Generates an array of breadcrumb objects from the given pathname.
 * Each breadcrumb contains a label and a corresponding href.
 * Special handling for dashboard and excluded routes according to requirements.
 *
 * @param {string} pathname - The current pathname to generate breadcrumbs from.
 * @returns {Array<{ label: string; href: string }>} - An array of breadcrumb objects.
 */
function generateBreadcrumbs(
  pathname: string
): { label: string; href: string }[] {
  const excludedRoutes = [
    "dashboard", 
    "customers", 
    "assistant", 
    "settings", 
    "billing", 
    "support", 
    "conversations", 
    "widget", 
    "appstore", 
    "deploy", 
    "ask-assistant"
  ];

  // Remove trailing slash and split the path
  const cleanPath = pathname.replace(/\/$/, '');
  const paths = cleanPath === "/" ? ["Home"] : cleanPath.split("/").filter(Boolean);
  
  // If the path only contains dashboard and an excluded route, return empty breadcrumbs
  if (paths.length === 2 && 
      paths[0] === "dashboard" && 
      excludedRoutes.includes(paths[1])) {
    return [];
  }

  const breadcrumbs: { label: string; href: string }[] = [];
  let currentPath = "";

  // Process each path segment
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    
    // Always add path to currentPath
    currentPath += `/${path}`;
    
    // Skip adding breadcrumb for dashboard but keep it in the path
    if (path === "dashboard") {
      continue;
    }
    
    // Check if it's a UUID or parameter
    const isID = path.startsWith(":") || 
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(path);
    
    if (!isID) {
      breadcrumbs.push({
        label: capitalizeFirstLetter(path),
        href: currentPath,
      });
    }
  }

  return breadcrumbs;
}

// /**
//  * Generates an array of breadcrumb objects from the given pathname.
//  * Each breadcrumb contains a label and a corresponding href.
//  * Excludes any path segments that start with a colon (:) to prevent
//  * displaying parameters in the breadcrumbs.
//  *
//  * @param {string} pathname - The current pathname to generate breadcrumbs from.
//  * @returns {Array<{ label: string; href: string }>} - An array of breadcrumb objects.
//  */
// function generateBreadcrumbs(
//   pathname: string
// ): { label: string; href: string }[] {
//   const paths =
//     pathname === "/" ? ["Home"] : pathname.split("/").filter(Boolean);

//   const breadcrumbs: { label: string; href: string }[] = [];
//   let currentPath = "";

//   for (const path of paths) {
//     // Exclude parameters that start with ':'
//     if (path.startsWith(":") || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(path)) {
//       continue;
//     };

//     currentPath += `/${path}`;
//     breadcrumbs.push({
//       label: capitalizeFirstLetter(path),
//       href: currentPath,
//     });
//   }

//   return breadcrumbs;
// }

// /**
//  * Generates an array of breadcrumb objects from the given pathname.
//  * Each breadcrumb contains a label and a corresponding href.
//  *
//  * @param {string} pathname - The current pathname to generate breadcrumbs from.
//  * @returns {Array<{ label: string; href: string }>} - An array of breadcrumb objects.
//  */
// function generateBreadcrumbs(
//   pathname: string
// ): { label: string; href: string }[] {
//   // Handle the root path by returning a single breadcrumb for 'Home'
//   const paths =
//     pathname === "/" ? ["Home"] : pathname.split("/").filter(Boolean);
//   const breadcrumbs: { label: string; href: string }[] = [];

//   let currentPath = "";
//   for (const path of paths) {
//     currentPath += `/${path}`;
//     breadcrumbs.push({
//       label: capitalizeFirstLetter(path), // Capitalize the first letter of each path segment
//       href: currentPath,
//     });
//   }

//   return breadcrumbs;
// }
