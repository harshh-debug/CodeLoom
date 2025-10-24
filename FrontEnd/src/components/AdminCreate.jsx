import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { 
  FileText, 
  TestTube, 
  Code2, 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '../components/Navbar';

// Zod schema matching the problem schema with 4 languages
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  // tags: z.enum(['array', 'linkedList', 'graph', 'dp','String']),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'Python', 'JavaScript']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(4, 'All four languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'Python', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(4, 'All four languages required')
});

function AdminCreate() {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      startCode: [
        { language: 'C++', initialCode: '' },
        { language: 'Java', initialCode: '' },
        { language: 'Python', initialCode: '' },
        { language: 'JavaScript', initialCode: '' }
      ],
      referenceSolution: [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'Python', completeCode: '' },
        { language: 'JavaScript', completeCode: '' }
      ]
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  const onSubmit = async (data) => {
    try {
      await axiosClient.post('/problem/create', data);
      alert('Problem created successfully!');
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const languages = ['C++', 'Java', 'Python', 'JavaScript'];

  return (
    <div className="min-h-screen bg-zinc-900">
      <Navbar />

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-indigo-400/5 via-blue-400/3 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-900/5 via-indigo-400/3 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 pt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white">Create New Problem</h1>
            </div>
            <p className="text-zinc-400">Add a new coding challenge to the platform</p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-zinc-800/50 border-zinc-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    Basic Information
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-zinc-300">Title</Label>
                      <Input
                        id="title"
                        {...register('title')}
                        className={`bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-indigo-400 focus:ring-indigo-400/20 ${
                          errors.title && 'border-red-500'
                        }`}
                        placeholder="Enter problem title"
                      />
                      {errors.title && (
                        <div className="flex items-center gap-1 text-red-400 text-sm">
                          <AlertCircle className="w-3 h-3" />
                          {errors.title.message}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-zinc-300">Description</Label>
                      <textarea
                        id="description"
                        {...register('description')}
                        rows={6}
                        className={`w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700 rounded-md text-white placeholder:text-zinc-500 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/20 focus:outline-none ${
                          errors.description && 'border-red-500'
                        }`}
                        placeholder="Describe the problem in detail..."
                      />
                      {errors.description && (
                        <div className="flex items-center gap-1 text-red-400 text-sm">
                          <AlertCircle className="w-3 h-3" />
                          {errors.description.message}
                        </div>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="difficulty" className="text-zinc-300">Difficulty</Label>
                        <select
                          id="difficulty"
                          {...register('difficulty')}
                          className={`w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700 rounded-md text-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/20 focus:outline-none ${
                            errors.difficulty && 'border-red-500'
                          }`}
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tags" className="text-zinc-300">Tag</Label>
                        <select
                          id="tags"
                          {...register('tags')}
                          className={`w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700 rounded-md text-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/20 focus:outline-none ${
                            errors.tags && 'border-red-500'
                          }`}
                        >
                          <option value="array">Array</option>
                          <option value="linkedList">Linked List</option>
                          <option value="graph">Graph</option>
                          <option value="dp">Dynamic Programming</option>
                          <option value="dp">String</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Test Cases */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-zinc-800/50 border-zinc-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <TestTube className="w-5 h-5 text-indigo-400" />
                    Test Cases
                  </h2>

                  {/* Visible Test Cases */}
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-white">Visible Test Cases</h3>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Visible Case
                      </Button>
                    </div>

                    {visibleFields.map((field, index) => (
                      <div key={field.id} className="bg-zinc-900/50 border border-zinc-700/50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="border-zinc-600 text-zinc-300">
                            Case {index + 1}
                          </Badge>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => removeVisible(index)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <Input
                          {...register(`visibleTestCases.${index}.input`)}
                          placeholder="Input"
                          className="bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-500"
                        />

                        <Input
                          {...register(`visibleTestCases.${index}.output`)}
                          placeholder="Output"
                          className="bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-500"
                        />

                        <textarea
                          {...register(`visibleTestCases.${index}.explanation`)}
                          placeholder="Explanation"
                          rows={2}
                          className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700 rounded-md text-white placeholder:text-zinc-500 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/20 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Hidden Test Cases */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-white">Hidden Test Cases</h3>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => appendHidden({ input: '', output: '' })}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Hidden Case
                      </Button>
                    </div>

                    {hiddenFields.map((field, index) => (
                      <div key={field.id} className="bg-zinc-900/50 border border-zinc-700/50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="border-zinc-600 text-zinc-300">
                            Case {index + 1}
                          </Badge>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => removeHidden(index)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <Input
                          {...register(`hiddenTestCases.${index}.input`)}
                          placeholder="Input"
                          className="bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-500"
                        />

                        <Input
                          {...register(`hiddenTestCases.${index}.output`)}
                          placeholder="Output"
                          className="bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-500"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Code Templates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-zinc-800/50 border-zinc-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-indigo-400" />
                    Code Templates
                  </h2>

                  <div className="space-y-8">
                    {languages.map((lang, index) => (
                      <div key={index} className="space-y-4">
                        <Badge className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                          {lang}
                        </Badge>

                        <div className="space-y-2">
                          <Label className="text-zinc-300">Initial Code</Label>
                          <div className="bg-zinc-900/50 border border-zinc-700/50 rounded-lg overflow-hidden">
                            <textarea
                              {...register(`startCode.${index}.initialCode`)}
                              rows={6}
                              className="w-full p-4 bg-transparent text-zinc-300 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400/20"
                              placeholder={`// Enter starter code for ${lang}...`}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-zinc-300">Reference Solution</Label>
                          <div className="bg-zinc-900/50 border border-zinc-700/50 rounded-lg overflow-hidden">
                            <textarea
                              {...register(`referenceSolution.${index}.completeCode`)}
                              rows={6}
                              className="w-full p-4 bg-transparent text-zinc-300 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400/20"
                              placeholder={`// Enter complete solution for ${lang}...`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-6 text-lg shadow-lg shadow-emerald-500/25"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Problem...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-5 h-5" />
                    Create Problem
                  </div>
                )}
              </Button>
            </motion.div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminCreate;