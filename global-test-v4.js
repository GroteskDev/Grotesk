// Dark mode toggle
function colorModeToggle() {
  const htmlElement = document.documentElement;
  const computed = getComputedStyle(htmlElement);
  let toggleEl;
  let togglePressed = "false";

  const scriptTag = document.querySelector("[color-vars]");
  if (!scriptTag) {
    console.warn("Script tag with color-vars attribute not found");
    return;
  }

  const colorModeDuration = 0.5;
  const colorModeEase = "power1.out";

  const cssVariables = scriptTag.getAttribute("color-vars");
  if (!cssVariables.length) {
    console.warn("Value of color-vars attribute not found");
    return;
  }

  let lightColors = {};
  let darkColors = {};
  cssVariables.split(",").forEach(function (item) {
    let lightValue = computed.getPropertyValue(`--light-mode--${item}`);
    let darkValue = computed.getPropertyValue(`--dark-mode--${item}`);
    if (lightValue.length) {
      if (!darkValue.length) darkValue = lightValue;
      lightColors[`--light-mode--${item}`] = lightValue;
      darkColors[`--dark-mode--${item}`] = darkValue;
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
      Object.keys(colorObject).forEach(function (key) {
        htmlElement.style.setProperty(key, colorObject[key]);
      });
    }
  }

  function goDark(dark, animate) {
    if (dark) {
      localStorage.setItem("dark-mode", "true");
      htmlElement.classList.add("dark-mode");
      htmlElement.classList.remove("light-mode");
      setColors(darkColors, animate);
      togglePressed = "true";
    } else {
      localStorage.setItem("dark-mode", "false");
      htmlElement.classList.add("light-mode");
      htmlElement.classList.remove("dark-mode");
      setColors(lightColors, animate);
      togglePressed = "false";
    }

    if (typeof toggleEl !== "undefined") {
      toggleEl.forEach(function (element) {
        element.setAttribute("aria-pressed", togglePressed);
      });
    }
  }

  function checkPreference(e) {
    goDark(e.matches, false);
  }

  const colorPreference = window.matchMedia("(prefers-color-scheme: dark)");
  colorPreference.addEventListener("change", (e) => {
    checkPreference(e);
  });

  let storagePreference = localStorage.getItem("dark-mode");
  if (storagePreference !== null) {
    storagePreference === "true" ? goDark(true, false) : goDark(false, false);
  } else {
    checkPreference(colorPreference);
  }

  toggleEl = document.querySelectorAll("[color-toggle]");
  toggleEl.forEach(function (element) {
    element.setAttribute("aria-label", "View Dark Mode");
    element.setAttribute("role", "button");
    element.setAttribute("aria-pressed", togglePressed);
    element.addEventListener("click", function () {
      let darkClass = htmlElement.classList.contains("dark-mode");
      darkClass ? goDark(false, true) : goDark(true, true);
    });
  });
}

// Function to reset and reinitialize after each page transition
function resetPageFeatures(data) {
  resetWebflow(data); // Reset Webflow interactions (as in your script)
  colorModeToggle();  // Reinitialize dark mode toggle
}

// Barba.js hooks and initialization
barba.hooks.after((data) => {
  gsap.set(data.next.container, { position: "relative" });
  $(window).scrollTop(0);
  resetPageFeatures(data);
  console.log("Barba.js: after hook triggered");
});

barba.init({
  preventRunning: true,
  transitions: [
    {
      sync: true,
      enter(data) {
        let tl = gsap.timeline({
          defaults: { duration: 0.5, ease: "power2.out" },
        });
        tl.to(data.current.container, { opacity: 0, scale: 0.9 });
        tl.from(data.next.container, { y: "100vh" }, "<");
        return tl;
      },
    },
  ],
});
