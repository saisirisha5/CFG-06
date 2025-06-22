import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, MapPin, Plus, FileText } from "lucide-react";
import { format } from "date-fns";

const CreateSessionPage = () => {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        longitude: '',
        latitude: '',
        scheduledDateTime: '',
        durationMinutes: 240,
        regionalData: {
            demographics: '',
            nutritionStatus: '',
            healthTrends: '',
            serviceGaps: '',
            behavioralData: '',
            educationLevels: '',
            languageTechAccess: ''
        }
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [isGeocoding, setIsGeocoding] = useState(false);

    // Fetch all sessions on component mount
    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('http://localhost:5000/api/sessions/admin/all', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setSessions(data.data || []);
            } else {
                console.error('Failed to fetch sessions');
            }
        } catch (error) {
            console.error('Error fetching sessions:', error);
        } finally {
            setLoading(false);
        }
    };

    // Geocoding function
    const geocodeAddress = async (address) => {
        if (!address.trim()) return;
        
        setIsGeocoding(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
            );
            const data = await response.json();
            
            if (data && data.length > 0) {
                const { lon, lat } = data[0];
                setFormData(prev => ({
                    ...prev,
                    longitude: parseFloat(lon).toFixed(6),
                    latitude: parseFloat(lat).toFixed(6)
                }));
                setErrors(prev => ({ ...prev, longitude: '', latitude: '' }));
            } else {
                setErrors(prev => ({ 
                    ...prev, 
                    address: 'Could not find coordinates for this address. Please check the address or enter coordinates manually.' 
                }));
            }
        } catch {
            setErrors(prev => ({ 
                ...prev, 
                address: 'Error getting coordinates. Please enter them manually.' 
            }));
        } finally {
            setIsGeocoding(false);
        }
    };

    // Auto-geocode when address changes
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (formData.address && !formData.longitude && !formData.latitude) {
                geocodeAddress(formData.address);
            }
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [formData.address]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Session name is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.longitude || isNaN(formData.longitude)) newErrors.longitude = 'Valid longitude is required';
        if (!formData.latitude || isNaN(formData.latitude)) newErrors.latitude = 'Valid latitude is required';
        if (!formData.scheduledDateTime) newErrors.scheduledDateTime = 'Scheduled date and time is required';
        if (!formData.durationMinutes || formData.durationMinutes < 15 || formData.durationMinutes > 480) {
            newErrors.durationMinutes = 'Duration must be between 15 and 480 minutes';
        }

        // Regional data validation
        if (!formData.regionalData.demographics.trim()) newErrors.demographics = 'Demographics data is required';
        if (!formData.regionalData.nutritionStatus.trim()) newErrors.nutritionStatus = 'Nutrition status data is required';
        if (!formData.regionalData.healthTrends.trim()) newErrors.healthTrends = 'Health trends data is required';
        if (!formData.regionalData.serviceGaps.trim()) newErrors.serviceGaps = 'Service gaps data is required';
        if (!formData.regionalData.behavioralData.trim()) newErrors.behavioralData = 'Behavioral data is required';
        if (!formData.regionalData.educationLevels.trim()) newErrors.educationLevels = 'Education levels data is required';
        if (!formData.regionalData.languageTechAccess.trim()) newErrors.languageTechAccess = 'Language and tech access data is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleRegionalDataChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            regionalData: {
                ...prev.regionalData,
                [field]: value
            }
        }));
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleManualGeocode = () => {
        geocodeAddress(formData.address);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('http://localhost:5000/api/sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    longitude: parseFloat(formData.longitude),
                    latitude: parseFloat(formData.latitude),
                    durationMinutes: parseInt(formData.durationMinutes)
                })
            });

            if (response.ok) {
                await response.json();
                setSubmitStatus({ type: 'success', message: 'Counselling session created successfully!' });
                setIsPopoverOpen(false);
                fetchSessions(); // Refresh the sessions list
                
                // Reset form
                setFormData({
                    name: '',
                    address: '',
                    longitude: '',
                    latitude: '',
                    scheduledDateTime: '',
                    durationMinutes: 240,
                    regionalData: {
                        demographics: '',
                        nutritionStatus: '',
                        healthTrends: '',
                        serviceGaps: '',
                        behavioralData: '',
                        educationLevels: '',
                        languageTechAccess: ''
                    }
                });
            } else {
                const errorData = await response.json();
                setSubmitStatus({ type: 'error', message: errorData.message || 'Failed to create session' });
            }
        } catch {
            setSubmitStatus({ type: 'error', message: 'Network error. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getCurrentDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
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
                <div className="text-lg">Loading sessions...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Counselling Sessions</h1>
                    <p className="text-muted-foreground">
                        Manage and view all counselling sessions
                    </p>
                </div>
                
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Session
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[800px] max-h-[80vh] overflow-y-auto" align="end">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">Create New Session</h4>
                                <p className="text-sm text-muted-foreground">
                                    Fill in the details to create a new counselling session
                                </p>
                            </div>
                            
                            {submitStatus && (
                                <div className={`p-3 rounded-md text-sm ${
                                    submitStatus.type === 'success' 
                                        ? 'bg-green-50 border border-green-200 text-green-800' 
                                        : 'bg-red-50 border border-red-200 text-red-800'
                                }`}>
                                    {submitStatus.message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Session Details */}
                                <div className="space-y-3">
                                    <h5 className="font-medium">Session Details</h5>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Session Name *</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Enter session name"
                                                className={errors.name ? 'border-red-500' : ''}
                                            />
                                            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="durationMinutes">Duration (minutes) *</Label>
                                            <Input
                                                id="durationMinutes"
                                                type="number"
                                                name="durationMinutes"
                                                value={formData.durationMinutes}
                                                onChange={handleInputChange}
                                                min="15"
                                                max="480"
                                                className={errors.durationMinutes ? 'border-red-500' : ''}
                                            />
                                            {errors.durationMinutes && <p className="text-red-500 text-xs">{errors.durationMinutes}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address">Address *</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="address"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                placeholder="Enter full address"
                                                className={errors.address ? 'border-red-500' : ''}
                                            />
                                            <Button
                                                type="button"
                                                onClick={handleManualGeocode}
                                                disabled={isGeocoding || !formData.address}
                                                variant="outline"
                                                size="sm"
                                            >
                                                {isGeocoding ? 'Getting...' : 'Get Coords'}
                                            </Button>
                                        </div>
                                        {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="longitude">Longitude *</Label>
                                            <Input
                                                id="longitude"
                                                type="number"
                                                name="longitude"
                                                value={formData.longitude}
                                                onChange={handleInputChange}
                                                step="any"
                                                placeholder="e.g., 73.852066"
                                                className={errors.longitude ? 'border-red-500' : ''}
                                            />
                                            {errors.longitude && <p className="text-red-500 text-xs">{errors.longitude}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="latitude">Latitude *</Label>
                                            <Input
                                                id="latitude"
                                                type="number"
                                                name="latitude"
                                                value={formData.latitude}
                                                onChange={handleInputChange}
                                                step="any"
                                                placeholder="e.g., 20.035725"
                                                className={errors.latitude ? 'border-red-500' : ''}
                                            />
                                            {errors.latitude && <p className="text-red-500 text-xs">{errors.latitude}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="scheduledDateTime">Scheduled Date & Time *</Label>
                                        <Input
                                            id="scheduledDateTime"
                                            type="datetime-local"
                                            name="scheduledDateTime"
                                            value={formData.scheduledDateTime}
                                            onChange={handleInputChange}
                                            min={getCurrentDateTime()}
                                            className={errors.scheduledDateTime ? 'border-red-500' : ''}
                                        />
                                        {errors.scheduledDateTime && <p className="text-red-500 text-xs">{errors.scheduledDateTime}</p>}
                                    </div>
                                </div>

                                {/* Regional Data */}
                                <div className="space-y-3">
                                    <h5 className="font-medium">Regional Data</h5>
                                    <p className="text-xs text-muted-foreground">
                                        This data will be used by Gemini API to generate region-specific questions
                                    </p>
                                    
                                    {[
                                        { key: 'demographics', label: 'Demographics', placeholder: 'e.g., Women and children, age distribution' },
                                        { key: 'nutritionStatus', label: 'Nutrition Status', placeholder: 'e.g., High iron deficiency, malnutrition rates' },
                                        { key: 'healthTrends', label: 'Health Trends', placeholder: 'e.g., Seasonal flu, common diseases' },
                                        { key: 'serviceGaps', label: 'Service Gaps', placeholder: 'e.g., Few doctors, limited healthcare facilities' },
                                        { key: 'behavioralData', label: 'Behavioral Data', placeholder: 'e.g., Prefers traditional medicine, cultural practices' },
                                        { key: 'educationLevels', label: 'Education Levels', placeholder: 'e.g., High literacy, education access' },
                                        { key: 'languageTechAccess', label: 'Language & Tech Access', placeholder: 'e.g., Hindi, high smartphone use' }
                                    ].map(({ key, label, placeholder }) => (
                                        <div key={key} className="space-y-2">
                                            <Label htmlFor={key}>{label} *</Label>
                                            <Textarea
                                                id={key}
                                                value={formData.regionalData[key]}
                                                onChange={(e) => handleRegionalDataChange(key, e.target.value)}
                                                placeholder={placeholder}
                                                rows="2"
                                                className={errors[key] ? 'border-red-500' : ''}
                                            />
                                            {errors[key] && <p className="text-red-500 text-xs">{errors[key]}</p>}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsPopoverOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Creating...' : 'Create Session'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Sessions Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Sessions Overview</CardTitle>
                    <CardDescription>
                        All counselling sessions created by you
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {sessions.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No sessions created yet. Create your first session to get started.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Session Name</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Scheduled</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Assigned Counsellor</TableHead>
                                    <TableHead>Questions</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sessions.map((session) => (
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
                                            <Badge variant={getStatusBadgeVariant(session.status)}>
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
                                            <div className="flex items-center gap-1">
                                                <FileText className="h-3 w-3" />
                                                <span>{session.questions ? session.questions.length : 0} questions</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => navigate(`/admin/sessions/${session._id}`)}
                                            >
                                                <FileText className="h-3 w-3 mr-1" />
                                                View Details
                                            </Button>
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

export default CreateSessionPage; 