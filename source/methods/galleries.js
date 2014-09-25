$.drop.methods._cIGalleries = function(rel) {
    var $ = jQuery;
    clearInterval($.drop.drp.autoPlayInterval[rel]);
    delete $.drop.drp.autoPlayInterval[rel];
};
$.drop.methods._galleriesDecorator = function(rel, btn, i) {
    var self = this,
            $ = jQuery;
    return $('[data-elrun][data-rel' + (rel ? '="' + rel + '"' : '') + '].' + $.drop.drp.activeClass).each(function() {
        var $this = $(this),
                drp = $this.data('drp');
        self._checkMethod(function() {
            self.galleries($this, drp, btn, i);
        });
    });
};
$.drop.methods.galleries = function(drop, opt, btn, i) {
    var $ = jQuery,
            doc = $(document),
            self = this,
            relA = $.drop.drp.galleries[opt.rel];
    if (!relA)
        return self;
    var relL = relA.length;
    if (relL <= 1)
        return self;
    var relP = $.inArray(opt.href, relA),
            prev = $.type(opt.prev) === 'string' ? drop.find(opt.prev) : opt.prev,
            next = $.type(opt.next) === 'string' ? drop.find(opt.next) : opt.next;
    prev.add(next).hide().attr('disabled', 'disabled');
    if (relP === -1)
        return false;
    if (!(relP !== relL - 1 || relP !== 0 || opt.cycle))
        return false;
    if (relP !== relL - 1)
        next.show().removeAttr('disabled');
    if (relP !== 0)
        prev.show().removeAttr('disabled');
    if (opt.cycle)
        prev.add(next).show().removeAttr('disabled');
    var _goto = function(i, e) {
        if (!relA[i]) {
            relP -= 1;
            return false;
        }
        var $next = $('[data-href="' + relA[i] + '"], [href="' + relA[i] + '"]').filter(':last');
        self._cIGalleries(opt.rel);
        self.open.call($next, $.extend($next.data('drp'), {href: relA[i], rel: opt.rel}), e);
    };
    var _getnext = function(i) {
        relP += i;
        if (opt.cycle) {
            if (relP >= relL)
                relP = 0;
            if (relP < 0)
                relP = relL - 1;
        }
        return relP;
    };
    prev.add(next).off('click.' + $.drop.nS).on('click.' + $.drop.nS, function(e) {
        e.stopPropagation();
        relP = $.inArray(opt.href, relA);
        self._cIGalleries(opt.rel);
        _goto(_getnext($(this).is(opt.prev) ? -1 : 1), e);
    });
    if (i !== undefined && i !== null && relP !== i && relA[i])
        _goto(i, null);
    if (btn)
        _goto(_getnext(btn === 1 ? 1 : -1), null);
    if (opt.autoPlay) {
        if ($.drop.drp.autoPlayInterval[opt.rel])
            self._cIGalleries(opt.rel);
        else
            $.drop.drp.autoPlayInterval[opt.rel] = setInterval(function() {
                self._cIGalleries(opt.rel);
                _goto(_getnext(1));
            }, opt.autoPlaySpeed);
    }
    drop.off('close.' + $.drop.nS).on('close.' + $.drop.nS, function() {
        self._cIGalleries($(this).data('drp').rel);
    });
    if (opt.rel && opt.keyNavigate)
        drop.off('after.' + $.drop.nS).on('after.' + $.drop.nS, function() {
            var opt = $(this).data('drp'),
                    ev = opt.drop ? opt.drop.replace($.drop.drp.reg, '') : '';
            doc.off('keydown.' + $.drop.nS + ev).on('keydown.' + $.drop.nS + ev, function(e) {
                var key = e.keyCode;
                if (key === 37 || key === 39)
                    e.preventDefault();
                if (key === 37)
                    $(opt.prev).trigger('click.' + $.drop.nS);
                if (key === 39)
                    $(opt.next).trigger('click.' + $.drop.nS);
            });
        });
    return self;
};