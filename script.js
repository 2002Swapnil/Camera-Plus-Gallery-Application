const video = document.querySelector("video");
const recordBtn = document.querySelector(".record-btn");
const captureBtn = document.querySelector(".capture-btn");
const recordBtnCont = document.querySelector(".recordBtn-cont");
const captureBtnCont = document.querySelector(".captureBtn-cont");
const timer = document.querySelector(".timer");
const timerCont = document.querySelector(".timer-cont");
const allFilters = document.querySelectorAll(".filter");
const filterLayer = document.querySelector(".filter-layer");

let chunks = [];
let recorder;
let capture;
let recordFlag = false;
let captureFlag = false;
let timerID;
let counter = 0;
let filterColour = "transparent";
let constraints = {
  audio: false,
  video: true,
};

navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
  video.srcObject = stream;
  recorder = new MediaRecorder(stream);
  recorder.addEventListener("start", (e) => {
    chunks = [];
  });
  recorder.addEventListener("dataavailable", (e) => {
    chunks.push(e.data);
  });
  recorder.addEventListener("stop", (e) => {
    let blob = new Blob(chunks, { type: "video/mp4" });
    if (db) {
      let id = shortid();
      let dbTransaction = db.transaction("videos", "readwrite");
      let videoStore = dbTransaction.objectStore("videos");
      let videoEntry = {
        id: `vid - ${id}`,
        blobData: blob,
      };
      videoStore.add(videoEntry);
    }
  });
});

recordBtnCont.addEventListener("click", () => {
  if (!recorder) return;
  recordFlag = !recordFlag;
  if (recordFlag) {
    recorder.start();
    recordBtn.classList.add("scale-record");
    startTimer();
  } else {
    stopTimer();
    recorder.stop();
    recordBtn.classList.remove("scale-record");
  }
});

captureBtnCont.addEventListener("click", () => {
  let canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  let context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  context.fillStyle = filterColour;
  context.fillRect(0, 0, canvas.width, canvas.height);

  let imageURL = canvas.toDataURL("image/png");
  if (db) {
    let id = shortid();
    let dbTransaction = db.transaction("images", "readwrite");
    let imageStore = dbTransaction.objectStore("images");
    let imageEntry = {
      id: `img - ${id}`,
      url: imageURL,
    };
    imageStore.add(imageEntry);
  }
});

function startTimer() {
  timerCont.classList.remove("hidden");
  timerID = setInterval(displayTimer, 1000);
  function displayTimer() {
    let totalSeconds = counter;
    let hours = Number.parseInt(counter / 3600);

    totalSeconds = totalSeconds % 3600;
    let minutes = Number.parseInt(totalSeconds / 60);
    totalSeconds = totalSeconds % 60;
    let sec = totalSeconds;

    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    sec = sec < 10 ? `0${sec}` : sec;

    timer.innerText = `${hours}:${minutes}:${sec}`;
    counter++;
  }
}
function stopTimer() {
  timerCont.classList.add("hidden");
  clearInterval(timerID);
  timer.innerText = "00:00:00";
}

allFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    filterColour = getComputedStyle(filter).getPropertyValue("background-color");
    filterLayer.style.backgroundColor = filterColour;
  });
});
