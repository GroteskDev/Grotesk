// Dark mode
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
  
    let colorModeDuration = parseFloat(scriptTag.getAttribute("duration") || 0.5);
    let colorModeEase = scriptTag.getAttribute("ease") || "power1.out";
  
    const cssVariables = scriptTag.getAttribute("color-vars");
    let lightColors = {};
    let darkColors = {};
    cssVariables.split(",").forEach(function (item) {
      let lightValue = computed.getPropertyValue(`--light-mode--${item}`);
      let darkValue = computed.getPropertyValue(`--dark-mode--${item}`) || lightValue;
      if (lightValue.length) {
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
      localStorage.setItem("dark-mode", dark);
      htmlElement.classList.toggle("dark-mode", dark);
      htmlElement.classList.toggle("light-mode", !dark);
      setColors(dark ? darkColors : lightColors, animate);
      togglePressed = dark ? "true" : "false";
      
      if (toggleEl) {
        toggleEl.forEach(function (element) {
          element.setAttribute("aria-pressed", togglePressed);
        });
      }
    }
  
    function applyDarkMode() {
      let storagePreference = localStorage.getItem("dark-mode");
      if (storagePreference !== null) {
        goDark(storagePreference === "true", false);
      } else {
        const colorPreference = window.matchMedia("(prefers-color-scheme: dark)");
        goDark(colorPreference.matches, false);
      }
    }
  
    function setupToggle() {
      toggleEl = document.querySelectorAll("[color-toggle]");
      toggleEl.forEach(function (element) {
        element.setAttribute("aria-label", "View Dark Mode");
        element.setAttribute("role", "button");
        element.setAttribute("aria-pressed", togglePressed);
        
        element.addEventListener("click", function () {
          let darkClass = htmlElement.classList.contains("dark-mode");
          goDark(!darkClass, true);
        });
      });
    }
  
    // Initialize dark mode and toggle
    applyDarkMode();
    setupToggle();
  }
  
  colorModeToggle(); // Initial call
  
  // Reset Webflow and apply dark mode after page transition
  function resetWebflow(data) {
    let dom = $(
      new DOMParser().parseFromString(data.next.html, "text/html")
    ).find("html");
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
  
  // Barba.js initialization
  barba.hooks.enter((data) => {
    gsap.set(data.next.container, { position: "fixed", top: 0, left: 0, width: "100%" });
  });
  
  barba.hooks.after((data) => {
    gsap.set(data.next.container, { position: "relative" });
    $(window).scrollTop(0);
    resetWebflow(data);
    colorModeToggle(); // Call to reapply dark mode settings
  });
  
  barba.init({
    preventRunning: true,
    transitions: [
      {
        sync: true,
        enter(data) {
          let tl = gsap.timeline({ defaults: { duration: 0.5, ease: "power2.out" } });
          tl.to(data.current.container, { opacity: 0, scale: 0.9 });
          tl.from(data.next.container, { y: "100vh" }, "<");
          return tl;
        },
      },
    ],
  });
