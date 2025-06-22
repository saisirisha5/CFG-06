import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Camera, Upload, MapPin, Clock, User } from 'lucide-react';

const GeoAttendanceUpload = () => {
  const [file, setFile] = useState(null);
  const [counsellorId, setCounsellorId] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid image file');
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !counsellorId) {
      setError('Please select an image and enter counsellor ID');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('counsellorId', counsellorId);

    try {
      const response = await fetch('/api/counsellor/attendance/geo-upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadResult(data.attendance);
        setFile(null);
        setCounsellorId('');
        // Reset file input
        e.target.reset();
      } else {
        setError(data.message || 'Upload failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Geo-Tagged Attendance Upload
          </CardTitle>
          <CardDescription>
            Upload a photo with GPS coordinates to mark attendance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="counsellorId" className="text-sm font-medium">
                Counsellor ID
              </label>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="counsellorId"
                  type="text"
                  placeholder="Enter counsellor ID"
                  value={counsellorId}
                  onChange={(e) => setCounsellorId(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="photo" className="text-sm font-medium">
                Photo with GPS Data
              </label>
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Make sure your photo contains GPS metadata for location verification
              </p>
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading || !file || !counsellorId}
              className="w-full"
            >
              {loading ? 'Uploading...' : 'Upload Attendance'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {uploadResult && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">Attendance Marked Successfully!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-600" />
              <span className="text-sm">
                Location: {uploadResult.latitude.toFixed(6)}, {uploadResult.longitude.toFixed(6)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="text-sm">
                Time: {new Date(uploadResult.timeIn).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-green-600" />
              <span className="text-sm">
                Counsellor ID: {uploadResult.counsellorId}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-4 w-4 rounded-full ${uploadResult.locationVerified ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm">
                Location Verified: {uploadResult.locationVerified ? 'Yes' : 'No'}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GeoAttendanceUpload; 