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

function addTranstion(node) {
	node.style[TRANSITION] = TRANSITION_CSS + ' .25s ease-in-out';

	node.addEventListener(TRANSITION_END, function(e){
		setTimeout(function(){
			e.target.style[TRANSITION] = 'none';
		},0);
	});
}

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

	slideMap = {},
	// 获取所有的li节点
	init();

	// 返回一个对象，隐藏内部的一些变量
	return {
		show:show,
		hide:hide
	}
}

function init(){
	var slides = containerNode.querySelectorAll('li');
	var thisSlide, thisImg;

	for(var i=0;i<slides.length;i++){
		thisSlide = {}, thisImg = slides[i].querySelector('img');

		thisSlide.url = thisImg.getAttribute('src').replace(/_s|_q/,'_z');
		thisSlide.height = thisImg.getAttribute('data-full-height');
		thisSlide.width = thisImg.getAttribute('data-full-width');
		thisSlide.link = slides[i].querySelector('a').href;

		slideMap[thiSlide.link] = slideData.push(thisSlide) - 1;
		slideMap.id = slideMap[thisSlide.link];
	}
}

/*展示灯箱*/
function show(startSlide){
	if(!chromeBuilt){
		buildChrome():
		attachEvents();
	}

	wrapper.style.display = 'block';
	boundingBox = [window.innerWidth,window.innerHeight];

	gotTo(slideMap[startSlide]);
	attachTouchEvents();
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

function buildChrome(){
	wrapper = wrapperTemplate();
	document.body.appendChild(wrapper);
	boundingBox[0] = wrapper.getAttribute('offsetWidth');
	chromeBuilt = true;
}

function handleClicks(e){
	if(e.target.className == 'next'){
		e.preventDefault();
		goTo(currentSlide + 1);
	}else if(target.className == 'prev'){
		e.preventDefault();
		goTo(currentSlide - 1);
	}else if(target.className != 'flickr-link'){
		e.preventDefault();
		hide();
	}
}

function attacheEvents(){
	wrapper.addEventListener('clikc', handleClicks);
}