var metadata = [];

// function for requesting and processing JSON data
function loadJSON(path, func) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', path, true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      func(xobj.responseText);
    }
  };
  xobj.send(null);
}

// function for creating element nodes
function createNode(tag,id=null,className=null,type=null) {
  let elem = document.createElement(tag);
  if(id!==null){
    elem.setAttribute('id',id);
  }
  if (type!==null){
    elem.setAttribute('type',type);
  }
  if (className!==null) {
    elem.className=className;
  }
  return elem;
}

// function to add given newNode after referenceNode
function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

// initialize content and create display
function init() {
 loadJSON("assets/data/content.json", function(response) {
  metadata = JSON.parse(response);
  display(metadata)
 });
}

// create display by filling grid with metadata
function display(content) {
  let grid = document.getElementById('oer');
  grid.innerHTML = ""; // ensure empty grid
  for (i=0; i < content.length; i++) {
      addContent(grid, content[i]);
  }
}

// function for adding content to given grid
function addContent(grid,oer) {
  let li = createNode('li');
  li.id = oer.id;
  let figure = createNode('figure');
  let img = createNode('img');
  img.src = oer.image;
  figure.appendChild(img);
  li.appendChild(figure);
  li.onclick = function() {handleMetadata(this);};
  grid.appendChild(li);
}

// function for adding metadata of item to grid
function handleMetadata(item) {
    if (document.contains(document.getElementById("metadata"))) {
      if (item.nextSibling !== null) {
        if (item.nextSibling.hasAttribute("id")) {
          if (item.nextSibling.id == "metadata") {
            item.firstChild.firstChild.removeAttribute("style");
            item.nextSibling.remove();
            return
        }
      }
    }
    // let prev = document.getElementById("metadata");
    // prev.previousSibling.firstChild.firstChild.removeAttribute("style");
    // prev.remove();
  }
  let li = createNode('li');
  li.id = "metadata";
  let details = metadata.filter(resource => resource.id.includes(item.id));
  // hier die Informationen eintragen
  let author = createNode("p");
  author.innerHTML = details[0].author;
  author.setAttribute("style", "font-weight:bold;");
  li.appendChild(author);
  let title = createNode("p");
  title.innerHTML = details[0].title;
  li.appendChild(title);
  let institution = createNode("p");
  institution.innerHTML = details[0].institution;
  institution.setAttribute("style", "font-style:italic;");
  li.appendChild(institution);
  let date = createNode("p");
  date.innerHTML = details[0].date;
  li.appendChild(date);
  let url = createNode("a");
  url.id = "metadata-url";
  url.title = "Link zur Online-Ressource";
  url.href = details[0].url;
  url.target = "_blank";
  li.appendChild(url);
  insertAfter(item, li);
  item.firstChild.firstChild.setAttribute("style", "opacity: 0.75;");
}

// filter content by user selected facets
function facet() {
  var selection = [];
  // institution
  var inst_checked = false;
  var tud = document.getElementById("inst_tud").checked
  var slub = document.getElementById("inst_slub").checked
  if (slub) {
    selection.push.apply(selection, metadata.filter(resource => resource.institution.includes('SLUB')));
    inst_checked = true;
  }
  if (tud) {
    selection.push.apply(selection, metadata.filter(resource => resource.institution.includes('TUD')));
    inst_checked = true;
  }
  if (!inst_checked) {
    selection.push.apply(selection, metadata);
  }
  // media type
  var medium = [];
  var medium_checked = false;
  var audio = document.getElementById("medium_audio").checked
  var blog = document.getElementById("medium_blog").checked
  var course = document.getElementById("medium_course").checked
  var presentation = document.getElementById("medium_presentation").checked
  var text = document.getElementById("medium_text").checked
  var video = document.getElementById("medium_video").checked
  if (audio) {
    medium.push.apply(medium, selection.filter(resource => resource.media.indexOf("Audio") > -1));
    medium_checked = true;
  }
  if (blog) {
    medium.push.apply(medium, selection.filter(resource => resource.media.indexOf("Blog") > -1));
    medium_checked = true;
  }
  if (course) {
    medium.push.apply(medium, selection.filter(resource => resource.media.indexOf("Online-Kurs") > -1));
    medium_checked = true;
  }
  if (text) {
    medium.push.apply(medium, selection.filter(resource => resource.media.indexOf("Text") > -1));
    medium_checked = true;
  }
  if (presentation) {
    medium.push.apply(medium, selection.filter(resource => resource.media.indexOf("Präsentation") > -1));
    medium_checked = true;
  }
  if (video) {
    medium.push.apply(medium, selection.filter(resource => resource.media.indexOf("Video") > -1));
    medium_checked = true;
  }
  if (medium_checked) {
    selection = medium;
  }
  // subject
  var subject = [];
  var subject_checked = false;
  var education = document.getElementById("subject_education").checked;
  var german = document.getElementById("subject_german").checked;
  var politics = document.getElementById("subject_politics").checked;
  var oer_methods = document.getElementById("subject_oer_methods").checked;
  var sci_methods = document.getElementById("subject_sci_methods").checked;
  if (education) {
    subject.push.apply(subject, selection.filter(resource => resource.subject.includes('Erziehungswissenschaft')));
    subject_checked = true;
  }
  if (german) {
    subject.push.apply(subject, selection.filter(resource => resource.subject.includes('Germanistik')));
    subject_checked = true;
  }
  if (politics) {
    subject.push.apply(subject, selection.filter(resource => resource.subject.includes('Politikwissenschaft')));
    subject_checked = true;
  }
  if (oer_methods) {
    subject.push.apply(subject, selection.filter(resource => resource.subject.includes('OER-Methodik')));
    subject_checked = true;
  }
  if (sci_methods) {
    subject.push.apply(subject, selection.filter(resource => resource.subject.includes('Wissenschaftliches Arbeiten')));
    subject_checked = true;
  }
  if (subject_checked) {
    selection = subject;
  }
  // plattform
  var plattform = [];
  var plattform_checked = false;
  var opal = document.getElementById("plattform_opal").checked;
  var youtube = document.getElementById("plattform_youtube").checked;
  var spotify = document.getElementById("plattform_spotify").checked;
  var website = document.getElementById("plattform_website").checked;
  if (youtube) {
    plattform.push.apply(plattform, selection.filter(resource => resource.plattform.includes('YouTube')));
    plattform_checked = true;
  }
  if (opal) {
    plattform.push.apply(plattform, selection.filter(resource => resource.plattform.includes('OPAL')));
    plattform_checked = true;
  }
  if (spotify) {
    plattform.push.apply(plattform, selection.filter(resource => resource.plattform.includes('Spotify')));
    plattform_checked = true;
  }
  if (website) {
    plattform.push.apply(plattform, selection.filter(resource => resource.plattform.includes('Website')));
    plattform_checked = true;
  }
  if (plattform_checked) {
    selection = plattform;
  }
  display(selection);
}
