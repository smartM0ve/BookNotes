let input       = document.getElementById("inputSearch");
let list_items  = document.getElementById("search-items");

async function searchBook(){
    if (input.value !== "") {
        //let searchForm = document.getElementById("searchForm");
        //searchForm.submit();

        if (input.value !== "") {

            list_items.innerHTML = '';
            list_items.style.display = 'none';
            
            const url = `https://openlibrary.org/search.json?q=${input.value}&limit=10`;

            try{
                const response  = await axios.get(url);
                const result    = response.data;

                result.docs.forEach(element => {
                    var node = document.createElement('li');
                    
                    const cover_link = `https://covers.openlibrary.org/b/id/${element.cover_i}-S.jpg`;
                    let cover_tag
                    if (element.cover_i !== undefined) {
                        cover_tag   = `<img src="${cover_link}" alt="book cover" onclick="searchSelect(${element.cover_i});">`
                    } else {
                        cover_tag   = `<div style="width: 40px; height: 60px; background-color: darkgray; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: x-large;">?</div>`
                    }

                    // node.addEventListener("click", function () {
                    //         searchSelect(element.cover_i);
                    // });
                    
                    node.innerHTML = `${cover_tag}
                                        <div class="search-item-title">
                                            <div style="font-weight: 400;">${element.title}</div>
                                            <div style="font-size: small;">by ${element.author_name}</div>
                                            <div style="display:flex; justify-content:end;"><a href="https://openlibrary.org${element.key}" target="_blank"><i class="fa fa-external-link"></i></a></div>
                                        </div>`;

                    list_items.appendChild(node);
                });

                if (result.docs.length > 0) list_items.style.display = 'block';

            } catch (error) {
                console.error("Failed to make request:", error.message);
            }

        } else {
            let list_items = document.getElementById("search-items");
            list_items.style.display = 'none';
        }

    } else {
        let list_items = document.getElementById("search-items");
        list_items.style.display = 'none';
    }
}

function searchSelect(id){
    console.log(`Cover id: ${id}`);
}

// Automatic search
input.addEventListener("keyup",
    //onInputChange
    debounce(searchBook,500)
);

input.addEventListener("focus", () => {
    //let list_items = document.getElementById("search-items");
    if (list_items != null)
        if (input.value !== "") list_items.style.display = 'block';
    }
);

// https://www.freecodecamp.org/news/debounce-explained-how-to-make-your-javascript-wait-for-your-user-to-finish-typing-2/
function debounce(callback, delay) {
    let timeout;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(callback, delay);
    }
}
function debounceArgs(callback, delay) {
    let timeout;
    return function(...args) { // Modified from original
        clearTimeout(timeout);
        timeout = setTimeout(() => { callback(...args);}, delay);
    }
}

// Close the dropdown if the user clicks outside of it
// window.onclick = function(event) {
//     if (!event.target.matches('#inputSearch') && !event.target.matches('#search-items')) {
//         //let list_items = document.getElementById("search-items");
//         if (list_items) {
//             list_items.style.display = 'none';
//         }
//     }
// }

input.addEventListener("focusout", debounce(()=>list_items.style.display = 'none',200));
input.addEventListener("focusin", () => {
    if (input.value !== "") {
        if (list_items.childElementCount > 0)
            list_items.style.display = 'block';
        else
            list_items.style.display = 'none';
    } else {
        list_items.innerHTML = '';
        list_items.style.display = 'none';
    }
});




// Event delegation for input changes on cards
const cardsContainer = document.getElementById("cards-list");

