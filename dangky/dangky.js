const flip = document.getElementById("flipCard");
const btn = document.getElementById("mainActionBtn");

function switchForm(target) {
	const flipCard = document.getElementById("flipCard");
	const btn = document.getElementById("mainActionBtn");
	const registerForm = document.getElementById("registerForm");
	const loginLink = document.getElementById("loginLink");
	const registerLink = document.getElementById("registerLink");

	loginLink.classList.remove("active");
	registerLink.classList.remove("active");

	if (target !== "register") {
		flipCard.classList.add("flipped", "expanded-height");
		btn.textContent = "Đăng nhập";
		btn.setAttribute("onclick", "handleLogin()");
		btn.style.marginTop = "115px";
		btn.style.marginBottom = "112px";

		loginLink.classList.add("active");
	} else {
		flipCard.classList.remove("flipped", "expanded-height");
		btn.textContent = "Đăng ký";
		btn.setAttribute("onclick", "handleRegister()");
		btn.style.marginTop = "375px";
		btn.style.marginBottom = "0";
		registerForm.style.marginTop = "20px";

		registerLink.classList.add("active");
	}
}

function validatePassword(password) {
	const regex =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
	return regex.test(password);
}

function handleRegister() {
	const username = document.getElementById("registerUsername").value;
	const email = document.getElementById("registerEmail").value;
	const password = document.getElementById("registerPassword").value;
	const confirm = document.getElementById("registerConfirm").value;
	const phone = document.getElementById("registerPhone").value;

	if (!username || !email || !password || !confirm) {
		showPopup("Vui lòng điền đầy đủ thông tin");
		return;
	}

	if (username.length > 20) {
		showPopup("Tên đăng nhập không được vượt quá 20 ký tự");
		return;
	}

	if (username.length < 3) {
		showPopup("Tên đăng nhập không được ít hơn 3 ký tự");
		return;
	}

	if (username.trim().toLowerCase() === "CatBoss") {
		showPopup("Tên đăng nhập này đã được quản trị viên sử dụng");
		return;
	}

	if (email.trim().toLowerCase() === "CatsStackBoss@gmail.com") {
		showPopup("Email này đã được quản trị viên sử dụng");
		return;
	}

	if (email.length > 30) {
		showPopup("Email không được vượt quá 30 ký tự");
		return;
	}

	if (email.length < 6) {
		showPopup("Email không được ít hơn 6 ký tự");
		return;
	}

	if (password.length > 30) {
		showPopup("Mật khẩu không được vượt quá 30 ký tự");
		return;
	}

	if (!validatePassword(password)) {
		showPopup(
			"Mật khẩu phải có ít nhất 8 ký tự gồm 1 chữ hoa 1 chữ thường 1 số và 1 ký tự đặc biệt"
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

	if (!phone) {
		showPopup("Vui lòng nhập số điện thoại");
		return;
	}

	if (!/^0\d{9}$/.test(phone)) {
		showPopup("Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0");
		return;
	}

	const newUser = { username, email, password, phone };
	users.push(newUser);
	localStorage.setItem("users", JSON.stringify(users));
	localStorage.setItem("currentUser", JSON.stringify(newUser));

	showPopup("Đăng ký thành công");
	switchForm("login");
}

function handleLogin() {
	const username = document.getElementById("loginUsername").value;
	const password = document.getElementById("loginPassword").value;

	if (username === "CatBoss" && password === "CatsStackBoss@888") {
		localStorage.setItem(
			"currentUser",
			JSON.stringify({ username: "CatBoss", email: "CatsStackBoss@gmail.com" })
		);

		document.body.classList.remove("fade-in");
		document.body.classList.add("fade-out");

		setTimeout(() => {
			window.location.href = "../quanly/quanly.html";
		}, 800);
		return;
	}

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
				password: found.password,
				phone: found.phone,
			})
		);

		document.body.classList.remove("fade-in");
		document.body.classList.add("fade-out");

		setTimeout(() => {
			window.location.href = "../nguoidung/nguoidung.html";
		}, 1500);
	} else {
		showPopup("Sai tên đăng nhập hoặc mật khẩu");
	}
}

document.addEventListener("DOMContentLoaded", () => {
	document.body.classList.add("fade-in");

	const shouldShowPopup = localStorage.getItem("showLoginPopup");
	if (shouldShowPopup === "true") {
		showPopup("Bạn chưa đăng nhập");
		localStorage.removeItem("showLoginPopup");
	}

	const path = window.location.pathname;
	if (path.includes("dangky.html")) {
		switchForm("register");
	} else {
		switchForm("login");
	}
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

const input = document.getElementById("registerPhone");
input.addEventListener("input", () => {
	input.value = input.value.replace(/\D/g, "");
});
