
/**
* 轮播实例类
*/
class Carousel{
	constructor(options){

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
		this.switch = true; 

		this.showFunc()
		this.nextFunc()
		this.prevFunc()
		this.paginationFunc()
		this.autoplay && this.autoplayFunc()
	}

	//获取数据 创建轮播图
	createImgBox(){

		let 
			imgLen = this.data.length,
			imgsBox = document.createElement('div');

		imgsBox.className = 'imgsBox'
		imgsBox.style.width = imgLen * parseInt(this.boxW) + 'px'

		for(let i=0;i<imgLen;i++) {

			let imgBox = document.createElement('div');
			imgBox.className = 'slide'

			let imgStr = `
				<img src="${this.data[i].img}" alt="">
			` 
			imgBox.innerHTML = imgStr;
			imgsBox.appendChild(imgBox);
		}

		this.box.appendChild(imgsBox);
		
	}

	//创建描述
	createDesc(){
		//
		let slide = this.box.getElementsByClassName('slide');

		Array.from(slide).forEach((item,i) =>{
			let 
				oldstr = item.innerHTML,
				newstr = `
					<span>${this.data[i].title}</span>
					${oldstr}
				`;
				item.innerHTML = newstr;
		})
	}

	//创建 前进后退按钮
	createNextButton(){
		['prev','next'].forEach(item =>{
			let obj = document.createElement('span');
			obj.className = item;
			this.box.appendChild(obj)
		})
	}

	//创建 分页器
	createPagination(){
		let pagBox = document.createElement('div');
		pagBox.className = 'pagBox';
		this.data.forEach(item =>{
			let pag = document.createElement('span');
			pag.className = 'pag';
			pagBox.appendChild(pag);
		})
		this.box.appendChild(pagBox);
		this.box.getElementsByClassName('pag')[0].className = 'pag active';

	}

	// 首尾添加
	addFunc(){
		let imgsBox = this.box.getElementsByClassName('imgsBox')[0];
		let slide = imgsBox.getElementsByClassName('slide');

		let tailItem = slide[0].cloneNode(true);
		let firstItem = slide[slide.length - 1].cloneNode(true);

		imgsBox.appendChild(tailItem);
		imgsBox.insertBefore(firstItem,slide[0]);
		//设置box宽
		imgsBox.style.width = (this.data.length + 2) * parseInt(this.boxW) + 'px';

		imgsBox.style.left = this.boxL + 'px';

	}

	// 功能显示设置
	showFunc(){
		this.createImgBox();
		this.description && this.createDesc();
		this.nextButton && this.createNextButton();
		this.pagination && this.createPagination();
		this.addFunc();
	}

	//切换封装
	moveFunc(tabNum,curIndex,setLeft,setIndex){
		let imgsBox = this.box.getElementsByClassName('imgsBox')[0];

		if(this.switch) {
			this.boxL = this.boxL + tabNum;
			
			if(tabNum < 0){
				this.curNum ++;
			} else {
				this.curNum --;
			}

			let _this = this;
			this.animate(imgsBox,{"left": this.boxL },function(){
				
				if (_this.curNum == curIndex) {
					imgsBox.style.left = setLeft + 'px';
					_this.boxL = setLeft;
					_this.curNum = setIndex;
				};
				_this.paginationFunc()
				_this.switch = true;

			});

		};
		this.switch = false;
	}

	// 下一张
	nextFunc(){

		let _this = this;
		let tabNum = -parseInt(this.boxW);
		let curIndex = this.data.length;
		let setLeft = -parseInt(this.boxW);
		let setIndex = 0;

		let nextBtn = this.box.getElementsByClassName('next')[0];
		if(!nextBtn) return;
		nextBtn.onclick = function(){
			_this.moveFunc(tabNum,curIndex,setLeft,setIndex);
		};
	}

	// 上一张
	prevFunc(){

		let _this = this;
		let tabNum = parseInt(this.boxW);
		let curIndex = -1;
		let setLeft = -(parseInt(this.boxW) * this.data.length);
		let setIndex = this.data.length - 1;

		let prevBtn = this.box.getElementsByClassName('prev')[0];
		if(!prevBtn) return;

		prevBtn.onclick = function(){
			_this.moveFunc(tabNum,curIndex,setLeft,setIndex);
		};
	}

	//分页器
	paginationFunc(){
		
		let pag = this.box.getElementsByClassName('pag');
		let imgsBox = this.box.getElementsByClassName('imgsBox')[0];
		let _this = this;

		const setActive = ()=>{
			if(pag.length == 0) return;
			Array.from(pag).forEach(item => item.className = 'pag');
			pag[_this.curNum].className = 'pag active';
		}

		Array.from(pag).forEach((item,index) =>{

			item.onclick =()=>{
				this.curNum = index;
				this.boxL = (index + 1) * -parseInt(this.boxW); 

				this.animate(imgsBox,{"left":this.boxL},function(){
					setActive()
				})
			};
		})

		setActive()

	}

	//自动播放
	autoplayFunc(){
		let _this = this;
		let imgsBox = this.box.getElementsByClassName('imgsBox')[0];
		let pag = this.box.getElementsByClassName('pag');

		const setActive = ()=>{
			if(pag.length == 0) return;
			Array.from(pag).forEach(item => item.className = 'pag');
			pag[_this.curNum].className = 'pag active';
		}

		let moveStartTimer = null;
		const timeMove = ()=>{
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
				
			},this.speed);
		};
		timeMove()

		//鼠标移入停止轮播
		this.box.onmouseover = function(){
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
	getStyle(ele,name){
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
	isTrue(obj){
		return obj == false ? obj : true;
	}
	animate(ele, attr_json, callback) {
	  // 清除定时器，避免动画重合
	  clearInterval(ele.timer);
	  let _this = this;
	  ele.timer = setInterval(function () {
	    let flag = true;    //定时器是否清除的标记值

	    for (let attr in attr_json) {
	      let current = 0;
	      //获取当前样式
	      if (attr == "opacity") {          //如果是透明度，那么返回值，如果不兼容就返回0
	        current = Math.round(parseInt(_this.getStyle(ele, attr) * 100)) || 0;
	      } else {                          //其他
	        current = parseInt(_this.getStyle(ele, attr));
	      }

	      //计算步长,并进行取整来避免除不尽引起的误差
	      let stepLength = (attr_json[attr] - current) / 10;
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

}



