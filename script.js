"use strict";

window.addEventListener("DOMContentLoaded", getData);

//Add event to hide modal
const modalClose = document.querySelector(".close");
const modal = document.querySelector(".modal-background");

modalClose.addEventListener("click", () => {
  modal.classList.add("hide");
});

let studentObject = [];

let oneStudent = {
  firstname: "",
  middlename: "",
  lastname: "",
  nickname: "",
  gender: "",
  house: "",
  image: "",
};

function getData() {
  fetch("https://petlatkea.dk/2020/hogwarts/students.json")
    .then((res) => res.json())
    .then(handleData);
}

function handleData(students) {
  students.forEach(prepareData);
}

function prepareData(data) {
  const student = Object.create(oneStudent);
  console.table(data);
  nameSeperator(data, student);

  student.house = data.house.trim();
  student.house =
    student.house[0].toUpperCase() + student.house.substring(1).toLowerCase(); //Capitalize house name

  if (
    (student.lastname && student.lastname.includes(`-`)) ||
    student.firstname.includes(`-`)
  ) {
    student.image = `images/${student.lastname
      .substring(student.lastname.indexOf("-") + 1)
      .toLowerCase()}_${student.firstname[0].toLowerCase()}.png`;
  } else if (student.lastname) {
    student.image = `images/${student.lastname.toLowerCase()}_${student.firstname[0].toLowerCase()}.png`;
  }

  //Check if image exists
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

  studentObject.push(student);

  displayStudentList();
}

function displayStudentList() {
  document.querySelector(".content").innerHTML = "";

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

function showModalContent(student) {
  modal.querySelector(".modal-first-name").innerHTML = student.firstname;
  modal.querySelector(".middle-name").innerHTML = student.middlename;

  if (student.middlename == undefined) {
    modal.querySelector(".middle-name").classList.add("hide"); // Hide if there is no middlename
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
  document.querySelector(".student-img").src = student.image;

  modal.dataset.theme = student.house;
}
