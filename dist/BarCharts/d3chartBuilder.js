"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setD3BuilderConcurrency = setD3BuilderConcurrency;
exports.default = d3chartBuilder;

var _queue = _interopRequireDefault(require("queue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var q = (0, _queue.default)();
q.concurrency = 150;
q.autostart = true;

function setD3BuilderConcurrency(concurrency) {
  q.concurrency = concurrency;
}

function d3chartBuilder(svg, data, showBarValues) {
  q.push(function (cb) {
    svg.selectAll('rect').data(data).enter().append('rect').attr('width', function (d) {
      return "".concat(d.width, "%");
    }).attr('x', function (d) {
      return "".concat(d.x, "%");
    }).attr('fill', function (d) {
      return d.color;
    }).attr('y', function (d) {
      return d.y;
    }).attr('height', function (d) {
      return d.height;
    });

    if (showBarValues) {
      svg.selectAll('text').data(data).enter().append('text').text(function (d) {
        return d.text;
      }).attr('text-anchor', 'middle').attr('x', function (d) {
        return "".concat(d.textX, "%") || "".concat(d.width - (d.text.length + 15), "%");
      }).attr('y', function (d) {
        return d.y + 10;
      }).attr('font-size', function (d) {
        return d.fontSize || '11px';
      }).attr('fill', function (d) {
        return d.fontColor || 'white';
      });
    }

    setTimeout(function () {
      cb();
    }, 50);
  });
}