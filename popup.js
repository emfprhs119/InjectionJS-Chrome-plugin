const getUrlsFromFull = (url) => {
  const fullURL = url.replace('https://', '');
  const rootURL = `${fullURL.split('/')[0]}/`;
  const isEqURL = fullURL === rootURL;
  return [fullURL, rootURL, isEqURL];
};

const loadCodeMirror = (id) => {
  const editor = CodeMirror.fromTextArea(document.getElementById(id), {
    mode: 'javascript',
    lineNumbers: true,
    lineWrapping: true,
    theme: 'monokai',
  });
  editor.setSize(700, 170);
  return editor;
};

var editor = [];

const initEditor = (type, url) => {
  editor[type] = loadCodeMirror(`${type}Textarea`);
  document.getElementById(`${type}Url`).innerText = `[${url}]`;
  chrome.storage.sync.get([url], function (items) {
    editor[type].setValue(items[url]);
  });
};

chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
  const [fullURL, rootURL, isEqURL] = getUrlsFromFull(tabs[0].url);
  initEditor('root', rootURL);
  if (isEqURL) {
    document.getElementById('fullUrl').hidden = true;
    document.getElementById('fullTextarea').hidden = true;
  } else {
    initEditor('full', fullURL);
  }
});

document.getElementById('saveButton').onclick = function () {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    const [fullURL, rootURL, isEqURL] = getUrlsFromFull(tabs[0].url);
    var jsonfile = {};
    jsonfile[rootURL] = editor['root'].getValue();
    if (!isEqURL) jsonfile[fullURL] = editor['full'].getValue();
    chrome.storage.sync.set(jsonfile, function () {
      document.getElementById('reloadButton').classList.remove('hidden');
    });
  });
};

document.getElementById('reloadButton').onclick = function refresh() {
  chrome.tabs.reload();
  document.getElementById('reloadButton').classList.add('hidden');
};
