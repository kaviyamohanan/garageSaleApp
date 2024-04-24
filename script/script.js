// import myProducts from "..//products.mjs";
// const myProducts = require("..//products.mjs");
const myProducts = [
  {
      productId:1,
      prodName: "Chair",
      prodPrice: 55,
      prodImageUrl: "./images/products/p1.jpg"
  },
  {
      productId:2,
      prodName: "Sofa",
      prodPrice: 65,
      prodImageUrl: "./images/products/p2.jpg"
  },
  {
      productId:3,
      prodName: "Table",
      prodPrice: 74,
      prodImageUrl: "./images/products/p3.jpg"
  },
   {
      productId:4,
      prodName: "Table",
      prodPrice: 74,
      prodImageUrl: "./images/products/p4.jpg"
  },
   {
      productId:5,
      prodName: "Table",
      prodPrice: 74,
      prodImageUrl: "./images/products/p5.jpg"
  },
   {
      productId:6,
      prodName: "Table",
      prodPrice: 74,
      prodImageUrl: "./images/products/p6.jpg"
  },
   {
      productId:7,
      prodName: "Table",
      prodPrice: 74,
      prodImageUrl: "./images/products/p7.jpg"
  },
   {
      productId:8,
      prodName: "Table",
      prodPrice: 74,
      prodImageUrl: "./images/products/p8.jpg"
  },
   {
      productId:9,
      prodName: "Table",
      prodPrice: 74,
      prodImageUrl: "./images/products/p9.jpg"
  },
   {
      productId:10,
      prodName: "Table",
      prodPrice: 74,
      prodImageUrl: "./images/products/p10.jpg"
  },
   {
      productId:11,
      prodName: "Table",
      prodPrice: 74,
      prodImageUrl: "./images/products/p11.jpg"
  },
   {
      productId:12,
      prodName: "Table",
      prodPrice: 74,
      prodImageUrl: "./images/products/p12.jpg"
  },
   {
      productId:13,
      prodName: "Table",
      prodPrice: 74,
      prodImageUrl: "./images/products/p13.jpg"
  },

];

// *******Start*******Product listing******************
document.addEventListener("DOMContentLoaded", function () {
  const productListContainer = document.getElementById("product_list");

  const box_div = document.createElement("div");
  box_div.classList.add("box_div");

  const box_ul = document.createElement("ul");
  box_ul.classList.add("box_ul");

  let inner_content = "";
  for (const prod in myProducts) {
    inner_content += `<li class='li_elm' id = '${myProducts[prod].productId}' >
        <img src='${myProducts[prod].prodImageUrl}' alt=''/>
        <p class='p_name'>${myProducts[prod].prodName}</p>
        <p class='p_price'>$${myProducts[prod].prodPrice}</p>
        <span class='q_span'>
        <label for="name">Quantity: </label>
        <input name='quantity' type='text' value=1 id = 'qty_${myProducts[prod].productId}'/>
        <span id='err_qty${myProducts[prod].productId}' class='err_qty'></span>
        </span>
        <button class='btn_add_to_cart' onclick='addToCart(${myProducts[prod].productId})'>Add to Cart</button>
        </li>`;
  }
  box_ul.innerHTML = inner_content;
  box_div.appendChild(box_ul);
  productListContainer.appendChild(box_div);

  window.addToCart = addToCart;
  window.updateCart = updateCart;
  window.removeProd = removeProd;
  window.checkOut = checkOut;
  window.validateFrom = validateFrom;

  updateCart("cart");
});

// *******Stop*******Product listing******************

// ***********Start***********Add to cart*************

function addToCart(id) {
  // get product details
  let prod_name, prod_quantity, prod_url, prod_id, prod_price;
  prod_id = id;

 prod_quantity = document.getElementById('qty_'+id).value;

  for (const product of myProducts) {
    if (product.productId == prod_id) {
      prod_name = product.prodName;
      prod_price = product.prodPrice;
      prod_url = product.prodImageUrl;
    }
  }

  if (
    prod_name !== "" &&
    prod_price !== "" &&
    prod_url !== "" &&
    prod_id !== ""
  ) {
    // prod_quantity = prompt("Enter the quantity for Product " + prod_name);

    // check product is already in the cart, then add to that
    var duplicate = 0;

    if (prod_id && !isNaN(prod_quantity) && parseInt(prod_quantity) > 0) {
    let prod_qty_err = document.getElementById('err_qty'+id);
     prod_qty_err.textContent = "";
      if (localStorage["cart"] == undefined) {
        let new_prod_price =
          parseFloat(prod_quantity) * parseFloat(prod_price).toFixed(2);
        localStorage.setItem(
          "cart",
          JSON.stringify([
            {
              prod_id,
              prod_name,
              prod_price: new_prod_price,
              prod_quantity: parseInt(prod_quantity),
              prod_url,
            },
          ])
        );
      } else {
        var cart_arr = JSON.parse(window.localStorage.getItem("cart"));
        for (let key in cart_arr) {
          if (cart_arr[key].prod_id == prod_id) {
            let new_prod_price =
              parseFloat(cart_arr[key].prod_quantity) *
              parseFloat(prod_price).toFixed(2);
            cart_arr[key].prod_quantity =
              parseInt(cart_arr[key].prod_quantity) + parseInt(prod_quantity);
            cart_arr[key].prod_price = new_prod_price;
            duplicate = 1;
          }
        }
        if (duplicate == 0) {
          let new_prod_price =
            parseFloat(prod_quantity) * parseFloat(prod_price).toFixed(2);
          cart_arr.push({
            prod_id,
            prod_name,
            prod_price: new_prod_price,
            prod_quantity: parseInt(prod_quantity),
            prod_url,
          });
        }
        localStorage.setItem("cart", JSON.stringify(cart_arr));
        alert("Product added to the cart!");
      }
    } else {
    //   alert("Invalid quantity. Please enter a valid numeric value.");
     let prod_qty_err = document.getElementById('err_qty'+id);
     prod_qty_err.textContent = "Invalid quantity. Please enter a valid numeric value.";
    }
  }

  updateCart("cart");
}

