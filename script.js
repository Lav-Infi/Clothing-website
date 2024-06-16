document.addEventListener("DOMContentLoaded", function() {
    const products = [
        { name: 'Item 1', price: 50, image: 'cloths/item1.jpeg' },
        { name: 'Item 2', price: 75, image: 'cloths/item2.jpeg' },
        { name: 'Item 3', price: 60, image: 'cloths/item3.jpeg' },
        { name: 'Item 4', price: 90, image: 'cloths/item4.jpeg' },
        { name: 'Item 5', price: 80, image: 'cloths/item5.jpeg' },
        { name: 'Item 6', price: 55, image: 'cloths/item6.jpeg' },
        { name: 'Item 7', price: 65, image: 'cloths/item7.jpeg' },
        { name: 'Item 8', price: 70, image: 'cloths/item8.jpeg' },
        { name: 'Item 9', price: 85, image: 'cloths/item9.jpeg' },
        { name: 'Item 10', price: 95, image: 'cloths/item10.jpeg' }
    ];

    let filteredProducts = products.slice(); // Create a copy of the original array
    let cart = [];

    function displayProducts(productsToDisplay) {
        const productGrid = document.querySelector('.product-grid');
        if (productGrid) {
            productGrid.innerHTML = '';
            productsToDisplay.forEach(product => {
                const productItem = document.createElement('div');
                productItem.className = 'product-item';
                productItem.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <p>${product.name} - $${product.price}</p>
                    <button class="buy-now" onclick="addToCart('${product.name}', ${product.price})">Buy Now</button>
                `;
                productGrid.appendChild(productItem);
            });
        }
    }

    function filterProducts(filterValue) {
        let filtered;
        if (filterValue === 'all') {
            filtered = products.slice(); // Create a copy of the original array
        } else {
            filtered = products.filter(product => product.price <= parseInt(filterValue));
        }
        displayProducts(filtered);
    }

    function sortProducts(sortValue) {
        let sorted = products.slice(); // Create a copy of the original array
        if (sortValue === 'asc') {
            sorted.sort((a, b) => a.price - b.price);
        } else {
            sorted.sort((a, b) => b.price - a.price);
        }
        displayProducts(sorted);
    }

    if (document.getElementById('filter')) {
        document.getElementById('filter').addEventListener('change', function() {
            filterProducts(this.value);
        });
    }

    if (document.getElementById('sort')) {
        document.getElementById('sort').addEventListener('change', function() {
            sortProducts(this.value);
        });
    }

    displayProducts(filteredProducts);

    window.addToCart = function(itemName, price) {
        cart.push({ name: itemName, price });
        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.href = 'payment.html';
    }

    function validatePaymentForm() {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const cardNumber = document.getElementById('cardNumber').value;
        const expiry = document.getElementById('expiry').value;
        const cvv = document.getElementById('cvv').value;

        if (!name || !email || !address || !cardNumber || !expiry || !cvv) {
            alert('Please fill in all the fields.');
            return false;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address.');
            return false;
        }

        const cardPattern = /^\d{16}$/;
        if (!cardPattern.test(cardNumber)) {
            alert('Please enter a valid 16-digit card number.');
            return false;
        }

        const cvvPattern = /^\d{3}$/;
        if (!cvvPattern.test(cvv)) {
            alert('Please enter a valid 3-digit CVV.');
            return false;
        }

        return true;
    }

    window.proceedToPay = function(event) {
        event.preventDefault();
        console.log('Proceeding to pay...');
        if (validatePaymentForm()) {
            console.log('Form validated successfully');
            window.location.href = 'thankyou.html';
        } else {
            console.log('Form validation failed');
        }
    }

    function fetchReviews() {
        console.log('Fetching reviews...');
        fetch('https://randomuser.me/api/?results=5')
            .then(response => response.json())
            .then(data => {
                console.log('Data received:', data);
                const reviewsContainer = document.querySelector('.reviews-container');
                if (!reviewsContainer) {
                    console.error('No reviews container found on this page.');
                    return;
                }
                data.results.forEach(user => {
                    const reviewItem = document.createElement('div');
                    reviewItem.className = 'review-item';
                    reviewItem.innerHTML = `
                        <img src="${user.picture.medium}" alt="${user.name.first}">
                        <p><strong>${user.name.first} ${user.name.last}</strong></p>
                        <p>${user.location.city}, ${user.location.country}</p>
                        <p>Rating: ${Math.floor(Math.random() * 5) + 1}/5</p>
                        <p>"Excellent product quality and fast delivery!"</p>
                    `;
                    reviewsContainer.appendChild(reviewItem);
                });

                // Set up sliding animation
                const reviews = document.querySelectorAll('.review-item');
                let currentReviewIndex = 0;
                setInterval(() => {
                    reviews.forEach((review, index) => {
                        review.style.display = index === currentReviewIndex ? 'block' : 'none';
                    });
                    currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
                }, 3000);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }

    // Check if on thankyou.html page
    if (window.location.pathname.includes('thankyou.html')) {
        fetchReviews();
    }

    displayProducts(filteredProducts);
});
