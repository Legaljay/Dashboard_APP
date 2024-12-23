import { PropsWithChildren } from 'react';
import { ReduxProvider } from './ReduxProvider';

export function Providers({ children }: PropsWithChildren) {
  return (
    <ReduxProvider>
      {children}
    </ReduxProvider>
  );
}

export * from './ReduxProvider';
