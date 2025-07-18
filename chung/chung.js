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

function initChiTietButtons() {
	document.querySelectorAll(".chitiet").forEach((btn) => {
		btn.addEventListener("click", () => {
			const theDiv = btn.parentElement.querySelector(".the");
			if (!theDiv) return;

			const img = theDiv.querySelector("img")?.getAttribute("src") || "";
			const name = theDiv.getAttribute("data-name") || "";
			const author = theDiv.getAttribute("data-author") || "";
			const genre = theDiv.getAttribute("data-genre") || "";
			const year = theDiv.getAttribute("data-year") || "";
			const quantity = theDiv.getAttribute("data-quantity") || "";

			const url = new URL("../chitiet/chitiet.html", window.location.origin);
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

			const pageImg = document.getElementById("ava-page-admin");
			if (pageImg) pageImg.src = newSrc;

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

			const pageImg = document.getElementById("ava-page-user");
			if (pageImg) pageImg.src = newSrc;

			localStorage.setItem("avatarNguoiDung", newSrc);
		};
		reader.readAsDataURL(file);
	};
}

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

	const tatBtn = document.querySelector(".tat");
	if (tatBtn) {
		tatBtn.addEventListener("click", () => {
			window.location.href = "../thuvien/thuvien.html";
		});
	}

	const savedAdmin = localStorage.getItem("avatarQuanLy");
	if (savedAdmin) {
		const adminInfoImg = document.getElementById("ava-admin");
		const adminPageImg = document.getElementById("ava-page-admin");
		if (adminInfoImg) adminInfoImg.src = savedAdmin;
		if (adminPageImg) adminPageImg.src = savedAdmin;
	}

	const savedUser = localStorage.getItem("avatarNguoiDung");
	if (savedUser) {
		const userInfoImg = document.getElementById("ava-info");
		const userPageImg = document.getElementById("ava-page-user");
		if (userInfoImg) userInfoImg.src = savedUser;
		if (userPageImg) userPageImg.src = savedUser;
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
