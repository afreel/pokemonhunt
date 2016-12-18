const IMAGE_SIDE_MIN = 25;

function isHidden(el) {
    return (el.offsetParent === null)
}

function getImageToReplace(candidateImgs) {
  let filteredImgs = candidateImgs.filter(function(index, img) {
    return img.height >= IMAGE_SIDE_MIN && img.width >= IMAGE_SIDE_MIN && !isHidden(img);
  });
  let index = getRandomInt(0, filteredImgs.length);
  return filteredImgs[index];
}

function genRandomPokemon() {
  let reader = new FileReader();
  let file = new File([], chrome.extension.getURL("pkmn_scores.csv"));
  reader.onload = function() {
    console.log(this.result);
  }
  console.log(reader.readAsText(file));
}

function onImageClicked() {
  // should use chrome.tabs
  var newURL = "http://stackoverflow.com/";
  window.open(newURL);
}

function genPokemonImage(height, width) {
  let side = width >= height ? height : width;
  let imageSrc = chrome.extension.getURL("images/25.png")
  let imageAlt = "Pikachu";
  let newImage = $("<img>", {src: imageSrc, alt: imageAlt});
  newImage.css({
    position: 'absolute',
    height: side,
    width: side,
    overflow: 'auto',
    margin: 'auto',
    top: 0, 
    left: 0, 
    bottom: 0, 
    right: 0,
  });

  newImage.click(onImageClicked);
  return newImage;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getOverlayElement(imageToOverlay) {

  const height = imageToOverlay.height;
  const width = imageToOverlay.width;

  const imgPos = $(imageToOverlay).offset();
  y = imgPos.top;
  x = imgPos.left;

  return $('<div></div>')
    .addClass('pokemon-overlay')
    .css({
      position: 'absolute',
      height: height,
      width: width,
      left: x,
      top: y,
      'background-color': 'rgb(0, 0, 0, 0)',
      cursor: 'pointer',
    });
}

function addPokemon() {
  const imgs = $('img');
  const img = getImageToReplace(imgs);

  const overlayElement = getOverlayElement(img);
  
  $('body').after(overlayElement);
  overlayElement.append(genPokemonImage(overlayElement.height(), overlayElement.width()));
  
  $(img).css('visibility', 'hidden');
}

$(document).ready(addPokemon);
