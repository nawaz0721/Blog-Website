import {
  auth,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  getDoc,
  doc,
  db,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "./utils/utils.js";

// DOM Elements
const loginbtn = document.getElementById("login");
const logoutbtn = document.getElementById("logout");
const avatar = document.getElementById("avatar");
const avatarBtn = document.getElementById("avatarButton");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const editor = document.getElementById("editor");
const publishedBanner = document.getElementById("publishedBanner");
const publishedTitle = document.getElementById("publishedTitle");
const publishedContent = document.getElementById("publishedContent");
const publishedBlog = document.getElementById("publishedBlog");

// Event Listeners
loginbtn.addEventListener("click", () => {
  window.location.href = "/logIn,logOut/index.html";
});

logoutbtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      console.log("logout success");
      window.location.href = "/index.html";
    })
    .catch((error) => {
      console.log(error.message);
    });
});

// Firebase Auth Listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log(uid);
    loginbtn.style.display = "none";
    avatar.style.display = "block";
    editor.style.display = "block";
    getUserInfo(uid);
    getAllBlogs(); // Load blogs when user is authenticated
  } else {
    loginbtn.style.display = "block";
    avatar.style.display = "none";
    editor.style.display = "none";
  }
});

// Fetch User Info
function getUserInfo(uid) {
  const userRef = doc(db, "users", uid);
  getDoc(userRef).then((data) => {
    console.log("data=>", data.id);
    console.log("data=>", data.data());
    avatarBtn.src = data.data().profile;
    userName.innerText = data.data().name;
    userEmail.innerText = data.data().email;
  });
}

// Fetch and Display Blogs
async function getAllBlogs() {
  try {
    const querySnapshot = await getDocs(collection(db, "blogs"));
    publishedBlog.innerHTML = ""; // Clear the container before adding blogs

    querySnapshot.forEach((doc) => {
      const blog = doc.data();
      const blogPreview = blog.content.slice(0, 100) + "..."; // Show first 100 characters

      // Create a blog card dynamically
      const blogCard = document.createElement("div");
      blogCard.classList.add("blog-card");

      const { banner, title, createdByEmail, content } = blog;

      // Create blog card HTML structure
      blogCard.innerHTML = `
        <img src="${banner}" alt="Blog Banner">
        <h3>${title}</h3>
        <span>Published by: ${createdByEmail}</span>
        <p>${blogPreview}</p>
        <button class="read-btn">Read More</button>
        `;
      // auth.currentUser ? auth.currentUser.email : "Anonymous"

      // Add event listener to the "Read More" button
      const readBtn = blogCard.querySelector(".read-btn");
      readBtn.addEventListener("click", () => {
        window.location.href = `dashboard/blog.html?blogId=${doc.id}`;
      });

      // Append the blog card to the publishedBlog container
      publishedBlog.appendChild(blogCard);
    });
  } catch (error) {
    alert(error.message);
  }
}
