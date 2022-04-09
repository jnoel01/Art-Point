import React from "react";
import { Routes, Route } from "react-router-dom";

import Settings from "../screens/settings/settings";

export default function SettingsRouter() {
	return (
		<Routes>
			<Route path="/" element={<Settings />} />
		</Routes>
	);
}
