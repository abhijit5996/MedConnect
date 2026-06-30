import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
      toast.error(error.response?.data?.message || "Failed to book appointment");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.doctorId) {
      toast.error("Please select a doctor");
      return;
    }
    if (!formData.dateTime) {
      toast.error("Please select preferred date & time");
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8">
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
                <Select
                  value={formData.doctorId || undefined}
                  onValueChange={(val) => setFormData({ ...formData, doctorId: val })}
                  disabled={!!preselectedDoctorId}
                >
                  <SelectTrigger id="doctor" className="w-full">
                    <SelectValue placeholder="-- Choose a Doctor --" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doc: any) => (
                      <SelectItem key={doc.id} value={doc.id}>
                        {doc.name} - {doc.specialty} ({doc.consultationFee})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Consultation Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Consultation Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(val) => setFormData({ ...formData, type: val })}
                >
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder="Select Consultation Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="In-Person">In-Person Visit</SelectItem>
                    <SelectItem value="Video Call">Telemedicine Video Call</SelectItem>
                  </SelectContent>
                </Select>
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
      </main>
      <Footer />
    </div>
  );
};

export default BookAppointment;
