import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "../components/core/header";
import HomeRouter from "./homeRouter";
import ProfileRouter from "./profileRouter";
import SettingsRouter from "./settingsRouter";
export default function InitialRouter() {
	return (
		<div>
			<Header />
			<Router>
				<Routes>
					<Route path="/settings" element={<SettingsRouter />} />
					<Route path="/profile" element={<ProfileRouter />} />
					<Route path="/home" element={<HomeRouter />} />
				</Routes>
			</Router>
		</div>
	);
}
