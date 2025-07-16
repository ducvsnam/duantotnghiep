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

	if (username.length > 20) {
		showPopup("Tên đăng nhập không được vượt quá 20 ký tự");
		return;
	}

	if (email.length > 100) {
		showPopup("Email không được vượt quá 100 ký tự");
		return;
	}

	if (password.length > 30) {
		showPopup("Mật khẩu không được vượt quá 30 ký tự");
		return;
	}

	if (!validatePassword(password)) {
		showPopup(
			"Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
		);
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

function validatePassword(password) {
	const regex =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
	return regex.test(password);
}

const flip = document.getElementById("flipCard");
const btn = document.getElementById("mainActionBtn");

function switchForm(target) {
	const flipCard = document.getElementById("flipCard");
	const btn = document.getElementById("mainActionBtn");
	const registerForm = document.getElementById("registerForm");

	if (target === "register") {
		flipCard.classList.add("flipped", "expanded-height");
		btn.textContent = "Đăng ký";
		btn.setAttribute("onclick", "handleRegister()");
		btn.style.marginTop = "210px";
		registerForm.style.marginTop = "65px";
	} else {
		flipCard.classList.remove("flipped", "expanded-height");
		btn.textContent = "Đăng nhập";
		btn.setAttribute("onclick", "handleLogin()");
		btn.style.marginTop = "230px";
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
			window.location.href = "../nguoidung/nguoidung.html";
		}, 800);
	} else {
		showPopup("Sai tên đăng nhập hoặc mật khẩu");
	}
}
