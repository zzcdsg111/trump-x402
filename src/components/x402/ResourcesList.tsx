/**
 * X402 Resources List Component
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Lock, TrendingUp, DollarSign, Eye } from 'lucide-react';
import { X402Resource } from '../../types/x402';

interface ResourcesListProps {
  resources: X402Resource[];
  onAccessResource?: (resourceId: string) => void;
}

export function ResourcesList({ resources, onAccessResource }: ResourcesListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {resources.map((resource) => (
        <Card key={resource.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Lock className="size-4 text-primary" />
                <CardTitle className="text-lg">{resource.name}</CardTitle>
              </div>
              <Badge variant={resource.status === 'active' ? 'default' : 'secondary'}>
                {resource.status}
              </Badge>
            </div>
            <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium text-muted-foreground">Price</span>
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold">{resource.price}</span>
                <span className="text-sm text-muted-foreground">{resource.currency}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                <Eye className="size-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Access</span>
                  <span className="font-semibold">{resource.accessCount.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                <DollarSign className="size-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Revenue</span>
                  <span className="font-semibold">{resource.revenue.toFixed(1)}</span>
                </div>
              </div>
            </div>

            {onAccessResource && (
              <Button 
                className="w-full" 
                onClick={() => onAccessResource(resource.id)}
              >
                Access Resource
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
