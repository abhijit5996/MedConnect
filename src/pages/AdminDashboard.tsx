import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Users,
  Calendar,
  ShieldCheck,
  UserCheck,
  Trash2,
  XCircle,
  FileText,
  Activity,
  Heart,
  RefreshCw,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "@/lib/api";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { AreaChart, Area } from "recharts";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"doctors" | "patients" | "appointments" | "analytics">("doctors");

  // State for deletion modals
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [cancelAppointmentId, setCancelAppointmentId] = useState<string | null>(null);

  // Authentication check
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      toast.error("Access denied. Please log in first.");
      navigate("/admin-auth");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== "admin") {
        toast.error("Access denied. Admin access only.");
        navigate("/");
        return;
      }
      setAdminUser(parsedUser);
    } catch (e) {
      toast.error("Invalid session details.");
      navigate("/admin-auth");
    } finally {
      setIsCheckingAuth(false);
    }
  }, [navigate]);

  // Fetch admin statistics
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await API.get("/admin/stats");
      return res.data;
    },
    enabled: !isCheckingAuth,
  });

  // Fetch all patients and doctors
  const { data: users = [], isLoading: usersLoading, refetch: refetchUsers } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await API.get("/admin/users");
      return res.data;
    },
    enabled: !isCheckingAuth,
  });

  // Fetch all appointments
  const { data: appointments = [], isLoading: apptsLoading, refetch: refetchAppts } = useQuery({
    queryKey: ["admin-appointments"],
    queryFn: async () => {
      const res = await API.get("/admin/appointments");
      return res.data;
    },
    enabled: !isCheckingAuth,
  });

  // Toggle doctor approval mutation
  const toggleApprovalMutation = useMutation({
    mutationFn: async ({ doctorId, approved }: { doctorId: string; approved: boolean }) => {
      return await API.put(`/admin/doctors/${doctorId}/approve`, { approved });
    },
    onSuccess: (data, variables) => {
      toast.success(
        variables.approved
          ? "Doctor profile approved successfully"
          : "Doctor profile set to pending approval"
      );
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update doctor approval status");
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      return await API.delete(`/admin/users/${userId}`);
    },
    onSuccess: () => {
      toast.success("User account and associated records deleted");
      setDeleteUserId(null);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete user account");
      setDeleteUserId(null);
    },
  });

  // Cancel appointment mutation
  const cancelApptMutation = useMutation({
    mutationFn: async (apptId: string) => {
      return await API.delete(`/admin/appointments/${apptId}`);
    },
    onSuccess: () => {
      toast.success("Appointment cancelled successfully");
      setCancelAppointmentId(null);
      queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to cancel appointment");
      setCancelAppointmentId(null);
    },
  });

  const handleRefreshAll = () => {
    refetchStats();
    refetchUsers();
    refetchAppts();
    toast.info("Dashboard data reloaded.");
  };

  const doctorsList = users.filter((u: any) => u.role === "doctor");
  const patientsList = users.filter((u: any) => u.role === "patient");
 
  // 1. Appointment status chart data
  const appointmentStatusData = useMemo(() => {
    const counts: Record<string, number> = {
      Confirmed: 0,
      Completed: 0,
      Cancelled: 0,
      Pending: 0,
    };
    appointments.forEach((appt: any) => {
      const status = appt.status || "Pending";
      if (status in counts) {
        counts[status]++;
      }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [appointments]);

  const STATUS_COLORS = {
    Confirmed: "#10b981", // Emerald
    Completed: "#6366f1", // Indigo
    Cancelled: "#ef4444", // Red
    Pending: "#f59e0b",   // Amber
  };

  // 2. Doctor Specialty data
  const specialtyData = useMemo(() => {
    const counts: Record<string, number> = {};
    doctorsList.forEach((doc: any) => {
      const spec = doc.doctorProfile?.specialty || "General Physician";
      counts[spec] = (counts[spec] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [doctorsList]);

  // 3. Last 7 Days Signups Trend
  const registrationData = useMemo(() => {
    const dailyCounts: Record<string, number> = {};
    
    // Initialize last 7 days with 0
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      dailyCounts[dateStr] = 0;
    }
    
    patientsList.forEach((pat: any) => {
      if (pat.createdAt) {
        const dateStr = new Date(pat.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        if (dateStr in dailyCounts) {
          dailyCounts[dateStr]++;
        }
      }
    });

    return Object.entries(dailyCounts).map(([date, count]) => ({ date, count }));
  }, [patientsList]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-2">
          <Activity className="h-8 w-8 text-primary animate-pulse" />
          <p className="text-muted-foreground font-medium">Validating credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        {/* Banner Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-border rounded-3xl p-8 mb-8 shadow-xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">MedConnect Admin Control Panel</h1>
              <p className="text-muted-foreground text-sm max-w-xl">
                Oversee clinical registration lists, verify healthcare provider credentials, monitor booking schedules, and manage platform directory tables.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleRefreshAll} className="rounded-full shadow-sm hover:bg-secondary">
                <RefreshCw className="h-4 w-4 mr-1.5" />
                Refresh Data
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Summary Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="p-6 clay-card-purple hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1 opacity-70">Total Patients</p>
                <p className="text-3xl font-bold tracking-tight">
                  {statsLoading ? "..." : stats?.patientsCount ?? 0}
                </p>
              </div>
              <div className="bg-white/30 dark:bg-black/30 p-3 rounded-2xl shadow-sm">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </Card>

          <Card className="p-6 clay-card-mint hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1 opacity-70">Total Doctors</p>
                <p className="text-3xl font-bold tracking-tight">
                  {statsLoading ? "..." : stats?.doctorsCount ?? 0}
                </p>
              </div>
              <div className="bg-white/30 dark:bg-black/30 p-3 rounded-2xl shadow-sm">
                <UserCheck className="h-6 w-6" />
              </div>
            </div>
          </Card>

          <Card className="p-6 clay-card-coral hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1 opacity-70">Total Appointments</p>
                <p className="text-3xl font-bold tracking-tight">
                  {statsLoading ? "..." : stats?.appointmentsCount ?? 0}
                </p>
              </div>
              <div className="bg-white/30 dark:bg-black/30 p-3 rounded-2xl shadow-sm">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
          </Card>

          <Card className="p-6 clay-card-purple hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1 opacity-70">Pending Approvals</p>
                <p className="text-3xl font-bold tracking-tight">
                  {statsLoading ? "..." : stats?.pendingApprovalsCount ?? 0}
                </p>
              </div>
              <div className="bg-white/30 dark:bg-black/30 p-3 rounded-2xl shadow-sm">
                <ShieldCheck className="h-6 w-6" />
              </div>
            </div>
          </Card>
        </div>

        {/* Dynamic Tab Controls */}
        <div className="flex border-b border-border mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("doctors")}
            className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "doctors"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Doctors Directory ({doctorsList.length})
          </button>
          <button
            onClick={() => setActiveTab("patients")}
            className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "patients"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Patients Directory ({patientsList.length})
          </button>
          <button
            onClick={() => setActiveTab("appointments")}
            className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "appointments"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Appointments Registry ({appointments.length})
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "analytics"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            System Analytics
          </button>
        </div>

        {/* Tab Contents */}
        <Card className="p-6 bg-card/40 backdrop-blur-md border-border/80 shadow-md">
          {activeTab === "analytics" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold">System Metrics & Analytics</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Visualise operational trends, registration metrics, and booking statuses.
                  </p>
                </div>
              </div>

              {/* Sub-Stats Summary Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-5 rounded-2xl border border-border bg-card/25 shadow-sm">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Total Registrations
                  </span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold text-foreground">{users.length}</span>
                    <span className="text-xs font-medium text-emerald-500 font-semibold">System Users</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-border bg-card/25 shadow-sm">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Doctor to Patient Ratio
                  </span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold text-foreground">
                      {patientsList.length > 0 ? (doctorsList.length / patientsList.length).toFixed(2) : doctorsList.length}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">docs per patient</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-border bg-card/25 shadow-sm">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Bookings Status Rate
                  </span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold text-foreground">
                      {appointments.length > 0
                        ? ((appointments.filter((a: any) => a.status === "Confirmed" || a.status === "Completed").length / appointments.length) * 100).toFixed(0)
                        : "0"}%
                    </span>
                    <span className="text-xs font-medium text-emerald-500 font-semibold">Active/Success Rate</span>
                  </div>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* 1. Appointment Breakdown Pie/Donut Chart */}
                <div className="p-6 rounded-2xl border border-border bg-card/30 shadow-sm flex flex-col justify-between">
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-foreground">Appointments Booking Distribution</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Slices representing booking statuses</p>
                  </div>
                  
                  {appointments.length === 0 ? (
                    <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
                      No appointment data available.
                    </div>
                  ) : (
                    <div className="h-64 flex flex-col sm:flex-row items-center justify-center gap-6">
                      <div className="w-full h-48 sm:w-1/2">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={appointmentStatusData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {appointmentStatusData.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] || "#cbd5e1"} 
                                />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: "hsl(var(--card))", 
                                borderColor: "hsl(var(--border))", 
                                borderRadius: "8px",
                                color: "hsl(var(--foreground))"
                              }} 
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="flex flex-col gap-2.5 w-full sm:w-1/2">
                        {appointmentStatusData.map((entry) => (
                          <div key={entry.name} className="flex items-center justify-between text-xs border-b border-border/40 pb-1.5 last:border-0 last:pb-0">
                            <div className="flex items-center gap-2">
                              <span 
                                className="w-3 h-3 rounded-full shrink-0" 
                                style={{ backgroundColor: STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] }} 
                              />
                              <span className="font-medium text-foreground">{entry.name}</span>
                            </div>
                            <span className="font-semibold font-mono text-muted-foreground">{entry.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Doctor Specialty Distribution Bar Chart */}
                <div className="p-6 rounded-2xl border border-border bg-card/30 shadow-sm flex flex-col justify-between">
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-foreground">Practitioners Specialty Distribution</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Number of active doctors sorted by clinical specialty</p>
                  </div>

                  {doctorsList.length === 0 ? (
                    <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
                      No doctor directory data available.
                    </div>
                  ) : (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={specialtyData} margin={{ left: -10, right: 10, top: 10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.3)" />
                          <XAxis 
                            dataKey="name" 
                            stroke="hsl(var(--muted-foreground))" 
                            fontSize={11} 
                            tickLine={false} 
                            axisLine={false}
                          />
                          <YAxis 
                            stroke="hsl(var(--muted-foreground))" 
                            fontSize={11} 
                            tickLine={false} 
                            axisLine={false} 
                            allowDecimals={false}
                          />
                          <Tooltip 
                            cursor={{ fill: "hsl(var(--secondary) / 0.15)" }}
                            contentStyle={{ 
                              backgroundColor: "hsl(var(--card))", 
                              borderColor: "hsl(var(--border))", 
                              borderRadius: "8px",
                              color: "hsl(var(--foreground))"
                            }} 
                          />
                          <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} maxBarSize={45} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Patient Signup timeline Area Chart */}
              <div className="p-6 rounded-2xl border border-border bg-card/30 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-base font-bold text-foreground">Recent Patient Registrations</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Timeline chart representing signups over the last 7 days</p>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={registrationData} margin={{ left: -10, right: 10, top: 10, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.3)" />
                      <XAxis 
                        dataKey="date" 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={11} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={11} 
                        tickLine={false} 
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          borderColor: "hsl(var(--border))", 
                          borderRadius: "8px",
                          color: "hsl(var(--foreground))"
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="count" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorCount)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
          {activeTab === "doctors" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold">Registered Medical Practitioners</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Approve newly signed up doctors or delete accounts.</p>
                </div>
              </div>

              {usersLoading ? (
                <div className="py-12 flex justify-center"><Activity className="h-6 w-6 animate-spin text-primary" /></div>
              ) : doctorsList.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">No doctors registered yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border/60 text-muted-foreground font-medium">
                        <th className="pb-3 pr-4 font-semibold">Doctor Details</th>
                        <th className="pb-3 pr-4 font-semibold">Specialty</th>
                        <th className="pb-3 pr-4 font-semibold">Location</th>
                        <th className="pb-3 pr-4 font-semibold">Verify Status</th>
                        <th className="pb-3 text-right font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {doctorsList.map((doc: any) => {
                        const isApproved = doc.doctorProfile?.approved ?? false;
                        return (
                          <tr key={doc._id} className="hover:bg-secondary/20 transition-colors">
                            <td className="py-4 pr-4">
                              <div className="font-semibold text-foreground text-base">{doc.name}</div>
                              <div className="text-xs text-muted-foreground">{doc.email}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">{doc.phone || "No phone listed"}</div>
                            </td>
                            <td className="py-4 pr-4">
                              <span className="font-medium text-foreground">{doc.doctorProfile?.specialty || "Not set"}</span>
                              <div className="text-xs text-muted-foreground">{doc.doctorProfile?.experience || "N/A experience"}</div>
                            </td>
                            <td className="py-4 pr-4 text-muted-foreground">
                              {doc.doctorProfile?.location || "Not set"}
                            </td>
                            <td className="py-4 pr-4">
                              {isApproved ? (
                                <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-full px-2.5 py-0.5 font-semibold">
                                  Approved
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-none rounded-full px-2.5 py-0.5 font-semibold">
                                  Pending Approval
                                </Badge>
                              )}
                            </td>
                            <td className="py-4 text-right space-x-2 whitespace-nowrap">
                              <Button
                                size="sm"
                                variant={isApproved ? "outline" : "default"}
                                onClick={() =>
                                  toggleApprovalMutation.mutate({
                                    doctorId: doc._id,
                                    approved: !isApproved,
                                  })
                                }
                                disabled={toggleApprovalMutation.isPending}
                                className="rounded-full shadow-sm"
                              >
                                {isApproved ? "Revoke" : "Approve"}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:bg-destructive/10 rounded-full"
                                onClick={() => setDeleteUserId(doc._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "patients" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold">Registered Platform Patients</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Manage patient accounts and diagnostic access controls.</p>
                </div>
              </div>

              {usersLoading ? (
                <div className="py-12 flex justify-center"><Activity className="h-6 w-6 animate-spin text-primary" /></div>
              ) : patientsList.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">No patients registered yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border/60 text-muted-foreground font-medium">
                        <th className="pb-3 pr-4 font-semibold">Patient Name</th>
                        <th className="pb-3 pr-4 font-semibold">Email</th>
                        <th className="pb-3 pr-4 font-semibold">Phone</th>
                        <th className="pb-3 pr-4 font-semibold">Registration Date</th>
                        <th className="pb-3 text-right font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {patientsList.map((pat: any) => (
                        <tr key={pat._id} className="hover:bg-secondary/20 transition-colors">
                          <td className="py-4 pr-4 font-semibold text-foreground text-base">
                            {pat.name}
                          </td>
                          <td className="py-4 pr-4 text-muted-foreground">
                            {pat.email}
                          </td>
                          <td className="py-4 pr-4 text-muted-foreground">
                            {pat.phone || "No phone listed"}
                          </td>
                          <td className="py-4 pr-4 text-xs text-muted-foreground">
                            {pat.createdAt ? new Date(pat.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A"}
                          </td>
                          <td className="py-4 text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:bg-destructive/10 rounded-full"
                              onClick={() => setDeleteUserId(pat._id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "appointments" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold">Scheduled Appointments Registry</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Monitor and revoke scheduled slots across the service.</p>
                </div>
              </div>

              {apptsLoading ? (
                <div className="py-12 flex justify-center"><Activity className="h-6 w-6 animate-spin text-primary" /></div>
              ) : appointments.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">No appointments booked yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-border/60 text-muted-foreground font-medium">
                        <th className="pb-3 pr-4 font-semibold">Patient Name</th>
                        <th className="pb-3 pr-4 font-semibold">Assigned Doctor</th>
                        <th className="pb-3 pr-4 font-semibold">Schedule Date / Time</th>
                        <th className="pb-3 pr-4 font-semibold">Type</th>
                        <th className="pb-3 pr-4 font-semibold">Status</th>
                        <th className="pb-3 text-right font-semibold">Cancel / Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {appointments.map((appt: any) => {
                        const patName = appt.patientId?.name || "Deleted Patient";
                        const patEmail = appt.patientId?.email || "";
                        const docName = appt.doctorId?.userId?.name || "Deleted Doctor";
                        const docSpecialty = appt.doctorId?.specialty || "";
                        return (
                          <tr key={appt._id} className="hover:bg-secondary/20 transition-colors">
                            <td className="py-4 pr-4">
                              <div className="font-semibold text-foreground">{patName}</div>
                              <div className="text-xs text-muted-foreground">{patEmail}</div>
                            </td>
                            <td className="py-4 pr-4">
                              <div className="font-semibold text-foreground">{docName}</div>
                              <div className="text-xs text-muted-foreground">{docSpecialty}</div>
                            </td>
                            <td className="py-4 pr-4 text-foreground font-medium">
                              {appt.dateTime ? new Date(appt.dateTime).toLocaleString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }) : "N/A"}
                            </td>
                            <td className="py-4 pr-4">
                              <Badge variant="outline" className="rounded-full px-2 py-0.5">
                                {appt.type || "In-Person"}
                              </Badge>
                            </td>
                            <td className="py-4 pr-4">
                              <Badge
                                variant="default"
                                className={`border-none rounded-full px-2 py-0.5 font-semibold text-white ${
                                  appt.status === "Confirmed"
                                    ? "bg-emerald-500"
                                    : appt.status === "Completed"
                                    ? "bg-indigo-500"
                                    : appt.status === "Cancelled"
                                    ? "bg-red-500"
                                    : "bg-amber-500"
                                }`}
                              >
                                {appt.status || "Pending"}
                              </Badge>
                            </td>
                            <td className="py-4 text-right">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:bg-destructive/10 rounded-full"
                                onClick={() => setCancelAppointmentId(appt._id)}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      <Footer />

      {/* Delete User Confirmation Modal */}
      <AlertDialog open={deleteUserId !== null} onOpenChange={(open) => !open && setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">Permanently Delete User Account?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this user from the system? This action is permanent and will delete all profiles, appointments, and associated records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-white"
              onClick={() => {
                if (deleteUserId) {
                  deleteUserMutation.mutate(deleteUserId);
                }
              }}
            >
              Permanently Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Appointment Confirmation Modal */}
      <AlertDialog open={cancelAppointmentId !== null} onOpenChange={(open) => !open && setCancelAppointmentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive font-bold">Cancel Scheduled Appointment Slot?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the selected booking from the patient's schedule and free up the doctor's calendar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-white"
              onClick={() => {
                if (cancelAppointmentId) {
                  cancelApptMutation.mutate(cancelAppointmentId);
                }
              }}
            >
              Cancel Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
