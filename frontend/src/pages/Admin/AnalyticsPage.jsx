import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
    BarChart3, 
    TrendingUp, 
    Users, 
    FileText, 
    MapPin, 
    Calendar, 
    PieChart,
    Activity,
    Target,
    AlertTriangle,
    CheckCircle,
    Clock,
    Download,
    Eye
} from "lucide-react";
import { format } from "date-fns";

// Chart components (you'll need to install recharts: npm install recharts)
import { 
    LineChart, 
    Line, 
    BarChart, 
    Bar, 
    PieChart as RechartsPieChart, 
    Pie, 
    Cell,
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer 
} from 'recharts';

const AnalyticsPage = () => {
    const [overviewStats, setOverviewStats] = useState(null);
    const [sessionAnalytics, setSessionAnalytics] = useState(null);
    const [householdAnalytics, setHouseholdAnalytics] = useState(null);
    const [dashboardAnalytics, setDashboardAnalytics] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [sessionReport, setSessionReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        fetchAnalyticsData();
        fetchSessions();
    }, []);

    const fetchAnalyticsData = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            
            const [overviewRes, sessionsRes, householdsRes, dashboardRes] = await Promise.all([
                fetch('http://localhost:5000/api/analytics/overview', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch('http://localhost:5000/api/analytics/sessions', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch('http://localhost:5000/api/analytics/households', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch('http://localhost:5000/api/analytics/dashboard', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            if (overviewRes.ok) setOverviewStats(await overviewRes.json());
            if (sessionsRes.ok) setSessionAnalytics(await sessionsRes.json());
            if (householdsRes.ok) setHouseholdAnalytics(await householdsRes.json());
            if (dashboardRes.ok) setDashboardAnalytics(await dashboardRes.json());

        } catch (error) {
            console.error('Error fetching analytics data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSessions = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('http://localhost:5000/api/sessions/admin/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setSessions(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching sessions:', error);
        }
    };

    const generateSessionReport = async (sessionId) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`http://localhost:5000/api/analytics/session-report/${sessionId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setSessionReport(data);
                setSelectedSession(sessionId);
            }
        } catch (error) {
            console.error('Error generating session report:', error);
        }
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Loading analytics...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
                    <p className="text-muted-foreground">
                        Comprehensive insights and data visualization
                    </p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="sessions">Sessions</TabsTrigger>
                    <TabsTrigger value="households">Households</TabsTrigger>
                    <TabsTrigger value="health">Health Trends</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    {/* Overview Stats Cards */}
                    {overviewStats && (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{overviewStats.sessions.total}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {overviewStats.sessions.completionRate}% completion rate
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Active Counsellors</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{overviewStats.counsellors.total}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Available for assignments
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Households Reached</CardTitle>
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{overviewStats.outreach.totalHouseholds}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Communities served
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Survey Responses</CardTitle>
                                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{overviewStats.outreach.totalSurveyResponses}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Health data collected
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Session Status Distribution */}
                    {sessionAnalytics && (
                        <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Session Status Distribution</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <RechartsPieChart>
                                            <Pie
                                                data={sessionAnalytics.statusDistribution}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="count"
                                            >
                                                {sessionAnalytics.statusDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </RechartsPieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Monthly Session Trends</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={sessionAnalytics.monthlyTrends}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="period" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="total" stroke="#8884d8" name="Total Sessions" />
                                            <Line type="monotone" dataKey="completed" stroke="#82ca9d" name="Completed" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </TabsContent>

                {/* Sessions Tab */}
                <TabsContent value="sessions" className="space-y-6">
                    {sessionAnalytics && (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Counsellor Performance</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Counsellor</TableHead>
                                                <TableHead>Total Sessions</TableHead>
                                                <TableHead>Completed</TableHead>
                                                <TableHead>Completion Rate</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {sessionAnalytics.counsellorPerformance.map((counsellor) => (
                                                <TableRow key={counsellor.counsellorId}>
                                                    <TableCell className="font-medium">
                                                        {counsellor.counsellorName || 'Unknown'}
                                                    </TableCell>
                                                    <TableCell>{counsellor.totalSessions}</TableCell>
                                                    <TableCell>{counsellor.completedSessions}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={counsellor.completionRate >= 80 ? "default" : "secondary"}>
                                                            {counsellor.completionRate}%
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </TabsContent>

                {/* Households Tab */}
                <TabsContent value="households" className="space-y-6">
                    {householdAnalytics && (
                        <>
                            <div className="grid gap-4 md:grid-cols-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Age Distribution</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={householdAnalytics.ageDistribution}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="_id" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="count" fill="#8884d8" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Top Health Risk Factors</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={householdAnalytics.healthRiskFactors} layout="horizontal">
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis type="number" />
                                                <YAxis dataKey="_id" type="category" width={100} />
                                                <Tooltip />
                                                <Bar dataKey="count" fill="#ff6b6b" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Household Composition</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 md:grid-cols-3">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold">
                                                {householdAnalytics.householdComposition.avgMemberCount?.toFixed(1) || 0}
                                            </div>
                                            <p className="text-sm text-muted-foreground">Avg Members per Household</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold">
                                                {householdAnalytics.householdComposition.householdsWithChildren || 0}
                                            </div>
                                            <p className="text-sm text-muted-foreground">Households with Children</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold">
                                                {householdAnalytics.householdComposition.householdsWithElderly || 0}
                                            </div>
                                            <p className="text-sm text-muted-foreground">Households with Elderly</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </TabsContent>

                {/* Health Trends Tab */}
                <TabsContent value="health" className="space-y-6">
                    {dashboardAnalytics && (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <AlertTriangle className="h-5 w-5 text-red-500" />
                                        Top Risk Factors
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {dashboardAnalytics.riskTrends.slice(0, 5).map((item, index) => (
                                            <div key={index} className="flex justify-between items-center">
                                                <span className="text-sm truncate">{item.item}</span>
                                                <Badge variant="destructive">{item.count}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        Positive Indicators
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {dashboardAnalytics.positiveTrends.slice(0, 5).map((item, index) => (
                                            <div key={index} className="flex justify-between items-center">
                                                <span className="text-sm truncate">{item.item}</span>
                                                <Badge variant="default">{item.count}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="h-5 w-5 text-blue-500" />
                                        Counselling Focus
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {dashboardAnalytics.counsellingTrends.slice(0, 5).map((item, index) => (
                                            <div key={index} className="flex justify-between items-center">
                                                <span className="text-sm truncate">{item.item}</span>
                                                <Badge variant="secondary">{item.count}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </TabsContent>

                {/* Reports Tab */}
                <TabsContent value="reports" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Generate Session Reports</CardTitle>
                            <CardDescription>
                                Select a session to generate a comprehensive AI-powered report
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Select onValueChange={generateSessionReport}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a session" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sessions.map((session) => (
                                            <SelectItem key={session._id} value={session._id}>
                                                {session.name} - {format(new Date(session.scheduledDateTime), 'MMM dd, yyyy')}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {sessionReport && (
                                    <div className="space-y-4 mt-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold">Session Report</h3>
                                            <Button variant="outline" size="sm">
                                                <Download className="h-4 w-4 mr-2" />
                                                Export PDF
                                            </Button>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>Executive Summary</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-sm">{sessionReport.aiReport.executiveSummary}</p>
                                                </CardContent>
                                            </Card>

                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>Key Statistics</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between">
                                                            <span>Total Households:</span>
                                                            <span className="font-medium">{sessionReport.aiReport.statistics.totalHouseholds}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Total Members:</span>
                                                            <span className="font-medium">{sessionReport.aiReport.statistics.totalMembers}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Avg Members/Household:</span>
                                                            <span className="font-medium">{sessionReport.aiReport.statistics.avgMembersPerHousehold}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Completion Rate:</span>
                                                            <span className="font-medium">{sessionReport.aiReport.statistics.completionRate}%</span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Key Findings</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <ul className="space-y-2">
                                                    {sessionReport.aiReport.keyFindings.map((finding, index) => (
                                                        <li key={index} className="flex items-start gap-2">
                                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                                            <span className="text-sm">{finding}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>Health Trends</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <ul className="space-y-1">
                                                        {sessionReport.aiReport.healthTrends.map((trend, index) => (
                                                            <li key={index} className="text-sm">• {trend}</li>
                                                        ))}
                                                    </ul>
                                                </CardContent>
                                            </Card>

                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>Recommendations</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <ul className="space-y-1">
                                                        {sessionReport.aiReport.recommendations.map((rec, index) => (
                                                            <li key={index} className="text-sm">• {rec}</li>
                                                        ))}
                                                    </ul>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AnalyticsPage; 