document.querySelector(".tat").addEventListener("click", () => {
	window.location.href = "../tatca/tatca.html";
});

function toggleScrollButton() {
	const btn = document.querySelector(".btn");
	if (window.scrollY === 0) {
		btn.classList.add("hidden");
	} else {
		btn.classList.remove("hidden");
	}
}
window.addEventListener("load", toggleScrollButton);
window.addEventListener("scroll", toggleScrollButton);

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
