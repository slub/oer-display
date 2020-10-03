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

// function for adding content to given grid
function addContent(grid,oer) {
  let img = createNode('img');
  img.src = oer.image
  grid.appendChild(img)
}

// initialize content and create display
function init() {
 loadJSON("assets/data/content.json", function(response) {
  var metadata = JSON.parse(response);
  console.log(metadata)
  let grid1st = document.getElementById('first');
  addContent(grid1st, metadata[0])
  let grid2nd = document.getElementById('second');
  addContent(grid2nd, metadata[1])
  let grid3rd = document.getElementById('third');
  addContent(grid3rd, metadata[2])
  let grid4th = document.getElementById('fourth');
  addContent(grid4th, metadata[3])
  let grid5th = document.getElementById('fifth');
  addContent(grid5th, metadata[4])
  let grid6th = document.getElementById('sixth');
  addContent(grid6th, metadata[5])
 });
}
