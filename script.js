<script>
        // Mobile menu functionality
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileMenuClose = document.querySelector('.mobile-menu-close');
        const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');

        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            mobileMenuOverlay.classList.add('active');
        });

        mobileMenuClose.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
        });

        mobileMenuOverlay.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
                // Close mobile menu if open
                mobileMenu.classList.remove('active');
                mobileMenuOverlay.classList.remove('active');
            });
        });

        // Order functionality
        let currentItem = {};
        
        function openOrderPage(itemData) {
            currentItem = itemData;
            const orderPage = document.getElementById('orderPage');
            const selectedItem = document.getElementById('selectedItem');
            
            selectedItem.innerHTML = `
                <img src="${itemData.image}" alt="${itemData.name}">
                <div class="item-details">
                    <h3>${itemData.name}</h3>
                    <p>${itemData.description}</p>
                    <div class="item-price">${itemData.price}</div>
                </div>
            `;
            
            orderPage.classList.add('active');
            document.body.style.overflow = 'hidden';
            updateOrderSummary();
        }

        function closeOrderPage() {
            const orderPage = document.getElementById('orderPage');
            orderPage.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Reset form
            document.getElementById('orderForm').reset();
            document.getElementById('quantity').value = 1;
            updateOrderSummary();
        }

        function changeQuantity(change) {
            const quantityInput = document.getElementById('quantity');
            let newQuantity = parseInt(quantityInput.value) + change;
            if (newQuantity < 1) newQuantity = 1;
            quantityInput.value = newQuantity;
            updateOrderSummary();
        }

        function updateOrderSummary() {
            const quantity = parseInt(document.getElementById('quantity').value);
            const itemPrice = parseFloat(currentItem.price);
            const orderType = document.getElementById('orderType').value;
            
            const itemTotal = itemPrice * quantity;
            const deliveryFee = orderType === 'delivery' ? 5.00 : 0.00;
            const tax = (itemTotal + deliveryFee) * 0.08;
            const finalTotal = itemTotal + deliveryFee + tax;
            
            document.getElementById('itemTotal').textContent = `${itemTotal.toFixed(2)}`;
            document.getElementById('deliveryFee').textContent = `${deliveryFee.toFixed(2)}`;
            document.getElementById('tax').textContent = `${tax.toFixed(2)}`;
            document.getElementById('finalTotal').textContent = `${finalTotal.toFixed(2)}`;
        }

        // Menu item click handlers
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', function() {
                const itemData = {
                    name: this.dataset.name,
                    price: this.dataset.price,
                    description: this.dataset.description,
                    image: this.dataset.image
                };
                openOrderPage(itemData);
            });
        });

        // Payment method selection
        document.querySelectorAll('.payment-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                this.querySelector('input[type="radio"]').checked = true;
            });
        });

        // Order type change handler
        document.getElementById('orderType').addEventListener('change', updateOrderSummary);

        // Form submission
        document.getElementById('orderForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const orderData = {
                item: currentItem,
                quantity: document.getElementById('quantity').value,
                customer: {
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    address: formData.get('address'),
                    city: formData.get('city'),
                    zipCode: formData.get('zipCode')
                },
                orderType: formData.get('orderType'),
                paymentMethod: formData.get('paymentMethod'),
                specialInstructions: formData.get('specialInstructions'),
                total: document.getElementById('finalTotal').textContent
            };
            
            // Here you would typically send the order to your backend
            console.log('Order submitted:', orderData);
            
            // Show success message
            alert('Order placed successfully! You will receive a confirmation email shortly.');
            closeOrderPage();
        });

        // Close order page when clicking outside
        document.getElementById('orderPage').addEventListener('click', function(e) {
            if (e.target === this) {
                closeOrderPage();
            }
        });
        
    // Get order details from URL
        const params = new URLSearchParams(window.location.search);
        document.getElementById('order-item-name').textContent = 
            params.get('item').replace('-', ' ');
        document.getElementById('order-item-price').textContent = 
            '$' + params.get('price');    
    </script>