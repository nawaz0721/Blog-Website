import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  db,
  doc,
  setDoc,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "../utils/utils.js";
const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const signInbtn = document.getElementById("signInbtn");
const signUpbtn = document.getElementById("signUpbtn");
const container = document.getElementById("container");
const createName = document.getElementById("createName");
const createEmail = document.getElementById("createEmail");
const createPassword = document.getElementById("createPassword");
const userProfile = document.getElementById("userProfile");
const userEmail = document.getElementById("userEmail");
const userPassword = document.getElementById("userPassword");

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signUpbtn.addEventListener("click", () => {
  signUpbtn.innerText = "loading";
  const email = createEmail.value;
  const password = createPassword.value;
  const name = createName.value;
  const profile = userProfile.value;

  console.log(profile);

  const userInfo = {
    name,
    email,
    password,
    profile,
  };

  console.log(userInfo);

  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      console.log(user.uid);
      //   upload image
      // const blogRef = ref(storage, blogData.banner.name);
      const userRef = ref(
        storage,
        `userProfile/${user.uid}/${userProfile.files[0].name}`
      );
      uploadBytes(userRef, userProfile.files[0])
        .then(() => {
          // user image uploaded
          getDownloadURL(userRef)
            .then((url) => {
              // url agya bhai
              userInfo.profile = url;
              const userDbRef = doc(db, "users", user.uid);
              setDoc(userDbRef, userInfo).then(() => {
                container.classList.add("right-panel-active");
                container.classList.remove("right-panel-active");
                signUpbtn.innerText = "sign up";
              });
            })
            .catch((error) => {
              alert("url firbase nhi de raha");
              signUpbtn.innerText = "sign up";
            });
        })
        .catch(() => {
          alert("image upload failed");
          signUpbtn.innerText = "sign up";
        });
    })
    .catch((error) => {
      alert("sign up failed");
      signUpbtn.innerText = "sign up";
    });
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

signInbtn.addEventListener("click", () => {
  signInbtn.innerHTML = "loading...";
  signInWithEmailAndPassword(auth, userEmail.value, userPassword.value)
    .then((userCredential) => {
      const user = userCredential.user;
      signInbtn.innerHTML = "SIGN IN";
      window.location.href = "../index.html";
    })
    .catch((error) => {
      signInbtn.innerHTML = "SIGN IN";
      alert("invalid email or password");
    });
});
