import Scroller from './scroller';
import Events from './events';

class ElasticScroller extends Scroller {
  constructor(params) {
    super(params);
    this.isLongOperationFinish = false;
    this.svgElt = params.svgElt;
    this.operation = params.operation;
    this.line2Position = {
      x: 0,
      y: 5
    },
    this.circleRayon = params.circleRayon || 20;
    this.circleLength = 2 * Math.PI * this.circleRayon

    this.loaderLineParams = {
      x: 0,
      y: 0
    };
    this.stretchHeight = params.stretchHeight || 100;


    // Apend svg path
    this.line1 = document.createElementNS('http://www.w3.org/2000/svg', "path");
    this.line2 = document.createElementNS('http://www.w3.org/2000/svg', "path");
    this.circle = document.createElementNS('http://www.w3.org/2000/svg', "circle");

    this.line1.setAttribute('id', 'line1');
    this.line2.setAttribute('id', 'line2');
    this.line2.classList.add("loader-line")
    this.circle.setAttribute('id', 'circle1');

    this.svgElt.appendChild(this.line1);
    this.svgElt.appendChild(this.line2);
    this.svgElt.appendChild(this.circle);
  }

  resize(e) {
    super.resize();

    // Resize SVG elements
    this.svgElt.style.width = this.ww + 'px';
    this.svgElt.style.height = this.wh + 'px';

    let pathL1 = '';
    pathL1 += 'M 0 0 ';
    pathL1 += 'L 0 ' + this.ww;
    //pathL1 += "C " + ww*0.7 + " 10 "+ ww*0.72+ " 150 " + ww + " 0";
    pathL1 += ' Z';
    this.line1.setAttribute('d', pathL1);

    let pathL2 = '';
    pathL2 += 'M0, ' + this.line2Position.y + ' ';
    pathL2 += 'L ' + this.ww + ' ' + this.line2Position.y + ' ';
    pathL2 += 'Z';
    this.line2.setAttribute('d', pathL2);

    this.circle.setAttribute('cx', this.ww / 2);
    this.circle.setAttribute('cy', this.line2Position.y + this.circleRayon);
    this.circle.setAttribute('r', this.circleRayon);
    this.circle.setAttribute('stroke-dashoffset', -this.circleLength);
    this.circle.setAttribute('stroke-dasharray', '' + this.circleLength + ' ' + this.circleLength);

  }

  onTouchMove(e) {
    if (!this.isDragging) {
      return true;
    }
    super.onTouchMove(e);

    // Move line2
    this.dragStart0 && this.moveLoaderAnim(Events.getTouchEvents(e).x, this.currentDragY);
  }

  /**
   * Move list content with drag and if enter in refresh zone,
   * update line1 shape
   */
  moveListContent(x, y) {
    let limitedY = super.moveListContent(x, y);

    if (limitedY > 0 && !this.isScrollInterface) {
      this.dragRefresher(x, limitedY);
    } else if (this.isScrollInterface && this.dragStart0) {
      this.dragRefresher(x, limitedY);
    }



    return limitedY;
  }

  /**
   * Update line 1 shape 
   */
  dragRefresher(x, y) {
    if (!this.isDragging) {
      return true;
    }

    let yPos = Math.min(y, this.wh);

    let pathL1 = '';
    pathL1 += 'M ' + this.ww + ' 0 ';
    pathL1 += 'L 0 0 ';
    pathL1 += 'L 0 ' + (yPos * 0.5) + ' ';
    pathL1 += 'L ' + this.ww + ' ' + (yPos * 0.5) + ' ';
    pathL1 += 'L 0 ' + (yPos * 0.5) + ' ';
    pathL1 += 'C ' + x + ' ' + (yPos * 0.5) + ' ' + this.ww * 0.72 + ' ' + yPos + ' ' + this.ww * 1 + ' ' + (yPos * 0.5);
    pathL1 += 'Z ';

    this.line1.setAttribute('d', pathL1);

  }

