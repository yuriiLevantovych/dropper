$.drop.methods.placeBeforeShow = function(drop, $this, place, placeBeforeShow, e) {
    var self = this,
            $ = jQuery,
            wnd = $(window);

    if (!self._isScrollable($('body').get(0)))
        $('body').css('overflow', 'hidden');
    $('body').css('overflow-x', 'hidden');

    if (place === 'inherit')
        return false;
    var pmt = placeBeforeShow.toLowerCase().split(' '),
            t = -drop.actual('outerHeight'),
            l = -drop.actual('outerWidth');
    if (pmt[0] === 'center' || pmt[1] === 'center') {
        self._checkMethod(function() {
            self[place].call(drop, true);
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
        'left': l, 'top': t
    });
    if (pmt[0] === 'inherit')
        drop.css({
            'left': $this.offset().left,
            'top': $this.offset().top
        });
    return this;
};