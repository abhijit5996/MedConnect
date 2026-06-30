import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import API from "@/lib/api";
import { toast } from "sonner";
import { Calendar, User, ArrowLeft, Loader2 } from "lucide-react";

const fetchDoctors = async () => {
  const response = await API.get("/doctors");
  return response.data;
};

const BookAppointment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedDoctorId = searchParams.get("doctorId") || "";

  const [formData, setFormData] = useState({
    doctorId: preselectedDoctorId,
    dateTime: "",
    type: "In-Person",
    notes: "",
  });

  const { data: doctors = [], isLoading: doctorsLoading } = useQuery({
    queryKey: ["doctors-list-booking"],
    queryFn: fetchDoctors,
  });

  const mutation = useMutation({
    mutationFn: async (appointmentData: typeof formData) => {
      const response = await API.post("/appointments", appointmentData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Appointment booked successfully!");
      navigate("/patient-dashboard");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to book appointment. Please try again.";
      toast.error(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.doctorId) {
      toast.error("Please select a doctor");
      return;
    }
    if (!formData.dateTime) {
      toast.error("Please choose a date and time");
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 max-w-2xl">
        <Link to="/patient-dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <Card className="p-8 shadow-xl">
          <div className="text-center mb-8 space-y-2">
            <div className="bg-primary/10 rounded-full p-3 w-fit mx-auto">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Book an Appointment</h1>
            <p className="text-muted-foreground">Select a specialist and choose your preferred slot</p>
          </div>

          {doctorsLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Doctor Selection */}
              <div className="space-y-2">
                <Label htmlFor="doctor">Select Specialist</Label>
                <select
                  id="doctor"
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed"
                  required
                  disabled={!!preselectedDoctorId}
                >
                  <option value="">-- Choose a Doctor --</option>
                  {doctors.map((doc: any) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} - {doc.specialty} ({doc.consultationFee})
                    </option>
                  ))}
                </select>
              </div>

              {/* Consultation Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Consultation Type</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="In-Person">In-Person Visit</option>
                  <option value="Video Call">Telemedicine Video Call</option>
                </select>
              </div>

              {/* Date Time Picker */}
              <div className="space-y-2">
                <Label htmlFor="dateTime">Preferred Date & Time</Label>
                <Input
                  id="dateTime"
                  type="datetime-local"
                  value={formData.dateTime}
                  onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                  required
                  className="w-full"
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Symptoms / Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Describe your health symptoms or queries briefly..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" size="lg" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Booking Slot...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </Button>
            </form>
          )}
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default BookAppointment;
