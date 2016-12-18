const IMAGE_SIDE_MIN = 25;

function getImageToReplace(candidateImgs) {
  let filteredImgs = candidateImgs.filter(function(img) {
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

function genPokemonImage(height, width) {
  genRandomPokemon();
  let side = width >= height ? height: width;
  let imageSrc = chrome.extension.getURL("images/25.png");
  let imageAlt = "Pikachu";
  let newImage = $("<img>", {src: imageSrc, alt: imageAlt});
  newImage.attr('height', side);
  newImage.attr('width', side);
  return newImage;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function isHidden(el) {
    return (el.offsetParent === null)
}

let imgs = document.getElementsByTagName("img");
let imgsArray = [].slice.call(imgs); //converts from HTMLCollection to Array
let img = getImageToReplace(imgsArray);
$(img).replaceWith(genPokemonImage(img.height, img.width));
