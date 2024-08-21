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

signUpbtn.addEventListener("click", async () => {
  signUpbtn.innerText = "loading";

  const email = createEmail.value;
  const password = createPassword.value;
  const name = createName.value;
  const profileFile = userProfile.files[0];

  if (!email || !password || !name || !profileFile) {
    alert("Please fill all fields and upload a profile image.");
    signUpbtn.innerText = "sign up";
    return;
  }

  const userInfo = { name, email, password, profile: "" };

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const userRef = ref(storage, `userProfile/${user.uid}/${profileFile.name}`);
    await uploadBytes(userRef, profileFile);

    const url = await getDownloadURL(userRef);
    userInfo.profile = url;

    const userDbRef = doc(db, "users", user.uid);
    await setDoc(userDbRef, userInfo);

    container.classList.remove("right-panel-active");
    signUpbtn.innerText = "sign up";
  } catch (error) {
    console.log("Error Code:", error.code);
    console.log("Error Message:", error.message);
    alert(`Sign up failed: ${error.message}`);
    signUpbtn.innerText = "sign up";
  }
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
