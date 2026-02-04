const items = [
    {
        name: "Flappy Bird Game",
        price: 5,
        category: "games",
        img: "https://th.bing.com/th/id/R.567e72625ae82468e5116ce92dc24bde?rik=kqrAxxOrUhrXPg&riu=http%3a%2f%2fassets1.ignimgs.com%2f2014%2f01%2f31%2fflappy-bird-buttonjpg-e984c2.jpg&ehk=vGlEeny7R2EyaMcNMlj4nt4YJPLB2BBtN8wG2799dWE%3d&risl=&pid=ImgRaw&r=0"
    },
    {
        name: "Optimizing your laptop — Better Performance (Windows OS)",
        price: 100,
        category: "optimizing",
        img: "https://mirillis.com/blog/wp-content/uploads/2017/10/Increase-PC-Speed-1250x917.jpg"
    },
    {
        name: "Optimizing your laptop — Less Storage Usage (Windows OS)",
        price: 100,
        category: "optimizing",
        img: "https://iphonewired.com/wp-content/uploads/2022/11/1669772263_maxresdefault.jpg"
    },
    {
        name: "Optimizing your laptop — Power Saving (Windows OS)",
        price: 50,
        category: "optimizing",
        img: "https://static1.howtogeekimages.com/wordpress/wp-content/uploads/2021/09/battery_saver_hero_3.jpg"
    },
    {
        name: "Making your laptop look like Windows 7 Glass",
        price: 50,
        category: "optimizing",
        img: "https://th.bing.com/th/id/R.789b18edc63f0c18038059b8846c9463?rik=uQ09gFWQLsp00w&riu=http%3a%2f%2fcdn.redmondpie.com%2fwp-content%2fuploads%2f2009%2f10%2fTheLaunchofWindow7AnotherMilestoneAccomp_DE09%2fD1a.png&ehk=z9Q7p4u6NcB2T47PvSsMPp8wVzjh1%2bgbH91u9IwyE1Y%3d&risl=&pid=ImgRaw&r=0"
    }
];

let cart = [];
let total = 0;

function renderItems() {
    const container = document.getElementById("itemsContainer");
    container.innerHTML = "";

    const search = document.getElementById("searchBar").value.toLowerCase();
    const category = document.getElementById("categorySelect").value;

    items
        .filter(item =>
            (category === "all" || item.category === category) &&
            item.name.toLowerCase().includes(search)
        )
        .forEach(item => {
            container.innerHTML += `
                <div class="item">
                    <img src="${item.img}">
                    <h3>${item.name}</h3>
                    <p>Price: NT$${item.price}</p>
                    Quantity: 
                    <input type="number" id="qty-${item.name}" value="1" min="1" style="width:50px;">
                    <br><br>
                    <button onclick="addToCart('${item.name}', ${item.price})">Add to Cart</button>
                </div>
            `;
        });
}

function addToCart(name, price) {
    const qty = parseInt(document.getElementById("qty-" + name).value);
    const existing = cart.find(i => i.name === name);

    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ name, price, qty });
    }

    total += price * qty;
    document.getElementById("dingSound").play();
    renderCart();
    saveCart();
}

function renderCart() {
    const list = document.getElementById("cartList");
    list.innerHTML = "";

    cart.forEach((item, index) => {
        list.innerHTML += `
            <li>${item.name} – NT$${item.price} × ${item.qty}
                <button onclick="removeItem(${index})">❌</button>
            </li>`;
    });

    document.getElementById("total").innerText = total;
    document.getElementById("paymentRule").innerText =
        total >= 500 ? "Cash Before Delivery(Pay to Leonardo in LTBrown)" : "Cash Only(Pay to Leonardo in LTBrown)";
}

function removeItem(i) {
    total -= cart[i].price * cart[i].qty;
    cart.splice(i, 1);
    renderCart();
    saveCart();
}

function checkout() {
    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    const order = cart.map(i => `${i.name} × ${i.qty} - NT$${i.price * i.qty}`).join("%0A");
    const payment = total >= 500 ? "Cash Before Delivery(Pay to Leonardo in LTBrown)" : "Cash Only(Pay to Leonardo in LTBrown)";

    window.location.href =
        `mailto:leofoooo132@gmail.com?subject=New Order&body=Order:%0A${order}%0A%0ATotal: NT$${total}%0APayment: ${payment}`;
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("total", total);
}

function loadCart() {
    const savedCart = localStorage.getItem("cart");
    const savedTotal = localStorage.getItem("total");
    if (savedCart) cart = JSON.parse(savedCart);
    if (savedTotal) total = parseInt(savedTotal);
    renderCart();
}

loadCart();
renderItems();
