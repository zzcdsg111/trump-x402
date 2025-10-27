/**
 * Trump Token X402 Protocol Page
 */

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ServerOverview } from '../components/x402/ServerOverview';
import { ActivityChart } from '../components/x402/ActivityChart';
import { TransactionsTable } from '../components/x402/TransactionsTable';
import { ResourcesList } from '../components/x402/ResourcesList';
import { ProtectedContent } from '../components/ProtectedContent';
import { PaymentVerifier } from '../services/paymentVerifier';
import { trumpServer } from '../data/trumpServerData';
import { useTransactions, useResources, useStats } from '../hooks/useSupabaseData';
import { transformTransactions, transformResources } from '../utils/dataTransformers';
import { Globe, Wallet, Search, Sun, Moon } from 'lucide-react';

export default function TrumpX402() {
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'transactions'>('overview');
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // 从Supabase获取真实数据
  const { data: rawTransactions = [], isLoading: txLoading } = useTransactions(50);
  const { data: rawResources = [], isLoading: resourcesLoading } = useResources();
  const { data: trumpStats } = useStats();

  // 转换为X402类型
  const transactions = transformTransactions(rawTransactions);
  const trumpResources = transformResources(rawResources);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  const handleAccessResource = (resourceId: string) => {
    setSelectedResourceId(resourceId);
  };

  const selectedResource = trumpResources.find(r => r.id === selectedResourceId);

  if (selectedResourceId && selectedResource) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Button 
              variant="outline" 
              onClick={() => setSelectedResourceId(null)}
              className="mb-6"
            >
              ← Back to Resources
            </Button>
            <ProtectedContent 
              resource={{
                id: selectedResource.id,
                name: selectedResource.name,
                description: selectedResource.description,
                price: selectedResource.price,
                currency: selectedResource.currency,
                requiresPayment: true,
                content: `
                  <h2>${selectedResource.name}</h2>
                  <p>You now have access to this premium Trump Token resource!</p>
                  <p>This content includes exclusive insights and real-time updates.</p>
                `
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="w-full flex flex-col pt-4 justify-center bg-card border-b">
        <div className="flex items-center justify-between w-full px-2 md:px-6 pb-4 h-10">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="size-8 bg-gradient-to-br from-red-500 to-blue-500 rounded-md flex items-center justify-center text-white font-bold">
                X4
              </div>
              <p className="text-sm md:text-base font-semibold font-mono">x402scan</p>
            </div>
            <p className="text-muted-foreground/20 text-xl">/</p>
            <div className="flex items-center gap-2 cursor-pointer">
              <span className="text-2xl">🇺🇸</span>
              <p className="font-semibold text-sm font-mono md:text-base">Trump Token</p>
            </div>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <Button variant="outline" size="sm">
              <Globe className="size-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Search className="size-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Wallet className="size-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={toggleTheme}>
              {theme === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="w-full px-2 md:px-6">
          <ul className="flex w-full h-full border-b">
            <li 
              className={`relative py-3 px-4 cursor-pointer font-medium ${
                activeTab === 'overview' 
                  ? 'text-foreground border-b-2 border-primary -mb-px' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </li>
            <li 
              className={`relative py-3 px-4 cursor-pointer font-medium ${
                activeTab === 'resources' 
                  ? 'text-foreground border-b-2 border-primary -mb-px' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('resources')}
            >
              Resources
            </li>
            <li 
              className={`relative py-3 px-4 cursor-pointer font-medium ${
                activeTab === 'transactions' 
                  ? 'text-foreground border-b-2 border-primary -mb-px' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('transactions')}
            >
              Transactions
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col py-6 md:py-8">
        <div className="flex flex-col max-w-6xl w-full mx-auto py-8 px-2 gap-8 pt-0">
          {/* Server Overview */}
          <ServerOverview 
            server={trumpServer}
            onTryResources={() => setActiveTab('resources')}
          />

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <ActivityChart stats={trumpStats} />
              <TransactionsTable transactions={transactions} totalPages={7728} />
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Available Resources</h2>
                <p className="text-muted-foreground">
                  Access premium Trump Token content and services using the 402 protocol
                </p>
              </div>
              <ResourcesList 
                resources={trumpResources}
                onAccessResource={handleAccessResource}
              />
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <TransactionsTable transactions={transactions} totalPages={7728} />
            </div>
          )}

          {/* Protocol Info */}
          <Card>
            <CardHeader>
              <CardTitle>About HTTP 402 Protocol</CardTitle>
              <CardDescription>Payment Required for Digital Content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This Trump Token server implements the HTTP 402 Payment Required protocol, 
                enabling seamless micropayments for premium content and services.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-2">🔒 Secure Access</h4>
                  <p className="text-sm text-muted-foreground">
                    Token-based authentication with automatic expiration
                  </p>
                </div>
                <div className="p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-2">⚡ Instant Payment</h4>
                  <p className="text-sm text-muted-foreground">
                    Fast payment processing across multiple chains
                  </p>
                </div>
                <div className="p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-2">📊 Analytics</h4>
                  <p className="text-sm text-muted-foreground">
                    Real-time transaction tracking and revenue insights
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
