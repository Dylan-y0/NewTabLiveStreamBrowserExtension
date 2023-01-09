import './css/newtab.css';
import {userBackgrounds} from './Storage/storage';
let player = document.getElementById("player");
const ytParams = "autoplay=1&controls=0&showinfo=0&autohide=1&playsinline=1&controls=0&mute=1&showinfo=0"
const YTstreams = [
    {
        id: 0,
        name: 'Southampton Ferry Stream',
        type: "youtube",
        videoID: '-xB4Sq1sAAA'
    },
    {
        id: 1,
        name: 'Ryde Pier Hovercraft',
        type: "youtube",
        videoID: 'Q-44KECp-xQ'
    },
    {
        id: 2,
        name: 'Crewe Rail Camera',
        type: "youtube",
        videoID: 'HcdWx4-JPTI'
    },
    {
        id: 3,
        name: 'Portsmouth Harbour HMS Warrior',
        type: 'youtube',
        videoID: 'PhLtTYowitY'
    },
    {
        id: 4,
        name: "The run",
        type: 'youtube',
        videoID: '6WEh8-PfxQU'
    },
    {
        id:5,
        name:"Brooks falls BEARS!",
        type:"youtube",
        videoID:"nprdq03e8yI"
    },
    {
        id:6,
        name:"Tembe Elephant park",
        type:"youtube",
        videoID:"48MFrf5ADp8"
    }
]
let currentStream;

let SitesContainer = document.getElementById("topSitesFlex");
let randomStreamButton = document.getElementById("RandomStreamButton");
let test = false;
async function getRandomStream() {
    let res = await userBackgrounds().getRandom(false);
    console.log(res);
    return await res;
  //  return YTstreams[Math.floor(Math.random() * YTstreams.length)];
}
function createTSButtons() {
    chrome.topSites.get({includeFavicon:true},(sites)=>{
        sites.slice(0,5).forEach((site)=>{
            console.log(site);
            
            let siteContainer = document.createElement('a');
            siteContainer.className = "Site";
            siteContainer.href = site.url;

            let deleteButton = document.createElement('span');
            deleteButton.innerText = "X";
            deleteButton.style.alignSelf = "right";
            deleteButton.style.width = "100%";
            let siteImg = document.createElement('img');
            siteImg.src = site.favicon?`${site.favicon}`:"";
            siteImg.style.height = "64px";
            siteImg.style.width = "64px";

            let siteLabel = document.createElement('span');
            
            siteLabel.innerText = site.title? site.title:site.url;

          //  siteContainer.appendChild(deleteButton);
            siteContainer.appendChild(siteImg);
            siteContainer.appendChild(siteLabel);

            SitesContainer.appendChild(siteContainer);
        })
    });
}
window.onload =  () => {
    createTSButtons();
    setNewStream();
    
    
}
window.onbeforeunload = (e)=>{
   player.src = "";
}

randomStreamButton.addEventListener('click', (e)=>{
    setNewStream();
})
async function setNewStream(nStream) {

    let newStream = await getRandomStream();
    console.log("newStream");
    console.log(newStream);
    let streamLink = document.getElementById("streamLink");
    let prevStreamLink = document.getElementById("prevStreamLink");

    player.src = `https://youtube.com/embed/${newStream.videoID}?${ytParams}`;
    document.title = `New tab | ${newStream.name}`;
    streamLink.href = `https://youtube.com/watch?v=${newStream.videoID}`;
    currentStream = newStream;

    
    chrome.storage.local.get(['prevStream'], (res)=>{
        console.log(res.prevStream);
        prevStreamLink.setAttribute('alt',res.prevStream.name); 
        prevStreamLink.href= `https://youtube.com/watch?v=${res.prevStream.videoID}`;
    })
    chrome.storage.local.set({'prevStream':newStream}, ()=>{
        console.log("Set");
    })
}

function background() {
    
}
//https:/youtube.com/embed/L-POuJETcKU?autoplay=1&controls=0&showinfo=0&autohide=1&playsinline=1&controls=0&mute=1&showinfo=0