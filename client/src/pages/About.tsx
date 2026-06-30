import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Target,
  Eye,
  Heart,
  Users,
  Award,
  Shield,
  Zap,
  Globe,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  const values = [
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Patient First",
      description: "Every decision we make puts patient care and wellbeing at the center",
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Trust & Security",
      description: "Your health data is protected with bank-level encryption and privacy",
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Innovation",
      description: "Leveraging latest technology to make healthcare accessible and efficient",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Collaboration",
      description: "Connecting patients, doctors, and hospitals in one unified platform",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Active Patients", icon: <Users className="h-6 w-6" /> },
    { number: "500+", label: "Verified Doctors", icon: <Award className="h-6 w-6" /> },
    { number: "50+", label: "Partner Hospitals", icon: <Globe className="h-6 w-6" /> },
    { number: "98%", label: "Satisfaction Rate", icon: <TrendingUp className="h-6 w-6" /> },
  ];

  const team = [
    {
      name: "Healthcare Experts",
      description: "Medical professionals guiding our platform development",
    },
    {
      name: "Tech Innovators",
      description: "Engineers building secure and scalable solutions",
    },
    {
      name: "Patient Advocates",
      description: "Ensuring user experience meets real-world needs",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 animate-fade-in" variant="secondary">
            Our Story
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in-up">
            About <span className="text-primary">MedConnect</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Revolutionizing healthcare delivery in India by connecting patients, 
            doctors, and hospitals in one unified digital ecosystem.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="p-10 border-2 hover:border-primary transition-all animate-fade-in-up hover:shadow-xl">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">Our Mission</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                To democratize access to quality healthcare across India by creating 
                a seamless digital platform that bridges the gap between patients and 
                healthcare providers. We believe everyone deserves efficient, affordable, 
                and coordinated medical care.
              </p>
            </Card>

            <Card className="p-10 border-2 hover:border-primary transition-all animate-fade-in-up hover:shadow-xl" style={{ animationDelay: "0.1s" }}>
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Eye className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">Our Vision</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                To become India's most trusted healthcare coordination platform, 
                where every patient has complete control over their health records 
                and can access the best medical care anytime, anywhere. Building a 
                healthier India, one connection at a time.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/30 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-4xl font-bold text-primary mb-2">{stat.number}</h3>
                <p className="text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Our Core Values</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Principles that guide everything we do at MedConnect
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card 
                key={index} 
                className="p-8 text-center hover:shadow-xl transition-all hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-secondary/30 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Our Team</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Diverse experts united by a passion for transforming healthcare
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <Card 
                key={index} 
                className="p-8 text-center hover:border-primary border-2 transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-gradient-to-br from-primary to-primary/80 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-10 w-10 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">{member.name}</h3>
                <p className="text-muted-foreground">{member.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Join Us in Transforming Healthcare
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you're a patient, doctor, or healthcare provider, 
            MedConnect has a place for you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="accent" className="text-lg px-8">
                Get Started Today
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
