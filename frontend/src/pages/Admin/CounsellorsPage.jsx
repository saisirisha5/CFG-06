import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, CheckCircle, XCircle, Clock, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";

const CounsellorsPage = () => {
    const [counsellors, setCounsellors] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        fetchCounsellorsData();
    }, []);

    const fetchCounsellorsData = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            
            // Fetch counsellors
            const counsellorsResponse = await fetch('http://localhost:5000/api/counsellor/admin/all', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Fetch stats
            const statsResponse = await fetch('http://localhost:5000/api/counsellor/admin/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (counsellorsResponse.ok && statsResponse.ok) {
                const counsellorsData = await counsellorsResponse.json();
                const statsData = await statsResponse.json();
                
                setCounsellors(counsellorsData.data || []);
                setStats(statsData.data);
            }
        } catch (error) {
            console.error('Error fetching counsellors data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (counsellorId, newStatus) => {
        setUpdatingId(counsellorId);
        
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`http://localhost:5000/api/counsellor/admin/${counsellorId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                // Update the counsellor in the list
                setCounsellors(prev => prev.map(counsellor => 
                    counsellor._id === counsellorId 
                        ? { ...counsellor, status: newStatus }
                        : counsellor
                ));
                
                // Refresh stats
                fetchCounsellorsData();
            } else {
                console.error('Failed to update counsellor status');
            }
        } catch (error) {
            console.error('Error updating counsellor status:', error);
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'Pending': return 'secondary';
            case 'Approved': return 'default';
            case 'Rejected': return 'destructive';
            default: return 'secondary';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <Clock className="h-4 w-4" />;
            case 'Approved': return <CheckCircle className="h-4 w-4" />;
            case 'Rejected': return <XCircle className="h-4 w-4" />;
            default: return <Clock className="h-4 w-4" />;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'Invalid Date';
            }
            return format(date, 'MMM dd, yyyy');
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid Date';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Loading counsellors...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Counsellor Management</h1>
                    <p className="text-muted-foreground">
                        Manage and approve counsellor registrations
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Counsellors</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground">
                                All registered counsellors
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending}</div>
                            <p className="text-xs text-muted-foreground">
                                Awaiting review
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Approved</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.approved}</div>
                            <p className="text-xs text-muted-foreground">
                                Active counsellors
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.rejected}</div>
                            <p className="text-xs text-muted-foreground">
                                Not approved
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Counsellors Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        All Counsellors
                    </CardTitle>
                    <CardDescription>
                        Review and manage counsellor registrations
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {counsellors.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No counsellors registered yet.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Registered</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {counsellors.map((counsellor) => (
                                    <TableRow key={counsellor._id}>
                                        <TableCell className="font-medium">
                                            {counsellor.name || 'Counsellor'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Mail className="h-3 w-3" />
                                                    <span>{counsellor.email}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Phone className="h-3 w-3" />
                                                    <span>{counsellor.phone}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-sm">
                                                <MapPin className="h-3 w-3" />
                                                <span>{counsellor.address}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(counsellor.status)} className="flex items-center gap-1">
                                                {getStatusIcon(counsellor.status)}
                                                {counsellor.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-sm">
                                                <Calendar className="h-3 w-3" />
                                                <span>
                                                    {formatDate(counsellor.createdAt)}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {counsellor.status === 'Pending' && (
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleStatusUpdate(counsellor._id, 'Approved')}
                                                        disabled={updatingId === counsellor._id}
                                                        className="bg-green-600 hover:bg-green-700"
                                                    >
                                                        {updatingId === counsellor._id ? 'Updating...' : 'Approve'}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleStatusUpdate(counsellor._id, 'Rejected')}
                                                        disabled={updatingId === counsellor._id}
                                                    >
                                                        {updatingId === counsellor._id ? 'Updating...' : 'Reject'}
                                                    </Button>
                                                </div>
                                            )}
                                            {counsellor.status === 'Approved' && (
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleStatusUpdate(counsellor._id, 'Rejected')}
                                                    disabled={updatingId === counsellor._id}
                                                >
                                                    {updatingId === counsellor._id ? 'Updating...' : 'Reject'}
                                                </Button>
                                            )}
                                            {counsellor.status === 'Rejected' && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleStatusUpdate(counsellor._id, 'Approved')}
                                                    disabled={updatingId === counsellor._id}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    {updatingId === counsellor._id ? 'Updating...' : 'Approve'}
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default CounsellorsPage; 