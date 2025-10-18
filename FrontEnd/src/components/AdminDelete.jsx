import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  AlertTriangle, 
  ArrowLeft, 
  Search,
  XCircle,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Navbar from '../components/Navbar';

const AdminDelete = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
    } catch (err) {
      setError('Failed to fetch problems');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosClient.delete(`/problem/delete/${id}`);
      setProblems(problems.filter(problem => problem._id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError('Failed to delete problem');
      console.error(err);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      case 'hard':
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
      default:
        return 'bg-zinc-500/20 text-zinc-400 border border-zinc-500/30';
    }
  };

  const filteredProblems = problems.filter(problem =>
    problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    problem.tags.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      <Navbar />

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-indigo-400/5 via-blue-400/3 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-900/5 via-indigo-400/3 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/admin')}
              className="mb-4 text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin Panel
            </Button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white">Delete Problems</h1>
            </div>
            <p className="text-zinc-400">Remove problems from the platform</p>
          </motion.div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Card className="bg-red-500/10 border-red-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <span className="text-red-400">{error}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <Card className="bg-zinc-800/50 border-zinc-700/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                  <Input
                    placeholder="Search problems by title or tag..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-indigo-400 focus:ring-indigo-400/20"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Problems List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            {filteredProblems.length === 0 ? (
              <Card className="bg-zinc-800/30 border-zinc-700/50">
                <CardContent className="p-12 text-center">
                  <AlertCircle className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No problems found</h3>
                  <p className="text-zinc-400">
                    {searchTerm ? 'Try adjusting your search terms' : 'No problems available to delete'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredProblems.map((problem, index) => (
                <motion.div
                  key={problem._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800/70 hover:border-zinc-600/50 transition-all duration-200 group">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          {/* Problem Number */}
                          <div className="text-zinc-500 font-mono text-sm w-8 flex-shrink-0">
                            #{index + 1}
                          </div>

                          {/* Title */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold truncate">
                              {problem.title}
                            </h3>
                          </div>

                          {/* Badges */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge className={getDifficultyColor(problem.difficulty)}>
                              {problem.difficulty}
                            </Badge>
                            <Badge variant="outline" className="border-zinc-600 text-zinc-300 hidden md:inline-flex">
                              {problem.tags}
                            </Badge>
                          </div>
                        </div>

                        {/* Delete Button */}
                        <Button
                          size="sm"
                          onClick={() => setDeleteConfirm(problem)}
                          className="bg-red-500 hover:bg-red-600 text-white flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Results Count */}
          {filteredProblems.length > 0 && (
            <div className="mt-6 text-center text-sm text-zinc-400">
              Showing {filteredProblems.length} of {problems.length} problems
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <Card className="bg-zinc-800 border-zinc-700">
                <CardContent className="p-6">
                  {/* Warning Icon */}
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-8 h-8 text-red-400" />
                    </div>
                  </div>

                  {/* Content */}
                  <h2 className="text-xl font-bold text-white text-center mb-2">
                    Delete Problem?
                  </h2>
                  <p className="text-zinc-400 text-center mb-2">
                    Are you sure you want to delete this problem?
                  </p>
                  <div className="bg-zinc-900/50 border border-zinc-700/50 rounded-lg p-3 mb-6">
                    <p className="text-white font-semibold text-center">
                      {deleteConfirm.title}
                    </p>
                  </div>
                  <p className="text-red-400 text-center text-sm mb-6">
                    This action cannot be undone. All submissions and related data will be permanently deleted.
                  </p>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setDeleteConfirm(null)}
                      className="flex-1 border-zinc-600 text-zinc-800 hover:bg-zinc-700 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleDelete(deleteConfirm._id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
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

export default AdminDelete;