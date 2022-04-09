import React from "react";
import { Routes, Route } from "react-router-dom";

import Profile from "../screens/profile/profile";

export default function ProfileRouter() {
	return (
		<div>
			<Routes>
				<Route path="/" element={<Profile />} />
			</Routes>
		</div>
	);
}
