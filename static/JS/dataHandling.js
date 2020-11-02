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
   
  let added_set = JSON.parse(localStorage.getItem("cart") || "[]");
  let cart_count = sum_cart_count();
  update_cart_counter();
  render_modal();

  if(added_set.length)
    render_total_sum_modal();

// Lazy unique product IDs for products JSON
prod.forEach(item => {
  item.prodId = prod.indexOf(item);
})

// console.log(prod.length)

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
let prev = page_btns[0];
prev.style.backgroundColor = "var(--gray)"
page_btns.forEach(btn => {
  btn.onclick = () => {
    prev.style.backgroundColor = "var(--prime-color)"
    btn.style.backgroundColor = "var(--gray)"
    let current_load = btn.innerHTML;
    document.getElementById("prod-section").innerHTML = ''
    render_products(perpage*(current_load - 1), perpage*current_load);
    add_to_cart_btn();
    document.querySelector('.section-title').scrollIntoView({behavior: 'smooth'});
    prev = btn;
}})
  
// Add to Shopping Cart
function add_to_cart_btn(){
  const add_btns = document.querySelectorAll(".add-cart")
  add_btns.forEach(btn => {
    btn.onclick = () => {
      let searchKey = btn.getAttribute("data_prodId");
      let boundProd = prod.find(item => item.prodId == searchKey)
      //console.log(boundProd);
      console.log(boundProd);
      add_item(boundProd);
      render_modal();
      render_total_sum_modal();
      //console.log(added_set);
      //localStorage.setItem("cart", JSON.stringify(added_set));
    }
  })
}

// Render modal footer (total sum) HTML
function render_total_sum_modal(){
  document.getElementById("total-sum-modal").innerHTML = `
  <div class="modal-footer-price-info">
  <div class="subtotal-info">
  <div class="fw-bd">Subtotal</div>
  <div class="r-fsm">${price_total(added_set)} €</div>
  </div>
  <div class="subtotal-info">
  <div class="fw-bd">Shipping</div>
  <div class="r-fsm">Free DE shipping</div>
  </div>
  </div>
  <div class="product-price-btn">
    <button id="to-checkout" type="button">GO TO CHECKOUT</button>
  </div>
  `
  document.getElementById("to-checkout").onclick = () => {
    localStorage.setItem("cart", JSON.stringify(added_set));
    location.href='checkout.html';
  }
}

// Calculates total quantity in cart
function sum_cart_count(){
  let sum = 0;
  added_set.forEach(item => {
    sum += item.amount;
  })
  return sum;
}

// Render modal HTML
function render_modal(){
  document.getElementById("added-content").innerHTML = `${added_set.map( item => {
    return`
      <div class="wrapper-modal">
        <img src="static/IMG/${item.image}">
        <p>${item.brand} - ${item.title}</p>
        <p class="q-txt col-ba">Quantity: ${item.amount}</p> 
        <p>${item.price} €</p>
        <span class="trash-item" data_item="${added_set.indexOf(item)}">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill:rgba(255, 129, 99, 1);transform:;-ms-filter:">
            <path d="M6 7C5.447 7 5 7 5 7v13c0 1.104.896 2 2 2h10c1.104 0 2-.896 2-2V7c0 0-.447 0-1 0H6zM10 19H8v-9h2V19zM16 19h-2v-9h2V19zM16.618 4L15 2 9 2 7.382 4 3 4 3 6 8 6 16 6 21 6 21 4z"></path>
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

  if(cart_count == 0){
    document.getElementById("added-content").innerHTML = `<h1 style="font-family: var(--display-font); color: var(--gray);">Cart empty. <br> :(</h1`
    document.getElementById("total-sum-modal").innerHTML = ''
  }

  // Handle add, sub, and delete icons inside the cart modal
  let plus_item = document.getElementsByClassName("plus-item");
  let minus_item = document.getElementsByClassName("minus-item");
  let trash_item = document.getElementsByClassName("trash-item");
  for(let i=0; i<added_set.length; i++){
    plus_item[i].onclick = () => {
      add_item(added_set[i]);
      update_quantity_counts(i);
      render_total_sum_modal();
      minus_item[i].innerHTML = update_icon_color(added_set[i]);
    }

    minus_item[i].onclick = () => {
      subtract_item(added_set[i]);
      update_quantity_counts(i);
      render_total_sum_modal();
      minus_item[i].innerHTML = update_icon_color(added_set[i]);
    }

    trash_item[i].onclick = () => {
      throw_item(added_set[i]);
      render_modal();
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
  document.getElementsByClassName("q-txt")[i].innerHTML = `Quantity: ${added_set[i].amount}`;
  update_cart_counter();
  console.log(cart_count);
}

// Check if key exists in object array
function check_key(prodId){
  for(let i=0; i<added_set.length; i++){
    if(added_set[i].prodId===prodId){
      return true;
    }
  }
  return false;
}

// Helper function to add from inside the cart
function add_item(item){
  //console.log(check_key(item.prodId));
  //console.log(added_set);
  //console.log(local_cart)
  if(added_set.includes(item) || check_key(item.prodId)){
    //console.log(Object.keys(item));
    item = added_set.find(cartitem => item.prodId === cartitem.prodId);
    item.amount += 1;
    //console.log(item.amount);
    cart_count = sum_cart_count();
    update_cart_counter();
  } else {
    item.amount = 1;
    added_set.push(item);
    cart_count = sum_cart_count();
    update_cart_counter();
  }}

// Helper function to substract from cart 
function subtract_item(item){
  if(item.amount == 1)
    return;
  
  item.amount -= 1;
  cart_count = sum_cart_count();
  update_cart_counter();
}

// Helper function to delete from cart
function throw_item(item){
  added_set.splice(added_set.indexOf(item), 1);
  cart_count = sum_cart_count();
  update_cart_counter();
  render_total_sum_modal();
}

function update_cart_counter(){
  const span_counter = document.getElementById("cart-counter");
  if(cart_count){
    span_counter.style.visibility = "visible";
    span_counter.innerHTML = cart_count;
  }
  else
    span_counter.style.visibility = "hidden";
}

// Calculate total cost and display in price format
function price_total(added_set){
  let sum = 0;
  added_set.forEach(function(item){
    sum += item.price * item.amount;
  })
  return sum.toFixed(2);
}

// Click clear in nav bar to clear cart
document.getElementById("clear-btn").onclick = () => {
  localStorage.clear();
}

})