var metadata = [];

/* global XMLHttpRequest */
// function for requesting and processing JSON data
function loadJSON (path, func) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType('application/json');
  xobj.open('GET', path, true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState === 4 && xobj.status === 200) {
      func(xobj.responseText);
    }
  };
  xobj.send(null);
}

// function for creating element nodes
function createNode (tag, id = null, className = null, type = null) {
  var elem = document.createElement(tag);
  if (id !== null) {
    elem.setAttribute('id', id);
  }
  if (type !== null) {
    elem.setAttribute('type', type);
  }
  if (className !== null) {
    elem.className = className;
  }
  return elem;
}

// function to add given newNode after referenceNode
function insertAfter (referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

// initialize content and create display
function init () {
  loadJSON('assets/data/content.json', function (response) {
    metadata = JSON.parse(response);
    display(metadata);
  });
}

// create display by filling grid with metadata
function display (content) {
  var grid = document.getElementById('oer');
  grid.innerHTML = ''; // ensure empty grid
  for (var i = 0; i < content.length; i++) {
    addContent(grid, content[i]);
  }
}

// function for adding content to given grid
function addContent (grid, oer) {
  var li = createNode('li');
  li.id = oer.id;
  var figure = createNode('figure');
  var img = createNode('img');
  img.src = oer.image;
  figure.appendChild(img);
  li.appendChild(figure);
  li.onclick = function () { handleMetadata(this); };
  grid.appendChild(li);
}

// function for adding metadata of item to grid
function handleMetadata (item) {
  if (document.contains(document.getElementById('metadata'))) {
    if (item.nextSibling !== null) {
      if (item.nextSibling.hasAttribute('id')) {
        if (item.nextSibling.id === 'metadata') {
          item.firstChild.firstChild.removeAttribute('style');
          item.nextSibling.remove();
          return;
        }
      }
    }
    // var prev = document.getElementById('metadata');
    // prev.previousSibling.firstChild.firstChild.removeAttribute('style');
    // prev.remove();
  }
  var li = createNode('li');
  li.id = 'metadata';
  var details = metadata.filter(resource => resource.id.includes(item.id));
  // hier die Informationen eintragen
  var author = createNode('p');
  author.innerHTML = details[0].author;
  author.setAttribute('style', 'font-weight:bold;');
  li.appendChild(author);
  var title = createNode('p');
  title.innerHTML = details[0].title;
  li.appendChild(title);
  var institution = createNode('p');
  institution.innerHTML = details[0].institution;
  institution.setAttribute('style', 'font-style:italic;');
  li.appendChild(institution);
  var date = createNode('p');
  date.innerHTML = details[0].date;
  li.appendChild(date);
  var url = createNode('a');
  url.id = 'metadata-url';
  url.title = 'Link zur Online-Ressource';
  url.href = details[0].url;
  url.target = '_blank';
  li.appendChild(url);
  insertAfter(item, li);
  item.firstChild.firstChild.setAttribute('style', 'opacity: 0.75;');
}

// filter content by user selected facets
function facet () {
  var selection = [];
  // institution
  var instChecked = false;
  var tud = document.getElementById('inst_tud').checked;
  var slub = document.getElementById('inst_slub').checked;
  if (slub) {
    selection.push.apply(selection, metadata.filter(resource => resource.institution.includes('SLUB')));
    instChecked = true;
  }
  if (tud) {
    selection.push.apply(selection, metadata.filter(resource => resource.institution.includes('TUD')));
    instChecked = true;
  }
  if (!instChecked) {
    selection.push.apply(selection, metadata);
  }
  // media type
  var medium = [];
  var mediumChecked = false;
  var audio = document.getElementById('medium_audio').checked;
  var blog = document.getElementById('medium_blog').checked;
  var course = document.getElementById('medium_course').checked;
  var presentation = document.getElementById('medium_presentation').checked;
  var text = document.getElementById('medium_text').checked;
  var video = document.getElementById('medium_video').checked;
  if (audio) {
    medium.push.apply(medium, selection.filter(resource => resource.media.indexOf('Audio') > -1));
    mediumChecked = true;
  }
  if (blog) {
    medium.push.apply(medium, selection.filter(resource => resource.media.indexOf('Blog') > -1));
    mediumChecked = true;
  }
  if (course) {
    medium.push.apply(medium, selection.filter(resource => resource.media.indexOf('Online-Kurs') > -1));
    mediumChecked = true;
  }
  if (text) {
    medium.push.apply(medium, selection.filter(resource => resource.media.indexOf('Text') > -1));
    mediumChecked = true;
  }
  if (presentation) {
    medium.push.apply(medium, selection.filter(resource => resource.media.indexOf('Präsentation') > -1));
    mediumChecked = true;
  }
  if (video) {
    medium.push.apply(medium, selection.filter(resource => resource.media.indexOf('Video') > -1));
    mediumChecked = true;
  }
  if (mediumChecked) {
    selection = medium;
  }
  // subject
  var subject = [];
  var subjectChecked = false;
  var education = document.getElementById('subject_education').checked;
  var german = document.getElementById('subject_german').checked;
  var politics = document.getElementById('subject_politics').checked;
  var oerMethods = document.getElementById('subject_oer_methods').checked;
  var sciMethods = document.getElementById('subject_sci_methods').checked;
  if (education) {
    subject.push.apply(subject, selection.filter(resource => resource.subject.includes('Erziehungswissenschaft')));
    subjectChecked = true;
  }
  if (german) {
    subject.push.apply(subject, selection.filter(resource => resource.subject.includes('Germanistik')));
    subjectChecked = true;
  }
  if (politics) {
    subject.push.apply(subject, selection.filter(resource => resource.subject.includes('Politikwissenschaft')));
    subjectChecked = true;
  }
  if (oerMethods) {
    subject.push.apply(subject, selection.filter(resource => resource.subject.includes('OER-Methodik')));
    subjectChecked = true;
  }
  if (sciMethods) {
    subject.push.apply(subject, selection.filter(resource => resource.subject.includes('Wissenschaftliches Arbeiten')));
    subjectChecked = true;
  }
  if (subjectChecked) {
    selection = subject;
  }
  // plattform
  var plattform = [];
  var plattformChecked = false;
  var opal = document.getElementById('plattform_opal').checked;
  var padlet = document.getElementById('plattform_padlet').checked;
  var youtube = document.getElementById('plattform_youtube').checked;
  var spotify = document.getElementById('plattform_spotify').checked;
  var website = document.getElementById('plattform_website').checked;
  if (youtube) {
    plattform.push.apply(plattform, selection.filter(resource => resource.plattform.includes('YouTube')));
    plattformChecked = true;
  }
  if (opal) {
    plattform.push.apply(plattform, selection.filter(resource => resource.plattform.includes('OPAL')));
    plattformChecked = true;
  }
  if (padlet) {
    plattform.push.apply(plattform, selection.filter(resource => resource.plattform.includes('Padlet')));
    plattformChecked = true;
  }
  if (spotify) {
    plattform.push.apply(plattform, selection.filter(resource => resource.plattform.includes('Spotify')));
    plattformChecked = true;
  }
  if (website) {
    plattform.push.apply(plattform, selection.filter(resource => resource.plattform.includes('Website')));
    plattformChecked = true;
  }
  if (plattformChecked) {
    selection = plattform;
  }
  display(selection);
}

window.init = init;
window.facet = facet;
