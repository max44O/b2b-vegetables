'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, Calendar, TrendingUp, Users, Package, DollarSign } from 'lucide-react';
import { formatCurrency, formatWeight } from '@/lib/utils';

interface ReportData {
  period: string;
  totalRFQs: number;
  totalOffers: number;
  acceptedOffers: number;
  totalRevenue: number;
  newCustomers: number;
  topProducts: Array<{
    name: string;
    quantity: number;
    revenue: number;
  }>;
  customerStats: Array<{
    company: string;
    rfqCount: number;
    totalValue: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    rfqs: number;
    revenue: number;
  }>;
}

interface ReportingDashboardProps {
  data: ReportData;
}

export function ReportingDashboard({ data }: ReportingDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedChart, setSelectedChart] = useState('revenue');

  const chartColors = ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0'];

  const exportReport = () => {
    // Generate CSV or PDF report
    const csvContent = generateCSVReport(data);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const generateCSVReport = (data: ReportData) => {
    let csv = 'Period,Total RFQs,Total Offers,Accepted Offers,Total Revenue,New Customers\n';
    csv += `${data.period},${data.totalRFQs},${data.totalOffers},${data.acceptedOffers},${data.totalRevenue},${data.newCustomers}\n\n`;
    
    csv += 'Top Products\n';
    csv += 'Product Name,Quantity,Revenue\n';
    data.topProducts.forEach(product => {
      csv += `${product.name},${product.quantity},${product.revenue}\n`;
    });

    return csv;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Business insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total RFQs</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalRFQs}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted Offers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.acceptedOffers}</div>
            <p className="text-xs text-muted-foreground">
              {((data.acceptedOffers / data.totalOffers) * 100).toFixed(1)}% acceptance rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.newCustomers}</div>
            <p className="text-xs text-muted-foreground">
              +5% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [formatCurrency(value as number), 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [formatCurrency(value as number), 'Revenue']} />
                <Bar dataKey="revenue" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Customer Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Top Customers by Value</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>RFQ Count</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Avg. Order Value</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.customerStats.map((customer, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{customer.company}</TableCell>
                  <TableCell>{customer.rfqCount}</TableCell>
                  <TableCell>{formatCurrency(customer.totalValue)}</TableCell>
                  <TableCell>{formatCurrency(customer.totalValue / customer.rfqCount)}</TableCell>
                  <TableCell>
                    <Badge variant={customer.rfqCount > 5 ? 'default' : 'secondary'}>
                      {customer.rfqCount > 5 ? 'VIP' : 'Regular'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* RFQ vs Revenue Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>RFQ Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Accepted', value: data.acceptedOffers, color: '#16a34a' },
                  { name: 'Pending', value: data.totalOffers - data.acceptedOffers, color: '#f59e0b' },
                  { name: 'Declined', value: data.totalRFQs - data.totalOffers, color: '#ef4444' },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {[
                  { name: 'Accepted', value: data.acceptedOffers, color: '#16a34a' },
                  { name: 'Pending', value: data.totalOffers - data.acceptedOffers, color: '#f59e0b' },
                  { name: 'Declined', value: data.totalRFQs - data.totalOffers, color: '#ef4444' },
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
