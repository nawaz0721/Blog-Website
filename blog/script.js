import {
  app,
  auth,
  db,
  storage,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  query,
  getDocs,
  addDoc,
  ref,
  uploadBytes,
  getDownloadURL,
  collection,
} from "../utils/utils.js";

let currentUser = null;

document
  .getElementById("uploadBannerButton")
  .addEventListener("click", function () {
    document.getElementById("bannerUpload").click();
  });

document
  .getElementById("bannerUpload")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    console.log(file);

    reader.onload = function (e) {
      const image = document.getElementById("bannerImage");
      image.src = e.target.result;
      image.classList.remove("hidden");
      document.getElementById("uploadBannerButton").classList.add("hidden");
    };

    reader.readAsDataURL(file);
  });

const blogTitle = document.getElementById("blogTitle");
const blogContent = document.getElementById("blogContent");
const bannerImage = document.getElementById("bannerImage");
const publishButton = document.getElementById("publishButton");
const backToHome = document.getElementById("backToHome");

backToHome.addEventListener("click", () => {
  window.location.href = "../index.html";
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    console.log(user.uid);
  } else {
    alert("You need to be logged in to publish a blog.");
  }
});

publishButton.addEventListener("click", () => {
  publishButton.innerText = "Publishing...";
  if (!currentUser) {
    alert("User not authenticated.");
    return;
  }

  const blogTitleValue = blogTitle.value;
  const blogContentValue = blogContent.value;
  const bannerImageSrc = bannerImage.src;

  const blogData = {
    title: blogTitleValue,
    content: blogContentValue,
    banner: bannerImageSrc,
    createdBy: auth.currentUser.uid,
    createdByEmail: auth.currentUser.email,
  };
  const file = document.getElementById("bannerUpload").files[0];
  blogData.banner = file;

  console.log(blogData);

  const blogRef = ref(storage, blogData.banner.name);

  uploadBytes(blogRef, blogData.banner)
    .then(() => {
      console.log("Image uploaded");
      getDownloadURL(blogRef).then((url) => {
        console.log("url agye", url);
        blogData.banner = url;

        const blogscollection = collection(db, "blogs");
        addDoc(blogscollection, blogData)
          .then((snapshot) => {
            console.log("Blog published");
            publishButton.innerText = "Publish";
            window.location.href = "/";
          })
          .catch((error) => {
            alert(error);
          });
      });
    })
    .catch((error) => {
      alert(error);
    });
});
