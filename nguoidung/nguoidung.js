document.addEventListener("DOMContentLoaded", () => {
	const currentUser = JSON.parse(localStorage.getItem("currentUser"));
	if (!currentUser) {
		localStorage.setItem("showLoginPopup", "true");

		document.body.innerHTML = "";
		setTimeout(() => {
			window.location.replace("nguoidung.html");
		}, 100);
	} else {
		document.getElementById("welcome").textContent = `Xin chào ${
			currentUser.username || "người dùng"
		}`;
	}
});

function logout() {
	localStorage.removeItem("currentUser");

	document.body.classList.remove("fade-in");
	document.body.classList.add("fade-out");

	setTimeout(() => {
		window.location.href = "nguoidung.html";
	}, 800);
}

document.addEventListener("DOMContentLoaded", () => {
	document.body.classList.add("fade-in");
});

document.querySelectorAll("button[data-href]").forEach((btn) => {
	btn.addEventListener("click", function (e) {
		e.preventDefault();
		const href = btn.getAttribute("data-href");

		if (href) {
			document.body.classList.remove("fade-in");
			document.body.classList.add("fade-out");

			setTimeout(() => {
				window.location.href = href;
			}, 800);
		}
	});
});

document.querySelectorAll("a[href]").forEach((link) => {
	const href = link.getAttribute("href");
	if (href && !href.startsWith("#") && !link.hasAttribute("target")) {
		link.addEventListener("click", function (e) {
			e.preventDefault();
			document.body.classList.remove("fade-in");
			document.body.classList.add("fade-out");
			setTimeout(() => {
				window.location.href = href;
			}, 800);
		});
	}
});
