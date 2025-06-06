import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-mentii-500/10 to-lavender-500/10 pt-16 pb-8 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="animate-fade-in">
            <Link to="/" className="inline-block mb-4">
              <h3 className="gradient-text font-bold text-2xl flex items-center">
                <span className="text-3xl mr-2">😊</span> Mentii
              </h3>
            </Link>
            <p className="text-muted-foreground mb-4">
              Helping you find joy and peace through interactive experiences.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-foreground/80 hover:text-mentii-500 transition-colors"
                aria-label="Twitter"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a
                href="#"
                className="text-foreground/80 hover:text-mentii-500 transition-colors"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="#"
                className="text-foreground/80 hover:text-mentii-500 transition-colors"
                aria-label="GitHub"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                  <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>
              </a>
            </div>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-mentii-500 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/activities"
                  className="text-muted-foreground hover:text-mentii-500 transition-colors"
                >
                  Activities
                </Link>
              </li>
              <li>
                <Link
                  to="/games"
                  className="text-muted-foreground hover:text-mentii-500 transition-colors"
                >
                  Games
                </Link>
              </li>
              <li>
                <Link
                  to="/chat"
                  className="text-muted-foreground hover:text-mentii-500 transition-colors"
                >
                  Chat
                </Link>
              </li>
            </ul>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h4 className="font-bold text-lg mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-mentii-500 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-mentii-500 transition-colors"
                >
                  Mental Health Resources
                </a>
              </li>
              <a
                href="#"
                className="text-muted-foreground hover:text-mentii-500 transition-colors"
              >
                Privacy Policy
              </a>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-mentii-500 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <h4 className="font-bold text-lg mb-4">Contact</h4>
            <p className="text-muted-foreground mb-4">
              Have questions or suggestions? We'd love to hear from you!
            </p>
            <a
              href="mailto:contact@mentii.com"
              className="inline-block text-mentii-500 hover:text-mentii-600 transition-colors"
            >
              contact@mentii.com
            </a>
          </div>
        </div>

        <div className="border-t border-border pt-8 relative">
          <div className="absolute bottom-0 left-4">
            <div className="relative group inline-block">
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-full blur opacity-25 group-hover:opacity-70 transition duration-300"></div>
              <div className="relative">
                {/* Treasure box container */}
                <span className="text-2xl cursor-pointer">🎁</span>
                {/* Name popup on hover */}
                <span className="absolute left-full ml-2 bottom-0 whitespace-nowrap opacity-0 scale-0 origin-left transform 
                  group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 
                  text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600 
                  font-medium px-2 py-1">
                  ✨✨
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-center text-muted-foreground">
            <p>&copy; {currentYear} Mentii. All rights reserved.</p>
            <p>Made with ❤️.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
