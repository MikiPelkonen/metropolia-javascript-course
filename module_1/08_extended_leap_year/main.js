"use strict";

function checkForLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

let start_year, end_year;

const list = document.querySelector("#year-list");
do {
  start_year = Number(prompt("Enter the number of the start year:"));
} while (!Number.isInteger(start_year));

do {
  end_year = Number(
    prompt(`Enter the number of the end year (> ${start_year}):`),
  );
} while (!Number.isInteger(end_year) || end_year <= start_year);

for (let year = start_year; year <= end_year; year++) {
  if (!checkForLeapYear(year)) continue;
  const li = document.createElement("li");
  li.innerText = `${year}`;
  list.appendChild(li);
}
