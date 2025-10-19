import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Calendar,
  Trophy,
  Target,
  CheckCircle,
  Clock,
  Edit,
  ChevronRight,
  Award,
  Zap,
  TrendingUp
} from 'lucide-react';
import { NavLink } from 'react-router';
import axiosClient from '../utils/axiosClient';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    total: 0,
    easy: 0,
    medium: 0,
    hard: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('');

  const avatarStyles = [
    'adventurer',
    'avataaars',
    'bottts',
    'pixel-art',
    'open-peeps',
    'lorelei',
    'micah',
    'miniavs'
  ];

  useEffect(() => {
    fetchUserStats();
    fetchRecentActivity();
  }, []);

  const fetchUserStats = async () => {
    try {
      // Fetch user's solved problems
      const { data } = await axiosClient.get('/problem/problemSolvedByUser');
      
      const easy = data.filter(p => p.difficulty === 'easy').length;
      const medium = data.filter(p => p.difficulty === 'medium').length;
      const hard = data.filter(p => p.difficulty === 'hard').length;

      setStats({
        total: data.length,
        easy,
        medium,
        hard
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      // Fetch recent submissions
      const { data } = await axiosClient.get('/problem/problemSolvedByUser');
      // Take last 5 solved problems
      setRecentActivity(data.slice(-5).reverse());
    } catch (error) {
      console.error('Error fetching activity:', error);
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

  const getProgressPercentage = (solved, total = 100) => {
    return Math.min((solved / total) * 100, 100);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const saveAvatar = async (avatarUrl) => {
    try {
      await axiosClient.patch('/user/avatar', { avatarUrl });
      setSelectedAvatar(avatarUrl);
      setShowAvatarModal(false);
    } catch (error) {
      console.error('Error saving avatar:', error);
    }
  };

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
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-xl shadow-indigo-500/25 overflow-hidden">
                  {selectedAvatar || user?.avatar ? (
                    <img 
                      src={selectedAvatar || user?.avatar || `https://api.dicebear.com/9.x/adventurer/svg?seed=${user?.firstName}`} 
                      alt={user?.firstName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-5xl font-bold text-white">
                      {user?.firstName?.charAt(0)?.toUpperCase()}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowAvatarModal(true)}
                  className="absolute -bottom-2 -right-2 p-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg shadow-lg transition-colors"
                >
                  <Edit className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-zinc-400 mb-4">@{user?.firstName?.toLowerCase()}</p>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-zinc-400" />
                    <span className="text-zinc-300">
                      Joined {formatDate(user?.createdAt || new Date())}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span className="text-zinc-300">Rank: #-</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-indigo-400" />
                    <span className="text-zinc-300">Streak: - days</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-zinc-800/50 border-zinc-700/50 backdrop-blur-sm hover:bg-zinc-800/70 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Target className="w-8 h-8 text-indigo-400" />
                    <Badge className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      Total
                    </Badge>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stats.total}</div>
                  <div className="text-sm text-zinc-400">Problems Solved</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-zinc-800/50 border-zinc-700/50 backdrop-blur-sm hover:bg-zinc-800/70 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                    <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                      Easy
                    </Badge>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stats.easy}</div>
                  <div className="w-full bg-zinc-700/50 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${getProgressPercentage(stats.easy)}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-zinc-800/50 border-zinc-700/50 backdrop-blur-sm hover:bg-zinc-800/70 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp className="w-8 h-8 text-yellow-400" />
                    <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                      Medium
                    </Badge>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stats.medium}</div>
                  <div className="w-full bg-zinc-700/50 rounded-full h-2 mt-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${getProgressPercentage(stats.medium)}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-zinc-800/50 border-zinc-700/50 backdrop-blur-sm hover:bg-zinc-800/70 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Award className="w-8 h-8 text-red-400" />
                    <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">
                      Hard
                    </Badge>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stats.hard}</div>
                  <div className="w-full bg-zinc-700/50 rounded-full h-2 mt-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${getProgressPercentage(stats.hard)}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-zinc-800/50 border-zinc-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-400" />
                    Recent Activity
                  </h2>
                  <NavLink to="/">
                    <Button variant="ghost" size="sm" className="text-indigo-400 hover:text-indigo-300 hover:bg-zinc-700/50">
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </NavLink>
                </div>

                {recentActivity.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
                    <p className="text-zinc-400">No problems solved yet. Start coding!</p>
                    <NavLink to="/">
                      <Button className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white">
                        Browse Problems
                      </Button>
                    </NavLink>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentActivity.map((problem, index) => (
                      <motion.div
                        key={problem._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <NavLink to={`/problem/${problem._id}`}>
                          <div className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-700/50 rounded-lg hover:bg-zinc-800/50 hover:border-zinc-600/50 transition-all group">
                            <div className="flex items-center gap-4 flex-1">
                              <CheckCircle className="w-5 h-5 text-emerald-400" />
                              <div className="flex-1">
                                <h3 className="text-white font-medium group-hover:text-indigo-400 transition-colors">
                                  {problem.title}
                                </h3>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className={getDifficultyColor(problem.difficulty)}>
                                {problem.difficulty}
                              </Badge>
                              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                            </div>
                          </div>
                        </NavLink>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Avatar Selection Modal */}
      <AnimatePresence>
        {showAvatarModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAvatarModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl"
            >
              <Card className="bg-zinc-800 border-zinc-700">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Choose Your Avatar</h2>
                  
                  <div className="grid grid-cols-4 gap-4">
                    {avatarStyles.map((style) => {
                      const avatarUrl = `https://api.dicebear.com/9.x/${style}/svg?seed=${user?.firstName}`;
                      return (
                        <button
                          key={style}
                          onClick={() => saveAvatar(avatarUrl)}
                          className="aspect-square rounded-xl overflow-hidden border-2 border-zinc-700 hover:border-indigo-500 transition-all hover:scale-105"
                        >
                          <img 
                            src={avatarUrl} 
                            alt={style}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowAvatarModal(false)}
                      className="border-zinc-600 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                    >
                      Cancel
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

export default ProfilePage;