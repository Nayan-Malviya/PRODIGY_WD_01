document.addEventListener("DOMContentLoaded", () => {
  const loader = document.querySelector(".loader-container");
  setTimeout(() => {
    loader.classList.add("fade-out");
  }, 2000);

  // Retrieve cart items from localStorage
  const storedCartItems = localStorage.getItem("cartItems");
  if (storedCartItems) {
    cartItems = JSON.parse(storedCartItems);
    updateCartDisplay();
  }

  // Check the current hash and show the corresponding section
  handleHashChange();
  window.addEventListener("hashchange", handleHashChange);
});

document.addEventListener("scroll", () => {
  const nav = document.querySelector(".navbar");
  nav.classList.toggle("navbar-scrolled", window.scrollY > 50);
});

const landingBackground = document.querySelector("#landing-background");
const images = ["bg-1.jpeg", "bg-2.jpeg", "bg-3.jpeg", "bg-4.jpeg", "bg-5.jpeg"];
images.forEach((image) => {
  const img = document.createElement("img");
  img.src = `assets/backgrounds/${image}`;
  img.classList.add("landing-background-image");
  landingBackground.appendChild(img);
});

const backgroundIndicators = document.querySelector("#background-indicators");
images.forEach((image, index) => {
  const indicator = document.createElement("div");
  if (index === 0) {
    indicator.classList.add("active");
  }
  indicator.classList.add("background-indicator");
  indicator.addEventListener("click", () => {
    index = images.indexOf(image);
    slideImages();
  });
  backgroundIndicators.appendChild(indicator);
});

const landingBackgroundImages = document.querySelectorAll("#landing-background img");

let index = 0;
const nextSlide = () => {
  index++;
  if (index > landingBackgroundImages.length - 1) {
    index = 0;
  }
  slideImages();
};

landingBackgroundImages.forEach((image, index) => {
  image.style.left = `${index * 100}%`;
});

let autoSlide = setInterval(nextSlide, 7000);

const slideImages = () => {
  landingBackgroundImages.forEach((image) => {
    image.style.transform = `translateX(-${index * 100}%)`;
  });
  clearInterval(autoSlide);
  autoSlide = setInterval(nextSlide, 7000);
  backgroundIndicators.querySelectorAll("div").forEach((indicator, i) => {
    if (i === index) {
      indicator.classList.add("active");
    } else {
      indicator.classList.remove("active");
    }
  });
};

const prevSlide = () => {
  index--;
  if (index < 0) {
    index = landingBackgroundImages.length - 1;
  }
  slideImages();
};

backgroundIndicators.querySelectorAll("div").forEach((indicator, i) => {
  indicator.addEventListener("click", () => {
    index = i;
    slideImages();
  });
});

const menuItemsContainer = document.querySelector(".menu-items-container");
const menuItemsDetails = document.querySelector("#menu-item-details");
const overlay = document.querySelector(".menu-item-detailed-overlay");

// Global cart array
let cartItems = [];

// Function to add item to cart
function addToCart(itemName, price) {
  const item = {
    name: itemName,
    price: price
  };
  cartItems.push(item);
  showMessage(`"${itemName}" added to cart!`);
  updateCartDisplay();
  closePopUp();
  saveCartToLocalStorage();
}

function showMessage(message) {
  const messageContainer = document.getElementById('message-container');
  messageContainer.textContent = message;
  messageContainer.style.display = 'block';

  setTimeout(() => {
    messageContainer.style.display = 'none';
  }, 2000); // Message will disappear after 2 seconds
}


// Function to close pop-up
function closePopUp() {
  const activeDetails = document.querySelector(".menu-item-detailed.active");
  if (activeDetails) {
    activeDetails.classList.remove("active");
    overlay.classList.remove("active");
  }
}

