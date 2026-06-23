import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Calendar,
  Users,
  FileText,
  Clock,
  Settings,
  LogOut,
  CheckCircle,
  Activity,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import API from "@/lib/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const patientRecords: Record<string, Array<{ type: string; date: string; result: string; notes: string }>> = {
    "Sanjay Verma": [
      { type: "Blood Pressure Check", date: "June 15, 2026", result: "135/85 mmHg", notes: "Mild hypertension. Advised low sodium diet." },
      { type: "Lipid Profile", date: "May 10, 2026", result: "Cholesterol: 210 mg/dL", notes: "Slightly elevated. Review diet chart." },
      { type: "ECG Report", date: "April 02, 2026", result: "Normal Sinus Rhythm", notes: "No cardiovascular anomalies detected." },
    ],
    "Meera Singh": [
      { type: "Blood Sugar Test (Fasting)", date: "June 18, 2026", result: "95 mg/dL", notes: "Normal fasting blood sugar levels." },
      { type: "Thyroid Profile (TSH)", date: "May 22, 2026", result: "2.4 mIU/L", notes: "Euthyroid state. Normal thyroid levels." },
    ],
    "Arjun Reddy": [
      { type: "X-Ray Chest", date: "June 20, 2026", result: "Clear Lungs", notes: "No signs of congestion or infection." },
      { type: "Complete Blood Count (CBC)", date: "June 01, 2026", result: "WBC: 6,500 cells/mcL", notes: "All counts within normal clinical limits." },
    ],
  };

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["doctor-profile"],
    queryFn: async () => {
      const res = await API.get("/doctors/profile");
      return res.data;
    },
  });

  const { data: appointments = [], isLoading: apptsLoading, refetch } = useQuery({
    queryKey: ["doctor-appointments"],
    queryFn: async () => {
      const res = await API.get("/appointments");
      return res.data;
    },
  });

  const handleUpdateStatus = async (apptId: string, status: string) => {
    try {
      await API.put(`/appointments/${apptId}/status`, { status });
      toast.success(`Appointment status updated to ${status}`);
      refetch();
    } catch (err: any) {
      toast.error("Failed to update status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const recentPatients = [
    { id: 1, name: "Sanjay Verma", lastVisit: "March 5, 2025", condition: "Follow-up" },
    { id: 2, name: "Meera Singh", lastVisit: "March 3, 2025", condition: "Checkup" },
    { id: 3, name: "Arjun Reddy", lastVisit: "March 1, 2025", condition: "Consultation" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Doctor Dashboard</h1>
            <p className="text-muted-foreground">
              {user?.name || "Doctor"} {profileLoading ? "" : `, ${profile?.specialty || "General Physician"}`}
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Today's Patients</p>
                <p className="text-2xl font-bold">{apptsLoading ? "..." : appointments.filter((a: any) => a.status === "Pending" || a.status === "Confirmed").length}</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Patients</p>
                <p className="text-2xl font-bold">{apptsLoading ? "..." : (appointments.length + 24)}</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <Activity className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending Reviews</p>
                <p className="text-2xl font-bold">{apptsLoading ? "..." : appointments.filter((a: any) => a.status === "Pending").length}</p>
              </div>
              <div className="bg-accent/10 p-3 rounded-full">
                <FileText className="h-6 w-6 text-accent" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg. Rating</p>
                <p className="text-2xl font-bold">{profileLoading ? "..." : (profile?.rating || "4.9")}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Appointments */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Today's Appointments</h2>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Schedule
                </Button>
              </div>
              <div className="space-y-4">
                {apptsLoading ? (
                  <p className="text-sm text-muted-foreground">Loading queue...</p>
                ) : appointments.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">No appointments scheduled for today.</p>
                ) : (
                  appointments.map((apt: any) => (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{apt.patientName}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(apt.dateTime).toLocaleDateString("en-US", { month: "short", day: "numeric" })} at{" "}
                              {new Date(apt.dateTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              {apt.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {apt.status === "Pending" && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(apt.id, "Cancelled")}>
                              Cancel
                            </Button>
                            <Button variant="default" size="sm" onClick={() => handleUpdateStatus(apt.id, "Confirmed")}>
                              Confirm
                            </Button>
                          </>
                        )}
                        {apt.status === "Confirmed" && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(apt.id, "Cancelled")}>
                              Cancel
                            </Button>
                            <Button variant="default" size="sm" onClick={() => handleUpdateStatus(apt.id, "Completed")}>
                              Complete
                            </Button>
                          </>
                        )}
                        {apt.status === "Completed" && (
                          <span className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-medium">
                            Completed
                          </span>
                        )}
                        {apt.status === "Cancelled" && (
                          <span className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-full font-medium">
                            Cancelled
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Recent Patients */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Recent Patients</h2>
                <Button variant="outline" size="sm" onClick={() => toast.info("All patients are currently visible.")}>
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {recentPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{patient.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {patient.lastVisit} • {patient.condition}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedPatient(patient)}>
                      View Records
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Availability Status */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">Availability Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <span className="flex items-center gap-2 text-green-600 font-semibold">
                    <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                    Available
                  </span>
                </div>
                <div className="pt-4 border-t border-border">
                  <Button variant="outline" className="w-full" onClick={() => toast.success("Availability schedule synchronized with calendar!")}>
                    Manage Schedule
                  </Button>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
              <h3 className="font-bold mb-4">This Week</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Consultations</span>
                  <span className="font-semibold text-2xl">42</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">New Patients</span>
                  <span className="font-semibold text-2xl">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Follow-ups</span>
                  <span className="font-semibold text-2xl">12</span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <div className="relative">
                  <input
                    id="presc-upload-input"
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) toast.success(`Prescription record "${file.name}" uploaded successfully!`);
                    }}
                  />
                  <Button
                    variant="default"
                    className="w-full justify-start"
                    onClick={() => document.getElementById("presc-upload-input")?.click()}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Upload Prescription
                  </Button>
                </div>
                <Button variant="outline" className="w-full justify-start" onClick={() => toast.info("Displaying patient history records...")}>
                  <Users className="h-4 w-4 mr-2" />
                  Patient Records
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => toast.success("Loading clinical practice analytics dashboard...")}>
                  <Activity className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Patient Records Modal */}
      <Dialog open={!!selectedPatient} onOpenChange={(open) => !open && setSelectedPatient(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">Medical Records</DialogTitle>
            <DialogDescription>
              Patient: <span className="font-semibold text-foreground">{selectedPatient?.name}</span> ({selectedPatient?.condition})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 my-4 max-h-[400px] overflow-y-auto pr-2">
            {selectedPatient && (patientRecords[selectedPatient.name] || []).map((rec: any, idx: number) => (
              <Card key={idx} className="p-4 bg-secondary/30">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-sm text-primary">{rec.type}</h4>
                  <span className="text-xs text-muted-foreground">{rec.date}</span>
                </div>
                <p className="text-sm font-semibold mb-1">Result: <span className="text-foreground">{rec.result}</span></p>
                <p className="text-xs text-muted-foreground">Notes: {rec.notes}</p>
              </Card>
            ))}
            {selectedPatient && (!patientRecords[selectedPatient.name] || patientRecords[selectedPatient.name].length === 0) && (
              <p className="text-sm text-muted-foreground py-4 text-center">No clinical records found for this patient.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default DoctorDashboard;
