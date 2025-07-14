document.addEventListener("DOMContentLoaded", () => {
	document.body.classList.add("fade-in");

	const shouldShowPopup = localStorage.getItem("showLoginPopup");
	if (shouldShowPopup === "true") {
		showPopup("Bạn chưa đăng nhập, vui lòng đăng nhập lại");
		localStorage.removeItem("showLoginPopup");
	}
});

function handleRegister() {
	const username = document.getElementById("registerUsername").value;
	const email = document.getElementById("registerEmail").value;
	const password = document.getElementById("registerPassword").value;
	const confirm = document.getElementById("registerConfirm").value;

	if (!username || !email || !password || !confirm) {
		showPopup("Vui lòng điền đầy đủ thông tin");
		return;
	}

	if (password !== confirm) {
		showPopup("Mật khẩu không khớp");
		return;
	}

	const users = JSON.parse(localStorage.getItem("users") || "[]");
	const exists = users.find(
		(u) => u.username === username || u.email === email
	);

	if (exists) {
		showPopup("Tên đăng nhập hoặc email đã tồn tại");
		return;
	}

	users.push({ username, email, password });
	localStorage.setItem("users", JSON.stringify(users));
	showPopup("Đăng ký thành công, vui lòng đăng nhập");
	switchForm("login");
}

const flip = document.getElementById("flipCard");
const btn = document.getElementById("mainActionBtn");

function switchForm(target) {
	const flipCard = document.getElementById("flipCard");
	const btn = document.getElementById("mainActionBtn");

	if (target === "register") {
		flipCard.classList.add("flipped", "expanded-height");
		btn.textContent = "Đăng ký";
		btn.setAttribute("onclick", "handleRegister()");
		btn.style.marginTop = "145px";
	} else {
		flipCard.classList.remove("flipped", "expanded-height");
		btn.textContent = "Đăng nhập";
		btn.setAttribute("onclick", "handleLogin()");
		btn.style.marginTop = "75px";
	}
}

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

function handleLogin() {
	const username = document.getElementById("loginUsername").value;
	const password = document.getElementById("loginPassword").value;

	const users = JSON.parse(localStorage.getItem("users") || "[]");
	const found = users.find(
		(u) => u.username === username && u.password === password
	);

	if (found) {
		localStorage.setItem(
			"currentUser",
			JSON.stringify({
				username: found.username,
				email: found.email,
			})
		);

		document.body.classList.remove("fade-in");
		document.body.classList.add("fade-out");

		setTimeout(() => {
			window.location.href = "giaodiennguoidung.html";
		}, 800);
	} else {
		showPopup("Sai tên đăng nhập hoặc mật khẩu");
	}
}
