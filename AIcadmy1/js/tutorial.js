// AIcademy Tutorial Page Integration (no UI changes)
(function () {
  const STORAGE_KEYS = {
    visits: 'aicademy_tutorial_visits',
    clicks: 'aicademy_tutorial_clicks',
    backendStatus: 'aicademy_tutor_backend_available'
  };

  function getJSON(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  }

  function setJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }

  function recordVisit() {
    const visits = getJSON(STORAGE_KEYS.visits, []);
    visits.push({ ts: Date.now(), path: location.pathname });
    setJSON(STORAGE_KEYS.visits, visits.slice(-200));
    if (window.progressTracker) {
      // Touch profile activity to keep data fresh; no UI change
      window.progressTracker.userProfile.lastActive = new Date();
      window.progressTracker.saveAllData();
    }
    console.info('[Tutorial] Visit recorded', { count: visits.length });
  }

  function bindLinkTracking() {
    const resLink = document.querySelector('a[href="resource.html"]');
    const folderLink = document.querySelector('a[href="Tutor/backend/"]');

    function track(type) {
      const clicks = getJSON(STORAGE_KEYS.clicks, []);
      clicks.push({ ts: Date.now(), type });
      setJSON(STORAGE_KEYS.clicks, clicks.slice(-200));
      console.info('[Tutorial] Click tracked', type, { count: clicks.length });
    }

    if (resLink) {
      resLink.addEventListener('click', () => track('resources'));
    }
    if (folderLink) {
      folderLink.addEventListener('click', () => track('tutor_backend_folder'));
    }
  }

  async function checkBackendAvailability() {
    try {
      const resp = await fetch('Tutor/backend/templates/index.html', { method: 'GET' });
      const ok = resp.ok;
      setJSON(STORAGE_KEYS.backendStatus, { available: ok, ts: Date.now() });
      window.tutorBackendAvailable = !!ok;
      console.info('[Tutorial] Tutor backend availability:', ok);
    } catch (e) {
      setJSON(STORAGE_KEYS.backendStatus, { available: false, ts: Date.now() });
      window.tutorBackendAvailable = false;
      console.info('[Tutorial] Tutor backend check failed');
    }
  }

  function exposeMetrics() {
    window.tutorialMetrics = {
      getVisits: () => getJSON(STORAGE_KEYS.visits, []),
      getClicks: () => getJSON(STORAGE_KEYS.clicks, []),
      getBackendStatus: () => getJSON(STORAGE_KEYS.backendStatus, { available: false })
    };
  }

  document.addEventListener('DOMContentLoaded', () => {
    recordVisit();
    bindLinkTracking();
    checkBackendAvailability();
    exposeMetrics();
  });
})();