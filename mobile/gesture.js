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
	//此时是通过单击事件来改变状态
	theSwitch.addEventListener('click',function(){
		if(isON){
			theSwitch.style.left = "0px";
			turnOff();
		}else{
			theSwitch.style.left = "69px";
			turnOn();
		}
	});
	//让开关滑动起来
//-------------------监听触摸事件----------------------------------------------
	var TRANSITION_END = "webkitTransitionEnd",
		TRANSITION_CSS = "-webkit-transition",
		TRANSFORM_CSS = "-webkit-transform",
		TRANSFORM = "webkitTransform",
		TRANSITION = "webkitTransition";

	if(document.body.style.transform){
		TRANSITION_END = "transitionend";
		TRANSITION_CSS = "transition";
		TRANSFORM_CSS = "transform";
		TRANSFORM = "transform";
		TRANSITION = "transition";
	}

	var l = $("form").offsetLeft;
	var startLeft,lastX,goTo;

	theSwitch.addEventListener('touchstart',handleTouch);
	theSwitch.addEventListener('touchmove',handleTouch);
	theSwitch.addEventListener('touchend',handleTouch);

	function handleTouch(e){
		switch(e.type){
			case 'touchstart':
			break;
			case 'touchmove':
				goTo = (e.touches[0].pageX - l);
				if(goTo < 69 && goTo > 0){
					lastX = e.touches[0].pageX - l;
					//更新位置
					//定义 3D 转换
					theSwitch.style[TRANSFORM] = 'translate3d((e.touches[0].pageX - l)px,0,0)';
				}
				if(goTo > 35 && !isON){
					console.log("turn on");
					turnOn();
				}else if(goTo < 35 && isON){
					console.log("turn off");
					turnOff();
				}
			break;
			case 'touchcancel':
			case 'touchend':
				if(lastX > 35){
					endPoint = 69;
				}else{
					endPoint = 0;
				}
				theSwitch.style[TRANSITION] = TRANSFORM_CSS = ' .ls ease-put';
				theSwitch.style[TRANSFORM] = 'translate3d('+endPoint+'px,0,0)';
			break;
		}
	}
}


