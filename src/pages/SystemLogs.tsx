import { useEffect, useState, useCallback } from "react";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { Search, RefreshCw, Copy, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { activityLogsService } from "@/services/api";

interface ActivityLog {
  id: string;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  details: any;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    name: string | null;
    role: string;
  } | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const SystemLogs = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 100,
    total: 0,
    totalPages: 0,
  });

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (actionFilter !== "all") {
        params.append("action", actionFilter);
      }

      if (entityTypeFilter !== "all") {
        params.append("entityType", entityTypeFilter);
      }

      const res = await activityLogsService.getAll(params.toString());

      if (res.data && res.data.success) {
        setLogs(res.data.data || []);
        setPagination(res.data.pagination || pagination);
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "Failed to fetch activity logs");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [pagination.page, pagination.limit, actionFilter, entityTypeFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLogs();
  };

  const filteredLogs = logs.filter((log) => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        log.action.toLowerCase().includes(searchLower) ||
        log.entityType.toLowerCase().includes(searchLower) ||
        log.user?.email.toLowerCase().includes(searchLower) ||
        log.user?.name?.toLowerCase().includes(searchLower) ||
        log.entityId?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const getActionBadge = (action: string) => {
    const actionLower = action.toLowerCase();
    const colors: Record<string, string> = {
      create: "bg-emerald-600 hover:bg-emerald-700 text-white",
      update: "bg-blue-600 hover:bg-blue-700 text-white",
      delete: "bg-red-600 hover:bg-red-700 text-white",
      login: "bg-purple-600 hover:bg-purple-700 text-white",
      logout: "bg-gray-600 hover:bg-gray-700 text-white",
      system: "bg-amber-600 hover:bg-amber-700 text-white",
    };
    return colors[actionLower] || "bg-gray-600 hover:bg-gray-700 text-white";
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleCopyDetails = (logId: string, details: any) => {
    try {
      const jsonString = JSON.stringify(details, null, 2);
      navigator.clipboard.writeText(jsonString);
      setCopiedId(logId);
      toast.success("Details copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast.error("Failed to copy details");
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Activity Logs</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Monitor all system activities and user actions
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by action, user, entity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:border-amber-500 dark:focus:border-amber-500 focus:ring-2 focus:ring-amber-400 
                       outline-none transition"
          />
        </div>
        <Select
          value={actionFilter}
          onValueChange={setActionFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="create">Create</SelectItem>
            <SelectItem value="update">Update</SelectItem>
            <SelectItem value="delete">Delete</SelectItem>
            <SelectItem value="login">Login</SelectItem>
            <SelectItem value="logout">Logout</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={entityTypeFilter}
          onValueChange={setEntityTypeFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by entity" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <SelectItem value="all">All Entities</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="motif">Motif</SelectItem>
            <SelectItem value="prediction">Prediction</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Logs List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-24 bg-transparent border border-gray-100 dark:border-gray-700" />
          ))}
        </div>
      ) : filteredLogs.length === 0 ? (
        <Card className="p-8 text-center bg-transparent border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No activity logs found</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredLogs.map((log) => (
            <Card
              key={log.id}
              className="p-4 bg-transparent border border-gray-100 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-600 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className={`${getActionBadge(log.action)} shrink-0`}>
                      {log.action.toUpperCase()}
                    </Badge>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                      {log.entityType}
                    </span>
                    {log.entityId && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate">
                        {log.entityId.substring(0, 12)}...
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {log.user ? (
                      <span>
                        By <span className="font-semibold text-gray-900 dark:text-white">
                          {log.user.name || log.user.email}
                        </span>{" "}
                        <span className="text-xs px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          {log.user.role}
                        </span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs font-medium">
                        System Action
                      </span>
                    )}
                  </div>

                  {log.details && (
                    <div className="mt-3 relative group">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Details:</span>
                        <button
                          onClick={() => handleCopyDetails(log.id, log.details)}
                          className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                          title="Copy details to clipboard"
                        >
                          {copiedId === log.id ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="text-xs text-gray-600 dark:text-gray-400 font-mono bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">{formatRelativeTime(log.createdAt)}</span>
                      <span className="text-gray-400 dark:text-gray-500">•</span>
                      <span>{new Date(log.createdAt).toLocaleString()}</span>
                    </div>
                    {log.ipAddress && (
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-mono">{log.ipAddress}</span>
                      </div>
                    )}
                    {log.userAgent && (
                      <div className="text-xs text-gray-400 dark:text-gray-500 truncate max-w-xs" title={log.userAgent}>
                        {log.userAgent.split(" ")[0]} {log.userAgent.split(" ")[1] || ""}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} logs
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              disabled={pagination.page >= pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemLogs;

