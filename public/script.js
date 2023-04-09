
const wrapper = document.querySelector(".wrapper"),
mainAudio = wrapper.querySelector("#main-audio");

playPauseBtn = wrapper.querySelector(".play-pause");

progressArea = wrapper.querySelector(".progress-area"),
progressBar = progressArea.querySelector(".progress-bar");




isPlaying = false;

playPauseBtn.addEventListener("click", function(){

  if(isPlaying){
      mainAudio.pause();
      isPlaying = false;
  }
  else{
      mainAudio.play();
      isPlaying = true;
  }
});

mainAudio.addEventListener("ended", function(){
  document.querySelector(".next").click();
});


mainAudio.addEventListener("loadeddata", function(){
  mainAudio.play();
});

mainAudio.addEventListener("canplay", function(){
  
  musicDuartion = wrapper.querySelector(".max-duration");
  let mainAdDuration = mainAudio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if(totalSec < 10){ //if sec is less than 10 then add 0 before it
      totalSec = `0${totalSec}`;
    }
    musicDuartion.innerText = `${totalMin}:${totalSec}`;
});

mainAudio.addEventListener("timeupdate", (e)=>{
  const currentTime = e.target.currentTime; 
  const duration = e.target.duration; 
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;
  let musicCurrentTime = wrapper.querySelector(".current-time");
  // update playing song current time
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if(currentSec < 10){ 
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

progressArea.addEventListener("click", (e)=>{
  let progressWidth = progressArea.clientWidth;
  let clickedOffsetX = e.offsetX;
  let songDuration = mainAudio.duration; 
  
  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  mainAudio.play();
 
});

function submitForm(){
  document.getElementById("form").submit();
}

function addtext(){
  document.getElementById("add_after_me").insertAdjacentHTML("afterend",
                "<p>Added to playlist</p>");
}

function removeText(){
  document.getElementById("add_after_me").innerHTML = "";
}

function addToPlay(){
  setTimeout(addtext, 300);
  setTimeout(submitForm, 3000);
}

const wrapper1 = document.querySelector(".wrapper1");
const loginLink = document.querySelector(".login-link");
const registerLink = document.querySelector(".register-link");
const btnPopup = document.querySelector(".btnlogin-popup");
const iconClose = document.querySelector(".icon-close");

registerLink.addEventListener("click", () => {
  wrapper1.classList.add("active");
});

loginLink.addEventListener("click", () => {
  wrapper1.classList.remove("active");
});

btnPopup.addEventListener("click", () => {
  wrapper1.classList.add("active-popup");
});

iconClose.addEventListener("click", () => {
  wrapper1.classList.remove("active-popup");
});
