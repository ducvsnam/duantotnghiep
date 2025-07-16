// document.addEventListener("DOMContentLoaded", () => {
// 	const currentUser = JSON.parse(localStorage.getItem("currentUser"));
// 	if (!currentUser) {
// 		localStorage.setItem("showLoginPopup", "true");

// 		document.body.innerHTML = "";
// 		setTimeout(() => {
// 			window.location.replace("nguoidung.html");
// 		}, 100);
// 	} else {
// 		document.getElementById("welcome").textContent = `Xin chào ${
// 			currentUser.username || "người dùng"
// 		}`;
// 	}
// });

//
//
//
//
//
//
//
//
//
//
//
// xoá tạm thời để tránh ko load đc trang
//
//
//
//
//
//
//
//
//
//

// document.addEventListener("DOMContentLoaded", () => {
// 	document.body.classList.add("fade-in");
// });

// document.querySelectorAll("button[data-href]").forEach((btn) => {
// 	btn.addEventListener("click", function (e) {
// 		e.preventDefault();
// 		const href = btn.getAttribute("data-href");

// 		if (href) {
// 			document.body.classList.remove("fade-in");
// 			document.body.classList.add("fade-out");

// 			setTimeout(() => {
// 				window.location.href = href;
// 			}, 800);
// 		}
// 	});
// });

// document.querySelectorAll("a[href]").forEach((link) => {
// 	const href = link.getAttribute("href");
// 	if (href && !href.startsWith("#") && !link.hasAttribute("target")) {
// 		link.addEventListener("click", function (e) {
// 			e.preventDefault();
// 			document.body.classList.remove("fade-in");
// 			document.body.classList.add("fade-out");
// 			setTimeout(() => {
// 				window.location.href = href;
// 			}, 800);
// 		});
// 	}
// });
//
//
//
//
//
document.querySelector(".tat").addEventListener("click", () => {
	window.location.href = "../thuvien/thuvien.html";
});

document.querySelectorAll(".chitiet").forEach((btn) => {
	btn.addEventListener("click", () => {
		const imgSrc = btn.previousElementSibling
			.querySelector("img")
			.getAttribute("src");
		window.location.href = `../chitiet/chitiet.html?img=${encodeURIComponent(
			imgSrc
		)}`;
	});
});

document.querySelectorAll(".chitiet").forEach((btn) => {
	btn.addEventListener("click", () => {
		const theDiv = btn.parentElement.querySelector(".the");
		const img = theDiv.querySelector("img").getAttribute("src");
		const name = theDiv.getAttribute("data-name");
		const author = theDiv.getAttribute("data-author");
		const genre = theDiv.getAttribute("data-genre");
		const year = theDiv.getAttribute("data-year");

		const url = new URL("../chitiet/chitiet.html", window.location.origin);
		url.searchParams.set("img", img);
		url.searchParams.set("name", name);
		url.searchParams.set("author", author);
		url.searchParams.set("genre", genre);
		url.searchParams.set("year", year);

		window.location.href = url.href;
	});
});
