$.drop.setMethod('placeBeforeShow', function(drop, $this, opt) {
    var self = this,
            $ = jQuery,
            wnd = $(window);

    if (opt.place === 'inherit')
        return false;

    if (!self._isScrollable($('body').get(0)))
        $('body').css('overflow', 'hidden');
    $('body').css('overflow-x', 'hidden');

    var pmt = opt.placeBeforeShow.toLowerCase().split(' '),
            t = -drop.actual('outerHeight'),
            l = -drop.actual('outerWidth');
    if (pmt[0] === 'center' || pmt[1] === 'center') {
        self._checkMethod(function() {
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
            'top': $this.offset().top
        });
    return this;
});