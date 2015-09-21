/**
 * https://dribbble.com/shots/2232385-Pull-Down-to-Refresh
 */

const ww = window.innerWidth || document.documentElement.clientWidth;
const wh = window.innerHeight || document.documentElement.clientHeight;
let svgElt  =  document.getElementById('svgElt'),
  line1 = document.getElementById('line1'),
  circle = document.getElementById('circle1'),
    containerList = document.getElementById('container-list'),
    contentList = document.getElementById('content-list');

let isTouch = 'ontouchstart' in window,
    touchStart = isTouch ? 'touchstart' : 'mousedown',
    touchMove = isTouch ? 'touchmove' : 'mousemove',
    touchEnd = isTouch ? 'touchend' : 'mouseup',
    isDragging = false,
    yPos = 0,
    mx = 0,
    startDragY = 0,
    currentDragY = 0,
    maxContentListDragY = 0,
    stretchHeight = 100,
    position = {y: yPos},
    loaderPosition = {x: 0, y: 0, dashPos: 0},
    circleRayon = 20,
    line2Position = {x: 0, y: 5},
    circleLength = 2 * Math.PI * circleRayon,
    isLongOperationFinish = false;

let getTouchEvents = (e) => {
  return {
    x: e.clientX || (e.touches && e.touches[0].clientX) || (e.targetTouches && e.targetTouches[0].clientX),
    y: e.clientY || (e.touches && e.touches[0].clientY) || (e.targetTouches && e.targetTouches[0].clientY)
  }
};

var resize = () => {

  svgElt.style.width = ww + 'px';
  svgElt.style.height = wh + 'px';

  let pathL1 = '';
  pathL1 += 'M' + ww + ' 0 ';
  pathL1 += 'L 0 0 ';
  //pathL1 += "C " + ww*0.7 + " 10 "+ ww*0.72+ " 150 " + ww + " 0";
  pathL1 += 'Z';
  line1.setAttribute('d', pathL1);

  let pathL2 = '';
  pathL2 += 'M0, ' + line2Position.y + ' ';
  pathL2 += 'L ' + ww + ' ' + line2Position.y + ' ';
  pathL2 += 'Z';
  line2.setAttribute('d', pathL2);

  circle.setAttribute('cx', ww / 2);
  circle.setAttribute('cy', line2Position.y + circleRayon);
  circle.setAttribute('r', circleRayon);
  circle.setAttribute('stroke-dashoffset', -circleLength);
  circle.setAttribute('stroke-dasharray', '' + circleLength + ' ' + circleLength);

  maxContentListDragY = contentList.offsetHeight - wh;

}

document.addEventListener(()=> {
  resize();
});

let pushUpList = () => {
  TweenLite.to(position, 1, {
      y: 0,
      ease: Elastic.easeOut.config(1, 0.3),
      onUpdate: function() {
        let pathL1 = '';
        pathL1 += 'M ' + ww + ' 0 ';
        pathL1 += 'L 0 0 ';
        pathL1 += 'L 0 ' + 0 + ' ';
        pathL1 += 'L ' + ww + ' ' + 0 + ' ';
        pathL1 += 'L 0 ' + 0 + ' ';
        pathL1 += 'C ' + mx + ' ' + 0 + ' ' + ww * 0.72 + ' ' + position.y + ' ' + ww * 1 + ' ' + 0 + ' ';
        pathL1 += 'Z ';

        line1.setAttribute('d', pathL1);
        contentList.style['transform'] = 'translate3d(0, ' + (position.y) + 'px, 0)';
        contentList.setAttribute('data-y', 0);
      }
    });
}

let reverseAnimation = () => {
  let rotation = {z: 270};

  circle.style.transform = 'rotateZ(' + (270) + 'deg)';

  TweenLite.to(rotation, 1, {
      z: -90,
      ease: Sine.easeInOut,
      onUpdate: function() {
        circle.style.transform = 'rotateZ(' + rotation.z + 'deg)';
      },
      onComplete: function() {
        /*  animate loader bar */
        loaderPosition.x = ww/2;
        loaderPosition.dashPos = 10,
        TweenLite.to(loaderPosition, 0.5, {
          x: 0,
          dashPos : circleLength,
          ease: Sine.easeInOut,
          onUpdate: function() {

            circle.setAttribute('stroke-dashoffset', loaderPosition.dashPos);

            let pathL2 = '';
            pathL2 += 'M ' + loaderPosition.x + ' ' + line2Position.y + ' ';
            pathL2 += 'L ' + ww/2 + ' ' + line2Position.y + ' ';

            line2.setAttribute('d', pathL2);
          },
          onComplete: function() {
            loaderPosition.x = ww/2;
            pushUpList();
            TweenLite.to(loaderPosition, 1, {
              x: ww,
              ease: Sine.easeInOut,
              onUpdate: function(){
                let pathL2 = '';
                pathL2 += 'M ' + 0 + ' ' + line2Position.y + ' ';
                pathL2 += 'L ' + loaderPosition.x + ' ' + line2Position.y + ' ';

                line2.setAttribute('d', pathL2);
              }
            });
          }
        });
      }
    });
}

var longOperation = () => {
  setTimeout(()=> {
    isLongOperationFinish = true;
  }, 1000);
};

