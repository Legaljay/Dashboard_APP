import React from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/redux-slice/hooks';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { CopyButton } from '@/components/ui/button/CopyButton';
import { fetchApiKey, resetPublicKey, resetSecretKey } from '@/redux-slice/api-key/api-key.slice';
import { useToast } from '@/contexts/ToastContext';
import useDataFetching from '@/hooks/useDataFetching';

interface ApiKeysProps {
  isFormModified: boolean;
  setIsFormModified: (modified: boolean) => void;
}

// Reusable API Key Card Component
interface ApiKeyCardProps {
  title: string;
  keyValue: string | null;
  onGenerateKey: () => void;
  onRevealKey?: () => void;
  isVisible?: boolean;
}

const maskKey = (key: string | null): string => {
  if (!key) return '';
  // return key.replace(/./g, '⨯');
  return '⨯'.repeat(key.length);
};

const ApiKeyCard: React.FC<ApiKeyCardProps> = ({
  title,
  keyValue,
  onGenerateKey,
  onRevealKey,
  isVisible = false,
}) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center">
      <h2 className="text-sm font-medium text-gray-700 dark:text-gray-200">{title}</h2>
      <CopyButton
        textToCopy={keyValue || ''}
        variant="ghost"
        className="text-gray-500 hover:text-gray-700"
      />
    </div>
    <div className="mt-1">
      <div className="flex items-center justify-between px-2 py-1 border dark:border-secondary-800 rounded-lg bg-gray-50 dark:bg-background-dark">
        <div className="flex-1 truncate mr-4">
          <h3 className="font-mono text-sm text-gray-600">{keyValue}</h3>
        </div>
        {onRevealKey && (
          <div className="flex-shrink-0">
            <button
              className="text-gray-600 hover:text-gray-800 p-1 rounded-md hover:bg-gray-100 transition-colors"
              onClick={onRevealKey}
              aria-label={isVisible ? "Hide key" : "Reveal key"}
            >
              {isVisible ? (
                <EyeOffIcon className="w-4 h-4" />
              ) : (
                <EyeIcon className="w-4 h-4" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
    <div className="pt-2">
      <button
        className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md 
                   shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                   transition-colors duration-200"
        onClick={onGenerateKey}
      >
        Generate New {title}
      </button>
    </div>
  </div>
);

const ApiKeys: React.FC<ApiKeysProps> = () => {
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const { secretKey, publicKey } = useAppSelector((state) => state.apiKeys);
  const [isApiKeyVisible, setIsApiKeyVisible] = React.useState({ secretKey: false, publicKey: false});

  const { refetch } = useDataFetching<any>(() => dispatch(fetchApiKey()), [dispatch], {
    showToasts: {
      error: true,
      success: false,
    },
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    retryCount: 0,
  });


  const handleGeneratePublicKey = React.useCallback(async() => {
    // Implement public key generation
    try {
      const res = await dispatch(resetPublicKey()).unwrap();
      if (!res.status) return;
      addToast('success', 'Public key generated successfully');
    } catch (error: any) {
      addToast('error', error.message);
    }
  }, []);

  const handleGenerateSecretKey = React.useCallback(async() => {
    // Implement secret key generation
    try {
      const { status } = await dispatch(resetSecretKey()).unwrap();
      if (status) addToast('success', 'Secret key generated successfully');
    } catch (error: any) {
      addToast('error', error.message);
    }
  }, []);

  const handleRevealKey = React.useCallback((type: 'secretKey' | 'publicKey') => {
    setIsApiKeyVisible(prevState => ({ ...prevState, [type]: !prevState[type] }));
  }, []);

  const getDisplayedApiKey = React.useCallback((type: 'secretKey' | 'publicKey') => {
    const key = type === 'secretKey' ? secretKey : publicKey;
    if (!key) return null;
    return isApiKeyVisible[type] ? key : maskKey(key);
  }, [secretKey, publicKey, isApiKeyVisible]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-WHITE-_100">API Keys</h1>
        <p className="mt-2 text-sm text-gray-600">
          Securely manage your API keys and access tokens. Keep these keys confidential 
          and never share them in public repositories or client-side code.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6 space-y-8 divide-y divide-gray-200 dark:divide-secondary-800 dark:bg-gray-800">
        <ApiKeyCard
          title="Secret API Key"
          keyValue={getDisplayedApiKey('secretKey')}
          onGenerateKey={handleGenerateSecretKey}
          onRevealKey={() => handleRevealKey('secretKey')}
          isVisible={isApiKeyVisible.secretKey}
        />
        
        <div className="pt-8">
          <ApiKeyCard
            title="Public API Key"
            keyValue={getDisplayedApiKey('publicKey')}
            onGenerateKey={handleGeneratePublicKey}
            onRevealKey={() => handleRevealKey('publicKey')}
            isVisible={isApiKeyVisible.publicKey}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ApiKeys;
