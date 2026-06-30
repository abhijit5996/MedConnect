import { Link } from "react-router-dom";
import { Activity, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-border mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-primary rounded-full p-2">
                <Activity className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">MedConnect</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Connecting healthcare providers and patients for better health outcomes across India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li className="text-muted-foreground text-sm">Medical Records</li>
              <li className="text-muted-foreground text-sm">Appointments</li>
              <li className="text-muted-foreground text-sm">Lab Results</li>
              <li className="text-muted-foreground text-sm">Prescriptions</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-muted-foreground text-sm">
                <Phone className="h-4 w-4 mt-0.5 text-primary" />
                <span>+91 124 567 8900</span>
              </li>
              <li className="flex items-start space-x-2 text-muted-foreground text-sm">
                <Mail className="h-4 w-4 mt-0.5 text-primary" />
                <span>support@medconnect.in</span>
              </li>
              <li className="flex items-start space-x-2 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                <span>Mumbai, Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm">
          <p>
            &copy; {new Date().getFullYear()} MedConnect. All rights reserved
            <Link to="/admin-dashboard" className="cursor-default select-none hover:text-muted-foreground">
              .
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
