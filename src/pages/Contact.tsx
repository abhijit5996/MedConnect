import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Headphones,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6 text-primary" />,
      title: "Phone",
      details: ["+91 1800-123-4567", "+91 98765-43210"],
      subtext: "Mon-Sat, 9AM-8PM IST",
    },
    {
      icon: <Mail className="h-6 w-6 text-primary" />,
      title: "Email",
      details: ["support@medconnect.in", "info@medconnect.in"],
      subtext: "We reply within 24 hours",
    },
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "Office",
      details: ["MedConnect Headquarters", "Bangalore, Karnataka 560001"],
      subtext: "Visit by appointment",
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Working Hours",
      details: ["Mon - Sat: 9:00 AM - 8:00 PM", "Sunday: 10:00 AM - 4:00 PM"],
      subtext: "24/7 emergency support",
    },
  ];

  const supportOptions = [
    {
      icon: <Headphones className="h-8 w-8 text-primary" />,
      title: "Customer Support",
      description: "Get help with your account and services",
      action: "Start Chat",
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-primary" />,
      title: "Technical Support",
      description: "Resolve technical issues and bugs",
      action: "Report Issue",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Partner With Us",
      description: "Hospital or doctor? Join our network",
      action: "Learn More",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 animate-fade-in" variant="secondary">
            We're Here to Help
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in-up">
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Have questions? We'd love to hear from you. Send us a message and 
            we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <Card 
                key={index} 
                className="p-6 hover:shadow-xl transition-all hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  {info.icon}
                </div>
                <h3 className="text-lg font-bold mb-3 text-foreground">{info.title}</h3>
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-muted-foreground text-sm mb-1">{detail}</p>
                ))}
                <p className="text-xs text-primary mt-2 font-medium">{info.subtext}</p>
              </Card>
            ))}
          </div>

          {/* Main Contact Form and Support Options */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <Card className="lg:col-span-2 p-8 animate-fade-in">
              <h2 className="text-3xl font-bold mb-6 text-foreground">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Full Name</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="transition-all focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Email Address</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      className="transition-all focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Phone Number</label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      required
                      className="transition-all focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Subject</label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      required
                      className="transition-all focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Message</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    required
                    className="transition-all focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <Button type="submit" size="lg" variant="accent" className="w-full md:w-auto">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </Card>

            {/* Support Options */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground">Quick Support</h3>
              {supportOptions.map((option, index) => (
                <Card 
                  key={index} 
                  className="p-6 hover:border-primary border-2 transition-all cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                >
                  <div className="bg-primary/10 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                    {option.icon}
                  </div>
                  <h4 className="text-lg font-bold mb-2 text-foreground">{option.title}</h4>
                  <p className="text-muted-foreground text-sm mb-4">{option.description}</p>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => toast({ title: "Support Request", description: `Redirecting you to ${option.title}...` })}>
                    {option.action}
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="py-16 bg-secondary/30 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Frequently Asked Questions</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Find quick answers to common questions about MedConnect services, 
            appointments, and account management.
          </p>
          <Button variant="outline" size="lg">
            View All FAQs
          </Button>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <Card className="overflow-hidden">
            <div className="bg-secondary/50 h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">Visit Our Office</h3>
                <p className="text-muted-foreground">MedConnect Headquarters, Bangalore</p>
                <Button variant="accent" className="mt-4">
                  Get Directions
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
