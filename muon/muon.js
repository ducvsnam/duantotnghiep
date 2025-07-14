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
window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

function xacnhan(event) {
	event.preventDefault();

	let loi = document.getElementsByClassName("loi");
	for (let i = 0; i < loi.length; i++) {
		loi[i].textContent = "";
	}

	let isValid = true;

	let hoten = document.getElementById("hoten").value.trim();
	let email = document.getElementById("email").value.trim();
	let sosachmuon = parseInt(document.getElementById("sosachmuon").value);
	let ngayMuon = new Date(document.getElementById("thoigianmuon").value);
	let ngayTra = new Date(document.getElementById("thoigiantra").value);

	if (!/^[A-ZÀ-Ỹa-zà-ỹ]+(?:\s[A-ZÀ-Ỹa-zà-ỹ]+)+$/.test(hoten)) {
		loi[0].textContent = "Họ tên không hợp lệ";
		isValid = false;
	}

	if (!/^[\w\.-]+@[\w\.-]+\.\w{2,4}$/.test(email)) {
		loi[1].textContent = "Email không hợp lệ";
		isValid = false;
	}

	if (isNaN(ngayMuon.getTime())) {
		loi[2].textContent = "Ngày mượn không hợp lệ";
		isValid = false;
	} else {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		if (ngayMuon < today) {
			loi[2].textContent = "Ngày mượn phải từ hôm nay trở đi";
			isValid = false;
		}
	}

	if (isNaN(ngayTra.getTime())) {
		loi[3].textContent = "Ngày trả không hợp lệ";
		isValid = false;
	}

	if (!isNaN(ngayMuon.getTime()) && !isNaN(ngayTra.getTime())) {
		if (ngayTra < ngayMuon) {
			loi[3].textContent = "Ngày trả phải sau hoặc bằng ngày mượn";
			isValid = false;
		} else {
			let motNamSau = new Date(ngayMuon);
			motNamSau.setFullYear(motNamSau.getFullYear() + 1);
			if (ngayTra > motNamSau) {
				loi[3].textContent = "Không được mượn quá 1 năm";
				isValid = false;
			}
		}
	}

	if (isNaN(sosachmuon) || sosachmuon <= 0 || sosachmuon >= 1000) {
		loi[4].textContent = "Số sách phải lớn hơn 0 và nhỏ hơn 1000";
		isValid = false;
	}

	if (isValid) {
		alert("Dữ liệu hợp lệ.");
	}
}
