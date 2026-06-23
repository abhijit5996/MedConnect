import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Activity, ShieldAlert, KeyRound, UserPlus } from "lucide-react";
import { toast } from "sonner";
import API from "@/lib/api";

const AdminAuth = () => {
  const navigate = useNavigate();
  const [isLoadingCheck, setIsLoadingCheck] = useState(true);
  const [hasAdmin, setHasAdmin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sign In Form State
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  // Sign Up Form State
  const [signUpData, setSignUpData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Check if admin already exists
  const checkAdminStatus = async () => {
    try {
      const response = await API.get("/auth/admin-check");
      setHasAdmin(response.data.hasAdmin);
    } catch (error: any) {
      console.error("Error checking admin status:", error);
      toast.error("Failed to verify portal registration status.");
    } finally {
      setIsLoadingCheck(false);
    }
  };

  useEffect(() => {
    // Check if user is already logged in as admin
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      try {
        const user = JSON.parse(storedUser);
        if (user.role === "admin") {
          navigate("/admin-dashboard");
          return;
        }
      } catch (e) {
        // Clear corrupt details
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    checkAdminStatus();
  }, [navigate]);

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInData.email || !signInData.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await API.post("/auth/login", {
        email: signInData.email,
        password: signInData.password,
      });

      const { token, user } = response.data;
      if (user.role !== "admin") {
        toast.error("Access denied. Not an administrator account.");
        setIsSubmitting(false);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Welcome, Administrator!");
      navigate("/admin-dashboard");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Invalid credentials.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { fullName, email, phone, password, confirmPassword } = signUpData;

    if (!fullName || !email || !password) {
      toast.error("Required fields must be filled.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      await API.post("/auth/register", {
        name: fullName,
        email,
        phone: phone || "",
        password,
        role: "admin",
      });

      toast.success("Administrator account created! Please sign in.");
      setSignUpData({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
      // Refresh status so it switches back to login view
      await checkAdminStatus();
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to register admin.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingCheck) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F17] text-white">
        <div className="flex flex-col items-center gap-4">
          <Activity className="h-10 w-10 text-primary animate-pulse" />
          <p className="text-muted-foreground font-medium text-sm">Synchronizing Portal Status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/60 via-zinc-950 to-[#0B0F17] flex items-center justify-center p-4">
      {/* Glow decorative dots */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <Card className="w-full max-w-md p-8 bg-zinc-950/40 backdrop-blur-xl border-zinc-800/80 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center justify-center space-x-2 group">
            <div className="bg-primary rounded-full p-2 group-hover:scale-110 transition-transform">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">MedConnect</span>
          </Link>
          <div className="flex items-center justify-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase">
            <ShieldAlert className="h-4.5 w-4.5 text-primary" />
            <span>Admin Portal</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-2">
            {hasAdmin ? "Administrator Login" : "Initial Admin Setup"}
          </h1>
          <p className="text-zinc-400 text-sm">
            {hasAdmin 
              ? "Access secure medical registry database management tables" 
              : "Register the primary platform administrator credentials"}
          </p>
        </div>

        {hasAdmin ? (
          // Admin Sign In Form
          <form onSubmit={handleSignInSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@medconnect.in"
                value={signInData.email}
                onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                required
                className="bg-zinc-900/50 border-zinc-800 text-white placeholder-zinc-500 focus-visible:ring-primary focus-visible:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300">Admin Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={signInData.password}
                onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                required
                className="bg-zinc-900/50 border-zinc-800 text-white placeholder-zinc-500 focus-visible:ring-primary focus-visible:border-primary"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2" size="lg">
                <KeyRound className="h-4 w-4" />
                {isSubmitting ? "Authenticating..." : "Authenticate Admin"}
              </Button>
            </div>
            
            <p className="text-[11px] text-zinc-500 text-center leading-relaxed">
              Note: Portal signups are currently locked. To register a new administrator profile, contact support or clear database logs.
            </p>
          </form>
        ) : (
          // Admin Sign Up Form (Only visible if no admin exists)
          <form onSubmit={handleSignUpSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-zinc-300">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Super Administrator"
                value={signUpData.fullName}
                onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                required
                className="bg-zinc-900/50 border-zinc-800 text-white placeholder-zinc-500 focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@medconnect.in"
                value={signUpData.email}
                onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                required
                className="bg-zinc-900/50 border-zinc-800 text-white placeholder-zinc-500 focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-zinc-300">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 88888 88888"
                value={signUpData.phone}
                onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                className="bg-zinc-900/50 border-zinc-800 text-white placeholder-zinc-500 focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={signUpData.password}
                onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                required
                className="bg-zinc-900/50 border-zinc-800 text-white placeholder-zinc-500 focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-zinc-300">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={signUpData.confirmPassword}
                onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                required
                className="bg-zinc-900/50 border-zinc-800 text-white placeholder-zinc-500 focus-visible:ring-primary"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" variant="accent" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2" size="lg">
                <UserPlus className="h-4 w-4" />
                {isSubmitting ? "Creating System Administrator..." : "Register Primary Admin"}
              </Button>
            </div>
            
            <p className="text-[11px] text-amber-500/80 text-center leading-relaxed font-medium">
              ⚠️ Warning: This is the initial system setup. Once you submit this form, admin registration will be locked permanently.
            </p>
          </form>
        )}
      </Card>
    </div>
  );
};

export default AdminAuth;
