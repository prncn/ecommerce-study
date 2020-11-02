// Bootstrap Validation
// Example starter JavaScript for disabling form submissions if there are invalid fields
(function() {
    'use strict';
    window.addEventListener('load', function() {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
            if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
        });
    }, false);
    })();

// Cart Sidebar
let added_set = JSON.parse(localStorage.getItem("cart") || "[]");
added_set.forEach(item => {
    document.getElementById("ref-check-cart").insertAdjacentHTML('beforeend', 
    `<ul style="display: flex;"><img src="static/IMG/${item.image}" height="60" width="60" style="object-fit: cover">
    <div class="fw-bd" style="display: flex; align-items: center; padding-left:20px">${item.amount} &times; ${item.brand} - ${item.title}</div></ul>`
    )
});


const sidebar_cart_footer = document.getElementsByClassName("modal-footer");
sidebar_cart_footer[0].innerHTML = `
  <div class="modal-footer-price-info">
    <div class="subtotal-info">
        <div class="fw-lt">Subtotal</div>
        <div class="r-fsm">${price_total(added_set)} €</div>
    </div>
    <div class="subtotal-info">
        <div class="fw-lt">Shipping</div>
        <div class="r-fsm">Free</div>
    </div>
    <div class="subtotal-info">
        <div class="fw-lt">Taxes (included)</div>
        <div class="r-fsm">${(price_total(added_set)*(16/160)).toFixed(2)} €</div>
    </div>
  </div>`
sidebar_cart_footer[1].innerHTML = `
  <div class="modal-footer-price-info">
    <div class="subtotal-info">
        <div class="fw-bd">Total</div>
        <div class="fw-bd">${price_total(added_set)} EUR</div>
    </div>
  </div>`

  
for(let i=0; i<2; i++){
    sidebar_cart_footer[i].style.backgroundColor = "inherit";
    sidebar_cart_footer[i].style.position = "relative";
    sidebar_cart_footer[i].style.height = "auto";
    sidebar_cart_footer[i].style.padding = "1rem";
    sidebar_cart_footer[i].getElementsByClassName("modal-footer-price-info")[0].style.width = "100%"
}

function price_total(added_set){
    let sum = 0;
    added_set.forEach(function(item){
        sum += item.price * item.amount;
    })
    return sum.toFixed(2);
}