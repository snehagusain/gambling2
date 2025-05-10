import '@/styles/globals.css';
import '@/styles/custom.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/contexts/AuthContext';
import { WalletProvider } from '@/contexts/WalletContext';
import { BetSlipProvider } from '@/contexts/BetSlipContext';
import { AdminProvider } from '@/contexts/AdminContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <WalletProvider>
        <BetSlipProvider>
          <AdminProvider>
            <Component {...pageProps} />
          </AdminProvider>
        </BetSlipProvider>
      </WalletProvider>
    </AuthProvider>
  );
} 