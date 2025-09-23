import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router";
import { logoutUser } from "../authSlice";
import { motion } from "framer-motion";
import { Code, User, LogOut, Shield, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <nav className="sticky top-0 left-0 w-full z-50 backdrop-blur-xl bg-zinc-900/90 border-b border-zinc-800/50 shadow-xl shadow-zinc-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <NavLink
              to="/"
              className="flex items-center space-x-3 group"
            >
              <div className="relative">
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-200 to-blue-900 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-all duration-200">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-indigo-200 to-blue-900 rounded-xl blur opacity-30 -z-10 group-hover:opacity-40 transition-opacity"></div>
              </div>
              <span className="text-2xl font-bold text-white tracking-tight group-hover:text-indigo-400 transition-colors">
                Code<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-blue-400">Loom</span>
              </span>
            </NavLink>
          </motion.div>

          {/* Navigation Links */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden md:flex items-center space-x-8"
          >
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-indigo-400 ${
                  isActive ? 'text-indigo-400' : 'text-zinc-300'
                }`
              }
            >
              Problems
            </NavLink>
            <NavLink
              to="/leaderboard"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-indigo-400 ${
                  isActive ? 'text-indigo-400' : 'text-zinc-300'
                }`
              }
            >
              Leaderboard
            </NavLink>
            <NavLink
              to="/discuss"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-indigo-400 ${
                  isActive ? 'text-indigo-400' : 'text-zinc-300'
                }`
              }
            >
              Discuss
            </NavLink>
          </motion.div>

          {/* Right Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-white hover:bg-zinc-800 hover:text-indigo-400 transition-all duration-200 px-4 py-2 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user?.firstName?.charAt(0)?.toUpperCase()}
                    </div>
                    <span className="font-medium">{user?.firstName}</span>
                    <ChevronDown className="w-4 h-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end"
                  className="w-56 bg-zinc-800/95 text-white backdrop-blur-xl border border-zinc-700/50 shadow-xl shadow-zinc-900/50"
                >
                  <div className="px-3 py-2 text-sm">
                    <div className="font-medium">{user?.firstName} {user?.lastName}</div>
                    <div className="text-xs text-zinc-400 truncate">{user?.emailId}</div>
                  </div>
                  
                  <DropdownMenuSeparator className="bg-zinc-700/50" />
                  
                  <DropdownMenuItem className="hover:bg-zinc-700/50 focus:bg-zinc-700/50 cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>

                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <NavLink 
                        to="/admin"
                        className="flex items-center hover:bg-zinc-700/50 focus:bg-zinc-700/50 cursor-pointer"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Admin Panel
                      </NavLink>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator className="bg-zinc-700/50" />
                  
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="hover:bg-red-600/20 focus:bg-red-600/20 text-red-400 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <NavLink to="/login">
                  <Button
                    variant="ghost"
                    className="text-zinc-300 hover:text-white hover:bg-zinc-800 font-medium transition-all duration-200"
                  >
                    Sign In
                  </Button>
                </NavLink>
                <NavLink to="/signup">
                  <Button className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold shadow-lg shadow-indigo-500/25 border-0">
                    Get Started
                  </Button>
                </NavLink>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;