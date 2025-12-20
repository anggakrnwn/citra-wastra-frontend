import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { Save, RefreshCw, Settings as SettingsIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { settingsService } from "@/services/api";

interface Setting {
  id: string;
  key: string;
  value: string;
  category: string;
  description: string | null;
  updatedBy: string | null;
  updatedAt: string;
  updatedByUser: {
    id: string;
    email: string;
    name: string | null;
  } | null;
}

interface SettingsData {
  [category: string]: Setting[];
}

const Settings = () => {
  const [settings, setSettings] = useState<SettingsData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);


  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await settingsService.getAll();
      if (res.data && res.data.success) {
        setSettings(res.data.data || {});
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (key: string, value: string, description?: string) => {
    setSaving(key);
    try {
      await settingsService.update(key, value, description);
      toast.success("Setting updated successfully");
      fetchSettings();
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "Failed to update setting");
    } finally {
      setSaving(null);
    }
  };


  const getSettingValue = (category: string, key: string): string => {
    return settings[category]?.find((s) => s.key === key)?.value || "";
  };

  const updateLocalSetting = (category: string, key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [category]: prev[category]?.map((s) => (s.key === key ? { ...s, value } : s)) || [],
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-64 bg-transparent border border-gray-100 dark:border-gray-700" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage system configurations and deployment settings
          </p>
        </div>
        <Button onClick={fetchSettings} variant="outline" className="border-gray-200 dark:border-gray-700">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* ML Service Settings */}
      <Card className="p-6 bg-transparent border border-gray-100 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <SettingsIcon className="w-5 h-5 mr-2 text-amber-600 dark:text-amber-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">ML Service</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Configure Machine Learning model service endpoint and settings
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="ml_service_url" className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
              ML Service URL
            </label>
            <input
              id="ml_service_url"
              type="url"
              value={getSettingValue("ml_service", "ML_SERVICE_URL")}
              onChange={(e) => updateLocalSetting("ml_service", "ML_SERVICE_URL", e.target.value)}
              placeholder="https://your-ml-service.example.com"
              className="mt-1 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Button
              onClick={() =>
                handleSave(
                  "ML_SERVICE_URL",
                  getSettingValue("ml_service", "ML_SERVICE_URL"),
                  "Machine Learning service endpoint URL"
                )
              }
              disabled={saving === "ML_SERVICE_URL"}
              className="mt-2 bg-amber-600 hover:bg-amber-700 text-white"
              size="sm"
            >
              {saving === "ML_SERVICE_URL" ? "Saving..." : (
                <>
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </>
              )}
            </Button>
          </div>

          <div>
            <label htmlFor="ml_service_timeout" className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
              ML Service Timeout (ms)
            </label>
            <input
              id="ml_service_timeout"
              type="number"
              value={getSettingValue("ml_service", "ML_SERVICE_TIMEOUT")}
              onChange={(e) => updateLocalSetting("ml_service", "ML_SERVICE_TIMEOUT", e.target.value)}
              placeholder="120000"
              className="mt-1 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Button
              onClick={() =>
                handleSave(
                  "ML_SERVICE_TIMEOUT",
                  getSettingValue("ml_service", "ML_SERVICE_TIMEOUT"),
                  "Timeout for ML service requests in milliseconds"
                )
              }
              disabled={saving === "ML_SERVICE_TIMEOUT"}
              className="mt-2 bg-amber-600 hover:bg-amber-700 text-white"
              size="sm"
            >
              {saving === "ML_SERVICE_TIMEOUT" ? "Saving..." : (
                <>
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Backend Service Settings */}
      <Card className="p-6 bg-transparent border border-gray-100 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <SettingsIcon className="w-5 h-5 mr-2 text-amber-600 dark:text-amber-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Backend Service</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Backend API and ML model service endpoint configuration
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="railway_backend_url" className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
              Backend API URL
            </label>
            <input
              id="railway_backend_url"
              type="url"
              value={getSettingValue("railway", "RAILWAY_BACKEND_URL")}
              onChange={(e) => updateLocalSetting("railway", "RAILWAY_BACKEND_URL", e.target.value)}
              placeholder="https://your-backend-api.example.com"
              className="mt-1 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Button
              onClick={() =>
                handleSave(
                  "RAILWAY_BACKEND_URL",
                  getSettingValue("railway", "RAILWAY_BACKEND_URL"),
                  "Backend API service URL"
                )
              }
              disabled={saving === "RAILWAY_BACKEND_URL"}
              className="mt-2 bg-amber-600 hover:bg-amber-700 text-white"
              size="sm"
            >
              {saving === "RAILWAY_BACKEND_URL" ? "Saving..." : (
                <>
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </>
              )}
            </Button>
          </div>

          <div>
            <label htmlFor="railway_model_url" className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
              ML Model Service URL
            </label>
            <input
              id="railway_model_url"
              type="url"
              value={getSettingValue("railway", "RAILWAY_MODEL_URL")}
              onChange={(e) => updateLocalSetting("railway", "RAILWAY_MODEL_URL", e.target.value)}
              placeholder="https://your-ml-service.example.com"
              className="mt-1 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Button
              onClick={() =>
                handleSave(
                  "RAILWAY_MODEL_URL",
                  getSettingValue("railway", "RAILWAY_MODEL_URL"),
                  "ML model service endpoint URL"
                )
              }
              disabled={saving === "RAILWAY_MODEL_URL"}
              className="mt-2 bg-amber-600 hover:bg-amber-700 text-white"
              size="sm"
            >
              {saving === "RAILWAY_MODEL_URL" ? "Saving..." : (
                <>
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Frontend Service Settings */}
      <Card className="p-6 bg-transparent border border-gray-100 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <SettingsIcon className="w-5 h-5 mr-2 text-amber-600 dark:text-amber-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Frontend Service</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Frontend application deployment URL configuration
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="vercel_frontend_url" className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
              Frontend URL
            </label>
            <input
              id="vercel_frontend_url"
              type="url"
              value={getSettingValue("vercel", "VERCEL_FRONTEND_URL")}
              onChange={(e) => updateLocalSetting("vercel", "VERCEL_FRONTEND_URL", e.target.value)}
              placeholder="https://your-frontend-app.example.com"
              className="mt-1 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Button
              onClick={() =>
                handleSave(
                  "VERCEL_FRONTEND_URL",
                  getSettingValue("vercel", "VERCEL_FRONTEND_URL"),
                  "Frontend application deployment URL"
                )
              }
              disabled={saving === "VERCEL_FRONTEND_URL"}
              className="mt-2 bg-amber-600 hover:bg-amber-700 text-white"
              size="sm"
            >
              {saving === "VERCEL_FRONTEND_URL" ? "Saving..." : (
                <>
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Performance & System Settings */}
      <Card className="p-6 bg-transparent border border-gray-100 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <SettingsIcon className="w-5 h-5 mr-2 text-amber-600 dark:text-amber-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Performance & System</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          System performance and configuration settings
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="rate_limit_max" className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
              Rate Limit Max (requests per minute)
            </label>
            <input
              id="rate_limit_max"
              type="number"
              value={getSettingValue("general", "RATE_LIMIT_MAX")}
              onChange={(e) => updateLocalSetting("general", "RATE_LIMIT_MAX", e.target.value)}
              placeholder="100"
              className="mt-1 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Button
              onClick={() =>
                handleSave(
                  "RATE_LIMIT_MAX",
                  getSettingValue("general", "RATE_LIMIT_MAX"),
                  "Maximum number of requests allowed per minute"
                )
              }
              disabled={saving === "RATE_LIMIT_MAX"}
              className="mt-2 bg-amber-600 hover:bg-amber-700 text-white"
              size="sm"
            >
              {saving === "RATE_LIMIT_MAX" ? "Saving..." : (
                <>
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </>
              )}
            </Button>
          </div>

          <div>
            <label htmlFor="max_file_size" className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
              Max File Size (bytes)
            </label>
            <input
              id="max_file_size"
              type="number"
              value={getSettingValue("general", "MAX_FILE_SIZE")}
              onChange={(e) => updateLocalSetting("general", "MAX_FILE_SIZE", e.target.value)}
              placeholder="5242880"
              className="mt-1 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Example: 5242880 = 5MB</p>
            <Button
              onClick={() =>
                handleSave(
                  "MAX_FILE_SIZE",
                  getSettingValue("general", "MAX_FILE_SIZE"),
                  "Maximum file size allowed for uploads in bytes"
                )
              }
              disabled={saving === "MAX_FILE_SIZE"}
              className="mt-2 bg-amber-600 hover:bg-amber-700 text-white"
              size="sm"
            >
              {saving === "MAX_FILE_SIZE" ? "Saving..." : (
                <>
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </>
              )}
            </Button>
          </div>

          <div>
            <label htmlFor="allowed_mime_types" className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
              Allowed MIME Types (comma-separated)
            </label>
            <input
              id="allowed_mime_types"
              type="text"
              value={getSettingValue("general", "ALLOWED_MIME_TYPES")}
              onChange={(e) => updateLocalSetting("general", "ALLOWED_MIME_TYPES", e.target.value)}
              placeholder="image/jpeg,image/png,image/webp"
              className="mt-1 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Button
              onClick={() =>
                handleSave(
                  "ALLOWED_MIME_TYPES",
                  getSettingValue("general", "ALLOWED_MIME_TYPES"),
                  "Comma-separated list of allowed MIME types for file uploads"
                )
              }
              disabled={saving === "ALLOWED_MIME_TYPES"}
              className="mt-2 bg-amber-600 hover:bg-amber-700 text-white"
              size="sm"
            >
              {saving === "ALLOWED_MIME_TYPES" ? "Saving..." : (
                <>
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </>
              )}
            </Button>
          </div>

          <div>
            <label htmlFor="log_level" className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
              Log Level
            </label>
            <select
              id="log_level"
              value={getSettingValue("general", "LOG_LEVEL")}
              onChange={(e) => updateLocalSetting("general", "LOG_LEVEL", e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Select log level...</option>
              <option value="debug">debug</option>
              <option value="info">info</option>
              <option value="warn">warn</option>
              <option value="error">error</option>
            </select>
            <Button
              onClick={() =>
                handleSave(
                  "LOG_LEVEL",
                  getSettingValue("general", "LOG_LEVEL"),
                  "Application logging level (debug, info, warn, error)"
                )
              }
              disabled={saving === "LOG_LEVEL"}
              className="mt-2 bg-amber-600 hover:bg-amber-700 text-white"
              size="sm"
            >
              {saving === "LOG_LEVEL" ? "Saving..." : (
                <>
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </>
              )}
            </Button>
          </div>

          <div>
            <label htmlFor="enable_maintenance" className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
              Enable Maintenance Mode
            </label>
            <select
              id="enable_maintenance"
              value={getSettingValue("general", "ENABLE_MAINTENANCE")}
              onChange={(e) => updateLocalSetting("general", "ENABLE_MAINTENANCE", e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Select option...</option>
              <option value="false">Disabled</option>
              <option value="true">Enabled</option>
            </select>
            <Button
              onClick={() =>
                handleSave(
                  "ENABLE_MAINTENANCE",
                  getSettingValue("general", "ENABLE_MAINTENANCE"),
                  "Enable or disable maintenance mode"
                )
              }
              disabled={saving === "ENABLE_MAINTENANCE"}
              className="mt-2 bg-amber-600 hover:bg-amber-700 text-white"
              size="sm"
            >
              {saving === "ENABLE_MAINTENANCE" ? "Saving..." : (
                <>
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;

