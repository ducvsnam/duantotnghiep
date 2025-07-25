// chức năng bảo mật web
let currentUser = null;
try {
	currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
} catch (e) {
	currentUser = null;
}

const allowAnonymous = [
	"chinh.html",
	"dangnhap.html",
	"dangky.html",
	"chitietchung.html",
	"thuvienchung.html",
];
const adminOnlyPages = [
	"lichsutong.html",
	"quanly.html",
	"themsach.html",
	"thongke.html",
	"thongtinquanly.html",
	"xemdanhgia.html",
	"chitietquanly.html",
	"thuvienquanly.html",
];
const userOnlyPages = [
	"nguoidung.html",
	"muon.html",
	"thongtinrieng.html",
	"danhgia.html",
	"doimatkhau.html",
	"chitietnguoidung.html",
	"thuviennguoidung.html",
];

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

// hiện ứng ẩn hiện và kéo lên kéo xuống trang
// chức năng này chưa được kiểm định rõ cho cả 3 loại người dùng
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

// thông tin trang chi tiết sách cho mọi đối tượng
function initChiTietButtons() {
	document.querySelectorAll(".chitietchung").forEach((btn) => {
		btn.addEventListener("click", () => {
			const theDiv = btn.parentElement.querySelector(".the");
			if (!theDiv) return;

			const img = theDiv.querySelector("img")?.getAttribute("src") || "";
			const name = theDiv.getAttribute("data-name") || "";
			const author = theDiv.getAttribute("data-author") || "";
			const genre = theDiv.getAttribute("data-genre") || "";
			const year = theDiv.getAttribute("data-year") || "";
			const quantity = theDiv.getAttribute("data-quantity") || "";

			const url = new URL(
				"../chitietchung/chitietchung.html",
				window.location.origin
			);
			url.searchParams.set("img", img);
			url.searchParams.set("name", name);
			url.searchParams.set("author", author);
			url.searchParams.set("genre", genre);
			url.searchParams.set("year", year);
			url.searchParams.set("quantity", quantity);

			window.location.href = url.href;
		});
	});
	//
	document.querySelectorAll(".chitietnguoidung").forEach((btn) => {
		btn.addEventListener("click", () => {
			const theDiv = btn.parentElement.querySelector(".the");
			if (!theDiv) return;

			const img = theDiv.querySelector("img")?.getAttribute("src") || "";
			const name = theDiv.getAttribute("data-name") || "";
			const author = theDiv.getAttribute("data-author") || "";
			const genre = theDiv.getAttribute("data-genre") || "";
			const year = theDiv.getAttribute("data-year") || "";
			const quantity = theDiv.getAttribute("data-quantity") || "";

			const url = new URL(
				"../chitietnguoidung/chitietnguoidung.html",
				window.location.origin
			);
			url.searchParams.set("img", img);
			url.searchParams.set("name", name);
			url.searchParams.set("author", author);
			url.searchParams.set("genre", genre);
			url.searchParams.set("year", year);
			url.searchParams.set("quantity", quantity);

			window.location.href = url.href;
		});
	});
	//
	document.querySelectorAll(".chitietquanly").forEach((btn) => {
		btn.addEventListener("click", () => {
			const theDiv = btn.parentElement.querySelector(".the");
			if (!theDiv) return;

			const img = theDiv.querySelector("img")?.getAttribute("src") || "";
			const name = theDiv.getAttribute("data-name") || "";
			const author = theDiv.getAttribute("data-author") || "";
			const genre = theDiv.getAttribute("data-genre") || "";
			const year = theDiv.getAttribute("data-year") || "";
			const quantity = theDiv.getAttribute("data-quantity") || "";

			const url = new URL(
				"../chitietquanly/chitietquanly.html",
				window.location.origin
			);
			url.searchParams.set("img", img);
			url.searchParams.set("name", name);
			url.searchParams.set("author", author);
			url.searchParams.set("genre", genre);
			url.searchParams.set("year", year);
			url.searchParams.set("quantity", quantity);

			window.location.href = url.href;
		});
	});
}
//

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

			localStorage.setItem("avatarNguoiDung", newSrc);
		};
		reader.readAsDataURL(file);
	};
}

// chức năng hiện sách theo danh sách mặc định và cập nhật khi được sửa
function renderBooksToBlocks() {
	const storedBooks = typeof getBooks === "function" ? getBooks() : [];
	const usingDefault = !Array.isArray(storedBooks) || storedBooks.length === 0;
	// const books = usingDefault ? defaultBooks : storedBooks;
	//
	const books = JSON.parse(localStorage.getItem("bookList")) || [];
	//

	const order = [
		5, 20, 21, 35, 50, 51, 65, 80, 81, 95, 0, 1, 2, 3, 4, 15, 16, 17, 18, 19,
		30, 31, 32, 33, 34, 45, 46, 47, 48, 49, 60, 61, 62, 63, 64, 75, 76, 77, 78,
		79, 90, 91, 92, 93, 94, 105, 106, 107, 108, 109,
	];

	const bookBlocks = document.querySelectorAll(".book-box");

	bookBlocks.forEach((block, i) => {
		const index = order[i];

		const book = books[index];
		if (!book) return;

		const bookDiv = block.querySelector(".the");
		if (bookDiv) {
			bookDiv.dataset.name = book.title;
			bookDiv.dataset.author = book.author;
			bookDiv.dataset.genre = book.genre;
			bookDiv.dataset.year = book.year;
			bookDiv.dataset.quantity = book.quantity;
		}

		const img = block.querySelector(".sach");
		if (img) img.src = book.image;

		const title = block.querySelector("h4");
		if (title) title.textContent = book.title;
	});
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

	// chức năng này chưa được kiểm định rõ cho cả 3 loại người dùng
	const tatchung = document.querySelector(".tatchung");
	const tatnguoidung = document.querySelector(".tatnguoidung");
	const tatquanly = document.querySelector(".tatquanly");
	if (tatchung) {
		tatchung.addEventListener("click", () => {
			window.location.href = "../thuvienchung/thuvienchung.html";
		});
	} else if (tatnguoidung) {
		tatnguoidung.addEventListener("click", () => {
			window.location.href = "../thuviennguoidung/thuviennguoidung.html";
		});
	} else if (tatquanly) {
		tatquanly.addEventListener("click", () => {
			window.location.href = "../thuvienquanly/thuvienquanly.html";
		});
	}
	//

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

	const savedUser = localStorage.getItem("avatarNguoiDung");
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
