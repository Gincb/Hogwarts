"use strict";

window.addEventListener("DOMContentLoaded", getData);

//Add event
const modalClose = document.querySelector(".close");
const modal = document.querySelector(".modal-background");

modalClose.addEventListener("click", () => {
  modalClosingEvent(modal);
});

let studentObject = [];
let halfFamily = [];
let pureFamily = [];
let expelledStudents = [];
let currentList = [];

let oneStudent = {
  firstname: "",
  middlename: "",
  lastname: "",
  nickname: "",
  gender: "",
  house: "",
  image: "",
  bloodstatus: "",
  status: "",
};

function getData() {
  fetch("https://petlatkea.dk/2020/hogwarts/students.json")
    .then((res) => res.json())
    .then((jsonData) => {
      prepareData(jsonData);
      getFamilyData();
    });
}

function getFamilyData() {
  fetch("https://petlatkea.dk/2020/hogwarts/families.json")
    .then((res) => res.json())
    .then(prepareBloodData);
}

function prepareBloodData(bloodData) {
  Object.assign(halfFamily, bloodData.half);
  Object.assign(pureFamily, bloodData.pure);
  studentObject.forEach(compareFamilyNames);
}

function compareFamilyNames(family) {
  for (let i = 0; i < halfFamily.length; i++) {
    if (halfFamily[i] == family.lastname) {
      family.bloodstatus = "Half-blood";
    }
  }

  for (let i = 0; i < pureFamily.length; i++) {
    if (pureFamily[i] == family.lastname) {
      family.bloodstatus += "Pure-blood";
    }
  }

  if (family.bloodstatus == "Half-bloodPure-blood") {
    family.bloodstatus = "Half-blood";
  } else if (family.bloodstatus == "") {
    family.bloodstatus = "Muggle";
  }
}

function prepareData(jsonData) {
  jsonData.forEach((data) => {
    const student = Object.create(oneStudent);
    nameSeperator(data, student);

    student.house = data.house.trim();
    student.house =
      student.house[0].toUpperCase() + student.house.substring(1).toLowerCase(); //Capitalize house name

    setAndFindImg(student);

    student.status = "active";

    studentObject.push(student);
  });

  document
    .querySelector("#expel-filter")
    .addEventListener("click", displayExpelled);

  document
    .querySelector("#active-filter")
    .addEventListener("click", displayStudentList);

  displayStudentList();
}

function displayStudentList() {
  cleanArrows();
  document.querySelector(".content").innerHTML = "";

  // document.querySelector("#sort").addEventListener("change", sortingValues);

  let buttonsSort = document.querySelectorAll("[data-sort]");
  buttonsSort.forEach((button) =>
    button.addEventListener("click", sortingValues)
  );

  currentList = studentObject;

  displayCurrentList(currentList);
}

function displayCurrentList(currentList) {
  document.querySelector(".content").innerHTML = "";
  currentList.forEach(displayStudent);
}

function displayStudent(student) {
  //Put data to the template
  const templateElement = document.querySelector("#template").content;
  const myClone = templateElement.cloneNode(true);

  myClone.querySelector(".first-name").innerHTML = student.firstname;
  myClone.querySelector(".img").src = student.image;

  myClone.querySelector(".student").addEventListener("click", openModal);

  function openModal() {
    showModalContent(student);

    document.querySelector("#expel").addEventListener("click", expelStudent);
    function expelStudent() {
      confirmation(student);
    }

    modalOpeningEvent(modal);

    modal.classList.remove("hide");
  }

  const where = document.querySelector(".content");
  where.appendChild(myClone);
}

function nameSeperator(data, student) {
  data.fullname.trim(); //Delete white space
  const seperateName = data.fullname.trim().split(" "); //Seperate names into parts

  student.firstname = getFirstName(seperateName);
  student.lastname = getLastName(seperateName);
  student.middlename = getMiddleNickName(student, seperateName).middlename;
  student.nickname = getMiddleNickName(student, seperateName).nickname;
}

function getFirstName(name) {
  let firstname = name[0][0].toUpperCase() + name[0].substring(1).toLowerCase(); //Get first name

  return firstname;
}

function getLastName(name) {
  let lastname = name.pop(); //Get last name

  lastname = lastname[0].toUpperCase() + lastname.substring(1).toLowerCase(); //Get last name

  if (lastname.includes("-")) {
    lastname =
      lastname.substring(0, lastname.indexOf("-") + 1) +
      lastname[lastname.indexOf("-") + 1].toUpperCase() +
      lastname.substring(lastname.indexOf("-") + 2);
  } //Uppercase names with hyphen

  return lastname;
}

function getMiddleNickName(student, name) {
  let middlename;
  let nickname;

  if (name[1] != student.lastname) {
    middlename = name[1]; //Get middle name
  }

  if (middlename == undefined) {
    nickname = undefined; //Set nickname undefined comparing to middle name
  } else if (middlename.includes(`"`)) {
    nickname = middlename.slice(1, -1); //Set nickname
  }

  if (middlename) {
    middlename = middlename[0].toUpperCase() + middlename.substring(1);
  }

  if (nickname == undefined) {
  } else if (nickname == middlename.slice(1, -1)) {
    middlename = undefined;
  }

  return { middlename, nickname };
}

