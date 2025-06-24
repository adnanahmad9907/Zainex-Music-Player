console.log("lets gooooo")
let currentsong = new Audio()
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder=folder
    let a = await fetch(`http://127.0.0.1:3000/84vid-spotify%20clone/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

    let songUl = document.querySelector(".songLists").getElementsByTagName("ul")[0]
    songUl.innerHTML=""
    for (const song of songs) {
        songUl.innerHTML += `<li>
                            <img class="invert" src="images/music.svg" alt="">
                            <div class="info"><div>${song.replaceAll("%20", " ")}</div>
                                <div>Abhayyy</div>
                            </div>
                            <div class="playnow">
                                <div>Play Now</div>
                                <img class="invert" src="images/play.svg" alt="">
                            </div>
                            </li>`
    }

    Array.from(document.querySelector(".songLists").getElementsByTagName("li")).forEach(e => {
        // console.log(e.querySelector(".info").firstChild.innerHTML)
        e.addEventListener('click', element => {
            playMusic(e.querySelector(".info").firstChild.innerHTML)
        })
    })
    return songs
}

const playMusic = (track, pausee = false) => {
    currentsong.src = `http://127.0.0.1:3000/84vid-spotify%20clone/${currFolder}/` + track
    if (!pausee) {
        currentsong.play()
        play.src = "images/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/84vid-spotify%20clone/songs/`)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    // console.log(div)
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for(let index =0;index<array.length;index++){
        const e = array[index]
        if (e.href.includes("/songs")){
            let folder = (e.href.split("/").slice(-2)[0])
            let a = await fetch(`http://127.0.0.1:3000/84vid-spotify%20clone/songs/${folder}/info.json`)
            let response = await a.json();
            // console.log(response)
            cardContainer.innerHTML += `<div data-folder="${folder}" class="card">
                                        <div class="play">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M5 20V4L19 12L5 20Z" fill="#000" stroke="#141B34" stroke-width="1.5"
                                                        stroke-linejoin="round" />
                                                </svg>
                                        </div>
                                        <img src="http://127.0.0.1:3000/84vid-spotify%20clone/songs/${folder}/cover.jpeg" alt="img">
                                        <h2>${response.title}</h2>
                                        <p>${response.description}</p>
                                        </div>`
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach((e)=>{
        e.addEventListener("click",async item=>{
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])//to make first song auto play when card is clicked
        })
    })
}

async function main() {
    // await getSongs("songs/ncs")
    // // console.log(songs)
    // playMusic(songs[0], true)

    //displaying all the albums in song folder
    displayAlbums()

    play.addEventListener('click', e => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "images/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "images/play.svg"
        }
    })

    currentsong.addEventListener('timeupdate', () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`
        if (currentsong.currentTime == currentsong.duration) {
            play.src = "images/play.svg"
        }
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
    })

    document.querySelector(".seekbar").addEventListener('click', (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentsong.currentTime = (currentsong.duration * percent) / 100
    })
    const circle = document.querySelector(".circle");
    const seekbar = document.querySelector(".seekbar");
    let isDragging = false;
    circle.addEventListener("mousedown", (e) => {
        isDragging = true;
    });
    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const rect = seekbar.getBoundingClientRect();
        let offsetX = e.clientX - rect.left;
        offsetX = Math.max(0, Math.min(offsetX, rect.width));
        let percent = (offsetX / rect.width) * 100;
        circle.style.left = percent + "%";
        currentsong.currentTime = (currentsong.duration * percent) / 100;
    });
    document.addEventListener("mouseup", () => {
        isDragging = false;
    });

    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0"
    })
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-120%"
    })

    prev.addEventListener("click",()=>{
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if (index-1 >= 0){
            playMusic(songs[index-1])
        }
    })
    next.addEventListener("click",()=>{
        // console.log(currentsong.src.split("/").slice(-1)[0])
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if (index+1 < songs.length){
            playMusic(songs[index+1])
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentsong.volume = parseInt(e.target.value)/100
    })

    document.querySelector(".volume>img").addEventListener("click",(e)=>{
        if (e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg","mute.svg")
            currentsong.volume = 0
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0
        }
        else{
            e.target.src = e.target.src.replace("mute.svg","volume.svg")
            currentsong.volume = 0.1
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10
        }
    })
}

main()
