// Chức năng bảo mật web
let currentUser = null;
try {
	currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
} catch (e) {
	currentUser = null;
}

const allowAnonymous = ["dangnhap.html"];
const adminOnlyPages = ["sach.html", "chitietsach.html", "quanlymuon.html"];
const userOnlyPages = ["phieumuon.html"];

const pageName = window.location.pathname.split("/").pop();

const isAllowed = allowAnonymous.includes(pageName);
const isAdminPage = adminOnlyPages.includes(pageName);
const isUserPage = userOnlyPages.includes(pageName);

// không cho bất kỳ ai vào các trang chức năng nếu chưa đăng nhập
if (!currentUser && !isAllowed) {
	window.location.href = "../dangnhap/dangnhap.html?unauth=1";
}

// không cho bất kỳ ai vào các trang chức năng dành cho quản lý nếu không phải quản lý
if (isAdminPage && (!currentUser || currentUser.username !== "CatBoss")) {
	window.location.href = "../dangnhap/dangnhap.html?noaccess=1";
}

// không cho bất kỳ ai vào các trang chức năng dành cho người dùng nếu không phải người dùng
if (isUserPage && currentUser?.username === "CatBoss") {
	window.location.href = "../dangnhap/dangnhap.html?noaccess=1";
}

function vuilongdangnhap() {
	showPopup("Vui lòng đăng nhập để dùng chức năng này");
}

// Hiện ứng ẩn hiện và kéo lên kéo xuống trang
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

function toggleScrollButton() {
	const upBtn = document.querySelector(".up");
	const downBtn = document.querySelector(".down");

	if (!upBtn || !downBtn) return;

	const scrollTop = window.scrollY;
	const scrollBottom =
		window.innerHeight + scrollTop >= document.documentElement.scrollHeight;

	if (scrollTop === 0) {
		upBtn.classList.add("hidden");
	} else {
		upBtn.classList.remove("hidden");
	}

	if (scrollBottom) {
		downBtn.classList.add("hidden");
		upBtn.style.bottom = "11px";
	} else {
		downBtn.classList.remove("hidden");
		upBtn.style.bottom = "60px";
	}
}
window.addEventListener("load", toggleScrollButton);
window.addEventListener("scroll", toggleScrollButton);

// thông tin trang chi tiết sách
function initChiTietButtons() {
	document.querySelectorAll(".chitietsach").forEach((btn) => {
		btn.addEventListener("click", () => {
			const theDiv = btn.parentElement.querySelector(".the");
			if (!theDiv) return;

			const img = theDiv.querySelector("img")?.getAttribute("src") || "";
			const name = theDiv.getAttribute("data-name") || "";
			const author = theDiv.getAttribute("data-author") || "";
			const genre = theDiv.getAttribute("data-genre") || "";
			const year = theDiv.getAttribute("data-year") || "";
			const quantity = theDiv.getAttribute("data-quantity") || "";

			const bookList = JSON.parse(localStorage.getItem("bookList")) || [];
			const book = bookList.find((b) => b.title === name);
			if (!book || book.isDeleted) {
				showPopup("Sách Không Còn Tồn Tại");
				return;
			}

			const url = new URL(
				"../chitietsach/chitietsach.html",
				window.location.origin
			);

			url.searchParams.set("id", book.id);

			document.body.classList.remove("fade-in");
			document.body.classList.add("fade-out");

			setTimeout(() => {
				window.location.href = url.href;
			}, 800);
		});
	});
}

// hiệu ứng thông báo được chỉnh sửa thay cho alert thường
function showPopup(message) {
	const overlay = document.getElementById("overlay");
	const messageElement = document.getElementById("message");
	const closeBtn = document.getElementById("popup-close-btn");
	const yesBtn = document.getElementById("confirm-yes-btn");
	const noBtn = document.getElementById("confirm-no-btn");

	messageElement.innerText = message;
	overlay.classList.add("show");

	closeBtn.style.display = "inline-block";
	yesBtn.style.display = "none";
	noBtn.style.display = "none";

	closeBtn.onclick = () => overlay.classList.remove("show");
	overlay.onclick = (e) => {
		if (e.target === overlay) overlay.classList.remove("show");
	};
}

function closePopup() {
	document.getElementById("overlay")?.classList.remove("show");
}

// chức năng chọn ảnh đại diện
function chonAnhQuanLy() {
	const input = document.getElementById("imageUploadAdmin");
	if (!input) return;
	input.click();

	input.onchange = function (e) {
		const file = e.target.files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = function (e) {
			const newSrc = e.target.result;

			const infoImg = document.getElementById("ava-admin");
			if (infoImg) infoImg.src = newSrc;

			const pageImgNoi = document.getElementById("ava-page-admin");
			if (pageImgNoi) pageImgNoi.src = newSrc;

			const pageImgNgoai = document.getElementsByClassName("ava-img-admin");
			for (let i = 0; i < pageImgNgoai.length; i++) {
				pageImgNgoai[i].src = newSrc;
			}

			localStorage.setItem("avatarQuanLy", newSrc);
		};
		reader.readAsDataURL(file);
	};
}

