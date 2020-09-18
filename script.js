"use strict";

window.addEventListener("DOMContentLoaded", getData);

//Add event
initialEvents();
const modal = document.querySelector(".modal-background");
let declineModal = document.querySelector(
  ".declined-confirmation-modal-background"
);
let confirmationModal = document.querySelector(
  ".confirmation-modal-background"
);
let errorModal = document.querySelector(".error-modal-background");

let buttonHouse = ""; //Create a var when setting new housebased on filter

let studentObject = [];
let halfFamily = [];
let pureFamily = [];
let expelledStudents = [];
let isStudents = [];
let prefectStudents = [];
let currentList = [];
let allHouses = [];
let prefectHouses = [];
let searchStudents = [];

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
  inquisitor: "",
  prefect: "",
};

let me = {
  firstname: "Gintare",
  middlename: undefined,
  lastname: "Bespalovaite",
  nickname: "Ginc",
  house: "Slytherin",
  image: "images/me.jpg",
  bloodstatus: "Pure-blood",
  status: "active",
  inquisitor: false,
  prefect: false,
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
    student.inquisitor = false;
    student.prefect = false;

    studentObject.push(student);
  });
  displayAllStudentsList();
}

function displayAllStudentsList() {
  cleanArrows();
  document.querySelector(".content").innerHTML = "";
  currentList = studentObject;

  displayCurrentList(currentList);
}

function displayCurrentList(currentList) {
  document.querySelector(".content").innerHTML = "";
  let buttonsSort = document.querySelectorAll("[data-sort]");
  buttonsSort.forEach((button) =>
    button.addEventListener("click", sortingValues)
  );

  document
    .querySelector("#expel-filter")
    .addEventListener("click", displayExpelled);

  document
    .querySelector("#active-filter")
    .addEventListener("click", displayAllStudentsList);

  document.querySelector("#is-filter").addEventListener("click", displayIS);

  document
    .querySelector("#prefect-filter")
    .addEventListener("click", displayPrefects);

  let buttonFilterHouse = document.querySelectorAll("#house-filter li");
  buttonFilterHouse.forEach((button) =>
    button.addEventListener("click", createHouseButton)
  );

  document
    .querySelector(".new-student")
    .addEventListener("click", hackTheSystem);

  document
    .querySelector(".search")
    .addEventListener("input", searchStudentList);

  countPrefects(prefectStudents);
  displayCount(prefectStudents);
  currentList.forEach(displayStudent);
}

