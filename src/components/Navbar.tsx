import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, Menu, X, LogOut, LayoutDashboard, Sun, Moon, Laptop } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className="rounded-full w-9 h-9 text-foreground hover:bg-secondary transition-colors"
      title={`Theme: ${theme}`}
    >
      {theme === "light" && <Sun className="h-4 w-4 text-amber-500" />}
      {theme === "dark" && <Moon className="h-4 w-4 text-indigo-400" />}
      {(theme === "system" || !theme) && <Laptop className="h-4 w-4 text-muted-foreground" />}
    </Button>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsMenuOpen(false);
    navigate("/login");
  };

  const dashboardPath =
    user?.role === "admin"
      ? "/admin-dashboard"
      : user?.role === "doctor"
      ? "/doctor-dashboard"
      : "/patient-dashboard";

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="bg-background/80 backdrop-blur-lg border border-border rounded-full shadow-lg px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-full p-2 group-hover:scale-110 transition-transform shadow-md">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground hidden sm:block">Medconnect</span>
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
            <ThemeToggle />
            {user ? (
              <>
                <span className="text-xs font-semibold text-muted-foreground mr-1">
                  Hi, {user.name.split(" ")[0]}
                </span>
                <Link to={dashboardPath}>
                  <Button variant="ghost" className="rounded-full flex items-center gap-1.5" size="sm">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="accent" className="rounded-full flex items-center gap-1.5 shadow-md" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="rounded-full">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="accent" className="rounded-full shadow-lg hover:shadow-xl transition-shadow">Register</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
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
              {user ? (
                <>
                  <Link to={dashboardPath} onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full rounded-full flex items-center justify-center gap-1.5">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="accent" className="w-full rounded-full flex items-center justify-center gap-1.5" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
