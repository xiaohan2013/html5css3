
function togglePictue(){
	var h = document.querySelector(".picture");
	if(h.style.display == "none"){
		h.style.display = "block";
	}else{
		h.style.display = "none";
	}
}

window.onload = function(){
	var node = document.querySelector("#toggle");
	/*
	node.addEventListener("click",function(e){
		e.preventDefault();
		alert("toggle");
		togglePictue();
	});
	*/
	/*
		如果将touchstart改为click事件，那么就必须得阻止事件的默认行为导致按钮
		不会出现活跃(active)状态。活跃状态是用户能知道界面收到一次屏幕轻触的途径，所以他是非常必要的。
	*/
	/*
	node.addEventListener("touchstart",function(e){
		//alert("touchstart");
		e.preventDefault();
		e.target.className = "active button";
		togglePictue();
	});
	node.addEventListener("touchend",function(e){
		//alert("touchend");
		e.preventDefault();
		e.target.className = "button";
		//togglePictue();
	});*/
	
	//使用自定义的轻触事件
	console.log(navigator.userAgent);
	addTapListener(node,function(e){
		e.preventDefault();
		e.target.className = "active button";
		togglePictue();
	});

	node.addEventListener('tapend',function(e){
		e.preventDefault();
		e.target.className = "button";
	});

};


//人工合成事件：轻触
/*
node.addEventListener("tap",function(){
	togglePictue();
});
*/
/*
	initCustomEvent方法的四个参数
	@该事件的名称
	@该事件是否冒泡
	@该事件是否可以取消
	@详细数据，一个任意的数据，会在初始化事件时传递过去

node.addEventListener("touchstart",function(e){
	//CustomEvent is special event type
	var tap = document.createEvent("CustomEvent");
	tap.initCustomEvent("tap",true,true,null);
	node.dispatchEvent(tap);
});*/
/*
	创建一个函数来添加清楚监听器。检测是否支持触摸事件，否则降级兼容到使用鼠标事件
*/
function addTapListener(node, callback){
	alert("addTapListener");
	var startEvent = 'mousedown', endEvent = 'mouseup';

	//检测浏览器是否支持轻触事件:检查window上对象的存在性
	//对于支持轻触事件的桌面浏览器还需要判断指针:是手指还是鼠标
	if (typeof(window.ontouchstart) != 'undefined') {
		startEvent = 'touchstart';
		endEvent = 'touchend';
	}
	node.addEventListener(startEvent,function(e){
			//createEvent:仅仅限于IE内核的浏览器
		var tap = document.createEvent("CustomEvent");
		tap.initCustomEvent('tap',true,true,null);
		node.dispatchEvent(tap);
	});

	node.addEventListener(endEvent,function(e){
		var tapend = document.createEvent("CustomEvent");
		tapend.initCustomEvent('tapend',true,true,null);
		node.dispatchEvent(tapend);
	});

	node.addEventListener('tap',callback);
}




//检测指针的类型
function handleEvent(event){
	switch(event.pointerType){
		case event.MSPOINTER_TYPE_TOUCH:
		break;
		case event.MSPINTER_TYPE_PEN:
		break;
		case event.MSPOINTER_TYPE_MOUSE:
		break;
	}
}
//给元素注册事件处理
//element.addEventListener("MSPointerDown",function(e){},false);

(function({
	var TOUCHSTART,TOUCHEND;

	if (typeof(window.ontouchstart) != 'undefined') {
		TOUCHSTART = 'touchstart';
		TOUCHEND = 'touchend';
	//IE touch event
	} else if(typeof(window.onmspointerdown) != 'undefined'){
		TOUCHSTART = 'MSPointerDown';
		TOUCHEND = 'MSPoninterUp';
	} else {
		TOUCHSTART = 'mousedown';
		TOUCHEND = 'mouseup';
	}

	function NodeFacade(node){
		this._node = node;
	}

	NodeFacade.prototype.getDomNode = function(){
		return this._node;
	}

	//因为tap和tapend不是真实的事件，可以用任何定义为TOUCHSTART和TOUCHEND
	//的常量来代替他们的绑定
	NodeFacade.prototype.on = function(evt, callback){
		if(evt == 'tap'){
			this._node.addEventListener(TOUCHSTART, callback);
		}else if(evt == 'tapend') {
			thsi._node.addEventListener(TOUCHEND, callback);
		}else{
			this._node.addEventListener(evt, callback);
		}
		return this;
	}

	NodeFacade.prototype.off = function(evt, callback){
		if(evt == 'tap'){
			this._node.removeEventListener(TOUCHSTART, callback);
		}else if(evt == 'tapend') {
			thsi._node.removeEventListener(TOUCHEND, callback);
		}else{
			this._node.removeEventListener(evt, callback);
		}
		return this;
	}

	window.$$ = function(selector){
		var node = document.querySelector(selector);
		if(node){
			return new NodeFacade(node);
		}else{
			return null;
		}
	}
}));

$$(".button").on('tap',function(e){
	e.preventDefault();
	togglePictue();
	e.target.className = 'active button';
}).on('tapend',function(e){
	e.target.className = 'button';
});
