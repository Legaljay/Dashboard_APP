const LoadingFallback = () => (
    <div className="w-full h-full flex items-center justify-center relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-xl font-bold text-blue-500 dark:text-white">Wano</p>
      </div>
      <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-blue-500"/>
    </div>
);

export default LoadingFallback;