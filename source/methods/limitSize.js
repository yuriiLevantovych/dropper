$.drop.setMethod('_heightContent', function(drop) {
    var $ = jQuery,
            wnd = $(window);
    return (drop || this).each(function() {
        var drop = $(this),
                drp = drop.data('drp');
        if (!drp.limitSize)
            return false;
        var dropV = drop.is(':visible'),
                forCenter = drp.forCenter;
        if (!dropV) {
            drop.show();
            if (forCenter)
                forCenter.show();
        }

        if (drp.placeContent) {
            var el = drop.find($(drp.placeContent)).filter(':visible');
            if (el.data('jsp'))
                el.data('jsp').destroy();
            el = drop.find($(drp.placeContent)).filter(':visible').css({'height': ''});
            var pP = el.find(drp.placePaste).css('height', '').removeClass('drop-is-scroll');
            if ($.existsN(el)) {
                var refer = drp.elrun,
                        api = false,
                        elCH = el.css({'overflow': ''}).outerHeight();
                if (drp.scroll) {
                    if ($.fn.jScrollPane) {
                        api = el.jScrollPane(drp.jScrollPane).data('jsp');
                        if ($.existsN(el.find('.jspPane')))
                            elCH = el.find('.jspPane').outerHeight();
                    }
                    else
                        el.css('overflow', 'auto');
                }
                else
                    el.css('overflow', 'hidden');
                var dropH = drop.outerHeight(),
                        dropHm = drop.height(),
                        footerHeader = drop.find($(drp.placeHeader)).outerHeight() + drop.find($(drp.placeFooter)).outerHeight(),
                        h;
                if (drp.place === 'global') {
                    var mayHeight = 0,
                            placement = drp.placement;
                    if ($.type(placement) === 'object') {
                        if (placement.top !== undefined)
                            mayHeight = placement.bottom - wnd.scrollTop() - footerHeader - (dropH - dropHm);
                        if (placement.bottom !== undefined)
                            mayHeight = wnd.height() - placement.top + wnd.scrollTop() - footerHeader - (dropH - dropHm);
                    }
                    else {
                        if (placement.search(/top/) >= 0)
                            mayHeight = refer.offset().top - wnd.scrollTop() - footerHeader - (dropH - dropHm);
                        if (placement.search(/bottom/) >= 0)
                            mayHeight = wnd.height() - refer.offset().top + wnd.scrollTop() - footerHeader - (dropH - dropHm) - refer.outerHeight();
                    }
                    if (mayHeight > elCH)
                        h = elCH;
                    else
                        h = mayHeight;
                }
                else {
                    if (elCH + footerHeader > dropHm)
                        h = dropHm - footerHeader;
                    else
                        h = elCH;
                }
                el.css('height', h);
                if (!drp.scroll) {
                    var pPOH = pP.outerHeight(),
                            pPH = pP.height();
                    el.find(drp.placePaste).addClass('drop-is-scroll').css('height', h - pPOH + pPH);
                }
                if (api)
                    api.reinitialise();
            }
        }
        if (!dropV) {
            drop.hide();
            if (forCenter)
                forCenter.hide();
        }
    });
});
$.drop.setMethod('limitSize', function(drop) {
    var self = this,
            $ = jQuery,
            wnd = $(window);
    return drop.each(function() {
        var drop = $(this),
                drp = drop.data('drp');
        if (drp.limitSize && drp.place === 'center') {
            var dropV = drop.is(':visible');
            if (!dropV) {
                drop.show();
                if (drp.forCenter)
                    drp.forCenter.show();
            }
            drop.css({
                'width': '',
                'height': ''
            });
            if (drp.placeContent) {
                var el = drop.find($(drp.placeContent)).filter(':visible');
                if (el.data('jsp'))
                    el.data('jsp').destroy();
                drop.find($(drp.placeContent)).filter(':visible').css({'height': ''});
            }
            var wndW = wnd.width(),
                    wndH = wnd.height(),
                    w = drop.outerWidth(),
                    h = drop.outerHeight(),
                    ws = drop.width(),
                    hs = drop.height();
            if (w > wndW)
                drop.css('width', wndW - w + ws);
            if (h > wndH)
                drop.css('height', wndH - h + hs);
            if (!dropV) {
                drop.hide();
                if (drp.forCenter)
                    drp.forCenter.hide();
            }
        }
        self._checkMethod(function() {
            self._heightContent(drop);
        });
    });
});