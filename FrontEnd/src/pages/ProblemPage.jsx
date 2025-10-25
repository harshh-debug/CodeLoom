import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Editor from "@monaco-editor/react";
import { useParams, useNavigate, NavLink } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
	Play,
	Send,
	Code2,
	FileText,
	BookOpen,
	MessageSquare,
	History,
	TestTube,
	CheckCircle,
	XCircle,
	Clock,
	Zap,
	Target,
	Lightbulb,
	HardDrive,
	ChevronLeft,
	ChevronRight,
	Code,
	User,
	LogOut,
	Shield,
	ChevronDown,
} from "lucide-react";
import axiosClient from "../utils/axiosClient";
import SubmissionHistory from "../components/SubmissionHistory";
import ChatAi from "../components/Aichat";
import Editorial from "../components/Editorial";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { logoutUser } from "../authSlice";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const langMap = {
	cpp: "c++",
	java: "java",
	javascript: "javascript",
	python: "python",
};

const ProblemPage = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);
	const [problem, setProblem] = useState(null);
	const [allProblems, setAllProblems] = useState([]);
	const [selectedLanguage, setSelectedLanguage] = useState("cpp");
	const [code, setCode] = useState("");
	const [loading, setLoading] = useState(false);
	const [runResult, setRunResult] = useState(null);
	const [submitResult, setSubmitResult] = useState(null);
	const [activeLeftTab, setActiveLeftTab] = useState("description");
	const [activeRightTab, setActiveRightTab] = useState("code");
	const editorRef = useRef(null);
	let { problemId } = useParams();

	const { handleSubmit } = useForm();

	useEffect(() => {
		const fetchAllProblems = async () => {
			try {
				const { data } = await axiosClient.get("/problem/getAllProblem");
				setAllProblems(data);
			} catch (error) {
				console.error("Error fetching all problems:", error);
			}
		};
		fetchAllProblems();
	}, []);

	useEffect(() => {
		const fetchProblem = async () => {
			setLoading(true);
			try {
				const response = await axiosClient.get(
					`/problem/getProblemById/${problemId}`
				);

				const matchingStartCode = response.data.startCode.find(
					(sc) => sc.language === langMap[selectedLanguage]
				);

				if (!matchingStartCode) {
					const fallbackCode =
						response.data.startCode[0]?.boilerplate || "// Default code";
					setCode(fallbackCode);
				} else {
					setCode(matchingStartCode.boilerplate);
				}

				setProblem(response.data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching problem:", error);
				setLoading(false);
			}
		};

		fetchProblem();
	}, [problemId]);

	useEffect(() => {
		if (problem) {
			const matchingStartCode = problem.startCode.find(
				(sc) => sc.language === langMap[selectedLanguage]
			);

			if (!matchingStartCode) {
				const fallbackCode =
					problem.startCode[0]?.boilerplate || "// Default code";
				setCode(fallbackCode);
			} else {
				setCode(matchingStartCode.boilerplate);
			}
		}
	}, [selectedLanguage, problem]);

	const handleEditorChange = (value) => {
		setCode(value || "");
	};

	const handleEditorDidMount = (editor) => {
		editorRef.current = editor;
	};

	const handleLanguageChange = (language) => {
		setSelectedLanguage(language);
	};

	const handleRun = async () => {
		setLoading(true);
		setRunResult(null);

		try {
			const response = await axiosClient.post(`/submission/run/${problemId}`, {
				code,
				language: langMap[selectedLanguage],
			});

			setRunResult(response.data);
			setLoading(false);
			setActiveRightTab("testcase");
		} catch (error) {
			console.error("Error running code:", error);
			setRunResult({
				success: false,
				error: error.response?.data || "Internal server error",
				testCases: [],
			});
			setLoading(false);
			setActiveRightTab("testcase");
		}
	};

	const handleSubmitCode = async () => {
		setLoading(true);
		setSubmitResult(null);

		try {
			const response = await axiosClient.post(
				`/submission/submit/${problemId}`,
				{
					code: code,
					language: langMap[selectedLanguage],
				}
			);

			setSubmitResult(response.data);
			setLoading(false);
			setActiveRightTab("result");
		} catch (error) {
			console.error("Error submitting code:", error);
			setSubmitResult(null);
			setLoading(false);
			setActiveRightTab("result");
		}
	};

	const getLanguageForMonaco = (lang) => {
		switch (lang) {
			case "javascript":
				return "javascript";
			case "java":
				return "java";
			case "cpp":
				return "cpp";
			case "python":
				return "python";
			default:
				return "javascript";
		}
	};

	const getDifficultyColor = (difficulty) => {
		switch (difficulty?.toLowerCase()) {
			case "easy":
				return "bg-green-500/20 text-green-400 border border-green-500/30";
			case "medium":
				return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
			case "hard":
				return "bg-red-500/20 text-red-400 border border-red-500/30";
			default:
				return "bg-zinc-500/20 text-zinc-400 border border-zinc-500/30";
		}
	};

	const handleLogout = () => {
		dispatch(logoutUser());
		navigate("/login");
	};

	const navigateToProblem = (direction) => {
		const currentIndex = allProblems.findIndex((p) => p._id === problemId);
		if (currentIndex === -1) return;

		let nextIndex;
		if (direction === "prev") {
			nextIndex = currentIndex > 0 ? currentIndex - 1 : allProblems.length - 1;
		} else {
			nextIndex = currentIndex < allProblems.length - 1 ? currentIndex + 1 : 0;
		}

		navigate(`/problem/${allProblems[nextIndex]._id}`);
	};

	if (loading && !problem) {
		return (
			<div className="min-h-screen bg-zinc-900 flex justify-center items-center">
				<div className="w-8 h-8 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin"></div>
			</div>
		);
	}

	return (
		<div className="h-screen bg-zinc-900 flex flex-col overflow-hidden">
			{/* Background Elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-indigo-400/3 via-blue-400/2 to-transparent rounded-full blur-3xl"></div>
				<div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-900/3 via-indigo-400/2 to-transparent rounded-full blur-3xl"></div>
			</div>

			{/* Top Navbar */}
			<nav className="relative z-50 bg-zinc-800/50 border-b border-zinc-700/50 backdrop-blur-xl flex-shrink-0">
				<div className="px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-14">
						{/* Left: Logo and Navigation */}
						<div className="flex items-center space-x-4">
							<NavLink to="/" className="flex items-center space-x-3 group">
								<div className="relative">
									<div className="w-8 h-8 bg-gradient-to-br from-indigo-200 to-blue-900 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-all duration-200">
										<Code className="w-4 h-4 text-white" />
									</div>
									<div className="absolute -inset-1 bg-gradient-to-br from-indigo-200 to-blue-900 rounded-lg blur opacity-30 -z-10 group-hover:opacity-40 transition-opacity"></div>
								</div>
								<span className="text-lg font-bold text-white tracking-tight group-hover:text-indigo-400 transition-colors">
									Code
									<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-blue-400">
										Loom
									</span>
								</span>
							</NavLink>

							{/* Prev/Next Arrows */}
							<div className="flex items-center gap-1 ml-4">
								<button
									onClick={() => navigateToProblem("prev")}
									className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-700/50 transition-colors"
									title="Previous Problem"
								>
									<ChevronLeft className="w-5 h-5" />
								</button>
								<button
									onClick={() => navigateToProblem("next")}
									className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-700/50 transition-colors"
									title="Next Problem"
								>
									<ChevronRight className="w-5 h-5" />
								</button>
							</div>
						</div>

						{/* Right: User Profile */}
						<div className="flex items-center">
							{user && (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											className="flex items-center gap-2 text-white hover:bg-zinc-700/50 hover:text-indigo-400 transition-all duration-200 px-3 py-2 rounded-lg"
										>
											<div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
												{user?.firstName?.charAt(0)?.toUpperCase()}
											</div>
											<span className="font-medium text-sm hidden md:inline">
												{user?.firstName}
											</span>
											<ChevronDown className="w-4 h-4 opacity-50" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="end"
										className="w-56 bg-zinc-800/95 text-white backdrop-blur-xl border border-zinc-700/50 shadow-xl shadow-zinc-900/50"
									>
										<div className="px-3 py-2 text-sm">
											<div className="font-medium">
												{user?.firstName} {user?.lastName}
											</div>
											<div className="text-xs text-zinc-400 truncate">
												{user?.emailId}
											</div>
										</div>

										<DropdownMenuSeparator className="bg-zinc-700/50" />

										{/* Profile */}
										<DropdownMenuItem
											asChild
											className="data-[highlighted]:bg-zinc-700/70 data-[highlighted]:text-white focus:bg-zinc-700/70 focus:text-white transition-colors"
										>
											<NavLink
												to="/profile"
												className="flex items-center text-zinc-300 gap-2 cursor-pointer"
											>
												<User className="w-4 h-4" />
												Profile
											</NavLink>
										</DropdownMenuItem>

										{/* Admin Panel */}
										{user.role === "admin" && (
											<DropdownMenuItem
												asChild
												className="data-[highlighted]:bg-zinc-700/70 data-[highlighted]:text-white focus:bg-zinc-700/70 focus:text-white transition-colors"
											>
												<NavLink
													to="/admin"
													className="flex items-center text-zinc-300 gap-2 cursor-pointer"
												>
													<Shield className="w-4 h-4" />
													Admin Panel
												</NavLink>
											</DropdownMenuItem>
										)}

										<DropdownMenuSeparator className="bg-zinc-700/50" />

										{/* Logout */}
										<DropdownMenuItem
											onClick={handleLogout}
											className="text-red-400 data-[highlighted]:bg-red-600/20 data-[highlighted]:text-red-300 focus:bg-red-600/20 focus:text-red-300 cursor-pointer transition-colors"
										>
											<LogOut className="w-4 h-4 mr-2" />
											Logout
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							)}
						</div>
					</div>
				</div>
			</nav>

			{/* Main Content Area */}
			<div className="flex-1 flex overflow-hidden relative z-10">
				{/* Left Panel - Problem Description */}
				<div className="w-1/2 flex flex-col border-r border-zinc-700/50 bg-zinc-900">
					{/* Internal Tab Navigation */}
					<div className="bg-zinc-800/30 border-b border-zinc-700/50 flex-shrink-0">
						<div className="flex">
							{[
								{ id: "description", label: "Description", icon: FileText },
								{ id: "editorial", label: "Editorial", icon: Lightbulb },
								{ id: "solutions", label: "Solutions", icon: Code2 },
								{ id: "submissions", label: "Submissions", icon: History },
								{ id: "chatAI", label: "AI Chat", icon: MessageSquare },
							].map(({ id, label, icon: Icon }) => (
								<button
									key={id}
									onClick={() => setActiveLeftTab(id)}
									className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
										activeLeftTab === id
											? "text-indigo-400 border-indigo-400 bg-indigo-500/10"
											: "text-zinc-400 border-transparent hover:text-white hover:bg-zinc-700/50"
									}`}
								>
									<Icon className="w-4 h-4" />
									<span className="hidden md:inline">{label}</span>
								</button>
							))}
						</div>
					</div>

					{/* Content */}
					<div className="flex-1 overflow-y-auto bg-zinc-900">
						{problem && (
							<>
								{activeLeftTab === "description" && (
									<div className="p-6 space-y-6">
										<motion.div
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											className="space-y-6"
										>
											<div className="flex items-center gap-4 mb-6">
												<h1 className="text-2xl font-bold text-white">
													{problem.title}
												</h1>
												<Badge
													className={getDifficultyColor(problem.difficulty)}
												>
													{problem.difficulty.charAt(0).toUpperCase() +
														problem.difficulty.slice(1)}
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

											<div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6 backdrop-blur-sm">
												<div className="prose prose-invert max-w-none">
													<div className="whitespace-pre-wrap text-zinc-300 leading-relaxed">
														<ReactMarkdown>{problem.description}</ReactMarkdown>
													</div>
												</div>
											</div>

											<div>
												<h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
													<Target className="w-5 h-5 text-indigo-400" />
													Examples
												</h3>
												<div className="space-y-4">
													{problem.visibleTestCases.map((example, index) => (
														<div
															key={index}
															className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4 backdrop-blur-sm"
														>
															<h4 className="font-semibold text-white mb-3">
																Example {index + 1}:
															</h4>
															<div className="space-y-2 text-sm font-mono">
																<div className="bg-zinc-900/50 p-3 rounded">
																	<span className="text-indigo-400 font-semibold">
																		Input:
																	</span>
																	<div className="text-zinc-300 ml-2">
																		
																		<pre>{example.input}</pre>
																		
																		
																	</div>
																</div>
																<div className="bg-zinc-900/50 p-3 rounded">
																	<span className="text-emerald-400 font-semibold">
																		Output:
																	</span>
																	<span className="text-zinc-300 ml-2">
																		{example.output}
																	</span>
																</div>
																<div className="bg-zinc-900/50 p-3 rounded">
																	<span className="text-yellow-400 font-semibold">
																		Explanation:
																	</span>
																	<span className="text-zinc-300 ml-2">
																		{example.explanation}
																	</span>
																</div>
															</div>
														</div>
													))}
												</div>
											</div>
										</motion.div>
									</div>
								)}

								{activeLeftTab === "editorial" && (
									<div className="p-6 space-y-4">
										<h2 className="text-xl font-bold text-white flex items-center gap-2">
											<Lightbulb className="w-5 h-5 text-indigo-400" />
											Editorial
										</h2>
										<div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6 backdrop-blur-sm">
											<Editorial
												secureUrl={problem.secureUrl}
												thumbnailUrl={problem.thumbnailUrl}
												duration={problem.duration}
											/>
										</div>
									</div>
								)}

								{activeLeftTab === "solutions" && (
									<div className="p-6 space-y-6">
										<h2 className="text-xl font-bold text-white flex items-center gap-2">
											<Code2 className="w-5 h-5 text-indigo-400" />
											Solutions
										</h2>
										{problem.refrenceSolution?.map((solution, index) => (
											<div
												key={index}
												className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg backdrop-blur-sm overflow-hidden"
											>
												<div className="bg-zinc-700/30 px-4 py-3 border-b border-zinc-600/50">
													<h3 className="font-semibold text-white">
														{problem?.title} - {solution?.language}
													</h3>
												</div>
												<div className="p-4">
													<pre className="bg-zinc-900/50 p-4 rounded text-sm overflow-x-auto text-zinc-300">
														<code>{solution?.completeCode}</code>
													</pre>
												</div>
											</div>
										)) || (
											<div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6 backdrop-blur-sm text-center">
												<p className="text-zinc-400">
													Solutions will be available after you solve the
													problem.
												</p>
											</div>
										)}
									</div>
								)}

								{activeLeftTab === "submissions" && (
									<div className="p-6 space-y-4">
										<h2 className="text-xl font-bold text-white flex items-center gap-2">
											<History className="w-5 h-5 text-indigo-400" />
											My Submissions
										</h2>
										<SubmissionHistory problemId={problemId} />
									</div>
								)}

								{activeLeftTab === "chatAI" && (
									<div className="p-6 space-y-4">
										<h2 className="text-xl font-bold text-white flex items-center gap-2">
											<MessageSquare className="w-5 h-5 text-indigo-400" />
											AI Assistant
										</h2>
										<div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6 backdrop-blur-sm">
											<ChatAi problem={problem} />
										</div>
									</div>
								)}
							</>
						)}
					</div>
				</div>

				{/* Right Panel - Code Editor */}
				<div className="w-1/2 flex flex-col bg-zinc-900">
					{/* Internal Tab Navigation */}
					<div className="bg-zinc-800/30 border-b border-zinc-700/50 flex-shrink-0">
						<div className="flex">
							{[
								{ id: "code", label: "Code", icon: Code2 },
								{ id: "testcase", label: "Test Cases", icon: TestTube },
								{ id: "result", label: "Results", icon: CheckCircle },
							].map(({ id, label, icon: Icon }) => (
								<button
									key={id}
									onClick={() => setActiveRightTab(id)}
									className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
										activeRightTab === id
											? "text-indigo-400 border-indigo-400 bg-indigo-500/10"
											: "text-zinc-400 border-transparent hover:text-white hover:bg-zinc-700/50"
									}`}
								>
									<Icon className="w-4 h-4" />
									{label}
								</button>
							))}
						</div>
					</div>

					{/* Content */}
					<div className="flex-1 flex flex-col overflow-hidden bg-zinc-900">
						{activeRightTab === "code" && (
							<div className="flex-1 flex flex-col">
								{/* Language Selector */}
								<div className="flex justify-between items-center p-4 border-b border-zinc-700/50 bg-zinc-800/30 flex-shrink-0">
									<div className="flex gap-2">
										{["cpp", "java", "python", "javascript"].map((lang) => (
											<button
												key={lang}
												onClick={() => handleLanguageChange(lang)}
												className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
													selectedLanguage === lang
														? "bg-indigo-500 text-white"
														: "bg-zinc-700 text-zinc-300 hover:bg-zinc-600 hover:text-white"
												}`}
											>
												{lang === "cpp"
													? "C++"
													: lang === "javascript"
													? "JavaScript"
													: lang === "java"
													? "Java"
													: "Python"}
											</button>
										))}
									</div>
								</div>

								{/* Monaco Editor */}
								<div className="flex-1 min-h-0">
									<Editor
										height="100%"
										language={getLanguageForMonaco(selectedLanguage)}
										value={code}
										onChange={handleEditorChange}
										onMount={handleEditorDidMount}
										theme="vs-dark"
										options={{
											fontSize: 14,
											minimap: { enabled: false },
											scrollBeyondLastLine: false,
											automaticLayout: true,
											tabSize: 2,
											insertSpaces: true,
											wordWrap: "on",
											lineNumbers: "on",
											glyphMargin: false,
											folding: true,
											lineDecorationsWidth: 10,
											lineNumbersMinChars: 3,
											renderLineHighlight: "line",
											selectOnLineNumbers: true,
											roundedSelection: false,
											readOnly: false,
											cursorStyle: "line",
											mouseWheelZoom: true,
										}}
									/>
								</div>

								{/* Action Buttons */}
								<div className="p-4 border-t border-zinc-700/50 bg-zinc-800/30 flex justify-between items-center flex-shrink-0">
									<div className="flex gap-2">
										<button
											onClick={() => setActiveRightTab("testcase")}
											className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors"
										>
											Console
										</button>
									</div>
									<div className="flex gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={handleRun}
											disabled={loading}
											className="border-zinc-600 text-zinc-800 hover:bg-zinc-700 hover:text-white disabled:opacity-50"
										>
											{loading ? (
												<div className="w-4 h-4 border-2 border-zinc-400/30 border-t-zinc-400 rounded-full animate-spin mr-2" />
											) : (
												<Play className="w-4 h-4 mr-2" />
											)}
											Run
										</Button>
										<Button
											size="sm"
											onClick={handleSubmitCode}
											disabled={loading}
											className="bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-50"
										>
											{loading ? (
												<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
											) : (
												<Send className="w-4 h-4 mr-2" />
											)}
											Submit
										</Button>
									</div>
								</div>
							</div>
						)}

						{activeRightTab === "testcase" && (
							<div className="flex-1 p-4 overflow-y-auto">
								<div className="space-y-4">
									<h3 className="font-semibold text-white flex items-center gap-2">
										<TestTube className="w-5 h-5 text-indigo-400" />
										Test Results
									</h3>
									{runResult ? (
										<div
											className={`border-2 rounded-lg p-6 ${
												runResult.success
													? "border-emerald-500/50 bg-emerald-500/10"
													: "border-red-500/50 bg-red-500/10"
											}`}
										>
											{runResult.success ? (
												<div className="space-y-4">
													<div className="flex items-center gap-2">
														<CheckCircle className="w-5 h-5 text-emerald-400" />
														<h4 className="font-bold text-emerald-400">
															All test cases passed!
														</h4>
													</div>
													<div className="flex gap-4 text-sm">
														<div className="flex items-center gap-1">
															<Clock className="w-4 h-4 text-zinc-400" />
															<span className="text-zinc-300">
																Runtime: {runResult.runtime} sec
															</span>
														</div>
														<div className="flex items-center gap-1">
															<HardDrive className="w-4 h-4 text-zinc-400" />
															<span className="text-zinc-300">
																Memory: {runResult.memory} KB
															</span>
														</div>
													</div>
													<div className="space-y-2">
														{runResult.testCases?.map((tc, i) => (
															<div
																key={i}
																className="bg-zinc-800/50 border border-zinc-700/50 rounded p-3 text-sm font-mono space-y-1"
															>
																<div>
																	<span className="text-indigo-400">
																		Input:
																	</span>{" "}
																	<span className="text-zinc-300">
																		{tc.stdin}
																	</span>
																</div>
																<div>
																	<span className="text-emerald-400">
																		Expected:
																	</span>{" "}
																	<span className="text-zinc-300">
																		{tc.expected_output}
																	</span>
																</div>
																<div>
																	<span className="text-blue-400">Output:</span>{" "}
																	<span className="text-zinc-300">
																		{tc.stdout}
																	</span>
																</div>
																<div className="text-emerald-400 flex items-center gap-1">
																	<CheckCircle className="w-3 h-3" />
																	Passed
																</div>
															</div>
														))}
													</div>
												</div>
											) : (
												<div className="space-y-4">
													<div className="flex items-center gap-2">
														<XCircle className="w-5 h-5 text-red-400" />
														<h4 className="font-bold text-red-400">
															Test Failed
														</h4>
													</div>
													<div className="space-y-2">
														{runResult.testCases?.map((tc, i) => (
															<div
																key={i}
																className="bg-zinc-800/50 border border-zinc-700/50 rounded p-3 text-sm font-mono space-y-1"
															>
																<div>
																	<span className="text-indigo-400">
																		Input:
																	</span>{" "}
																	<span className="text-zinc-300">
																		{tc.stdin}
																	</span>
																</div>
																<div>
																	<span className="text-emerald-400">
																		Expected:
																	</span>{" "}
																	<span className="text-zinc-300">
																		{tc.expected_output}
																	</span>
																</div>
																<div>
																	<span className="text-blue-400">Output:</span>{" "}
																	<span className="text-zinc-300">
																		{tc.stdout}
																	</span>
																</div>
																<div
																	className={
																		tc.status_id === 3
																			? "text-emerald-400"
																			: "text-red-400"
																	}
																>
																	{tc.status_id === 3 ? (
																		<div className="flex items-center gap-1">
																			<CheckCircle className="w-3 h-3" />
																			Passed
																		</div>
																	) : (
																		<div className="flex items-center gap-1">
																			<XCircle className="w-3 h-3" />
																			Failed
																		</div>
																	)}
																</div>
															</div>
														))}
													</div>
												</div>
											)}
										</div>
									) : (
										<div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6 text-center">
											<TestTube className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
											<p className="text-zinc-400">
												Click "Run" to test your code with the example test
												cases.
											</p>
										</div>
									)}
								</div>
							</div>
						)}

						{activeRightTab === "result" && (
							<div className="flex-1 p-4 overflow-y-auto">
								<div className="space-y-4">
									<h3 className="font-semibold text-white flex items-center gap-2">
										<Zap className="w-5 h-5 text-indigo-400" />
										Submission Result
									</h3>
									{submitResult ? (
										<div
											className={`border-2 rounded-lg p-6 ${
												submitResult.accepted
													? "border-emerald-500/50 bg-emerald-500/10"
													: "border-red-500/50 bg-red-500/10"
											}`}
										>
											{submitResult.accepted ? (
												<div className="space-y-4">
													<div className="flex items-center gap-2">
														<CheckCircle className="w-6 h-6 text-emerald-400" />
														<h4 className="font-bold text-lg text-emerald-400">
															🎉 Accepted
														</h4>
													</div>
													<div className="grid grid-cols-1 gap-2 text-sm">
														<div>
															<span className="text-zinc-400">Test Cases:</span>{" "}
															<span className="text-white">
																{submitResult.passedTestCases}/
																{submitResult.totalTestCases}
															</span>
														</div>
														<div>
															<span className="text-zinc-400">Runtime:</span>{" "}
															<span className="text-white">
																{submitResult.runtime} sec
															</span>
														</div>
														<div>
															<span className="text-zinc-400">Memory:</span>{" "}
															<span className="text-white">
																{submitResult.memory} KB
															</span>
														</div>
													</div>
												</div>
											) : (
												<div className="space-y-4">
													<div className="flex items-center gap-2">
														<XCircle className="w-6 h-6 text-red-400" />
														<h4 className="font-bold text-lg text-red-400">
															{submitResult.error}
														</h4>
													</div>
													<div className="text-sm">
														<div>
															<span className="text-zinc-400">
																Test Cases Passed:
															</span>{" "}
															<span className="text-white">
																{submitResult.passedTestCases}/
																{submitResult.totalTestCases}
															</span>
														</div>
													</div>
												</div>
											)}
										</div>
									) : (
										<div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6 text-center">
											<Send className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
											<p className="text-zinc-400">
												Click "Submit" to submit your solution for evaluation.
											</p>
										</div>
									)}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProblemPage;
