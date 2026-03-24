// utilities for managing multi-user data in localStorage

export function getUserProfiles() {
  return JSON.parse(localStorage.getItem("userProfiles")) || { users: [], current: "" };
}

export function setUserProfiles(profiles) {
  localStorage.setItem("userProfiles", JSON.stringify(profiles));
}

export function getCurrentUser() {
  const profiles = getUserProfiles();
  return profiles.current || null;
}

export function switchUser(name) {
  const profiles = getUserProfiles();
  if (!profiles.users.includes(name)) profiles.users.push(name);
  profiles.current = name;
  setUserProfiles(profiles);
  // keep a simple profile record as well
  localStorage.setItem("userProfile", JSON.stringify({ name }));
  // notify listeners
  window.dispatchEvent(new Event('userChanged'));
}

export function createUser(name) {
  const profiles = getUserProfiles();
  if (!profiles.users.includes(name)) {
    profiles.users.push(name);
  }
  profiles.current = name;
  setUserProfiles(profiles);
  localStorage.setItem("userProfile", JSON.stringify({ name }));
}

export function getDataKey(key) {
  const user = getCurrentUser();
  return user ? `${key}_${user}` : key;
}

export function removeUserData(key, userName) {
  const target = userName ? `${key}_${userName}` : getDataKey(key);
  localStorage.removeItem(target);
}
