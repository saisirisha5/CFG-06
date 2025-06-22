import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calendar, Clock, MapPin, FileText, User, Mail, Phone } from "lucide-react";
import { format } from "date-fns";

const SessionDetailsPage = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSessionDetails();
    }, [sessionId]);

    const fetchSessionDetails = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`http://localhost:5000/api/sessions/admin/${sessionId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setSession(data.data);
            } else {
                setError('Failed to fetch session details');
            }
        } catch (error) {
            console.error('Error fetching session details:', error);
            setError('Network error occurred');
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Loading session details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="text-lg text-red-600 mb-4">{error}</div>
                    <Button onClick={() => navigate('/admin/sessions')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Sessions
                    </Button>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="text-lg mb-4">Session not found</div>
                    <Button onClick={() => navigate('/admin/sessions')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Sessions
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/admin/sessions')}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Sessions
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{session.session.name}</h1>
                        <p className="text-muted-foreground">
                            Session details and generated questionnaire
                        </p>
                    </div>
                </div>
                <Badge variant={getStatusBadgeVariant(session.session.status)} className="text-sm">
                    {session.session.status}
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Session Information */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Session Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">Location:</span>
                                    <span>{session.session.address}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">Date:</span>
                                    <span>{format(new Date(session.session.scheduledDateTime), 'PPP')}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">Time:</span>
                                    <span>{format(new Date(session.session.scheduledDateTime), 'HH:mm')}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">Duration:</span>
                                    <span>{session.session.durationMinutes} minutes</span>
                                </div>
                            </div>

                            {/* Regional Data */}
                            <div className="pt-4 border-t">
                                <h4 className="font-medium mb-3">Regional Data</h4>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="font-medium">Demographics:</span>
                                        <p className="text-muted-foreground mt-1">{session.session.regionalData.demographics}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium">Nutrition Status:</span>
                                        <p className="text-muted-foreground mt-1">{session.session.regionalData.nutritionStatus}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium">Health Trends:</span>
                                        <p className="text-muted-foreground mt-1">{session.session.regionalData.healthTrends}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium">Service Gaps:</span>
                                        <p className="text-muted-foreground mt-1">{session.session.regionalData.serviceGaps}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium">Behavioral Data:</span>
                                        <p className="text-muted-foreground mt-1">{session.session.regionalData.behavioralData}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium">Education Levels:</span>
                                        <p className="text-muted-foreground mt-1">{session.session.regionalData.educationLevels}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium">Language & Tech Access:</span>
                                        <p className="text-muted-foreground mt-1">{session.session.regionalData.languageTechAccess}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Counsellor Information */}
                    {session.session.assignedCounsellor && (
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Assigned Counsellor
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">{session.session.assignedCounsellor.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{session.session.assignedCounsellor.email}</span>
                                </div>
                                {session.session.assignedCounsellor.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{session.session.assignedCounsellor.phone}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Questionnaire */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Generated Questionnaire
                            </CardTitle>
                            <CardDescription>
                                AI-generated questions based on regional data
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {session.questions && session.questions.length > 0 ? (
                                <div className="space-y-6">
                                    {session.questions.map((question, index) => (
                                        <div key={index} className="border rounded-lg p-6 bg-gray-50/50">
                                            <div className="flex items-start gap-4">
                                                <Badge variant="outline" className="mt-1 flex-shrink-0 text-sm">
                                                    Question {index + 1}
                                                </Badge>
                                                <div className="flex-1 space-y-3">
                                                    <p className="text-lg font-medium text-gray-900 leading-relaxed">
                                                        {question.questionText}
                                                    </p>
                                                    <div className="flex items-center gap-3">
                                                        <Badge variant="secondary" className="text-xs">
                                                            {question.questionType}
                                                        </Badge>
                                                        {question.options && question.options.length > 0 && (
                                                            <span className="text-xs text-muted-foreground">
                                                                {question.options.length} options available
                                                            </span>
                                                        )}
                                                    </div>
                                                    {question.options && question.options.length > 0 && (
                                                        <div className="mt-4 space-y-2">
                                                            <Label className="text-sm font-medium text-gray-700">Options:</Label>
                                                            <div className="grid gap-2">
                                                                {question.options.map((option, optIndex) => (
                                                                    <div key={optIndex} className="flex items-center gap-3 p-3 bg-white rounded-md border">
                                                                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                                                                            {String.fromCharCode(65 + optIndex)}
                                                                        </span>
                                                                        <span className="text-gray-900">{option}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground border rounded-lg">
                                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg mb-2">No questionnaire generated</p>
                                    <p className="text-sm">Questions are generated automatically when the session is created.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SessionDetailsPage; 