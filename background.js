var btnClicked = false;
chrome.browserAction.onClicked.addListener(buttonClicked);
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type == "callAPI") {
    getIMDBRating(request.text).then(function(response) {
      data = JSON.parse(response);
      if (!data.Error) {
        data.type = 'ratingResponse'
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, data)
        });
      } else {
        console.log('No movie Found');
      }
    });
    return true;
  }
});

function buttonClicked(tab) {
  btnClicked = !btnClicked;
  var msg = {
    type: 'clickResponse',
    buttonClicked: btnClicked
  }
  chrome.tabs.sendMessage(tab.id, msg);
};

function getIMDBRating(text) {
  return new Promise(function(resolve, reject) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
       return resolve(this.responseText);
      }
    };
    var urlParam = text.split(" ").join('+');
    xhttp.open("GET", _imdb_api_url + urlParam + _imdb_apikey, true);
    xhttp.send();
  });
}

/* To load context menu */

function resetContextOptions ()
{
  chrome.contextMenus.removeAll(function() {
    var id = chrome.contextMenus.create({
      contexts: [ "selection" ],
      onclick: handleSelect,
      title: "Search IMDb: '%s'",
    }); 
  });
};

function handleSelect(info, tab)
{
  chrome.tabs.create( {
    url : _imdb_web_url + info.selectionText,
    selected : true,
    index : tab.index + 1
  } );
}

resetContextOptions();
