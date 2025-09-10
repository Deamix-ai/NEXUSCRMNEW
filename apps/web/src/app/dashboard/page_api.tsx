'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  UserPlus, 
  TrendingUp, 
  Calendar,
  Building2,
  Phone,
  Mail,
  DollarSign,
  Target,
  Award,
  Clock,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { dashboardApi, leadsApi, clientsApi } from '@/lib/api-client';

interface DashboardStats {
  leads: { total: number; new: number };
  clients: { total: number };
  deals: { total: number };
  jobs: { active: number };
}

interface LeadStats {
  total: number;
  new: number;
  qualified: number;
  lost: number;
}

interface ClientStats {
  total: number;
  residential: number;
  commercial: number;
  trade: number;
}

export default function ApiDashboard() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [leadStats, setLeadStats] = useState<LeadStats | null>(null);
  const [clientStats, setClientStats] = useState<ClientStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [dashboardData, leadsData, clientsData] = await Promise.all([
        dashboardApi.getStats(),
        leadsApi.getStats(),
        clientsApi.getStats(),
      ]);

      setDashboardStats(dashboardData);
      setLeadStats(leadsData);
      setClientStats(clientsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      console.error('Dashboard API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button disabled>
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            Loading...
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={loadDashboardData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sample chart data (would be replaced with real API data)
  const monthlyData = [
    { name: 'Jan', leads: 65, clients: 28, deals: 15 },
    { name: 'Feb', leads: 59, clients: 32, deals: 18 },
    { name: 'Mar', leads: 80, clients: 35, deals: 22 },
    { name: 'Apr', leads: 81, clients: 40, deals: 25 },
    { name: 'May', leads: 56, clients: 30, deals: 20 },
    { name: 'Jun', leads: 85, clients: 45, deals: 28 },
  ];

  const leadSourceData = [
    { name: 'Website', value: 35, color: '#8884d8' },
    { name: 'Referral', value: 25, color: '#82ca9d' },
    { name: 'Social Media', value: 20, color: '#ffc658' },
    { name: 'Email', value: 15, color: '#ff7300' },
    { name: 'Other', value: 5, color: '#00ff00' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            ✅ Connected to API
          </Badge>
          <Button onClick={loadDashboardData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.leads.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {leadStats?.new || 0} new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.clients.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {clientStats?.residential || 0} residential, {clientStats?.commercial || 0} commercial
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.deals.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              Pipeline value tracking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.jobs.active || 0}</div>
            <p className="text-xs text-muted-foreground">
              In progress projects
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Monthly Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="leads" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="clients" stroke="#82ca9d" strokeWidth={2} />
                <Line type="monotone" dataKey="deals" stroke="#ffc658" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={leadSourceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                >
                  {leadSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Lead Conversion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">New Leads</span>
              <span className="font-medium">{leadStats?.new || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Qualified</span>
              <span className="font-medium">{leadStats?.qualified || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Lost</span>
              <span className="font-medium">{leadStats?.lost || 0}</span>
            </div>
            <div className="pt-2">
              <div className="text-xs text-muted-foreground mb-1">Conversion Rate</div>
              <Progress 
                value={leadStats ? (leadStats.qualified / leadStats.total) * 100 : 0} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Residential</span>
              <Badge variant="secondary">{clientStats?.residential || 0}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Commercial</span>
              <Badge variant="secondary">{clientStats?.commercial || 0}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Trade</span>
              <Badge variant="secondary">{clientStats?.trade || 0}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Database Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                ✅ PostgreSQL Connected
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                📊 {(dashboardStats?.leads.total || 0) + (dashboardStats?.clients.total || 0)} Records
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                🚀 API Functional
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
