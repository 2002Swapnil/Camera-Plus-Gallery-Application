let back = document.querySelector(".back");
back.addEventListener("click", () => {
  location.assign("./index.html");
});

setTimeout(() => {
  if (db) {
    let videoDBTransaction = db.transaction("videos", "readonly");
    let videoStore = videoDBTransaction.objectStore("videos");
    let videoRequest = videoStore.getAll();

    videoRequest.onsuccess = (e) => {
      let videoResult = videoRequest.result;
      let galleryCont = document.querySelector(".gallery-cont");
      videoResult.forEach((videoObj) => {
        let mediaElem = document.createElement("div");
        mediaElem.setAttribute("class", "media-cont");
        mediaElem.setAttribute("id", videoObj.id);
        console.log(videoObj);

        let url = URL.createObjectURL(videoObj.blobData);

        mediaElem.innerHTML = `
                <div class="media">
                    <video autoplay loop src="${url}"></video>
                </div>
                <div class="delete actions">DELETE</div>
                <div class="download actions">DOWNLOAD</div>
                `;

        galleryCont.appendChild(mediaElem);

        // Listeners
        let deleteBtn = mediaElem.querySelector(".delete");
        deleteBtn.addEventListener("click", deleteListener);
        let downloadBtn = mediaElem.querySelector(".download");
        downloadBtn.addEventListener("click", downloadListener);
      });
    };

    let imageDBTransaction = db.transaction("images", "readonly");
    let imageStore = imageDBTransaction.objectStore("images");
    let imageRequest = imageStore.getAll(); //Event driven
    imageRequest.onsuccess = (e) => {
      let imageResult = imageRequest.result;
      let galleryCont = document.querySelector(".gallery-cont");
      imageResult.forEach((imageObj) => {
        let mediaElem = document.createElement("div");
        mediaElem.setAttribute("class", "media-cont");
        mediaElem.setAttribute("id", imageObj.id);

        let url = imageObj.url;

        mediaElem.innerHTML = `
                <div class="media">
                    <img src="${url}" />
                </div>
                <div class="delete actions">DELETE</div>
                <div class="download actions">DOWNLOAD</div>
                `;
        galleryCont.appendChild(mediaElem);

        // Listeners
        let deleteBtn = mediaElem.querySelector(".delete");
        deleteBtn.addEventListener("click", deleteListener);
        let downloadBtn = mediaElem.querySelector(".download");
        downloadBtn.addEventListener("click", downloadListener);
      });
    };
  }
}, 100);

function deleteListener(e) {
  // DB removal
  let id = e.target.parentElement.getAttribute("id");
  let type = id.slice(0, 3);
  if (type === "vid") {
    let videoDBTransaction = db.transaction("videos", "readwrite");
    let videoStore = videoDBTransaction.objectStore("videos");
    videoStore.delete(id);
  } else if (type === "img") {
    let imageDBTransaction = db.transaction("images", "readwrite");
    let imageStore = imageDBTransaction.objectStore("images");
    imageStore.delete(id);
  }

  // UI removal
  e.target.parentElement.remove();
}

function downloadListener(e) {
  let id = e.target.parentElement.getAttribute("id");
  let type = id.slice(0, 3);
  if (type === "vid") {
    let videoDBTransaction = db.transaction("videos", "readwrite");
    let videoStore = videoDBTransaction.objectStore("videos");
    let videoRequest = videoStore.get(id);
    videoRequest.onsuccess = (e) => {
      let videoResult = videoRequest.result;

      let videoURL = URL.createObjectURL(videoResult.blobData);

      let a = document.createElement("a");
      a.href = videoURL;
      a.download = "stream.mp4";
      a.click();
    };
  } else if (type === "img") {
    let imageDBTransaction = db.transaction("images", "readwrite");
    let imageStore = imageDBTransaction.objectStore("images");
    let imageRequest = imageStore.get(id);
    imageRequest.onsuccess = (e) => {
      let imageResult = imageRequest.result;

      let a = document.createElement("a");
      a.href = imageResult.url;
      a.download = "image.jpg";
      a.click();
    };
  }
}