function setAndFindImg(student) {
  if (
    (student.lastname && student.lastname.includes(`-`)) ||
    student.firstname.includes(`-`)
  ) {
    student.image = `images/${student.lastname
      .substring(student.lastname.indexOf("-") + 1)
      .toLowerCase()}_${student.firstname[0].toLowerCase()}.png`;
  } else if (student.lastname == "Patil") {
    student.image = `images/${student.lastname.toLowerCase()}_${student.firstname.toLowerCase()}.png`;
  } else if (student.firstname === student.lastname) {
    student.image = `images/noimage.png`;
  } else {
    student.image = `images/${student.lastname.toLowerCase()}_${student.firstname[0].toLowerCase()}.png`;
  }
}

function modalClosingEvent(aModal) {
  aModal.classList.add("animationFadeOut");
  setTimeout(function () {
    aModal.classList.remove("animationFadeOut");
    aModal.classList.add("hide");
  }, 350);
}

function modalOpeningEvent(aModal) {
  aModal.classList.add("animationFadein");
  setTimeout(function () {
    aModal.classList.remove("animationFadein");
  }, 350);
}

function showModalContent(student) {
  modal.querySelector(".modal-first-name").innerHTML = student.firstname;
  modal.querySelector(".middle-name").innerHTML = student.middlename;

  if (
    !student.middlename &&
    modal.querySelector(".middle-name").innerHTML == "undefined"
  ) {
    modal.querySelector(".middle-name").classList.add("hide"); // Hide if there is no middlename
  } else if (student.middlename) {
    modal.querySelector(".middle-name").classList.remove("hide"); // Hide if there is no middlename
  }

  if (student.lastname == student.firstname) {
    modal.querySelector(".last-name").classList.add("hide"); // Hide if there is no middlename
  } else if (student.lastname) {
    modal.querySelector(".last-name").classList.remove("hide");
  }

  if (student.nickname) {
    modal.querySelector(".nick-name").innerHTML = student.nickname;
    modal.querySelector(".nick-name-hide").classList.remove("hide"); // Hide if there is no middlename
  } else {
    modal.querySelector(".nick-name-hide").classList.add("hide");
  }

  modal.querySelector(".house-name").innerHTML = student.house;
  modal.querySelector(".last-name").innerHTML = student.lastname;
  modal.querySelector(".nick-name").innerHTML = student.nickname;
  modal.querySelector(".blood-status").innerHTML = student.bloodstatus;
  document.querySelector(".student-img").src = student.image;
  modal.dataset.theme = student.house;

  if (student.status === "active") {
    modal.querySelector("#expel").classList.remove("hide");
    modal.querySelector(".expel-status").classList.add("hide");
  }
}

function expelling(student) {
  //Check if active, so there is no duplicates
  if (student.status === "active") {
    student.status = "expelled";
    expelledStudents.push(student); //push to new array
    studentObject.splice(studentObject.indexOf(student), 1); //Remove from old array
    modal.querySelector("#expel").classList.add("hide");
    modal.querySelector(".expel-status").classList.remove("hide");
    displayStudentList(displayStudent); //refresh the list
  } else if (student.status === "expelled") {
    modal.querySelector("#expel").classList.remove("hide");
    modal.querySelector(".expel-status").classList.add("hide");
  }
}

function displayExpelled() {
  cleanArrows();
  currentList = expelledStudents;
  displayCurrentList(currentList);
}

//Popup confirmation
function confirmation(student) {
  modalClosingEvent(modal); //close the old modal

  let confirmationModal = document.querySelector(
    ".confirmation-modal-background"
  );
  confirmationModal.dataset.theme = student.house;
  confirmationModal.classList.remove("hide");

  //Confirmation event on click Yes
  let accept = document.querySelector(".accept");
  accept.addEventListener("click", () => {
    modalClosingEvent(confirmationModal);
    confirmAction(expelling(student));
  });

  //Declining close the modal event on click No
  let decline = document.querySelector(".decline");
  decline.addEventListener("click", () => {
    modalClosingEvent(confirmationModal);
  });
}

//Do the function after it is confirmed
function confirmAction(action) {
  return action;
}

function sortingValues() {
  cleanArrows();

  this.style.setProperty("--sort-content", " ");
  let valueOption = this.getAttribute("value");
  let direction = this.dataset.sort;

  if (direction == "asc") {
    this.dataset.sort = "dsc";
    this.style.setProperty("--sort-content", `"▲"`);
  } else if (direction == "dsc") {
    this.dataset.sort = "asc";
    this.style.setProperty("--sort-content", `"▼"`);
  }

  displayCurrentList(sortStudents(currentList, valueOption, direction));
}

function cleanArrows() {
  let liElem = document.querySelectorAll(".sort-li");

  liElem.forEach((li) => li.style.setProperty("--sort-content", " "));
}

function sortStudents(students, key, direction) {
  const result = students.sort(compare);
  function compare(a, b) {
    if (a[key] < b[key]) {
      return -1 * directionsSort(direction);
    } else {
      return 1 * directionsSort(direction);
    }
  }
  return result;
}

function directionsSort(direction) {
  if (direction == "asc") {
    return 1;
  } else if (direction == "dsc") {
    return -1;
  }
}
