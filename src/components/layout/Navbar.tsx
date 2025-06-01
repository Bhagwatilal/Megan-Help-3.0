import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    // Check for user authentication status on component mount
    const user = localStorage.getItem('user');
    if (user) {
      setIsAuthenticated(true);
      setUser(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
  };

  const handleProtectedLink = (e: React.MouseEvent, path: string) => {
    if (!isAuthenticated) {
      e.preventDefault();
      toast.error("Authentication Required: Please log in or sign up to access this feature");
      navigate('/login');
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Activities", path: "/activities", protected: true },
    { name: "Games", path: "/games", protected: true },
    { name: "Chat", path: "/chat", protected: true },
    { name: "Music", path: "/music", protected: true },
    { name: "Journal", path: "/journal", protected: true },
    { name: "About", path: "/about" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-3 glass shadow-lg" : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link 
          to="/" 
          className="font-bold text-2xl md:text-3xl gradient-text flex items-center space-x-2 transition-transform duration-300 hover:scale-105"
        >
          <span className="text-3xl md:text-4xl">😊</span>
          <span>Mentii</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={(e) => link.protected && handleProtectedLink(e, link.path)}
              className={`relative px-1 py-2 text-foreground transition-all duration-300 hover:text-mentii-500 ${
                location.pathname === link.path ? "text-mentii-500 font-medium" : ""
              }`}
            >
              <span className="relative z-10">{link.name}</span>
              {location.pathname === link.path && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full bg-mentii-500 rounded-full transform animate-pulse-gentle"></span>
              )}
            </Link>
          ))}

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 text-foreground hover:text-mentii-500"
              >
                <User size={20} />
                <span>Profile</span>
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 glass shadow-lg rounded-lg py-2">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-foreground hover:bg-white/10"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-foreground hover:bg-white/10 flex items-center"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="relative px-1 py-2 text-foreground transition-all duration-300 hover:text-mentii-500"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground p-2 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass shadow-lg absolute top-full left-0 right-0 animate-slide-down">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => link.protected && handleProtectedLink(e, link.path)}
                className={`px-4 py-2 transition-colors duration-300 hover:bg-white/10 rounded-lg ${
                  location.pathname === link.path
                    ? "text-mentii-500 font-medium"
                    : "text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="px-4 py-2 transition-colors duration-300 hover:bg-white/10 rounded-lg text-foreground"
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 transition-colors duration-300 hover:bg-white/10 rounded-lg text-foreground text-left flex items-center"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 transition-colors duration-300 hover:bg-white/10 rounded-lg text-foreground"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
