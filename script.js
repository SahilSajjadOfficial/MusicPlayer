console.log("Let's write some JavaScript code!");

let audio;
let songs = [];
let currentSongIndex = 0;
let isPlaying = false;

const songInfo = document.querySelector(".songinfo");
const songTime = document.querySelector(".songtime");
const seekbar = document.querySelector(".seekbar");
const circle = document.querySelector(".circle");

async function getSongs() {
    let res = await fetch("http://127.0.0.1:5500/songs/");
    let html = await res.text();
    let div = document.createElement("div");
    div.innerHTML = html;

    let anchors = div.getElementsByTagName("a");
    songs = [];

    for (let a of anchors) {
        if (a.href.endsWith(".mp3")) {
            songs.push(a.href.split("/songs/")[1]);
        }
    }

    return songs;
}

async function main() {
    updatePlayPauseButton(false);

    let songListElement = document.querySelector(".songList ul");
    songListElement.querySelectorAll("li[data-dynamic='true']").forEach(li => li.remove());

    await getSongs();
    if (songs.length === 0) return console.log("No songs found.");

    songs.forEach((song, index) => {
        const li = document.createElement("li");
        li.setAttribute("data-dynamic", "true");

        li.innerHTML = `
            <img class="invert" src="img/music.svg" alt="">
            <div class="info">
                <div>${decodeURIComponent(song.replace(".mp3", ""))}</div>
                <div>Unknown Artist</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="img/play.svg" alt="">
            </div>
        `;

        li.querySelector(".playnow").addEventListener("click", () => {
            playSong(song, index);
        });

        songListElement.appendChild(li);
    });
}

function playSong(songFileName, index = null) {
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }

    audio = new Audio(`/songs/${songFileName}`);
    audio.addEventListener("loadeddata", () => {
        const name = decodeURIComponent(songFileName.replace(".mp3", ""));
        songInfo.innerText = name;
        updateTimeDisplay();

        setInterval(updateTimeDisplay, 1000);
    });

    audio.play();
    isPlaying = true;
    updatePlayPauseButton();

    if (index !== null) {
        currentSongIndex = index;
    }

    audio.addEventListener("ended", () => {
        playNext();
    });
}

function togglePlayPause() {
    if (!audio) return;

    if (audio.paused) {
        audio.play();
        isPlaying = true;
    } else {
        audio.pause();
        isPlaying = false;
    }

    updatePlayPauseButton();
}

function updatePlayPauseButton(forceState = null) {
    const songButtons = document.querySelector(".songbuttons");
    const playBtn = songButtons?.children[1];
    if (!playBtn) return;

    const state = forceState !== null ? forceState : isPlaying;
    playBtn.src = state ? "img/pause.svg" : "img/play.svg";
}

function playNext() {
    if (songs.length === 0) return;

    currentSongIndex = (currentSongIndex + 1) % songs.length;
    playSong(songs[currentSongIndex], currentSongIndex);
}

function playPrevious() {
    if (songs.length === 0) return;

    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playSong(songs[currentSongIndex], currentSongIndex);
}

