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

const DoctorDashboard = () => {
  const todayAppointments = [
    {
      id: 1,
      patient: "Rajesh Kumar",
      time: "10:30 AM",
      type: "In-person",
      status: "Confirmed",
    },
    {
      id: 2,
      patient: "Priya Sharma",
      time: "11:30 AM",
      type: "Video Call",
      status: "Confirmed",
    },
    {
      id: 3,
      patient: "Amit Patel",
      time: "2:00 PM",
      type: "In-person",
      status: "Pending",
    },
  ];

  const recentPatients = [
    { id: 1, name: "Sanjay Verma", lastVisit: "March 5, 2025", condition: "Follow-up" },
    { id: 2, name: "Meera Singh", lastVisit: "March 3, 2025", condition: "Checkup" },
    { id: 3, name: "Arjun Reddy", lastVisit: "March 1, 2025", condition: "Consultation" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Doctor Dashboard</h1>
            <p className="text-muted-foreground">Dr. Sarah Williams, Cardiologist</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm">
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
                <p className="text-2xl font-bold">8</p>
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
                <p className="text-2xl font-bold">342</p>
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
                <p className="text-2xl font-bold">5</p>
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
                <p className="text-2xl font-bold">4.8</p>
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
                {todayAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{apt.patient}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {apt.time}
                          </span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {apt.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="default" size="sm">
                        Start
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Patients */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Recent Patients</h2>
                <Button variant="outline" size="sm">
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
                    <Button variant="ghost" size="sm">
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
                  <Button variant="outline" className="w-full">
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
                <Button variant="default" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Upload Prescription
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Patient Records
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DoctorDashboard;
