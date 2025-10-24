import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { NavLink } from "react-router";
import { Loader2, Video, Trash2, UploadCloud, AlertTriangle } from "lucide-react";

const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "bg-green-500/10 text-green-400 border border-green-600/20";
    case "medium":
      return "bg-yellow-500/10 text-yellow-400 border border-yellow-600/20";
    case "hard":
      return "bg-red-500/10 text-red-400 border border-red-600/20";
    default:
      return "bg-zinc-500/10 text-zinc-300 border border-zinc-500/20";
  }
};

const AdminVideo = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProblems();
    // eslint-disable-next-line
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get("/problem/getAllProblem");
      setProblems(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch problems");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
      await axiosClient.delete(`/video/delete/${id}`);
      setProblems((prev) => prev.filter((problem) => problem._id !== id));
    } catch (err) {
      setError("Failed to delete video");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 py-10 px-2">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Video className="w-10 h-10 text-indigo-400" />
          <h1 className="text-3xl font-bold text-white">Video Upload & Delete</h1>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 mr-3 text-indigo-400 animate-spin" />
            <span className="text-zinc-300">Loading problems...</span>
          </div>
        ) : error ? (
          <div className="flex items-center bg-red-900/60 border border-red-700 p-4 rounded-lg mb-6 gap-2 text-red-200">
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 overflow-x-auto backdrop-blur-sm shadow-lg">
            <table className="min-w-full divide-y divide-zinc-700">
              <thead className="bg-zinc-900/60">
                <tr>
                  <th className="p-3 text-left text-zinc-300 text-sm font-semibold">#</th>
                  <th className="p-3 text-left text-zinc-300 text-sm font-semibold">Title</th>
                  <th className="p-3 text-left text-zinc-300 text-sm font-semibold">Difficulty</th>
                  <th className="p-3 text-left text-zinc-300 text-sm font-semibold">Tags</th>
                  <th className="p-3 text-left text-zinc-300 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {problems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-zinc-400">
                      No problems found.
                    </td>
                  </tr>
                ) : (
                  problems.map((problem, index) => (
                    <tr
                      key={problem._id}
                      className="hover:bg-zinc-700/40 transition"
                    >
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3 text-white font-medium">{problem.title}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded ${getDifficultyColor(problem.difficulty)} text-xs font-medium`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-2">
                          {(Array.isArray(problem.tags) ? problem.tags : [problem.tags]).map((tag, idx) => (
                            <span key={idx} className="bg-zinc-700/50 text-zinc-200 border border-zinc-600 px-2 py-0.5 rounded text-xs font-mono">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <NavLink
                            to={`/admin/upload/${problem._id}`}
                            className="btn btn-sm bg-blue-700/90 hover:bg-blue-800 text-white px-3 flex items-center gap-1 rounded transition"
                          >
                            <UploadCloud className="w-4 h-4" />
                            Upload
                          </NavLink>
                          <button
                            onClick={() => handleDelete(problem._id)}
                            className="btn btn-sm bg-red-700/90 hover:bg-red-800 text-white px-3 flex items-center gap-1 rounded transition"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVideo;
