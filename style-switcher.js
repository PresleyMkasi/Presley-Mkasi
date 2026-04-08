/*================= toggle style switcher ==============*/
const styleSitcherToggle = document.querySelector(".style-switcher-toggler");
styleSitcherToggle.addEventListener("click", () => {
    document.querySelector(".style-switcher").classList.toggle("open");
})

/*================= hide themes on scroll ==============*/
window.addEventListener("scroll", () => {
    if(document.querySelector(".style-switcher").classList.contains("open")) {
        document.querySelector(".style-switcher").classList.remove("open");
    }
})

const THEME_COLOR_KEY = "themeColor";
const THEME_MODE_KEY = "themeMode";

function applySavedTheme() {
    const savedColor = localStorage.getItem(THEME_COLOR_KEY);
    const savedMode = localStorage.getItem(THEME_MODE_KEY);

    if (savedColor) {
        setActiveStyle(savedColor);
    }

    if (savedMode === "dark") {
        document.body.classList.add("dark");
    } else if (savedMode === "light") {
        document.body.classList.remove("dark");
    }
}

/*================= theme colours ==============*/
const alternateStyles = document.querySelectorAll(".alternate-style");
function setActiveStyle(color) {
    alternateStyles.forEach((style) => {
        if(color === style.getAttribute("title")) {
            style.removeAttribute("disabled");
        }

        else {
            style.setAttribute("disabled", "true");
        }
    })
    localStorage.setItem(THEME_COLOR_KEY, color);
}

/*================= Light and dark mode ==============*/
const dayNight = document.querySelector(".light-dark-mode");
dayNight.addEventListener("click", () => {
    dayNight.querySelector("i").classList.toggle("fa-sun");
    dayNight.querySelector("i").classList.toggle("fa-moon");
    document.body.classList.toggle("dark");
    localStorage.setItem(
        THEME_MODE_KEY,
        document.body.classList.contains("dark") ? "dark" : "light"
    );
})

window.addEventListener("load", () => {
    applySavedTheme();

    if(document.body.classList.contains("dark")) {
        dayNight.querySelector("i").classList.add("fa-sun");
    }

    else {
        dayNight.querySelector("i").classList.add("fa-moon");
    }
})
