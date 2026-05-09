'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDateTime, formatWeight } from '@/lib/utils';
import { Eye, DollarSign } from 'lucide-react';
import Link from 'next/link';

interface RFQ {
  id: string;
  status: string;
  createdAt: Date;
  notes?: string | null;
  user: {
    id: string;
    name: string | null;
    email: string;
    companyName: string | null;
  };
  items: Array<{
    id: string;
    quantity: number;
    notes?: string | null;
    product: {
      id: string;
      name: string;
      nameRo: string | null;
      sku: string;
    };
  }>;
  offers: Array<{
    id: string;
    createdAt: Date;
    totalAmount: any;
  }>;
}

interface AdminRFQListProps {
  initialRfqs: RFQ[];
}

export function AdminRFQList({ initialRfqs }: AdminRFQListProps) {
  const [rfqs] = useState(initialRfqs);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'secondary';
      case 'OFFERED':
        return 'default';
      case 'ACCEPTED':
        return 'default';
      case 'DECLINED':
        return 'destructive';
      case 'CANCELLED':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600';
      case 'OFFERED':
        return 'text-blue-600';
      case 'ACCEPTED':
        return 'text-green-600';
      case 'DECLINED':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (rfqs.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No RFQs yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All RFQs ({rfqs.length})</CardTitle>
        <CardDescription>
          Manage customer quote requests and create offers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>RFQ ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Latest Offer</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rfqs.map((rfq) => (
              <TableRow key={rfq.id}>
                <TableCell className="font-mono text-sm">
                  #{rfq.id.slice(-8)}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {rfq.user.name || rfq.user.email}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {rfq.user.companyName}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(rfq.status)}>
                    {rfq.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium">{rfq.items.length} items</p>
                    <p className="text-sm text-muted-foreground">
                      {rfq.items.slice(0, 2).map(item => 
                        `${item.product.name} (${item.quantity})`
                      ).join(', ')}
                      {rfq.items.length > 2 && ` +${rfq.items.length - 2} more`}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {formatDateTime(rfq.createdAt)}
                </TableCell>
                <TableCell>
                  {rfq.offers.length > 0 ? (
                    <div>
                      <p className="font-medium">
                        {Number(rfq.offers[0].totalAmount).toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDateTime(rfq.offers[0].createdAt)}
                      </p>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">No offers yet</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Link href={`/admin/rfqs/${rfq.id}`}>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    {rfq.status === 'PENDING' && (
                      <Link href={`/admin/rfqs/${rfq.id}/offer`}>
                        <Button size="sm">
                          <DollarSign className="h-4 w-4 mr-1" />
                          Create Offer
                        </Button>
                      </Link>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}












