// Flickity Hero Carousel
var options = {
    autoPlay: true,
    accessibility: true,
    prevNextButtons: true,
    setGallerySize: false,
    arrowShape: {
      x0: 10, x1: 60,
      y1: 50, x2: 60,
      y2: 45, x3: 15
    }
};
  
var carousel = document.querySelector('[data-carousel]');
var slides = document.getElementsByClassName('carousel-cell');
var flkty = new Flickity(carousel, options);

flkty.on('scroll', function () {
    flkty.slides.forEach(function (slide, i) {
    var image = slides[i];
    var x = (slide.target + flkty.x) * -1/3;
    image.style.backgroundPosition = x + 'px';
    });
});

// Sticky Navbar
const floatnav = document.getElementById("float-nav");
const stickynav = floatnav.offsetTop;

window.onscroll = () => {
  if (window.pageYOffset >= stickynav+500) {
    floatnav.classList.add("sticky-nav")
  } else {
    floatnav.classList.remove("sticky-nav");
  }
}




                  