cardsContainer.addEventListener('input', function(event) {
    if (event.target && event.target.matches('.title')) {
        // Ensure the event target is inside a .card
        const cardElement = event.target.closest('.card');
        if (cardElement) {
            // If closest() finds the .card, you can safely get the attribute
            const cardId = cardElement.id; // Using the card id directly
            // const newValue = event.target.innerText || event.target.value;
            //debouncedInputChange(cardId,newValue);

            // const cardInput   = document.querySelector(`#${cardId} .title`);
            // const cardList    = document.querySelector(`#${cardId} .search-items`);

            debouncedInputChange(cardId)
    
        } else {
            console.error('No parent card found for this input');
        }
    }

});
cardsContainer.addEventListener('focusin', function(event) {
    if (event.target && event.target.matches('.title')) {
        // Ensure the event target is inside a .card
        const cardElement = event.target.closest('.card');
        if (cardElement) {
            const cardId = cardElement.id; // Using the card id directly
            //const newValue = event.target.innerText || event.target.value;

            // Show books search list
            const cardInput   = document.querySelector(`#${cardId} .title`);
            const cardList    = document.querySelector(`#${cardId} .search-items`);

            if (cardInput.innerHTML !== "") {
                if (cardList.childElementCount > 0)
                    cardList.style.display = 'block';
                else
                cardList.style.display = 'none';
            } else {
                cardList.innerHTML = '';
                cardList.style.display = 'none';
            }
        }
    }
});
cardsContainer.addEventListener('focusout', function(event) {
    if (event.target && event.target.matches('.title')) {
        // Ensure the event target is inside a .card
        const cardElement = event.target.closest('.card');
        if (cardElement) {
            const cardId = cardElement.id; // Using the card id directly
            //const newValue = event.target.innerText || event.target.value;

            // Show books search list
            const cardInput   = document.querySelector(`#${cardId} .title`);
            const cardList    = document.querySelector(`#${cardId} .search-items`);

            debouncedHideList(cardList);
        }
    }
});

// Create the debounced version of the callback
const debouncedInputChange = debounceArgs(searchBookCard, 1500);
const debouncedHideList = debounceArgs((list)=>list.style.display = 'none', 200);

