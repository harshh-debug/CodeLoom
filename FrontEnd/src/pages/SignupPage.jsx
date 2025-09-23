import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../schemas/signupSchema";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router";
import { registerUser } from "../authSlice";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Code, UserPlus, Sparkles } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const SignupPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(signupSchema) });

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    const onSubmit = (data) => {
        dispatch(registerUser(data));
    };

    return (
        <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-indigo-400/10 via-blue-400/5 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-900/10 via-indigo-400/5 to-transparent rounded-full blur-3xl"></div>
                
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
            </div>

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-md"
            >
                <Card className="bg-zinc-800/50 border-zinc-700/50 backdrop-blur-xl shadow-2xl shadow-zinc-900/50">
                    <CardHeader className="text-center space-y-2">
                        {/* Logo */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="flex justify-center mb-4"
                        >
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-200 to-blue-900 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                    <Code className="w-6 h-6 text-white" />
                                </div>
                                <div className="absolute -inset-1 bg-gradient-to-br from-indigo-200 to-blue-900 rounded-xl blur opacity-30 -z-10"></div>
                            </div>
                        </motion.div>

                        <CardTitle className="text-2xl font-bold text-white">
                            Join{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-blue-400">
                                CodeLoom
                            </span>
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            Create your account and start your coding journey
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Error Message */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {/* Name Fields Row */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* First Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-zinc-300 font-medium">
                                        First Name
                                    </Label>
                                    <Input
                                        id="firstName"
                                        type="text"
                                        placeholder="John"
                                        className={`bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-indigo-400 focus:ring-indigo-400/20 transition-all duration-200 ${
                                            errors.firstName ? "border-red-500 focus:border-red-500" : ""
                                        }`}
                                        {...register("firstName")}
                                    />
                                    {errors.firstName && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="text-red-400 text-xs flex items-center gap-1"
                                        >
                                            {errors.firstName.message}
                                        </motion.span>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-zinc-300 font-medium">
                                        Last Name
                                    </Label>
                                    <Input
                                        id="lastName"
                                        type="text"
                                        placeholder="Doe"
                                        className={`bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-indigo-400 focus:ring-indigo-400/20 transition-all duration-200 ${
                                            errors.lastName ? "border-red-500 focus:border-red-500" : ""
                                        }`}
                                        {...register("lastName")}
                                    />
                                    {errors.lastName && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="text-red-400 text-xs flex items-center gap-1"
                                        >
                                            {errors.lastName.message}
                                        </motion.span>
                                    )}
                                </div>
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-zinc-300 font-medium">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john.doe@example.com"
                                    className={`bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-indigo-400 focus:ring-indigo-400/20 transition-all duration-200 ${
                                        errors.emailId ? "border-red-500 focus:border-red-500" : ""
                                    }`}
                                    {...register("emailId")}
                                />
                                {errors.emailId && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-red-400 text-sm flex items-center gap-1"
                                    >
                                        {errors.emailId.message}
                                    </motion.span>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-zinc-300 font-medium">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a strong password"
                                        className={`bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-indigo-400 focus:ring-indigo-400/20 transition-all duration-200 pr-10 ${
                                            errors.password ? "border-red-500 focus:border-red-500" : ""
                                        }`}
                                        {...register("password")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-red-400 text-sm flex items-center gap-1"
                                    >
                                        {errors.password.message}
                                    </motion.span>
                                )}
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold py-3 shadow-lg shadow-indigo-500/25 border-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Creating account...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <UserPlus className="w-4 h-4" />
                                        Create Account
                                    </div>
                                )}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="pt-0">
                        <div className="text-center text-sm text-zinc-400 w-full">
                            Already have an account?{" "}
                            <NavLink
                                to="/login"
                                className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline transition-colors"
                            >
                                Sign in here
                            </NavLink>
                        </div>
                    </CardFooter>
                </Card>

                {/* Decorative Elements */}
                <motion.div
                    animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute -top-8 -right-8 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-xl p-2 shadow-xl shadow-indigo-500/25 opacity-60"
                >
                    <UserPlus className="w-4 h-4 text-white" />
                </motion.div>

                <motion.div
                    animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: 1.5,
                        ease: "easeInOut",
                    }}
                    className="absolute -bottom-8 -left-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-2 shadow-xl shadow-blue-500/25 opacity-60"
                >
                    <Sparkles className="w-4 h-4 text-white" />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default SignupPage;