function formatTime(sec) {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function updateTimeDisplay() {
    if (!audio) return;

    const current = audio.currentTime;
    const total = audio.duration || 0;

    songTime.innerText = `${formatTime(current)} / ${formatTime(total)}`;

    const percent = (current / total) * 100;
    circle.style.left = `${percent}%`;
}

seekbar.addEventListener("click", (e) => {
    if (!audio || !audio.duration) return;

    const rect = seekbar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    const newTime = percent * audio.duration;

    audio.currentTime = newTime;
    updateTimeDisplay();
});

document.addEventListener("DOMContentLoaded", () => {
    const songButtons = document.querySelector(".songbuttons");
    if (songButtons) {
        const [prevBtn, playBtn, nextBtn] = songButtons.children;
        prevBtn?.addEventListener("click", playPrevious);
        playBtn?.addEventListener("click", togglePlayPause);
        nextBtn?.addEventListener("click", playNext);
    }

    const volumeSlider = document.querySelector(".volume-slider");
    volumeSlider?.addEventListener("input", (e) => {
        if (audio) {
            const volume = e.target.value / 100;
            audio.volume = volume;
        }
    });

    const hamburger = document.querySelector(".hamburger");
    const sidebar = document.querySelector(".left");
    const closeBtn = document.querySelector(".close");

    hamburger?.addEventListener("click", () => {
        sidebar.classList.add("show");
    });

    closeBtn?.addEventListener("click", () => {
        sidebar.classList.remove("show");
    });

    main();
});



// console.log("Let's write some JavaScript code!");

// let audio;
// let songs = [];
// let currentSongIndex = 0;
// let isPlaying = false;
// let currentAlbum = "";

// const songInfo = document.querySelector(".songinfo");
// const songTime = document.querySelector(".songtime");
// const seekbar = document.querySelector(".seekbar");
// const circle = document.querySelector(".circle");

// async function getSongs(album = "") {
//     const albumPath = album ? `/songs/${album}/` : "/songs/";
//     let res = await fetch(albumPath);
//     let html = await res.text();
//     let div = document.createElement("div");
//     div.innerHTML = html;

//     let anchors = div.getElementsByTagName("a");
//     songs = [];

//     for (let a of anchors) {
//         if (a.href.endsWith(".mp3")) {
//             songs.push(`${album}/${a.href.split(`/${album}/`)[1]}`);
//         }
//     }

//     return songs;
// }

// async function main(album = "Album1") {
//     currentAlbum = album;
//     updatePlayPauseButton(false);

//     let songListElement = document.querySelector(".songList ul");
//     songListElement.querySelectorAll("li[data-dynamic='true']").forEach(li => li.remove());

//     await getSongs(album);
//     if (songs.length === 0) return console.log("No songs found.");

//     songs.forEach((song, index) => {
//         const songName = song.split("/").pop().replace(".mp3", "");
//         const li = document.createElement("li");
//         li.setAttribute("data-dynamic", "true");

//         li.innerHTML = `
//             <img class="invert" src="img/music.svg" alt="">
//             <div class="info">
//                 <div>${decodeURIComponent(songName)}</div>
//                 <div>Unknown Artist</div>
//             </div>
//             <div class="playnow">
//                 <span>Play Now</span>
//                 <img class="invert" src="img/play.svg" alt="">
//             </div>
//         `;

//         li.querySelector(".playnow").addEventListener("click", () => {
//             playSong(song, index);
//         });

//         songListElement.appendChild(li);
//     });
// }

// function playSong(songFileName, index = null) {
//     if (audio) {
//         audio.pause();
//         audio.currentTime = 0;
//     }

//     audio = new Audio(`/songs/${songFileName}`);
//     audio.addEventListener("loadeddata", () => {
//         const name = decodeURIComponent(songFileName.split("/").pop().replace(".mp3", ""));
//         songInfo.innerText = name;
//         updateTimeDisplay();

//         setInterval(updateTimeDisplay, 1000);
//     });

//     audio.play();
//     isPlaying = true;
//     updatePlayPauseButton();

//     if (index !== null) {
//         currentSongIndex = index;
//     }

//     audio.addEventListener("ended", () => {
//         playNext();
//     });
// }

// function togglePlayPause() {
//     if (!audio) return;

//     if (audio.paused) {
//         audio.play();
//         isPlaying = true;
//     } else {
//         audio.pause();
//         isPlaying = false;
//     }

//     updatePlayPauseButton();
// }

// function updatePlayPauseButton(forceState = null) {
//     const songButtons = document.querySelector(".songbuttons");
//     const playBtn = songButtons?.children[1];
//     if (!playBtn) return;

//     const state = forceState !== null ? forceState : isPlaying;
//     playBtn.src = state ? "img/pause.svg" : "img/play.svg";
// }

// function playNext() {
//     if (songs.length === 0) return;

//     currentSongIndex = (currentSongIndex + 1) % songs.length;
//     playSong(songs[currentSongIndex], currentSongIndex);
// }

// function playPrevious() {
//     if (songs.length === 0) return;

//     currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
//     playSong(songs[currentSongIndex], currentSongIndex);
// }

// function formatTime(sec) {
//     const minutes = Math.floor(sec / 60);
//     const seconds = Math.floor(sec % 60);
//     return `${minutes}:${seconds.toString().padStart(2, '0')}`;
// }

// function updateTimeDisplay() {
//     if (!audio) return;

//     const current = audio.currentTime;
//     const total = audio.duration || 0;

//     songTime.innerText = `${formatTime(current)} / ${formatTime(total)}`;

//     const percent = (current / total) * 100;
//     circle.style.left = `${percent}%`;
// }

// seekbar.addEventListener("click", (e) => {
//     if (!audio || !audio.duration) return;

//     const rect = seekbar.getBoundingClientRect();
//     const clickX = e.clientX - rect.left;
//     const percent = clickX / rect.width;
//     const newTime = percent * audio.duration;

//     audio.currentTime = newTime;
//     updateTimeDisplay();
// });

// document.addEventListener("DOMContentLoaded", () => {
//     const songButtons = document.querySelector(".songbuttons");
//     if (songButtons) {
//         const [prevBtn, playBtn, nextBtn] = songButtons.children;
//         prevBtn?.addEventListener("click", playPrevious);
//         playBtn?.addEventListener("click", togglePlayPause);
//         nextBtn?.addEventListener("click", playNext);
//     }

//     const volumeSlider = document.querySelector(".volume-slider");
//     volumeSlider?.addEventListener("input", (e) => {
//         if (audio) {
//             const volume = e.target.value / 100;
//             audio.volume = volume;
//         }
//     });

//     const hamburger = document.querySelector(".hamburger");
//     const sidebar = document.querySelector(".left");
//     const closeBtn = document.querySelector(".close");

//     hamburger?.addEventListener("click", () => {
//         sidebar.classList.add("show");
//     });

//     closeBtn?.addEventListener("click", () => {
//         sidebar.classList.remove("show");
//     });

//     // Album navigation logic
//     const albumCards = document.querySelectorAll(".card[data-album]");
//     albumCards.forEach(card => {
//         card.addEventListener("click", () => {
//             const album = card.getAttribute("data-album");
//             main(album);
//         });
//     });

//     main("Album1");
// });