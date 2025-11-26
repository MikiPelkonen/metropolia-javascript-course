"use strict";

const trigger = document.getElementById("trigger");
const img = document.getElementById("target");
const imgSrcArr = ["img/picA.jpg", "img/picB.jpg"];

const onEnter = (evt) => {
  evt.preventDefault();
  trigger.setPointerCapture(evt.pointerId);
  img.src = imgSrcArr[1];
};

const onLeave = (evt) => {
  evt.preventDefault();
  trigger.releasePointerCapture(evt.pointerId);
  img.src = imgSrcArr[0];
};

trigger.onpointerenter = onEnter;
trigger.onpointerleave = onLeave;
