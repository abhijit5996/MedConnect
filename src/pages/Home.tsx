import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Activity, Calendar, FileText, Shield, Users, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroMri from "@/assets/hero-mri.jpg";
import doctorTrust from "@/assets/doctor-trust.jpg";
import iconCt from "@/assets/icon-ct.png";
import iconMri from "@/assets/icon-mri.png";
import iconUltrasound from "@/assets/icon-ultrasound.png";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section with Enhanced Animations */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-secondary py-24 lg:py-32">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                High-tech diagnostics for{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">comprehensive understanding</span> of your health
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
                Connect with healthcare providers across India. Manage your medical records, book appointments, and access quality healthcare from anywhere.
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <Link to="/register">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-xl hover:scale-105 font-semibold transition-all">
                    Make an appointment
                  </Button>
                </Link>
                <Link to="/doctors">
                  <Button variant="outline" size="lg" className="hover:scale-105 transition-transform">
                    Find Doctors
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative animate-fade-in-up group" style={{ animationDelay: "0.1s" }}>
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-2xl transition-all duration-500 group-hover:from-primary/30"></div>
              <img
                src={heroMri}
                alt="Medical Diagnostic Equipment"
                className="relative rounded-2xl shadow-2xl animate-float transform group-hover:scale-[1.02] transition-transform duration-500"
              />
              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-background border-2 border-primary rounded-2xl p-4 shadow-xl animate-float hidden lg:block">
                <p className="text-3xl font-bold text-primary">50K+</p>
                <p className="text-sm text-muted-foreground">Patients</p>
              </div>
              <div className="absolute -top-6 -right-6 bg-background border-2 border-accent rounded-2xl p-4 shadow-xl animate-float hidden lg:block" style={{ animationDelay: "0.5s" }}>
                <p className="text-3xl font-bold text-accent">5K+</p>
                <p className="text-sm text-muted-foreground">Doctors</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section with Staggered Animation */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card border-border group animate-fade-in-up">
              <div className="flex justify-center mb-6">
                <div className="bg-secondary rounded-full p-6 group-hover:scale-110 transition-transform duration-300">
                  <img src={iconCt} alt="CT Scan" className="h-16 w-16" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Medical Records</h3>
              <p className="text-muted-foreground mb-6">
                Securely store and access all your medical records in one centralized platform. Share with doctors instantly.
              </p>
              <Link to="/services" className="text-primary font-semibold hover:underline">
                Read more →
              </Link>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card border-border group animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex justify-center mb-6">
                <div className="bg-secondary rounded-full p-6 group-hover:scale-110 transition-transform duration-300">
                  <img src={iconMri} alt="MRI" className="h-16 w-16" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Appointments</h3>
              <p className="text-muted-foreground mb-6">
                Book appointments with top doctors and specialists. Get real-time availability and instant confirmations.
              </p>
              <Link to="/services" className="text-primary font-semibold hover:underline">
                Read more →
              </Link>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card border-border group animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="flex justify-center mb-6">
                <div className="bg-secondary rounded-full p-6 group-hover:scale-110 transition-transform duration-300">
                  <img src={iconUltrasound} alt="Ultrasound" className="h-16 w-16" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Doctor Discovery</h3>
              <p className="text-muted-foreground mb-6">
                Find the right healthcare provider for your needs. Search by specialization, location, and availability.
              </p>
              <Link to="/doctors" className="text-primary font-semibold hover:underline">
                Read more →
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Healthcare platform that you can trust
                </h2>
                <p className="text-muted-foreground text-lg">
                  We offer the highest quality of medical coordination services. Our platform connects patients with experienced healthcare providers using advanced technology to ensure accurate records and seamless care.
                </p>
                <Link to="/about">
                  <Button variant="link" className="px-0 text-primary font-semibold">
                    Read more →
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-background p-6 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">500+</div>
                      <div className="text-sm text-muted-foreground">Hospitals</div>
                    </div>
                  </div>
                </div>

                <div className="bg-background p-6 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Activity className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">1000+</div>
                      <div className="text-sm text-muted-foreground">Services</div>
                    </div>
                  </div>
                </div>

                <div className="bg-background p-6 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">5000+</div>
                      <div className="text-sm text-muted-foreground">Doctors</div>
                    </div>
                  </div>
                </div>

                <div className="bg-background p-6 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">50,000+</div>
                      <div className="text-sm text-muted-foreground">Patients</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl"></div>
              <img
                src={doctorTrust}
                alt="Trusted Healthcare Professional"
                className="relative rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose MedConnect?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A comprehensive healthcare platform designed for modern India
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
              <FileText className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Unified Records</h3>
              <p className="text-muted-foreground">
                All your medical history, prescriptions, and lab results in one secure place.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
              <Calendar className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Easy Scheduling</h3>
              <p className="text-muted-foreground">
                Book, reschedule, or cancel appointments with just a few clicks.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
              <p className="text-muted-foreground">
                Your health data is encrypted and protected with industry-leading security.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Verified Doctors</h3>
              <p className="text-muted-foreground">
                Connect with qualified and verified healthcare professionals across India.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
              <Activity className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Real-time Updates</h3>
              <p className="text-muted-foreground">
                Get instant notifications for appointments, results, and prescriptions.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
              <TrendingUp className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Health Insights</h3>
              <p className="text-muted-foreground">
                Track your health journey with visual timelines and analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to take control of your healthcare?
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of patients and doctors already using MedConnect for better health outcomes.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-xl hover:scale-105 font-semibold transition-all">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
