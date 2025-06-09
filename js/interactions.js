/*
Description: Interactions and CRUD Operations for Order Management Page
Author: Ryan Shackleton
Course: ISM6225
Semester: Summer 2025
*/

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const ordersList = document.getElementById('orders-list');
    let orders = JSON.parse(localStorage.getItem('orders')) || [];

    function renderOrders() {
        ordersList.innerHTML = '';
        orders.forEach((order, idx) => {
            const div = document.createElement('div');
            div.innerHTML = `
                <strong>${order.name}</strong> (${order.product}, Qty: ${order.quantity})<br>
                ${order['street-address']}, ${order.city}, ${order.state} ${order.zip}<br>
                Phone: ${order['phone-number']}
                <button onclick="editOrder(${idx})">Update</button>
                <button onclick="deleteOrder(${idx})">Delete</button>
                <hr>
            `;
            ordersList.appendChild(div);
        });
    }

    window.editOrder = function(idx) {
        const order = orders[idx];
        for (let key in order) {
            if (form.elements[key]) {
                form.elements[key].value = order[key];
            }
        }
        form.dataset.editing = idx;
    };

    window.deleteOrder = function(idx) {
        orders.splice(idx, 1);
        localStorage.setItem('orders', JSON.stringify(orders));
        renderOrders();
    };

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const data = {};
        Array.from(form.elements).forEach(el => {
            if (el.name) data[el.name] = el.value;
        });
        if (form.dataset.editing) {
            orders[form.dataset.editing] = data;
            delete form.dataset.editing;
        } else {
            orders.push(data);
        }
        localStorage.setItem('orders', JSON.stringify(orders));
        form.reset();
        renderOrders();
    });

    // Product image and price preview logic
    const productImages = {
        "Painting Kit": "img/paintingkit.jpg",
        "Sculpting Kit": "img/sculptingkit.jpg",
        "DIY Kit": "img/diykit.jpg"
    };

    const productPrices = {
        "Painting Kit": 39.99,
        "Sculpting Kit": 49.99,
        "DIY Kit": 65.00
    };

    const checkboxes = document.querySelectorAll('.product-checkbox');
    const qtyInputs = document.querySelectorAll('.product-qty');
    const totalInput = document.getElementById('total');
    const productImagePreview = document.getElementById('product-image-preview');

    function updatePriceAndTotal() {
        let totalPrice = 0;
        let imagesHtml = '';
        checkboxes.forEach((cb, i) => {
            const qtyInput = qtyInputs[i];
            if (cb.checked) {
                qtyInput.disabled = false;
                const qty = parseInt(qtyInput.value, 10) || 1;
                const price = productPrices[cb.value] || 0;
                totalPrice += price * qty;
                // Add image for each selected product
                if (productImages[cb.value]) {
                    imagesHtml += `<img src="${productImages[cb.value]}" alt="${cb.value}" style="max-width:100px;max-height:100px;margin-right:10px;">`;
                }
            } else {
                qtyInput.disabled = true;
            }
        });
        totalInput.value = `$${totalPrice.toFixed(2)}`;
        productImagePreview.innerHTML = imagesHtml;
    }

    checkboxes.forEach(cb => {
        cb.addEventListener('change', updatePriceAndTotal);
    });
    qtyInputs.forEach(qty => {
        qty.addEventListener('input', updatePriceAndTotal);
    });

    // Call once on page load
    updatePriceAndTotal();

    renderOrders();
});