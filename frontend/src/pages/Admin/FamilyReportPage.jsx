import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
    ArrowLeft, 
    Users, 
    MapPin, 
    Calendar, 
    AlertTriangle, 
    CheckCircle, 
    Target,
    Download,
    FileText,
    Heart,
    Shield,
    TrendingUp
} from "lucide-react";

const FamilyReportPage = () => {
    const { householdId } = useParams();
    const [familyReport, setFamilyReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFamilyReport();
    }, [householdId]);

    const fetchFamilyReport = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`http://localhost:5000/api/analytics/family-report/${householdId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setFamilyReport(data);
            } else {
                setError('Failed to fetch family report');
            }
        } catch (error) {
            console.error('Error fetching family report:', error);
            setError('Error fetching family report');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Loading family report...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-red-500">{error}</div>
            </div>
        );
    }

    if (!familyReport) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">No family report found</div>
            </div>
        );
    }

    const { household, surveyResponses, aiReport } = familyReport;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/admin/analytics">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Analytics
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Family Health Report</h1>
                        <p className="text-muted-foreground">
                            Detailed health analysis for {household.address}
                        </p>
                    </div>
                </div>
                <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                </Button>
            </div>

            {/* Family Overview */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Family Overview
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Address</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {household.address}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Family Members</p>
                            <p className="text-sm text-muted-foreground">
                                {household.members.length} members
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Session</p>
                            <p className="text-sm text-muted-foreground">
                                {household.counsellingSession?.name || 'N/A'}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Counsellor</p>
                            <p className="text-sm text-muted-foreground">
                                {household.counsellor?.name || 'Not assigned'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* AI Generated Report */}
            {aiReport && (
                <div className="space-y-6">
                    {/* Executive Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Family Profile
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm leading-relaxed">{aiReport.familyProfile}</p>
                        </CardContent>
                    </Card>

                    {/* Health Assessment */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Heart className="h-5 w-5 text-red-500" />
                                    Health Assessment
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium mb-2">Overall Health Status</p>
                                    <Badge variant="outline">{aiReport.healthAssessment.overallHealth}</Badge>
                                </div>
                                
                                <div>
                                    <p className="text-sm font-medium mb-2">Risk Factors</p>
                                    <div className="space-y-1">
                                        {aiReport.healthAssessment.riskFactors.map((risk, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                                <span className="text-sm">{risk}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium mb-2">Positive Practices</p>
                                    <div className="space-y-1">
                                        {aiReport.healthAssessment.positivePractices.map((practice, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                <span className="text-sm">{practice}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="h-5 w-5 text-blue-500" />
                                    Recommendations
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium mb-2">Immediate Actions</p>
                                    <ul className="space-y-1">
                                        {aiReport.recommendations.immediate.map((rec, index) => (
                                            <li key={index} className="text-sm flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                                {rec}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <p className="text-sm font-medium mb-2">Short-term Goals</p>
                                    <ul className="space-y-1">
                                        {aiReport.recommendations.shortTerm.map((rec, index) => (
                                            <li key={index} className="text-sm flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                                                {rec}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <p className="text-sm font-medium mb-2">Long-term Goals</p>
                                    <ul className="space-y-1">
                                        {aiReport.recommendations.longTerm.map((rec, index) => (
                                            <li key={index} className="text-sm flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                                {rec}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Counselling Notes & Follow-up */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-purple-500" />
                                    Counselling Notes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm leading-relaxed">{aiReport.counsellingNotes}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-green-500" />
                                    Follow-up Plan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm leading-relaxed">{aiReport.followUpPlan}</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* Family Members Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Family Members</CardTitle>
                    <CardDescription>
                        Detailed information about each family member
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Age</TableHead>
                                <TableHead>Gender</TableHead>
                                <TableHead>Relationship</TableHead>
                                <TableHead>Health Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {household.members.map((member, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{member.name}</TableCell>
                                    <TableCell>{member.age}</TableCell>
                                    <TableCell>{member.gender}</TableCell>
                                    <TableCell>{member.relationship}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {member.healthStatus || 'Not specified'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Survey Responses */}
            {surveyResponses.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Survey Responses</CardTitle>
                        <CardDescription>
                            Health survey data collected from the family
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {surveyResponses.map((response, index) => (
                                <div key={index} className="border rounded-lg p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <p className="font-medium text-sm">{response.question}</p>
                                        {response.heatmapData && (
                                            <Badge variant={
                                                response.heatmapData.riskLevel === 'high' ? 'destructive' :
                                                response.heatmapData.riskLevel === 'medium' ? 'secondary' : 'outline'
                                            }>
                                                {response.heatmapData.riskLevel} risk
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{response.answer}</p>
                                    {response.heatmapData?.tags && response.heatmapData.tags.length > 0 && (
                                        <div className="flex gap-1 mt-2">
                                            {response.heatmapData.tags.map((tag, tagIndex) => (
                                                <Badge key={tagIndex} variant="outline" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Health Analysis Summary */}
            {household.healthAnalysis && (
                <Card>
                    <CardHeader>
                        <CardTitle>Health Analysis Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <p className="text-sm font-medium mb-2">Key Risk Factors</p>
                                <div className="space-y-1">
                                    {household.healthAnalysis.keyRiskFactors?.map((risk, index) => (
                                        <Badge key={index} variant="destructive" className="mr-1 mb-1">
                                            {risk}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium mb-2">Positive Indicators</p>
                                <div className="space-y-1">
                                    {household.healthAnalysis.positiveIndicators?.map((indicator, index) => (
                                        <Badge key={index} variant="default" className="mr-1 mb-1">
                                            {indicator}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium mb-2">Counselling Focus</p>
                                <div className="space-y-1">
                                    {household.healthAnalysis.counsellingFocus?.map((focus, index) => (
                                        <Badge key={index} variant="secondary" className="mr-1 mb-1">
                                            {focus}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default FamilyReportPage; 