const templateParams = {
  fullName: document.getElementById("fullName").value,
  emailAddress: document.getElementById("emailAddress").value,
  phoneNumber: document.getElementById("phoneNumber").value,
  subject: document.getElementById("subject").value,
  message: document.getElementById("message").value,
};

const backToHome = document.getElementById("backToHome");
backToHome.addEventListener("click", () => {
  window.location.href = "../index.html";
});
