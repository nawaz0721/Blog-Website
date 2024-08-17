import {
  auth,
  db,
  collection,
  query,
  where,
  getDocs,
  onAuthStateChanged,
} from "../utils/utils.js";

const myBlogsContainer = document.getElementById("myBlogs");
const backToHome = document.getElementById("backToHome");

backToHome.addEventListener("click", () => {
  window.location.href = "../index.html";
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    getAllBlogs(user.uid);
  } else {
    alert("You need to be logged in to view your dashboard.");
  }
});

async function getAllBlogs(uid) {
  try {
    const q = query(collection(db, "blogs"), where("createdBy", "==", uid));
    const querySnapshot = await getDocs(q);
    myBlogsContainer.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const blog = doc.data();
      const blogPreview = blog.content.slice(0, 100) + "..."; // Show first 100 characters
      const blogCard = document.createElement("div");
      blogCard.classList.add("blog-card");

      blogCard.innerHTML = `
        <img src="${blog.banner}" alt="Blog Banner">
        <h3>${blog.title}</h3>
        <span>Published by: ${auth.currentUser.email}</span>
        <p>${blogPreview}</p>
        <button class="read-btn">Read More</button>
      `;

      // Add event listener to the Read More button
      const readBtn = blogCard.querySelector(".read-btn");
      readBtn.addEventListener("click", () => {
        window.location.href = `blog.html?blogId=${doc.id}`;
      });

      myBlogsContainer.appendChild(blogCard);
    });
  } catch (error) {
    alert(error.message);
  }
}
