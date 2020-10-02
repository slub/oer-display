function filter() {
  document.getElementById("first").style.opacity="0.5";
  document.getElementById("second").style.opacity="0.5";
  document.getElementById("third").style.opacity="0.5";
  document.getElementById("fourth").style.opacity="0.5";
  document.getElementById("fifth").style.opacity="0.5";
  document.getElementById("sixth").style.opacity="0.5";
  var none = 1;
  if (document.getElementById("inst_slub").checked) {
    none = 0;
    document.getElementById("first").style.opacity="1.0";
    document.getElementById("fifth").style.opacity="1.0";
    document.getElementById("sixth").style.opacity="1.0";
  }
  if (document.getElementById("inst_tud").checked) {
    none = 0;
    document.getElementById("second").style.opacity="1.0";
    document.getElementById("third").style.opacity="1.0";
    document.getElementById("fourth").style.opacity="1.0";
  }
  if (document.getElementById("type_tutorial").checked) {
    none = 0;
    document.getElementById("first").style.opacity="1.0";
    document.getElementById("fourth").style.opacity="1.0";
    document.getElementById("fifth").style.opacity="1.0";
    document.getElementById("sixth").style.opacity="1.0";
  }
  if (document.getElementById("type_video").checked) {
    none = 0;
    document.getElementById("second").style.opacity="1.0";
    document.getElementById("third").style.opacity="1.0";
  }
  if (Boolean(none)) {
    document.getElementById("first").style.opacity="1.0";
    document.getElementById("second").style.opacity="1.0";
    document.getElementById("third").style.opacity="1.0";
    document.getElementById("fourth").style.opacity="1.0";
    document.getElementById("fifth").style.opacity="1.0";
    document.getElementById("sixth").style.opacity="1.0";
  }
}
function show_details_first() {
    un_show_details_second.call()
    document.getElementById("first").innerHTML = "\
      <img src='img/Zitat_statt_Plagiat_Cover.svg'><br/> \
      Zitat statt Plagiat<br/> \
      METADATEN<br/> \
      <a href='https://bildungsportal.sachsen.de/opal/auth/RepositoryEntry/18216648709?2'>Link</a>";
    document.getElementById("first").style.height = "380px";
}
function un_show_details_first() {
    document.getElementById("first").innerHTML = "\
      <img src='img/Zitat_statt_Plagiat_Cover.svg'><br/> \
      Zitat statt Plagiat<br/>";
    document.getElementById("first").style.height = "333px";
}
function show_details_second() {
    un_show_details_first.call()
    document.getElementById("second").innerHTML = "\
      <img src='img/ling_hist.png'><br/> \
      Vorträge zur Linguistik und Sprachgeschichte des Deutschen<br/> \
      METADATEN<br/> \
      <a href='https://open.spotify.com/show/3GwEHw4jqYnKbWi8HZziEn?si=tWP1EyeISEGviQS45AS50w'>Link</a>";
    document.getElementById("second").style.height = "430px";
    document.getElementById("second").style.whiteSpace = "normal";
    document.getElementById("second").style.textOverflow = "clip";
    document.getElementById("second").style.overflow = "auto";
}
function un_show_details_second() {
    document.getElementById("second").innerHTML = "\
      <img src='img/ling_hist.png'><br/> \
      Vorträge zur Linguistik und Sprachgeschichte des Deutschen"
    document.getElementById("second").style.height = "333px";
    document.getElementById("second").style.whiteSpace = "nowrap";
    document.getElementById("second").style.textOverflow = "ellipsis";
    document.getElementById("second").style.overflow = "hidden";
}
