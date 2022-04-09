import React from "react";

export default function Header() {
	return (
		<header>
			<ul id="navigation">
				<li>
					<a href="/home">Home</a>
				</li>
				<li>
					<a href="/settings">Settings</a>
				</li>
				<li>
					<a href="/profile">Profile</a>
				</li>
			</ul>
		</header>
	);
}
