const STORAGE_KEY = '0';
const storageKey = localStorage.getItem('storageKey');
if (storageKey !== STORAGE_KEY) {
  localStorage.clear();
  localStorage.setItem('storageKey', STORAGE_KEY);
}
