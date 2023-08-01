import { renderMails, showModal , renderCategories} from "./ui.js";
import { months, categories } from "./constant.js";

//local storage dan veriyi alma
const strMailData = localStorage.getItem('data');
//gelen string veriyi obje ve dizilere cevirmeb 
const mailData = JSON.parse(strMailData);
//!Html den gelnler
const hamburgerMenu = document.querySelector(".menu");
const navigation = document.querySelector("nav");
const mailsArea = document.querySelector(".mails-area");
const createMailBtn = document.querySelector(".create-mail");
const modal = document.querySelector('.modal-wrapper');
const closeMailBtn = document.querySelector('#close-btn');
const form = document.querySelector('#create-mail-form');
const categoryArea = document.querySelector('nav .middle');
const searchButton = document.querySelector('#search-icon');
const searchInput = document.querySelector('#search-input');
//!olay izleyicileri
//ekranin yükleme aninda calisir
document.addEventListener("DOMContentLoaded", () => {
    renderCategories(categoryArea, categories, 'Gelen Kutusu');

    renderMails(mailsArea, mailData);
    
    if (window.innerWidth < 1100) {
        navigation.classList.add('hide');
    };

});


//pencerenin genisliginin degisimini inceleme
window.addEventListener('resize', (e) => {
    const width = e.target.innerWidth;
    if (window.innerWidth < 1100) {
        navigation.classList.add('hide');
    } else {
        navigation.classList.remove('hide')
    }
}
);

hamburgerMenu.addEventListener("click", handleMenu);

searchButton.addEventListener("click",searchMails);
searchInput.addEventListener("keypress" , (e) => {
    e.preventDefault();
    if(e.code === 'Enter'){
        searchMails()
    }
   
})


createMailBtn.addEventListener("click", () => showModal(modal, true))
closeMailBtn.addEventListener("click", () => showModal(modal, false))
form.addEventListener("submit", sendMail)

//mails area tiklanma olayyinda sonra sil butonunu calistirmak

mailsArea.addEventListener('click', updateMail);

categoryArea.addEventListener("click", watchCategory) ;


//menuyu acip kapatmak

function handleMenu() {
    navigation.classList.toggle("hide")
}

function getDate() {
    const dateArr = new Date().toLocaleDateString().split('.');
    const day = dateArr[0];
    const monthNumber = dateArr[1];
    const month = months[monthNumber - 1]//tarih dizisndeki ayin türkce karsiligi
    // fonksiyonun cagirildigi yere gonderilecek cevap

    return day + ' ' + month;
}




function sendMail(e) {
    //formun icindeki inputlrin degerlerine erisme
    e.preventDefault(); //sayfanin yanilenmesini engelleme
    const receiver = e.target[0].value;
    const title = e.target[1].value;
    const message = e.target[2].value;

    if (!receiver || !title || !message) {

        Toastify({
            text: 'Lütfen formu doldurunuz',
            stopOnFocus: true,
            close: true,
            gravity: "top",
            position: "right",
            duration: 3000,
            style: {
                background: 'rgb(193,193,0)',
                borderRasius: '4px'
            },
        }).showToast()
        //bunlarda biri dahi bossa formu gönderme
        return;
    }

    //yeni mail objesi olusturma

    const newMail = {
        id: new Date().getTime(),
        sender: 'Aysegul',
        receiver,
        title,
        message,
        stared: false,
        date: getDate(),

    }
    //olusturdugumuz objeyi dizinin basina eklemek
    mailData.unshift(newMail);

    //veri tabanini (local storage i ) güncelle
    //storagea gondermek icin stinge cevir 
    const strData = (JSON.stringify(mailData));
    //storage a gonderme islemi
    localStorage.setItem('data', strData)


    //ekrani güncelle
    renderMails(mailsArea, mailData);

    //modali kapat

    showModal(modal, false);

    // modali temizle
    e.target[0].value = " ";
    e.target[1].value = " ";
    e.target[2].value = " ";

    // form basariyla gonderildi


    Toastify({
        text: 'Mail basariyla gönderildi',
        stopOnFocus: true,
        close: true,
        gravity: "top",
        position: "right",
        duration: 3000,
        style: {
            background: '#7CFC00',
            color: 'white',
            borderRasius: '4px'
        },
    }).showToast()

}


function updateMail(e) {
    const mail = e.target.parentElement.parentElement;
    //mailin dizideki verilerini bulmak icin id sine erisme

    const mailId = mail.dataset.id;
    //id sinden yola cikarak elemani bulma)

    if (e.target.id === 'delete') {

        //!local storge dan kaldir

        //id degerini bildigin elemani diziden cikarma 
        const filteredData = mailData.filter((i) => i.id != mailId);
        // diziyi stringe cevirme
        const strData = JSON.stringify(filteredData);
        //local storage a gonderme
        localStorage.setItem('data', strData);
        //!html den kaldir
        mail.remove();
    }

    //yildiza tiklayinca calismasi 
    if (e.target.id === 'star') {

        const foundItem = mailData.find((i) => i.id == mailId);
        //buldugumuz elemanin straed degerni tersine cevirme
        const updatedItem = { ...foundItem, stared: !foundItem.stared }; //spread islemi
        //güncellenecek elamanin sirasini bulma

        const index = mailData.findIndex((i) => i.id == mailId);

        //dizideki elemani güncelleme
        mailData[index] = updatedItem;

        //güncel diziyi local storage a hazirla
        JSON.stringify(mailData);
        //local storage i güncelle

        localStorage.setItem('data', JSON.stringify(mailData));


        renderMails(mailsArea, mailData);

    }
};

//kategorilei degistirecegimiz fonksiyon

function watchCategory(e){
    const selectedCategory = e.target.dataset.name;

    //navigasyon alanini güncelleme

    renderCategories(categoryArea, categories, selectedCategory);

    if(selectedCategory === 'Yildizlilar'){
        //stared degeri olanlari secme
        const filtered = mailData.filter((i) => i.stared === true);
        //sectiklerimizi ekrana bas

        renderMails(mailsArea, filtered);
        
        return;
    }
//yildizli disinda bir kategoriye tiklanirsa hepsini göster
  renderMails(mailsArea, mailData);
}

function searchMails(){
    const filtred = mailData.filter((i) => i.message.toLowerCase().includes(searchInput.value.toLowerCase()));
//mailleri alma ekrana basma

renderMails(mailsArea, filtred);


}
