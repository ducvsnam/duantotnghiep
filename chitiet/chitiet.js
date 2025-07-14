document.querySelectorAll(".submit").forEach((btn) =>
	btn.addEventListener("click", () => {
		window.location.href = "../muon/muon.html";
	})
);

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

const params = new URLSearchParams(window.location.search);
const imgPath = params.get("img");
if (imgPath) {
	document.getElementById("anhChiTiet").src = imgPath;
}

document.getElementById("tenSach").textContent = params.get("name") || "";
document.getElementById("tacGia").textContent = params.get("author") || "";
document.getElementById("theLoai").textContent = params.get("genre") || "";
document.getElementById("namXuatBan").textContent = params.get("year") || "";
document.getElementById("soLuong").textContent = params.get("stock") || "";
