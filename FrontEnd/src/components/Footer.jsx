import { NavLink } from "react-router";
import { useSelector } from "react-redux";
import { Code, Github, Linkedin, Mail, Heart } from "lucide-react";

const Footer = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <footer className="bg-zinc-900 border-t border-zinc-800/50 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative">
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-200 to-blue-900 rounded-xl flex items-center justify-center shadow-lg">
                  <Code className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                Code
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-blue-400">
                  Loom
                </span>
              </span>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
              Master data structures and algorithms through hands-on practice, real-time feedback,
              and AI-powered guidance. Your journey to programming excellence starts here.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {user ? (
                <>
                  <li>
                    <NavLink to="/" className="text-zinc-400 hover:text-indigo-400 transition text-sm">
                      Problems
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/learn-with-ai" className="text-zinc-400 hover:text-indigo-400 transition text-sm">
                      Learn with AI
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/profile" className="text-zinc-400 hover:text-indigo-400 transition text-sm">
                      Profile
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink to="/login" className="text-zinc-400 hover:text-indigo-400 transition text-sm">
                      Sign In
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/signup" className="text-zinc-400 hover:text-indigo-400 transition text-sm">
                      Get Started
                    </NavLink>
                  </li>
                  
                </>
              )}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://github.com/harshh-debug/CodeLoom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-indigo-400 transition text-sm"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="text-zinc-400 hover:text-indigo-400 transition text-sm">
                  Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-800/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-zinc-400 text-sm">
              <span>© {new Date().getFullYear()} CodeLoom. Built with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>by Harsh</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/harshh-debug"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-indigo-400 transition"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/harshcode09"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-indigo-400 transition"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:harshcode0907@gmail.com"
                className="text-zinc-400 hover:text-indigo-400 transition"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
