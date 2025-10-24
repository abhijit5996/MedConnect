import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Stethoscope,
  Calendar,
  FileText,
  Shield,
  Video,
  MessageSquare,
  Bell,
  Share2,
  Clock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Services = () => {
  const mainServices = [
    {
      icon: <Calendar className="h-12 w-12 text-primary" />,
      title: "Online Appointments",
      description: "Book appointments with verified doctors instantly. Choose from available slots and get instant confirmation.",
      features: ["Real-time availability", "Instant confirmation", "Easy rescheduling", "SMS reminders"],
      delay: "0s",
    },
    {
      icon: <FileText className="h-12 w-12 text-primary" />,
      title: "Digital Health Records",
      description: "Store all your medical records in one secure place. Access prescriptions, reports, and history anytime.",
      features: ["Secure cloud storage", "Easy upload/download", "Timeline view", "QR sharing"],
      delay: "0.1s",
    },
    {
      icon: <Video className="h-12 w-12 text-primary" />,
      title: "Telemedicine Consultations",
      description: "Connect with doctors virtually from the comfort of your home. Quality healthcare made accessible.",
      features: ["HD video calls", "Secure messaging", "E-prescriptions", "24/7 availability"],
      delay: "0.2s",
    },
    {
      icon: <Shield className="h-12 w-12 text-primary" />,
      title: "Secure Record Sharing",
      description: "Share medical records securely with doctors and hospitals. Complete control over your data.",
      features: ["Temporary access links", "QR code sharing", "Access logs", "Revoke anytime"],
      delay: "0.3s",
    },
    {
      icon: <Bell className="h-12 w-12 text-primary" />,
      title: "Smart Notifications",
      description: "Never miss an appointment or medication. Get timely reminders and health updates.",
      features: ["Appointment alerts", "Medicine reminders", "Report updates", "Doctor messages"],
      delay: "0.4s",
    },
    {
      icon: <MessageSquare className="h-12 w-12 text-primary" />,
      title: "Patient-Doctor Chat",
      description: "Secure messaging with your healthcare providers. Quick answers to your health queries.",
      features: ["Real-time chat", "Secure encryption", "File sharing", "Chat history"],
      delay: "0.5s",
    },
  ];

  const additionalFeatures = [
    { icon: <Stethoscope />, text: "Multi-specialty doctors" },
    { icon: <Clock />, text: "24/7 support available" },
    { icon: <Share2 />, text: "Cross-hospital coordination" },
    { icon: <CheckCircle2 />, text: "Verified healthcare providers" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section with Animation */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 animate-fade-in" variant="secondary">
            Comprehensive Healthcare Solutions
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in-up">
            Our <span className="text-primary">Services</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Complete digital healthcare ecosystem designed to make medical care accessible, 
            efficient, and patient-centric across India.
          </p>
        </div>
      </section>

      {/* Main Services Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainServices.map((service, index) => (
              <Card 
                key={index} 
                className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary animate-fade-in-up group"
                style={{ animationDelay: service.delay }}
              >
                <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">{service.title}</h3>
                <p className="text-muted-foreground mb-6">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Bar */}
      <section className="py-16 bg-secondary/30 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center text-center animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-primary/10 rounded-full p-4 mb-4">
                  {feature.icon}
                </div>
                <p className="font-medium text-foreground">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Healthcare Experience?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of patients already managing their health digitally
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/doctors">
                <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Find a Doctor
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
