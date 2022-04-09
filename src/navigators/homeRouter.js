import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../screens/home/home";

export default function HomeRouter() {
	return (
		<div>
			<Routes>
				<Route path="/" element={<Home />} />
			</Routes>
		</div>
	);
}
