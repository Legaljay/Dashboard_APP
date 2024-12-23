import { ChevronRightIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BreadCrumbs = () => {
  const location = useLocation();
  const breadcrumbs = generateBreadcrumbs(location.pathname);

  return (
    <nav aria-label="breadcrumb">
      <div className="flex px-6 py-4">
        {breadcrumbs && (
          <nav aria-label="Breadcrumb" className="mr-4">
            <ol className="flex items-center justify-center space-x-2">
              {breadcrumbs.map((breadcrumb, index) => (
                <li key={index} className="flex items-center gap-2">
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
        )}
      </div>
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
 * The function includes all path segments in the href, while 
 * assigning a generic label for parameters (e.g., ':id').
 *
 * @param {string} pathname - The current pathname to generate breadcrumbs from.
 * @returns {Array<{ label: string; href: string }>} - An array of breadcrumb objects.
 */
function generateBreadcrumbs(
  pathname: string
): { label: string; href: string }[] {
  const paths =
    pathname === "/" ? ["Home"] : pathname.split("/").filter(Boolean);

  const breadcrumbs: { label: string; href: string }[] = [];
  let currentPath = "";

  for (const path of paths) {
    // Construct the current path
    currentPath += `/${path}`;

    // Determine the label for the breadcrumb
    const is_ID = path.startsWith(":") || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(path);

    // Only add to breadcrumbs if the path is not a parameter
    if (!is_ID){
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
