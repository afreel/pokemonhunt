function genImage(height, width) {
  let imageSrc = chrome.extension.getURL("images/pikachu.png")
  let imageAlt = "Pikachu";
  let newImage = $("<img>", {src: imageSrc, alt: imageAlt});
  newImage.attr('height', height);
  newImage.attr('width', width);
  return newImage;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

let imgs = document.getElementsByTagName("img");
let numImgs = imgs.length;
let index = getRandomInt(0, numImgs)
let img = imgs[index];
console.log(index);
$(img).replaceWith(genImage(img.height, img.width));
