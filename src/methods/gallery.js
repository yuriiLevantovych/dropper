jQuery(function () {
    (function ($, undefined) {
        var _galleryDecorator = function (rel, btn, i) {
            return $('[data-elrun][data-rel' + (rel ? '="' + rel + '"' : '') + '].' + $.dropper.drp.activeClass).each(function () {
                var $this = $(this),
                    drp = $this.data('drp');
                $.dropper.getMethods().gallery($this, drp, btn, i);
            });
        };
        var _cIGallery = function (rel) {
            var $ = jQuery;
            clearInterval($.dropper.drp.autoPlayInterval[rel]);
            delete $.dropper.drp.autoPlayInterval[rel];
        }
        $.dropper.setMethod('_cIGallery', _cIGallery);
        $.dropper.setMethod('gallery', function (dropper, opt, btn, i) {
            var $ = jQuery,
                doc = $(document),
                self = this,
                relA = $.dropper.drp.gallery[opt.rel];
            if (!relA)
                return self;
            var relL = relA.length;
            if (relL <= 1)
                return self;
            var relP = $.inArray(opt.href, relA),
                prev = $.type(opt.prev) === 'string' ? dropper.find(opt.prev) : opt.prev,
                next = $.type(opt.next) === 'string' ? dropper.find(opt.next) : opt.next;
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
            var _goto = function (i, e) {
                if (!relA[i]) {
                    relP -= 1;
                    return false;
                }
                var $next = $('[data-href="' + relA[i] + '"][rel="' + opt.rel + '"], [href="' + relA[i] + '"][rel="' + opt.rel + '"]');
                _cIGallery(opt.rel);
                self.open.call($next, $.extend({}, opt, $next.data('drp'), {
                    href: relA[i],
                    dropper: null
                }), e, false, true);
            };
            var _getnext = function (i) {
                relP += i;
                if (opt.cycle) {
                    if (relP >= relL)
                        relP = 0;
                    if (relP < 0)
                        relP = relL - 1;
                }
                return relP;
            };
            prev.add(next).off('click.' + $.dropper.nS).on('click.' + $.dropper.nS, function (e) {
                e.stopPropagation();
                relP = $.inArray(opt.href, relA);
                _cIGallery(opt.rel);
                _goto(_getnext($(this).is(prev) ? -1 : 1), e);
            });
            if (i !== undefined && i !== null && relP !== i && relA[i])
                _goto(i, null);
            if (btn)
                _goto(_getnext(btn === 1 ? 1 : -1), null);
            if (i === null)
                if (opt.autoPlay) {
                    opt.autoPlay = false;
                    _cIGallery(opt.rel);
                }
                else
                    opt.autoPlay = true;
            if (opt.autoPlay) {
                if ($.dropper.drp.autoPlayInterval[opt.rel])
                    _cIGallery(opt.rel);
                else
                    $.dropper.drp.autoPlayInterval[opt.rel] = setInterval(function () {
                        _cIGallery(opt.rel);
                        _goto(_getnext(1));
                    }, opt.autoPlaySpeed);
            }
            dropper.off('dropperClose.' + $.dropper.nS).on('dropperClose.' + $.dropper.nS, function () {
                _cIGallery($(this).data('drp').rel);
                doc.off('keydown.' + $.dropper.nS + opt.rel);
            });
            if (opt.keyNavigate)
                dropper.off('dropperAfter.' + $.dropper.nS).on('dropperAfter.' + $.dropper.nS, function () {
                    var opt = $(this).data('drp');
                    doc.off('keydown.' + $.dropper.nS + opt.rel).on('keydown.' + $.dropper.nS + opt.rel, function (e) {
                        var key = e.keyCode;
                        if (key === 37 || key === 39) //that window scrollLeft nochange after press left & right buttons
                            e.preventDefault();
                        if (key === 37)
                            _goto(_getnext(-1), e);
                        if (key === 39)
                            _goto(_getnext(1), e);
                    });
                });
            return self;
        });
        $.dropper.next = function (rel) {
            return _galleryDecorator(rel, 1);
        };
        $.dropper.prev = function (rel) {
            return _galleryDecorator(rel, -1);
        };
        $.dropper.jumpto = function (i, rel) {
            return _galleryDecorator(rel, null, i);
        };
        $.dropper.play = function (rel) {
            return _galleryDecorator(rel, null, null);
        };
    })(jQuery);
});