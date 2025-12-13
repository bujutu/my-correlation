const STORAGE_KEY = "myCorrelationData";

function loadData() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
    meta: {},
    records: []
  };
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
