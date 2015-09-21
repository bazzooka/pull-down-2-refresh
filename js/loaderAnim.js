const ww = window.innerWidth || document.documentElement.clientWidth;
const wh = window.innerHeight || document.documentElement.clientHeight;

let line2 = document.getElementById('line2'),
	circle = document.getElementById('circle1'),
	isTouch = 'ontouchstart' in window,
    touchStart = isTouch ? 'touchstart' : 'mousedown',
    touchMove = isTouch ? 'touchmove' : 'mousemove',
    touchEnd = isTouch ? 'touchend' : 'mouseup',
	isDragging = false,
	startDragY = 0,
	currentDragY = 0,
	loaderPosition = {x: 0, y: 0, dashPos: 0},
	circleRayon = 20;

let getTouchEvents = (e) => {
  return {
    x: e.clientX || (e.touches && e.touches[0].clientX) || (e.targetTouches && e.targetTouches[0].clientX),
    y: e.clientY || (e.touches && e.touches[0].clientY) || (e.targetTouches && e.targetTouches[0].clientY)
  }
};

let resize = () => {

  svgElt.style.width = ww + 'px';
  svgElt.style.height = wh + 'px';

  let pathL1 = '';
  pathL1 += 'M0,10 ';
  pathL1 += 'L ' + ww + ' 10 ';
  pathL1 += 'Z';

  line2.setAttribute('d', pathL1);

}

resize();

let moveLoaderAnim = (x, y) => {
  let pathL1 = '';

  loaderPosition.x = Math.max(ww - y*1.5, ww * 0.2);
  pathL1 += 'M0,10 ';
  pathL1 += 'L ' + loaderPosition.x + ' 10 ';

  line2.setAttribute('d', pathL1);

  circle.setAttribute('cx', ww/2);
  circle.setAttribute('cy', circleRayon);
  circle.setAttribute('r', circleRayon);
};

var dragEndRefresher = () => {
  console.log('TouchEnd');
  isDragging = false;

  lineToCircle();
}

let lineToCircle = () => {
	
	TweenLite.to(loaderPosition, 0.5, {
		x: ww/2,	
    	ease:Sine.easeInOut,
    	onUpdate: function() {
    		let pathL1 = '';
    		pathL1 += 'M0,10 ';
  			pathL1 += 'L ' + loaderPosition.x + ' 10 ';
  			//pathL1 += 'Z';

	      	line2.setAttribute('d', pathL1);
    	},
    	onComplete: function() {
    		let circleLength = 2*Math.PI * circleRayon;
    		circle.setAttribute('stroke-dashoffset', -circleLength);
		    circle.setAttribute('stroke-dasharray', "" + circleLength +" " + circleLength);
		    loaderPosition.dashPos = -circleLength;
    		
    		TweenLite.to(loaderPosition, 0.5, {
				dashPos: -10,	
		    	ease:Sine.easeInOut,
		    	onUpdate: function() {
		    		circle.setAttribute('stroke-dashoffset', -loaderPosition.dashPos);
		    	},
		    	onComplete: function() {
		    		
		    	}
  			});
    	}
  });
};

document.addEventListener(touchStart, (e)=> {
  console.log('Start');
  isDragging = true;
  startDragY = getTouchEvents(e).y;
});

document.addEventListener(touchEnd, (e)=> {
  console.log('End');
  isDragging = false;

  dragEndRefresher();

});

document.addEventListener(touchMove, (e)=> {
  console.log('Move');
  if (!isDragging) {
    return true;
  }
  currentDragY = getTouchEvents(e).y - startDragY;

  moveLoaderAnim(getTouchEvents(e).x, currentDragY);

});
