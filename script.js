const qs = (el) => document.querySelector(el);
const qsa = (el) => document.querySelectorAll(el);
let modalQntd = 1;
let cart = [];
let modalKey = 0;

//Listagem Pizzas
pizzaJson.map((pizza, id) => {
    const pizzaItem = qs('.models .pizza-item').cloneNode(true);

    //Preenche os dados da pizza no body
    pizzaItem.setAttribute('data-key', id);
    pizzaItem.querySelector('img').src = pizza.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${pizza.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = pizza.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = pizza.description;

    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        const key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQntd = 1;
        modalKey = key;

        //Deetalhes da pizza no Modal
        qs('.pizzaBig img').src = pizzaJson[key].img;
        qs('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        qs('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        qs('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        qs('.pizzaInfo--size.selected').classList.remove('selected');
        qsa('.pizzaInfo--size').forEach((size, sizeId) => {
            if (sizeId == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeId];
        });
        qs('.pizzaInfo--qt').innerHTML = modalQntd;
        
        qs('.pizzaWindowArea').style.opacity = 0;
        qs('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            qs('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });

    qs('.pizza-area').append(pizzaItem);
});

//Modal Events
function closeModal() {
    qs('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        qs('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

qs('.pizzaInfo--qtmenos').addEventListener('click', () =>{
    if (modalQntd > 1) {
        modalQntd--;
        qs('.pizzaInfo--qt').innerHTML = modalQntd;
    }
});

qs('.pizzaInfo--qtmais').addEventListener('click', () =>{
    modalQntd++;
    qs('.pizzaInfo--qt').innerHTML = modalQntd;
});

qsa('.pizzaInfo--size').forEach((size) => {
    size.addEventListener('click', (e) => {
        qs('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

qs('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(qs('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id+"@"+size;

    let key = cart.findIndex((item) => item.identifier == identifier);
    if(key > -1){
        cart[key].qt += modalQntd;
    }else{
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQntd
        });    
    }

    updateCart();
    closeModal();
});

qs('.menu-openner').addEventListener('click',() => {
   if(cart.length > 0){
       qs('aside').style.left = 0;
   }
});

qs('.menu-closer').addEventListener('click', () => {
    qs('aside').style.left = '100vw';
});

function updateCart() {
    qs('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0){
        qs('aside').classList.add('show');
        qs('.cart').innerHTML = '';

        let subtotal = 0;
        let entrega = 5;
        let total = 0;

        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = qs('.models .cart--item').cloneNode(true);
            
            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                    cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
                }else{
                    cart.splice(i, 1);
                    cartItem.remove();
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
                updateCart();
            });

            qs('.cart').append(cartItem);
        }

        total = subtotal + entrega;
        qs('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
        qs('.desconto span:last-child').innerHTML = `R$ ${entrega.toFixed(2)}`
        qs('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`

    }else{
        qs('aside').classList.remove('show');
        qs('aside').style.left = '100vw';
    }
}