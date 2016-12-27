const IMAGE_SIDE_MIN = 25;

function isHidden(el) {
    return (el.offsetParent === null)
}

function getImageToReplace(candidateImgs) {
  const filteredImgs = candidateImgs.filter(function(index, img) {
    return img.height >= IMAGE_SIDE_MIN && img.width >= IMAGE_SIDE_MIN && !isHidden(img);
  });
  const index = getRandomInt(0, filteredImgs.length);
  return filteredImgs[index];
}

function genRandomPokemon() {
  const reader = new FileReader();
  const file = new File([], chrome.extension.getURL("pkmn_scores.csv"));
  reader.onload = function() {
    console.log(this.result);
  }
  console.log(reader.readAsText(file));
}

function onPokemonClick(originalImage, event) {
  // should use chrome.tabs
  var newURL = "http://stackoverflow.com/";
  // window.open(newURL);

  $(originalImage).css('visibility', 'visible');
  $(event.currentTarget).css('visibility', 'hidden');
}

function genPokemonImage(height, width) {
  const side = width >= height ? height : width;
  const imageSrc = chrome.extension.getURL("images/25.png")
  const imageAlt = "Pikachu";
  const newImage = $("<img>", {src: imageSrc, alt: imageAlt});

  newImage.addClass('pokemon-image')
    .css({
      height: side,
      width: side,
    });

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
      height: height,
      width: width,
      left: x,
      top: y,
    });
}

function addPokemon() {
  const imgs = $('img');
  const img = getImageToReplace(imgs);

  if (!_.isEmpty(imgs)) {
    const overlayElement = getOverlayElement(img);
    const pokeImage = genPokemonImage(overlayElement.height(), overlayElement.width());

    pokeImage.click(_.partial(onPokemonClick, img));

    $('body').after(overlayElement);
    overlayElement.append(pokeImage);
    
    $(img).css('visibility', 'hidden');
  }
}

$(document).ready(addPokemon);