  moveLoaderAnim(x, y) {

    this.line2Position.x = Math.max(this.ww - y * 1.5, this.ww * 0.2);

    let pathL2 = '';
    pathL2 += 'M0  ' + this.line2Position.y + ' ';
    pathL2 += 'L ' + this.line2Position.x + ' ' + this.line2Position.y;

    this.line2.setAttribute('d', pathL2);

    this.circle.setAttribute('r', this.circleRayon);
  }

  /**
   * After drag end animate line1 shape
   */
  afterDragEnd(velocityEvent) {
    this.isDragging = false;
    this.isDisabled = true;

    let position = {
      y: Math.min(velocityEvent.dragEnd.y, this.wh)
    };

    if (this.isScrollInterface && !this.dragStart0) {
      this.isDisabled = false;
      return true;
    }

    // Do not trigger refresh
    if (velocityEvent.distance < this.refreshDistanceTrigger) {
      TweenLite.to(position, 0.5, {
        y: 0,
        ease: Elastic.easeOut.config(1, 0.3),

        onUpdate: () => {
          let pathL1 = '';
          pathL1 += 'M ' + this.ww + ' 0 ';
          pathL1 += 'L 0 0 ';
          pathL1 += 'L 0 ' + 0 + ' ';
          pathL1 += 'L ' + this.ww + ' ' + 0 + ' ';
          pathL1 += 'L 0 ' + 0 + ' ';
          pathL1 += 'C ' + 0 + ' ' + 0 + ' ' + this.ww * 0.72 + ' ' + position.y + ' ' + this.ww * 1 + ' ' + 0 + ' ';
          pathL1 += 'Z ';

          this.line1.setAttribute('d', pathL1);
          this.contentElt.style['transform'] = 'translate3d(0, ' + (position.y) + 'px, 0)';
          this.contentElt.setAttribute('data-y', 0);

          let pathL2 = '';
          pathL2 += 'M0  ' + this.line2Position.y + ' ';
          pathL2 += 'L ' + (this.ww - position.y) + ' ' + this.line2Position.y;
          this.line2.setAttribute('d', pathL2);
        },
        onComplete: () => {
          this.isDisabled = false;
          this.containerElt.classList.remove('fixed');
        }
      });
    } else {
      // Do refresh

      // Display circle
      this.lineToCircle();

      TweenLite.to(position, 0.5, {
        y: this.stretchHeight,
        ease: Elastic.easeOut.config(1, 0.3),

        onUpdate: () => {
          let pathL1 = '';
          pathL1 += 'M ' + this.ww + ' 0 ';
          pathL1 += 'L 0 0 ';
          pathL1 += 'L 0 ' + this.stretchHeight + ' ';
          pathL1 += 'L ' + this.ww + ' ' + this.stretchHeight + ' ';
          pathL1 += 'L 0 ' + this.stretchHeight + ' ';
          pathL1 += 'C ' + 0 + ' ' + this.stretchHeight + ' ' + this.ww * 0.72 + ' ' + position.y + ' ' + this.ww * 1 + ' ' + this.stretchHeight + ' ';
          pathL1 += 'Z ';

          this.line1.setAttribute('d', pathL1);
          this.contentElt.style['transform'] = 'translate3d(0, ' + (position.y) + 'px, 0)';
          this.contentElt.setAttribute('data-y', 0);
        },
        onComplete: () => {

        }
      });
    }
  }

  lineToCircle() {
    TweenLite.to(this.line2Position, 0.5, {
      x: this.ww / 2,
      ease: Sine.easeInOut,
      onUpdate: () => {

        let pathL2 = '';
        pathL2 += 'M0, ' + this.line2Position.y + ' ';
        pathL2 += 'L ' + this.line2Position.x + ' ' + this.line2Position.y + ' ';
        //pathL1 += 'Z';

        this.line2.setAttribute('d', pathL2);
      },
      onComplete: () => {
        this.circle.setAttribute('stroke-dashoffset', -this.circleLength);
        this.circle.setAttribute('stroke-dasharray', '' + this.circleLength + ' ' + this.circleLength);
        this.line2Position.dashPos = this.circleLength;
        this.line2Position.x = 0;

        TweenLite.to(this.line2Position, 0.5, {
          dashPos: 10,
          x: this.ww / 2,
          ease: Sine.easeInOut,
          onUpdate: () => {
            this.circle.setAttribute('stroke-dashoffset', this.line2Position.dashPos);


            let pathL2 = '';
            pathL2 += 'M ' + this.line2Position.x + ' ' + this.line2Position.y + ' ';
            pathL2 += 'L ' + this.ww / 2 + ' ' + this.line2Position.y + ' ';

            this.line2.setAttribute('d', pathL2);

          },
          onComplete: () => {
            this.rotateCircle();
            this.operation();
          }
        });
      }
    });
  }

