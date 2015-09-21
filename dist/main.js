(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Events = {
  isTouch: 'ontouchstart' in window,
  touchStart: 'ontouchstart' in window ? 'touchstart' : 'mousedown',
  touchMove: 'ontouchstart' in window ? 'touchmove' : 'mousemove',
  touchEnd: 'ontouchstart' in window ? 'touchend' : 'mouseup',

  /**
   * Gather touch / click position from events
   **/
  getTouchEvents: function getTouchEvents(e) {
    return {
      x: e.clientX || e.touches && e.touches[0] && e.touches[0].clientX || e.targetTouches && e.targetTouches[0] && e.targetTouches[0].clientX || e.changedTouches && e.changedTouches[0] && e.changedTouches[0].clientX,
      y: e.clientY || e.touches && e.touches[0] && e.touches[0].clientY || e.targetTouches && e.targetTouches[0] && e.targetTouches[0].clientY || e.changedTouches && e.changedTouches[0] && e.changedTouches[0].clientY
    };
  }
};
module.exports = Events;

},{}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _scroller = require('./scroller');

var _scroller2 = _interopRequireDefault(_scroller);

var _events = require('./events');

var _events2 = _interopRequireDefault(_events);

var ElasticScroller = (function (_Scroller) {
  _inherits(ElasticScroller, _Scroller);

  function ElasticScroller(params) {
    _classCallCheck(this, ElasticScroller);

    _get(Object.getPrototypeOf(ElasticScroller.prototype), 'constructor', this).call(this, params);
    this.isLongOperationFinish = false;
    this.svgElt = params.svgElt;
    this.operation = params.operation;
    this.line2Position = {
      x: 0,
      y: 5
    }, this.circleRayon = params.circleRayon || 20;
    this.circleLength = 2 * Math.PI * this.circleRayon;

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
    this.line2.classList.add("loader-line");
    this.circle.setAttribute('id', 'circle1');

    this.svgElt.appendChild(this.line1);
    this.svgElt.appendChild(this.line2);
    this.svgElt.appendChild(this.circle);
  }

  _createClass(ElasticScroller, [{
    key: 'resize',
    value: function resize(e) {
      _get(Object.getPrototypeOf(ElasticScroller.prototype), 'resize', this).call(this);

      // Resize SVG elements
      this.svgElt.style.width = this.ww + 'px';
      this.svgElt.style.height = this.wh + 'px';

      var pathL1 = '';
      pathL1 += 'M 0 0 ';
      pathL1 += 'L 0 ' + this.ww;
      //pathL1 += "C " + ww*0.7 + " 10 "+ ww*0.72+ " 150 " + ww + " 0";
      pathL1 += ' Z';
      this.line1.setAttribute('d', pathL1);

      var pathL2 = '';
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
  }, {
    key: 'onTouchMove',
    value: function onTouchMove(e) {
      if (!this.isDragging) {
        return true;
      }
      _get(Object.getPrototypeOf(ElasticScroller.prototype), 'onTouchMove', this).call(this, e);

      // Move line2
      this.dragStart0 && this.moveLoaderAnim(_events2['default'].getTouchEvents(e).x, this.currentDragY);
    }

    /**
     * Move list content with drag and if enter in refresh zone,
     * update line1 shape
     */
  }, {
    key: 'moveListContent',
    value: function moveListContent(x, y) {
      var limitedY = _get(Object.getPrototypeOf(ElasticScroller.prototype), 'moveListContent', this).call(this, x, y);

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
  }, {
    key: 'dragRefresher',
    value: function dragRefresher(x, y) {
      if (!this.isDragging) {
        return true;
      }

      var yPos = Math.min(y, this.wh);

      var pathL1 = '';
      pathL1 += 'M ' + this.ww + ' 0 ';
      pathL1 += 'L 0 0 ';
      pathL1 += 'L 0 ' + yPos * 0.5 + ' ';
      pathL1 += 'L ' + this.ww + ' ' + yPos * 0.5 + ' ';
      pathL1 += 'L 0 ' + yPos * 0.5 + ' ';
      pathL1 += 'C ' + x + ' ' + yPos * 0.5 + ' ' + this.ww * 0.72 + ' ' + yPos + ' ' + this.ww * 1 + ' ' + yPos * 0.5;
      pathL1 += 'Z ';

      this.line1.setAttribute('d', pathL1);
    }
  }, {
    key: 'moveLoaderAnim',
    value: function moveLoaderAnim(x, y) {

      this.line2Position.x = Math.max(this.ww - y * 1.5, this.ww * 0.2);

      var pathL2 = '';
      pathL2 += 'M0  ' + this.line2Position.y + ' ';
      pathL2 += 'L ' + this.line2Position.x + ' ' + this.line2Position.y;

      this.line2.setAttribute('d', pathL2);

      this.circle.setAttribute('r', this.circleRayon);
    }

    /**
     * After drag end animate line1 shape
     */
  }, {
    key: 'afterDragEnd',
    value: function afterDragEnd(velocityEvent) {
      var _this = this;

      this.isDragging = false;
      this.isDisabled = true;

      var position = {
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

          onUpdate: function onUpdate() {
            var pathL1 = '';
            pathL1 += 'M ' + _this.ww + ' 0 ';
            pathL1 += 'L 0 0 ';
            pathL1 += 'L 0 ' + 0 + ' ';
            pathL1 += 'L ' + _this.ww + ' ' + 0 + ' ';
            pathL1 += 'L 0 ' + 0 + ' ';
            pathL1 += 'C ' + 0 + ' ' + 0 + ' ' + _this.ww * 0.72 + ' ' + position.y + ' ' + _this.ww * 1 + ' ' + 0 + ' ';
            pathL1 += 'Z ';

            _this.line1.setAttribute('d', pathL1);
            _this.contentElt.style['transform'] = 'translate3d(0, ' + position.y + 'px, 0)';
            _this.contentElt.setAttribute('data-y', 0);

            var pathL2 = '';
            pathL2 += 'M0  ' + _this.line2Position.y + ' ';
            pathL2 += 'L ' + (_this.ww - position.y) + ' ' + _this.line2Position.y;
            _this.line2.setAttribute('d', pathL2);
          },
          onComplete: function onComplete() {
            _this.isDisabled = false;
            _this.containerElt.classList.remove('fixed');
          }
        });
      } else {
        // Do refresh

        // Display circle
        this.lineToCircle();

        TweenLite.to(position, 0.5, {
          y: this.stretchHeight,
          ease: Elastic.easeOut.config(1, 0.3),

          onUpdate: function onUpdate() {
            var pathL1 = '';
            pathL1 += 'M ' + _this.ww + ' 0 ';
            pathL1 += 'L 0 0 ';
            pathL1 += 'L 0 ' + _this.stretchHeight + ' ';
            pathL1 += 'L ' + _this.ww + ' ' + _this.stretchHeight + ' ';
            pathL1 += 'L 0 ' + _this.stretchHeight + ' ';
            pathL1 += 'C ' + 0 + ' ' + _this.stretchHeight + ' ' + _this.ww * 0.72 + ' ' + position.y + ' ' + _this.ww * 1 + ' ' + _this.stretchHeight + ' ';
            pathL1 += 'Z ';

            _this.line1.setAttribute('d', pathL1);
            _this.contentElt.style['transform'] = 'translate3d(0, ' + position.y + 'px, 0)';
            _this.contentElt.setAttribute('data-y', 0);
          },
          onComplete: function onComplete() {}
        });
      }
    }
  }, {
    key: 'lineToCircle',
    value: function lineToCircle() {
      var _this2 = this;

      TweenLite.to(this.line2Position, 0.5, {
        x: this.ww / 2,
        ease: Sine.easeInOut,
        onUpdate: function onUpdate() {

          var pathL2 = '';
          pathL2 += 'M0, ' + _this2.line2Position.y + ' ';
          pathL2 += 'L ' + _this2.line2Position.x + ' ' + _this2.line2Position.y + ' ';
          //pathL1 += 'Z';

          _this2.line2.setAttribute('d', pathL2);
        },
        onComplete: function onComplete() {
          _this2.circle.setAttribute('stroke-dashoffset', -_this2.circleLength);
          _this2.circle.setAttribute('stroke-dasharray', '' + _this2.circleLength + ' ' + _this2.circleLength);
          _this2.line2Position.dashPos = _this2.circleLength;
          _this2.line2Position.x = 0;

          TweenLite.to(_this2.line2Position, 0.5, {
            dashPos: 10,
            x: _this2.ww / 2,
            ease: Sine.easeInOut,
            onUpdate: function onUpdate() {
              _this2.circle.setAttribute('stroke-dashoffset', _this2.line2Position.dashPos);

              var pathL2 = '';
              pathL2 += 'M ' + _this2.line2Position.x + ' ' + _this2.line2Position.y + ' ';
              pathL2 += 'L ' + _this2.ww / 2 + ' ' + _this2.line2Position.y + ' ';

              _this2.line2.setAttribute('d', pathL2);
            },
            onComplete: function onComplete() {
              _this2.rotateCircle();
              _this2.operation();
            }
          });
        }
      });
    }
  }, {
    key: 'rotateCircle',
    value: function rotateCircle() {
      var _this3 = this;

      var rotation = {
        z: -90
      };

      this.circle.style.transform = 'rotateZ(' + -90 + 'deg)';

      TweenLite.to(rotation, 1, {
        z: 270,
        ease: Sine.easeInOut,
        onUpdate: function onUpdate() {
          _this3.circle.style.transform = 'rotateZ(' + rotation.z + 'deg)';
        },
        onComplete: function onComplete() {
          if (_this3.isLongOperationFinish === true) {
            _this3.isLongOperationFinish = false;
            _this3.reverseAnimation();
          } else {
            _this3.rotateCircle();
          }
        }
      });
    }
  }, {
    key: 'reverseAnimation',
    value: function reverseAnimation() {
      var _this4 = this;

      var rotation = {
        z: 270
      };
      var loaderPosition = {
        x: 0,
        y: 0,
        dashPos: 0
      };

      this.circle.style.transform = 'rotateZ(' + 270 + 'deg)';

      TweenLite.to(rotation, 1, {
        z: -90,
        ease: Sine.easeInOut,
        onUpdate: function onUpdate() {
          _this4.circle.style.transform = 'rotateZ(' + rotation.z + 'deg)';
        },
        onComplete: function onComplete() {
          /*  animate loader bar */
          loaderPosition.x = _this4.ww / 2;
          loaderPosition.dashPos = 10, TweenLite.to(loaderPosition, 0.5, {
            x: 0,
            dashPos: _this4.circleLength,
            ease: Sine.easeInOut,
            onUpdate: function onUpdate() {

              _this4.circle.setAttribute('stroke-dashoffset', loaderPosition.dashPos);

              var pathL2 = '';
              pathL2 += 'M ' + loaderPosition.x + ' ' + _this4.line2Position.y + ' ';
              pathL2 += 'L ' + _this4.ww / 2 + ' ' + _this4.line2Position.y + ' ';

              _this4.line2.setAttribute('d', pathL2);
            },
            onComplete: function onComplete() {
              loaderPosition.x = _this4.ww / 2;
              _this4.pushUpList();
              TweenLite.to(loaderPosition, 1, {
                x: _this4.ww,
                ease: Sine.easeInOut,
                onUpdate: function onUpdate() {
                  var pathL2 = '';
                  pathL2 += 'M ' + 0 + ' ' + _this4.line2Position.y + ' ';
                  pathL2 += 'L ' + loaderPosition.x + ' ' + _this4.line2Position.y + ' ';

                  _this4.line2.setAttribute('d', pathL2);
                },
                onComplete: function onComplete() {
                  _this4.isDisabled = false;
                  _this4.containerElt.classList.remove('fixed');
                }
              });
            }
          });
        }
      });
    }
  }, {
    key: 'pushUpList',
    value: function pushUpList() {
      var _this5 = this;

      var position = {
        y: Math.min(this.velocityEvent.dragEnd.y, this.wh)
      };
      TweenLite.to(position, 1, {
        y: 0,
        ease: Elastic.easeOut.config(1, 0.3),
        onUpdate: function onUpdate() {
          var pathL1 = '';
          pathL1 += 'M ' + _this5.ww + ' 0 ';
          pathL1 += 'L 0 0 ';
          pathL1 += 'L 0 ' + 0 + ' ';
          pathL1 += 'L ' + _this5.ww + ' ' + 0 + ' ';
          pathL1 += 'L 0 ' + 0 + ' ';
          pathL1 += 'C ' + _this5.velocityEvent.dragEnd.x + ' ' + 0 + ' ' + _this5.ww * 0.72 + ' ' + position.y + ' ' + _this5.ww * 1 + ' ' + 0 + ' ';
          pathL1 += 'Z ';

          _this5.line1.setAttribute('d', pathL1);
          _this5.contentElt.style['transform'] = 'translate3d(0, ' + position.y + 'px, 0)';
          _this5.contentElt.setAttribute('data-y', 0);
        },
        onComplete: function onComplete() {
          _this5.isDisabled = false;
        }
      });
    }
  }, {
    key: 'finishLongOperation',
    value: function finishLongOperation() {
      this.isLongOperationFinish = true;
    }
  }]);

  return ElasticScroller;
})(_scroller2['default']);

