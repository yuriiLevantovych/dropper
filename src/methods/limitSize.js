jQuery.dropper.setMethod('_heightContent', function (dropper, undefined) {
    var self = this,
        $ = jQuery,
        wnd = $(window);
    return (dropper || this).each(function (k) {
        var dropper = $(this),
            drp = dropper.data('drp');
        if (drp.place === 'inherit')
            return;
        if (!drp.limitSize)
            return;
        var dropperV = dropper.is(':visible');
        if (!dropperV)
            dropper.show();

        if (drp.placeContent) {
            var el = dropper.find($(drp.placeContent)).filter(':visible');
            if (el.data('jsp'))
                el.data('jsp').destroy();
            el = dropper.find($(drp.placeContent)).filter(':visible').css({'height': ''});
            var pP = el.find(drp.placePaste).css('height', '');
            if ($.dropper.drp.existsN(el)) {
                var refer = drp.elrun,
                    api = false,
                    elCH = el.css({'overflow': ''}).outerHeight();
                if (drp.scrollContent) {
                    if ($.fn.jScrollPane) {
                        api = el.jScrollPane(drp.jScrollPane).data('jsp');
                        if ($.dropper.drp.existsN(el.find('.jspPane')))
                            elCH = el.find('.jspPane').outerHeight();
                    }
                    else
                        el.css('overflow', 'auto');
                }
                else
                    el.css('overflow', 'hidden');
                var dropperH = dropper.outerHeight(),
                    dropperHm = dropper.height(),
                    footerHeader = dropper.find($(drp.placeHeader)).outerHeight() + dropper.find($(drp.placeFooter)).outerHeight(),
                    h;
                if (drp.place === 'global') {
                    var mayHeight = 0,
                        placement = drp.placement;
                    if ($.type(placement) === 'object') {
                        if (placement.top !== undefined)
                            mayHeight = placement.bottom - wnd.scrollTop() - footerHeader - (dropperH - dropperHm);
                        if (placement.bottom !== undefined)
                            mayHeight = wnd.height() - placement.top + wnd.scrollTop() - footerHeader - (dropperH - dropperHm);
                    }
                    else {
                        if (placement.search(/top/) >= 0)
                            mayHeight = refer.offset().top - wnd.scrollTop() - footerHeader - (dropperH - dropperHm);
                        if (placement.search(/bottom/) >= 0)
                            mayHeight = wnd.height() - refer.offset().top + wnd.scrollTop() - footerHeader - (dropperH - dropperHm) - refer.outerHeight();
                    }
                    if (mayHeight > elCH)
                        h = elCH;
                    else
                        h = mayHeight;
                }
                else {
                    if (elCH + footerHeader > dropperHm || drp.isFullScreen)
                        h = dropperHm - footerHeader;
                    else
                        h = elCH;
                }
                if (elCH > h && drp.scrollContent)
                    dropper.addClass($.dropper.drp.pC + 'is-scroll');
                el.css('height', h);
                if (!drp.scrollContent)
                    el.find(drp.placePaste).css('height', h - pP.outerHeight() + pP.height());
                if (api)
                    api.reinitialise();
                if (k !== true) { // for correct size content of popup if in style change size other elements if set class 'dropper-is-scroll'
                    arguments.callee.call(dropper, true);
                    self._limit(dropper, drp, true);
                }
            }
        }
        if (!dropperV)
            dropper.hide();
    });
});
jQuery.dropper.setMethod('limitSize', function (dropper, undefined) {
    var self = this,
        $ = jQuery;
    return dropper.each(function () {
        var dropper = $(this).removeClass($.dropper.drp.pC + 'is-limit-size'),
            drp = dropper.data('drp');

        self._limit(dropper, drp);

        self._checkMethod(function () {
            self._heightContent(dropper);
        });
    });
});
jQuery.dropper.setMethod('_limit', function (dropper, drp, add, undefined) {
    var wnd = $(window);
    if (drp.type === 'image')
        var img = dropper.find(drp.placePaste).children('img').css({'max-width': '', 'max-height': ''});
    if (drp.limitSize && drp.place === 'center') {
        dropper.css({
            width: '',
            height: ''
        });
        if (drp.placeContent && !add) {
            var jsp = dropper.find($(drp.placeContent)).filter(':visible').data('jsp');
            if (jsp)
                jsp.destroy();
            dropper.removeClass($.dropper.drp.pC + 'is-scroll').find(drp.placeContent).add(dropper.find(drp.placePaste)).filter(':visible').css('height', '');
        }
        dropper.addClass($.dropper.drp.pC + 'is-limit-size');
        if (drp.type === 'image' && !drp.scrollContent)
            img.css({'max-width': '100%', 'max-height': '100%'});
        var wndW = wnd.width(),
            wndH = wnd.height(),
            w = dropper[$.dropper.drp.actual]('outerWidth'),
            h = dropper[$.dropper.drp.actual]('outerHeight'),
            ws = dropper[$.dropper.drp.actual]('width'),
            hs = dropper[$.dropper.drp.actual]('height');
        if (w > wndW)
            dropper.css('width', wndW - w + ws);
        if (h > wndH)
            dropper.css('height', wndH - h + hs);
    }
});