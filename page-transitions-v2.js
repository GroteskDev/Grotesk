// page-transitions.js
function resetWebflow(data) {
  let dom = $(new DOMParser().parseFromString(data.next.html, "text/html")).find("html");
  
  // Reset Webflow interactions
  $("html").attr("data-wf-page", dom.attr("data-wf-page"));
  window.Webflow && window.Webflow.destroy();
  window.Webflow && window.Webflow.ready();
  window.Webflow && window.Webflow.require("ix2").init();

  // Reset current class
  $(".w--current").removeClass("w--current");
  $("a").each(function () {
    if ($(this).attr("href") === window.location.pathname) {
      $(this).addClass("w--current");
    }
  });

  // Reinitialize dark mode
  if (typeof colorModeToggle === "function") {
    colorModeToggle(); // Ensure dark mode is re-initialized
  }
}

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
      }
    }
  ]
});

barba.hooks.after((data) => {
  gsap.set(data.next.container, { position: "relative" });
  resetWebflow(data);
});
