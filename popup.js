const getUrlsFromFull = (url) => {
  const fullURL = url.replace('https://', '');
  const rootURL = `${fullURL.split('/')[0]}/`;
  return [fullURL, rootURL];
};

chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
  const [fullURL, rootURL] = getUrlsFromFull(tabs[0].url);
  const isEqURL = fullURL === rootURL;
  document.getElementById('rootUrl').innerText = `[${rootURL}]`;
  chrome.storage.sync.get([rootURL], function (items) {
    const notes = items[rootURL] || '';
    document.getElementById('rootTextarea').value = notes;
  });
  if (isEqURL) {
    document.getElementById('fullUrl').hidden = true;
    document.getElementById('fullTextarea').hidden = true;
    return;
  }
  document.getElementById('fullUrl').innerText = `[${fullURL}]`;
  chrome.storage.sync.get([fullURL], function (items) {
    const notes = items[fullURL] || '';
    document.getElementById('fullTextarea').value = notes;
  });
});

document.getElementById('saveButton').onclick = function () {
  var rootTextarea = document.getElementById('rootTextarea').value;
  var fullTextarea = document.getElementById('fullTextarea').value;
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    const [fullURL, rootURL] = getUrlsFromFull(tabs[0].url);
    var jsonfile = {};
    jsonfile[fullURL] = fullTextarea;
    jsonfile[rootURL] = rootTextarea;
    chrome.storage.sync.set(jsonfile, function () {
      // Notes saved
      document.getElementById('reloadButton').classList.remove('hidden');
    });
  });
};

document.getElementById('reloadButton').onclick = function refresh() {
  chrome.tabs.reload();
  document.getElementById('reloadButton').classList.add('hidden');
};

var _btn = document.createElement('button');
_btn.data = _a;
_btn.innerHTML = 'click me !!';
_btn.onclick = function () {
  alert('hello, world');
};
_btn.style.color = 'red';
_btn.style.position = 'fixed';
_btn.style.right = '10px';
_btn.style.bottom = '-10px';
document.body.appendChild(_btn);
