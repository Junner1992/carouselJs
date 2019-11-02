
/**
* 轮播实例类
* 兼容IE7
*/

function Carousel(options) {
	this.box = document.getElementById(options.boxId);
	this.data = options.data;
	this.pagination  = this.isTrue(options.pagination);
	this.autoplay = this.isTrue(options.autoplay);
	this.nextButton = this.isTrue(options.nextButton);
	this.description = this.isTrue(options.description);
	this.speed = options.speed || 3000;

	// 盒子宽度
	this.boxW = this.getStyle(this.box,'width');
	// 盒子高度
	this.boxH = this.getStyle(this.box,'height');

	this.boxL = -parseInt(this.boxW); //初始化位置
	this.curNum = 0; //初始化index
	this.b = true;

	this.showFunc()
	this.nextFunc()
	this.prevFunc()
	this.paginationFunc()
	this.autoplay && this.autoplayFunc()
}



	//获取数据 创建轮播图
	Carousel.prototype.createImgBox = function(){

		var 
			_this = this,
			imgLen = _this.data.length,
			imgsBox = document.createElement('div');

		imgsBox.id = 'imgsBox';
		imgsBox.style.width = imgLen * parseInt(_this.boxW) + 'px';

		for(var i=0;i<imgLen;i++) {
			var imgBox = document.createElement('div');
			imgBox.className = 'slide'

			var imgStr = document.createElement('img');
			imgStr.src = _this.data[i].img;
			imgBox.appendChild(imgStr);

			imgsBox.appendChild(imgBox);
		}

		_this.box.appendChild(imgsBox);
		
	}

	//创建描述
	Carousel.prototype.createDesc = function(){
		
		var imgsBox = document.getElementById('imgsBox');
		var slide = imgsBox.getElementsByTagName('div');

		for(var i=0;i<slide.length;i++){
			var 
				oldstr = slide[i].innerHTML,
				newstr = '<span>' + this.data[i].title + '</span>' + oldstr;
			slide[i].innerHTML = newstr;
		}
	}

	//创建 前进后退按钮
	Carousel.prototype.createNextButton = function(){
		var arr = ['prev','next']
		for(var i=0;i<arr.length;i++){
			var obj = document.createElement('span');
			obj.id = arr[i];
			this.box.appendChild(obj)
		}
	}

	//创建 分页器
	Carousel.prototype.createPagination = function(){
		var pagBox = document.createElement('div');
		pagBox.id = 'pagBox';

		for(var i=0;i<this.data.length;i++){
			var pag = document.createElement('span');
			pag.className = 'pag';
			pagBox.appendChild(pag);
		}
		this.box.appendChild(pagBox);
		document.getElementById('pagBox').getElementsByTagName('span')[0].className = 'pag active';

	}

	// 首尾添加
	Carousel.prototype.addFunc = function(){
		var imgsBox = document.getElementById('imgsBox');
		var slide = imgsBox.getElementsByTagName('div');

		var tailItem = slide[0].cloneNode(true);
		var firstItem = slide[slide.length - 1].cloneNode(true);

		imgsBox.appendChild(tailItem);
		imgsBox.insertBefore(firstItem,slide[0]);
		//设置box宽
		imgsBox.style.width = (this.data.length + 2) * parseInt(this.boxW) + 'px';

		imgsBox.style.left = this.boxL + 'px';

	}

	// 功能显示设置
	Carousel.prototype.showFunc = function(){
		this.createImgBox();
		this.description && this.createDesc();
		this.nextButton && this.createNextButton();
		this.pagination && this.createPagination();
		this.addFunc();
	}

	//切换封装
	Carousel.prototype.moveFunc = function(tabNum,curIndex,setLeft,setIndex){
		var imgsBox = document.getElementById('imgsBox');

		if(this.b) {
			this.boxL = this.boxL + tabNum;
			
			if(tabNum < 0){
				this.curNum ++;
			} else {
				this.curNum --;
			}

			var _this = this;
			this.animate(imgsBox,{"left": this.boxL },function(){
				
				if (_this.curNum == curIndex) {
					imgsBox.style.left = setLeft + 'px';
					_this.boxL = setLeft;
					_this.curNum = setIndex;
				};
				_this.paginationFunc()
				_this.b = true;

			});

		};
		this.b = false;
	}

	// 下一张
	Carousel.prototype.nextFunc = function(){

		var _this = this;
		var tabNum = -parseInt(this.boxW);
		var curIndex = this.data.length;
		var setLeft = -parseInt(this.boxW);
		var setIndex = 0;

		var nextBtn = document.getElementById('next');
		if(!nextBtn) return;
		nextBtn.onclick = function(){
			_this.moveFunc(tabNum,curIndex,setLeft,setIndex);
		};
	}

	// 上一张
	Carousel.prototype.prevFunc = function(){

		var _this = this;
		var tabNum = parseInt(this.boxW);
		var curIndex = -1;
		var setLeft = -(parseInt(this.boxW) * this.data.length);
		var setIndex = this.data.length - 1;

		var prevBtn = document.getElementById('prev');
		if(!prevBtn) return;

		prevBtn.onclick = function(){
			_this.moveFunc(tabNum,curIndex,setLeft,setIndex);
		};
	}

	//分页器
	Carousel.prototype.paginationFunc = function(){
		
		var pagBox = document.getElementById('pagBox');
		var pag = pagBox.getElementsByTagName('span');
		var imgsBox = document.getElementById('imgsBox');
		var _this = this;

		function setActive(){
			if(pag.length == 0) return;
			for(var j=0;j<pag.length;j++){
				pag[j].className = 'pag'
			}
			pag[_this.curNum].className = 'pag active';
		}

		for(var i=0;i<pag.length;i++) {
			pag[i].index = i;
			pag[i].onclick = function(){
				_this.curNum = this.index;
				_this.boxL = (this.index + 1) * -parseInt(_this.boxW); 
				_this.animate(imgsBox,{"left":_this.boxL},function(){
					setActive()
				})
			};
		}
		

		setActive()

	}

	//自动播放
	Carousel.prototype.autoplayFunc = function(){
		var _this = this;
		var imgsBox = document.getElementById('imgsBox');
		var pagBox = document.getElementById('pagBox');
		var pag = pagBox.getElementsByTagName('span');

		function setActive(){
			if(pag.length == 0) return;
			for(var j=0;j<pag.length;j++){
				pag[j].className = 'pag'
			}
			pag[_this.curNum].className = 'pag active';
		}

		var moveStartTimer = null;
		function timeMove(){
			moveStartTimer = setTimeout(function timer(){

				_this.curNum ++
				_this.boxL = - (_this.curNum + 1) * parseInt(_this.boxW)

				_this.animate(imgsBox,{"left":_this.boxL},function(){

					if (_this.curNum < _this.data.length ) {
						moveStartTimer = setTimeout(timer,_this.speed);
						setActive()
					} else {
						imgsBox.style.left = -parseInt(_this.boxW) + 'px'
						_this.boxL = -parseInt(_this.boxW);
						_this.curNum = 0;
						moveStartTimer = setTimeout(timer,_this.speed);
						setActive()
					}

				});
				
			},_this.speed);
		};
		timeMove()

		//鼠标移入停止轮播
		_this.box.onmouseover = function(){
			console.log('stop')
			clearTimeout(moveStartTimer)
			moveStartTimer = null;
			_this.box.onmouseout = function(){
				console.log('start')
				timeMove()
			}
		}
	}


	/** 工具方法 ****************/
	Carousel.prototype.getStyle = function(ele,name){
	  if(ele.style.styleFloat) {
	    return ele.style.styleFloat;   //ie下float处理
	  }else if(ele.style.cssFloat){
	    return ele.style.cssFloat;     //火狐等float处理
	  }
	  if (ele.currentStyle) {
	    return ele.currentStyle[name];
	  } else {
	    return getComputedStyle(ele, false)[name];
	  }
	}

	Carousel.prototype.isTrue = function(obj){
		return obj == false ? obj : true;
	}

	Carousel.prototype.animate = function(ele, attr_json, callback) {
	  // 清除定时器，避免动画重合
	  clearInterval(ele.timer);
	  var _this = this;
	  ele.timer = setInterval(function () {
	    var flag = true;    //定时器是否清除的标记值

	    for (var attr in attr_json) {
	      var current = 0;
	      //获取当前样式
	      if (attr == "opacity") {          //如果是透明度，那么返回值，如果不兼容就返回0
	        current = Math.round(parseInt(_this.getStyle(ele, attr) * 100)) || 0;
	      } else {                          //其他
	        current = parseInt(_this.getStyle(ele, attr));
	      }

	      //计算步长,并进行取整来避免除不尽引起的误差
	      var stepLength = (attr_json[attr] - current) / 10;
	      stepLength = stepLength > 0 ? Math.ceil(stepLength) : Math.floor(stepLength);

	      //判断要改变的样式是否是透明度
	      if (attr == "opacity") {
	        if ("opacity" in ele.style) {
	          ele.style.opacity = (current + stepLength) / 100;
	        } else {
	          ele.style.filter = "alpha(opacity = " + (current + stepLength) * 10 + ")";
	        }
	      }

	      //判断要改变的样式是否是层级
	      else if (attr == "zIndex") {
	        ele.style.zIndex = current + stepLength;
	      }
	      //其他属性
	      else {
	        ele.style[attr] = (current + stepLength) + "px";
	      }
	      //判断是否清除定时器
	      if (current != attr_json[attr]) {
	        flag = false;
	      }
	    }

	    if (flag) {
	      clearInterval(ele.timer);
	      if (callback) {
	        callback();
	      }
	    }
	  }, 10)
	}





