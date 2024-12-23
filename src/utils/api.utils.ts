/**
 * Replaces URL parameters in an API endpoint with actual values
 * @param url The URL template with parameters (e.g., '/api/v1/applications/:id/features/:featureId')
 * @param params Object containing parameter values (e.g., { id: '123', featureId: '456' })
 * @returns The URL with replaced parameters
 */
export const replaceUrlParams = (url: string, params: Record<string, string>): string => {
  let result = url;
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, value);
  });
  return result;
};

/**
 * Creates a query string from an object of parameters
 * @param params Object containing query parameters
 * @returns Query string (e.g., '?key1=value1&key2=value2')
 */
export const createQueryString = (params: Record<string, string | number | boolean>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

/**
 * Combines base URL with query parameters
 * @param url Base URL
 * @param params Query parameters object
 * @returns Complete URL with query string
 */
export const createUrl = (url: string, params?: Record<string, string | number | boolean>): string => {
  if (!params) return url;
  return `${url}${createQueryString(params)}`;
};
