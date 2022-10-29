const getUrlsFromFull = (url) => {
  const fullURL = url.replace('https://', '');
  const rootURL = `${fullURL.split('/')[0]}/`;
  return [fullURL, rootURL];
};

function runJS(url) {
  chrome.storage.sync.get(url, function (items) {
    const fnString = items[url];
    console.log(`[Injection JS - ${url}]\n ${fnString}`);
    if (!!fnString && fnString !== '') Function(fnString)();
  });
}

const [fullURL, rootURL] = getUrlsFromFull(document.baseURI);
runJS(fullURL);
if (fullURL !== rootURL) runJS(rootURL);