module.exports = ElasticScroller;

},{"./events":3,"./scroller":5}],3:[function(require,module,exports){
'use strict';

var Events = {
  isTouch: 'ontouchstart' in window,
  touchStart: 'ontouchstart' in window ? 'touchstart' : 'mousedown',
  touchMove: 'ontouchstart' in window ? 'touchmove' : 'mousemove',
  touchEnd: 'ontouchstart' in window ? 'touchend' : 'mouseup',

  /**
   * Gather touch / click position from events
   **/
  getTouchEvents: function getTouchEvents(e) {
    return {
      x: e.clientX || e.touches && e.touches[0] && e.touches[0].clientX || e.targetTouches && e.targetTouches[0] && e.targetTouches[0].clientX || e.changedTouches && e.changedTouches[0] && e.changedTouches[0].clientX,
      y: e.clientY || e.touches && e.touches[0] && e.touches[0].clientY || e.targetTouches && e.targetTouches[0] && e.targetTouches[0].clientY || e.changedTouches && e.changedTouches[0] && e.changedTouches[0].clientY
    };
  }
};
module.exports = Events;

},{}],4:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _elasticScrollerJs = require('./elastic-scroller.js');

var _elasticScrollerJs2 = _interopRequireDefault(_elasticScrollerJs);

var eScroller = null;

var longOperation = function longOperation() {
  setTimeout(function () {
    eScroller.finishLongOperation();
  }, 1000);
};

var initScroller = function initScroller() {
  eScroller = new _elasticScrollerJs2['default']({
    containerElt: document.getElementById('container-list'),
    contentElt: document.getElementById('content-list'),
    svgElt: document.getElementById('svgElt'),
    stretchHeight: 100,
    operation: longOperation
  }).init();
};

initScroller();

},{"./elastic-scroller.js":2}],5:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _eventsJs = require('./events.js');

var _eventsJs2 = _interopRequireDefault(_eventsJs);

var _velocityEventJs = require('./velocityEvent.js');

var _velocityEventJs2 = _interopRequireDefault(_velocityEventJs);

var Scroller = (function () {
  function Scroller(params) {
    _classCallCheck(this, Scroller);

    this.contentElt = params.contentElt; // content element
    this.containerElt = params.containerElt; // container element
    this.refreshDistanceTrigger = this.ww / 2; // Distance for triggering refresh
    this.maxContentListDragY = 0; // maximum y displacement of list

    this.isDragging = false; // Need comment ?
    this.currentDragY = 0; // Current y position of the list
    this.stretchHeight = 100; // Maximum stretch height
    this.velocityEvent = new _velocityEventJs2['default']();
    this.isDisabled = false;
    this.dragStart0 = false;
    this.isScrollInterface = _eventsJs2['default'].isTouch;
  }

  _createClass(Scroller, [{
    key: 'init',
    value: function init() {
      var _this = this;

      if (!_eventsJs2['default'].isTouch) {
        this.containerElt.classList.add("scroll-hidden");
      }

      // listen to resize event
      document.addEventListener('resize', function () {
        resize();
      });

      // Listen touch start
      this.velocityEvent.listenTo(this.containerElt, _eventsJs2['default'].touchStart, function (e) {
        _this.onTouchStart(e);
      });

      // Listen touch end
      this.velocityEvent.listenTo(this.containerElt, _eventsJs2['default'].touchEnd, function (e) {
        _this.onTouchEnd(e);
      });

      if (this.isScrollInterface) {
        // Touch interface
        // Listen scroll
        this.containerElt.addEventListener("scroll", function (e) {});

        this.containerElt.addEventListener(_eventsJs2['default'].touchMove, function (e) {
          _this.onTouchMove(e);
        });
      } else {
        // Mouse interface
        // Listen touch move
        this.containerElt.addEventListener(_eventsJs2['default'].touchMove, function (e) {
          _this.onTouchMove(e);
        });
      }

      this.resize();

      return this;
    }
  }, {
    key: 'resize',
    value: function resize(e) {
      // Get screen size
      this.ww = window.innerWidth || document.documentElement.clientWidth;
      this.wh = window.innerHeight || document.documentElement.clientHeight;
      this.refreshDistanceTrigger = this.wh / 4; // Distance for triggering refresh

      var containerHeight = this.containerElt.offsetHeight;

      // Maximum scroll
      this.maxContentListDragY = this.contentElt.offsetHeight - containerHeight;
    }
  }, {
    key: 'onTouchStart',
    value: function onTouchStart(e) {
      !this.isScrollInterface && e.preventDefault();
      if (!this.isDisabled) {
        this.isDragging = true;
        this.dragStart0 = this.containerElt.scrollTop === 0;
      }
    }
  }, {
    key: 'onTouchMove',
    value: function onTouchMove(e) {
      !this.isScrollInterface && e.preventDefault();
      if (!this.isDragging) {
        return true;
      }

      if (this.isScrollInterface) {
        this.dragStart0 = this.dragStart0 && this.containerElt.scrollTop === 0;
        this.currentDragY = this.dragStart0 ? _eventsJs2['default'].getTouchEvents(e).y - this.velocityEvent.dragStart.y + (parseInt(this.contentElt.getAttribute('data-y'), 10) | 0) : this.containerElt.scrollTop;

        // Fix the position
        if (this.dragStart0 && this.currentDragY > 0) {
          this.containerElt.classList.add('fixed');
        } else {
          this.containerElt.classList.remove('fixed');
        }
      } else {
        this.currentDragY = _eventsJs2['default'].getTouchEvents(e).y - this.velocityEvent.dragStart.y + (parseInt(this.contentElt.getAttribute('data-y'), 10) | 0);
      }
      this.moveListContent(_eventsJs2['default'].getTouchEvents(e).x, this.currentDragY);
    }
  }, {
    key: 'onTouchEnd',
    value: function onTouchEnd(e) {
      var _this2 = this;

      !this.isScrollInterface && e.preventDefault();
      var dragInfos = this.velocityEvent.getDragInfos(),
          me = this;

      if (!this.isDragging) {
        return true;
      }
      me.isDragging = false;
      me.contentElt.setAttribute('data-y', me.currentDragY);

      if (me.currentDragY > 1) {
        // if list position was entered in refresh zone
        me.isDisabled = true;
        me.afterDragEnd && me.afterDragEnd(dragInfos);
        me.dragStart0 = false;
      } else if (!this.isScrollInterface && dragInfos.velocity > 0.3) {
        (function () {
          // if we make a speed drag, animate list
          var position = {
            y: me.currentDragY
          },
              newPosition = 0;
          if (dragInfos.toTop) {
            newPosition = Math.max(-me.maxContentListDragY, me.currentDragY - dragInfos.velocity * dragInfos.distance);
          } else {
            newPosition = Math.min(-0, me.currentDragY + dragInfos.velocity * dragInfos.distance);
          }

          TweenLite.to(position, dragInfos.velocity / 2, {
            y: newPosition,
            ease: Power4.easeOut,
            onUpdate: function onUpdate() {
              me.contentElt.style['transform'] = 'translate3d(0, ' + position.y + 'px, 0)';
            },
            onComplete: function onComplete() {
              me.contentElt.setAttribute('data-y', newPosition);
              _this2.containerElt.classList.remove('fixed');
            }
          });
        })();
      } else if (this.isScrollInterface) {
        this.containerElt.classList.remove('fixed');
      }
    }
  }, {
    key: 'moveListContent',
    value: function moveListContent(x, y) {
      var limitedY = Math.max(y, -this.maxContentListDragY);
      this.currentDragY = limitedY;

      if (!this.isScrollInterface) {
        this.contentElt.style['transform'] = 'translate3d(0, ' + limitedY + 'px, 0)';
      } else if (limitedY > 0 && this.isScrollInterface && this.dragStart0) {
        this.contentElt.style['transform'] = 'translate3d(0, ' + limitedY + 'px, 0)';
        this.contentElt.setAttribute('data-y', 0);
      }

      return limitedY;
    }
  }, {
    key: 'afterDragEnd',
    value: function afterDragEnd(velocityEvent) {
      var _this3 = this;

      var position = {
        x: 0,
        y: this.currentDragY
      };
      this.isDragging = false;

      TweenLite.to(position, 0.5, {
        y: 0,
        ease: Elastic.easeOut.config(1, 0.3),
        onUpdate: function onUpdate() {
          _this3.contentElt.style['transform'] = 'translate3d(0, ' + position.y + 'px, 0)';
          _this3.contentElt.setAttribute('data-y', 0);
        },
        onComplete: function onComplete() {}
      });
    }
  }]);

  return Scroller;
})();

