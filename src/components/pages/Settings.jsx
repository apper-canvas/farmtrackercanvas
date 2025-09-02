import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import FormField from "@/components/molecules/FormField";
import { toast } from "react-toastify";
import settingsService from "@/services/api/settingsService";
const Settings = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    farmProfile: false,
    notifications: false,
    appearance: false,
    dataManagement: false,
    privacy: false,
    mobileSync: false
  });

  // Form states for different categories
  const [farmProfile, setFarmProfile] = useState({
    farmName: '',
    location: '',
    acreage: '',
    farmType: '',
    contactEmail: '',
    phoneNumber: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    weatherAlerts: 'true',
    maintenanceReminders: 'true',
    harvestNotifications: 'false',
    fieldInspections: 'true',
    emailNotifications: 'true',
    smsNotifications: 'false'
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    defaultView: 'dashboard'
  });

  const [dataSettings, setDataSettings] = useState({
    autoBackup: 'true',
    backupFrequency: 'weekly',
    exportFormat: 'csv',
    retentionPeriod: '365'
  });

  const [privacySettings, setPrivacySettings] = useState({
    shareAnalytics: 'false',
    locationTracking: 'true',
    dataEncryption: 'true',
    thirdPartySharing: 'false'
  });

  const [mobileSyncSettings, setMobileSyncSettings] = useState({
    autoSync: 'true',
    syncFrequency: 'realtime',
    offlineMode: 'true',
    syncOverCellular: 'false'
  });

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await settingsService.getAll();
      setSettings(data);
      populateFormFields(data);
    } catch (err) {
      console.error('Error loading settings:', err);
      setError('Failed to load settings. Please try again.');
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const populateFormFields = (settingsData) => {
    // Convert settings array to object for easier lookup
    const settingsMap = {};
    settingsData.forEach(setting => {
      if (setting.name_c) {
        settingsMap[setting.name_c] = setting.value_c || '';
      }
    });

    // Populate farm profile
    setFarmProfile({
      farmName: settingsMap['farm_name'] || '',
      location: settingsMap['farm_location'] || '',
      acreage: settingsMap['farm_acreage'] || '',
      farmType: settingsMap['farm_type'] || '',
      contactEmail: settingsMap['contact_email'] || '',
      phoneNumber: settingsMap['phone_number'] || ''
    });

    // Populate notification settings
    setNotificationSettings({
      weatherAlerts: settingsMap['notify_weather'] || 'true',
      maintenanceReminders: settingsMap['notify_maintenance'] || 'true',
      harvestNotifications: settingsMap['notify_harvest'] || 'false',
      fieldInspections: settingsMap['notify_inspections'] || 'true',
      emailNotifications: settingsMap['notify_email'] || 'true',
      smsNotifications: settingsMap['notify_sms'] || 'false'
    });

    // Populate appearance settings
    setAppearanceSettings({
      theme: settingsMap['app_theme'] || 'light',
      language: settingsMap['app_language'] || 'en',
      dateFormat: settingsMap['date_format'] || 'MM/DD/YYYY',
      timeFormat: settingsMap['time_format'] || '12h',
      defaultView: settingsMap['default_view'] || 'dashboard'
    });

    // Populate data settings
    setDataSettings({
      autoBackup: settingsMap['auto_backup'] || 'true',
      backupFrequency: settingsMap['backup_frequency'] || 'weekly',
      exportFormat: settingsMap['export_format'] || 'csv',
      retentionPeriod: settingsMap['retention_period'] || '365'
    });

    // Populate privacy settings
    setPrivacySettings({
      shareAnalytics: settingsMap['share_analytics'] || 'false',
      locationTracking: settingsMap['location_tracking'] || 'true',
      dataEncryption: settingsMap['data_encryption'] || 'true',
      thirdPartySharing: settingsMap['third_party_sharing'] || 'false'
    });

    // Populate mobile sync settings
    setMobileSyncSettings({
      autoSync: settingsMap['mobile_auto_sync'] || 'true',
      syncFrequency: settingsMap['mobile_sync_frequency'] || 'realtime',
      offlineMode: settingsMap['mobile_offline_mode'] || 'true',
      syncOverCellular: settingsMap['mobile_sync_cellular'] || 'false'
    });
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const saveFarmProfile = async () => {
    setSaving(true);
    try {
      const promises = [
        settingsService.upsert('farm_name', farmProfile.farmName, 'Farm name'),
        settingsService.upsert('farm_location', farmProfile.location, 'Farm location'),
        settingsService.upsert('farm_acreage', farmProfile.acreage, 'Total farm acreage'),
        settingsService.upsert('farm_type', farmProfile.farmType, 'Type of farming operation'),
        settingsService.upsert('contact_email', farmProfile.contactEmail, 'Farm contact email'),
        settingsService.upsert('phone_number', farmProfile.phoneNumber, 'Farm contact phone number')
      ];

      await Promise.all(promises);
      toast.success('Farm profile updated successfully');
      await loadSettings(); // Reload to get updated data
    } catch (err) {
      console.error('Error saving farm profile:', err);
      toast.error('Failed to save farm profile');
    } finally {
      setSaving(false);
    }
  };

  const saveNotificationSettings = async () => {
    setSaving(true);
    try {
      const promises = [
        settingsService.upsert('notify_weather', notificationSettings.weatherAlerts, 'Weather alert notifications'),
        settingsService.upsert('notify_maintenance', notificationSettings.maintenanceReminders, 'Maintenance reminder notifications'),
        settingsService.upsert('notify_harvest', notificationSettings.harvestNotifications, 'Harvest notification alerts'),
        settingsService.upsert('notify_inspections', notificationSettings.fieldInspections, 'Field inspection reminders'),
        settingsService.upsert('notify_email', notificationSettings.emailNotifications, 'Email notification preference'),
        settingsService.upsert('notify_sms', notificationSettings.smsNotifications, 'SMS notification preference')
      ];

      await Promise.all(promises);
      toast.success('Notification settings updated successfully');
      await loadSettings();
    } catch (err) {
      console.error('Error saving notification settings:', err);
      toast.error('Failed to save notification settings');
    } finally {
      setSaving(false);
    }
  };

  const saveAppearanceSettings = async () => {
    setSaving(true);
    try {
      const promises = [
        settingsService.upsert('app_theme', appearanceSettings.theme, 'Application theme preference'),
        settingsService.upsert('app_language', appearanceSettings.language, 'Application language'),
        settingsService.upsert('date_format', appearanceSettings.dateFormat, 'Date format preference'),
        settingsService.upsert('time_format', appearanceSettings.timeFormat, 'Time format preference'),
        settingsService.upsert('default_view', appearanceSettings.defaultView, 'Default application view')
      ];

      await Promise.all(promises);
      toast.success('Appearance settings updated successfully');
      await loadSettings();
    } catch (err) {
      console.error('Error saving appearance settings:', err);
      toast.error('Failed to save appearance settings');
    } finally {
      setSaving(false);
    }
  };

  const saveDataSettings = async () => {
    setSaving(true);
    try {
      const promises = [
        settingsService.upsert('auto_backup', dataSettings.autoBackup, 'Automatic backup preference'),
        settingsService.upsert('backup_frequency', dataSettings.backupFrequency, 'Backup frequency setting'),
        settingsService.upsert('export_format', dataSettings.exportFormat, 'Data export format preference'),
        settingsService.upsert('retention_period', dataSettings.retentionPeriod, 'Data retention period in days')
      ];

      await Promise.all(promises);
      toast.success('Data management settings updated successfully');
      await loadSettings();
    } catch (err) {
      console.error('Error saving data settings:', err);
      toast.error('Failed to save data management settings');
    } finally {
      setSaving(false);
    }
  };

  const savePrivacySettings = async () => {
    setSaving(true);
    try {
      const promises = [
        settingsService.upsert('share_analytics', privacySettings.shareAnalytics, 'Share analytics data preference'),
        settingsService.upsert('location_tracking', privacySettings.locationTracking, 'Location tracking preference'),
        settingsService.upsert('data_encryption', privacySettings.dataEncryption, 'Data encryption preference'),
        settingsService.upsert('third_party_sharing', privacySettings.thirdPartySharing, 'Third party data sharing preference')
      ];

      await Promise.all(promises);
      toast.success('Privacy settings updated successfully');
      await loadSettings();
    } catch (err) {
      console.error('Error saving privacy settings:', err);
      toast.error('Failed to save privacy settings');
    } finally {
      setSaving(false);
    }
  };

  const saveMobileSyncSettings = async () => {
    setSaving(true);
    try {
      const promises = [
        settingsService.upsert('mobile_auto_sync', mobileSyncSettings.autoSync, 'Mobile auto sync preference'),
        settingsService.upsert('mobile_sync_frequency', mobileSyncSettings.syncFrequency, 'Mobile sync frequency'),
        settingsService.upsert('mobile_offline_mode', mobileSyncSettings.offlineMode, 'Mobile offline mode preference'),
        settingsService.upsert('mobile_sync_cellular', mobileSyncSettings.syncOverCellular, 'Sync over cellular data preference')
      ];

      await Promise.all(promises);
      toast.success('Mobile sync settings updated successfully');
      await loadSettings();
    } catch (err) {
      console.error('Error saving mobile sync settings:', err);
      toast.error('Failed to save mobile sync settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Loader2" className="w-6 h-6 animate-spin text-forest" />
          <span className="text-gray-600">Loading settings...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Settings</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={loadSettings} icon="RotateCcw">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display gradient-text">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your farm profile and application preferences</p>
        </div>
      </div>

      {/* Farm Profile Section */}
      <Card>
        <CardHeader>
          <button
            onClick={() => toggleSection('farmProfile')}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <ApperIcon name="User" className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 font-display">Farm Profile</h3>
                <p className="text-sm text-gray-600">Configure farm information and contact details</p>
              </div>
            </div>
            <ApperIcon 
              name={expandedSections.farmProfile ? "ChevronUp" : "ChevronDown"} 
              className="w-5 h-5 text-gray-400" 
            />
          </button>
        </CardHeader>
        {expandedSections.farmProfile && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Farm Name"
                type="input"
                value={farmProfile.farmName}
                onChange={(e) => setFarmProfile({...farmProfile, farmName: e.target.value})}
                placeholder="Enter farm name"
              />
              <FormField
                label="Location"
                type="input"
                value={farmProfile.location}
                onChange={(e) => setFarmProfile({...farmProfile, location: e.target.value})}
                placeholder="City, State/Province, Country"
              />
              <FormField
                label="Total Acreage"
                type="input"
                value={farmProfile.acreage}
                onChange={(e) => setFarmProfile({...farmProfile, acreage: e.target.value})}
                placeholder="Enter total acres"
              />
              <FormField
                label="Farm Type"
                type="select"
                value={farmProfile.farmType}
                onChange={(e) => setFarmProfile({...farmProfile, farmType: e.target.value})}
                options={[
                  { value: '', label: 'Select farm type' },
                  { value: 'row_crops', label: 'Row Crops' },
                  { value: 'livestock', label: 'Livestock' },
                  { value: 'dairy', label: 'Dairy' },
                  { value: 'mixed', label: 'Mixed Operation' },
                  { value: 'organic', label: 'Organic' },
                  { value: 'specialty', label: 'Specialty Crops' }
                ]}
              />
              <FormField
                label="Contact Email"
                type="input"
                inputType="email"
                value={farmProfile.contactEmail}
                onChange={(e) => setFarmProfile({...farmProfile, contactEmail: e.target.value})}
                placeholder="farm@example.com"
              />
              <FormField
                label="Phone Number"
                type="input"
                inputType="tel"
                value={farmProfile.phoneNumber}
                onChange={(e) => setFarmProfile({...farmProfile, phoneNumber: e.target.value})}
                placeholder="(555) 123-4567"
              />
            </div>
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={saveFarmProfile} 
                loading={saving}
                icon="Save"
              >
                Save Profile
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <button
            onClick={() => toggleSection('notifications')}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <ApperIcon name="Bell" className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 font-display">Notifications</h3>
                <p className="text-sm text-gray-600">Set up alerts for maintenance, weather, and field activities</p>
              </div>
            </div>
            <ApperIcon 
              name={expandedSections.notifications ? "ChevronUp" : "ChevronDown"} 
              className="w-5 h-5 text-gray-400" 
            />
          </button>
        </CardHeader>
        {expandedSections.notifications && (
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">Weather Alerts</p>
                  <p className="text-sm text-gray-600">Severe weather notifications</p>
                </div>
                <button
                  onClick={() => setNotificationSettings({
                    ...notificationSettings,
                    weatherAlerts: notificationSettings.weatherAlerts === 'true' ? 'false' : 'true'
                  })}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    notificationSettings.weatherAlerts === 'true' ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    notificationSettings.weatherAlerts === 'true' ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">Maintenance Reminders</p>
                  <p className="text-sm text-gray-600">Equipment service alerts</p>
                </div>
                <button
                  onClick={() => setNotificationSettings({
                    ...notificationSettings,
                    maintenanceReminders: notificationSettings.maintenanceReminders === 'true' ? 'false' : 'true'
                  })}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    notificationSettings.maintenanceReminders === 'true' ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    notificationSettings.maintenanceReminders === 'true' ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">Harvest Notifications</p>
                  <p className="text-sm text-gray-600">Crop ready alerts</p>
                </div>
                <button
                  onClick={() => setNotificationSettings({
                    ...notificationSettings,
                    harvestNotifications: notificationSettings.harvestNotifications === 'true' ? 'false' : 'true'
                  })}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    notificationSettings.harvestNotifications === 'true' ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    notificationSettings.harvestNotifications === 'true' ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">Field Inspections</p>
                  <p className="text-sm text-gray-600">Inspection reminders</p>
                </div>
                <button
                  onClick={() => setNotificationSettings({
                    ...notificationSettings,
                    fieldInspections: notificationSettings.fieldInspections === 'true' ? 'false' : 'true'
                  })}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    notificationSettings.fieldInspections === 'true' ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    notificationSettings.fieldInspections === 'true' ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Notification Methods</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Email Notifications</span>
                    <button
                      onClick={() => setNotificationSettings({
                        ...notificationSettings,
                        emailNotifications: notificationSettings.emailNotifications === 'true' ? 'false' : 'true'
                      })}
                      className={`w-12 h-6 rounded-full p-1 transition-colors ${
                        notificationSettings.emailNotifications === 'true' ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        notificationSettings.emailNotifications === 'true' ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">SMS Notifications</span>
                    <button
                      onClick={() => setNotificationSettings({
                        ...notificationSettings,
                        smsNotifications: notificationSettings.smsNotifications === 'true' ? 'false' : 'true'
                      })}
                      className={`w-12 h-6 rounded-full p-1 transition-colors ${
                        notificationSettings.smsNotifications === 'true' ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        notificationSettings.smsNotifications === 'true' ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={saveNotificationSettings} 
                loading={saving}
                icon="Save"
              >
                Save Notifications
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Appearance Section */}
      <Card>
        <CardHeader>
          <button
            onClick={() => toggleSection('appearance')}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <ApperIcon name="Palette" className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 font-display">Appearance</h3>
                <p className="text-sm text-gray-600">Customize theme, layout, and display preferences</p>
              </div>
            </div>
            <ApperIcon 
              name={expandedSections.appearance ? "ChevronUp" : "ChevronDown"} 
              className="w-5 h-5 text-gray-400" 
            />
          </button>
        </CardHeader>
        {expandedSections.appearance && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Theme"
                type="select"
                value={appearanceSettings.theme}
                onChange={(e) => setAppearanceSettings({...appearanceSettings, theme: e.target.value})}
                options={[
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'auto', label: 'Auto (System)' }
                ]}
              />
              <FormField
                label="Language"
                type="select"
                value={appearanceSettings.language}
                onChange={(e) => setAppearanceSettings({...appearanceSettings, language: e.target.value})}
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'es', label: 'Spanish' },
                  { value: 'fr', label: 'French' },
                  { value: 'de', label: 'German' }
                ]}
              />
              <FormField
                label="Date Format"
                type="select"
                value={appearanceSettings.dateFormat}
                onChange={(e) => setAppearanceSettings({...appearanceSettings, dateFormat: e.target.value})}
                options={[
                  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                  { value: 'MMM DD, YYYY', label: 'MMM DD, YYYY' }
                ]}
              />
              <FormField
                label="Time Format"
                type="select"
                value={appearanceSettings.timeFormat}
                onChange={(e) => setAppearanceSettings({...appearanceSettings, timeFormat: e.target.value})}
                options={[
                  { value: '12h', label: '12 Hour (AM/PM)' },
                  { value: '24h', label: '24 Hour' }
                ]}
              />
              <FormField
                label="Default View"
                type="select"
                value={appearanceSettings.defaultView}
                onChange={(e) => setAppearanceSettings({...appearanceSettings, defaultView: e.target.value})}
                options={[
                  { value: 'dashboard', label: 'Dashboard' },
                  { value: 'fields', label: 'Fields' },
                  { value: 'crops', label: 'Crops' },
                  { value: 'equipment', label: 'Equipment' }
                ]}
              />
            </div>
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={saveAppearanceSettings} 
                loading={saving}
                icon="Save"
              >
                Save Appearance
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Data Management Section */}
      <Card>
        <CardHeader>
          <button
            onClick={() => toggleSection('dataManagement')}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                <ApperIcon name="Database" className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 font-display">Data Management</h3>
                <p className="text-sm text-gray-600">Import, export, and backup your farm data</p>
              </div>
            </div>
            <ApperIcon 
              name={expandedSections.dataManagement ? "ChevronUp" : "ChevronDown"} 
              className="w-5 h-5 text-gray-400" 
            />
          </button>
        </CardHeader>
        {expandedSections.dataManagement && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">Automatic Backup</p>
                  <p className="text-sm text-gray-600">Enable automatic data backups</p>
                </div>
                <button
                  onClick={() => setDataSettings({
                    ...dataSettings,
                    autoBackup: dataSettings.autoBackup === 'true' ? 'false' : 'true'
                  })}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    dataSettings.autoBackup === 'true' ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    dataSettings.autoBackup === 'true' ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
              <FormField
                label="Backup Frequency"
                type="select"
                value={dataSettings.backupFrequency}
                onChange={(e) => setDataSettings({...dataSettings, backupFrequency: e.target.value})}
                options={[
                  { value: 'daily', label: 'Daily' },
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'monthly', label: 'Monthly' }
                ]}
              />
              <FormField
                label="Export Format"
                type="select"
                value={dataSettings.exportFormat}
                onChange={(e) => setDataSettings({...dataSettings, exportFormat: e.target.value})}
                options={[
                  { value: 'csv', label: 'CSV' },
                  { value: 'xlsx', label: 'Excel' },
                  { value: 'json', label: 'JSON' },
                  { value: 'pdf', label: 'PDF' }
                ]}
              />
              <FormField
                label="Data Retention (Days)"
                type="input"
                inputType="number"
                value={dataSettings.retentionPeriod}
                onChange={(e) => setDataSettings({...dataSettings, retentionPeriod: e.target.value})}
                placeholder="365"
              />
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="outline" icon="Download">
                Export Data
              </Button>
              <Button 
                onClick={saveDataSettings} 
                loading={saving}
                icon="Save"
              >
                Save Settings
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Privacy & Security Section */}
      <Card>
        <CardHeader>
          <button
            onClick={() => toggleSection('privacy')}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <ApperIcon name="Shield" className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 font-display">Privacy & Security</h3>
                <p className="text-sm text-gray-600">Manage data privacy and security preferences</p>
              </div>
            </div>
            <ApperIcon 
              name={expandedSections.privacy ? "ChevronUp" : "ChevronDown"} 
              className="w-5 h-5 text-gray-400" 
            />
          </button>
        </CardHeader>
        {expandedSections.privacy && (
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">Share Analytics</p>
                  <p className="text-sm text-gray-600">Help improve the app by sharing usage data</p>
                </div>
                <button
                  onClick={() => setPrivacySettings({
                    ...privacySettings,
                    shareAnalytics: privacySettings.shareAnalytics === 'true' ? 'false' : 'true'
                  })}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    privacySettings.shareAnalytics === 'true' ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    privacySettings.shareAnalytics === 'true' ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">Location Tracking</p>
                  <p className="text-sm text-gray-600">Allow location-based features</p>
                </div>
                <button
                  onClick={() => setPrivacySettings({
                    ...privacySettings,
                    locationTracking: privacySettings.locationTracking === 'true' ? 'false' : 'true'
                  })}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    privacySettings.locationTracking === 'true' ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    privacySettings.locationTracking === 'true' ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">Data Encryption</p>
                  <p className="text-sm text-gray-600">Encrypt sensitive data</p>
                </div>
                <button
                  onClick={() => setPrivacySettings({
                    ...privacySettings,
                    dataEncryption: privacySettings.dataEncryption === 'true' ? 'false' : 'true'
                  })}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    privacySettings.dataEncryption === 'true' ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    privacySettings.dataEncryption === 'true' ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">Third-Party Sharing</p>
                  <p className="text-sm text-gray-600">Allow data sharing with partners</p>
                </div>
                <button
                  onClick={() => setPrivacySettings({
                    ...privacySettings,
                    thirdPartySharing: privacySettings.thirdPartySharing === 'true' ? 'false' : 'true'
                  })}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    privacySettings.thirdPartySharing === 'true' ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    privacySettings.thirdPartySharing === 'true' ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={savePrivacySettings} 
                loading={saving}
                icon="Save"
              >
                Save Privacy Settings
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Mobile Sync Section */}
      <Card>
        <CardHeader>
          <button
            onClick={() => toggleSection('mobileSync')}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                <ApperIcon name="Smartphone" className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 font-display">Mobile Sync</h3>
                <p className="text-sm text-gray-600">Configure mobile app synchronization settings</p>
              </div>
            </div>
            <ApperIcon 
              name={expandedSections.mobileSync ? "ChevronUp" : "ChevronDown"} 
              className="w-5 h-5 text-gray-400" 
            />
          </button>
        </CardHeader>
        {expandedSections.mobileSync && (
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">Auto Sync</p>
                  <p className="text-sm text-gray-600">Automatically sync data with mobile app</p>
                </div>
                <button
                  onClick={() => setMobileSyncSettings({
                    ...mobileSyncSettings,
                    autoSync: mobileSyncSettings.autoSync === 'true' ? 'false' : 'true'
                  })}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    mobileSyncSettings.autoSync === 'true' ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    mobileSyncSettings.autoSync === 'true' ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
              <FormField
                label="Sync Frequency"
                type="select"
                value={mobileSyncSettings.syncFrequency}
                onChange={(e) => setMobileSyncSettings({...mobileSyncSettings, syncFrequency: e.target.value})}
                options={[
                  { value: 'realtime', label: 'Real-time' },
                  { value: 'hourly', label: 'Every Hour' },
                  { value: 'daily', label: 'Daily' },
                  { value: 'manual', label: 'Manual Only' }
                ]}
              />
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">Offline Mode</p>
                  <p className="text-sm text-gray-600">Enable offline data access</p>
                </div>
                <button
                  onClick={() => setMobileSyncSettings({
                    ...mobileSyncSettings,
                    offlineMode: mobileSyncSettings.offlineMode === 'true' ? 'false' : 'true'
                  })}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    mobileSyncSettings.offlineMode === 'true' ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    mobileSyncSettings.offlineMode === 'true' ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">Sync Over Cellular</p>
                  <p className="text-sm text-gray-600">Allow syncing over mobile data</p>
                </div>
                <button
                  onClick={() => setMobileSyncSettings({
                    ...mobileSyncSettings,
                    syncOverCellular: mobileSyncSettings.syncOverCellular === 'true' ? 'false' : 'true'
                  })}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    mobileSyncSettings.syncOverCellular === 'true' ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    mobileSyncSettings.syncOverCellular === 'true' ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={saveMobileSyncSettings} 
                loading={saving}
                icon="Save"
              >
                Save Sync Settings
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default Settings;