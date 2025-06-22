import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { MapPin, Clock, User, CheckCircle, XCircle } from 'lucide-react';

const AttendanceDemo = () => {
  // Example attendance data for demonstration
  const demoAttendances = [
    {
      _id: '1',
      counsellorId: 'COUN001',
      latitude: 28.6139,
      longitude: 77.2090,
      timeIn: new Date('2024-01-15T09:30:00'),
      locationVerified: true,
      imageUrl: '/static/images/demo1.jpg'
    },
    {
      _id: '2',
      counsellorId: 'COUN002',
      latitude: 28.7041,
      longitude: 77.1025,
      timeIn: new Date('2024-01-15T10:15:00'),
      locationVerified: false,
      imageUrl: '/static/images/demo2.jpg'
    },
    {
      _id: '3',
      counsellorId: 'COUN003',
      latitude: 28.4595,
      longitude: 77.0266,
      timeIn: new Date('2024-01-15T11:00:00'),
      locationVerified: true,
      imageUrl: '/static/images/demo3.jpg'
    }
  ];

  const openInMaps = (latitude, longitude) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  const formatDate = (date) => {
    return date.toLocaleString();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Geo-Tagged Attendance System Demo
          </CardTitle>
          <CardDescription>
            This demonstrates how the geo-tagged attendance system works. Counsellors upload photos with GPS coordinates, and the system verifies their location against scheduled sessions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoAttendances.map((attendance) => (
              <Card key={attendance._id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {attendance.counsellorId}
                    </CardTitle>
                    {attendance.locationVerified ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(attendance.timeIn)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {attendance.latitude.toFixed(4)}, {attendance.longitude.toFixed(4)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    {attendance.locationVerified ? (
                      <span className="text-green-600 font-medium">✓ Location Verified</span>
                    ) : (
                      <span className="text-red-600 font-medium">✗ Location Not Verified</span>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openInMaps(attendance.latitude, attendance.longitude)}
                    className="w-full"
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    View on Map
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Counsellor takes a photo with GPS enabled camera</li>
              <li>2. Photo is uploaded with counsellor ID</li>
              <li>3. System extracts GPS coordinates from photo metadata</li>
              <li>4. Location is verified against scheduled session location</li>
              <li>5. Attendance is marked as verified/unverified based on proximity</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceDemo; 