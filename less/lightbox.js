/*兼容浏览器的函数*/
function $(selector) {
	// body...
	return document.querySelector(selector);
}

var TRANSITION = 'transition',
	TRANSFORM = 'transform',
	TRANSITION_END = 'transitionend',
	TRANSFORM_CSS = 'transfrom',
	TRANSITION_CSS = 'transition';


function detectAnimation(){
	if(document.body.style.webkitTransform !== undefined){
		// 在JS中，动画的名称
		TRANSITION = 'webkitTransition';
		TRANSFORM = 'webkitTransform';
		// transition的唯一事件
		TRANSITION_END = 'webkitTransitionEnd';
		// 在webkit内核的浏览器css样式
		TRANSITION_CSS = '-webkit-transition';
		TRANSFORM_CSS = '-webkit-transfrom';
	}
}

function setPosition(node, left){
	return node.style[TRANSFORM] = "transfrom3d("+left+"px, 0, 0 )";
}

function addTranstions(node) {
	node.style[TRANSITION] = TRANSITION_CSS + ' .25s ease-in-out';

	node.addEventListener(TRANSITION_END, function(e){
		setTimeout(function(){
			e.target.style[TRANSITION] = 'none';
		},0);
	});
}

window.onload = function(){
	var lb = LightBox('.carousel');

	lb.show();
};

function cleanTransition(node){
	node.style[TRANSITION] = 'none';
}


function LightBox(selector){
	var containerNode = $(selector),
	wrapper,
	chromeBuilt,
	currentSlide = 0,
	// 对应的缩略图，并在数组中保存
	slideData = [],

	boundingBox = [0,0],

	slideMap = {};
	// console.log(containerNode);
	// 获取所有的li节点
	(function init(){
		var slides = containerNode.querySelectorAll('li');
		var thisSlide, thisImg;

		for(var i=0;i<slides.length;i++){
			thisSlide = {}, thisImg = slides[i].querySelector('img');

			thisSlide.url = thisImg.getAttribute('src').replace(/_s|_q/,'_z');
			thisSlide.height = thisImg.getAttribute('data-full-height');
			thisSlide.width = thisImg.getAttribute('data-full-width');
			thisSlide.link = slides[i].querySelector('a').href;
			thisSlide.node = slides[i];

			// push() 方法可向数组的末尾添加一个或多个元素，并返回新的长度
			// key: 超链接地址  value : 位置，对应数组的位置
			slideMap[thisSlide.link] = slideData.push(thisSlide) - 1;
			// 记录链接的个数
			slideMap.id = slideMap[thisSlide.link];
		}
	})();

	/*展示灯箱*/
	var show = function(startSlide){
		if(!chromeBuilt){
			buildChrome();
			attachEvents();
		}

		wrapper.style.display = 'block';
		boundingBox = [window.innerWidth,window.innerHeight];

		goTo(slideMap[startSlide]);
		attachTouchEvents();

	};

	var buildChrome = function(){
		wrapper = wrapperTemplate();
		document.body.appendChild(wrapper);
		boundingBox[0] = wrapper.getAttribute('offsetWidth');
		chromeBuilt = true;
	};

	var attachEvents = function(){
		wrapper.addEventListener('click', handleClicks);
	};

	var handleClicks = function (e){
		if(e.target.className == 'next'){
			e.preventDefault();
			goTo(currentSlide + 1);
		}else if(e.target.className == 'prev'){
			e.preventDefault();
			goTo(currentSlide - 1);
		}else if(e.target.className != 'flickr-link'){
			e.preventDefault();
			// hide();
		}
	};

	// 移动幻灯片到正确的位置
	var goTo = 	function(slideNum){
		var thisSlide;

		if(!slideData[slideNum]) {
			goTo(currentSlide);
		}

		if(Math.abs(currentSlide - slideNum) !== 1 && slideData[currentSlide] && slideData[currentSlide].node) {
			setPosition(slideData[currentSlide].node,
						(slideNum < currentSlide) ? boundingBox[0] : 0 - boundingBox[0]);
		}

		thisSlide = slideData[slideNum];
		// 创建连续幻灯片
		buildSlide(slideNum);
		buildSlide(slideNum + 1);
		buildSlide(slideNum - 1);

		if(thisSlide.node) {
			addTranstions(thisSlide.node);
			setPosition(thisSlide.node , 0);
		}

		if(slideData[slideNum - 1] && slideData[slideNum - 1].node) {
			addTranstions(slideData[slideNum - 1].node);
			setPostion(slideData[slideNum - 1].node, (0 - boundingBox[0]));
		}

		currentSlide = slideNum;
	}

	// 创建幻灯片
	var buildSlide = function(slideNum){
		var thisSlide, s, img , scaleFactor = 1, w, h;

		if(!slideData[slideNum] || slideData[slideNum].node) {
			return false;
		}

		thisSlide = slideData[slideNum];
		s = slideTemplate(thisSlide);

		img = s.querySelector('div');


		if(thisSlide.width > boundingBox[0] || thisSlide.height > boundingBox[1]) {
			if(thisSlide.width > thisSlide.heigth) {
				sclaleFactor = boundingBox[0] / thisSlide.width;
			} else {
				scaleFactor = boundingBox[1] / thisSlide.height;
			}

			w = Math.round(thisSlide.width * scaleFactor);
			h = Math.round(thisSlide.height * scaleFactor);
			img.style.height = h + 'px';
			img.style.width = w + 'px';
		}else {
			img.style.height = thisSlide.height + 'px';
			img.style.width = thisSlide.width + 'px';
		}

		thisSlide.node = s;
		wrapper.appendChild(s);
		setPosition(s, boundingBox[0]);
		return s;
	}

	attachTouchEvent();


	// 返回一个对象，隐藏内部的一些变量
	return {
		show:show
		// hide:hide
	}
}



