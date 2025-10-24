import { Link } from "react-router-dom";
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

const PatientDashboard = () => {
  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Priya Sharma",
      specialty: "Cardiologist",
      date: "March 15, 2025",
      time: "10:30 AM",
      type: "In-person",
    },
    {
      id: 2,
      doctor: "Dr. Rajesh Kumar",
      specialty: "General Physician",
      date: "March 20, 2025",
      time: "2:00 PM",
      type: "Video Call",
    },
  ];

  const recentRecords = [
    { id: 1, type: "Blood Test", date: "March 1, 2025", doctor: "Dr. Sharma" },
    { id: 2, type: "X-Ray", date: "Feb 28, 2025", doctor: "Dr. Kumar" },
    { id: 3, type: "Prescription", date: "Feb 25, 2025", doctor: "Dr. Patel" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Patient Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, John Doe</p>
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
                <p className="text-sm text-muted-foreground mb-1">Appointments</p>
                <p className="text-2xl font-bold">2</p>
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
                <p className="text-2xl font-bold">24</p>
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
                <p className="text-2xl font-bold">3</p>
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
                <p className="text-2xl font-bold">85</p>
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
                <Link to="/appointments">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
              <div className="space-y-4">
                {upcomingAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{apt.doctor}</h3>
                        <p className="text-sm text-muted-foreground">{apt.specialty}</p>
                        <p className="text-sm text-muted-foreground">
                          {apt.date} at {apt.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                        {apt.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Records */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Recent Medical Records</h2>
                <Link to="/records">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
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
                    <Button variant="ghost" size="sm">
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
                <Link to="/records/upload">
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Record
                  </Button>
                </Link>
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
                  <span className="font-semibold text-green-600">Normal</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Heart Rate</span>
                  <span className="font-semibold">72 bpm</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Last Checkup</span>
                  <span className="font-semibold">15 days ago</span>
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

      <Footer />
    </div>
  );
};

export default PatientDashboard;
