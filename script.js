const movies = [
  {
    id: 1,
    title: "The Last Sunset",
    genre: "Adventure · Drama",
    duration: "2h 10m",
    price: 180,
    icon: "🌅",
    description: "A beautiful journey of hope, courage and new beginnings.",
    showtimes: ["10:00 AM", "1:30 PM", "6:00 PM"]
  },
  {
    id: 2,
    title: "Ocean of Dreams",
    genre: "Romance · Fantasy",
    duration: "1h 55m",
    price: 220,
    icon: "🌊",
    description: "Two strangers discover a world beyond their imagination.",
    showtimes: ["11:00 AM", "3:00 PM", "7:30 PM"]
  },
  {
    id: 3,
    title: "Midnight Mystery",
    genre: "Mystery · Thriller",
    duration: "2h 05m",
    price: 200,
    icon: "🌙",
    description: "One mysterious night. Three clues. A secret waiting to unfold.",
    showtimes: ["9:30 AM", "2:00 PM", "8:00 PM"]
  }
];

const movieGrid = document.getElementById("movieGrid");
const bookingList = document.getElementById("bookingList");

let bookings = [];

// DISPLAY MOVIES
function renderMovies() {
  if (!movieGrid) return;

  movieGrid.innerHTML = movies.map((movie, index) => `
    <article class="movie-card">
      <div class="movie-poster ${
        index === 1 ? "poster-two" :
        index === 2 ? "poster-three" : ""
      }">
        <span class="poster-icon">${movie.icon}</span>
        <span class="poster-label">NOW SHOWING</span>
      </div>

      <div class="movie-info">
        <h3>${movie.title}</h3>
        <p class="movie-meta">${movie.genre} · ${movie.duration}</p>
        <p class="movie-description">${movie.description}</p>

        <div class="movie-bottom">
          <span class="movie-price">₹${movie.price}</span>
          <button class="book-button" data-movie-id="${movie.id}">
            Book Tickets
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

// BOOK MOVIE TICKETS
function bookMovie(movieId) {
  const movie = movies.find(item => item.id === movieId);
  if (!movie) return;

  const showtime = prompt(
    `Choose a showtime for ${movie.title}:\n` +
    movie.showtimes.map((time, i) => `${i + 1}. ${time}`).join("\n") +
    "\nEnter 1, 2 or 3:"
  );

  if (showtime === null) return;

  const timeIndex = Number(showtime) - 1;

  if (
    !Number.isInteger(timeIndex) ||
    !movie.showtimes[timeIndex]
  ) {
    alert("Please enter 1, 2 or 3 to choose a valid showtime.");
    return;
  }

  const seatsInput = prompt("How many tickets? Enter a number from 1 to 10.");

  if (seatsInput === null) return;

  const seats = Number(seatsInput);

  if (!Number.isInteger(seats) || seats < 1 || seats > 10) {
    alert("Please choose between 1 and 10 tickets.");
    return;
  }

  const subtotal = movie.price * seats;

  // 10% discount on 2 or more Ocean of Dreams tickets
  const discount =
    movie.title === "Ocean of Dreams" && seats >= 2
      ? Math.round(subtotal * 0.10)
      : 0;

  const total = subtotal - discount;

  const booking = {
    reference: "IM" + Date.now().toString().slice(-7),
    title: movie.title,
    time: movie.showtimes[timeIndex],
    seats: seats,
    subtotal: subtotal,
    discount: discount,
    total: total
  };

  bookings.push(booking);
  renderBookings();

  alert(
    `Booking created successfully!\n\n` +
    `Movie: ${booking.title}\n` +
    `Showtime: ${booking.time}\n` +
    `Tickets: ${booking.seats}\n` +
    `Subtotal: ₹${booking.subtotal}\n` +
    `Discount: -₹${booking.discount}\n` +
    `Final total: ₹${booking.total}\n` +
    `Reference: ${booking.reference}`
  );

  const bookingSection = document.getElementById("bookings");

  if (bookingSection) {
    bookingSection.scrollIntoView({ behavior: "smooth" });
  }
}

// BOOKING BUTTON CLICK
if (movieGrid) {
  movieGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-movie-id]");
    if (!button) return;

    bookMovie(Number(button.dataset.movieId));
  });
}

// DISPLAY BOOKINGS
function renderBookings() {
  if (!bookingList) return;

  if (bookings.length === 0) {
    bookingList.innerHTML =
      "<p>Your bookings will appear here after you reserve tickets.</p>";
    return;
  }

  bookingList.innerHTML = bookings.map(booking => `
    <div class="booking-item">
      <h3>${booking.title}</h3>
      <p>Showtime: ${booking.time}</p>
      <p>Tickets: ${booking.seats}</p>
      <p>Ticket subtotal: ₹${booking.subtotal}</p>
      ${
        booking.discount > 0
          ? `<p style="color:#536B55;font-weight:700">
               Ocean of Dreams offer: -₹${booking.discount}
             </p>`
          : ""
      }
      <p><strong>Final total: ₹${booking.total}</strong></p>
      <p>Reference: ${booking.reference}</p>
    </div>
  `).join("");
}

// FOOD CART
const foodCart = {};

function addFood(name, price) {
  if (foodCart[name]) {
    foodCart[name].quantity++;
  } else {
    foodCart[name] = {
      price: price,
      quantity: 1
    };
  }

  renderFoodCart();
}

function renderFoodCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  if (!cartItems || !cartTotal) return;

  let total = 0;
  let html = "";

  for (const name in foodCart) {
    const item = foodCart[name];
    const subtotal = item.price * item.quantity;

    total += subtotal;

    html += `
      <div class="cart-row">
        <span>${name} × ${item.quantity}</span>
        <span>₹${subtotal}</span>
        <button onclick="removeFood('${name}')">Remove</button>
      </div>
    `;
  }

  cartItems.innerHTML = html || "Your cart is empty.";
  cartTotal.textContent = `Total: ₹${total}`;
}

function removeFood(name) {
  delete foodCart[name];
  renderFoodCart();
}

// OFFER POPUP
const offerPopup = document.getElementById("offerPopup");
const closeOffer = document.getElementById("closeOffer");
const claimOffer = document.getElementById("claimOffer");

if (offerPopup && typeof offerPopup.showModal === "function") {
  if (!offerPopup.open) {
    offerPopup.showModal();
  }
}

if (closeOffer && offerPopup) {
  closeOffer.addEventListener("click", () => {
    offerPopup.close();
  });
}

if (claimOffer && offerPopup) {
  claimOffer.addEventListener("click", () => {
    offerPopup.close();

    const moviesSection = document.getElementById("movies");

    if (moviesSection) {
      moviesSection.scrollIntoView({ behavior: "smooth" });
    }
  });
}

// INITIALISE WEBSITE
renderMovies();
renderBookings();
renderFoodCart();