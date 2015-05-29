(function ($, wnd, undefined) {
    $.dropper.setMethod('placeBeforeShow', function (dropper, $this, opt) {
        var self = this;

        if (opt.place === 'inherit')
            return false;

        if (!_isScrollable.call($('body'), 'y'))
            $('body').css('overflow-y', 'hidden');
        if (!_isScrollable.call($('body'), 'x'))
            $('body').css('overflow-x', 'hidden');

        var pmt = opt.placeBeforeShow.toLowerCase().split(' '),
                t = -dropper[$.dropper.drp.actual]('outerHeight'),
                l = -dropper[$.dropper.drp.actual]('outerWidth');
        if (pmt[0] === 'center' || pmt[1] === 'center') {
            self._checkMethod(function () {
                self[opt.place].call(dropper, true);
            });
            t = dropper.css('top');
            l = dropper.css('left');
        }
        if (pmt[1] === 'bottom')
            t = wnd.height();
        if (pmt[0] === 'right')
            l = wnd.width();
        if (pmt[0] === 'center' || pmt[1] === 'center') {
            if (pmt[0] === 'left')
                l = -dropper[$.dropper.drp.actual]('outerWidth');
            if (pmt[0] === 'right')
                l = wnd.width();
            if (pmt[1] === 'top')
                t = -dropper[$.dropper.drp.actual]('outerHeight');
            if (pmt[1] === 'bottom')
                t = wnd.height();
        }
        dropper.css({
            'left': l + wnd.scrollLeft(), 'top': t + wnd.scrollTop()
        });
        if (pmt[0] === 'inherit')
            dropper.css({
                'left': $this.offset().left,
                'top': $this.offset().top + $this.outerHeight()
            });
        return this;
    });
    var _isScrollable = function (side) {
        if (!$.dropper.drp.existsN(this))
            return this;
        var el = this.get(0),
                x = el.clientWidth && el.scrollWidth > el.clientWidth,
                y = el.clientHeight && el.scrollHeight > el.clientHeight;
        return !side ? (!(el.style.overflow && el.style.overflow === 'hidden') && (x || y)) : (side === 'x' ? !(el.style.overflowX === 'hidden') && x : !(el.style.overflowY === 'hidden') && y);
    };
})(jQuery, jQuery(window));