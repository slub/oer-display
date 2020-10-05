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
      if (typeof item.nextSibling != null) {
        if (item.nextSibling.id == "metadata") {
          item.firstChild.removeAttribute("style");
          item.firstChild.firstChild.removeAttribute("style");
          item.nextSibling.remove();
          return
        }
      }
    document.getElementById("metadata").remove();
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
  // let institution = createNode("p");
  // institution.innerHTML = details[0].institution;
  // li.appendChild(institution);
  let url = createNode("a");
  url.id = "metadata-url";
  url.title = "Link zur Online-Ressource";
  url.href = details[0].url;
  url.target = "_blank";
  li.appendChild(url);
  insertAfter(item, li);
  item.firstChild.setAttribute("style", "background: rgba(242, 250, 250, 1);");
  item.firstChild.firstChild.setAttribute("style", "opacity: 0.75;");
}

// filter content by user selected facets
function facet() {
    var tud = document.getElementById("inst_tud").checked
    var slub = document.getElementById("inst_slub").checked
    if (!tud & slub) {
        display(metadata.filter(resource => resource.institution.includes('SLUB')))
    }
    if (tud & !slub) {
        display(metadata.filter(resource => resource.institution.includes('TUD')))
    }
    if (!tud & !slub || tud & slub) {
      display(metadata)
    }
}
