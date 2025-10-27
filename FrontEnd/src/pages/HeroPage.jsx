import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  CheckCircle,
  TrendingUp,
  Code,
  Lightbulb,
  ArrowRight,
  Sparkles,
  Clock,
  Target,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router";
import Footer from "@/components/Footer";

const HeroPage = () => {
  const [currentCode, setCurrentCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();

  const languages = [
    { id: "cpp", name: "C++", color: "text-blue-400" },
    { id: "java", name: "Java", color: "text-red-400" },
    { id: "python", name: "Python", color: "text-yellow-400" },
    { id: "javascript", name: "JavaScript", color: "text-yellow-500" },
  ];

  const codeSteps = {
    cpp: [
      "vector<int> twoSum(vector<int>& nums, int target) {",
      "    // Brute force approach - O(n²)",
      "    for (int i = 0; i < nums.size(); i++) {",
      "        for (int j = i + 1; j < nums.size(); j++) {",
      "            if (nums[i] + nums[j] == target) {",
      "                return {i, j};",
      "            }",
      "        }",
      "    }",
      "    return {};",
      "}",
    ],
    java: [
      "public int[] twoSum(int[] nums, int target) {",
      "    // Brute force approach - O(n²)",
      "    for (int i = 0; i < nums.length; i++) {",
      "        for (int j = i + 1; j < nums.length; j++) {",
      "            if (nums[i] + nums[j] == target) {",
      "                return new int[]{i, j};",
      "            }",
      "        }",
      "    }",
      "    return new int[]{};",
      "}",
    ],
    python: [
      "def twoSum(nums, target):",
      "    # Brute force approach - O(n²)",
      "    for i in range(len(nums)):",
      "        for j in range(i + 1, len(nums)):",
      "            if nums[i] + nums[j] == target:",
      "                return [i, j]",
      "    return []",
    ],
    javascript: [
      "function twoSum(nums, target) {",
      "    // Brute force approach - O(n²)",
      "    for (let i = 0; i < nums.length; i++) {",
      "        for (let j = i + 1; j < nums.length; j++) {",
      "            if (nums[i] + nums[j] === target) {",
      "                return [i, j];",
      "            }",
      "        }",
      "    }",
      "    return [];",
      "}",
    ],
  };

  const aiSuggestions = [
    {
      type: "optimization",
      title: "Time Complexity Improvement",
      description: "Consider using a hash map for O(n) solution",
      impact: "Reduces time from O(n²) to O(n)",
    },
    {
      type: "alternative",
      title: "Alternative Approach",
      description: "Two-pointer technique after sorting",
      impact: "More space efficient but modifies input",
    },
    {
      type: "edge-case",
      title: "Edge Case Handling",
      description: "Add validation for empty arrays",
      impact: "Improves code robustness",
    },
  ];

  useEffect(() => {
    const steps = codeSteps[selectedLanguage];
    let currentText = "";
    let stepIndex = 0;
    let charIndex = 0;
    let timeoutId;

    setIsTyping(true);

    const typeCode = () => {
      if (stepIndex < steps.length) {
        if (charIndex < steps[stepIndex].length) {
          currentText += steps[stepIndex][charIndex];
          setCurrentCode(currentText);
          charIndex++;
          timeoutId = setTimeout(typeCode, 30);
        } else {
          currentText += "\n";
          setCurrentCode(currentText);
          stepIndex++;
          charIndex = 0;
          timeoutId = setTimeout(typeCode, 150);
        }
      } else {
        setIsTyping(false);
      }
    };

    const resetAndStart = () => {
      setCurrentCode("");
      timeoutId = setTimeout(typeCode, 500);
    };

    resetAndStart();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [selectedLanguage]);

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Navigation */}
      <nav className="border-b border-gray-800/50 backdrop-blur-sm bg-zinc-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-indigo-200 to-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <Code className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white whitespace-nowrap">
                Code
                <span className="bg-gradient-to-br from-indigo-100 to-blue-900 bg-clip-text text-transparent">
                  Loom
                </span>
              </span>
            </motion.div>

            <motion.div
              className="flex items-center gap-2 sm:gap-3 lg:gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Button
                variant="ghost"
                className="bg-indigo-600 text-white hover:bg-indigo-700 hover:text-white font-semibold text-xs sm:text-sm lg:text-base px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 h-auto"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
              <Button
                className="bg-emerald-500 text-white font-semibold hover:bg-emerald-600 text-xs sm:text-sm lg:text-base px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 h-auto"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </Button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 lg:space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 flex-shrink-0" />
                  <span className="text-indigo-400 font-semibold text-sm sm:text-base">
                    A New Way to Learn
                  </span>
                </motion.div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                  Master Coding with{" "}
                  <span className="bg-gradient-to-br from-indigo-200 to-blue-900 bg-clip-text text-transparent">
                    AI Guidance
                  </span>
                </h1>

                <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-300 leading-relaxed">
                  CodeLoom empowers you to master Data Structures and Algorithms
                  through real problem-solving, instant feedback, and AI mentorship.
                  Experience a modern DSA workspace with code execution, video
                  solutions, and adaptive explanations that accelerate your learning
                  journey.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-br from-indigo-300 to-blue-900 hover:bg-indigo-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base lg:text-lg group"
                  onClick={() => navigate("/signup")}
                >
                  Begin Your Journey
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                </Button>
              </div>
            </motion.div>

            {/* Right - Interactive Demo */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <Card className="bg-zinc-800 border-gray-700 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-0">
                  {/* VS Code Style Header */}
                  <div className="bg-zinc-800 border-b border-gray-700 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2 min-w-0">
                      <div className="flex space-x-1 sm:space-x-2 flex-shrink-0">
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                      </div>
                      <span className="text-zinc-300 text-xs sm:text-sm ml-2 sm:ml-4 truncate">
                        Two Sum Problem
                      </span>
                    </div>

                    {/* Language Selector */}
                    <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
                      {languages.map((lang) => (
                        <button
                          key={lang.id}
                          onClick={() => setSelectedLanguage(lang.id)}
                          disabled={isTyping}
                          className={`px-1.5 sm:px-2 lg:px-3 py-1 rounded text-[10px] sm:text-xs lg:text-sm transition-all font-medium whitespace-nowrap ${
                            selectedLanguage === lang.id
                              ? "bg-accent-foreground text-white"
                              : "bg-zinc-700 text-gray-300 hover:bg-zinc-900 disabled:opacity-50"
                          } ${isTyping ? "cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          {lang.id === "javascript" ? "JS" : lang.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Code Editor - Improved mobile height and scrolling */}
                  <div className="bg-zinc-900 p-3 sm:p-4 lg:p-6 h-56 sm:h-64 lg:h-72 overflow-auto">
                    <div className="font-mono text-[11px] sm:text-xs lg:text-sm text-gray-300 whitespace-pre-wrap leading-relaxed break-words">
                      {currentCode}
                      {isTyping && (
                        <motion.span
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                          className="bg-indigo-100 w-1.5 sm:w-2 h-4 sm:h-5 inline-block ml-1"
                        />
                      )}
                    </div>
                  </div>

                  {/* AI Suggestions Panel */}
                  <AnimatePresence>
                    {!isTyping && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="bg-zinc-800 border-t border-zinc-700 p-3 sm:p-4"
                      >
                        <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                          <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400 flex-shrink-0" />
                          <span className="text-xs sm:text-sm font-semibold text-indigo-300">
                            AI Insights
                          </span>
                        </div>

                        <div className="space-y-2">
                          {aiSuggestions.map((suggestion, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.7 + index * 0.1 }}
                              className="bg-zinc-700/50 rounded p-2.5 sm:p-3 text-xs sm:text-sm"
                            >
                              <div className="flex items-start sm:items-center justify-between gap-2 flex-col sm:flex-row">
                                <span className="text-white font-medium text-xs sm:text-sm">
                                  {suggestion.title}
                                </span>
                                <Badge
                                  variant="secondary"
                                  className="bg-indigo-500/20 text-indigo-200 text-[10px] sm:text-xs flex-shrink-0"
                                >
                                  {suggestion.type}
                                </Badge>
                              </div>
                              <p className="text-gray-300 mt-1 text-xs sm:text-sm leading-relaxed">
                                {suggestion.description}
                              </p>
                              <p className="text-green-400 text-[10px] sm:text-xs mt-1">
                                {suggestion.impact}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* Floating Elements - Improved mobile positioning */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 bg-indigo-500/80 rounded-full p-1.5 sm:p-2 shadow-lg"
              >
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: 1.5,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-2 sm:-bottom-3 -left-2 sm:-left-3 bg-blue-500/80 rounded-full p-1.5 sm:p-2 shadow-lg"
              >
                <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Subtle Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 sm:top-20 right-10 sm:right-20 w-24 sm:w-32 h-24 sm:h-32 bg-indigo-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 sm:bottom-20 left-10 sm:left-20 w-32 sm:w-40 h-32 sm:h-40 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 sm:py-16 lg:py-20 relative bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
              Why Choose{" "}
              <span className="bg-gradient-to-br from-indigo-200 to-blue-900 bg-clip-text text-transparent">
                CodeLoom
              </span>
              ?
            </h2>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Experience the future of coding practice with AI-powered insights and
              personalized learning paths.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="bg-zinc-800/70 border-gray-700 backdrop-blur-sm h-full hover:bg-zinc-900/90 transition-all duration-300">
                <CardContent className="p-5 sm:p-6 lg:p-8">
                  <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-200 to-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                      AI-Powered Guidance
                    </h3>
                  </div>
                  <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                    Get instant feedback on your solutions with intelligent suggestions
                    for optimization, alternative approaches, and complexity analysis.
                    Our AI understands your code and helps you think like a senior
                    developer.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-zinc-800/70 border-gray-700 backdrop-blur-sm h-full hover:bg-zinc-900/90 transition-all duration-300">
                <CardContent className="p-5 sm:p-6 lg:p-8">
                  <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-200 to-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Code className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                      Multi-Language Support
                    </h3>
                  </div>
                  <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                    Practice in Python, JavaScript, Java, and C++ with full syntax
                    highlighting, intelligent code completion, and language-specific
                    optimizations. Master multiple programming languages in one platform.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
	  <Footer />
    </div>
  );
};

export default HeroPage;
