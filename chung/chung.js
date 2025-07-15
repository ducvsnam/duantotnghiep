// document.addEventListener("DOMContentLoaded", () => {
// 	const currentUser = JSON.parse(localStorage.getItem("currentUser"));
// 	const chungPages = ["nguoidung.html"];

// 	const currentPage = window.location.pathname.split("/").pop();

// 	if (chungPages.includes(currentPage)) return;

// 	if (!currentUser) {
// 		window.location.href = "nguoidung.html";
// 	}
// });

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

document.addEventListener("DOMContentLoaded", () => {
	document.body.classList.add("fade-in");

	function showPopup(message) {
		const overlay = document.getElementById("overlay");
		const messageElement = document.getElementById("message");
		const closeBtn = document.getElementById("popup-close-btn");
		const yesBtn = document.getElementById("confirm-yes-btn");
		const noBtn = document.getElementById("confirm-no-btn");

		if (!overlay || !messageElement) {
			console.error("Thiếu phần tử overlay hoặc message trong HTML");
			return;
		}

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
