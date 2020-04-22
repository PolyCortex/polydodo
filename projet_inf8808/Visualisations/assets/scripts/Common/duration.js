"use strict";

function getDurationString(duration){
    var hours = Math.floor(duration)
    var minutes = (duration % 1.0) * 60.0
    var seconds = (minutes % 1.0) * 60.0
    minutes = Math.floor(minutes)
    seconds = Math.floor(seconds)
    
    return `${addZero(hours)}h ${addZero(minutes)}min ${addZero(seconds)}secs`
  }
function getDurationSecondString(duration){
    duration = Number(duration);
    return getDurationString(duration/3600.0)
  }
//Will add zero to display time in this format : 00:00:00 instead of 0:0:0
function addZero(i) {
  if (i < 10) i = "0" + i;
  return i;
}