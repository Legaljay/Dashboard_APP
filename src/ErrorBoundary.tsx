import { useNavigate, useRouteError } from "react-router-dom";

// Error Boundary Component
interface RouterError {
  status: number;
  statusText: string;
  message?: string;
}

function isRouterError(error: unknown): error is RouterError {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "statusText" in error
  );
}

const ErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  let errorMessage = "An unexpected error occurred";
  let errorStatus = "500";
  let errorStatusText = "Internal Server Error";

  if (isRouterError(error)) {
    errorMessage = error.message || `${error.status} ${error.statusText}`;
    errorStatus = error.status.toString();
    errorStatusText = error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen w-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-9xl font-extrabold text-primary-600 dark:text-primary-400">
            {errorStatus}
          </h1>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {errorStatusText}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {errorMessage}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600"
          >
            Go Back
          </button>
          <button
            onClick={handleGoHome}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-900 dark:text-primary-300 dark:hover:bg-primary-800"
          >
            Go Home
          </button>
        </div>

        <div className="mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            If the problem persists, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
