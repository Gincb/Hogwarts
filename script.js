"use strict";

window.addEventListener("DOMContentLoaded", getData);

let studentObject = [];

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

  myClone.querySelector(".first-name").innerHTML = studentObject.firstname;
  myClone.querySelector(".middle-name").innerHTML = studentObject.middlename;
  myClone.querySelector(".last-name").innerHTML = studentObject.lastname;
  myClone.querySelector(".nick-name").innerHTML = studentObject.nickname;

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

  console.log(studentObject);

  myClone.querySelector(".gender").innerHTML = data.gender;
  myClone.querySelector(".house").innerHTML = data.house;

  const where = document.querySelector(".content");
  where.appendChild(myClone);
}

// // let respone = [];

// // fields.forEach((item) => {
// //   respone.push({ [item.label]: "" });
// // });

// console.log(studentObject);
