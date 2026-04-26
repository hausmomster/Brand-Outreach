const AUTH_KEY = 'hm_auth';
const PASSWORD_HASH = 'df58708491722510465a8328c453095966118759e8c785681b7d812cca8e5f06';

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function isAuthenticated() {
  return sessionStorage.getItem(AUTH_KEY) === '1';
}

function requireAuth() {
  if (!isAuthenticated()) {
    window.location.replace('login.html');
  }
}

function logout() {
  sessionStorage.removeItem(AUTH_KEY);
  window.location.replace('login.html');
}

async function attemptLogin(password, onError) {
  const hash = await sha256(password);
  if (hash === PASSWORD_HASH) {
    sessionStorage.setItem(AUTH_KEY, '1');
    const dest = new URLSearchParams(window.location.search).get('next') || 'index.html';
    window.location.replace(dest);
  } else {
    onError();
  }
}
