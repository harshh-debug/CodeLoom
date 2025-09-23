import { Routes, Route, Navigate } from "react-router";
// import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./authSlice";
import AdminPanel from "./pages/AdminPanel";
import AdminCreate from "./components/AdminCreate";
import AdminDelete from "./components/AdminDelete";
import ProblemPage from "./pages/ProblemPage";
import AdminVideo from "./components/AdminVideo";
import AdminUpload from "./components/AdminUpload";
import Homepage from "./pages/Homepage";
import HeroPage from "./pages/HeroPage";
// import HeroPage from "./pages/HeroPage";
// import MonacoEditor from "./pages/MonacoEditor";

const App = () => {
	const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(checkAuth());
	}, [dispatch]); //only once called can be left empty array as well

	return (
		<Routes>
			<Route
				path="/"
				element={
					isAuthenticated ? <Homepage></Homepage> : <HeroPage/>
				}
			></Route>
			<Route
				path="/login"
				element={
					isAuthenticated ? <Navigate to="/" /> : <LoginPage></LoginPage>
				}
			></Route>
			<Route
				path="/signup"
				element={
					isAuthenticated ? <Navigate to="/" /> : <SignupPage></SignupPage>
				}
			></Route>
			<Route
				path="/admin"
				element={
					isAuthenticated && user?.role === "admin" ? (
						<AdminPanel />
					) : (
						<Navigate to="/" />
					)
				}
			/>
			<Route
				path="/admin/create"
				element={
					isAuthenticated && user?.role === "admin" ? (
						<AdminCreate />
					) : (
						<Navigate to="/" />
					)
				}
			/>
			<Route
				path="/admin/video"
				element={
					isAuthenticated && user?.role === "admin" ? (
						<AdminVideo />
					) : (
						<Navigate to="/" />
					)
				}
			/>
			<Route
				path="/admin/upload"
				element={
					isAuthenticated && user?.role === "admin" ? (
						<AdminUpload />
					) : (
						<Navigate to="/" />
					)
				}
			/>
			<Route
				path="/admin/delete"
				element={
					isAuthenticated && user?.role === "admin" ? (
						<AdminDelete />
					) : (
						<Navigate to="/" />
					)
				}
			/>
			<Route
				path="/admin/upload/:problemId"
				element={
					isAuthenticated && user?.role === "admin" ? (
						<AdminUpload />
					) : (
						<Navigate to="/" />
					)
				}
			/>
			<Route path="/problem/:problemId" element={<ProblemPage />}></Route>
		</Routes>
	);
};

export default App;
