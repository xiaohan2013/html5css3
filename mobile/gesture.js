var isON = false;

var $ = function (selector) {
	return document.querySelector(selector);
}

function turnOn(){
	$("#status").innerHTML = "ON";
	isON = true;
}

function turnOff(){
	$("#status").innerHTML = "OFF";
	isON = false;
}

window.onload = function(){
	var theSwitch = $('.switch');
	theSwitch.addEventListener('click',function(){
		if(isON){
			theSwitch.style.left = "0px";
			turnOff();
		}else{
			theSwitch.style.left = "69px";
			turnOn();
		}
	});
}
