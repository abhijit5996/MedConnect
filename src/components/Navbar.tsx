import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="bg-background/80 backdrop-blur-lg border border-border rounded-full shadow-lg px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-full p-2 group-hover:scale-110 transition-transform shadow-md">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground hidden sm:block">MedConnect</span>
          </Link>

          {/* Desktop Navigation - Pill shaped */}
          <div className="hidden md:flex items-center bg-secondary/50 rounded-full px-6 py-2 space-x-1">
            <Link to="/" className="px-4 py-2 rounded-full text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300">
              Home
            </Link>
            <Link to="/services" className="px-4 py-2 rounded-full text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300">
              Services
            </Link>
            <Link to="/doctors" className="px-4 py-2 rounded-full text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300">
              Doctors
            </Link>
            <Link to="/about" className="px-4 py-2 rounded-full text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300">
              About
            </Link>
            <Link to="/contact" className="px-4 py-2 rounded-full text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300">
              Contact
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link to="/login">
              <Button variant="ghost" className="rounded-full">Login</Button>
            </Link>
            <Link to="/register">
              <Button variant="accent" className="rounded-full shadow-lg hover:shadow-xl transition-shadow">Register</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-secondary transition-colors"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-lg border border-border rounded-3xl shadow-xl p-6 space-y-3 animate-fade-in">
            <Link
              to="/"
              className="block px-4 py-2 text-foreground hover:bg-primary hover:text-primary-foreground rounded-full transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/services"
              className="block px-4 py-2 text-foreground hover:bg-primary hover:text-primary-foreground rounded-full transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              to="/doctors"
              className="block px-4 py-2 text-foreground hover:bg-primary hover:text-primary-foreground rounded-full transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              Doctors
            </Link>
            <Link
              to="/about"
              className="block px-4 py-2 text-foreground hover:bg-primary hover:text-primary-foreground rounded-full transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-4 py-2 text-foreground hover:bg-primary hover:text-primary-foreground rounded-full transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="flex flex-col space-y-2 pt-4 border-t border-border">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full rounded-full">
                  Login
                </Button>
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                <Button variant="accent" className="w-full rounded-full">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
