import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MapPin, Clock, User, Search, Filter, Calendar, Eye } from 'lucide-react';

const AttendanceDisplay = () => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerified, setFilterVerified] = useState('all');
  const [selectedAttendance, setSelectedAttendance] = useState(null);

  useEffect(() => {
    fetchAttendances();
  }, []);

  const fetchAttendances = async () => {
    try {
      const response = await fetch('/api/counsellor/attendance');
      const data = await response.json();
      
      if (response.ok) {
        setAttendances(data.attendances || []);
      } else {
        setError(data.message || 'Failed to fetch attendances');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredAttendances = attendances.filter(attendance => {
    const matchesSearch = attendance.counsellorId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterVerified === 'all' || 
      (filterVerified === 'verified' && attendance.locationVerified) ||
      (filterVerified === 'unverified' && !attendance.locationVerified);
    
    return matchesSearch && matchesFilter;
  });

  const openInMaps = (latitude, longitude) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading attendance records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Attendance Records
          </CardTitle>
          <CardDescription>
            View and manage geo-tagged attendance records
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by counsellor ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterVerified === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterVerified('all')}
              >
                All
              </Button>
              <Button
                variant={filterVerified === 'verified' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterVerified('verified')}
              >
                Verified
              </Button>
              <Button
                variant={filterVerified === 'unverified' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterVerified('unverified')}
              >
                Unverified
              </Button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md mb-4">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Attendance Records Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAttendances.map((attendance) => (
              <Card key={attendance._id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {attendance.counsellorId}
                    </CardTitle>
                    <div className={`h-3 w-3 rounded-full ${attendance.locationVerified ? 'bg-green-500' : 'bg-red-500'}`} />
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
                      {attendance.latitude.toFixed(6)}, {attendance.longitude.toFixed(6)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <div className={`h-3 w-3 rounded-full ${attendance.locationVerified ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className={attendance.locationVerified ? 'text-green-600' : 'text-red-600'}>
                      {attendance.locationVerified ? 'Location Verified' : 'Location Not Verified'}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openInMaps(attendance.latitude, attendance.longitude)}
                      className="flex-1"
                    >
                      <MapPin className="h-3 w-3 mr-1" />
                      View Map
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedAttendance(attendance)}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAttendances.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No attendance records found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed View Modal */}
      {selectedAttendance && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Attendance Details</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedAttendance(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Counsellor ID</label>
                  <p className="text-lg">{selectedAttendance.counsellorId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${selectedAttendance.locationVerified ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className={selectedAttendance.locationVerified ? 'text-green-600' : 'text-red-600'}>
                      {selectedAttendance.locationVerified ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Time In</label>
                <p>{formatDate(selectedAttendance.timeIn)}</p>
              </div>

              {selectedAttendance.timeOut && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Time Out</label>
                  <p>{formatDate(selectedAttendance.timeOut)}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-muted-foreground">Location Coordinates</label>
                <p className="font-mono text-sm">
                  {selectedAttendance.latitude.toFixed(8)}, {selectedAttendance.longitude.toFixed(8)}
                </p>
              </div>

              {selectedAttendance.imageUrl && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Uploaded Image</label>
                  <div className="mt-2">
                    <img
                      src={selectedAttendance.imageUrl}
                      alt="Attendance photo"
                      className="max-w-full h-auto rounded-md border"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <p className="text-sm text-muted-foreground hidden">Image not available</p>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => openInMaps(selectedAttendance.latitude, selectedAttendance.longitude)}
                  className="flex-1"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Open in Maps
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedAttendance(null)}
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AttendanceDisplay; 