import { useAccount } from 'wagmi';
import './App.css';
import { useAuth } from './providers/auth-provider';
import Providers from './providers/providers.js';
import AuthenticatedApp from './routes/authenticated-app';
import { UnauthenticatedApp } from './routes/unauthenticated-app.js';
import { Toaster } from './components/ui/sonner';
import { ToasterProps } from 'sonner';

export function AppContent() {
  const { loading, isAuthenticated, isSigningOut } = useAuth();
  const { isConnected } = useAccount();

  if (loading || isSigningOut) {
    return (
      <div className="flex items-center justify-center h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center text-gray-500 dark:text-gray-400">
          Loading...
        </div>
      </div>
    );
  }

  if (isConnected && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center text-gray-500 dark:text-gray-400">
          Finalizing authentication. Confirm the access to your wallet...
        </div>
      </div>
    );
  }

  const toRender = isAuthenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />;

  return toRender
}

export default function App() {
  const toastConfig: Partial<ToasterProps> = {
    position: "top-center",
    richColors: true,
  };

  return (
    <Providers>
      <AppContent />
      <Toaster {...toastConfig} />
    </Providers>
  );
}