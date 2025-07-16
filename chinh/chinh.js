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