  rotateCircle() {
    let rotation = {
      z: -90
    };

    this.circle.style.transform = 'rotateZ(' + (-90) + 'deg)';

    TweenLite.to(rotation, 1, {
      z: 270,
      ease: Sine.easeInOut,
      onUpdate: () => {
        this.circle.style.transform = 'rotateZ(' + rotation.z + 'deg)';
      },
      onComplete: () => {
        if (this.isLongOperationFinish === true) {
          this.isLongOperationFinish = false;
          this.reverseAnimation();

        } else {
          this.rotateCircle();
        }
      }
    });
  }

  reverseAnimation() {
    let rotation = {
      z: 270
    };
    let loaderPosition = {
      x: 0,
      y: 0,
      dashPos: 0
    };

    this.circle.style.transform = 'rotateZ(' + (270) + 'deg)';

    TweenLite.to(rotation, 1, {
      z: -90,
      ease: Sine.easeInOut,
      onUpdate: () => {
        this.circle.style.transform = 'rotateZ(' + rotation.z + 'deg)';
      },
      onComplete: () => {
        /*  animate loader bar */
        loaderPosition.x = this.ww / 2;
        loaderPosition.dashPos = 10,
        TweenLite.to(loaderPosition, 0.5, {
          x: 0,
          dashPos: this.circleLength,
          ease: Sine.easeInOut,
          onUpdate: () => {

            this.circle.setAttribute('stroke-dashoffset', loaderPosition.dashPos);

            let pathL2 = '';
            pathL2 += 'M ' + loaderPosition.x + ' ' + this.line2Position.y + ' ';
            pathL2 += 'L ' + this.ww / 2 + ' ' + this.line2Position.y + ' ';

            this.line2.setAttribute('d', pathL2);
          },
          onComplete: () => {
            loaderPosition.x = this.ww / 2;
            this.pushUpList();
            TweenLite.to(loaderPosition, 1, {
              x: this.ww,
              ease: Sine.easeInOut,
              onUpdate: () => {
                let pathL2 = '';
                pathL2 += 'M ' + 0 + ' ' + this.line2Position.y + ' ';
                pathL2 += 'L ' + loaderPosition.x + ' ' + this.line2Position.y + ' ';

                this.line2.setAttribute('d', pathL2);
              },
              onComplete: () => {
                this.isDisabled = false;
                this.containerElt.classList.remove('fixed');
              }
            });
          }
        });
      }
    });
  }

  pushUpList() {
    let position = {
      y: Math.min(this.velocityEvent.dragEnd.y, this.wh)
    };
    TweenLite.to(position, 1, {
      y: 0,
      ease: Elastic.easeOut.config(1, 0.3),
      onUpdate: () => {
        let pathL1 = '';
        pathL1 += 'M ' + this.ww + ' 0 ';
        pathL1 += 'L 0 0 ';
        pathL1 += 'L 0 ' + 0 + ' ';
        pathL1 += 'L ' + this.ww + ' ' + 0 + ' ';
        pathL1 += 'L 0 ' + 0 + ' ';
        pathL1 += 'C ' + this.velocityEvent.dragEnd.x + ' ' + 0 + ' ' + this.ww * 0.72 + ' ' + position.y + ' ' + this.ww * 1 + ' ' + 0 + ' ';
        pathL1 += 'Z ';

        this.line1.setAttribute('d', pathL1);
        this.contentElt.style['transform'] = 'translate3d(0, ' + (position.y) + 'px, 0)';
        this.contentElt.setAttribute('data-y', 0);
      },
      onComplete: () => {
        this.isDisabled = false;
      }
    });
  }

  finishLongOperation() {
    this.isLongOperationFinish = true;
  }

}

module.exports = ElasticScroller;