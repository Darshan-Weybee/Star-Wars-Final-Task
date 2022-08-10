const imageContainer = document.querySelector(".images-container");
const details = document.querySelector(".details");
const characterDetail = document.querySelector(".character-detail");
const overlay = document.querySelector(".overlay");
const closeBtn = document.querySelector(".close-icon");
const firstPage = document.querySelector(".first-page");
imageContainer.addEventListener("click", characterData);
imageContainer.addEventListener("mouseover", fetchApi);
closeBtn.addEventListener("click", closePopup);
overlay.addEventListener("click", closePopup);
firstPage.addEventListener("click", moveToCharacters);


let apiArr = new Map();
let detailsArr = new Map();

// api
let imgApi = `https://starwars-visualguide.com/assets/img/characters/`;
let charApi = `https://swapi.dev/api/people/`;

let imgNo = 1;
let ap = 1;

let pos = 0;

// window.addEventListener("scroll", function(){
//     if(document.documentElement.scrollTop == document.documentElement.clientHeight - window.innerHeight){
//         console.log("jdsfflklklklklkjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjddddddddddddddddddddddddddd");
//         api();
//     }
// });

async function api(){
        // while(true){
            let res = await fetch(`https://swapi.dev/api/people/?page=${ap}`);
            if(!res.ok) {
                // break;
                return;
            }
            let data = await res.json();
            console.log(data);
    
            for (let i = 0; i < data.results.length; i++) {
                console.log("for-inside");
                let char = data.results[i];
    
                if (imgNo == 17) imgNo++;
                // let img = document.createElement("img");
                // img.src = `${imgApi}${imgNo}.jpg`;
                // img.addEventListener("error", function(){imgNo++; console.log(imgNo)});
    
                let html = `<div class="character"><img src="${imgApi}${imgNo}.jpg" alt="starwars" class="character-img" data-id="${imgNo}"><span>${char.name}</span></div>`;
                imageContainer.insertAdjacentHTML("beforeend", html);
                imgNo++;
            }
            ap++;
            // break;
        }
// }
// api();

// .then(data => data.map(el => el.json()))
// .then(data => Promise.all(data))
// .then(ar => {
//     console.log(ar[0].results[0]);
//     while(ar.length > arNo){
//         console.log("while-inside");
//         console.log(ar);

//         for (let i = 0; i < ar[arNo].results.length; i++) {
//             console.log("for-inside");
//             let char = ar[arNo].results[i];

//             if(imgNo == 17) imgNo++;
//             // let img = document.createElement("img");
//             // img.src = `${imgApi}${imgNo}.jpg`;
//             // img.addEventListener("error", function(){imgNo++; console.log(imgNo)});
            
//             let html = `<div class="character"><img src="${imgApi}${imgNo}.jpg" alt="starwars" class="character-img" data-id="${imgNo}"><span>${char.name}</span></div>`;
//             imageContainer.insertAdjacentHTML("beforeend", html);
//             imgNo++;
//         }
//         arNo++;
//     }
// });
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
// async function getImage() {
//     try {
//         while (count <= 83) {
//             // let res = await fetch(`${imgApi}${count}.jpg`);

//             let resName = await fetch(`${charApi}${count}/`);
//             if (!resName.ok) {
//                 count++;
//                 continue;
//             };
//             let char = await resName.json();

//             let html = `<div class="character"><img src="${imgApi}${count}.jpg" alt="starwars" class="character-img" data-id="${count}"><span>${char.name}</span></div>`;
//             imageContainer.insertAdjacentHTML("beforeend", html);
//             count++;
//         }
//     } catch (err) {
//         console.error(err);
//     }
// }
// getImage();

async function fetchApi(e){
    if (e.target.classList.contains("character-img")){
        console.log(e.target);

        let id = e.target.dataset.id;

        if(apiArr.get(id) != undefined) return;

        let chResponse = await fetch(`${charApi}${id}/`);
        let chData = await chResponse.json();

        apiArr.set(id, chData);
        detailsArr.set(id, {});
        console.log(apiArr);
    }
}

async function characterData(e) {
    if (e.target.classList.contains("character-img")) {

        characterDetail.innerHTML = "";

        let id = e.target.dataset.id;

        let chData;
        apiArr.forEach(function(value, key){
            if(key == id) chData = value;
        });

        openPopup();

        // let chResponse = await fetch(`${charApi}${id}/`);
        // let chData = await chResponse.json();

        await getSpeciesData(chData.species[0], id);
        species = detailsArr.get(id).species == "unknown" ? "unknown" : detailsArr.get(id).species.name;

        await getHomeWorldData(chData.homeworld, id);

        await getFilmsData(chData.films, id);
        // let films = await Promise.all(filmsArr);

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
                    <span> Homeworld: ${detailsArr.get(id).homeworld.name}</span>
                    <span> Films: ${detailsArr.get(id).films.join(" , ")}</span>
                </div>
            </div>
        `;
        document.querySelector(".loading-parent").classList.add("hidden");
        characterDetail.insertAdjacentHTML("afterbegin", html);
    }
}

async function getSpeciesData(link, id) {
    try {
        console.log(id);
        console.log(detailsArr.get(id).species);

        if(detailsArr.get(id).species != undefined) return;

        console.log("speciesinside");
        let response = await fetch(`${link}`);

        if (!response.ok) throw new Error("unknown");

        let data = await response.json();
        // return data;
        detailsArr.get(id).species = data;
        return;

    } catch (err) {
        console.log(err.message);
        detailsArr.get(id).species = err.message;
        return;
        // return err.message;
    }
}

async function getHomeWorldData(link, id) {
    try {
        console.log(id);
        console.log(detailsArr.get(id).homeworld);

        if(detailsArr.get(id).homeworld != undefined) return;
        
        console.log("homeworldinside");
        let response = await fetch(`${link}`);

        if (!response.ok) throw new Error("unknown");

        let data = await response.json();
        // return data;
        detailsArr.get(id).homeworld = data;
        return;

    } catch (err) {
        console.log(err.message);
        // return err.message;
        detailsArr.get(id).homeworld = err.message;
        return;
    }
}

async function getFilmsData(links, id) {
    try {
        console.log(id);
        console.log(detailsArr.get(id).films);

        if(detailsArr.get(id).films != undefined) return;

        console.log("filmsinside");
        let movieName = links.map(async link => {
            let response = await fetch(`${link}`);

            if (!response.ok) throw new Error("unknown");

            let data = await response.json();
            return data.title;
        })
        // return movieName;
        detailsArr.get(id).films = await Promise.all(movieName);
        return ;

    } catch (err) {
        console.log(err.message);
        // return err.message;
        detailsArr.get(id).films = err.message;
        return;
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