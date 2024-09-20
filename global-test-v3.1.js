// dark mode
function colorModeToggle() {
    function attr(defaultVal, attrVal) {
      const defaultValType = typeof defaultVal;
      if (typeof attrVal !== "string" || attrVal.trim() === "") return defaultVal;
      if (attrVal === "true" && defaultValType === "boolean") return true;
      if (attrVal === "false" && defaultValType === "boolean") return false;
      if (isNaN(attrVal) && defaultValType === "string") return attrVal;
      if (!isNaN(attrVal) && defaultValType === "number") return +attrVal;
      return defaultVal;
    }
  
    const htmlElement = document.documentElement;
    const computed = getComputedStyle(htmlElement);
    let toggleEl;
    let togglePressed = "false";
  
    const scriptTag = document.querySelector("[color-vars]");
    if (!scriptTag) {
      console.warn("Script tag with color-vars attribute not found");
      return;
    }
  
    let colorModeDuration = attr(0.5, scriptTag.getAttribute("duration"));
    let colorModeEase = attr("power1.out", scriptTag.getAttribute("ease"));
  
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
        darkColors[`--light-mode--${item}`] = darkValue;
      }
    });
  
    if (!Object.keys(lightColors).length) {
      console.warn("No variables found matching color-vars attribute value");
      return;
    }
  
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
        console.log("dark mode applied")
      } else {
        localStorage.setItem("dark-mode", "false");
        htmlElement.classList.add("light-mode");
        htmlElement.classList.remove("dark-mode");
        setColors(lightColors, animate);
        togglePressed = "false";
        console.log("light mode applied")
      }
      if (typeof toggleEl !== "undefined") {
        toggleEl.forEach(function (element) {
          element.setAttribute("aria-pressed", togglePressed);
          console.log("undefined")
        });
      }
    }
  
    function checkPreference(e) {
      goDark(e.matches, false);
      console.log('prefs checked')
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
  
    window.addEventListener("DOMContentLoaded", (event) => {
      toggleEl = document.querySelectorAll("[color-toggle]");
      toggleEl.forEach(function (element) {
        element.setAttribute("aria-label", "View Dark Mode");
        element.setAttribute("role", "button");
        element.setAttribute("aria-pressed", togglePressed);
      });
      toggleEl.forEach(function (element) {
        element.addEventListener("click", function () {
          let darkClass = htmlElement.classList.contains("dark-mode");
          darkClass ? goDark(false, true) : goDark(true, true);
        });
      });
    });
  }
  
  colorModeToggle();
  
  // reset webflow
  function resetWebflow(data) {
    let dom = $(
      new DOMParser().parseFromString(data.next.html, "text/html")
    ).find("html");
    // reset webflow interactions
    $("html").attr("data-wf-page", dom.attr("data-wf-page"));
    window.Webflow && window.Webflow.destroy();
    window.Webflow && window.Webflow.ready();
    window.Webflow && window.Webflow.require("ix2").init();
    // reset w--current class
    $(".w--current").removeClass("w--current");
    $("a").each(function () {
      if ($(this).attr("href") === window.location.pathname) {
        $(this).addClass("w--current");
      }
    });
    // reset scripts
    dom.find("[data-barba-script]").each(function () {
      let codeString = $(this).text();
      if (codeString.includes("DOMContentLoaded")) {
        let newCodeString = codeString.replace(
          /window\.addEventListener\("DOMContentLoaded",\s*\(\s*event\s*\)\s*=>\s*{\s*/,
          ""
        );
        codeString = newCodeString.replace(/\s*}\s*\);\s*$/, "");
      }
      let script = document.createElement("script");
      script.type = "text/javascript";
      if ($(this).attr("src")) script.src = $(this).attr("src");
      script.text = codeString;
      document.body.appendChild(script).remove();
    });
  }
  
  // barba.js init
  barba.hooks.enter((data) => {
    gsap.set(data.next.container, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
    });
  });
  barba.hooks.after((data) => {
    gsap.set(data.next.container, { position: "relative" });
    $(window).scrollTop(0);
    resetWebflow(data);
    console.log("after hook has run");
    colorModeToggle();
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
          console.log("transition enter has run");
          return tl;
        },
      },
    ],
  });
