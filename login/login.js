document.getElementById("submitBtn").addEventListener("click", function (e) {
	e.preventDefault();

	let email = document.getElementById("email").value.trim();
	let password = document.getElementById("password").value.trim();

	let emailError = document.getElementById("emailError");
	let passwordError = document.getElementById("passwordError");

	emailError.textContent = "";
	passwordError.textContent = "";

	let isValid = true;
	let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (!email || !emailRegex.test(email)) {
		emailError.textContent = "Email không hợp lệ!";
		isValid = false;
	}

	if (!password || password.length < 6) {
		passwordError.textContent = "Mật khẩu phải ít nhất 6 ký tự!";
		isValid = false;
	}

	if (!isValid) return;

	if (email === "catsstack@gmail.com" && password === "1234567890") {
		window.location.href = "../chu/chu.html";
	} else {
		passwordError.textContent =
			"Bạn đã nhập sai email hoặc mật khẩu, vui lòng thử lại!";
	}
});

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

function revealOnScroll() {
	const reveals = document.querySelectorAll(".reveal");
	for (let i = 0; i < reveals.length; i++) {
		const windowHeight = window.innerHeight;
		const revealTop = reveals[i].getBoundingClientRect().top;
		const revealPoint = 100;

		if (revealTop < windowHeight - revealPoint) {
			reveals[i].classList.add("active");
		} else {
			reveals[i].classList.remove("active");
		}
	}
}
