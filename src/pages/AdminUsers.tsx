import { useEffect, useState, useCallback } from "react";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { userService } from "@/services/api";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: "user" | "admin";
  createdAt: string;
}

interface ApiError {
  message?: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await userService.getAll();

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.users || [];

      setUsers(data);
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      toast.error(error.response?.data?.message || "Gagal mengambil data user");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRole = async (id: string, role: "user" | "admin") => {
    setUpdating(id);
    try {
      await userService.updateRole(id, role);

      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role } : u))
      );

      toast.success("Role berhasil diperbarui");
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      toast.error(error.response?.data?.message || "Gagal update role");
    } finally {
      setUpdating(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manajemen User</h1>
          <p className="text-sm text-muted-foreground">
            Total user: {users.length}
          </p>
        </div>
        <Button onClick={fetchUsers}>Refresh</Button>
      </div>

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <Skeleton className="h-4 w-40 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-8 w-[120px]" />
              </div>
            </Card>
          ))
        ) : users.length > 0 ? (
          users.map((user) => (
            <Card key={user.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{user.name || "No Name"}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <div className="mt-1">
                    <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                      {user.role}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                  <Select
                    value={user.role}
                    onValueChange={(value: User["role"]) =>
                      updateRole(user.id, value)
                    }
                    disabled={updating === user.id}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Pilih role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-gray-500 text-center">Tidak ada user ditemukan</p>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
