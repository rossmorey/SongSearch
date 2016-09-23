## Song Search

### Background

If you've worked in the music industry, you know ASCAP, BMI, and SESAC -- these are the three major performance-rights organizations.  They manage huge databases of compositions, song-writers, and publishers.  If you're doing composition research -- "Who is Adele's publisher?" or "What percentage of 'I Choose You' does Sara Bareilles own?' -- you have to look in three separate places.  Why not search all of these sites at the same time?  Enter Song Search.

Inside of the Song Search Chrome extension, users can search by title, composer, publisher, artist, catalog id, and IWRC number. Song Search launches new tabs and that target the appropriate search results on ASCAP and BMI (implementation for SESAC is bonus, see below)

### Functionality & MVP

In this Chrome Extension search tool, users will be able to:

- [ ] Open the Chrome Extension popup.
- [ ] Fill in search params for the following: performer, writer, publisher, title, id
- [ ] Submit their search, launching new Chrome tabs -- one for BMI and one for ASCAP.

In addition, the extension will:
- [ ] Navigate directly to a search result page, placing the user's query in the params of the new tab URL.

### Wireframes

Song Search will have a single HTML form layout.  It will include fields for:
  - Title
  - Performer
  - Publisher
  - Writer
  - ID

![wireframe](http://res.cloudinary.com/dhorsi7vf/image/upload/v1474250434/SongSearch_knxhfr.png)

### Architecture and Technologies

Song Search will be built using the standard format for a Chrome Extension -- it will be written using Javascript, HTML, and CSS.

In addition to a `manifest.json` file, the extension will include:

-`popup.html` - this file will include the HTML for the form that appears when you click the Song Search Extension icon.

-`popup.js` - this file includes the click handler that listens for form submit when a user initiates a new search.  This file will also contain the logic for constructing the new URLs and launching their new tabs.

The primary technical challenges will be:

- Engineering the logic for building the new URLs that point to the appropriate search results on different rights org's sites.


### Implementation Timeline

**Day 1**: Create a skeleton of the basic file structure. Goals:
  - completed `manifest.json`
  - functional `popup.html`
  - extension icon

**Day 2**: Render the popup form including submit button.  Click triggers `console.log()` from `popup.js`
  - Form includes artist, writer, publisher, title, and ID information
  - Form includes submit button.
  - On click, form submit renders message in console.

**Day 3**: Write the backend URL constructors. This includes functions like:
  - parseAscapUrl()
  - parseBmiUrl()
  - Write function that launches new tabs.

By the end of the day, I should have a roughly functional extension.

**Day 4**: Create form styling and user interface considerations.  Should look polished, professional, and interactive.
  - Style form and buttons
  - If time: tackle the bonuses (see below)

### Bonus features

I'd like to include all three major performance rights orgs, but SESAC (the smallest of the three) doesn't have a website that allows us to navigate directly to search results.  Instead, the SESAC database search form must be submitted through the site.  This means that after page load on SESAC's website, the extension will need to auto-fill and auto-submit the search form.

Features I'd like to implement:

- [ ] Back-end JS navigates directly to SESACs search site -- no custom URL.
- [ ] SESAC's search form is auto-filled and auto-submitted.
- [ ] Extension popup form includes check-boxes to search/launch only selected rights orgs
