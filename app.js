// GSAP and Barba.js initialization for page transitions

function resetWebflow(data) {
  let dom = $(new DOMParser().parseFromString(data.next.html, "text/html")).find("html");
  $("html").attr("data-wf-page", dom.attr("data-wf-page"));
  window.Webflow && window.Webflow.destroy();
  window.Webflow && window.Webflow.ready();
  window.Webflow && window.Webflow.require("ix2").init();
  $(".w--current").removeClass("w--current");
  $("a").each(function () {
    if ($(this).attr("href") === window.location.pathname) {
      $(this).addClass("w--current");
    }
  });
}

// Page Transitions with Barba.js
barba.init({
  transitions: [
    {
      sync: true,
      enter(data) {
        let tl = gsap.timeline({ defaults: { duration: 0.5, ease: "power2.out" } });
        tl.to(data.current.container, { opacity: 0, scale: 0.9 });
        tl.from(data.next.container, { y: "100vh" }, "<");
        return tl;
      }
    }
  ]
});

// Reinitialize functionality after each page transition
barba.hooks.after((data) => {
  resetWebflow(data);
  if (typeof colorModeToggle === 'function') {
    colorModeToggle(); // Reinitialize dark mode toggle after page transitions
  }
});

// Dark Mode Functionality
function colorModeToggle() {
  const htmlElement = document.documentElement;
  const computed = getComputedStyle(htmlElement);
  let toggleEl;
  let togglePressed = "false";

  const scriptTag = document.querySelector("[color-vars]");
  let colorModeDuration = parseFloat(scriptTag.getAttribute("duration")) || 0.5;
  let colorModeEase = scriptTag.getAttribute("ease") || "power1.out";
  const cssVariables = scriptTag.getAttribute("color-vars");

  if (!cssVariables) {
    console.warn("No color-vars attribute found on script");
    return;
  }

  let lightColors = {};
  let darkColors = {};

  cssVariables.split(",").forEach((item) => {
    let lightValue = computed.getPropertyValue(`--light-mode--${item}`);
    let darkValue = computed.getPropertyValue(`--dark-mode--${item}`);
    if (lightValue) {
      lightColors[`--light-mode--${item}`] = lightValue;
      darkColors[`--dark-mode--${item}`] = darkValue || lightValue;
    }
  });

  function setColors(colorObject, animate) {
    if (typeof gsap !== "undefined" && animate) {
      gsap.to(htmlElement, {
        ...colorObject,
        duration: colorModeDuration,
        ease: colorModeEase,
      });
    } else {
      Object.keys(colorObject).forEach((key) => {
        htmlElement.style.setProperty(key, colorObject[key]);
      });
    }
  }

  function goDark(dark, animate) {
    if (dark) {
      localStorage.setItem("dark-mode", "true");
      htmlElement.classList.add("dark-mode");
      setColors(darkColors, animate);
    } else {
      localStorage.setItem("dark-mode", "false");
      htmlElement.classList.add("light-mode");
      setColors(lightColors, animate);
    }
    togglePressed = dark ? "true" : "false";
    if (toggleEl) {
      toggleEl.forEach((el) => el.setAttribute("aria-pressed", togglePressed));
    }
  }

  const colorPreference = window.matchMedia("(prefers-color-scheme: dark)");
  colorPreference.addEventListener("change", (e) => goDark(e.matches, false));

  let storagePreference = localStorage.getItem("dark-mode");
  if (storagePreference !== null) {
    goDark(storagePreference === "true", false);
  } else {
    goDark(colorPreference.matches, false);
  }

  window.addEventListener("DOMContentLoaded", () => {
    toggleEl = document.querySelectorAll("[color-toggle]");
    toggleEl.forEach((el) => {
      el.setAttribute("aria-pressed", togglePressed);
      el.addEventListener("click", () => {
        let darkClass = htmlElement.classList.contains("dark-mode");
        goDark(!darkClass, true);
      });
    });
  });
}

// Expose colorModeToggle globally
window.colorModeToggle = colorModeToggle;

// Initialize Dark Mode when the script loads
colorModeToggle();
