"use strict";

window.addEventListener("DOMContentLoaded", getData);

let studentObject = {
  firstname: "",
  middlename: "",
  image: "",
  lastname: "",
  nickname: "",

  house: "",
};

function getData() {
  fetch("https://petlatkea.dk/2020/hogwarts/students.json")
    .then((res) => res.json())
    .then(handleData);
}

function handleData(students) {
  students.forEach(showData);
}

function showData(data) {
  //Put data to the template
  const templateElement = document.querySelector("#template").content;
  const myClone = templateElement.cloneNode(true);

  data.fullname.trim(); //Delete white space
  const seperateName = data.fullname.trim().split(" "); //Seperate names into parts

  studentObject.firstname =
    seperateName[0][0].toUpperCase() +
    seperateName[0].substring(1).toLowerCase(); //Get first name

  studentObject.lastname = seperateName.pop(); //Get last name
  studentObject.lastname =
    studentObject.lastname[0].toUpperCase() +
    studentObject.lastname.substring(1).toLowerCase(); //Get last name

  if (studentObject.lastname.includes("-")) {
    studentObject.lastname =
      studentObject.lastname.substring(
        0,
        studentObject.lastname.indexOf("-") + 1
      ) +
      studentObject.lastname[
        studentObject.lastname.indexOf("-") + 1
      ].toUpperCase() +
      studentObject.lastname.substring(studentObject.lastname.indexOf("-") + 2);
  } //Uppercase names with hyphen

  if (seperateName[1] != studentObject.lastname) {
    studentObject.middlename = seperateName[1]; //Get middle name
  }

  if (studentObject.middlename == undefined) {
    studentObject.nickname = undefined; //Set nickname undefined comparing to middle name
  } else if (studentObject.middlename.includes(`"`)) {
    studentObject.nickname = studentObject.middlename.slice(1, -1); //Set nickname
  }

  if (studentObject.middlename == undefined) {
    myClone.querySelector(".middle-name").classList.add("hide"); // Hide if there is no middlename
  } else {
    studentObject.middlename =
      studentObject.middlename[0].toUpperCase() +
      studentObject.middlename.substring(1);
  }

  if (studentObject.nickname == undefined) {
    myClone.querySelector(".nick-name").classList.add("hide"); // Hide if there is no nickname
  } else if (studentObject.nickname == studentObject.middlename.slice(1, -1)) {
    studentObject.middlename = undefined;
    myClone.querySelector(".middle-name").classList.add("hide"); // Check if nickname is same as middle name then hide
  }

  studentObject.house = data.house.trim();
  studentObject.house =
    studentObject.house[0].toUpperCase() +
    studentObject.house.substring(1).toLowerCase(); //Capitalize house name

  if (
    studentObject.lastname.includes(`-`) ||
    studentObject.firstname.includes(`-`)
  ) {
    studentObject.image = `images/${studentObject.lastname
      .substring(studentObject.lastname.indexOf("-") + 1)
      .toLowerCase()}_${studentObject.firstname[0].toLowerCase()}.png`;
  } else {
    studentObject.image = `images/${studentObject.lastname.toLowerCase()}_${studentObject.firstname[0].toLowerCase()}.png`;
  }

  //Check if image exists
  var iamgeExists = function (url) {
    var xhr = new XMLHttpRequest();
    xhr.open("HEAD", url, false);
    xhr.send();
    return xhr.status != 404;
  };

  var url = studentObject.image;

  if (iamgeExists(url)) {
    console.log("This is fine");
  } else if (iamgeExists(url) == false) {
    studentObject.image = `images/${studentObject.lastname.toLowerCase()}_${studentObject.firstname.toLowerCase()}.png`;
  }

  // if (iamgeExists(url) == false) {
  //   studentObject.image = undefined;
  //   myClone.querySelector(".img").classList.add("hide");
  // }

  myClone.querySelector(".first-name").innerHTML = studentObject.firstname;
  myClone.querySelector(".middle-name").innerHTML = studentObject.middlename;
  myClone.querySelector(".last-name").innerHTML = studentObject.lastname;
  myClone.querySelector(".nick-name").innerHTML = studentObject.nickname;
  myClone.querySelector(".gender").innerHTML = data.gender;
  myClone.querySelector(".house").innerHTML = studentObject.house;

  myClone.querySelector(".img").src = studentObject.image;

  const where = document.querySelector(".content");
  where.appendChild(myClone);
  console.log(studentObject);
}
