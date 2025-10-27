/**
 * X402 Transactions Table Component
 */

import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { CalendarDays, ChevronLeft, ChevronRight, ExternalLink, Copy } from 'lucide-react';
import { X402Transaction } from '../../types/x402';
import { chainInfo } from '../../data/trumpServerData';

interface TransactionsTableProps {
  transactions: X402Transaction[];
  totalPages?: number;
}

export function TransactionsTable({ transactions, totalPages = 100 }: TransactionsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [period, setPeriod] = useState<'30d' | '90d'>('30d');

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <h1 className="font-bold text-xl md:text-2xl">Latest Transactions</h1>
          </div>
          <div className="flex items-center">
            <Button variant="outline" size="sm" className="rounded-r-none border-r-0">
              <CalendarDays className="size-4 text-foreground/50" />
            </Button>
            <Select value={period} onValueChange={(v) => setPeriod(v as '30d' | '90d')}>
              <SelectTrigger className="w-fit rounded-l-none border-l-0 text-xs md:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30d">Past 30 Days</SelectItem>
                <SelectItem value="90d">Past 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-muted-foreground text-sm md:text-base">
          Latest x402 transactions to this server address
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Card className="overflow-hidden p-0">
          <div className="relative w-full overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="font-bold">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      Transaction Hash
                    </div>
                  </TableHead>
                  <TableHead className="font-bold">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      Resource
                    </div>
                  </TableHead>
                  <TableHead className="font-bold">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      Buyer
                    </div>
                  </TableHead>
                  <TableHead className="font-bold">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      Amount
                    </div>
                  </TableHead>
                  <TableHead className="font-bold">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      Time
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-center">
                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                      Chain
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => {
                  const chain = chainInfo[tx.chain];
                  return (
                    <TableRow key={tx.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <span>{formatAddress(tx.txHash)}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(tx.txHash)}
                          >
                            <Copy className="size-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-48">
                        <div className="truncate text-sm">{tx.resourceName}</div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <span>{formatAddress(tx.buyer)}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(tx.buyer)}
                          >
                            <Copy className="size-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold">{tx.amount}</span>
                          <span className="text-xs text-muted-foreground">{tx.currency}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatTimeAgo(tx.timestamp)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 justify-center">
                          <span className="text-lg">{chain.logo}</span>
                          <span className="text-xs font-medium">{chain.name}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>

        <div className="flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <p className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages.toLocaleString()}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