module.exports = Scroller;

},{"./events.js":3,"./velocityEvent.js":6}],6:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Events = require('./Events');

var _Events2 = _interopRequireDefault(_Events);

var VelocityEvent = (function () {
  function VelocityEvent() {
    _classCallCheck(this, VelocityEvent);

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

  _createClass(VelocityEvent, [{
    key: 'listenTo',
    value: function listenTo(elt, ev, callback) {
      var _this = this;

      elt.addEventListener(ev, function (e) {
        if (ev === _Events2['default'].touchStart) {
          _this.startDrag(e);
        } else if (ev === _Events2['default'].touchEnd) {
          _this.endDrag(e);
        }
        callback(e, _this.getDragInfos());
      });
    }
  }, {
    key: 'startDrag',
    value: function startDrag(e) {
      var ev = _Events2['default'].getTouchEvents(e);

      this.dragStart.x = ev.x;
      this.dragStart.y = ev.y;
      this.dragStart.time = Date.now();
    }
  }, {
    key: 'endDrag',
    value: function endDrag(e) {
      var ev = _Events2['default'].getTouchEvents(e);

      this.dragEnd.x = ev.x;
      this.dragEnd.y = ev.y;
      this.dragEnd.time = Date.now();
    }
  }, {
    key: 'calcDistance',
    value: function calcDistance() {
      this.distance = Math.sqrt(Math.pow(this.dragEnd.x - this.dragStart.x, 2) + Math.pow(this.dragEnd.y - this.dragStart.y, 2));
    }
  }, {
    key: 'calcVelocity',
    value: function calcVelocity() {
      this.velocity = this.distance / (this.dragEnd.time - this.dragStart.time);
    }
  }, {
    key: 'getDragInfos',
    value: function getDragInfos() {
      this.calcDistance();
      this.calcVelocity();
      return {
        dragStart: this.dragStart,
        dragEnd: this.dragEnd,
        distance: this.distance,
        velocity: this.velocity,
        toTop: this.dragStart.y > this.dragEnd.y,
        toLeft: this.dragStart.x > this.dragEnd.x
      };
    }
  }]);

  return VelocityEvent;
})();

;

module.exports = VelocityEvent;

},{"./Events":1}]},{},[4])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvam9lL3Byb2pldHMvcHVsbC1kb3duLXRvLXJlZnJlc2gvanMvRXZlbnRzLmpzIiwiL1VzZXJzL2pvZS9wcm9qZXRzL3B1bGwtZG93bi10by1yZWZyZXNoL2pzL2VsYXN0aWMtc2Nyb2xsZXIuanMiLCIvVXNlcnMvam9lL3Byb2pldHMvcHVsbC1kb3duLXRvLXJlZnJlc2gvanMvZXZlbnRzLmpzIiwiL1VzZXJzL2pvZS9wcm9qZXRzL3B1bGwtZG93bi10by1yZWZyZXNoL2pzL21haW4uanMiLCIvVXNlcnMvam9lL3Byb2pldHMvcHVsbC1kb3duLXRvLXJlZnJlc2gvanMvc2Nyb2xsZXIuanMiLCIvVXNlcnMvam9lL3Byb2pldHMvcHVsbC1kb3duLXRvLXJlZnJlc2gvanMvdmVsb2NpdHlFdmVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsSUFBSSxNQUFNLEdBQUc7QUFDWCxTQUFPLEVBQUUsY0FBYyxJQUFJLE1BQU07QUFDakMsWUFBVSxFQUFFLGNBQWMsSUFBSSxNQUFNLEdBQUcsWUFBWSxHQUFHLFdBQVc7QUFDakUsV0FBUyxFQUFFLGNBQWMsSUFBSSxNQUFNLEdBQUcsV0FBVyxHQUFHLFdBQVc7QUFDL0QsVUFBUSxFQUFFLGNBQWMsSUFBSSxNQUFNLEdBQUcsVUFBVSxHQUFHLFNBQVM7Ozs7O0FBSzNELGdCQUFjLEVBQUUsd0JBQUMsQ0FBQyxFQUFLO0FBQ3JCLFdBQU87QUFDTCxPQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEFBQUMsSUFBSyxDQUFDLENBQUMsYUFBYSxJQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FB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LENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQUFBQyxJQUFJLENBQUMsR0FBRyxDQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFHLENBQUMsQ0FBQyxHQUFLLElBQUksQ0FBQyxHQUFHLENBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUcsQ0FBQyxDQUFDLEFBQUMsQ0FBQyxDQUFDO0tBQ3BJOzs7V0FFVyx3QkFBRztBQUNiLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQSxBQUFDLENBQUM7S0FDM0U7OztXQUVXLHdCQUFHO0FBQ2IsVUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQ3BCLFVBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUNwQixhQUFPO0FBQ0wsaUJBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztBQUN6QixlQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87QUFDckIsZ0JBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtBQUN2QixnQkFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO0FBQ3ZCLGFBQUssRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDeEMsY0FBTSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztPQUMxQyxDQUFBO0tBQ0Y7OztTQXJFRyxhQUFhOzs7QUF1RW5CLENBQUM7O0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibGV0IEV2ZW50cyA9IHtcbiAgaXNUb3VjaDogJ29udG91Y2hzdGFydCcgaW4gd2luZG93LFxuICB0b3VjaFN0YXJ0OiAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgPyAndG91Y2hzdGFydCcgOiAnbW91c2Vkb3duJyAsXG4gIHRvdWNoTW92ZTogJ29udG91Y2hzdGFydCcgaW4gd2luZG93ID8gJ3RvdWNobW92ZScgOiAnbW91c2Vtb3ZlJyxcbiAgdG91Y2hFbmQ6ICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyA/ICd0b3VjaGVuZCcgOiAnbW91c2V1cCcsXG5cbiAgLyoqXG4gICAqIEdhdGhlciB0b3VjaCAvIGNsaWNrIHBvc2l0aW9uIGZyb20gZXZlbnRzXG4gICAqKi9cbiAgZ2V0VG91Y2hFdmVudHM6IChlKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IGUuY2xpZW50WCB8fCAoZS50b3VjaGVzICYmIGUudG91Y2hlc1swXSAmJiBlLnRvdWNoZXNbMF0uY2xpZW50WCkgfHwgKGUudGFyZ2V0VG91Y2hlcyAmJiBlLnRhcmdldFRvdWNoZXNbMF0gJiYgZS50YXJnZXRUb3VjaGVzWzBdLmNsaWVudFgpIHx8IChlLmNoYW5nZWRUb3VjaGVzICYmIGUuY2hhbmdlZFRvdWNoZXNbMF0gJiYgZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYKSxcbiAgICAgIHk6IGUuY2xpZW50WSB8fCAoZS50b3VjaGVzICYmIGUudG91Y2hlc1swXSAmJiBlLnRvdWNoZXNbMF0uY2xpZW50WSkgfHwgKGUudGFyZ2V0VG91Y2hlcyAmJiBlLnRhcmdldFRvdWNoZXNbMF0gJiYgZS50YXJnZXRUb3VjaGVzWzBdLmNsaWVudFkpIHx8IChlLmNoYW5nZWRUb3VjaGVzICYmIGUuY2hhbmdlZFRvdWNoZXNbMF0gJiYgZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZKVxuICAgIH1cbiAgfVxufTtcbm1vZHVsZS5leHBvcnRzID0gRXZlbnRzO1xuIiwiaW1wb3J0IFNjcm9sbGVyIGZyb20gJy4vc2Nyb2xsZXInO1xuaW1wb3J0IEV2ZW50cyBmcm9tICcuL2V2ZW50cyc7XG5cbmNsYXNzIEVsYXN0aWNTY3JvbGxlciBleHRlbmRzIFNjcm9sbGVyIHtcbiAgY29uc3RydWN0b3IocGFyYW1zKSB7XG4gICAgc3VwZXIocGFyYW1zKTtcbiAgICB0aGlzLmlzTG9uZ09wZXJhdGlvbkZpbmlzaCA9IGZhbHNlO1xuICAgIHRoaXMuc3ZnRWx0ID0gcGFyYW1zLnN2Z0VsdDtcbiAgICB0aGlzLm9wZXJhdGlvbiA9IHBhcmFtcy5vcGVyYXRpb247XG4gICAgdGhpcy5saW5lMlBvc2l0aW9uID0ge1xuICAgICAgeDogMCxcbiAgICAgIHk6IDVcbiAgICB9LFxuICAgIHRoaXMuY2lyY2xlUmF5b24gPSBwYXJhbXMuY2lyY2xlUmF5b24gfHwgMjA7XG4gICAgdGhpcy5jaXJjbGVMZW5ndGggPSAyICogTWF0aC5QSSAqIHRoaXMuY2lyY2xlUmF5b25cblxuICAgIHRoaXMubG9hZGVyTGluZVBhcmFtcyA9IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwXG4gICAgfTtcbiAgICB0aGlzLnN0cmV0Y2hIZWlnaHQgPSBwYXJhbXMuc3RyZXRjaEhlaWdodCB8fCAxMDA7XG5cblxuICAgIC8vIEFwZW5kIHN2ZyBwYXRoXG4gICAgdGhpcy5saW5lMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCBcInBhdGhcIik7XG4gICAgdGhpcy5saW5lMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCBcInBhdGhcIik7XG4gICAgdGhpcy5jaXJjbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgXCJjaXJjbGVcIik7XG5cbiAgICB0aGlzLmxpbmUxLnNldEF0dHJpYnV0ZSgnaWQnLCAnbGluZTEnKTtcbiAgICB0aGlzLmxpbmUyLnNldEF0dHJpYnV0ZSgnaWQnLCAnbGluZTInKTtcbiAgICB0aGlzLmxpbmUyLmNsYXNzTGlzdC5hZGQoXCJsb2FkZXItbGluZVwiKVxuICAgIHRoaXMuY2lyY2xlLnNldEF0dHJpYnV0ZSgnaWQnLCAnY2lyY2xlMScpO1xuXG4gICAgdGhpcy5zdmdFbHQuYXBwZW5kQ2hpbGQodGhpcy5saW5lMSk7XG4gICAgdGhpcy5zdmdFbHQuYXBwZW5kQ2hpbGQodGhpcy5saW5lMik7XG4gICAgdGhpcy5zdmdFbHQuYXBwZW5kQ2hpbGQodGhpcy5jaXJjbGUpO1xuICB9XG5cbiAgcmVzaXplKGUpIHtcbiAgICBzdXBlci5yZXNpemUoKTtcblxuICAgIC8vIFJlc2l6ZSBTVkcgZWxlbWVudHNcbiAgICB0aGlzLnN2Z0VsdC5zdHlsZS53aWR0aCA9IHRoaXMud3cgKyAncHgnO1xuICAgIHRoaXMuc3ZnRWx0LnN0eWxlLmhlaWdodCA9IHRoaXMud2ggKyAncHgnO1xuXG4gICAgbGV0IHBhdGhMMSA9ICcnO1xuICAgIHBhdGhMMSArPSAnTSAwIDAgJztcbiAgICBwYXRoTDEgKz0gJ0wgMCAnICsgdGhpcy53dztcbiAgICAvL3BhdGhMMSArPSBcIkMgXCIgKyB3dyowLjcgKyBcIiAxMCBcIisgd3cqMC43MisgXCIgMTUwIFwiICsgd3cgKyBcIiAwXCI7XG4gICAgcGF0aEwxICs9ICcgWic7XG4gICAgdGhpcy5saW5lMS5zZXRBdHRyaWJ1dGUoJ2QnLCBwYXRoTDEpO1xuXG4gICAgbGV0IHBhdGhMMiA9ICcnO1xuICAgIHBhdGhMMiArPSAnTTAsICcgKyB0aGlzLmxpbmUyUG9zaXRpb24ueSArICcgJztcbiAgICBwYXRoTDIgKz0gJ0wgJyArIHRoaXMud3cgKyAnICcgKyB0aGlzLmxpbmUyUG9zaXRpb24ueSArICcgJztcbiAgICBwYXRoTDIgKz0gJ1onO1xuICAgIHRoaXMubGluZTIuc2V0QXR0cmlidXRlKCdkJywgcGF0aEwyKTtcblxuICAgIHRoaXMuY2lyY2xlLnNldEF0dHJpYnV0ZSgnY3gnLCB0aGlzLnd3IC8gMik7XG4gICAgdGhpcy5jaXJjbGUuc2V0QXR0cmlidXRlKCdjeScsIHRoaXMubGluZTJQb3NpdGlvbi55ICsgdGhpcy5jaXJjbGVSYXlvbik7XG4gICAgdGhpcy5jaXJjbGUuc2V0QXR0cmlidXRlKCdyJywgdGhpcy5jaXJjbGVSYXlvbik7XG4gICAgdGhpcy5jaXJjbGUuc2V0QXR0cmlidXRlKCdzdHJva2UtZGFzaG9mZnNldCcsIC10aGlzLmNpcmNsZUxlbmd0aCk7XG4gICAgdGhpcy5jaXJjbGUuc2V0QXR0cmlidXRlKCdzdHJva2UtZGFzaGFycmF5JywgJycgKyB0aGlzLmNpcmNsZUxlbmd0aCArICcgJyArIHRoaXMuY2lyY2xlTGVuZ3RoKTtcblxuICB9XG5cbiAgb25Ub3VjaE1vdmUoZSkge1xuICAgIGlmICghdGhpcy5pc0RyYWdnaW5nKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgc3VwZXIub25Ub3VjaE1vdmUoZSk7XG5cbiAgICAvLyBNb3ZlIGxpbmUyXG4gICAgdGhpcy5kcmFnU3RhcnQwICYmIHRoaXMubW92ZUxvYWRlckFuaW0oRXZlbnRzLmdldFRvdWNoRXZlbnRzKGUpLngsIHRoaXMuY3VycmVudERyYWdZKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNb3ZlIGxpc3QgY29udGVudCB3aXRoIGRyYWcgYW5kIGlmIGVudGVyIGluIHJlZnJlc2ggem9uZSxcbiAgICogdXBkYXRlIGxpbmUxIHNoYXBlXG4gICAqL1xuICBtb3ZlTGlzdENvbnRlbnQoeCwgeSkge1xuICAgIGxldCBsaW1pdGVkWSA9IHN1cGVyLm1vdmVMaXN0Q29udGVudCh4LCB5KTtcblxuICAgIGlmIChsaW1pdGVkWSA+IDAgJiYgIXRoaXMuaXNTY3JvbGxJbnRlcmZhY2UpIHtcbiAgICAgIHRoaXMuZHJhZ1JlZnJlc2hlcih4LCBsaW1pdGVkWSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzU2Nyb2xsSW50ZXJmYWNlICYmIHRoaXMuZHJhZ1N0YXJ0MCkge1xuICAgICAgdGhpcy5kcmFnUmVmcmVzaGVyKHgsIGxpbWl0ZWRZKTtcbiAgICB9XG5cblxuXG4gICAgcmV0dXJuIGxpbWl0ZWRZO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBsaW5lIDEgc2hhcGUgXG4gICAqL1xuICBkcmFnUmVmcmVzaGVyKHgsIHkpIHtcbiAgICBpZiAoIXRoaXMuaXNEcmFnZ2luZykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgbGV0IHlQb3MgPSBNYXRoLm1pbih5LCB0aGlzLndoKTtcblxuICAgIGxldCBwYXRoTDEgPSAnJztcbiAgICBwYXRoTDEgKz0gJ00gJyArIHRoaXMud3cgKyAnIDAgJztcbiAgICBwYXRoTDEgKz0gJ0wgMCAwICc7XG4gICAgcGF0aEwxICs9ICdMIDAgJyArICh5UG9zICogMC41KSArICcgJztcbiAgICBwYXRoTDEgKz0gJ0wgJyArIHRoaXMud3cgKyAnICcgKyAoeVBvcyAqIDAuNSkgKyAnICc7XG4gICAgcGF0aEwxICs9ICdMIDAgJyArICh5UG9zICogMC41KSArICcgJztcbiAgICBwYXRoTDEgKz0gJ0MgJyArIHggKyAnICcgKyAoeVBvcyAqIDAuNSkgKyAnICcgKyB0aGlzLnd3ICogMC43MiArICcgJyArIHlQb3MgKyAnICcgKyB0aGlzLnd3ICogMSArICcgJyArICh5UG9zICogMC41KTtcbiAgICBwYXRoTDEgKz0gJ1ogJztcblxuICAgIHRoaXMubGluZTEuc2V0QXR0cmlidXRlKCdkJywgcGF0aEwxKTtcblxuICB9XG5cbiAgbW92ZUxvYWRlckFuaW0oeCwgeSkge1xuXG4gICAgdGhpcy5saW5lMlBvc2l0aW9uLnggPSBNYXRoLm1heCh0aGlzLnd3IC0geSAqIDEuNSwgdGhpcy53dyAqIDAuMik7XG5cbiAgICBsZXQgcGF0aEwyID0gJyc7XG4gICAgcGF0aEwyICs9ICdNMCAgJyArIHRoaXMubGluZTJQb3NpdGlvbi55ICsgJyAnO1xuICAgIHBhdGhMMiArPSAnTCAnICsgdGhpcy5saW5lMlBvc2l0aW9uLnggKyAnICcgKyB0aGlzLmxpbmUyUG9zaXRpb24ueTtcblxuICAgIHRoaXMubGluZTIuc2V0QXR0cmlidXRlKCdkJywgcGF0aEwyKTtcblxuICAgIHRoaXMuY2lyY2xlLnNldEF0dHJpYnV0ZSgncicsIHRoaXMuY2lyY2xlUmF5b24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFmdGVyIGRyYWcgZW5kIGFuaW1hdGUgbGluZTEgc2hhcGVcbiAgICovXG4gIGFmdGVyRHJhZ0VuZCh2ZWxvY2l0eUV2ZW50KSB7XG4gICAgdGhpcy5pc0RyYWdnaW5nID0gZmFsc2U7XG4gICAgdGhpcy5pc0Rpc2FibGVkID0gdHJ1ZTtcblxuICAgIGxldCBwb3NpdGlvbiA9IHtcbiAgICAgIHk6IE1hdGgubWluKHZlbG9jaXR5RXZlbnQuZHJhZ0VuZC55LCB0aGlzLndoKVxuICAgIH07XG5cbiAgICBpZiAodGhpcy5pc1Njcm9sbEludGVyZmFjZSAmJiAhdGhpcy5kcmFnU3RhcnQwKSB7XG4gICAgICB0aGlzLmlzRGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIERvIG5vdCB0cmlnZ2VyIHJlZnJlc2hcbiAgICBpZiAodmVsb2NpdHlFdmVudC5kaXN0YW5jZSA8IHRoaXMucmVmcmVzaERpc3RhbmNlVHJpZ2dlcikge1xuICAgICAgVHdlZW5MaXRlLnRvKHBvc2l0aW9uLCAwLjUsIHtcbiAgICAgICAgeTogMCxcbiAgICAgICAgZWFzZTogRWxhc3RpYy5lYXNlT3V0LmNvbmZpZygxLCAwLjMpLFxuXG4gICAgICAgIG9uVXBkYXRlOiAoKSA9PiB7XG4gICAgICAgICAgbGV0IHBhdGhMMSA9ICcnO1xuICAgICAgICAgIHBhdGhMMSArPSAnTSAnICsgdGhpcy53dyArICcgMCAnO1xuICAgICAgICAgIHBhdGhMMSArPSAnTCAwIDAgJztcbiAgICAgICAgICBwYXRoTDEgKz0gJ0wgMCAnICsgMCArICcgJztcbiAgICAgICAgICBwYXRoTDEgKz0gJ0wgJyArIHRoaXMud3cgKyAnICcgKyAwICsgJyAnO1xuICAgICAgICAgIHBhdGhMMSArPSAnTCAwICcgKyAwICsgJyAnO1xuICAgICAgICAgIHBhdGhMMSArPSAnQyAnICsgMCArICcgJyArIDAgKyAnICcgKyB0aGlzLnd3ICogMC43MiArICcgJyArIHBvc2l0aW9uLnkgKyAnICcgKyB0aGlzLnd3ICogMSArICcgJyArIDAgKyAnICc7XG4gICAgICAgICAgcGF0aEwxICs9ICdaICc7XG5cbiAgICAgICAgICB0aGlzLmxpbmUxLnNldEF0dHJpYnV0ZSgnZCcsIHBhdGhMMSk7XG4gICAgICAgICAgdGhpcy5jb250ZW50RWx0LnN0eWxlWyd0cmFuc2Zvcm0nXSA9ICd0cmFuc2xhdGUzZCgwLCAnICsgKHBvc2l0aW9uLnkpICsgJ3B4LCAwKSc7XG4gICAgICAgICAgdGhpcy5jb250ZW50RWx0LnNldEF0dHJpYnV0ZSgnZGF0YS15JywgMCk7XG5cbiAgICAgICAgICBsZXQgcGF0aEwyID0gJyc7XG4gICAgICAgICAgcGF0aEwyICs9ICdNMCAgJyArIHRoaXMubGluZTJQb3NpdGlvbi55ICsgJyAnO1xuICAgICAgICAgIHBhdGhMMiArPSAnTCAnICsgKHRoaXMud3cgLSBwb3NpdGlvbi55KSArICcgJyArIHRoaXMubGluZTJQb3NpdGlvbi55O1xuICAgICAgICAgIHRoaXMubGluZTIuc2V0QXR0cmlidXRlKCdkJywgcGF0aEwyKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Db21wbGV0ZTogKCkgPT4ge1xuICAgICAgICAgIHRoaXMuaXNEaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuY29udGFpbmVyRWx0LmNsYXNzTGlzdC5yZW1vdmUoJ2ZpeGVkJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBEbyByZWZyZXNoXG5cbiAgICAgIC8vIERpc3BsYXkgY2lyY2xlXG4gICAgICB0aGlzLmxpbmVUb0NpcmNsZSgpO1xuXG4gICAgICBUd2VlbkxpdGUudG8ocG9zaXRpb24sIDAuNSwge1xuICAgICAgICB5OiB0aGlzLnN0cmV0Y2hIZWlnaHQsXG4gICAgICAgIGVhc2U6IEVsYXN0aWMuZWFzZU91dC5jb25maWcoMSwgMC4zKSxcblxuICAgICAgICBvblVwZGF0ZTogKCkgPT4ge1xuICAgICAgICAgIGxldCBwYXRoTDEgPSAnJztcbiAgICAgICAgICBwYXRoTDEgKz0gJ00gJyArIHRoaXMud3cgKyAnIDAgJztcbiAgICAgICAgICBwYXRoTDEgKz0gJ0wgMCAwICc7XG4gICAgICAgICAgcGF0aEwxICs9ICdMIDAgJyArIHRoaXMuc3RyZXRjaEhlaWdodCArICcgJztcbiAgICAgICAgICBwYXRoTDEgKz0gJ0wgJyArIHRoaXMud3cgKyAnICcgKyB0aGlzLnN0cmV0Y2hIZWlnaHQgKyAnICc7XG4gICAgICAgICAgcGF0aEwxICs9ICdMIDAgJyArIHRoaXMuc3RyZXRjaEhlaWdodCArICcgJztcbiAgICAgICAgICBwYXRoTDEgKz0gJ0MgJyArIDAgKyAnICcgKyB0aGlzLnN0cmV0Y2hIZWlnaHQgKyAnICcgKyB0aGlzLnd3ICogMC43MiArICcgJyArIHBvc2l0aW9uLnkgKyAnICcgKyB0aGlzLnd3ICogMSArICcgJyArIHRoaXMuc3RyZXRjaEhlaWdodCArICcgJztcbiAgICAgICAgICBwYXRoTDEgKz0gJ1ogJztcblxuICAgICAgICAgIHRoaXMubGluZTEuc2V0QXR0cmlidXRlKCdkJywgcGF0aEwxKTtcbiAgICAgICAgICB0aGlzLmNvbnRlbnRFbHQuc3R5bGVbJ3RyYW5zZm9ybSddID0gJ3RyYW5zbGF0ZTNkKDAsICcgKyAocG9zaXRpb24ueSkgKyAncHgsIDApJztcbiAgICAgICAgICB0aGlzLmNvbnRlbnRFbHQuc2V0QXR0cmlidXRlKCdkYXRhLXknLCAwKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Db21wbGV0ZTogKCkgPT4ge1xuXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGxpbmVUb0NpcmNsZSgpIHtcbiAgICBUd2VlbkxpdGUudG8odGhpcy5saW5lMlBvc2l0aW9uLCAwLjUsIHtcbiAgICAgIHg6IHRoaXMud3cgLyAyLFxuICAgICAgZWFzZTogU2luZS5lYXNlSW5PdXQsXG4gICAgICBvblVwZGF0ZTogKCkgPT4ge1xuXG4gICAgICAgIGxldCBwYXRoTDIgPSAnJztcbiAgICAgICAgcGF0aEwyICs9ICdNMCwgJyArIHRoaXMubGluZTJQb3NpdGlvbi55ICsgJyAnO1xuICAgICAgICBwYXRoTDIgKz0gJ0wgJyArIHRoaXMubGluZTJQb3NpdGlvbi54ICsgJyAnICsgdGhpcy5saW5lMlBvc2l0aW9uLnkgKyAnICc7XG4gICAgICAgIC8vcGF0aEwxICs9ICdaJztcblxuICAgICAgICB0aGlzLmxpbmUyLnNldEF0dHJpYnV0ZSgnZCcsIHBhdGhMMik7XG4gICAgICB9LFxuICAgICAgb25Db21wbGV0ZTogKCkgPT4ge1xuICAgICAgICB0aGlzLmNpcmNsZS5zZXRBdHRyaWJ1dGUoJ3N0cm9rZS1kYXNob2Zmc2V0JywgLXRoaXMuY2lyY2xlTGVuZ3RoKTtcbiAgICAgICAgdGhpcy5jaXJjbGUuc2V0QXR0cmlidXRlKCdzdHJva2UtZGFzaGFycmF5JywgJycgKyB0aGlzLmNpcmNsZUxlbmd0aCArICcgJyArIHRoaXMuY2lyY2xlTGVuZ3RoKTtcbiAgICAgICAgdGhpcy5saW5lMlBvc2l0aW9uLmRhc2hQb3MgPSB0aGlzLmNpcmNsZUxlbmd0aDtcbiAgICAgICAgdGhpcy5saW5lMlBvc2l0aW9uLnggPSAwO1xuXG4gICAgICAgIFR3ZWVuTGl0ZS50byh0aGlzLmxpbmUyUG9zaXRpb24sIDAuNSwge1xuICAgICAgICAgIGRhc2hQb3M6IDEwLFxuICAgICAgICAgIHg6IHRoaXMud3cgLyAyLFxuICAgICAgICAgIGVhc2U6IFNpbmUuZWFzZUluT3V0LFxuICAgICAgICAgIG9uVXBkYXRlOiAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNpcmNsZS5zZXRBdHRyaWJ1dGUoJ3N0cm9rZS1kYXNob2Zmc2V0JywgdGhpcy5saW5lMlBvc2l0aW9uLmRhc2hQb3MpO1xuXG5cbiAgICAgICAgICAgIGxldCBwYXRoTDIgPSAnJztcbiAgICAgICAgICAgIHBhdGhMMiArPSAnTSAnICsgdGhpcy5saW5lMlBvc2l0aW9uLnggKyAnICcgKyB0aGlzLmxpbmUyUG9zaXRpb24ueSArICcgJztcbiAgICAgICAgICAgIHBhdGhMMiArPSAnTCAnICsgdGhpcy53dyAvIDIgKyAnICcgKyB0aGlzLmxpbmUyUG9zaXRpb24ueSArICcgJztcblxuICAgICAgICAgICAgdGhpcy5saW5lMi5zZXRBdHRyaWJ1dGUoJ2QnLCBwYXRoTDIpO1xuXG4gICAgICAgICAgfSxcbiAgICAgICAgICBvbkNvbXBsZXRlOiAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJvdGF0ZUNpcmNsZSgpO1xuICAgICAgICAgICAgdGhpcy5vcGVyYXRpb24oKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcm90YXRlQ2lyY2xlKCkge1xuICAgIGxldCByb3RhdGlvbiA9IHtcbiAgICAgIHo6IC05MFxuICAgIH07XG5cbiAgICB0aGlzLmNpcmNsZS5zdHlsZS50cmFuc2Zvcm0gPSAncm90YXRlWignICsgKC05MCkgKyAnZGVnKSc7XG5cbiAgICBUd2VlbkxpdGUudG8ocm90YXRpb24sIDEsIHtcbiAgICAgIHo6IDI3MCxcbiAgICAgIGVhc2U6IFNpbmUuZWFzZUluT3V0LFxuICAgICAgb25VcGRhdGU6ICgpID0+IHtcbiAgICAgICAgdGhpcy5jaXJjbGUuc3R5bGUudHJhbnNmb3JtID0gJ3JvdGF0ZVooJyArIHJvdGF0aW9uLnogKyAnZGVnKSc7XG4gICAgICB9LFxuICAgICAgb25Db21wbGV0ZTogKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pc0xvbmdPcGVyYXRpb25GaW5pc2ggPT09IHRydWUpIHtcbiAgICAgICAgICB0aGlzLmlzTG9uZ09wZXJhdGlvbkZpbmlzaCA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMucmV2ZXJzZUFuaW1hdGlvbigpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5yb3RhdGVDaXJjbGUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmV2ZXJzZUFuaW1hdGlvbigpIHtcbiAgICBsZXQgcm90YXRpb24gPSB7XG4gICAgICB6OiAyNzBcbiAgICB9O1xuICAgIGxldCBsb2FkZXJQb3NpdGlvbiA9IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwLFxuICAgICAgZGFzaFBvczogMFxuICAgIH07XG5cbiAgICB0aGlzLmNpcmNsZS5zdHlsZS50cmFuc2Zvcm0gPSAncm90YXRlWignICsgKDI3MCkgKyAnZGVnKSc7XG5cbiAgICBUd2VlbkxpdGUudG8ocm90YXRpb24sIDEsIHtcbiAgICAgIHo6IC05MCxcbiAgICAgIGVhc2U6IFNpbmUuZWFzZUluT3V0LFxuICAgICAgb25VcGRhdGU6ICgpID0+IHtcbiAgICAgICAgdGhpcy5jaXJjbGUuc3R5bGUudHJhbnNmb3JtID0gJ3JvdGF0ZVooJyArIHJvdGF0aW9uLnogKyAnZGVnKSc7XG4gICAgICB9LFxuICAgICAgb25Db21wbGV0ZTogKCkgPT4ge1xuICAgICAgICAvKiAgYW5pbWF0ZSBsb2FkZXIgYmFyICovXG4gICAgICAgIGxvYWRlclBvc2l0aW9uLnggPSB0aGlzLnd3IC8gMjtcbiAgICAgICAgbG9hZGVyUG9zaXRpb24uZGFzaFBvcyA9IDEwLFxuICAgICAgICBUd2VlbkxpdGUudG8obG9hZGVyUG9zaXRpb24sIDAuNSwge1xuICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgZGFzaFBvczogdGhpcy5jaXJjbGVMZW5ndGgsXG4gICAgICAgICAgZWFzZTogU2luZS5lYXNlSW5PdXQsXG4gICAgICAgICAgb25VcGRhdGU6ICgpID0+IHtcblxuICAgICAgICAgICAgdGhpcy5jaXJjbGUuc2V0QXR0cmlidXRlKCdzdHJva2UtZGFzaG9mZnNldCcsIGxvYWRlclBvc2l0aW9uLmRhc2hQb3MpO1xuXG4gICAgICAgICAgICBsZXQgcGF0aEwyID0gJyc7XG4gICAgICAgICAgICBwYXRoTDIgKz0gJ00gJyArIGxvYWRlclBvc2l0aW9uLnggKyAnICcgKyB0aGlzLmxpbmUyUG9zaXRpb24ueSArICcgJztcbiAgICAgICAgICAgIHBhdGhMMiArPSAnTCAnICsgdGhpcy53dyAvIDIgKyAnICcgKyB0aGlzLmxpbmUyUG9zaXRpb24ueSArICcgJztcblxuICAgICAgICAgICAgdGhpcy5saW5lMi5zZXRBdHRyaWJ1dGUoJ2QnLCBwYXRoTDIpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgb25Db21wbGV0ZTogKCkgPT4ge1xuICAgICAgICAgICAgbG9hZGVyUG9zaXRpb24ueCA9IHRoaXMud3cgLyAyO1xuICAgICAgICAgICAgdGhpcy5wdXNoVXBMaXN0KCk7XG4gICAgICAgICAgICBUd2VlbkxpdGUudG8obG9hZGVyUG9zaXRpb24sIDEsIHtcbiAgICAgICAgICAgICAgeDogdGhpcy53dyxcbiAgICAgICAgICAgICAgZWFzZTogU2luZS5lYXNlSW5PdXQsXG4gICAgICAgICAgICAgIG9uVXBkYXRlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHBhdGhMMiA9ICcnO1xuICAgICAgICAgICAgICAgIHBhdGhMMiArPSAnTSAnICsgMCArICcgJyArIHRoaXMubGluZTJQb3NpdGlvbi55ICsgJyAnO1xuICAgICAgICAgICAgICAgIHBhdGhMMiArPSAnTCAnICsgbG9hZGVyUG9zaXRpb24ueCArICcgJyArIHRoaXMubGluZTJQb3NpdGlvbi55ICsgJyAnO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5saW5lMi5zZXRBdHRyaWJ1dGUoJ2QnLCBwYXRoTDIpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBvbkNvbXBsZXRlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0Rpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXJFbHQuY2xhc3NMaXN0LnJlbW92ZSgnZml4ZWQnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHB1c2hVcExpc3QoKSB7XG4gICAgbGV0IHBvc2l0aW9uID0ge1xuICAgICAgeTogTWF0aC5taW4odGhpcy52ZWxvY2l0eUV2ZW50LmRyYWdFbmQueSwgdGhpcy53aClcbiAgICB9O1xuICAgIFR3ZWVuTGl0ZS50byhwb3NpdGlvbiwgMSwge1xuICAgICAgeTogMCxcbiAgICAgIGVhc2U6IEVsYXN0aWMuZWFzZU91dC5jb25maWcoMSwgMC4zKSxcbiAgICAgIG9uVXBkYXRlOiAoKSA9PiB7XG4gICAgICAgIGxldCBwYXRoTDEgPSAnJztcbiAgICAgICAgcGF0aEwxICs9ICdNICcgKyB0aGlzLnd3ICsgJyAwICc7XG4gICAgICAgIHBhdGhMMSArPSAnTCAwIDAgJztcbiAgICAgICAgcGF0aEwxICs9ICdMIDAgJyArIDAgKyAnICc7XG4gICAgICAgIHBhdGhMMSArPSAnTCAnICsgdGhpcy53dyArICcgJyArIDAgKyAnICc7XG4gICAgICAgIHBhdGhMMSArPSAnTCAwICcgKyAwICsgJyAnO1xuICAgICAgICBwYXRoTDEgKz0gJ0MgJyArIHRoaXMudmVsb2NpdHlFdmVudC5kcmFnRW5kLnggKyAnICcgKyAwICsgJyAnICsgdGhpcy53dyAqIDAuNzIgKyAnICcgKyBwb3NpdGlvbi55ICsgJyAnICsgdGhpcy53dyAqIDEgKyAnICcgKyAwICsgJyAnO1xuICAgICAgICBwYXRoTDEgKz0gJ1ogJztcblxuICAgICAgICB0aGlzLmxpbmUxLnNldEF0dHJpYnV0ZSgnZCcsIHBhdGhMMSk7XG4gICAgICAgIHRoaXMuY29udGVudEVsdC5zdHlsZVsndHJhbnNmb3JtJ10gPSAndHJhbnNsYXRlM2QoMCwgJyArIChwb3NpdGlvbi55KSArICdweCwgMCknO1xuICAgICAgICB0aGlzLmNvbnRlbnRFbHQuc2V0QXR0cmlidXRlKCdkYXRhLXknLCAwKTtcbiAgICAgIH0sXG4gICAgICBvbkNvbXBsZXRlOiAoKSA9PiB7XG4gICAgICAgIHRoaXMuaXNEaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZmluaXNoTG9uZ09wZXJhdGlvbigpIHtcbiAgICB0aGlzLmlzTG9uZ09wZXJhdGlvbkZpbmlzaCA9IHRydWU7XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEVsYXN0aWNTY3JvbGxlcjsiLCJsZXQgRXZlbnRzID0ge1xuICBpc1RvdWNoOiAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3csXG4gIHRvdWNoU3RhcnQ6ICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyA/ICd0b3VjaHN0YXJ0JyA6ICdtb3VzZWRvd24nICxcbiAgdG91Y2hNb3ZlOiAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgPyAndG91Y2htb3ZlJyA6ICdtb3VzZW1vdmUnLFxuICB0b3VjaEVuZDogJ29udG91Y2hzdGFydCcgaW4gd2luZG93ID8gJ3RvdWNoZW5kJyA6ICdtb3VzZXVwJyxcblxuICAvKipcbiAgICogR2F0aGVyIHRvdWNoIC8gY2xpY2sgcG9zaXRpb24gZnJvbSBldmVudHNcbiAgICoqL1xuICBnZXRUb3VjaEV2ZW50czogKGUpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgeDogZS5jbGllbnRYIHx8IChlLnRvdWNoZXMgJiYgZS50b3VjaGVzWzBdICYmIGUudG91Y2hlc1swXS5jbGllbnRYKSB8fCAoZS50YXJnZXRUb3VjaGVzICYmIGUudGFyZ2V0VG91Y2hlc1swXSAmJiBlLnRhcmdldFRvdWNoZXNbMF0uY2xpZW50WCkgfHwgKGUuY2hhbmdlZFRvdWNoZXMgJiYgZS5jaGFuZ2VkVG91Y2hlc1swXSAmJiBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFgpLFxuICAgICAgeTogZS5jbGllbnRZIHx8IChlLnRvdWNoZXMgJiYgZS50b3VjaGVzWzBdICYmIGUudG91Y2hlc1swXS5jbGllbnRZKSB8fCAoZS50YXJnZXRUb3VjaGVzICYmIGUudGFyZ2V0VG91Y2hlc1swXSAmJiBlLnRhcmdldFRvdWNoZXNbMF0uY2xpZW50WSkgfHwgKGUuY2hhbmdlZFRvdWNoZXMgJiYgZS5jaGFuZ2VkVG91Y2hlc1swXSAmJiBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFkpXG4gICAgfVxuICB9XG59O1xubW9kdWxlLmV4cG9ydHMgPSBFdmVudHM7XG4iLCJpbXBvcnQgRWxhc3RpY1Njcm9sbGVyIGZyb20gJy4vZWxhc3RpYy1zY3JvbGxlci5qcyc7XG5cbmxldCBlU2Nyb2xsZXIgPSBudWxsO1xuXG5sZXQgbG9uZ09wZXJhdGlvbiA9ICgpID0+IHtcbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgZVNjcm9sbGVyLmZpbmlzaExvbmdPcGVyYXRpb24oKTtcbiAgfSwgMTAwMCk7XG59XG5cbmxldCBpbml0U2Nyb2xsZXIgPSAoKSA9PiB7XG4gIGVTY3JvbGxlciA9IG5ldyBFbGFzdGljU2Nyb2xsZXIoe1xuICAgIGNvbnRhaW5lckVsdDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lci1saXN0JyksXG4gICAgY29udGVudEVsdDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQtbGlzdCcpLFxuICAgIHN2Z0VsdDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N2Z0VsdCcpLFxuICAgIHN0cmV0Y2hIZWlnaHQ6IDEwMCxcbiAgICBvcGVyYXRpb246IGxvbmdPcGVyYXRpb25cbiAgfSkuaW5pdCgpO1xufTtcblxuaW5pdFNjcm9sbGVyKCk7XG5cblxuXG4iLCJpbXBvcnQgRXZlbnRzIGZyb20gJy4vZXZlbnRzLmpzJztcbmltcG9ydCBWZWxvY2l0eUV2ZW50IGZyb20gJy4vdmVsb2NpdHlFdmVudC5qcyc7XG5cbmNsYXNzIFNjcm9sbGVyIHtcbiAgY29uc3RydWN0b3IocGFyYW1zKSB7XG4gICAgdGhpcy5jb250ZW50RWx0ID0gcGFyYW1zLmNvbnRlbnRFbHQ7IC8vIGNvbnRlbnQgZWxlbWVudFxuICAgIHRoaXMuY29udGFpbmVyRWx0ID0gcGFyYW1zLmNvbnRhaW5lckVsdDsgLy8gY29udGFpbmVyIGVsZW1lbnRcbiAgICB0aGlzLnJlZnJlc2hEaXN0YW5jZVRyaWdnZXIgPSB0aGlzLnd3IC8gMjsgLy8gRGlzdGFuY2UgZm9yIHRyaWdnZXJpbmcgcmVmcmVzaFxuICAgIHRoaXMubWF4Q29udGVudExpc3REcmFnWSA9IDA7IC8vIG1heGltdW0geSBkaXNwbGFjZW1lbnQgb2YgbGlzdFxuXG4gICAgdGhpcy5pc0RyYWdnaW5nID0gZmFsc2U7IC8vIE5lZWQgY29tbWVudCA/XG4gICAgdGhpcy5jdXJyZW50RHJhZ1kgPSAwOyAvLyBDdXJyZW50IHkgcG9zaXRpb24gb2YgdGhlIGxpc3RcbiAgICB0aGlzLnN0cmV0Y2hIZWlnaHQgPSAxMDA7IC8vIE1heGltdW0gc3RyZXRjaCBoZWlnaHRcbiAgICB0aGlzLnZlbG9jaXR5RXZlbnQgPSBuZXcgVmVsb2NpdHlFdmVudCgpO1xuICAgIHRoaXMuaXNEaXNhYmxlZCA9IGZhbHNlO1xuICAgIHRoaXMuZHJhZ1N0YXJ0MCA9IGZhbHNlO1xuICAgIHRoaXMuaXNTY3JvbGxJbnRlcmZhY2UgPSBFdmVudHMuaXNUb3VjaDtcbiAgfVxuXG4gIGluaXQoKSB7XG5cbiAgICBpZighRXZlbnRzLmlzVG91Y2gpe1xuICAgICAgdGhpcy5jb250YWluZXJFbHQuY2xhc3NMaXN0LmFkZChcInNjcm9sbC1oaWRkZW5cIik7XG4gICAgfVxuXG4gICAgLy8gbGlzdGVuIHRvIHJlc2l6ZSBldmVudFxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgIHJlc2l6ZSgpO1xuICAgIH0pO1xuXG4gICAgLy8gTGlzdGVuIHRvdWNoIHN0YXJ0XG4gICAgdGhpcy52ZWxvY2l0eUV2ZW50Lmxpc3RlblRvKHRoaXMuY29udGFpbmVyRWx0LCBFdmVudHMudG91Y2hTdGFydCwgKGUpID0+IHtcbiAgICAgIHRoaXMub25Ub3VjaFN0YXJ0KGUpO1xuICAgIH0pO1xuXG4gICAgLy8gTGlzdGVuIHRvdWNoIGVuZFxuICAgIHRoaXMudmVsb2NpdHlFdmVudC5saXN0ZW5Ubyh0aGlzLmNvbnRhaW5lckVsdCwgRXZlbnRzLnRvdWNoRW5kLCAoZSkgPT4ge1xuICAgICAgdGhpcy5vblRvdWNoRW5kKGUpO1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuaXNTY3JvbGxJbnRlcmZhY2UpIHsgLy8gVG91Y2ggaW50ZXJmYWNlXG4gICAgICAvLyBMaXN0ZW4gc2Nyb2xsXG4gICAgICB0aGlzLmNvbnRhaW5lckVsdC5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmNvbnRhaW5lckVsdC5hZGRFdmVudExpc3RlbmVyKEV2ZW50cy50b3VjaE1vdmUsIChlKSA9PiB7XG4gICAgICAgIHRoaXMub25Ub3VjaE1vdmUoZSk7XG4gICAgICB9KTtcblxuICAgIH0gZWxzZSB7IC8vIE1vdXNlIGludGVyZmFjZVxuICAgICAgLy8gTGlzdGVuIHRvdWNoIG1vdmVcbiAgICAgIHRoaXMuY29udGFpbmVyRWx0LmFkZEV2ZW50TGlzdGVuZXIoRXZlbnRzLnRvdWNoTW92ZSwgKGUpID0+IHtcbiAgICAgICAgdGhpcy5vblRvdWNoTW92ZShlKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMucmVzaXplKCk7XG5cbiAgICByZXR1cm4gdGhpcztcblxuICB9XG5cbiAgcmVzaXplKGUpIHtcbiAgICAvLyBHZXQgc2NyZWVuIHNpemVcbiAgICB0aGlzLnd3ID0gd2luZG93LmlubmVyV2lkdGggfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoO1xuICAgIHRoaXMud2ggPSB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDtcbiAgICB0aGlzLnJlZnJlc2hEaXN0YW5jZVRyaWdnZXIgPSB0aGlzLndoIC8gNDsgLy8gRGlzdGFuY2UgZm9yIHRyaWdnZXJpbmcgcmVmcmVzaFxuXG4gICAgbGV0IGNvbnRhaW5lckhlaWdodCA9IHRoaXMuY29udGFpbmVyRWx0Lm9mZnNldEhlaWdodDtcblxuICAgIC8vIE1heGltdW0gc2Nyb2xsXG4gICAgdGhpcy5tYXhDb250ZW50TGlzdERyYWdZID0gdGhpcy5jb250ZW50RWx0Lm9mZnNldEhlaWdodCAtIGNvbnRhaW5lckhlaWdodDtcblxuICB9XG5cbiAgb25Ub3VjaFN0YXJ0KGUpIHtcbiAgICAhdGhpcy5pc1Njcm9sbEludGVyZmFjZSAmJiBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYgKCF0aGlzLmlzRGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuaXNEcmFnZ2luZyA9IHRydWU7XG4gICAgICB0aGlzLmRyYWdTdGFydDAgPSB0aGlzLmNvbnRhaW5lckVsdC5zY3JvbGxUb3AgPT09IDA7XG4gICAgfVxuICB9XG5cbiAgb25Ub3VjaE1vdmUoZSkge1xuICAgICF0aGlzLmlzU2Nyb2xsSW50ZXJmYWNlICYmIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAoIXRoaXMuaXNEcmFnZ2luZykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIFxuICAgIGlmICh0aGlzLmlzU2Nyb2xsSW50ZXJmYWNlKSB7XG4gICAgICB0aGlzLmRyYWdTdGFydDAgPSB0aGlzLmRyYWdTdGFydDAgJiYgdGhpcy5jb250YWluZXJFbHQuc2Nyb2xsVG9wID09PSAwO1xuICAgICAgdGhpcy5jdXJyZW50RHJhZ1kgPSB0aGlzLmRyYWdTdGFydDAgPyBFdmVudHMuZ2V0VG91Y2hFdmVudHMoZSkueSAtIHRoaXMudmVsb2NpdHlFdmVudC5kcmFnU3RhcnQueSArIChwYXJzZUludCh0aGlzLmNvbnRlbnRFbHQuZ2V0QXR0cmlidXRlKCdkYXRhLXknKSwgMTApIHwgMCkgOiB0aGlzLmNvbnRhaW5lckVsdC5zY3JvbGxUb3A7XG5cbiAgICAgIC8vIEZpeCB0aGUgcG9zaXRpb25cbiAgICAgIGlmKHRoaXMuZHJhZ1N0YXJ0MCAmJiB0aGlzLmN1cnJlbnREcmFnWSA+IDApe1xuICAgICAgICB0aGlzLmNvbnRhaW5lckVsdC5jbGFzc0xpc3QuYWRkKCdmaXhlZCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jb250YWluZXJFbHQuY2xhc3NMaXN0LnJlbW92ZSgnZml4ZWQnKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jdXJyZW50RHJhZ1kgPSBFdmVudHMuZ2V0VG91Y2hFdmVudHMoZSkueSAtIHRoaXMudmVsb2NpdHlFdmVudC5kcmFnU3RhcnQueSArIChwYXJzZUludCh0aGlzLmNvbnRlbnRFbHQuZ2V0QXR0cmlidXRlKCdkYXRhLXknKSwgMTApIHwgMCk7XG4gICAgfVxuICAgIHRoaXMubW92ZUxpc3RDb250ZW50KEV2ZW50cy5nZXRUb3VjaEV2ZW50cyhlKS54LCB0aGlzLmN1cnJlbnREcmFnWSk7XG4gIH1cblxuICBvblRvdWNoRW5kKGUpIHtcbiAgICAhdGhpcy5pc1Njcm9sbEludGVyZmFjZSAmJiBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgbGV0IGRyYWdJbmZvcyA9IHRoaXMudmVsb2NpdHlFdmVudC5nZXREcmFnSW5mb3MoKSxcbiAgICAgIG1lID0gdGhpcztcblxuICAgIGlmICghdGhpcy5pc0RyYWdnaW5nKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgbWUuaXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgIG1lLmNvbnRlbnRFbHQuc2V0QXR0cmlidXRlKCdkYXRhLXknLCBtZS5jdXJyZW50RHJhZ1kpO1xuXG5cbiAgICBpZiAobWUuY3VycmVudERyYWdZID4gMSkgeyAvLyBpZiBsaXN0IHBvc2l0aW9uIHdhcyBlbnRlcmVkIGluIHJlZnJlc2ggem9uZVxuICAgICAgbWUuaXNEaXNhYmxlZCA9IHRydWU7XG4gICAgICBtZS5hZnRlckRyYWdFbmQgJiYgbWUuYWZ0ZXJEcmFnRW5kKGRyYWdJbmZvcyk7XG4gICAgICBtZS5kcmFnU3RhcnQwID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmICghdGhpcy5pc1Njcm9sbEludGVyZmFjZSAmJiBkcmFnSW5mb3MudmVsb2NpdHkgPiAwLjMpIHsgLy8gaWYgd2UgbWFrZSBhIHNwZWVkIGRyYWcsIGFuaW1hdGUgbGlzdFxuICAgICAgbGV0IHBvc2l0aW9uID0ge1xuICAgICAgICAgIHk6IG1lLmN1cnJlbnREcmFnWVxuICAgICAgICB9LFxuICAgICAgICBuZXdQb3NpdGlvbiA9IDA7XG4gICAgICBpZiAoZHJhZ0luZm9zLnRvVG9wKSB7XG4gICAgICAgIG5ld1Bvc2l0aW9uID0gTWF0aC5tYXgoLShtZS5tYXhDb250ZW50TGlzdERyYWdZKSwgbWUuY3VycmVudERyYWdZIC0gKGRyYWdJbmZvcy52ZWxvY2l0eSAqIGRyYWdJbmZvcy5kaXN0YW5jZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3UG9zaXRpb24gPSBNYXRoLm1pbigtKDApLCBtZS5jdXJyZW50RHJhZ1kgKyAoZHJhZ0luZm9zLnZlbG9jaXR5ICogZHJhZ0luZm9zLmRpc3RhbmNlKSk7XG4gICAgICB9XG5cbiAgICAgIFR3ZWVuTGl0ZS50byhwb3NpdGlvbiwgZHJhZ0luZm9zLnZlbG9jaXR5IC8gMiwge1xuICAgICAgICB5OiBuZXdQb3NpdGlvbixcbiAgICAgICAgZWFzZTogUG93ZXI0LmVhc2VPdXQsXG4gICAgICAgIG9uVXBkYXRlOiAoKSA9PiB7XG4gICAgICAgICAgbWUuY29udGVudEVsdC5zdHlsZVsndHJhbnNmb3JtJ10gPSAndHJhbnNsYXRlM2QoMCwgJyArIChwb3NpdGlvbi55KSArICdweCwgMCknO1xuXG4gICAgICAgIH0sXG4gICAgICAgIG9uQ29tcGxldGU6ICgpID0+IHtcbiAgICAgICAgICBtZS5jb250ZW50RWx0LnNldEF0dHJpYnV0ZSgnZGF0YS15JywgbmV3UG9zaXRpb24pO1xuICAgICAgICAgIHRoaXMuY29udGFpbmVyRWx0LmNsYXNzTGlzdC5yZW1vdmUoJ2ZpeGVkJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZih0aGlzLmlzU2Nyb2xsSW50ZXJmYWNlKXtcbiAgICAgIHRoaXMuY29udGFpbmVyRWx0LmNsYXNzTGlzdC5yZW1vdmUoJ2ZpeGVkJyk7XG4gICAgfVxuICB9XG5cbiAgbW92ZUxpc3RDb250ZW50KHgsIHkpIHtcbiAgICBsZXQgbGltaXRlZFkgPSBNYXRoLm1heCh5LCAtdGhpcy5tYXhDb250ZW50TGlzdERyYWdZKTtcbiAgICB0aGlzLmN1cnJlbnREcmFnWSA9IGxpbWl0ZWRZO1xuXG4gICAgaWYgKCF0aGlzLmlzU2Nyb2xsSW50ZXJmYWNlKSB7XG4gICAgICB0aGlzLmNvbnRlbnRFbHQuc3R5bGVbJ3RyYW5zZm9ybSddID0gJ3RyYW5zbGF0ZTNkKDAsICcgKyBsaW1pdGVkWSArICdweCwgMCknO1xuICAgIH0gZWxzZSBpZihsaW1pdGVkWSA+IDAgJiYgdGhpcy5pc1Njcm9sbEludGVyZmFjZSAmJiB0aGlzLmRyYWdTdGFydDApe1xuICAgICAgdGhpcy5jb250ZW50RWx0LnN0eWxlWyd0cmFuc2Zvcm0nXSA9ICd0cmFuc2xhdGUzZCgwLCAnICsgbGltaXRlZFkgKyAncHgsIDApJztcbiAgICAgIHRoaXMuY29udGVudEVsdC5zZXRBdHRyaWJ1dGUoJ2RhdGEteScsIDApO1xuICAgIH1cblxuICAgIHJldHVybiBsaW1pdGVkWTtcbiAgfVxuXG4gIGFmdGVyRHJhZ0VuZCh2ZWxvY2l0eUV2ZW50KSB7XG4gICAgbGV0IHBvc2l0aW9uID0ge1xuICAgICAgeDogMCxcbiAgICAgIHk6IHRoaXMuY3VycmVudERyYWdZXG4gICAgfTtcbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZTtcblxuXG4gICAgVHdlZW5MaXRlLnRvKHBvc2l0aW9uLCAwLjUsIHtcbiAgICAgIHk6IDAsXG4gICAgICBlYXNlOiBFbGFzdGljLmVhc2VPdXQuY29uZmlnKDEsIDAuMyksXG4gICAgICBvblVwZGF0ZTogKCkgPT4ge1xuICAgICAgICB0aGlzLmNvbnRlbnRFbHQuc3R5bGVbJ3RyYW5zZm9ybSddID0gJ3RyYW5zbGF0ZTNkKDAsICcgKyAocG9zaXRpb24ueSkgKyAncHgsIDApJztcbiAgICAgICAgdGhpcy5jb250ZW50RWx0LnNldEF0dHJpYnV0ZSgnZGF0YS15JywgMCk7XG4gICAgICB9LFxuICAgICAgb25Db21wbGV0ZTogKCkgPT4ge1xuXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTY3JvbGxlcjtcbiIsImltcG9ydCBFdmVudHMgZnJvbSAnLi9FdmVudHMnO1xuXG5jbGFzcyBWZWxvY2l0eUV2ZW50IHtcblxuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIHRoaXMuZHJhZ1N0YXJ0ID0ge1xuICAgICAgeDogMCxcbiAgICAgIHk6IDAsXG4gICAgICB0aW1lOiAwXG4gICAgfTtcblxuICAgIHRoaXMuZHJhZ0VuZCA9IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwLFxuICAgICAgdGltZTogMFxuICAgIH07XG5cbiAgICB0aGlzLmRpc3RhbmNlID0gMDtcblxuICAgIHRoaXMudmVsb2NpdHkgPSAwO1xuICB9XG5cbiAgbGlzdGVuVG8oZWx0LCBldiwgY2FsbGJhY2spIHtcbiAgICBlbHQuYWRkRXZlbnRMaXN0ZW5lcihldiwgKGUpID0+IHtcbiAgICAgIGlmIChldiA9PT0gRXZlbnRzLnRvdWNoU3RhcnQpIHtcbiAgICAgICAgdGhpcy5zdGFydERyYWcoZSk7XG4gICAgICB9IGVsc2UgaWYgKGV2ID09PSBFdmVudHMudG91Y2hFbmQpIHtcbiAgICAgICAgdGhpcy5lbmREcmFnKGUpO1xuICAgICAgfVxuICAgICAgY2FsbGJhY2soZSwgdGhpcy5nZXREcmFnSW5mb3MoKSk7XG4gICAgfSk7XG4gIH1cblxuXG4gIHN0YXJ0RHJhZyhlKSB7XG4gICAgbGV0IGV2ID0gRXZlbnRzLmdldFRvdWNoRXZlbnRzKGUpO1xuXG4gICAgdGhpcy5kcmFnU3RhcnQueCA9IGV2Lng7XG4gICAgdGhpcy5kcmFnU3RhcnQueSA9IGV2Lnk7XG4gICAgdGhpcy5kcmFnU3RhcnQudGltZSA9IERhdGUubm93KCk7XG5cbiAgfVxuXG4gIGVuZERyYWcoZSkge1xuICAgIGxldCBldiA9IEV2ZW50cy5nZXRUb3VjaEV2ZW50cyhlKTtcblxuICAgIHRoaXMuZHJhZ0VuZC54ID0gZXYueDtcbiAgICB0aGlzLmRyYWdFbmQueSA9IGV2Lnk7XG4gICAgdGhpcy5kcmFnRW5kLnRpbWUgPSBEYXRlLm5vdygpO1xuICB9XG5cbiAgY2FsY0Rpc3RhbmNlKCkge1xuICAgIHRoaXMuZGlzdGFuY2UgPSBNYXRoLnNxcnQoKE1hdGgucG93KCh0aGlzLmRyYWdFbmQueCAtIHRoaXMuZHJhZ1N0YXJ0LngpLCAyKSkgKyAoTWF0aC5wb3coKHRoaXMuZHJhZ0VuZC55IC0gdGhpcy5kcmFnU3RhcnQueSksIDIpKSk7XG4gIH1cblxuICBjYWxjVmVsb2NpdHkoKSB7XG4gICAgdGhpcy52ZWxvY2l0eSA9IHRoaXMuZGlzdGFuY2UgLyAodGhpcy5kcmFnRW5kLnRpbWUgLSB0aGlzLmRyYWdTdGFydC50aW1lKTtcbiAgfVxuXG4gIGdldERyYWdJbmZvcygpIHtcbiAgICB0aGlzLmNhbGNEaXN0YW5jZSgpO1xuICAgIHRoaXMuY2FsY1ZlbG9jaXR5KCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRyYWdTdGFydDogdGhpcy5kcmFnU3RhcnQsXG4gICAgICBkcmFnRW5kOiB0aGlzLmRyYWdFbmQsXG4gICAgICBkaXN0YW5jZTogdGhpcy5kaXN0YW5jZSxcbiAgICAgIHZlbG9jaXR5OiB0aGlzLnZlbG9jaXR5LFxuICAgICAgdG9Ub3A6IHRoaXMuZHJhZ1N0YXJ0LnkgPiB0aGlzLmRyYWdFbmQueSxcbiAgICAgIHRvTGVmdDogdGhpcy5kcmFnU3RhcnQueCA+IHRoaXMuZHJhZ0VuZC54XG4gICAgfVxuICB9XG59XG47XG5cbm1vZHVsZS5leHBvcnRzID0gVmVsb2NpdHlFdmVudDtcblxuIl19
