import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";

import { renderRoutes } from "./utils/helpers";
import { privateRoutes, publicRoutes, routes } from "./routes/routes";
import { selectUser } from "./redux/selectors";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

const ProtectedRoute = ({ redirectPath = "/sign-in" }) => {
	const currentUser = useSelector(selectUser);
	const currentPathName = window.location.pathname;
	if (!currentUser) {
		return <Navigate to={`${redirectPath}?next=${encodeURIComponent(currentPathName)}`} replace />;
	}
	return <Outlet />;
};

function App() {
	return (
		<BrowserRouter>
			<ToastContainer />
			<Routes>
				<Route path="/" element={<Navigate to={routes.signIn} />} />
				{renderRoutes(publicRoutes)}
				{<Route element={<ProtectedRoute />}>{renderRoutes(privateRoutes)}</Route>}
			</Routes>
		</BrowserRouter>
	);
}

export default App;