function chonAnhNguoiDung() {
	const input = document.getElementById("imageUploadUser");
	if (!input) return;
	input.click();

	input.onchange = function (e) {
		const file = e.target.files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = function (e) {
			const newSrc = e.target.result;

			const infoImg = document.getElementById("ava-info");
			if (infoImg) infoImg.src = newSrc;

			const pageImgNoi = document.getElementById("ava-page-user");
			if (pageImgNoi) pageImgNoi.src = newSrc;

			const pageImgNgoai = document.getElementsByClassName("ava-img-user");
			for (let i = 0; i < pageImgNgoai.length; i++) {
				pageImgNgoai[i].src = newSrc;
			}

			const userID = localStorage.getItem("userID");
			if (userID) {
				localStorage.setItem(`avatarNguoiDung_${userID}`, newSrc);
			}
		};
		reader.readAsDataURL(file);
	};
}

function getBooks() {
	const saved = localStorage.getItem("bookList");
	if (saved) {
		try {
			return JSON.parse(saved);
		} catch (e) {
			console.error("Lỗi khi parse bookList từ localStorage:", e);
			return [];
		}
	}
	return [];
}

// những chức năng sử lý sau DOM
document.addEventListener("DOMContentLoaded", () => {
	document.body.classList.add("fade-in");

	const overlay = document.getElementById("overlay");
	if (overlay) {
		overlay.addEventListener("click", function (e) {
			if (e.target === this) closePopup();
		});
	}

	document.addEventListener("keydown", function (e) {
		const overlay = document.getElementById("overlay");
		if (
			overlay?.classList.contains("show") &&
			(e.key === "Enter" || e.key === "Escape")
		) {
			closePopup();
		}
	});

	const closeBtn = document.getElementById("popup-close-btn");
	if (closeBtn) {
		closeBtn.addEventListener("click", closePopup);
	}

	window.showPopup = showPopup;

	initChiTietButtons();

	const tatchung = document.querySelector(".tatchung");
	const tatnguoidung = document.querySelector(".tatnguoidung");
	const tatquanly = document.querySelector(".tatquanly");
	if (tatchung) {
		tatchung.addEventListener("click", () => {
			document.body.classList.remove("fade-in");
			document.body.classList.add("fade-out");

			setTimeout(() => {
				window.location.href = "../thuvienchung/thuvienchung.html";
			}, 800);
		});
	} else if (tatnguoidung) {
		tatnguoidung.addEventListener("click", () => {
			document.body.classList.remove("fade-in");
			document.body.classList.add("fade-out");

			setTimeout(() => {
				window.location.href = "../thuviennguoidung/thuviennguoidung.html";
			}, 800);
		});
	} else if (tatquanly) {
		tatquanly.addEventListener("click", () => {
			document.body.classList.remove("fade-in");
			document.body.classList.add("fade-out");

			setTimeout(() => {
				window.location.href = "../thuvienquanly/thuvienquanly.html";
			}, 800);
		});
	}

	const savedAdmin = localStorage.getItem("avatarQuanLy");
	if (savedAdmin) {
		const adminInfoImg = document.getElementById("ava-admin");
		const adminpageImgNoi = document.getElementById("ava-page-admin");
		const adminpageImgNgoai = document.getElementsByClassName("ava-img-admin");

		if (adminInfoImg) adminInfoImg.src = savedAdmin;
		if (adminpageImgNoi) adminpageImgNoi.src = savedAdmin;
		for (let i = 0; i < adminpageImgNgoai.length; i++) {
			adminpageImgNgoai[i].src = savedAdmin;
		}
	}

	const userID = localStorage.getItem("userID");
	const savedUser =
		localStorage.getItem(`avatarNguoiDung_${userID}`) ||
		"../anh/theme/noava.jpg";

	if (savedUser) {
		const userInfoImg = document.getElementById("ava-info");
		const userpageImgNoi = document.getElementById("ava-page-user");
		const userpageImgNgoai = document.getElementsByClassName("ava-img-user");

		if (userInfoImg) userInfoImg.src = savedUser;
		if (userpageImgNoi) userpageImgNoi.src = savedUser;
		for (let i = 0; i < userpageImgNgoai.length; i++) {
			userpageImgNgoai[i].src = savedUser;
		}
	}

	renderBooksToBlocks();

	const logoutBtn = document.querySelector(".nut-dangxuat");
	if (logoutBtn) {
		logoutBtn.addEventListener("click", function () {
			localStorage.removeItem("currentUser");

			history.replaceState(null, "", location.href);
			window.addEventListener("popstate", () => {
				location.href = "../chinh/chinh.html";
			});

			document.body.classList.remove("fade-in");
			document.body.classList.add("fade-out");

			setTimeout(() => {
				window.location.href = "../chinh/chinh.html";
			}, 800);
		});
	}
});

