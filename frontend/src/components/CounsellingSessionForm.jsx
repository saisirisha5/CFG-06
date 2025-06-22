import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';

const CounsellingSessionForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    longitude: '',
    latitude: '',
    scheduledDateTime: '',
    durationMinutes: 60,
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

  // Geocoding function to convert address to coordinates
  const geocodeAddress = async (address) => {
    if (!address.trim()) return;
    
    setIsGeocoding(true);
    try {
      // Using OpenStreetMap Nominatim API (free)
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
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        address: 'Error getting coordinates. Please enter them manually.' 
      }));
    } finally {
      setIsGeocoding(false);
    }
  };

  // Auto-geocode when address changes (with debounce)
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

    // Basic session validation
    if (!formData.name.trim()) {
      newErrors.name = 'Session name is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.longitude || isNaN(formData.longitude)) {
      newErrors.longitude = 'Valid longitude is required';
    }
    if (!formData.latitude || isNaN(formData.latitude)) {
      newErrors.latitude = 'Valid latitude is required';
    }
    if (!formData.scheduledDateTime) {
      newErrors.scheduledDateTime = 'Scheduled date and time is required';
    }
    if (!formData.durationMinutes || formData.durationMinutes < 15 || formData.durationMinutes > 480) {
      newErrors.durationMinutes = 'Duration must be between 15 and 480 minutes';
    }

    // Regional data validation
    if (!formData.regionalData.demographics.trim()) {
      newErrors.demographics = 'Demographics data is required';
    }
    if (!formData.regionalData.nutritionStatus.trim()) {
      newErrors.nutritionStatus = 'Nutrition status data is required';
    }
    if (!formData.regionalData.healthTrends.trim()) {
      newErrors.healthTrends = 'Health trends data is required';
    }
    if (!formData.regionalData.serviceGaps.trim()) {
      newErrors.serviceGaps = 'Service gaps data is required';
    }
    if (!formData.regionalData.behavioralData.trim()) {
      newErrors.behavioralData = 'Behavioral data is required';
    }
    if (!formData.regionalData.educationLevels.trim()) {
      newErrors.educationLevels = 'Education levels data is required';
    }
    if (!formData.regionalData.languageTechAccess.trim()) {
      newErrors.languageTechAccess = 'Language and tech access data is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
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
    // Clear error when user starts typing
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
      const response = await fetch('http://localhost:5000/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          longitude: parseFloat(formData.longitude),
          latitude: parseFloat(formData.latitude),
          durationMinutes: parseInt(formData.durationMinutes)
        })
      });

      if (response.ok) {
        const result = await response.json();
        setSubmitStatus({ type: 'success', message: 'Counselling session created successfully!' });
        // Reset form
        setFormData({
          name: '',
          address: '',
          longitude: '',
          latitude: '',
          scheduledDateTime: '',
          durationMinutes: 60,
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
    } catch (error) {
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Counselling Session</h2>
        
        {submitStatus && (
          <div className={`mb-6 p-4 rounded-md ${
            submitStatus.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {submitStatus.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Session Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter session name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  name="durationMinutes"
                  value={formData.durationMinutes}
                  onChange={handleInputChange}
                  min="15"
                  max="480"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.durationMinutes ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.durationMinutes && <p className="text-red-500 text-sm mt-1">{errors.durationMinutes}</p>}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter full address (e.g., 123 Main St, City, State, Country)"
                />
                <Button
                  type="button"
                  onClick={handleManualGeocode}
                  disabled={isGeocoding || !formData.address}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isGeocoding ? 'Getting...' : 'Get Coordinates'}
                </Button>
              </div>
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude *
                </label>
                <input
                  type="number"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  step="any"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.longitude ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 77.2090"
                />
                {errors.longitude && <p className="text-red-500 text-sm mt-1">{errors.longitude}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude *
                </label>
                <input
                  type="number"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  step="any"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.latitude ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 28.6139"
                />
                {errors.latitude && <p className="text-red-500 text-sm mt-1">{errors.latitude}</p>}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scheduled Date & Time *
              </label>
              <input
                type="datetime-local"
                name="scheduledDateTime"
                value={formData.scheduledDateTime}
                onChange={handleInputChange}
                min={getCurrentDateTime()}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.scheduledDateTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.scheduledDateTime && <p className="text-red-500 text-sm mt-1">{errors.scheduledDateTime}</p>}
            </div>

            {/* Location Preview */}
            {formData.longitude && formData.latitude && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Location Preview</h4>
                <p className="text-sm text-blue-700">
                  Coordinates: {formData.latitude}, {formData.longitude}
                </p>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${formData.latitude}&mlon=${formData.longitude}&zoom=15`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  View on Map →
                </a>
              </div>
            )}
          </div>

          {/* Regional Data Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Data for Questionnaire Generation</h3>
            <p className="text-sm text-gray-600 mb-4">
              This data will be used by Gemini API to generate region-specific, interactive MCQs for the counselling session.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Demographics *
                </label>
                <textarea
                  value={formData.regionalData.demographics}
                  onChange={(e) => handleRegionalDataChange('demographics', e.target.value)}
                  rows="3"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.demographics ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Women 15-45 yrs: 1200, Children 0-6 yrs: 800, Literacy rate: 65%"
                />
                {errors.demographics && <p className="text-red-500 text-sm mt-1">{errors.demographics}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nutrition Status *
                </label>
                <textarea
                  value={formData.regionalData.nutritionStatus}
                  onChange={(e) => handleRegionalDataChange('nutritionStatus', e.target.value)}
                  rows="3"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.nutritionStatus ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Malnutrition rate: 35%, Anemia prevalence: 45%, Vitamin A deficiency: 25%"
                />
                {errors.nutritionStatus && <p className="text-red-500 text-sm mt-1">{errors.nutritionStatus}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Health Trends *
                </label>
                <textarea
                  value={formData.regionalData.healthTrends}
                  onChange={(e) => handleRegionalDataChange('healthTrends', e.target.value)}
                  rows="3"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.healthTrends ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Common illnesses: diarrhea, respiratory infections, Immunization coverage: 75%"
                />
                {errors.healthTrends && <p className="text-red-500 text-sm mt-1">{errors.healthTrends}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Gaps *
                </label>
                <textarea
                  value={formData.regionalData.serviceGaps}
                  onChange={(e) => handleRegionalDataChange('serviceGaps', e.target.value)}
                  rows="3"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.serviceGaps ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Number of AWWs: 5, Health facilities: 2 PHCs, Distance to nearest hospital: 15km"
                />
                {errors.serviceGaps && <p className="text-red-500 text-sm mt-1">{errors.serviceGaps}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Behavioral Data *
                </label>
                <textarea
                  value={formData.regionalData.behavioralData}
                  onChange={(e) => handleRegionalDataChange('behavioralData', e.target.value)}
                  rows="3"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.behavioralData ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Breastfeeding practices, cultural taboos, food preferences, hygiene practices"
                />
                {errors.behavioralData && <p className="text-red-500 text-sm mt-1">{errors.behavioralData}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Education Levels *
                </label>
                <textarea
                  value={formData.regionalData.educationLevels}
                  onChange={(e) => handleRegionalDataChange('educationLevels', e.target.value)}
                  rows="3"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.educationLevels ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Mother's literacy: 40%, Hygiene awareness: 60%, Nutrition knowledge: 30%"
                />
                {errors.educationLevels && <p className="text-red-500 text-sm mt-1">{errors.educationLevels}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language & Tech Access *
                </label>
                <textarea
                  value={formData.regionalData.languageTechAccess}
                  onChange={(e) => handleRegionalDataChange('languageTechAccess', e.target.value)}
                  rows="3"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.languageTechAccess ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Primary language: Hindi, Internet penetration: 25%, Smartphone usage: 40%"
                />
                {errors.languageTechAccess && <p className="text-red-500 text-sm mt-1">{errors.languageTechAccess}</p>}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              onClick={() => {
                setFormData({
                  name: '',
                  address: '',
                  longitude: '',
                  latitude: '',
                  scheduledDateTime: '',
                  durationMinutes: 60,
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
                setErrors({});
                setSubmitStatus(null);
              }}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Reset Form
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Creating Session...' : 'Create Session'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CounsellingSessionForm;