import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  HardDrive,
  Calendar,
  Code2,
  X,
  Loader2,
} from "lucide-react";
import axiosClient from "../utils/axiosClient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        console.log("Fetching submissions for problemId:", problemId);
        const response = await axiosClient.get(
          `/problem/submittedProblem/${problemId}`
        );
        console.log("Submissions response:", response.data);
        setSubmissions(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching submissions:", err);
        if (err.response?.status === 404) {
          setError("No submissions found for this problem");
        } else {
          setError("Failed to fetch submission history");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [problemId]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
      case "wrong":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      case "error":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      case "pending":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      default:
        return "bg-zinc-500/20 text-zinc-400 border border-zinc-500/30";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return <CheckCircle className="w-4 h-4" />;
      case "wrong":
        return <XCircle className="w-4 h-4" />;
      case "error":
        return <AlertCircle className="w-4 h-4" />;
      case "pending":
        return <Loader2 className="w-4 h-4 animate-spin" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatRuntime = (runtime) => {
    // Handle string or number input
    const num = typeof runtime === 'string' ? parseFloat(runtime) : runtime;
    
    // Round to max 3 decimal places to prevent overflow
    return num.toFixed(3);
  };

  const formatMemory = (memory) => {
    if (memory < 1024) return `${memory} KB`;
    return `${(memory / 1024).toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-500/10 border-red-500/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span className="text-red-400">{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.length === 0 ? (
        <Card className="bg-zinc-800/30 border-zinc-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 justify-center">
              <AlertCircle className="w-5 h-5 text-zinc-400" />
              <span className="text-zinc-400">No submissions found for this problem</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {submissions.map((sub, index) => (
              <motion.div
                key={sub._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800/70 hover:border-zinc-600/50 transition-all duration-200 group">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {/* Status Badge */}
                        <Badge className={`${getStatusColor(sub.status)} flex items-center gap-1 flex-shrink-0`}>
                          {getStatusIcon(sub.status)}
                          <span className="font-medium">
                            {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                          </span>
                        </Badge>

                        {/* Language */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Code2 className="w-4 h-4 text-zinc-400" />
                          <span className="text-white font-mono text-sm">{sub.language}</span>
                        </div>

                        {/* Stats */}
                        <div className="hidden md:flex items-center gap-4 text-sm flex-wrap">
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Clock className="w-4 h-4 text-zinc-400" />
                            <span className="text-zinc-300 font-mono">{formatRuntime(sub.runtime)}s</span>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <HardDrive className="w-4 h-4 text-zinc-400" />
                            <span className="text-zinc-300 font-mono">{formatMemory(sub.memory)}</span>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <span className="text-zinc-400">Tests:</span>
                            <span className="text-zinc-300 font-mono">
                              {sub.testCasesPassed}/{sub.testCasesTotal}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Date and Action */}
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="hidden lg:flex items-center gap-1 text-sm text-zinc-400">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(sub.createdAt)}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedSubmission(sub)}
                          className="border-zinc-600 bg-zinc-800 text-white hover:bg-zinc-700 hover:text-white hover:border-zinc-500"
                        >
                          View Code
                        </Button>
                      </div>
                    </div>

                    {/* Mobile Stats */}
                    <div className="md:hidden mt-3 flex items-center gap-4 text-sm flex-wrap">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-zinc-400" />
                        <span className="text-zinc-300 font-mono">{formatRuntime(sub.runtime)}s</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <HardDrive className="w-4 h-4 text-zinc-400" />
                        <span className="text-zinc-300 font-mono">{formatMemory(sub.memory)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-zinc-400">Tests:</span>
                        <span className="text-zinc-300 font-mono">
                          {sub.testCasesPassed}/{sub.testCasesTotal}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center text-sm text-zinc-400 pt-2">
            Showing {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
          </div>
        </>
      )}

      {/* Code View Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedSubmission(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              <Card className="bg-zinc-800 border-zinc-700">
                <CardContent className="p-0">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between p-6 border-b border-zinc-700">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Code2 className="w-5 h-5 text-indigo-400" />
                        Submission Details: {selectedSubmission.language}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getStatusColor(selectedSubmission.status)}>
                          {getStatusIcon(selectedSubmission.status)}
                          <span className="ml-1">{selectedSubmission.status}</span>
                        </Badge>
                        <Badge variant="outline" className="border-zinc-600 text-zinc-300 bg-zinc-900/50">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatRuntime(selectedSubmission.runtime)}s
                        </Badge>
                        <Badge variant="outline" className="border-zinc-600 text-zinc-300 bg-zinc-900/50">
                          <HardDrive className="w-3 h-3 mr-1" />
                          {formatMemory(selectedSubmission.memory)}
                        </Badge>
                        <Badge variant="outline" className="border-zinc-600 text-zinc-300 bg-zinc-900/50">
                          Tests: {selectedSubmission.testCasesPassed}/{selectedSubmission.testCasesTotal}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedSubmission(null)}
                      className="text-zinc-400 hover:text-white hover:bg-zinc-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Error Message */}
                  {selectedSubmission.errorMessage && (
                    <div className="mx-6 mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <div className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <span className="text-red-400 text-sm">{selectedSubmission.errorMessage}</span>
                      </div>
                    </div>
                  )}

                  {/* Code Display */}
                  <div className="p-6 max-h-[60vh] overflow-y-auto">
                    <div className="bg-zinc-900/50 rounded-lg border border-zinc-700/50 overflow-hidden">
                      <div className="bg-zinc-800/80 px-4 py-2 border-b border-zinc-700/50">
                        <span className="text-xs text-zinc-400 font-mono">Code</span>
                      </div>
                      <pre className="p-4 overflow-x-auto">
                        <code className="text-sm text-zinc-300 font-mono whitespace-pre">
                          {selectedSubmission.code}
                        </code>
                      </pre>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex justify-end gap-2 p-6 border-t border-zinc-700">
                    <Button
                      onClick={() => setSelectedSubmission(null)}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white"
                    >
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubmissionHistory;