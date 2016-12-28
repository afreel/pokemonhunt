const IMAGE_SIDE_MIN = 25;

function isHidden(el) {
    return (el.offsetParent === null)
}

function getImageToReplace(candidateImgs) {
  const filteredImgs = candidateImgs.filter((index, img) => 
    img.height >= IMAGE_SIDE_MIN && img.width >= IMAGE_SIDE_MIN && !isHidden(img)
  );
  const index = getRandomInt(0, filteredImgs.length);
  return filteredImgs[index];
}

function onPokemonClick(originalImage, overlayElement,  event) {
  // should use chrome.tabs
  var newURL = "http://stackoverflow.com/";
  // window.open(newURL);

  $(originalImage).css('visibility', 'visible');
  $(overlayElement).css('visibility', 'hidden');
}

function genPokemonImage(height, width) {
  return $.get('https://tranquil-sands-69613.herokuapp.com/get_pokemon')
    .then(pokeId => {
      const side = width >= height ? height : width;
      const imageSrc = chrome.extension.getURL("images/" + pokeId + ".png");
      const imageAlt = "somePoke";
      const newImage = $("<img>", {src: imageSrc, alt: imageAlt});

      newImage.addClass('pokemon-image')
        .css({
          height: side,
          width: side,
        });

      return newImage;
    })
    .catch(err => {
      debugger;
    });
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
  const y = imgPos.top;
  const x = imgPos.left;

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

  if (img) {
    const overlayElement = getOverlayElement(img);

    genPokemonImage(overlayElement.height(), overlayElement.width())
      .then(pokeImage => {
        pokeImage.click(event => onPokemonClick(img, overlayElement, event));

        $('body').after(overlayElement);
        overlayElement.append(pokeImage);
        
        $(img).css('visibility', 'hidden');
      });
  }
}

$(document).ready(addPokemon);