// ***********Stop***********Add to cart*************

// ***********Start***********Update the cart************

function updateCart(pos) {
  if (localStorage["cart"] != undefined && localStorage["cart"] != "[]") {
    var subtotal = 0;

    // remove cart empty msg
    const empty_elm = document.getElementById("empty");
    empty_elm.classList.add("hide");
    const checkout_button = document.getElementById("checkout_button");
    checkout_button.classList.remove("hide");

    var cart_arr = JSON.parse(window.localStorage.getItem("cart"));
    let cart_elm;
    let cust_name;
    if (pos == "cart") {
      cart_elm = document.getElementById("cart_items");
    } else {
      cart_elm = document.getElementById("prod_details");
    }
    cart_elm.classList.remove("hide");

    const custDiv = document.createElement("div");
    custDiv.classList.add("cust_div");
    custDiv.innerHTML = cust_name;

    const cartListDiv = document.createElement("div");
    cartListDiv.classList.add("cart_list_div");
    cartListDiv.id = "cart_list_div";

    const cartListTable = document.createElement("table");
    cartListTable.classList.add("cart_list_table");
    for (let key in cart_arr) {
      const cartTr = document.createElement("tr");
      cartTr.classList.add("cart_tr");
      cartTr.innerHTML = `
                <td><span class="td_quantity">${cart_arr[key].prod_quantity} X </span></td>
                <td><span><img src="${cart_arr[key].prod_url}"/></span></td>
                <td><span class="td_prod_name"><strong>${cart_arr[key].prod_name}</strong></span></td>
                <td><span class='prod_price'><strong>$${cart_arr[key].prod_price}</strong></span></td>
            `;
      if (pos == "cart") {
        cartTr.innerHTML += `<td><span class='remove_item' onclick=removeProd(${cart_arr[key].prod_id})><i class="fa fa-trash" aria-hidden="true"></i></span></td>`;
      }
      cartListTable.appendChild(cartTr);

      subtotal += parseFloat(cart_arr[key].prod_price);
    }
    const hr_elm = document.createElement("hr");
    cartListDiv.appendChild(cartListTable);
    cart_elm.innerHTML = "";

    cart_elm.appendChild(cartListDiv);
    cart_elm.appendChild(hr_elm);

    // *****************************Calculate cart total **********************************

    if (pos != "cart") {
      // find donation amount and add donation total

      let donation_amount = calculateDonation(subtotal);

      const cartTotalTable = document.createElement("table");
      cartTotalTable.classList.add("cart_total_div");
      cartTotalTable.id = "cart_total_div";
      var tax = parseFloat((subtotal * 13) / 100).toFixed(2);
      var total = (
        parseFloat(tax) +
        parseFloat(subtotal) +
        parseFloat(donation_amount)
      ).toFixed(2);
      subtotal = subtotal.toFixed(2);

      cartTotalTable.innerHTML = `
                <tr><td><span class="td_subTotal_name">SubTotal: </span></td>
                <td><span class="td_subTotal">$${subtotal}</span></td></tr>
                <tr><td><span class="td_donation_name">Donation: </span></td>
                <td><span class="td_donation">$${donation_amount}</span></td></tr>
                <tr><td><span class="td_Tax_name">Tax(GST%): </span></td>
                <td><span class="td_subTotal">$${tax}</span></td></tr><hr>
                <tr><td><span class="td_total_name">Total: </span></td>
                <td><span class="td_subtotal">$${total}</span></td></tr>
            
            `;

      cart_elm.appendChild(cartTotalTable);
    }
  } else {
    let cart_elm = document.getElementById("cart_items");
    cart_elm.innerHTML = "";
    cart_elm.classList.add("hide");
    const empty_elm = document.getElementById("empty");
    empty_elm.classList.remove("hide");
    const checkout_button = document.getElementById("checkout_button");
    checkout_button.classList.add("hide");
  }
}
// ***********Stop***********Update the cart*************

// ***********Start***********Remove item from the cart*************

