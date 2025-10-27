/**
 * HTTP 402 协议演示页面
 */

import { useState } from 'react';
import { ProtectedContent } from '../components/ProtectedContent';
import { ProtectedResource } from '../types/payment';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const demoResources: ProtectedResource[] = [
  {
    id: 'article-1',
    name: 'Premium Article: Advanced React Patterns',
    description: 'Learn advanced React patterns and best practices',
    price: 9.99,
    currency: 'USD',
    requiresPayment: true,
    content: `
      <h2>Advanced React Patterns</h2>
      <p>Welcome to this premium content! You now have access to advanced React patterns including:</p>
      <ul>
        <li>Compound Components Pattern</li>
        <li>Render Props Pattern</li>
        <li>Higher-Order Components (HOC)</li>
        <li>Custom Hooks Pattern</li>
        <li>State Reducer Pattern</li>
      </ul>
      <p>Each pattern is explained with real-world examples and use cases...</p>
    `,
  },
  {
    id: 'video-1',
    name: 'Video Course: TypeScript Mastery',
    description: 'Complete TypeScript course from beginner to expert',
    price: 29.99,
    currency: 'USD',
    requiresPayment: true,
    content: `
      <h2>TypeScript Mastery Course</h2>
      <p>Congratulations on purchasing this course! You now have lifetime access to:</p>
      <ul>
        <li>10+ hours of video content</li>
        <li>Hands-on coding exercises</li>
        <li>Real-world project examples</li>
        <li>Certificate of completion</li>
      </ul>
      <p>Start your TypeScript journey today!</p>
    `,
  },
  {
    id: 'ebook-1',
    name: 'E-Book: Web3 Development Guide',
    description: 'Comprehensive guide to building Web3 applications',
    price: 19.99,
    currency: 'USD',
    requiresPayment: true,
    content: `
      <h2>Web3 Development Guide</h2>
      <p>Thank you for your purchase! This e-book covers:</p>
      <ul>
        <li>Blockchain fundamentals</li>
        <li>Smart contract development</li>
        <li>DApp architecture</li>
        <li>Web3 integration patterns</li>
        <li>Security best practices</li>
      </ul>
      <p>Download your PDF copy and start building the decentralized web!</p>
    `,
  },
  {
    id: 'free-1',
    name: 'Free Article: Getting Started with React',
    description: 'Introduction to React for beginners',
    price: 0,
    currency: 'USD',
    requiresPayment: false,
    content: `
      <h2>Getting Started with React</h2>
      <p>This is free content available to everyone!</p>
      <p>React is a JavaScript library for building user interfaces. Key concepts include:</p>
      <ul>
        <li>Components</li>
        <li>Props and State</li>
        <li>Hooks</li>
        <li>JSX</li>
      </ul>
      <p>Start learning React today with our free resources!</p>
    `,
  },
];

export default function Payment402Demo() {
  const [selectedResource, setSelectedResource] = useState<ProtectedResource>(demoResources[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">HTTP 402 Payment Protocol</h1>
            <p className="text-xl text-muted-foreground">
              Demonstration of payment-required content access control
            </p>
            <div className="flex justify-center gap-2">
              <Badge variant="outline">Payment Gateway</Badge>
              <Badge variant="outline">Token Verification</Badge>
              <Badge variant="outline">Access Control</Badge>
            </div>
          </div>

          {/* Protocol Info */}
          <Card>
            <CardHeader>
              <CardTitle>About HTTP 402</CardTitle>
              <CardDescription>Payment Required Status Code</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                HTTP 402 is a reserved status code for future use in digital payment systems. 
                This framework demonstrates how it could be implemented for content monetization.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Payment Processing</h4>
                  <p className="text-sm text-muted-foreground">
                    Secure payment gateway integration with multiple payment methods
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Token Verification</h4>
                  <p className="text-sm text-muted-foreground">
                    Time-based access tokens with automatic expiration
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Access Control</h4>
                  <p className="text-sm text-muted-foreground">
                    Resource-level protection with seamless user experience
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Content */}
          <Tabs defaultValue="demo" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="demo">Live Demo</TabsTrigger>
              <TabsTrigger value="resources">All Resources</TabsTrigger>
            </TabsList>
            
            <TabsContent value="demo" className="space-y-4">
              <ProtectedContent resource={selectedResource} />
            </TabsContent>
            
            <TabsContent value="resources" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {demoResources.map((resource) => (
                  <Card
                    key={resource.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => {
                      setSelectedResource(resource);
                      // Switch to demo tab
                      const demoTab = document.querySelector('[value="demo"]') as HTMLElement;
                      demoTab?.click();
                    }}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{resource.name}</CardTitle>
                        {resource.requiresPayment ? (
                          <Badge variant="secondary">
                            {resource.currency} {resource.price.toFixed(2)}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Free</Badge>
                        )}
                      </div>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Technical Details */}
          <Card>
            <CardHeader>
              <CardTitle>Implementation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Features:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Mock payment provider with 90% success rate simulation</li>
                  <li>Token-based access control with 24-hour expiration</li>
                  <li>Local storage persistence for purchased content</li>
                  <li>Multiple payment method support (Credit Card, Crypto, Stripe)</li>
                  <li>Automatic token cleanup on expiration</li>
                  <li>Responsive UI with loading states and error handling</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Architecture:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Type-safe payment interfaces and enums</li>
                  <li>Provider pattern for payment gateway abstraction</li>
                  <li>Centralized token verification service</li>
                  <li>Component-based access control</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
