function setHtml() {
  var deviceWidth = document.documentElement.offsetWidth;
  document.documentElement.style.fontSize = deviceWidth / 1440 * 10 + 'px';
}

window.onresize = setHtml;

setHtml();