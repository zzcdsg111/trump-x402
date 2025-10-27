import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Placeholder from './pages/Placeholder';
import Payment402Demo from './pages/Payment402Demo';
import TrumpX402 from './pages/TrumpX402';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TrumpX402 />} />
          <Route path="/demo" element={<Payment402Demo />} />
          <Route path="/index" element={<Index />} />
          <Route path="*" element={<Placeholder />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