function displayStudent(student) {
  //Put data to the template
  const templateElement = document.querySelector("#template").content;
  const myClone = templateElement.cloneNode(true);

  myClone.querySelector(".first-name").innerHTML = student.firstname;
  myClone.querySelector(".img").src = student.image;

  //Add animation for me after hack
  if (myClone.querySelector(".student").textContent.trim() === "Gintare") {
    myClone.querySelector(".student").classList.add("animation-shake");
    myClone.querySelector(".first-name").textContent = "G̷̪̝͙͉̫͙̩̠̞̪̝͚̬̙̻̪͎̩̠͖͔̹͕̓̂̊̈͑̐͊͆̿͝ͅi̷̧̛͖͈͊̓̽̈͗͂̈́̽͂͝͠͝n̵̠̥̰̤̰̝̘͇̺̟̖͂̌̍̏̀̓͗͌̆̇̀̈́̃̈́̑́͋̏̓̂͂̒̅̿̉̈́͗͐͑̒̆́̃̈́̇̌̓̅̚͘͠͠ͅṯ̴̛̥͚̘̭͔̝̺̿̓̅̓̋̃̄̀̎̌a̵̧̡̢̱͇͖͓͎̺̺̦͖̻͓͍̱̫͍͕͓̲̞̺̳͖̫̱̜̮̝̪̣̝̺̙͚̞͊̏́͊͗̆́͑̚͜ͅŗ̷̧̣̫͉͉͓̦̗̫̣̱̋̆̋͌̀̑̾̐́̋̌̓̔̀͂̀͒̑́̉͌̈́̐̃͗̅̑̚͘͘̚͘͝e̴͕̪̺̜̬̖͚̰̜͙̙̣̹̙͉̠̱̪̜͉͓͈̩̜̣͈̜͖̜͚̊͒͌̂͛̌͐͂̀́̾̅͒̌͑́̈́̓͑͂̂͑̃̄̆̔̀̈́̌́̌̚͜͝͝";
    myClone.querySelector(".name-fade").style.backgroundColor = "black";
  }

  //Add specific class to reach for animation
  myClone
    .querySelector(".student")
    .classList.add(`student-${student.firstname}`);
  myClone.querySelector(".student").addEventListener("click", openModal);

  function openModal() {
    showModalContent(student);

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

function searchStudentList() {
  let inputValue = this.value;
  for (let i = 0; i <= studentObject.length; i++) {
    if (
      studentObject[i].firstname == inputValue ||
      studentObject[i].lastname == inputValue
    ) {
      console.log(studentObject[i]);
      searchStudents.push(studentObject[i]);
      console.table(searchStudents);
      currentList = searchStudents;
      displayCurrentList(currentList);
    } else if (inputValue === "") {
      searchStudents = [];
      displayCurrentList(studentObject);
    }
  }
}

function initialEvents() {
  //Add event
  const modalClose = document.querySelector(".close");
  const modalDeclinedClose = document.querySelector(".close-declined");
  const modalErrorClose = document.querySelector(".close-error");

  modalClose.addEventListener("click", () => {
    modalClosingEvent(modal);
  });

  modalDeclinedClose.addEventListener("click", () => {
    modalClosingEvent(declineModal);
  });

  modalErrorClose.addEventListener("click", () => {
    modalClosingEvent(errorModal);
    setTimeout(function () {
      document
        .querySelector(".error-modal-content > h2")
        .classList.remove("hide");
      document.querySelector(".hack-is").textContent = "";
      document
        .querySelector(".error-modal-content")
        .classList.remove("animation-popup");
    }, 500);
  });
}

function modalClosingEvent(aModal) {
  aModal.classList.add("animationFadeOut");
  setTimeout(function () {
    aModal.classList.remove("animationFadeOut");
    aModal.classList.add("hide");
  }, 350);

  removeEvents();
}

function modalOpeningEvent(aModal) {
  aModal.classList.add("animationFadein");
  setTimeout(function () {
    aModal.classList.remove("animationFadein");
  }, 350);
}

function showModalContent(student) {
  buttonEvents(student);
  hideUndefinedNames(student);
  hideStatusAndButton(student);
  modal.querySelector(".modal-first-name").innerHTML = student.firstname;
  modal.querySelector(".last-name").innerHTML = student.lastname;
  modal.querySelector(".middle-name").innerHTML = student.middlename;
  modal.querySelector(".nick-name").innerHTML = student.nickname;
  modal.querySelector(".house-name").innerHTML = student.house;
  modal.querySelector(".blood-status").innerHTML = student.bloodstatus;
  document.querySelector(".student-img").src = student.image;
  modal.dataset.theme = student.house;
}

function hideUndefinedNames(student) {
  if (
    !student.middlename ||
    (!student.middlename &&
      modal.querySelector(".middle-name").innerHTML == "undefined")
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
}

function hideStatusAndButton(student) {
  if (student.status === "active") {
    modal.querySelector("#expel").classList.remove("hide");
    modal.querySelector(".expel-status").classList.add("hide");
    modal.querySelector("#prefect").classList.remove("hide");
  } else {
    modal.querySelector(".is-status").classList.add("hide");
    modal.querySelector("#expel").classList.add("hide");
    modal.querySelector("#is").classList.add("hide");
    modal.querySelector("#prefect").classList.add("hide");
    modal.querySelector(".expel-status").classList.remove("hide");
  }

  if (student.inquisitor === true) {
    modal.querySelector("#is").classList.add("hide");
    modal.querySelector(".is-status").classList.remove("hide");
  } else if (student.inquisitor === false && student.status === "active") {
    modal.querySelector("#is").classList.remove("hide");
    modal.querySelector(".is-status").classList.add("hide");
  }

  if (student.inquisitor === true) {
    document.querySelector("#is-revoke").classList.remove("hide");
  } else {
    document.querySelector("#is-revoke").classList.add("hide");
  }

  if (student.prefect === true) {
    modal.querySelector("#prefect").classList.add("hide");
    modal.querySelector(".prefect-status").classList.remove("hide");
  } else if (student.prefect === false && student.status === "active") {
    modal.querySelector("#prefect").classList.remove("hide");
    modal.querySelector(".prefect-status").classList.add("hide");
  } else if (student.prefect === false) {
    modal.querySelector(".prefect-status").classList.add("hide");
  }

  if (student.prefect === true) {
    document.querySelector("#prefect-revoke").classList.remove("hide");
  } else {
    document.querySelector("#prefect-revoke").classList.add("hide");
  }
}

function buttonEvents(student) {
  document.querySelector("#expel").addEventListener("click", expelStudent);
  function expelStudent() {
    confirmation(student);
    acceptExpel(student);
  }

  document.querySelector("#is").addEventListener("click", setAsIS);
  function setAsIS() {
    confirmation(student);
    acceptIS(student);
  }

  document.querySelector("#is-revoke").addEventListener("click", revoke);
  function revoke() {
    confirmation(student);
    acceptRevokeIS(student);
  }

  document.querySelector("#prefect").addEventListener("click", prefect);
  function prefect() {
    confirmation(student);
    acceptPrefect(student);
  }

  document
    .querySelector("#prefect-revoke")
    .addEventListener("click", prefectRevoke);
  function prefectRevoke() {
    confirmation(student);
    acceptRevokePrefect(student);
  }
}

function removeEvents() {
  //Can't remove anonymous functions, so replacing buttons
  //Tip how to deal with from Stefan Florea
  const expellButtton = document.querySelector("#expel"),
    expellButttonClone = expellButtton.cloneNode(true);
  expellButtton.parentNode.replaceChild(expellButttonClone, expellButtton);

  const isButton = document.querySelector("#is"),
    isButtonClone = isButton.cloneNode(true);
  isButton.parentNode.replaceChild(isButtonClone, isButton);

  const isRevokeButton = document.querySelector("#is-revoke"),
    isRevokeButtonClone = isRevokeButton.cloneNode(true);
  isRevokeButton.parentNode.replaceChild(isRevokeButtonClone, isRevokeButton);

  const prefectButton = document.querySelector("#prefect"),
    prefectButtonClone = prefectButton.cloneNode(true);
  prefectButton.parentNode.replaceChild(prefectButtonClone, prefectButton);

  const prefectRevokeButton = document.querySelector("#prefect-revoke"),
    prefectRevokeButtonClone = prefectRevokeButton.cloneNode(true);
  prefectRevokeButton.parentNode.replaceChild(
    prefectRevokeButtonClone,
    prefectRevokeButton
  );

  const acceptButton = document.querySelector(".accept"),
    acceptButtonClone = acceptButton.cloneNode(true);
  acceptButton.parentNode.replaceChild(acceptButtonClone, acceptButton);
}

function expelling(student) {
  if (student.firstname === "Gintare") {
    declineExpel();
  } else {
    //Check if active, so there is no duplicates
    if (student.status === "active") {
      declineModal.classList.add("hide");
      student.status = "expelled";
      expelledStudents.push(student); //push to new array
      studentObject.splice(studentObject.indexOf(student), 1); //Remove from old array
      displayAllStudentsList(displayStudent); //refresh the list
    }
    if (student.prefect === true) {
      student.prefect = false;
      prefectStudents.splice(prefectStudents.indexOf(student), 1); //Remove from old array
    }
    if (student.inquisitor === true) {
      student.inquisitor = false;
      isStudents.splice(isStudents.indexOf(student), 1); //Remove from old array
    }
  }
}

function acceptExpel(student) {
  //Confirmation event on click Yes
  let accept = document.querySelector(".accept");
  accept.addEventListener("click", () => {
    modalClosingEvent(confirmationModal);
    document
      .querySelector(`.student-${student.firstname}`)
      .classList.add("animationFadeRight");

    setTimeout(function () {
      expelling(student);
    }, 500);
  });
}

function displayExpelled() {
  cleanArrows(); //Reset for sorting
  currentList = expelledStudents;
  displayCurrentList(currentList);
}

function setStudentToIS(student) {
  //Check if I exist in the array
  if (containsObject(me, studentObject) === true) {
    inquisitor(student);
    deleteInquisitor(student);
  } else {
    inquisitor(student);
  }
}

function inquisitor(student) {
  if (
    student.inquisitor === false &&
    student.house === "Slytherin" &&
    student.bloodstatus === "Pure-blood"
  ) {
    if (containsObject(me, studentObject) === true) {
      errorDelete();
    }
    student.inquisitor = true;
    isStudents.push(student); //push to new array
    declineModal.classList.add("hide");
    displayAllStudentsList(displayStudent); //refresh the list
  } else if (student.inquisitor === true) {
    declineModal.classList.add("hide");
  } else {
    declineModal.classList.remove("hide");
    declineModal.dataset.theme = student.house;
  }
}

function acceptIS(student) {
  //Confirmation event on click Yes
  let accept = document.querySelector(".accept");
  accept.addEventListener("click", () => {
    modalClosingEvent(confirmationModal);
    setStudentToIS(student);
  });
}

function acceptRevokeIS(student) {
  let accept = document.querySelector(".accept");
  accept.addEventListener("click", () => {
    if (student.inquisitor === true) {
      student.inquisitor = false;
      isStudents.splice(isStudents.indexOf(student), 1); //Remove from old array
      modalClosingEvent(confirmationModal);
      displayCurrentList(currentList);
    }
  });
}

function displayIS() {
  cleanArrows(); //Reset for sorting
  currentList = isStudents;
  displayCurrentList(currentList);
}

function setAsPrefect(student) {
  if (student.prefect === false && prefectHouses[0][student.house] < 2) {
    student.prefect = true;

    prefectStudents.push(student); //push to new array
    declineModal.classList.add("hide");
    displayAllStudentsList(displayStudent); //refresh the list
  } else if (student.inquisitor === true) {
    declineModal.classList.add("hide");
  } else {
    declineModal.classList.remove("hide");
    declineModal.dataset.theme = student.house;
  }
}

function acceptPrefect(student) {
  //Confirmation event on click Yes
  let accept = document.querySelector(".accept");
  accept.addEventListener("click", () => {
    modalClosingEvent(confirmationModal);
    setAsPrefect(student);
  });
}

function acceptRevokePrefect(student) {
  let accept = document.querySelector(".accept");
  accept.addEventListener("click", () => {
    if (student.prefect === true) {
      student.prefect = false;
      prefectStudents.splice(prefectStudents.indexOf(student), 1); //Remove from old array
      declineModal.classList.add("hide");
      modalClosingEvent(confirmationModal);
      displayCurrentList(currentList);
    }
  });
}

function displayPrefects() {
  cleanArrows(); //Reset for sorting
  currentList = prefectStudents;
  displayCurrentList(currentList);
}

//Popup confirmation
function confirmation(student) {
  modalClosingEvent(modal); //close the old modal

  confirmationModal.dataset.theme = student.house;
  modalOpeningEvent(confirmationModal);
  confirmationModal.classList.remove("hide");

  //Declining close the modal event on click No
  let decline = document.querySelector(".decline");
  decline.addEventListener("click", () => {
    modalClosingEvent(confirmationModal);
  });
}

//Change g var buttonHouse based on filter clicked
function createHouseButton() {
  cleanArrows(); //Reset for sorting
  currentList = studentObject; //Reset for filterting
  buttonHouse = this.innerHTML;
  createFilteredList(currentList);
}

function filteringByHouse(students) {
  const result = students.filter(filterFunction);

  function filterFunction(student) {
    if (student.house === buttonHouse) {
      return true;
    } else {
      return false;
    }
  }
  return result;
}

function createFilteredList(students) {
  const filteredHouse = filteringByHouse(students);
  currentList = filteredHouse;
  displayCurrentList(currentList);
}

function sortingValues() {
  cleanArrows(); //Reset for sorting

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

function countPrefects(studentArray) {
  prefectHouses = [];
  let ghouse = 0;
  let shouse = 0;
  let rhouse = 0;
  let hhouse = 0;

  studentArray.forEach((student) => {
    if (student.house == "Gryffindor") ghouse++;
    if (student.house == "Slytherin") shouse++;
    if (student.house == "Hufflepuff") hhouse++;
    if (student.house == "Ravenclaw") rhouse++;
  });

  prefectHouses.push({
    Gryffindor: `${ghouse}`,
    Hufflepuff: `${hhouse}`,
    Slytherin: `${shouse}`,
    Ravenclaw: `${rhouse}`,
  });
}

function countHouses(studentArray) {
  allHouses = [];
  let ghouse = 0;
  let shouse = 0;
  let rhouse = 0;
  let hhouse = 0;

  studentArray.forEach((student) => {
    if (student.house == "Gryffindor") ghouse++;
    if (student.house == "Slytherin") shouse++;
    if (student.house == "Hufflepuff") hhouse++;
    if (student.house == "Ravenclaw") rhouse++;
  });

  allHouses.push({
    Gryffindor: `${ghouse}`,
    Hufflepuff: `${hhouse}`,
    Slytherin: `${shouse}`,
    Ravenclaw: `${rhouse}`,
  });
}

//Count and desplay student numbers
function displayCount() {
  countHouses(studentObject);
  document.querySelector(".gnumber").textContent = allHouses[0].Gryffindor;
  document.querySelector(".snumber").textContent = allHouses[0].Slytherin;
  document.querySelector(".hnumber").textContent = allHouses[0].Hufflepuff;
  document.querySelector(".rnumber").textContent = allHouses[0].Ravenclaw;
  document.querySelector(".activenumber").textContent = studentObject.length;
  document.querySelector(".expellednumber").textContent =
    expelledStudents.length;
  document.querySelector(".currentnumber").textContent = currentList.length;
}

function hackTheSystem() {
  injectMe();
  hackStyle();
  errorDelete();

  studentObject.forEach(hackBlood);
  studentObject.forEach(hackIS); //Delete old Squad
}

function injectMe() {
  //Check if I exist in the array
  if (containsObject(me, studentObject) === false) {
    studentObject.push(me);
  }

  currentList = studentObject;
  displayCurrentList(currentList);
}

function hackStyle() {
  document.querySelector(".thumbnail").classList.add("thumbnail-fade-out");

  setTimeout(function () {
    document.querySelector(".thumbnail").classList.remove("thumbnail-fade-out");
    document.querySelector(".thumbnail").classList.remove("thumbnail-img");
    document.querySelector(".thumbnail").classList.add("thumbnail-fade-in");
    document.querySelector(".thumbnail").classList.add("thumbnail-glitch");
    document.querySelector("#wrapper").classList.add("thumbnail-fade-in");
    document.querySelector("#wrapper").classList.add("body-change");
    document.querySelector("#is-filter").textContent = "I̶͔̓n̸̛̠q̵̗̍u̸̟͘i̴̻̐s̸̢͗ǐ̸͙t̸͇̅ō̶͎ṛ̶͒ĭ̷̩a̷̝̔l̶͓̂ ̷̹͋S̴̖̈q̷̜̓ŭ̷͜a̶̰͘d̷̻̑";
  }, 200);
}

//Error Modal
function declineExpel() {
  modalClosingEvent(confirmationModal);
  modalOpeningEvent(errorModal);
  errorModal.classList.remove("hide");
}

// Found in https://stackoverflow.com/questions/4587061/how-to-determine-if-object-is-in-array
function containsObject(obj, list) {
  var i;
  for (i = 0; i < list.length; i++) {
    if (list[i].firstname === obj.firstname) {
      return true;
    }
  }

  return false;
}

function hackBlood(student) {
  if (student.bloodstatus === "Pure-blood") {
    student.bloodstatus = getRandomBlood();
  } else if (
    student.bloodstatus === "Half-blood" ||
    student.bloodstatus === "Muggle"
  ) {
    student.bloodstatus = "Pure-blood";
  }
}

//Found in https://stackoverflow.com/questions/4550505/getting-a-random-value-from-a-javascript-array
function getRandomBlood() {
  let bloodArray = ["Pure-blood", "Half-blood", "Muggle"];
  const randomBlood = bloodArray[Math.floor(Math.random() * bloodArray.length)];

  return randomBlood;
}

function hackIS(student) {
  if (student.inquisitor === true) {
    deleteInquisitor(student);
  }
}

function deleteInquisitor(student) {
  setTimeout(function () {
    student.inquisitor = false;
    isStudents.splice(isStudents.indexOf(student), 1); //Remove from old array
    modalClosingEvent(confirmationModal);
    displayCurrentList(currentList);
  }, 3000);
}

function errorDelete() {
  setTimeout(function () {
    document.querySelector(".error-modal-content > h2").classList.add("hide");
    document.querySelector(".hack-is").textContent =
      "I̶͔̓n̸̛̠q̵̗̍u̸̟͘i̴̻̐s̸̢͗ǐ̸͙t̸͇̅ō̶͎ṛ̶͒ĭ̷̩a̷̝̔l̶͓̂ ̷̹͋S̴̖̈q̷̜̓ŭ̷͜a̶̰͘d̷̻̑  has been taken down. No more SNITCHES!";
    modalOpeningEvent(errorModal);
    document
      .querySelector(".error-modal-content")
      .classList.add("animation-popup");
    errorModal.classList.remove("hide");
  }, 3000);
}
