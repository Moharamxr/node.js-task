const { parse } = require("uuid");

console.log("Hello From Client 👀");

const addNewButton = document.querySelector("button");

const addNewUser = async () => {
  const nameInput = document.getElementById("name");
  const ageInput = document.getElementById("age");
  const errorMessage = document.getElementById("error");

  const name = nameInput.value;
  const age = ageInput.value;

  if (!name || !age) {
    return (errorMessage.innerHTML = "Please enter valid values");
  }
  age = parseInt(ageInput.value);
  await fetch("http://localhost:8080/users", {
    method: "POST",
    body: JSON.stringify({ name, age }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Rest inputs
  nameInput.value = ageInput.value = errorMessage.innerHTML = "";
};

addNewButton.addEventListener("click", (e) => {
  e.preventDefault();
  addNewUser();
});
