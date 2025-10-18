import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Video, Shield, ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '../components/Navbar';

function AdminPanel() {
  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a new coding problem to the platform',
      icon: Plus,
      gradient: 'from-emerald-500 to-green-600',
      hoverGradient: 'hover:from-emerald-600 hover:to-green-700',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
      route: '/admin/create'
    },
    {
      id: 'update',
      title: 'Update Problem',
      description: 'Edit existing problems and their details',
      icon: Edit,
      gradient: 'from-blue-500 to-indigo-600',
      hoverGradient: 'hover:from-blue-600 hover:to-indigo-700',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
      route: '/admin/update'
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Remove problems from the platform',
      icon: Trash2,
      gradient: 'from-red-500 to-pink-600',
      hoverGradient: 'hover:from-red-600 hover:to-pink-700',
      iconBg: 'bg-red-500/20',
      iconColor: 'text-red-400',
      route: '/admin/delete'
    },
    {
      id: 'video',
      title: 'Manage Videos',
      description: 'Upload or delete solution videos for problems',
      icon: Video,
      gradient: 'from-purple-500 to-indigo-600',
      hoverGradient: 'hover:from-purple-600 hover:to-indigo-700',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-400',
      route: '/admin/video'
    }
  ];

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
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white">
                Admin Panel
              </h1>
            </div>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Manage coding problems, solutions, and content on your platform
            </p>
          </motion.div>

          {/* Admin Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-zinc-800/50 border-zinc-700/50 backdrop-blur-sm hover:bg-zinc-800/70 hover:border-zinc-600/50 transition-all duration-300 group h-full">
                    <CardContent className="p-6 flex flex-col h-full">
                      {/* Icon */}
                      <div className={`${option.iconBg} w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className={`w-8 h-8 ${option.iconColor}`} />
                      </div>

                      {/* Title */}
                      <h2 className="text-xl font-bold text-white mb-2">
                        {option.title}
                      </h2>

                      {/* Description */}
                      <p className="text-zinc-400 mb-6 flex-grow">
                        {option.description}
                      </p>

                      {/* Action Button */}
                      <NavLink to={option.route} className="mt-auto">
                        <Button
                          className={`w-full bg-gradient-to-r ${option.gradient} ${option.hoverGradient} text-white font-semibold shadow-lg transition-all duration-200 group/btn`}
                        >
                          <span>Get Started</span>
                          <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </NavLink>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}

export default AdminPanel;