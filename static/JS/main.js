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

// Shopping Cart Modal
var modal = document.getElementById("cart-modal");
var btn = document.getElementById("cart-btn");
var span = document.getElementsByClassName("close")[0];

btn.onclick = () => {
  modal.style.display = "block";
}

span.onclick = () => {
  modal.style.display = "none";
}

window.onclick = event => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Placeholder Product Data
/*
async function get_products(){
  try {
    let result = await fetch("static/JS/products.json");
    let data = result.json();
    return data;
  } catch (error) {
    console.log(error)
  }
}

let product_data = [];
document.addEventListener('DOMContentLoaded', () => {
  get_products().then(data => {
    data.forEach(item => {
      product_data.push(item)
    })
  });
  console.log(product_data);
})
*/

fetch("static/JS/products.json")
 .then(response => response.json())
 .then(prod => {

prod.forEach(item => {
  item.prodId = prod.indexOf(item);
})

console.log(prod.length)

// Setup Pagination
const perpage = 8;
let page_num = Math.floor(prod.length/perpage);
const page_rem = prod.length % perpage;
if(page_rem != 0)
  page_num++;

let page_ind = document.getElementById("page-indicator");
for(let i=0; i<page_num; i++){
  let page_btn = document.createElement("button");
  page_btn.className = "page-btn"
  page_btn.innerHTML = i+1;
  page_ind.appendChild(page_btn);
}
                      
// Render Product Section
function render_products(start, end){
  for(let i=start; i<end; i++) {
    document.getElementById("prod-section").insertAdjacentHTML('beforeend', `
      <div class="wrapper">
        <div class="product-img">
            <img src="/static/IMG/${prod[i].image}">
        </div>
        <div class="product-info">
        <div class="product-text">
            <h1>${prod[i].brand}</h1>
            <h2>${prod[i].title}</h2>
        </div>
        <div class="product-price-btn">
            <p>${prod[i].price} €</p>
            <button class="add-cart" data_prodId="${prod[i].prodId}" type="button">ADD TO CART</button>
        </div>
        </div>
      </div>`
  )}
}

//First page render
render_products(0, perpage);
add_to_cart_btn();

//Pagination
const page_btns = document.querySelectorAll(".page-btn");
page_btns.forEach(btn => {
  btn.onclick = () => {
    let current_load = btn.innerHTML;
    document.getElementById("prod-section").innerHTML = ''
    render_products(perpage*(current_load - 1), perpage*current_load);
    add_to_cart_btn();
    document.querySelector('.section-title').scrollIntoView({behavior: 'smooth'});
}})
  
// Add to Shopping Cart
function add_to_cart_btn(){
  const add_btns = document.querySelectorAll(".add-cart")
  add_btns.forEach(btn => {
    btn.onclick = () => {
      let searchKey = btn.getAttribute("data_prodId");
      let boundProd = prod.find(item => item.prodId == searchKey)
      //console.log(boundProd);
      to_cart(boundProd);
    }
  })
}

let cart_count = 0;
var added_set = [];
function to_cart(item){
  add_item(item);
  render_modal();
  
  // Render modal footer (total sum) HTML
  document.getElementById("total-sum-modal").innerHTML = `
    <h2 id="total-price">TOTAL: ${price_total(added_set)} €</h2>
    <div class="product-price-btn">
      <button class="add-cart" type="button">GO TO CHECKOUT</button>
    </div>
`}

// Render modal HTML
function render_modal(){
  document.getElementById("added-content").innerHTML = `${added_set.map( item => {
    return`
      <div class="wrapper-modal">
        <img src="static/IMG/${item.image}">
        <p>${item.brand} - ${item.title}</p>
        <p class="quant-text">Quantity: ${item.amount}</p> 
        <p>${item.price} €</p>
        <span class="trash-item" data_item="${added_set.indexOf(item)}">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill:rgba(0, 0, 0, 1);transform:;-ms-filter:">
            <path d="M6 7C5.447 7 5 7 5 7v13c0 1.104.896 2 2 2h10c1.104 0 2-.896 2-2V7c0 0-.447 0-1 0H6zM16.618 4L15 2 9 2 7.382 4 3 4 3 6 8 6 16 6 21 6 21 4z"></path>
          </svg>
        </span>
        <span class="plus-item" data_item="${added_set.indexOf(item)}">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill:rgba(0, 0, 0, 1);transform:;-ms-filter:">
            <path d="M12,2C6.486,2,2,6.486,2,12s4.486,10,10,10c5.514,0,10-4.486,10-10S17.514,2,12,2z M17,13h-4v4h-2v-4H7v-2h4V7h2v4h4V13z"></path>
          </svg>
        </span>
        <span class="minus-item" data_item="${added_set.indexOf(item)}">
          ${update_icon_color(item)}
        </span>
      </div>`
    }).join('')}`

  // Handle add, sub, and delete icons inside the cart modal
  let plus_item = document.getElementsByClassName("plus-item");
  let minus_item = document.getElementsByClassName("minus-item");
  let trash_item = document.getElementsByClassName("trash-item");
  for(let i=0; i<added_set.length; i++){
    plus_item[i].onclick = () => {
      add_item(added_set[i]);
      update_quantity_counts(i);
      minus_item[i].innerHTML = update_icon_color(added_set[i]);
    }

    minus_item[i].onclick = () => {
      subtract_item(added_set[i]);
      update_quantity_counts(i);
      minus_item[i].innerHTML = update_icon_color(added_set[i]);
    }

    trash_item[i].onclick = () => {
      throw_item(added_set[i]);
      render_modal();

      if(cart_count == 0){
        document.getElementById("added-content").innerHTML = `<h1 style="font-family: var(--display-font); color: var(--gray);">Cart empty. <br> :(</h1`
        document.getElementById("total-sum-modal").innerHTML = ''
      }
    }}
}

// Make sub icon gray if not available (less than 1 item), make black if available
function update_icon_color(item){
  function minus_btn_template(num){ return `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill:rgba(0, 0, 0, ${num});transform:;-ms-filter:">
      <path d="M12,2C6.486,2,2,6.486,2,12s4.486,10,10,10s10-4.486,10-10S17.514,2,12,2z M17,13H7v-2h10V13z"></path>
    </svg>`}

  if(item.amount > 1)
    return minus_btn_template(1);

  return minus_btn_template(0.3)
}

// Update HTML when there were changes to variables
function update_quantity_counts(i){
  document.getElementsByClassName("quant-text")[i].innerHTML = `Quantity: ${added_set[i].amount}`;
  document.getElementById("total-price").innerHTML = `TOTAL: ${price_total(added_set)} €`
  console.log(cart_count);
}

// Helper function to add from inside the cart
function add_item(item){
  cart_count += 1;
  document.getElementById("cart-counter").innerHTML = cart_count;
  if(added_set.includes(item)){
    item.amount += 1;
  } else {
    item.amount = 1;
    added_set.push(item);
  }}

// Helper function to substract from cart 
function subtract_item(item){
  if(item.amount == 1)
    return;
  
  cart_count -= 1;
  item.amount -= 1;
  document.getElementById("cart-counter").innerHTML = cart_count;
}

// Helper function to delete from cart
function throw_item(item){
  cart_count -= item.amount;
  added_set.splice(added_set.indexOf(item), 1);
  document.getElementById("total-price").innerHTML = `TOTAL: ${price_total(added_set)} €`
}

// Calculate total cost and display in price format
function price_total(added_set){
  let sum = 0;
  added_set.forEach(function(item){
    sum += item.price * item.amount;
  })
  return sum.toFixed(2);
}

})