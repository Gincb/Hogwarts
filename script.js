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

  data.fullname.trim();
  const seperateName = data.fullname.trim().split(" ");

  studentObject.firstname = seperateName[0];
  studentObject.lastname = seperateName.pop();

  if (seperateName[1] != studentObject.lastname) {
    studentObject.middlename = seperateName[1];
    console.log(studentObject);
  }

  myClone.querySelector(".first-name").innerHTML = studentObject.firstname;
  myClone.querySelector(".middle-name").innerHTML = studentObject.middlename;
  myClone.querySelector(".last-name").innerHTML = studentObject.lastname;

  if (studentObject.middlename == undefined) {
    myClone.querySelector(".middle-name").classList.add("hide"); // Hide if there is no second date
  }

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
