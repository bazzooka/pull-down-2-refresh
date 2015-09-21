import Events from './Events';

class VelocityEvent {

  constructor() {

    this.dragStart = {
      x: 0,
      y: 0,
      time: 0
    };

    this.dragEnd = {
      x: 0,
      y: 0,
      time: 0
    };

    this.distance = 0;

    this.velocity = 0;
  }

  listenTo(elt, ev, callback) {
    elt.addEventListener(ev, (e) => {
      if (ev === Events.touchStart) {
        this.startDrag(e);
      } else if (ev === Events.touchEnd) {
        this.endDrag(e);
      }
      callback(e, this.getDragInfos());
    });
  }


  startDrag(e) {
    let ev = Events.getTouchEvents(e);

    this.dragStart.x = ev.x;
    this.dragStart.y = ev.y;
    this.dragStart.time = Date.now();

  }

  endDrag(e) {
    let ev = Events.getTouchEvents(e);

    this.dragEnd.x = ev.x;
    this.dragEnd.y = ev.y;
    this.dragEnd.time = Date.now();
  }

  calcDistance() {
    this.distance = Math.sqrt((Math.pow((this.dragEnd.x - this.dragStart.x), 2)) + (Math.pow((this.dragEnd.y - this.dragStart.y), 2)));
  }

  calcVelocity() {
    this.velocity = this.distance / (this.dragEnd.time - this.dragStart.time);
  }

  getDragInfos() {
    this.calcDistance();
    this.calcVelocity();
    return {
      dragStart: this.dragStart,
      dragEnd: this.dragEnd,
      distance: this.distance,
      velocity: this.velocity,
      toTop: this.dragStart.y > this.dragEnd.y,
      toLeft: this.dragStart.x > this.dragEnd.x
    }
  }
}
;

module.exports = VelocityEvent;