// 构建外壳
var wrapperTemplate = function(){
	var div = document.createElement('div');
	div.innerHTML = '<div class="controls">'+
	'<a class="prev" href="#">prev</a> | '+
	'<a class="next" href="#">next</a></div>'+
	'</div>';

	div.className = "slidewrap";
	return div;
}


// 创建幻灯片模板
function slideTemplate (slide) {
	var div = document.createElement('div');
	div.className = 'slide';
	div.innerHTML = '<div style="background-image:url('+slide.url+'">'+
					'<div class="cpation"><a class="flickr-link" href="'+slide.link+'"> By'+slide.owner+
					' on Flickr</a></div>'+
					'</div>';

	return div;
}





// 添加手势支持：UI规则，向左滑动一次就展示下一张幻灯片。为了给用户以反馈，幻灯片在用户的手指下方随之移动
// 添加监听触摸事件
function attachTouchEvent() {
	var bd  = document.querySelector('html');

	bd.addEventListener('touchmove', handleTouchEvent);
	bd.addEventListener('touchstart', handleTouchEvent);
	bd.addEventListener('touchend', handleTouchEvent);
}

function handleTouchEvent(e){
	// 触碰事件
	// 方向：左/右
	var direction = 0;

	if(e.type == 'touchstart') {
		//相对文档的距离
		startPos = e.touches[0].clientX;
		lastPos = startPos;

		direction = 0;
		if(slideData[currentSlide] && slideData[currentSlide].node) {
			cleanTransitions(slideData[currentSlide].node);
		}

		if(slideData[currentSlide + 1] && slideData[currentSlide + 1].node) {
			cleanTransitions(slideData[currentSlide + 1].node);
		}

		if(slideData[currentSlide - 1] && slideData[currentSlide - 1].node) {
			cleanTransitions(slideData[currentSlide - 1].node);
		}

	}

	if(e.type == 'touchstart') {

	}else if(e.type == 'touchemove'){
		e.preventDefault();

		if(lastPos > startPos) {
			direction = -1;
		}else{
			direction = 1;
		}

		if(slideData[currentSlide]){
			setPosition(slideData[currentSlide].node, e.touches[0].clientX - startPos);

			if(direction !== 0 && slideData[currentSlide + direction]) {
				if(direction < 0) {
					setPosition(slideData[currentSlide + direction].node, (e.touches[0].clientX -startPos) - boundingBox[0]);
				}else if(direction > 0) {
					setPosition(slideData[currentSlide + direction].node, (e.touches[0].clientX - startPos) + boundingBox[0]);
				}
			}
		}

		//记录最后的位置
		lastPos = e.touches[0].clientX;
	}else if(e.type == 'touchend'){
		if(lastPost - startPos > 50) {
			goTo(currentSlide - 1);
		}else if(lastPos - startPost < -50) {
			goTo(currentSlide + 1);
		}else{
			addTranstions(slideData[currentSlide].node);
			setPosition(slideData[currentSlide].node, 0);

			if(slideData[currentSlide + 1] && slideData[currentSlide + 1].node){
				addTranstions(slideData[currentSlide + 1]);
				setPostion(slideData[currentSlide + 1].node, boundingBox[0]);
			}
		}

		if(slideData[currentSlide - 1] && slideData[currentSlide - 1].node){
			addTranstions(slideData[currentSlide - 1]);
			setPositions(slideData[currentSlide - 1].node, 0 - boundingBox[0]);
		}
	}
}

// 这个灯箱只是使用手势的简单例子，在整个过程中都及时告诉用户发生了什么。使用过渡和动画，可以用连续的反馈告诉客户，
// 界面正在发生了什么。

