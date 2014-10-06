$.drop.setMethod('placeAfterClose', function (drop, $this, opt) {
    var $ = jQuery,
            wnd = $(window);
    if (opt.place === 'inherit' || !opt.placeAfterClose)
        return false;
    if (!this._isScrollable($('body').get(0)))
        $('body').css('overflow', 'hidden');
    $('body').css('overflow-x', 'hidden');
    if (!opt)
        return this;
    var pmt = opt.placeAfterClose.toLowerCase().split(' '),
            t = -drop.actual('outerHeight'),
            l = -drop.actual('outerWidth');
    if (pmt[1] === 'bottom')
        t = wnd.height();
    if (pmt[0] === 'right')
        l = wnd.width();
    if (pmt[0] === 'center' || pmt[1] === 'center') {
        if (pmt[0] === 'left') {
            l = -drop.actual('outerWidth');
            t = drop.css('top');
        }
        if (pmt[0] === 'right') {
            l = wnd.width();
            t = drop.css('top');
        }
        if (pmt[1] === 'top') {
            t = -drop.actual('outerHeight');
            l = drop.css('left');
        }
        if (pmt[1] === 'bottom') {
            t = wnd.height();
            l = drop.css('left');
        }
    }
    if (opt.placeAfterClose !== 'center center') {
        if (pmt[0] === 'inherit') {
            t = $this.offset().left;
            l = $this.offset().top;
        }
        else {
            t += wnd.scrollTop();
            l += wnd.scrollLeft();
        }
        drop.animate({
            'left': l,
            'top': t
        }, {
            queue: false,
            duration: opt.durationOff
        });
    }
    return this;
});