// Function to update cart display (if you have a cart section)
function updateCartDisplay() {
  const cartSection = document.querySelector("#cart-items-container");
  cartSection.innerHTML = ""; // Clear previous contents
  cartItems.forEach((item, index) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
      <p>${item.name} - $${item.price.toFixed(2)}</p>
      <button class="remove-button" onclick="removeFromCart(${index})">Remove</button>
    `;
    cartSection.appendChild(cartItem);
  });
  updateTotalCost();
}

// Function to update total cost
function updateTotalCost() {
  const totalCostElement = document.querySelector("#total-cost");
  const totalCost = cartItems.reduce((total, item) => total + item.price, 0);
  totalCostElement.textContent = `Total: $${totalCost.toFixed(2)}`;
}

// Function to remove item from cart
function removeFromCart(index) {
  cartItems.splice(index, 1);
  updateCartDisplay();
  saveCartToLocalStorage();
}

// Function to save cart to localStorage
function saveCartToLocalStorage() {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

// Function to handle hash change
// function handleHashChange() {
//   const hash = window.location.hash || "#main";
//   document.querySelectorAll("main > div").forEach((section) => {
//     section.style.display = section.id === hash.substring(1) ? "block" : "none";
//   });
// }
document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.nav-link');

  // Function to handle hash changes and show the appropriate section
  function handleHashChange() {
    const hash = window.location.hash || "#main";
    if (hash === "#main") {
      document.getElementById('main').style.display = 'block';
      document.getElementById('menu').style.display = 'block';
      document.getElementById('cart').style.display = 'none';
    } else {
      document.querySelectorAll("main > div").forEach((section) => {
        section.style.display = section.id === hash.substring(1) ? "block" : "none";
      });
    }
  }

  // Event listeners for navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      const route = this.getAttribute('href');
      window.location.hash = route;
    });
  });

  // Listen for hash changes
  window.addEventListener('hashchange', handleHashChange);

  // Initially display the correct section based on the current hash
  handleHashChange();
});


// Fetch and display menu items
fetch("/assets/foods.json")
  .then(async (menuItems) => {
    menuItems = await menuItems.json();
    let i = 0;
    let j = 0;
    menuItems.forEach((item, index) => {
      const menuItemDetails = document.createElement("div");
      menuItemDetails.classList.add("menu-item-detailed");
      menuItemDetails.style.backgroundImage = `url(${item.images[1]})`;
      menuItemDetails.innerHTML = `
      <button class="close">&#10006;</button>
      <div class="bottom-content">
        <div class="headings">
          <h3>$ ${item.price}</h3>
          <h2>${item.name}</h2>
        </div>
        <p>
          ${item.description}
        </p>
        <button class="button-primary" onclick="addToCart('${item.name}', ${item.price})">Add to Cart</button>
      </div>
        `;

      menuItemDetails.querySelector(".close").addEventListener("click", () => {
        overlay.classList.remove("active");
        menuItemDetails.classList.remove("active");
      });

      const menuItemImage = document.createElement("div");
      menuItemImage.classList.add("menu-item-image");
      menuItemImage.classList.add("menu-item");
      menuItemImage.innerHTML = `
      <img src="${item.images[0]}" alt="" />
      <img src="/assets/zoom-in-icon.svg" alt="" class="icon" />
      <span class="overlay"></span>
      `;
      menuItemImage.addEventListener("click", () => {
        overlay.classList.add("active");
        menuItemDetails.classList.add("active");
      });

      const menuItemInfo = document.createElement("div");
      menuItemInfo.classList.add("menu-item-info");
      menuItemInfo.classList.add(`menu-item`);
      menuItemInfo.innerHTML = `
      <h3>$${item.price}</h3>
      <h2>${item.name}</h2>
      <span> &#9733; </span>
      <p>
        ${item.description}
      </p>
      `;
      menuItemInfo.addEventListener("click", () => {
        menuItemDetails.classList.add("active");
        overlay.classList.add("active");
      });

      menuItemImage.addEventListener("mouseover", () => {
        menuItemImage.querySelector(".overlay").classList.add("active");
        menuItemImage.querySelector(".icon").classList.add("active");
      });
      menuItemImage.addEventListener("mouseout", () => {
        menuItemImage.querySelector(".overlay").classList.remove("active");
        menuItemImage.querySelector(".icon").classList.remove("active");
      });

      menuItemInfo.addEventListener("mouseover", () => {
        menuItemImage.querySelector(".icon").classList.add("active");
      });
      menuItemInfo.addEventListener("mouseout", () => {
        menuItemImage.querySelector(".icon").classList.remove("active");
      });

      menuItemsDetails.appendChild(menuItemDetails);

      if (i % 2 === 0) {
        menuItemsContainer.appendChild(menuItemInfo);
        menuItemsContainer.appendChild(menuItemImage);
      } else {
        menuItemsContainer.appendChild(menuItemImage);
        menuItemsContainer.appendChild(menuItemInfo);
      }

      if (j >= 1) {
        j = 0;
        i++;
      } else {
        j++;
      }
    });
  })
  .catch((error) => {
    console.error("Error fetching menu items:", error);
  });

// Scrollbar
const scroll = document.querySelector(".scrollbar");
document.addEventListener("scroll", () => {
  scroll.style.height = `${(window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100}vh`;
});
