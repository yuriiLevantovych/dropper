$.drop.setMethod('placeBeforeShow', function (drop, $this, opt) {
    var self = this,
            $ = jQuery,
            wnd = $(window);

    if (opt.place === 'inherit')
        return false;

    if (!this._isScrollable.call($('body'), 'y'))
        $('body').css('overflow-y', 'hidden');
    if (!this._isScrollable.call($('body'), 'x'))
        $('body').css('overflow-x', 'hidden');

    var pmt = opt.placeBeforeShow.toLowerCase().split(' '),
            t = -drop.actual('outerHeight'),
            l = -drop.actual('outerWidth');
    if (pmt[0] === 'center' || pmt[1] === 'center') {
        self._checkMethod(function () {
            self[opt.place].call(drop, true);
        });
        t = drop.css('top');
        l = drop.css('left');
    }
    if (pmt[1] === 'bottom')
        t = wnd.height();
    if (pmt[0] === 'right')
        l = wnd.width();
    if (pmt[0] === 'center' || pmt[1] === 'center') {
        if (pmt[0] === 'left')
            l = -drop.actual('outerWidth');
        if (pmt[0] === 'right')
            l = wnd.width();
        if (pmt[1] === 'top')
            t = -drop.actual('outerHeight');
        if (pmt[1] === 'bottom')
            t = wnd.height();
    }
    drop.css({
        'left': l + wnd.scrollLeft(), 'top': t + wnd.scrollTop()
    });
    if (pmt[0] === 'inherit')
        drop.css({
            'left': $this.offset().left,
            'top': $this.offset().top + $this.outerHeight()
        });
    return this;
});
if (!$.drop.methods._isScrollable)
    $.drop.setMethod('_isScrollable', function (side) {
        if (!$.existsN(this))
            return this;
        var el = this.get(0),
                x = el.clientWidth && el.scrollWidth > el.clientWidth,
                y = el.clientHeight && el.scrollHeight > el.clientHeight;
        return !side ? (!(el.style.overflow && el.style.overflow === 'hidden') && (x || y)) : (side === 'x' ? !(el.style.overflowX === 'hidden') && x : !(el.style.overflowY === 'hidden') && y);
    });