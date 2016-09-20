document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('form').addEventListener('submit', function(e){
    let query = {};
    query["title"] = e.target.title.value;
    query["performer"] = e.target.performer.value;
    query["composer"] = e.target.composer.value;
    query["publisher"] = e.target.publisher.value;
    query["id"] = e.target.id.value;

    let ascap = parseAscapUrl(query);
    let bmi = parseBmiUrl(query);

    // chrome.tabs.create(tab.id, {url: action_url}, function(tab));
    chrome.tabs.create({url: ascap});
    chrome.tabs.create({url: bmi});
    // chrome.tabs.create({url: 'http://www.uber.com'});
  });
});

function parseAscapUrl(query) {
  let ascap = "https://mobile.ascap.com/aceclient/AceWeb/#ace/search";
  let termsCount = 0;
  if (query.id) {
    ascap += ("/workID/" + query.id);
    return ascap;
  } else {
    if (query.title) {
      ascap += ("/title/" + subSpaces(query.title));
      termsCount += 1;
    }

    let remainingTerms = [{
      label: "/performer/",
      value: query.performer
    },
    {
      label: "/writer/",
      value: query.composer
    },
    {
      label: "/publisher/",
      value: query.publisher
    }];

    remainingTerms.forEach((term) => {
      if (termsCount < 2 && term.value) {
        ascap += (term.label + subSpaces(term.value));
        termsCount += 1;
      }
    });

    return ascap;
  }
}

// shorten labels?
function parseBmiUrl(query) {
debugger

  let bmi = "http://repertoire.bmi.com";

  let searchTerms = [{
    label: "/Title.asp?blnWriter=true&blnPublisher=true&blnArtist=true&querytype=WorkID&keyid=",
    value: query.id
  },
  {
    label: "/TitleSearch.asp?querytype=WorkName&page=1&fromrow=1&torow=25&blnWriter=True&blnPublisher=True&blnArtist=False&blnAltTitles=False&keyname=",
    value: query.title
  },
  {
    label: "/artistSearch.asp?blnWriter=True&blnPublisher=True&blnArtist=True&blnAltTitles=True&queryType=ArtistName&page=1&keyid=0&fromrow=1&torow=25&keyname=",
    value: query.performer
  },
  {
    label: "/writer.asp?page=1&blnWriter=True&blnPublisher=True&blnArtist=True&fromrow=1&torow=25&affiliation=PRS&cae=544476240&keyID=1143988&querytype=WriterID&keyname=",
    value: query.composer
  },
  {
    label: "/pubSearch.asp?blnWriter=True&blnPublisher=True&blnArtist=True&blnAltTitles=True&queryType=PubName&page=1&keyid=0&fromrow=1&torow=25&keyname=",
    value: query.publisher
  }];

  searchTerms.forEach((term) => {
    if (term.value && bmi === "http://repertoire.bmi.com") {
      bmi += (term.label + subSpaces(term.value));
    }
  });
  return bmi;
}

function subSpaces(string) {
  let result = "";
  for (let i = 0; i<string.length; i++) {
    result += (string[i] === " ") ? "%20" : string[i];
  }
  return result;
}


// function getCurrentTabUrl(callback) {
//   // Query filter to be passed to chrome.tabs.query - see
//   // https://developer.chrome.com/extensions/tabs#method-query
//   var queryInfo = {
//     active: true,
//     currentWindow: true
//   };
//
//   chrome.tabs.query(queryInfo, function(tabs) {
//     // chrome.tabs.query invokes the callback with a list of tabs that match the
//     // query. When the popup is opened, there is certainly a window and at least
//     // one tab, so we can safely assume that |tabs| is a non-empty array.
//     // A window can only have one active tab at a time, so the array consists of
//     // exactly one tab.
//     var tab = tabs[0];
//
//     // A tab is a plain object that provides information about the tab.
//     // See https://developer.chrome.com/extensions/tabs#type-Tab
//     var url = tab.url;
//
//     // tab.url is only available if the "activeTab" permission is declared.
//     // If you want to see the URL of other tabs (e.g. after removing active:true
//     // from |queryInfo|), then the "tabs" permission is required to see their
//     // "url" properties.
//     console.assert(typeof url == 'string', 'tab.url should be a string');
//
//     callback(url);
//   });
//
//   // Most methods of the Chrome extension APIs are asynchronous. This means that
//   // you CANNOT do something like this:
//   //
//   // var url;
//   // chrome.tabs.query(queryInfo, function(tabs) {
//   //   url = tabs[0].url;
//   // });
//   // alert(url); // Shows "undefined", because chrome.tabs.query is async.
// }
//
// /**
//  * @param {string} searchTerm - Search term for Google Image search.
//  * @param {function(string,number,number)} callback - Called when an image has
//  *   been found. The callback gets the URL, width and height of the image.
//  * @param {function(string)} errorCallback - Called when the image is not found.
//  *   The callback gets a string that describes the failure reason.
//  */
// function getImageUrl(searchTerm, callback, errorCallback) {
//   // Google image search - 100 searches per day.
//   // https://developers.google.com/image-search/
//   var searchUrl = 'https://ajax.googleapis.com/ajax/services/search/images' +
//     '?v=1.0&q=' + encodeURIComponent(searchTerm);
//   var x = new XMLHttpRequest();
//   x.open('GET', searchUrl);
//   // The Google image search API responds with JSON, so let Chrome parse it.
//   x.responseType = 'json';
//   x.onload = function() {
//     // Parse and process the response from Google Image Search.
//     var response = x.response;
//     if (!response || !response.responseData || !response.responseData.results ||
//         response.responseData.results.length === 0) {
//       errorCallback('No response from Google Image search!');
//       return;
//     }
//     var firstResult = response.responseData.results[0];
//     // Take the thumbnail instead of the full image to get an approximately
//     // consistent image size.
//     var imageUrl = firstResult.tbUrl;
//     var width = parseInt(firstResult.tbWidth);
//     var height = parseInt(firstResult.tbHeight);
//     console.assert(
//         typeof imageUrl == 'string' && !isNaN(width) && !isNaN(height),
//         'Unexpected respose from the Google Image Search API!');
//     callback(imageUrl, width, height);
//   };
//   x.onerror = function() {
//     errorCallback('Network error.');
//   };
//   x.send();
// }
//
// function renderStatus(statusText) {
//   document.getElementById('status').textContent = statusText;
// }
//
// document.addEventListener('DOMContentLoaded', function() {
//   getCurrentTabUrl(function(url) {
//     // Put the image URL in Google search.
//     renderStatus('Performing Google Image search for ' + url);
//
//     getImageUrl(url, function(imageUrl, width, height) {
//
//       renderStatus('Search term: ' + url + '\n' +
//           'Google image search result: ' + imageUrl);
//       var imageResult = document.getElementById('image-result');
//       // Explicitly set the width/height to minimize the number of reflows. For
//       // a single image, this does not matter, but if you're going to embed
//       // multiple external images in your page, then the absence of width/height
//       // attributes causes the popup to resize multiple times.
//       imageResult.width = width;
//       imageResult.height = height;
//       imageResult.src = imageUrl;
//       imageResult.hidden = false;
//
//     }, function(errorMessage) {
//       renderStatus('Cannot display image. ' + errorMessage);
//     });
//   });
// });
