const otherOrgs = ['sesac', 'bmi'];
const bmi = "http://repertoire.bmi.com/startpage.asp";
const sesac = "https://www.sesac.com/Repertory/RepertorySearch.aspx";

const ascap = {
  title : "https://mobile.ascap.com/aceclient/AceWeb/#ace/search/title/",
  artist : "https://mobile.ascap.com/aceclient/AceWeb/#ace/search/performer/",
  publisher : "https://mobile.ascap.com/aceclient/AceWeb/#ace/search/publisher/",
  writer : "https://mobile.ascap.com/aceclient/AceWeb/#ace/search/writer/",
  titleid : "https://mobile.ascap.com/aceclient/AceWeb/#ace/search/workID/",
  workiswc : "https://mobile.ascap.com/aceclient/AceWeb/#ace/search/iswc/"
};

const sesacFormActions = {
  title : "SongSearch.aspx",
  artist : "ArtistSearch.aspx",
  publisher : "PublisherSearch.aspx",
  writer : "WriterSearch.aspx",
  titleid : "SongSearch.aspx",
};

const sesacFormLabels = {
  title : "Song",
  artist : "Artist",
  publisher : "Publisher",
  writer : "Writer",
  titleid : "SESAC Work Number",
};

const stringToObj = {
  "bmi" : bmi,
  "sesac" : sesac
};


document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('select').addEventListener('change', function(e) {
    let iswcOption = e.target.children[6];
    let sesacBox = document.querySelector('input[value="sesac"]');
    if (iswcOption.selected) {
      sesacBox.checked = false;
      sesacBox.setAttribute("disabled", "disabled");
    } else {
      sesacBox.removeAttribute("disabled");
    }
  });

  document.querySelector('form').addEventListener('submit', function(e){
    e.preventDefault();

    let search = {};

    search["type"] = e.target.select.value;
    search["query"] = e.target.query.value;

    let errorConditions = {
      "emptySelect" : () => (search.type === ""),
      "emptyQuery" : () => (search.query === "")
    };

    let errorMessages = {
      "emptySelect" : "Search type must be selected.",
      "emptyQuery" : "Search field can't be empty."
    };

    let errors = false;

    ["emptySelect", "emptyQuery"].forEach((condition) => {
      let element = document.querySelector(`.${condition}`);
      if (errorConditions[condition]()) {
        element.innerHTML = errorMessages[condition];
        errors = true;
      } else {
        element.innerHTML = "";
      }  
    });

    if (errors) return;

    var active = true;

    if (e.target.ascap.checked) {
      let activeAscap = active;
      active = false;

      let address = ascap[search.type] + subSpaces(search.query);

      chrome.tabs.create({url: address, active: activeAscap});
    }

    if (e.target.bmi.checked) {
      let activeBmi = active;
      active = false;
      chrome.tabs.create({url: bmi, active: activeBmi}, function(tab1) {
        chrome.tabs.executeScript(tab1.id, {code: `
          document.querySelectorAll('option[selected]')[0].removeAttribute('selected');
          document.querySelectorAll('option[value="` + search.type + `"]')[0].setAttribute('selected', '');
          document.querySelector(".main-search").value ="` + lastNameFirst(search.query, search.type) + `";
          document.querySelector('#Form1').submit();
        `, runAt: "document_end"});
      });
    }

    if (e.target.sesac.checked) {
      let activeSesac = active;
      active = false;
      chrome.tabs.create({url: sesac, active: activeSesac}, function(tab2) {
        chrome.tabs.executeScript(tab2.id, {code: `
          document.querySelector('input[value="` + sesacFormLabels[search.type] + `"]').checked = "checked";
          document.querySelector('form[name="CatalogSearchForm"]').action="` + sesacFormActions[search.type] + `"
          document.querySelector('#SearchString').value="` + search.query + `";
          document.querySelector('form[name="CatalogSearchForm"]').submit();
          `, runAt: "document_end"
        });
      });
    }
  });
});

function lastNameFirst(query, type) {
  if (type === "writer") {
    let arr = query.split(' ');
    arr.unshift(arr.pop());
    query = arr.join(' ');
  }
  return query;
}

function subSpaces(string) {
  let result = "";
  for (let i = 0; i<string.length; i++) {
    result += (string[i] === " ") ? "%20" : string[i];
  }
  return result;
}
