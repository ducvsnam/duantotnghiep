if (!localStorage.getItem("bookList")) {
	localStorage.setItem("bookList", JSON.stringify(defaultBooks));
}
