function trimString(str, max) {
    if (str.length < max) return str;
    //metnin harf uzunlugu 50den buyukse uzunsa
    //kes ve ... koy
    return str.slice(0, max) + '...';
}

/*
ekrana mailleri listelyecek fonksiyon
outlet: ekranin hangi kismina mudahale edilecek
data:hangi verileri ekrana basacagiz
*/
export function renderMails(outlet, data) {
    if (!data) return;
    //her bir mail objesi icin html olustur
    outlet.innerHTML = data.map((mail) => `
<div class="mail" data-id=${mail.id}>
                    <div class="left">
                        <input type="checkbox">
                        <i id="star" class="bi bi-star ${mail.stared && 'star-active'}"></i>
                        <span>${mail.sender}</span>
                    </div>
                    <div class="right">
                        <p class="message-title">${trimString(mail.title, 25)} </p>
                        <p class="message-desc">${trimString(mail.message, 40)} </p>
                        <p class="message-date">${mail.date} </p>
                       <button id="delete">Sil</button>
                    </div>
                </div>
`).join(" ");

};

//ekrana mail olusturma modali acacak 

export function showModal(modal, willOpen) {
    modal.style.display = willOpen ? 'grid' : 'none';
}

//kategorileri ekrana basma
export function renderCategories(outlet, data, selectedCategory) {

    //eski kategorileri sil
    outlet.innerHTML= '';
    data.forEach(category => {
        const categoryItem = document.createElement('a');

        //aktif olan kategory e aktiv klasini ekleme
        categoryItem.dataset.name =category.title;
        categoryItem.className =selectedCategory === category.title && 'active-category';

        categoryItem.innerHTML = `<i class="${category.class}"></i>
                <span>${category.title}</span>`;
        outlet.appendChild(categoryItem);
    });
}