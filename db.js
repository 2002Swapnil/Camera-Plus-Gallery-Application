let db;
const openRequest = indexedDB.open("MyTestDatabase", 2);
openRequest.addEventListener("success", () => {
  db = openRequest.result;
});
openRequest.addEventListener("error", () => {
  console.log("!!");
});
openRequest.addEventListener("upgradeneeded", (e) => {
  db = openRequest.result;
  db.createObjectStore("videos", { keyPath: "id" });
  db.createObjectStore("images", { keyPath: "id" });
});
