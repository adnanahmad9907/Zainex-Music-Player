console.log("lets gooooo");
let currentsong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  currFolder = folder;
  // Changed to relative path
  let a = await fetch(`${folder}/`);
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

  let songUl = document
    .querySelector(".songLists")
    .getElementsByTagName("ul")[0];
  songUl.innerHTML = "";
  for (const song of songs) {
    songUl.innerHTML += `<li>
                            <img class="invert" src="images/music.svg" alt="">
                            <div class="info"><div>${song.replaceAll(
                              "%20",
                              " "
                            )}</div>
                                <div>Abhayyy</div>
                            </div>
                            <div class="playnow">
                                <div>Play Now</div>
                                <img class="invert" src="images/play.svg" alt="">
                            </div>
                            </li>`;
  }

  Array.from(
    document.querySelector(".songLists").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".info").firstChild.innerHTML);
    });
  });
  return songs;
}

const playMusic = (track, pausee = false) => {
  // Changed to relative path
  currentsong.src = `${currFolder}/${track}`;
  if (!pausee) {
    currentsong.play();
    play.src = "images/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = track;
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

// async function displayAlbums() {
//   // Changed to relative path
//   let a = await fetch(`songs/`);
//   let response = await a.text();
//   let div = document.createElement("div");
//   div.innerHTML = response;
//   let anchors = div.getElementsByTagName("a");
//   let cardContainer = document.querySelector(".cardContainer");
//   let array = Array.from(anchors);
//   for (let index = 0; index < array.length; index++) {
//     const e = array[index];
//     if (e.href.includes("/songs")) {
//       let folder = e.href.split("/").slice(-2)[0];
//       // Changed to relative path
//       let a = await fetch(`songs/${folder}/info.json`);
//       let response = await a.json();
//       // Changed cover image path to relative
//       cardContainer.innerHTML += `<div data-folder="${folder}" class="card">
//                                         <div class="play">
//                                                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
//                                                     xmlns="http://www.w3.org/2000/svg">
//                                                     <path d="M5 20V4L19 12L5 20Z" fill="#000" stroke="#141B34" stroke-width="1.5"
//                                                         stroke-linejoin="round" />
//                                                 </svg>
//                                         </div>
//                                         <img src="songs/${folder}/cover.jpeg" alt="img">
//                                         <h2>${response.title}</h2>
//                                         <p>${response.description}</p>
//                                         </div>`;
//     }
//   }

//   Array.from(document.getElementsByClassName("card")).forEach((e) => {
//     e.addEventListener("click", async (item) => {
//       songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);

//       playMusic(songs[0]); //to make first song auto play when card is clicked
//     });
//   });
// }

// this is updated version of the code
async function displayAlbums() {
  let a = await fetch(`songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");

  console.log("All anchors found in songs/:", anchors);

  let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    const href = e.getAttribute("href");
    console.log("Checking href:", href);

    if (href && href !== "../") {
      const folder = href.replace(/\/$/, ""); // remove trailing slash
      try {
        let a = await fetch(`songs/${folder}/info.json`);
        let response = await a.json();

        cardContainer.innerHTML += `<div data-folder="${folder}" class="card">
                <div class="play">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                       xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20V4L19 12L5 20Z" fill="#000" stroke="#141B34"
                          stroke-width="1.5" stroke-linejoin="round" />
                  </svg>
                </div>
                <img src="songs/${folder}/cover.jpeg" alt="img">
                <h2>${response.title}</h2>
                <p>${response.description}</p>
              </div>`;
      } catch (err) {
        console.error(`Error fetching info for songs/${folder}`, err);
      }
    }
  }

  // Click listener
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0]);
    });
  });
}

async function main() {
  await displayAlbums();
}

document.addEventListener("DOMContentLoaded", main);
