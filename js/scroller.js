import Events from './events.js';
import VelocityEvent from './velocityEvent.js';

class Scroller {
  constructor(params) {
    this.contentElt = params.contentElt; // content element
    this.containerElt = params.containerElt; // container element
    this.refreshDistanceTrigger = this.ww / 2; // Distance for triggering refresh
    this.maxContentListDragY = 0; // maximum y displacement of list

    this.isDragging = false; // Need comment ?
    this.currentDragY = 0; // Current y position of the list
    this.stretchHeight = 100; // Maximum stretch height
    this.velocityEvent = new VelocityEvent();
    this.isDisabled = false;
    this.dragStart0 = false;
    this.isScrollInterface = Events.isTouch;
  }

  init() {

    if(!Events.isTouch){
      this.containerElt.classList.add("scroll-hidden");
    }

    // listen to resize event
    document.addEventListener('resize', () => {
      resize();
    });

    // Listen touch start
    this.velocityEvent.listenTo(this.containerElt, Events.touchStart, (e) => {
      this.onTouchStart(e);
    });

    // Listen touch end
    this.velocityEvent.listenTo(this.containerElt, Events.touchEnd, (e) => {
      this.onTouchEnd(e);
    });

    if (this.isScrollInterface) { // Touch interface
      // Listen scroll
      this.containerElt.addEventListener("scroll", function(e) {
      });

      this.containerElt.addEventListener(Events.touchMove, (e) => {
        this.onTouchMove(e);
      });

    } else { // Mouse interface
      // Listen touch move
      this.containerElt.addEventListener(Events.touchMove, (e) => {
        this.onTouchMove(e);
      });
    }

    this.resize();

    return this;

  }

  resize(e) {
    // Get screen size
    this.ww = window.innerWidth || document.documentElement.clientWidth;
    this.wh = window.innerHeight || document.documentElement.clientHeight;
    this.refreshDistanceTrigger = this.wh / 4; // Distance for triggering refresh

    let containerHeight = this.containerElt.offsetHeight;

    // Maximum scroll
    this.maxContentListDragY = this.contentElt.offsetHeight - containerHeight;

  }

  onTouchStart(e) {
    !this.isScrollInterface && e.preventDefault();
    if (!this.isDisabled) {
      this.isDragging = true;
      this.dragStart0 = this.containerElt.scrollTop === 0;
    }
  }

  onTouchMove(e) {
    !this.isScrollInterface && e.preventDefault();
    if (!this.isDragging) {
      return true;
    }
    
    if (this.isScrollInterface) {
      this.dragStart0 = this.dragStart0 && this.containerElt.scrollTop === 0;
      this.currentDragY = this.dragStart0 ? Events.getTouchEvents(e).y - this.velocityEvent.dragStart.y + (parseInt(this.contentElt.getAttribute('data-y'), 10) | 0) : this.containerElt.scrollTop;

      // Fix the position
      if(this.dragStart0 && this.currentDragY > 0){
        this.containerElt.classList.add('fixed');
      } else {
        this.containerElt.classList.remove('fixed');
      }
    } else {
      this.currentDragY = Events.getTouchEvents(e).y - this.velocityEvent.dragStart.y + (parseInt(this.contentElt.getAttribute('data-y'), 10) | 0);
    }
    this.moveListContent(Events.getTouchEvents(e).x, this.currentDragY);
  }

  onTouchEnd(e) {
    !this.isScrollInterface && e.preventDefault();
    let dragInfos = this.velocityEvent.getDragInfos(),
      me = this;

    if (!this.isDragging) {
      return true;
    }
    me.isDragging = false;
    me.contentElt.setAttribute('data-y', me.currentDragY);


    if (me.currentDragY > 1) { // if list position was entered in refresh zone
      me.isDisabled = true;
      me.afterDragEnd && me.afterDragEnd(dragInfos);
      me.dragStart0 = false;
    } else if (!this.isScrollInterface && dragInfos.velocity > 0.3) { // if we make a speed drag, animate list
      let position = {
          y: me.currentDragY
        },
        newPosition = 0;
      if (dragInfos.toTop) {
        newPosition = Math.max(-(me.maxContentListDragY), me.currentDragY - (dragInfos.velocity * dragInfos.distance));
      } else {
        newPosition = Math.min(-(0), me.currentDragY + (dragInfos.velocity * dragInfos.distance));
      }

      TweenLite.to(position, dragInfos.velocity / 2, {
        y: newPosition,
        ease: Power4.easeOut,
        onUpdate: () => {
          me.contentElt.style['transform'] = 'translate3d(0, ' + (position.y) + 'px, 0)';

        },
        onComplete: () => {
          me.contentElt.setAttribute('data-y', newPosition);
          this.containerElt.classList.remove('fixed');
        }
      });
    } else if(this.isScrollInterface){
      this.containerElt.classList.remove('fixed');
    }
  }

  moveListContent(x, y) {
    let limitedY = Math.max(y, -this.maxContentListDragY);
    this.currentDragY = limitedY;

    if (!this.isScrollInterface) {
      this.contentElt.style['transform'] = 'translate3d(0, ' + limitedY + 'px, 0)';
    } else if(limitedY > 0 && this.isScrollInterface && this.dragStart0){
      this.contentElt.style['transform'] = 'translate3d(0, ' + limitedY + 'px, 0)';
      this.contentElt.setAttribute('data-y', 0);
    }

    return limitedY;
  }

  afterDragEnd(velocityEvent) {
    let position = {
      x: 0,
      y: this.currentDragY
    };
    this.isDragging = false;


    TweenLite.to(position, 0.5, {
      y: 0,
      ease: Elastic.easeOut.config(1, 0.3),
      onUpdate: () => {
        this.contentElt.style['transform'] = 'translate3d(0, ' + (position.y) + 'px, 0)';
        this.contentElt.setAttribute('data-y', 0);
      },
      onComplete: () => {

      }
    });
  }
}

module.exports = Scroller;