function removeProd(prodId) {
  if (localStorage["cart"] != undefined) {
    var cart_arr = JSON.parse(window.localStorage.getItem("cart"));

    cart_arr.map(function (obj) {
      if (obj.prod_id == prodId) {
        cart_arr.splice(cart_arr.indexOf(obj), 1);
      }
      localStorage["cart"] = JSON.stringify(cart_arr);
    });
  }
  updateCart("cart");
}
// ***********Stop***********Remove item from the cart*************

// ***********Start***********Check out button function*************
function checkOut() {
  garageSaleForm.reset();
  var cust_details = document.getElementById("cust_details");
  cust_details.innerHTML = "";
  var prod_details = document.getElementById("prod_details");
  prod_details.innerHTML = "";

  var receipt_content = document.getElementById("receipt_content");
  receipt_content.style.display = "none";

  var m_content = document.getElementById("m_content");
  m_content.style.display = "block";
  // Form creation for customer input

  var modal = document.getElementById("myModal");
  var span = document.getElementsByClassName("close")[0];

  // Set the user's name in the modal
  // document.getElementById('userNameInModal').innerText = userName;

  modal.style.display = "block";

  span.onclick = function () {
    modal.style.display = "none";
  };

  // window.onclick = function (event) {
  //     if (event.target == modal) {
  //         modal.style.display = 'none';
  //     }
  // };
}

function validateFrom() {
  document.preventde;
  clearErrorMessages();
  // Get user inputs
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const creditCard = document.getElementById("creditCard").value;
  const month = document.getElementById("creditCardMonth").value;
  const year = document.getElementById("creditCardYear").value;

  let valid = true;

  // Validate name and email (mandatory fields)
  if (!name) {
    displayErrorMessage("Name is a mandatory field.", "p_name");
    valid = false;
  }

  if (!email || !validateEmailFormat(email)) {
    displayErrorMessage("Please enter valid email address.", "p_email");
    valid = false;
  }

  // Validate credit card format (xxxx-xxxx-xxxx-xxxx)
  if (creditCard && !validateCreditCardFormat(creditCard)) {
    displayErrorMessage(
      "Invalid credit card format (use xxxx-xxxx-xxxx-xxxx).",
      "p_credit"
    );
    valid = false;
  }
  // Validate credit card expiry month in format: MMM (e.g., JAN)
  if (month && !validateCreditCardMonth(month)) {
    displayErrorMessage("Invalid credit card expiry month format (use MMM).","p_month");
    valid = false;
  }

  // Validate credit card expiry year in format: yyyy (e.g., 2023)
  if (year && !validateCreditCardYear(year)) {
    displayErrorMessage("Invalid credit card expiry year format (use yyyy).","p_year");
    valid = false;
  }
  if (valid == true) {
    const cust_model = document.getElementById("m_content");
    cust_model.style.display = "none";
    const aside = document.getElementsByTagName("aside")[0];
    aside.style.display = "block";

    const cust_details = document.getElementById("cust_details");
    cust_details.style.display = "block";

    const receipt_content = document.getElementById("receipt_content");
    receipt_content.style.display = "block";

    //update customer details

    // const cartTotalTable = document.createElement("table");
    // cartTotalTable.classList.add("cart_total_div");
    // cartTotalTable.id = "cart_total_div";
   if(creditCard){
    cust_details.innerHTML = `
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Credit Card (Last 4 digits):</strong> xxxx-xxxx-xxxx ${creditCard.slice(
      -4
    )}</p>
    
`;
   }else{
    cust_details.innerHTML = `
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
  
    
`;
   }
   

    // cart_elm.appendChild(cartTotalTable);

    updateCart("receipt");
  }
}
// ***********Stop***********Check out button function*************

// Function to display error messages
function displayErrorMessage(message, field_id) {
  const errorDiv = document.getElementById(field_id);
  const errorMessage = document.createElement("span");
  errorMessage.classList.add("span_error");
  errorMessage.textContent = message;
  errorDiv.appendChild(errorMessage);
}

// Function to validate credit card format
function validateCreditCardFormat(creditCard) {
  const regex = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
  return regex.test(creditCard);
}
function validateEmailFormat(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return regex.test(email);
}
// Function to validate credit card expiry month (MMM format)
function validateCreditCardMonth(month) {
    const regex = /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)$/i;
    return regex.test(month);
}

// Function to validate credit card expiry year (yyyy format)
function validateCreditCardYear(year) {
    const regex = /^(19|20)\d{2}$/;
    return regex.test(year);
}

// Function to calculate donation amount
function calculateDonation(totalCost) {
  const donationPercentage = 0.1; // 10%
  const minimumDonation = 10;
  const donationAmount = Math.max(
    totalCost * donationPercentage,
    minimumDonation
  );
  return donationAmount.toFixed(2); // Round to two decimal places
}

// Function to clear error messages
function clearErrorMessages() {
  const errorDiv = document.getElementsByClassName("span_error");
  if (errorDiv.length > 0) {
    for (let elm in errorDiv) {
      if (errorDiv.length > elm) {
        errorDiv[elm].innerHTML = "";
      }
    }
  }
}
