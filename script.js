const imageContainer = document.querySelector(".images-container");
const details = document.querySelector(".details");
const characterDetail = document.querySelector(".character-detail");
const overlay = document.querySelector(".overlay");
const closeBtn = document.querySelector(".close-icon");
const firstPage = document.querySelector(".first-page");
imageContainer.addEventListener("click", characterData);
closeBtn.addEventListener("click", closePopup);
overlay.addEventListener("click", closePopup);
firstPage.addEventListener("click", moveToCharacters);

// api
let imgApi = `https://starwars-visualguide.com/assets/img/characters/`;
let charApi = `https://swapi.dev/api/people/`;

// let count = 1;

let imgNo = 1;
let arNo = 0;

let charData;
let ap = 1;
let arr = [];
async function api(){
    while(true){
        let res = await fetch(`https://swapi.dev/api/people/?page=${ap}`);
        if(!res.ok) {
            return arr;
        }
        arr.push(res);
        ap++;
    }

}
api()
.then(data => data.map(el => el.json()))
.then(data => Promise.all(data))
.then(ar => {
    console.log(ar[0].results[0]);
    while(ar.length > arNo){
        console.log("while-inside");

        for (let i = 0; i < ar[arNo].results.length; i++) {
            console.log("for-inside");
            let char = ar[arNo].results[i];

            if(imgNo == 17) imgNo++;

            let html = `<div class="character"><img src="${imgApi}${imgNo}.jpg" alt="starwars" class="character-img" data-id="${imgNo}"><span>${char.name}</span></div>`;
            imageContainer.insertAdjacentHTML("beforeend", html);
            imgNo++;
        }
        arNo++;
    }
});
// (async function fetchApi(){
//     let data = await api();
//     charData = await Promise.all(data);
//     renderData();
// })();

// function renderData(){
//     let i = 0;
//     while(i == charData.length){
//         console.log(i);
//         i++;
//     }
// }

// async function data(arr){
//     let array = await Promise.all(arr);
//     console.log(array);
// }



async function getImage() {
    try {
        while (count <= 83) {
            // let res = await fetch(`${imgApi}${count}.jpg`);

            let resName = await fetch(`${charApi}${count}/`);
            if (!resName.ok) {
                count++;
                continue;
            };
            let char = await resName.json();

            let html = `<div class="character"><img src="${imgApi}${count}.jpg" alt="starwars" class="character-img" data-id="${count}"><span>${char.name}</span></div>`;
            imageContainer.insertAdjacentHTML("beforeend", html);
            count++;
        }
    } catch (err) {
        console.error(err);
    }
}
// getImage();

async function characterData(e) {
    if (e.target.classList.contains("character-img")) {

        characterDetail.innerHTML = "";

        let id = e.target.dataset.id;

        openPopup();

        let chResponse = await fetch(`${charApi}${id}/`);
        let chData = await chResponse.json();

        let species = await getSpeciesData(chData.species[0]);
        species = species == "unknown" ? "unknown" : species.name;

        let homeworld = await getSpeciesData(chData.homeworld);

        let filmsArr = await getFilmsData(chData.films);
        let films = await Promise.all(filmsArr);

        let html = `
            <div class="pop-up-details">
                <div class="pop-up-ch-image">
                    <img src="${imgApi}${id}.jpg" alt="starwars">
                </div>
                <div class="pop-up-ch-detail">
                    <h1>${chData.name}</h1>
                    <span> BirthYear: ${chData.birth_year}</span>
                    <span> Gender: ${chData.gender}</span>
                    <span> Species: ${species}</span>
                    <span> Homeworld: ${homeworld.name}</span>
                    <span> Films: ${films.join(" , ")}</span>
                </div>
            </div>
        `;
        document.querySelector(".loading-parent").classList.add("hidden");
        characterDetail.insertAdjacentHTML("afterbegin", html);
    }
}

async function getSpeciesData(link) {
    try {
        let response = await fetch(`${link}`);

        if (!response.ok) throw new Error("unknown");

        let data = await response.json();
        return data;

    } catch (err) {
        console.log(err.message);
        return err.message;
    }
}

async function getFilmsData(links) {
    try {
        let movieName = links.map(async link => {
            let response = await fetch(`${link}`);

            if (!response.ok) throw new Error("unknown");

            let data = await response.json();
            return data.title;
        })
        return movieName;

    } catch (err) {
        console.log(err.message);
        return err.message;
    }
}

function openPopup() {
    document.querySelector(".loading-parent").classList.remove("hidden");
    details.classList.remove("hidden");
    overlay.classList.remove("hidden");
}

function closePopup() {
    details.classList.add("hidden");
    overlay.classList.add("hidden");
}

function moveToCharacters() {
    imageContainer.scrollIntoView({ behavior: 'smooth' });
}