document.querySelectorAll(".muonsachchitiet").forEach((btn) =>
	btn.addEventListener("click", () => {
		window.location.href = "../muon/muon.html";
	})
);

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