// chức năng chuyển trang mượn mà
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

// chức năng ẩn hiện mật khẩu và tự động đổi text về pass khi lưu
document.querySelectorAll(".input-container").forEach((container) => {
	const input = container.querySelector("input");
	const toggle = container.querySelector(".eye-toggle");

	if (input && toggle) {
		toggle.addEventListener("click", () => {
			const isVisible = input.type === "text";
			input.type = isVisible ? "password" : "text";
			toggle.classList.toggle("active", !isVisible);
		});
	}
});

document.getElementById("mainActionBtn")?.addEventListener("click", () => {
	document.querySelectorAll(".input-container").forEach((container) => {
		const input = container.querySelector("input");
		const toggle = container.querySelector(".eye-toggle");

		if (input && input.type === "text") input.type = "password";
		if (toggle) toggle.classList.remove("active");
	});
});

document.querySelectorAll(".doimatkhau").forEach((btn) => {
	btn.addEventListener("click", () => {
		document.querySelectorAll(".input-container").forEach((container) => {
			const input = container.querySelector("input");
			const toggle = container.querySelector(".eye-toggle");

			if (input && input.type === "text") input.type = "password";
			if (toggle) toggle.classList.remove("active");
		});
	});
});

// chức năng của bảng chọn ngày
window.addEventListener("load", function () {
	const borrowedInput = document.getElementById("borrowedDateDisplay");
	const returnInput = document.getElementById("returnDateDisplay");
	const hiddenBorrowed = document.getElementById("borrowedDate");
	const hiddenReturn = document.getElementById("returnDate");

	if (borrowedInput && hiddenBorrowed) {
		flatpickr(borrowedInput, {
			dateFormat: "d/m/Y",
			onChange: function (_, dateStr) {
				hiddenBorrowed.value = dateStr;
			},
			onOpen: function (_, __, instance) {
				instance.calendarContainer.classList.add("open");
			},
			onClose: function (_, __, instance) {
				instance.calendarContainer.classList.remove("open");
			},
		});
	}

	if (returnInput && hiddenReturn) {
		flatpickr(returnInput, {
			dateFormat: "d/m/Y",
			onChange: function (_, dateStr) {
				hiddenReturn.value = dateStr;
			},
			onOpen: function (_, __, instance) {
				instance.calendarContainer.classList.add("open");
			},
			onClose: function (_, __, instance) {
				instance.calendarContainer.classList.remove("open");
			},
		});
	}
});

// hiệu ứng thông báo được chỉnh sửa thay cho alert thường
window.showPopup = function (message) {
	const overlay = document.getElementById("overlay");
	const msg = document.getElementById("message");
	const closeBtn = document.getElementById("popup-close-btn");
	const yesBtn = document.getElementById("confirm-yes-btn");
	const noBtn = document.getElementById("confirm-no-btn");

	if (!overlay || !msg) return;

	msg.innerText = message;
	overlay.classList.add("show");

	closeBtn.style.display = "inline-block";
	yesBtn.style.display = "none";
	noBtn.style.display = "none";

	closeBtn.onclick = () => overlay.classList.remove("show");
	overlay.onclick = (e) => {
		if (e.target === overlay) overlay.classList.remove("show");
	};
};

window.showConfirm = function (message, callback) {
	const overlay = document.getElementById("overlay");
	const msg = document.getElementById("message");
	const closeBtn = document.getElementById("popup-close-btn");
	const yesBtn = document.getElementById("confirm-yes-btn");
	const noBtn = document.getElementById("confirm-no-btn");

	if (!overlay || !msg || !yesBtn || !noBtn) return;

	msg.innerText = message;
	overlay.classList.add("show");

	closeBtn.style.display = "none";
	yesBtn.style.display = "inline-block";
	noBtn.style.display = "inline-block";

	const cleanup = () => {
		overlay.classList.remove("show");
		yesBtn.onclick = null;
		noBtn.onclick = null;
		overlay.onclick = null;
	};

	yesBtn.onclick = (e) => {
		e.stopPropagation();
		cleanup();
		callback(true);
	};

	noBtn.onclick = (e) => {
		e.stopPropagation();
		cleanup();
		callback(false);
	};

	overlay.onclick = (e) => {
		if (e.target === overlay) {
			cleanup();
			callback(false);
		}
	};
};

// chức năng chạy lên đầu khi tải lại trang
if ("scrollRestoration" in history) {
	history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
	if (!location.hash) {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}
});
