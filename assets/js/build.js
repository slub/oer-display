/* jshint esversion: 6 */

var metadata = [];
var facets = {};

/* global XMLHttpRequest */
// request JSON file at path and pass response to given func
function loadJSON (path, func) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType('application/json');
  xobj.open('GET', path, true);
  xobj.onreadystatechange = () => {
    if (xobj.readyState === 4 && xobj.status === 200) {
      func(xobj.responseText);
    }
  };
  xobj.send(null);
}

// create element node with given attributes
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

// add given newNode after given referenceNode
function insertAfter (referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

// get unique values of object field in array specified by key
function getUniqueValues (array, key) {
  var values = array.map((o) => o[key]);
  values = [].concat.apply([], values); // flatten nested array
  values = values.filter((v, i) => values.indexOf(v) === i);
  values = values.filter((v) => v);
  values.sort();
  return values;
}

// add metadata of item to grid or remove it if already present
function handleMetadata (item) {
  if (document.contains(document.getElementById(item.id.concat('_metadata')))) {
    item.firstChild.firstChild.removeAttribute('style');
    item.nextSibling.remove();
    return;
  }
  //  if (document.contains(document.querySelector('[id$="_metadata"]'))) {
  //    var prev = document.querySelector('[id$="_metadata"]');
  //    prev.previousSibling.firstChild.firstChild.removeAttribute('style');
  //    prev.remove();
  //  }
  var li = createNode('li');
  li.id = item.id.concat('_metadata');
  var details = metadata.filter((resource) => resource.id.includes(item.id));
  // hier die Informationen eintragen
  var author = createNode('p');
  author.innerHTML = details[0].author;
  author.setAttribute('style', 'font-family: \'VisSansBold\', Helvetica, Arial, Sans-Serif;');
  li.appendChild(author);
  var title = createNode('p');
  title.innerHTML = details[0].title;
  li.appendChild(title);
  var institution = createNode('p');
  var emphasis = createNode('em');
  emphasis.innerHTML = details[0].institution;
  institution.appendChild(emphasis);
  li.appendChild(institution);
  var date = createNode('p');
  date.innerHTML = details[0].date;
  li.appendChild(date);
  var url = createNode('a');
  url.id = item.id.concat('_metadata-url');
  url.title = 'Link zur Online-Ressource';
  url.href = details[0].url;
  url.target = '_blank';
  li.appendChild(url);
  insertAfter(item, li);
  item.firstChild.firstChild.setAttribute('style', 'opacity: 0.75;');
}

// add given resource to given grid
function addResource (grid, resource) {
  var li = createNode('li');
  li.id = resource.id;
  var figure = createNode('figure');
  var img = createNode('img');
  img.src = resource.image;
  figure.appendChild(img);
  li.appendChild(figure);
  li.onclick = function () { handleMetadata(this); };
  grid.appendChild(li);
}

// create grid display with given resources
function displayGrid (resources) {
  var grid = document.getElementById('oer');
  grid.innerHTML = ''; // ensure empty grid
  resources.forEach(function (resource) {
    addResource(grid, resource);
  });
}

// add given facet with its values
function addFacet (facet, values) {
  var article = document.querySelector('.facet');
  var header = createNode('header');
  var h2 = createNode('h2', null, 'box');
  var span = createNode('span');
  span.setAttribute('aria-hidden', 'true');
  span.innerHTML = '&gt; ';
  h2.appendChild(span);
  h2.innerHTML += facets[facet];
  header.appendChild(h2);
  var header2 = createNode('header');
  var ol = createNode('ol', null, 'facetList box');
  values.forEach((value) => {
    const li = createNode('li');
    const div = createNode('div', null, 'add-facet');
    const input = createNode('input', value.toLowerCase(), null, 'checkbox');
    input.setAttribute('name', facet);
    input.setAttribute('value', value.toLowerCase());
    div.appendChild(input);
    const label = createNode('label');
    label.setAttribute('for', value.toLowerCase());
    label.innerHTML = value;
    div.appendChild(label);
    li.appendChild(div);
    ol.appendChild(li);
  });
  header2.appendChild(ol);
  if (Object.keys(facets).indexOf(facet) === Object.keys(facets).length - 1) {
    const div = createNode('div', null, 'facetShowAll box clearfix');
    const input = createNode('input', 'submit-facet', 'facet-submit slub-button right', 'submit');
    input.setAttribute('onclick', 'faceting()');
    input.setAttribute('value', 'Anwenden');
    div.appendChild(input);
    header2.appendChild(div);
  }
  header.appendChild(header2);
  article.appendChild(header);
}

// create display of given facets
function displayFacets (facets) {
  Object.keys(facets).forEach((key) => {
    var uniqueValues = getUniqueValues(metadata, key);
    addFacet(key, uniqueValues);
  });
}

/* eslint-disable no-unused-vars */

// initialize content and create display
function init () {
  loadJSON('assets/data/content.json', (response) => {
    metadata = JSON.parse(response);
    displayGrid(metadata);
    loadJSON('assets/data/facets.json', (response) => {
      facets = JSON.parse(response);
      displayFacets(facets);
    });
  });
}

// filter resources by user selected facets
function faceting () {
  var selection = [];
  Object.keys(facets).forEach((key) => {
    var checked = false;
    var facetSelection = [];
    var first = Object.keys(facets).indexOf(key) === 0;
    var uniqueValues = getUniqueValues(metadata, key);
    uniqueValues.forEach((value) => {
      var facetChecked = document.getElementById(value.toLowerCase()).checked;
      if (facetChecked) {
        checked = true;
        if (first) {
          selection.push.apply(selection, metadata.filter((resource) => resource[key].includes(value)));
        } else {
          facetSelection.push.apply(facetSelection, selection.filter((resource) => resource[key].includes(value)));
        }
      }
    });
    if (!checked && first) {
      selection.push.apply(selection, metadata);
    }
    if (checked && !first) {
      selection = facetSelection;
    }
  });
  selection = selection.filter((v, i, a) => a.findIndex((t) => (t.id === v.id)) === i);
  displayGrid(selection);
}
