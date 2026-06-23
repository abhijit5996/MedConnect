import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, MapPin, Star, Calendar, Video } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import API from "@/lib/api";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const fetchDoctors = async () => {
  const response = await API.get("/doctors");
  return response.data;
};

const Doctors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");

  const specialties = [
    "All",
    "Cardiologist",
    "Dermatologist",
    "Neurologist",
    "Pediatrician",
    "Orthopedic",
    "General Physician",
  ];

  const { data: doctors = [], isLoading, error } = useQuery({
    queryKey: ["doctors"],
    queryFn: fetchDoctors,
  });

  const filteredDoctors = doctors.filter((doctor: any) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === "all" ||
      doctor.specialty.toLowerCase() === selectedSpecialty.toLowerCase();
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Find Your Doctor</h1>
          <p className="text-muted-foreground text-lg">
            Connect with verified healthcare professionals across India
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by doctor name or specialty..."
              className="pl-12 h-12 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Specialty Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            {specialties.map((specialty) => (
              <Button
                key={specialty}
                variant={
                  selectedSpecialty === specialty.toLowerCase() ? "default" : "outline"
                }
                onClick={() => setSelectedSpecialty(specialty.toLowerCase())}
                size="sm"
              >
                {specialty}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Found <span className="font-semibold text-foreground">{filteredDoctors.length}</span>{" "}
            doctors
          </p>
        </div>

        {/* Doctor Cards Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 animate-pulse">
            {[1, 2, 3].map((n) => (
              <Card key={n} className="p-6 h-[250px] bg-card/50 flex flex-col justify-between" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredDoctors.map((doctor: any) => (
              <Card
                key={doctor.id}
              className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="text-5xl">{doctor.image}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{doctor.name}</h3>
                  <p className="text-primary text-sm font-medium">{doctor.specialty}</p>
                  <p className="text-muted-foreground text-sm">{doctor.experience} experience</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{doctor.rating}</span>
                  <span className="text-muted-foreground text-sm">({doctor.reviews} reviews)</span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  {doctor.location}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Consultation Fee</span>
                  <span className="font-semibold">{doctor.consultationFee}</span>
                </div>

                <div className="flex items-center gap-2">
                  {doctor.videoConsult && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1">
                      <Video className="h-3 w-3" />
                      Video Consult
                    </span>
                  )}
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      doctor.availability === "Available Today"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {doctor.availability}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" size="sm" onClick={() => toast.info(`Detailed profile for ${doctor.name} is available in the booking panel.`)}>
                  View Profile
                </Button>
                <Link to={`/appointments/book?doctorId=${doctor.id}`} className="flex-1">
                  <Button variant="default" className="w-full" size="sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    Book
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
        )}

        {/* Empty State */}
        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No doctors found. Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Doctors;
