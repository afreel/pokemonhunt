function getImageToReplace(candidateImgs) {
  const filteredImgs = candidateImgs.filter((index, img) => 
    img.height >= IMAGE_SIDE_MIN && img.width >= IMAGE_SIDE_MIN && !isHidden(img)
  );
  const index = getRandomInt(0, filteredImgs.length);
  return filteredImgs[index];
}

function getOverlayElement(imageToOverlay) {
  const height = imageToOverlay.height;
  const width = imageToOverlay.width;

  const imgPos = $(imageToOverlay).offset();

  return $('<div></div>')
    .addClass('pokemon-overlay')
    .css({
      height: height,
      width: width,
      left: imgPos.left,
      top: imgPos.top,
    });
}

function genPokemonImage(overlayElement, clickCallback) {
  const height = overlayElement.height();
  const width = overlayElement.width();

  return $.post(`${API}/get_pokemon`, {
    url: window.location.href
  })
    .then(results => {
      const side = width >= height ? height : width;
      const pokeImage = $("<img>", {
          src: chrome.extension.getURL(`images/${results.pokemon_id}.png`),
          alt: results.pokemon_id
        })
        .addClass('pokemon-image')
        .css({
          height: side,
          width: side,
        })
        .click(event => clickCallback(results.encounter_id));

      return pokeImage;
    })
    .catch(err => {
      debugger;
    });
}

function onPokemonClick(originalImage, overlayElement, encounter_id) {
  // should use chrome.tabs
  var newURL = `${API}/encounter/${encounter_id}`;
  window.open(newURL);

  $(originalImage).css('visibility', 'visible');
  $(overlayElement).css('visibility', 'hidden');
}

function addPokemon() {
  const imgs = $('img');
  const img = getImageToReplace(imgs);

  if (img) {
    const overlayElement = getOverlayElement(img);

    function clickCallback(encounter_id) {
      onPokemonClick(img, overlayElement, encounter_id);
    } 

    genPokemonImage(overlayElement, clickCallback)
      .then(pokeImage => {

        $('body').after(overlayElement);
        overlayElement.append(pokeImage);
        
        $(img).css('visibility', 'hidden');
      });
  }
}

$(document).ready(addPokemon);
