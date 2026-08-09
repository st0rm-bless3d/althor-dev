(function () {
  "use strict";

  var script = document.currentScript;
  var experiment = script && script.dataset.experiment;
  if (!experiment) return;

  var endpoint = "https://a11yscan.althor.dev/api/pageview";
  var explicitTest = new URLSearchParams(location.search).get("rl_test") === "1";
  var allowedSources = ["github", "organic-search", "portfolio-index", "direct", "external-referral"];
  var querySource = new URLSearchParams(location.search).get("src");
  var source = allowedSources.indexOf(querySource) >= 0 ? querySource : "direct";
  if (!querySource && document.referrer) {
    try {
      var host = new URL(document.referrer).hostname;
      if (/github\.com$/.test(host)) source = "github";
      else if (/google\.|bing\.|duckduckgo\./.test(host)) source = "organic-search";
      else if (host === location.hostname) source = "portfolio-index";
      else source = "external-referral";
    } catch (_) { source = "direct"; }
  }

  var sessionKey = "rl-session-" + experiment;
  var sessionId = sessionStorage.getItem(sessionKey);
  if (!sessionId) {
    sessionId = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random());
    sessionStorage.setItem(sessionKey, sessionId);
  }

  function send(kind) {
    var payload = JSON.stringify({
      sid: sessionId,
      path: "/" + kind + "/" + experiment + "/" + source,
      referrer: document.referrer || "",
      wd: navigator.webdriver === true || explicitTest
    });
    fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      credentials: "omit",
      keepalive: true,
      headers: { "Content-Type": "text/plain" },
      body: payload
    }).catch(function () {});
  }

  setTimeout(function () { send("exposure"); }, 1500);
  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-purchase-intent]");
    if (!button || button.disabled) return;
    send("intent");
    button.textContent = "Interest click complete — no payment taken";
    button.disabled = true;
  });
})();
