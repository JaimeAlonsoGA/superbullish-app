import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  avalanche,
  opBNB,
  bounceBit,
} from 'wagmi/chains';

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

export const config = getDefaultConfig({
  appName: 'Super Bullish',
  projectId: '5f3134239437995cd1646eb5d78f79d5',
  chains: [mainnet, polygon, avalanche, arbitrum],
});