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
      addContent(grid, content[i])
  }
}

// function for adding content to given grid
function addContent(grid,oer) {
  let li = createNode('li');
  let figure = createNode('figure');
  let img = createNode('img');
  img.src = oer.image
  figure.appendChild(img)
  li.appendChild(figure)
  grid.appendChild(li)
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
    if (!tud & !slub) {
      display(metadata)
    }
}
