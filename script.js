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

function displayExpelled() {
  document.querySelector(".content").innerHTML = "";
  expelledStudents.forEach(displayStudent);
}

function displayStudentList() {
  document.querySelector(".content").innerHTML = "";

  // document.querySelector("#sort").addEventListener("change", sortingValues);

  let buttonsSort = document.querySelectorAll("[data-sort]");
  buttonsSort.forEach((button) =>
    button.addEventListener("click", sortingValues)
  );

  studentObject.forEach(displayStudent);
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

  student.firstname =
    seperateName[0][0].toUpperCase() +
    seperateName[0].substring(1).toLowerCase(); //Get first name

  student.lastname = seperateName.pop(); //Get last name

  if (student.lastname == student.firstname) {
    student.lastname = undefined;
  } else {
    student.lastname =
      student.lastname[0].toUpperCase() +
      student.lastname.substring(1).toLowerCase(); //Get last name
  }

  if (student.lastname && student.lastname.includes("-")) {
    student.lastname =
      student.lastname.substring(0, student.lastname.indexOf("-") + 1) +
      student.lastname[student.lastname.indexOf("-") + 1].toUpperCase() +
      student.lastname.substring(student.lastname.indexOf("-") + 2);
  } //Uppercase names with hyphen

  if (seperateName[1] != student.lastname) {
    student.middlename = seperateName[1]; //Get middle name
  }

  if (student.middlename == undefined) {
    student.nickname = undefined; //Set nickname undefined comparing to middle name
  } else if (student.middlename.includes(`"`)) {
    student.nickname = student.middlename.slice(1, -1); //Set nickname
  }

  if (student.middlename) {
    student.middlename =
      student.middlename[0].toUpperCase() + student.middlename.substring(1);
  }

  if (student.nickname == undefined) {
  } else if (student.nickname == student.middlename.slice(1, -1)) {
    student.middlename = undefined;
  }
}

function setAndFindImg(student) {
  if (
    (student.lastname && student.lastname.includes(`-`)) ||
    student.firstname.includes(`-`)
  ) {
    student.image = `images/${student.lastname
      .substring(student.lastname.indexOf("-") + 1)
      .toLowerCase()}_${student.firstname[0].toLowerCase()}.png`;
  } else if (student.lastname) {
    student.image = `images/${student.lastname.toLowerCase()}_${student.firstname[0].toLowerCase()}.png`;
  } else {
    student.image = `images/${student.firstname.toLowerCase()}.png`;
  }

  //Check if image exists function will be replaced, found
  var iamgeExists = function (url) {
    var xhr = new XMLHttpRequest();
    xhr.open("HEAD", url, false);
    xhr.send();
    return xhr.status != 404;
  };

  var url = student.image;

  if (iamgeExists(url)) {
    console.log("This is fine");
  } else if (iamgeExists(url) == false) {
    student.image = `images/${student.lastname.toLowerCase()}_${student.firstname.toLowerCase()}.png`;
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

  if (student.middlename == undefined) {
    modal.querySelector(".middle-name").classList.add("hide"); // Hide if there is no middlename
  }

  if (student.lastname == undefined) {
    modal.querySelector(".last-name").classList.add("hide"); // Hide if there is no middlename
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
  }
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
  let valueOption = this.getAttribute("value");
  console.log(valueOption);
  let direction = this.dataset.sort;
  console.log(direction);

  if (direction == "asc") {
    this.dataset.sort = "dsc";
  } else {
    this.dataset.sort = "asc";
  }

  sortStudents(studentObject, valueOption, direction);
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
  console.table(result);
  return result;
}

function directionsSort(direction) {
  if (direction == "asc") {
    return 1;
  } else if (direction == "dsc") {
    return -1;
  }
}