function searchCardSelect(cardId,title,author,coverId) {
    const cardInput     = document.querySelector(`#${cardId} .title`);
    const cardAuthor    = document.querySelector(`#${cardId} .author`);
    const cardCoverId   = document.querySelector(`#${cardId} .cover-id`);
    const cardCover   = document.querySelector(`#${cardId} .cover`);

    cardInput.innerHTML     = title;
    cardAuthor.innerHTML    = author;
    cardCoverId.innerHTML   = coverId;

    if (coverId === undefined || coverId == 'undefined') {
        console.log('Inside undefined: ' + coverId);
        var newElement = document.createElement('div');
        newElement.id  = cardCover.id;
        newElement.innerHTML  = "?";
        newElement.classList.add("cover");
        newElement.classList.add("cover-empty");
        cardCover.parentNode.replaceChild(newElement, cardCover);
        return;
    }

    if (cardCover.tagName === 'img') {
        console.log('Inside img: ' + coverId);
        // cardCover.setAttribute("src",`https://covers.openlibrary.org/b/id/${coverId}-L.jpg`)
    } else {
        console.log('Inside div: ' + coverId);
        var newElement = document.createElement('img');
        newElement.id  = cardCover.id;
        newElement.src = `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
        newElement.alt = "book cover";
        newElement.className    = "cover"; //cardCover.className;
        cardCover.parentNode.replaceChild(newElement, cardCover);
    }
}



// Search books on cards
async function searchBookCard(cardId){
    
    const cardInput   = document.querySelector(`#${cardId} .title`);
    const cardList    = document.querySelector(`#${cardId} .search-items`);

    if (cardInput.innerHTML !== "") {

        cardList.innerHTML = '';
        cardList.style.display = 'none';
        
        const url = `https://openlibrary.org/search.json?q=${cardInput.innerHTML}&limit=10`;

        try{
            const response  = await axios.get(url);
            const result    = response.data;

            result.docs.forEach(element => {
                var node = document.createElement('li');
                
                const cover_link = `https://covers.openlibrary.org/b/id/${element.cover_i}-S.jpg`;
                let cover_tag
                if (element.cover_i !== undefined) {
                    cover_tag   = `<img src="${cover_link}" alt="book cover">`
                } else {
                    cover_tag   = `<div style="width: 40px; height: 60px; background-color: darkgray; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: x-large;">?</div>`
                }

                node.innerHTML = `${cover_tag}
                                    <div class="search-item-title" onclick="searchCardSelect('${cardId}','${element.title}','${element.author_name}',${element.cover_i});">
                                        <div style="font-weight: 400;">${element.title}</div>
                                        <div style="font-size: small;">by ${element.author_name}</div>
                                        <div style="display:flex; justify-content:end;"><a href="https://openlibrary.org${element.key}" target="_blank"><i class="fa fa-external-link"></i></a></div>
                                    </div>`;

                cardList.appendChild(node);
            });

            if (result.docs.length > 0) cardList.style.display = 'block';

        } catch (error) {
            console.error("Failed to make request:", error.message);
        }

    } else {
        cardList.style.display = 'none';
    }
    
}














// Auxiliar variables
let booksMap    = new Map();

function enableFields(id) {

    // readonly/contenteditable inputs attribute / show elements
    const buttonEdit    = document.getElementById("edit"+id).setAttribute("hidden",true);
    const buttonSave    = document.getElementById("save"+id).removeAttribute("hidden");
    const buttonCancel  = document.getElementById("cancel"+id).removeAttribute("hidden");
    const buttonDelete  = document.getElementById("delete"+id).removeAttribute("hidden");

    const bookTitle     = document.getElementById("title"+id);
    const bookAuthor    = document.getElementById("author"+id);
    const readDate      = document.getElementById("date"+id);
    const ratingValue   = document.getElementById("ratingValue"+id);
    //const ratingStars   = document.getElementById('ratingStars'+id);
    const ratingStars   = document.querySelectorAll('#ratingStars'+id+' .star');
    const bookNote      = document.getElementById("note"+id);
    const bookCover     = document.getElementById("cover"+id);
    const bookCoverId   = document.getElementById("cover_id"+id);

    bookTitle.setAttribute("contenteditable","plaintext-only");
    bookAuthor.setAttribute("contenteditable","plaintext-only");
    readDate.setAttribute("contenteditable","plaintext-only");
    bookNote.setAttribute("contenteditable","plaintext-only");

    bookCoverId.setAttribute("contenteditable","plaintext-only");
    bookCoverId.removeAttribute("hidden");
    
    ratingStars.forEach((star, index) => {
        star.classList.add("star-editable");
        star.setAttribute('onclick', `handlerStars(${id},${index + 1})`);
    });
    //rating.setAttribute("contenteditable",true);

    booksMap.set(id, {
                        title: bookTitle.innerHTML,
                        author: bookAuthor.innerHTML,
                        date: readDate.innerHTML,
                        rating: ratingValue.innerHTML,
                        note: bookNote.innerHTML,
                        cover: bookCover.src,
                        cover_id: bookCoverId.innerHTML
                    });

}

function disableFields(id,cancel = false) {

    // readonly/contenteditable inputs attribute / hide elements
    const buttonEdit = document.getElementById("edit"+id).removeAttribute("hidden");
    const buttonSave = document.getElementById("save"+id).setAttribute("hidden",true);
    const buttonCancel = document.getElementById("cancel"+id).setAttribute("hidden",true);
    const buttonDelete = document.getElementById("delete"+id).setAttribute("hidden",true);

    const bookTitle   = document.getElementById("title"+id);
    const bookAuthor  = document.getElementById("author"+id);
    const readDate    = document.getElementById("date"+id);
    const ratingValue = document.getElementById("ratingValue"+id);
    const ratingStars   = document.querySelectorAll('#ratingStars'+id+' .star');
    const bookNote    = document.getElementById("note"+id);
    const bookCover     = document.getElementById("cover"+id);
    const bookCoverId   = document.getElementById("cover_id"+id);

    bookTitle.removeAttribute("contenteditable");
    bookAuthor.removeAttribute("contenteditable");
    readDate.removeAttribute("contenteditable");
    bookNote.removeAttribute("contenteditable");

    bookCoverId.removeAttribute("contenteditable");
    bookCoverId.setAttribute("hidden",true);

    if (cancel == true) {
        let bookAux = booksMap.get(id);
        bookTitle.innerHTML     = bookAux.title;
        bookAuthor.innerHTML    = bookAux.author;
        readDate.innerHTML      = bookAux.date;
        ratingValue.innerHTML   = bookAux.rating;
        bookNote.innerHTML      = bookAux.note;
        bookCover.src           = bookAux.cover;
        bookCoverId.innerHTML   = bookAux.cover_id;

        if (bookCoverId.innerHTML == "") {
            const bookCover  = document.getElementById("cover"+id);
            //<div style="width: 130px; height: 180px; border: 1px solid var(--text-color); border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: xxx-large;" class="cover">?</div>
            var newElement = document.createElement('div');
            newElement.id   = "cover"+id;
            newElement.classList.add("cover");
            newElement.classList.add("cover-empty");
            newElement.innerHTML = "?";
            console.log(bookCover);
            bookCover.parentNode.replaceChild(newElement, bookCover);
        }

    }
    booksMap.delete(id);

    ratingStars.forEach((star, index) => {
        star.classList.remove("star-editable");
        star.removeAttribute('onclick');

        if (ratingValue.innerHTML < index + 1) {
            star.classList.remove('star-selected');
        } else {
            star.classList.add('star-selected');
        }
    });

}

function handlerEdit(id) {
    
    enableFields(id);

}

function handlerSave(id) {

    // Call edit function
    //const url = `/edit`;
    const url = id != '-new' ? `/edit` : `/add`;
    
    console.log(id);
    console.log(url);

    let bookTitle   = document.getElementById("title"+id).innerHTML;
    let bookCover   = document.getElementById("cover_id"+id).innerHTML;
    let bookAuthor  = document.getElementById("author"+id).innerHTML;
    let readDate    = document.getElementById("date"+id).innerHTML;
    let rating      = document.getElementById("ratingValue"+id).innerHTML;
    let bookNote    = document.getElementById("note"+id).innerHTML;

    if (rating == '') rating = 0;

    bookNote = bookNote.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();

    const [day, month, year] = readDate.split('/'); // Split date with "/"
    readDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`; // Format to YYYY-MM-DD

    try{
        axios.post(url, { id: id,
                            title: bookTitle,
                            author: bookAuthor,
                            date: readDate,
                            rating: rating,
                            note: bookNote,
                            cover_id: bookCover })
        .then(function(response) {
            message(response.data.message);
        })
        .catch(function(error) {
            console.error('Erro na requisição:', error);
        });

    } catch (error) {
        console.error("Failed to make request:", error.message);
    }

    setTimeout(()=> {
        window.location.reload();
    },3000); // wait 3 seconds to reload the page.
    
    if (url != '/add') disableFields(id);
}

function handlerCancel(id) {

    disableFields(id,true);

}

async function handlerDelete(id) {

    const card   = document.getElementById('card'+id);

    const url = '/delete';

    try{

        const response = await axios.post(url, {deleteId:id})
        if (response.data.message == "") {
            message('Apagado com sucesso!');
            card.remove();
        } else {
            console.log(response.data.message);
        }

        setTimeout(()=> {
            window.location.reload();
        },3000); // wait 3 seconds to reload the page.

    } catch(error) {
        console.log(error);
    }

}

function handlerStars(id, starId) {

    const ratingValue   = document.getElementById('ratingValue'+id);
    //const ratingStars   = document.getElementById('ratingStars'+id);
    const ratingStars   = document.querySelectorAll('#ratingStars'+id+' .star');

    // if click the same rating, remove rating (0)
    if (starId == ratingValue.innerHTML)
        ratingValue.innerHTML = 0;
    else
        ratingValue.innerHTML = starId;

    // for each star, add/remove class
    ratingStars.forEach((star, index) => {
        if (ratingValue.innerHTML < index + 1) {
            star.classList.remove('star-selected');
        } else {
            star.classList.add('star-selected');
        }
    });

}

function message(mensagem) {
    const message = document.getElementById('message');
    message.innerHTML = mensagem;
    // Reset animations
    message.classList.remove('show');
    void message.offsetWidth; // Garante que a animação será reiniciada
    message.classList.add('show');
}



document.getElementById("btn-new").addEventListener("click", function() {
    const card = document.getElementById("card-new");
    
    const btnNew    = document.getElementById("btn-new");

    // Forçar reflow para garantir que a animação funcione
    card.offsetHeight; // Acessar a propriedade de altura força o reflow

    // Iniciar a animação aumentando a altura e tornando visível
    if (card.style.height >= '250px') {
        card.style.height = '0'; // Aumenta a altura
        card.style.opacity = '0'; // Torna visível
        card.style.overflow = 'hidden';

        // card.classList.remove('card-new-visible');
        // card.classList.add('card-new-hidden');
        
        btnNew.childNodes[0].classList.remove('fa-minus');
        btnNew.childNodes[0].classList.add('fa-plus');
    } else {
        
        card.style.height = '250px'; // Aumenta a altura
        card.style.opacity = '1'; // Torna visível
        card.style.overflow = 'visible'
        
        // card.classList.remove('card-new-hidden');
        // card.classList.add('card-new-visible');

        btnNew.childNodes[0].classList.remove('fa-plus');
        btnNew.childNodes[0].classList.add('fa-minus');
    }
});