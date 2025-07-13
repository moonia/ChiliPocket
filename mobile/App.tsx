import "@walletconnect/react-native-compat";
import React from 'react';
import { WalletProvider } from './src/providers/WalletProvider';
import { WalletComponent } from './src/components/WalletComponent';

export default function App() {
  return (
    <WalletProvider>
      <WalletComponent />
    </WalletProvider>
  );
}
