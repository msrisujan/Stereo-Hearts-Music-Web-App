// const wrapper = document.querySelector(".wrapper");
// const loginLink = document.querySelector(".login-link");
// const registerLink = document.querySelector(".register-link");
// const btnPopup = document.querySelector(".btnlogin-popup");
// const iconClose = document.querySelector(".icon-close");

// registerLink.addEventListener("click", () => {
//   wrapper.classList.add("active");
// });

// loginLink.addEventListener("click", () => {
//   wrapper.classList.remove("active");
// });



const loginBox = document.querySelector(".login-box");
const registerBox = document.querySelector(".register-box");
const loginLink = document.querySelector(".login-link");
const registerLink = document.querySelector(".register-link");
const btnPopup = document.querySelector(".btnlogin-popup");
const iconClose = document.querySelector(".icon-close");

registerLink.addEventListener("click", () => {
  loginBox.classList.add("passive");
  registerBox.classList.remove("passive");
});

loginLink.addEventListener("click", () => {
  registerBox.classList.add("passive");
  loginBox.classList.remove("passive");
});
