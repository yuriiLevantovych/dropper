$.drop.setMethod('_heightContent', function (drop) {
    var $ = jQuery,
            wnd = $(window);
    return (drop || this).each(function (k) {
        var drop = $(this),
                drp = drop.data('drp');
        if (!drp.limitSize)
            return false;
        var dropV = drop.is(':visible');
        if (!dropV)
            drop.show();

        if (drp.placeContent) {
            var el = drop.find($(drp.placeContent)).filter(':visible');
            if (el.data('jsp'))
                el.data('jsp').destroy();
            el = drop.find($(drp.placeContent)).filter(':visible').css({'height': ''});
            var pP = el.find(drp.placePaste).css('height', '');
            if ($.existsN(el)) {
                var refer = drp.elrun,
                        api = false,
                        elCH = el.css({'overflow': ''}).outerHeight();
                if (drp.scrollContent) {
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
                if (elCH > h && drp.scrollContent)
                    drop.addClass($.drop.drp.pC + 'is-scroll');

                el.css('height', h);
                if (k !== true)
                    arguments.callee.call(drop, true); // for correct size content of popup if in style change size other elements if set class 'drop-is-scroll' 
                if (!drp.scrollContent) {
                    var pPOH = pP.outerHeight(),
                            pPH = pP.height();
                    el.find(drp.placePaste).css('height', h - pPOH + pPH);
                }
                if (api)
                    api.reinitialise();
            }
        }
        if (!dropV)
            drop.hide();
    });
});
$.drop.setMethod('limitSize', function (drop) {
    var self = this,
            $ = jQuery,
            wnd = $(window);
    return drop.each(function () {
        var drop = $(this),
                drp = drop.data('drp');
        if (drp.limitSize && drp.place === 'center') {
            var dropV = drop.is(':visible');
            if (!dropV)
                drop.show();
            drop.css({
                'width': '',
                'height': ''
            });
            if (drp.placeContent) {
                var jsp = drop.find($(drp.placeContent)).filter(':visible').data('jsp');
                if (jsp)
                    jsp.destroy();
                drop.removeClass($.drop.drp.pC + 'is-scroll').find(drp.placeContent).add(drop.find(drp.placePaste)).filter(':visible').css({'height': ''});
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
            if (!dropV)
                drop.hide();
        }
        if (drp.place !== 'inherit')
            self._checkMethod(function () {
                self._heightContent(drop);
            });
    });
});