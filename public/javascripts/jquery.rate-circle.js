;
(function ($) {
    var settings = {
        color:{
            back:'#EEE',
            filled:'#33E'
        }
    };
    var requestAnimationFrame = (function () {
        return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();
    var RateCircle = (function () {
        var AnimationStep = function (step) {
            var s = this;
            s.total = step;
            s.current = 0;
        };
        AnimationStep.prototype.isDone = function () {
            var s = this;
            return s.total <= s.current;
        };
        AnimationStep.prototype.getRate = function () {
            var s = this;
            return s.current / s.total;
        };
        AnimationStep.prototype.next = function () {
            var s = this;
            s.current++;
            return s;
        };


        var Arc = function (color, radius, rate) {
            var s = this;
            s.color = color;
            s.radius = radius;
            s.rate = rate;
            s.step = new AnimationStep(10);
        };
        Arc.prototype.done = function () {
            var s = this;
        };
        Arc.prototype.draw = function (ctx) {
            var s = this,
                PI = Math.PI;
            s.step.next();
            var lineW = 5;
            var r = s.radius;
            var x = r + lineW,
                y = r + lineW;
            ctx.strokeStyle = s.color;
            ctx.beginPath();
            ctx.lineWidth = lineW;
            ctx.moveTo(x, lineW * 5);
            var startAngle = PI * -0.5;
            var radius = r - lineW * 4;
            ctx.arc(x, y, radius,
                startAngle,
                startAngle + PI * 2 * s.rate * s.step.getRate(),
                false);
            ctx.stroke();
            console.log('s.step.getRate()', s.step.getRate());
        };
        var Root = function (radius, rate) {
            var s = this;
            s.radius = radius;
            s.rate = rate;
            s.outline = new Arc(settings.color.back, s.radius, 1);
            s.filled = new Arc(settings.color.filled, s.radius, s.rate);
        };
        Root.prototype.draw = function (ctx) {
            var s = this;
            s.outline.draw(ctx);
            s.filled.draw(ctx);
        };
        Root.prototype.animationDone = function () {
            var s = this;
            return s.outline.step.isDone() && s.filled.step.isDone();
        };
        return Root;
    })();
    $.fn.extend({
        rateCircle:function (rate) {

            if(arguments[0] instanceof Object){
                settings = $.extend(settings, arguments[0]);
                rate = settings.rate;
            }

            var container = $(this).empty(),
                w = container.width(),
                h = container.height();
            var canvas = $('<canvas/>').appendTo(container),
                ctx = canvas.get(0).getContext('2d');

            var r = w / 2;
            var size = {
                width:r * 2,
                height:r * 2
            };

            canvas.attr(size).css(size);
            var drawable = new RateCircle(r, rate);

            function render() {
                drawable.draw(ctx);
                if (drawable.animationDone()) {
                } else {
                    requestAnimationFrame(render);
                }
            }

            render();


            return container;
        }
    });
})(jQuery);