//svgElt.addEventListener(touchEnd, () =>  {
var dragEndRefresher = () => {
  console.log('TouchEnd');
  isDragging = false;

  TweenLite.to(position, 0.5, {
    y: stretchHeight,
    ease: Elastic.easeOut.config(1, 0.3),
    onUpdate: function() {
      let pathL1 = '';
      pathL1 += 'M ' + ww + ' 0 ';
      pathL1 += 'L 0 0 ';
      pathL1 += 'L 0 ' + stretchHeight + ' ';
      pathL1 += 'L ' + ww + ' ' + stretchHeight + ' ';
      pathL1 += 'L 0 ' + stretchHeight + ' ';
      pathL1 += 'C ' + mx + ' ' + stretchHeight + ' ' + ww * 0.72 + ' ' + position.y + ' ' + ww * 1 + ' ' + stretchHeight + ' ';
      pathL1 += 'Z ';

      line1.setAttribute('d', pathL1);
      contentList.style['transform'] = 'translate3d(0, ' + (position.y) + 'px, 0)';
      contentList.setAttribute('data-y', 0);
    },
    onComplete: function() {
      lineToCircle();
    }
  });
}
//});

let lineToCircle = () => {

  TweenLite.to(loaderPosition, 0.5, {
    x: ww / 2,
    ease: Sine.easeInOut,
    onUpdate: function() {

        let pathL2 = '';
        pathL2 += 'M0, ' + line2Position.y + ' ';
        pathL2 += 'L ' + loaderPosition.x + ' ' + line2Position.y + ' ';
        //pathL1 += 'Z';

        line2.setAttribute('d', pathL2);
      },
    onComplete: function() {

      circle.setAttribute('stroke-dashoffset', -circleLength);
      circle.setAttribute('stroke-dasharray', '' + circleLength + ' ' + circleLength);
      loaderPosition.dashPos = circleLength;
      loaderPosition.x = 0;

      TweenLite.to(loaderPosition, 0.5, {
          dashPos: 10,
          x: ww/2,
          ease: Sine.easeInOut,
          onUpdate: function() {
            circle.setAttribute('stroke-dashoffset', loaderPosition.dashPos);


            let pathL2 = '';
            pathL2 += 'M ' + loaderPosition.x + ' ' + line2Position.y + ' ';
            pathL2 += 'L ' + ww/2 + ' ' + line2Position.y + ' ';

            line2.setAttribute('d', pathL2);

          },
          onComplete: function() {
            rotateCircle();
            longOperation();
          }
        });
    }
  });
};

let rotateCircle = () => {
  let rotation = {z: -90};

  circle.style.transform = 'rotateZ(' + (-90) + 'deg)';

  TweenLite.to(rotation, 1, {
      z: 270,
      ease: Sine.easeInOut,
      onUpdate: function() {
        circle.style.transform = 'rotateZ(' + rotation.z + 'deg)';
      },
      onComplete: function() {
        if(isLongOperationFinish === true){
          isLongOperationFinish = false;
          reverseAnimation();

        } else {
          rotateCircle();
        }
      }
    });

}

//svgElt.addEventListener(touchMove, (e) => {
var dragRefresher = (x, y) => {
  console.log(isDragging);
  if (!isDragging) {
    return true;
  }
  let my = y;
  mx = x;

  yPos = Math.min(my, wh);

  let pathL1 = '';
  pathL1 += 'M ' + ww + ' 0 ';
  pathL1 += 'L 0 0 ';
  pathL1 += 'L 0 ' + (yPos * 0.5) + ' ';
  pathL1 += 'L ' + ww + ' ' + (yPos * 0.5) + ' ';
  pathL1 += 'L 0 ' + (yPos * 0.5) + ' ';
  pathL1 += 'C ' + mx + ' ' + (yPos * 0.5) + ' ' + ww * 0.72 + ' ' + yPos + ' ' + ww * 1 + ' ' + (yPos * 0.5);
  pathL1 += 'Z ';

  line1.setAttribute('d', pathL1);

  //});
}

var moveListContent = (x, y) => {
  let limitedY = Math.max(y, -maxContentListDragY);
  contentList.style['transform'] = 'translate3d(0, ' + limitedY + 'px, 0)';

  if (limitedY > 0) {
    dragRefresher(x, limitedY);
  }
}

let moveLoaderAnim = (x, y) => {
  let pathL2 = '';

  loaderPosition.x = Math.max(ww - y * 1.5, ww * 0.2);
  pathL2 += 'M0  ' + line2Position.y + ' ';
  pathL2 += 'L ' + loaderPosition.x + ' ' + line2Position.y;

  line2.setAttribute('d', pathL2);

  circle.setAttribute('r', circleRayon);
};

containerList.addEventListener(touchStart, (e)=> {
  console.log('Start');
  isDragging = true;
  startDragY = getTouchEvents(e).y;
});

containerList.addEventListener(touchEnd, (e)=> {
  console.log('End');
  isDragging = false;
  contentList.setAttribute('data-y', currentDragY);

  if (currentDragY > 1) {
    dragEndRefresher();
  }
});

containerList.addEventListener(touchMove, (e)=> {
  console.log('Move');
  if (!isDragging) {
    return true;
  }
  currentDragY = getTouchEvents(e).y - startDragY + (parseInt(contentList.getAttribute('data-y'), 10) | 0);

  moveListContent(getTouchEvents(e).x, currentDragY);

  moveLoaderAnim(getTouchEvents(e).x, currentDragY);

});

resize();
