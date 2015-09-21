import ElasticScroller from './elastic-scroller.js';

let eScroller = null;

let longOperation = () => {
  setTimeout(() => {
    eScroller.finishLongOperation();
  }, 1000);
}

let initScroller = () => {
  eScroller = new ElasticScroller({
    containerElt: document.getElementById('container-list'),
    contentElt: document.getElementById('content-list'),
    svgElt: document.getElementById('svgElt'),
    stretchHeight: 100,
    operation: longOperation
  }).init();
};

initScroller();



