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
let speciesMap = new Map();
let homeworldMap = new Map();
let filmsMap = new Map();

let imgApi = `https://starwars-visualguide.com/assets/img/characters/`;
let charApi = `https://swapi.dev/api/people/`;

let imgNo = 1;
let ap = 1;

async function api(path) {
    try {
        let res = await fetch(path);
        console.log(res);
        if (!res.ok) {
            throw new Error("page not found");
        }
        let data = await res.json();
        console.log(data);

        for (let i = 0; i < data.results.length; i++) {
            console.log("for-inside");
            let char = data.results[i];
            console.log(data.results.length);

            if (imgNo == 17) imgNo++;
            // let img = document.createElement("img");
            // img.src = `${imgApi}${imgNo}.jpg`;
            // img.addEventListener("error", function(){imgNo++; console.log(imgNo)});

            let html = `<div class="character"><img src="${imgApi}${imgNo}.jpg" alt="starwars" class="character-img" data-id="${imgNo}"><span>${char.name}</span></div>`;
            imageContainer.insertAdjacentHTML("beforeend", html);

            apiArr.set(imgNo, char);
            imgNo++;
        }
        if (ap == 1) imageContainer.scrollIntoView({ behavior: "smooth" });
        ap++;

        api(data.next);
    } catch (err) {
        console.log(err);
        console.error(err.message);
    }
}
api(`https://swapi.dev/api/people/?page=1`);

// fetch(`https://swapi.dev/api/people/?page=1`).then(res => res.json()).then(data => {let lin = data.results[0].films; console.log(lin);});


async function fetchApi(e) {
    if (e.target.classList.contains("character-img")) {
        console.log(e.target);

        let id = Number(e.target.dataset.id);

        let chData;
        apiArr.forEach(function (value, key) {
            if (key == id) chData = value;
        });

        await getSpeciesData(chData.species[0], id);

        await getHomeWorldData(chData.homeworld, id);

        await getFilmsData(chData.films, id);

    }
}

async function characterData(e) {
    if (e.target.classList.contains("character-img")) {

        characterDetail.innerHTML = "";

        let id = e.target.dataset.id;
        id = Number(id);

        let chData;
        apiArr.forEach(function (value, key) {
            if (key == id) chData = value;
        });

        openPopup();

        let speciesLink = chData.species[0] == undefined ? 'default' : chData.species[0];
        let species = speciesMap.get(speciesLink);

        if(!species){
            await getSpeciesData(chData.species[0], id);
            speciesLink = chData.species[0] == undefined ? 'default' : chData.species[0];
            species = speciesMap.get(speciesLink);
        }
        console.log({species});

        let homeLink = chData.homeworld == undefined ? 'default' : chData.homeworld;
        let homeworld = homeworldMap.get(homeLink);

        if(!homeworld){
            await getHomeWorldData(chData.homeworld, id);
            homeLink = chData.homeworld == undefined ? 'default' : chData.homeworld;
            homeworld = homeworldMap.get(homeLink);
        }
        console.log({homeworld});

        let filmsLink = chData.films;
        let films = filmsLink.map(async link => {

            return await reFilmsData(chData,id,link);

            // return filmsMap.get(link).title;
        });
        films = await Promise.all(films);
        console.log("finalfilms",films);


        let html = `
            <div class="pop-up-details hidden">
                <div class="pop-up-ch-image">
                    <img src="${imgApi}${id}.jpg" alt="starwars">
                </div>
                <div class="pop-up-ch-detail">
                    <h1>${chData.name}</h1>
                    <span> BirthYear: ${chData.birth_year}</span>
                    <span> Gender: ${chData.gender}</span>
                    <span> Species: ${species.name == undefined ? "unknown" : species.name}</span>
                    <span> Homeworld: ${homeworld.name}</span>
                    <span> Films: ${films.join(" , ")}</span>
                </div>
            </div>
        `;
        document.querySelector(".loading-parent").classList.add("hidden");
        characterDetail.insertAdjacentHTML("afterbegin", html);
        // document.querySelector(".pop-up-details").addEventListener("load", function(){
        //     document.querySelector(".loading-parent").classList.add("hidden");
        //     document.querySelector(".pop-up-details").classList.remove("hidden");
        // });
    }
}

async function getSpeciesData(link, id) {
    try {
        if(link == undefined) link = 'default';

        console.log(id);
        console.log(speciesMap.get(link));

        if (speciesMap.get(link) != undefined) return;

        console.log("speciesinside");
        let response = await fetch(`${link}`);

        if (!response.ok) throw new Error("unknown");

        let data = await response.json();

        speciesMap.set(link, data);
        return;

    } catch (err) {
        console.log(err.message);
        speciesMap.set(link, err.message);
        return;
        // return err.message;
    }
}

async function getHomeWorldData(link, id) {
    try {
        if(link == undefined) link = 'default';

        console.log(id);
        console.log(homeworldMap.get(link));

        if (homeworldMap.get(link) != undefined) return;

        console.log("homeworldinside");
        let response = await fetch(`${link}`);

        if (!response.ok) throw new Error("unknown");

        let data = await response.json();
        // return data;
        homeworldMap.set(link, data);
        return;

    } catch (err) {
        console.log(err.message);
        homeworldMap.set(link, err.message);
        return;
    }
}

async function getFilmsData(links, id) {
    try {
        console.log(id);
        // console.log(filmsMap.get(id));

        // if (detailsArr.get(id).films != undefined) return;

        let movieName = links.map(async link => {
            
            if (filmsMap.get(link) != undefined) return;
            
            let response = await fetch(`${link}`);
            console.log("filmsinside");
            
            if (!response.ok) throw new Error("unknown");
            
            let data = await response.json();
            filmsMap.set(link, data);
            // return data.title;
        })
        // return movieName;
        // detailsArr.get(id).films = await Promise.all(movieName);
        return;

    } catch (err) {
        console.log(err.message);
        // filmsMap.set(link, err.message);
        return;
    }
}

async function reFilmsData(chData,id,link) {
    if(!filmsMap.get(link)){
        await getFilmsData(chData.films, id);
        return filmsMap.get(link).title;
    }
    return filmsMap.get(link).title;
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



// important

// window.onscroll = function(ev) {
//     if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
//         // you're at the bottom of the page, load more content here.
//     }
// };


// const div = document.querySelector("#div-container-for-table");
// div.addEventListener("scroll", () => {
//   if (div.scrollTop + div.clientHeight >= div.scrollHeight) loadMore();
// });

       