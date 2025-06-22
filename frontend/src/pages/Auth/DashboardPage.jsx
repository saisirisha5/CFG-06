import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Clock, MapPin, Users, FileText, BarChart3, TrendingUp, AlertCircle, CheckCircle, UserPlus } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [recentSessions, setRecentSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            
            // Fetch overview stats
            const statsResponse = await fetch('http://localhost:5000/api/analytics/overview', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Fetch recent sessions
            const sessionsResponse = await fetch('http://localhost:5000/api/sessions/admin/all', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (statsResponse.ok && sessionsResponse.ok) {
                const statsData = await statsResponse.json();
                const sessionsData = await sessionsResponse.json();
                
                setStats(statsData);
                // Get the 5 most recent sessions
                setRecentSessions(sessionsData.data.slice(0, 5));
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'Pending': return 'secondary';
            case 'Assigned': return 'default';
            case 'Completed': return 'default';
            case 'Rejected': return 'destructive';
            default: return 'secondary';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <AlertCircle className="h-4 w-4" />;
            case 'Assigned': return <UserPlus className="h-4 w-4" />;
            case 'Completed': return <CheckCircle className="h-4 w-4" />;
            default: return <AlertCircle className="h-4 w-4" />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
        <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Overview of your counselling sessions and analytics
                    </p>
                </div>
                <Button onClick={() => navigate('/admin/sessions')}>
                    <FileText className="mr-2 h-4 w-4" />
                    View All Sessions
                </Button>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.sessions.total}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.sessions.pending} pending, {stats.sessions.completed} completed
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Counsellors</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.counsellors.total}</div>
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
                            <div className="text-2xl font-bold">{stats.outreach.totalHouseholds}</div>
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
                            <div className="text-2xl font-bold">{stats.outreach.totalSurveyResponses}</div>
                            <p className="text-xs text-muted-foreground">
                                Health data collected
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Recent Sessions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Recent Sessions
                    </CardTitle>
                    <CardDescription>
                        Latest counselling sessions created
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {recentSessions.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Session Name</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Scheduled</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Counsellor</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentSessions.map((session) => (
                                    <TableRow key={session._id}>
                                        <TableCell className="font-medium">{session.name}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                <span className="text-sm">{session.address}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                <span className="text-sm">
                                                    {format(new Date(session.scheduledDateTime), 'MMM dd, yyyy')}
                                                </span>
                                                <Clock className="h-3 w-3" />
                                                <span className="text-sm">
                                                    {format(new Date(session.scheduledDateTime), 'HH:mm')}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(session.status)} className="flex items-center gap-1">
                                                {getStatusIcon(session.status)}
                                                {session.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {session.assignedCounsellor ? (
                                                <div className="text-sm">
                                                    <div className="font-medium">{session.assignedCounsellor.name}</div>
                                                    <div className="text-muted-foreground">{session.assignedCounsellor.email}</div>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground text-sm">Not assigned</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => navigate(`/admin/sessions/${session._id}`)}
                                            >
                                                <FileText className="h-3 w-3 mr-1" />
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No sessions created yet.</p>
                            <p className="text-sm">Create your first session to get started.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5" />
                            Quick Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button 
                            className="w-full justify-start" 
                            onClick={() => navigate('/admin/sessions')}
                        >
                            <FileText className="mr-2 h-4 w-4" />
                            Create New Session
                        </Button>
                        <Button 
                            variant="outline" 
                            className="w-full justify-start"
                            onClick={() => navigate('/admin/sessions')}
                        >
                            <BarChart3 className="mr-2 h-4 w-4" />
                            View All Sessions
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Performance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats && (
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm">Completion Rate</span>
                                    <span className="text-sm font-medium">
                                        {stats.sessions.total > 0 
                                            ? Math.round((stats.sessions.completed / stats.sessions.total) * 100)
                                            : 0}%
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">Pending Sessions</span>
                                    <span className="text-sm font-medium">{stats.sessions.pending}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">Avg. Response Rate</span>
                                    <span className="text-sm font-medium">
                                        {stats.outreach.totalHouseholds > 0 
                                            ? Math.round((stats.outreach.totalSurveyResponses / stats.outreach.totalHouseholds) * 100)
                                            : 0}%
                                    </span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            Alerts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {stats && stats.sessions.pending > 0 && (
                                <div className="flex items-center gap-2 text-sm text-orange-600">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>{stats.sessions.pending} sessions pending assignment</span>
                                </div>
                            )}
                            {stats && stats.sessions.total === 0 && (
                                <div className="flex items-center gap-2 text-sm text-blue-600">
                                    <FileText className="h-4 w-4" />
                                    <span>No sessions created yet</span>
                                </div>
                            )}
                            {stats && stats.counsellors.total === 0 && (
                                <div className="flex items-center gap-2 text-sm text-red-600">
                                    <Users className="h-4 w-4" />
                                    <span>No counsellors registered</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage; 