const closeButton = document.getElementById("close-side-menu-button");
const openButton = document.getElementById("open-side-menu-button");
const sideMenu = document.getElementById("side-menu");

function displaySideMenu() {
	// hide the sideMenu onclick of close button
	if (closeButton && sideMenu) {
		closeButton.onclick = () => {
			sideMenu.style.display = "none";
		};
	}
	// show the sideMenu onclick of open button
	if (openButton && sideMenu) {
		openButton.onclick = () => {
			sideMenu.style.display = "block";
		}
	}
	// hide the sideMenu on click of any link
	if (sideMenu) {
		sideMenu.onclick = () => {
			sideMenu.style.display = "none";
		}
	}
};

export default displaySideMenu;