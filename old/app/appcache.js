var cache = window.applicationCache;

if (cache != undefined) {
  cache.addEventListener("cached", function () {
      log.debug("All resources for this web app have now been downloaded. You can run this application while not connected to the internet");
  }, false);
  cache.addEventListener("checking", function () {
      log.debug("Checking manifest");
  }, false);
  cache.addEventListener("downloading", function () {
      log.debug("Starting download of cached files");
  }, false);
  cache.addEventListener("error", function (e) {
      log.debug("There was an error in the manifest, downloading cached files or you're offline: " + e);
  }, false);
  cache.addEventListener("noupdate", function () {
      log.debug("There was no update needed");
  }, false);
  cache.addEventListener("progress", function () {
      log.trace("Downloading cached files");
  }, false);
  cache.addEventListener("updateready", function () {
      cache.swapCache();
      log.info("Updated cache is ready, reloading");
      // Even after swapping the cache the currently loaded page won't use it
      // until it is reloaded, so force a reload so it is current.
      window.location.reload(true);
  }, false);
}