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

    items.filter(item =>
        (category === "all" || item.category === category) &&
        item.name.toLowerCase().includes(search)
    ).forEach(item => {
        container.innerHTML += `
            <div class="item">
                <img src="${item.img}">
                <h3>${item.name}</h3>
                <p>NT$${item.price}</p>
                <input type="number" id="qty-${item.name}" value="1" min="1">
                <button onclick="addToCart('${item.name}', ${item.price})">
                    Add to Cart
                </button>
            </div>
        `;
    });
}

function addToCart(name, price) {
    const qty = parseInt(document.getElementById("qty-" + name).value);
    const found = cart.find(i => i.name === name);

    if (found) {
        found.qty += qty;
    } else {
        cart.push({ name, price, qty });
    }

    total += price * qty;
    document.getElementById("dingSound").play();
    renderCart();
}

function renderCart() {
    const list = document.getElementById("cartList");
    list.innerHTML = "";

    cart.forEach((item, i) => {
        list.innerHTML += `
            <li>${item.name} × ${item.qty}
                <button onclick="removeItem(${i})">❌</button>
            </li>
        `;
    });

    document.getElementById("total").innerText = total;
    document.getElementById("paymentRule").innerText =
        total >= 500 ? "Cash Before Delivery" : "Cash Only";
}

function removeItem(index) {
    total -= cart[index].price * cart[index].qty;
    cart.splice(index, 1);
    renderCart();
}

function checkout() {
    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }
    alert("Order sent!");
}

renderItems();
