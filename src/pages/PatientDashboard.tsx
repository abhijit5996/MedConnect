import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Calendar,
  FileText,
  Bell,
  Upload,
  Activity,
  User,
  LogOut,
  Settings,
  Heart,
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

const PatientDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const { data: appointments = [], isLoading: apptsLoading } = useQuery({
    queryKey: ["patient-appointments"],
    queryFn: async () => {
      const res = await API.get("/appointments");
      return res.data;
    },
  });

  const { data: vitals, isLoading: vitalsLoading } = useQuery({
    queryKey: ["patient-vitals"],
    queryFn: async () => {
      const res = await API.get("/vitals");
      return res.data;
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleUploadRecord = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success(`Record "${file.name}" uploaded successfully!`);
    }
  };

  const recentRecords = [
    { id: 1, type: "Blood Test", date: "March 1, 2025", doctor: "Dr. Sharma", result: "Haemoglobin: 14.2 g/dL (Normal), WBC: 7,200/mcL (Normal), Platelets: 250,000/mcL (Normal)", notes: "General health test. All key markers are within reference ranges." },
    { id: 2, type: "X-Ray Chest", date: "Feb 28, 2025", doctor: "Dr. Kumar", result: "Clear Lungs & Mediastinum", notes: "No signs of congestion, infection, or cardiomegaly." },
    { id: 3, type: "Prescription Sheet", date: "Feb 25, 2025", doctor: "Dr. Patel", result: "Metoprolol 25mg (Once daily), Vitamin D3 (Once weekly)", notes: "Take Metoprolol after meals. Check blood pressure weekly." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Patient Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name || "Patient"}</p>
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
                <p className="text-sm text-muted-foreground mb-1">Appointments</p>
                <p className="text-2xl font-bold">{apptsLoading ? "..." : appointments.length}</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Medical Records</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Notifications</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <div className="bg-accent/10 p-3 rounded-full">
                <Bell className="h-6 w-6 text-accent" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Health Score</p>
                <p className="text-2xl font-bold">{vitalsLoading ? "..." : (vitals?.healthScore || 85)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Appointments */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Upcoming Appointments</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info("All upcoming appointments are listed below.")}
                >
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {apptsLoading ? (
                  <p className="text-sm text-muted-foreground">Loading appointments...</p>
                ) : appointments.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">No upcoming appointments scheduled.</p>
                ) : (
                  appointments.map((apt: any) => (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{apt.doctorName}</h3>
                          <p className="text-sm text-muted-foreground">{apt.specialty}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(apt.dateTime).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} at{" "}
                            {new Date(apt.dateTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                          {apt.type}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          apt.status === "Confirmed" ? "bg-green-100 text-green-700" :
                          apt.status === "Cancelled" ? "bg-red-100 text-red-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Recent Records */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Recent Medical Records</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info("All recent medical records are shown below.")}
                >
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {recentRecords.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">{record.type}</h4>
                        <p className="text-sm text-muted-foreground">
                          {record.date} • {record.doctor}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedRecord(record)}>
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/appointments/book">
                  <Button variant="default" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                </Link>
                <div className="relative">
                  <input
                    id="record-upload-input"
                    type="file"
                    className="hidden"
                    onChange={handleUploadRecord}
                  />
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => document.getElementById("record-upload-input")?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Record
                  </Button>
                </div>
                <Link to="/doctors">
                  <Button variant="outline" className="w-full justify-start">
                    <Activity className="h-4 w-4 mr-2" />
                    Find Doctors
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Health Summary */}
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
              <h3 className="font-bold mb-4">Health Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Blood Pressure</span>
                  <span className="font-semibold text-green-600">{vitalsLoading ? "..." : (vitals?.bloodPressure || "120/80")}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Heart Rate</span>
                  <span className="font-semibold">{vitalsLoading ? "..." : (vitals?.heartRate || "72 bpm")}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Temperature</span>
                  <span className="font-semibold">{vitalsLoading ? "..." : (vitals?.temperature || "98.6 °F")}</span>
                </div>
              </div>
            </Card>

            {/* Notifications */}
            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <p className="text-sm font-medium">Appointment Reminder</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tomorrow at 10:30 AM with Dr. Sharma
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm font-medium">Lab Results Ready</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your blood test results are available
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Medical Record Modal */}
      <Dialog open={!!selectedRecord} onOpenChange={(open) => !open && setSelectedRecord(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">{selectedRecord?.type}</DialogTitle>
            <DialogDescription>
              Attending: <span className="font-semibold text-foreground">{selectedRecord?.doctor}</span> • Date: {selectedRecord?.date}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 my-4">
            <div>
              <h4 className="text-sm font-bold text-primary mb-1">Clinical Results</h4>
              <p className="text-sm text-foreground bg-secondary/40 p-3 rounded-lg border border-border leading-relaxed font-mono">
                {selectedRecord?.result}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-primary mb-1">Doctor Remarks</h4>
              <p className="text-xs text-muted-foreground bg-secondary/20 p-3 rounded-lg">
                {selectedRecord?.notes}
              </p>
            </div>
            <div className="pt-2">
              <Button className="w-full flex items-center justify-center gap-1.5" size="sm" onClick={() => toast.success(`Downloaded: ${selectedRecord?.type.toLowerCase().replace(" ", "_")}_report.pdf`)}>
                Download Diagnostic PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default PatientDashboard;
