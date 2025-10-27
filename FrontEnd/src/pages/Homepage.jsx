import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  CheckCircle,
  Search,
  Code,
  Clock,
  Trophy,
  Target,
  BookOpen,
  Zap,
} from "lucide-react";
import axiosClient from "../utils/axiosClient";
import Navbar from "../components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";

function Homepage() {
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tagSearch, setTagSearch] = useState("");
  const [filters, setFilters] = useState({
    difficulty: "all",
    tag: "all",
    status: "all",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problem/getAllProblem");
        setProblems(data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problem/problemSolvedByUser");
        setSolvedProblems(data);
      } catch (error) {
        console.error("Error fetching solved problems:", error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  // Get all unique tags for autocomplete dropdown
  const allTags = Array.from(
    new Set(problems.flatMap((problem) => Array.isArray(problem.tags) ? problem.tags : [problem.tags]))
  );

  const filteredProblems = problems.filter((problem) => {
    const difficultyMatch =
      filters.difficulty === "all" || problem.difficulty === filters.difficulty;

    const tagMatch =
      filters.tag === "all" ||
      (problem.tags &&
        Array.isArray(problem.tags) &&
        problem.tags.some(
          (t) => t.toLowerCase() === filters.tag.toLowerCase()
        ));

    const statusMatch =
      filters.status === "all" ||
      (filters.status === "solved"
        ? solvedProblems.some((sp) => sp._id === problem._id)
        : filters.status === "unsolved"
        ? !solvedProblems.some((sp) => sp._id === problem._id)
        : true);

    const searchMatch =
      searchTerm === "" ||
      problem.title.toLowerCase().includes(searchTerm.toLowerCase());

    return difficultyMatch && tagMatch && statusMatch && searchMatch;
  });

  const stats = {
    total: problems.length,
    solved: solvedProblems.length,
    easy: problems.filter((p) => p.difficulty === "easy").length,
    medium: problems.filter((p) => p.difficulty === "medium").length,
    hard: problems.filter((p) => p.difficulty === "hard").length,
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      <Navbar />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-indigo-400/5 via-blue-400/3 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-900/5 via-indigo-400/3 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
              Welcome back{user && `, ${user.firstName}`}! 👋
            </h1>
            <p className="text-zinc-400 text-lg">
              Continue your coding journey with CodeLoom
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <Card className="bg-zinc-800/50 border-zinc-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Problem Title Search */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                    <Input
                      placeholder="Search problems..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-indigo-400 focus:ring-indigo-400/20"
                    />
                  </div>

                  {/* Tag Search Autocomplete */}
                  <div className="relative flex-1">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Filter by tag..."
                      value={tagSearch}
                      onChange={(e) => setTagSearch(e.target.value)}
                      className="pl-10 bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-indigo-400 focus:ring-indigo-400/20"
                      autoComplete="off"
                    />
                    {tagSearch.length > 0 && (
                      <div className="absolute z-10 left-0 right-0 mt-2 py-2 bg-zinc-800 rounded shadow border border-zinc-700 max-h-40 overflow-y-auto">
                        {allTags
                          .filter((t) =>
                            t.toLowerCase().includes(tagSearch.toLowerCase())
                          )
                          .map((tag) => (
                            <div
                              key={tag}
                              className="px-4 py-1 cursor-pointer hover:bg-indigo-500/20 text-zinc-200"
                              onClick={() => {
                                setFilters({ ...filters, tag });
                                setTagSearch("");
                              }}
                            >
                              {tag}
                            </div>
                          ))}
                        {allTags.filter((t) =>
                          t.toLowerCase().includes(tagSearch.toLowerCase())
                        ).length === 0 && (
                          <div className="px-4 py-1 text-zinc-400">No tags found</div>
                        )}
                      </div>
                    )}
                    {/* Show active tag filter badge */}
                    {filters.tag !== "all" && (
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex gap-1">
                        <Badge
                          className="border-zinc-600 text-zinc-300 bg-zinc-700/40 cursor-pointer"
                          onClick={() => setFilters({ ...filters, tag: "all" })}
                        >
                          {filters.tag} &#x2715;
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Other Filters */}
                  <div className="flex flex-wrap gap-3">
                    <select
                      className="px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-md text-white text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400/20"
                      value={filters.status}
                      onChange={(e) =>
                        setFilters({ ...filters, status: e.target.value })
                      }
                    >
                      <option value="all">All Status</option>
                      <option value="solved">Solved</option>
                      <option value="unsolved">Unsolved</option>
                    </select>

                    <select
                      className="px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-md text-white text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400/20"
                      value={filters.difficulty}
                      onChange={(e) =>
                        setFilters({ ...filters, difficulty: e.target.value })
                      }
                    >
                      <option value="all">All Difficulties</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Problems List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin"></div>
              </div>
            ) : filteredProblems.length === 0 ? (
              <Card className="bg-zinc-800/50 border-zinc-700/50 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <Code className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    No problems found
                  </h3>
                  <p className="text-zinc-400">
                    Try adjusting your filters or search terms
                  </p>
                </CardContent>
              </Card>
            ) : (
              <AnimatePresence>
                {filteredProblems.map((problem, index) => {
                  const isSolved = solvedProblems.some(
                    (sp) => sp._id === problem._id
                  );

                  return (
                    <motion.div
                      key={problem._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="bg-zinc-800/50 border-zinc-700/50 backdrop-blur-sm hover:bg-zinc-800/70 hover:border-zinc-600/50 transition-all duration-200 group">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <NavLink
                                  to={`/problem/${problem._id}`}
                                  className="text-lg font-semibold text-white hover:text-indigo-400 transition-colors group-hover:text-indigo-400"
                                >
                                  {problem.title}
                                </NavLink>
                                {isSolved && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="flex items-center gap-1"
                                  >
                                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                                  </motion.div>
                                )}
                              </div>

                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge
                                  variant="secondary"
                                  className={`${getDifficultyBadgeColor(
                                    problem.difficulty
                                  )} border-0 text-white font-medium`}
                                >
                                  {problem.difficulty}
                                </Badge>
                                <div className="flex flex-wrap gap-2">
                                  {problem.tags.map((tag, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="outline"
                                      className="border-zinc-600 text-zinc-300"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {isSolved && (
                                <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Solved
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </motion.div>

          {!loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-center text-zinc-400"
            >
              Showing {filteredProblems.length} of {problems.length} problems
            </motion.div>
          )}
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

const getDifficultyBadgeColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "medium":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "hard":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
  }
};

export default Homepage;
