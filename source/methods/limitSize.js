$.drop.methods._heightContent = function(drop) {
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

        if (drp.dropContent) {
            var el = drop.find($(drp.dropContent)).filter(':visible');
            if (el.data('jsp'))
                el.data('jsp').destroy();
            el = drop.find($(drp.dropContent)).filter(':visible').css({'height': ''});
            if ($.existsN(el)) {
                var refer = drp.elrun,
                        api = false,
                        elCH = el.css({'overflow': ''}).outerHeight();
                if ($.fn.jScrollPane) {
                    api = el.jScrollPane(drp.jScrollPane).data('jsp');
                    if ($.existsN(el.find('.jspPane')))
                        elCH = el.find('.jspPane').outerHeight();
                }
                else
                    el.css('overflow', 'auto');
                var dropH = drop.outerHeight(),
                        dropHm = drop.height(),
                        footerHeader = drop.find($(drp.dropHeader)).outerHeight() + drop.find($(drp.dropFooter)).outerHeight();
                if (drp.place === 'global') {
                    var mayHeight = 0,
                            placement = drp.placement;
                    if ($.type(placement) === 'object') {
                        if (placement.top !== undefined)
                            mayHeight = wnd.height() - placement.top + wnd.scrollTop() - footerHeader - (dropH - dropHm);
                        if (placement.bottom !== undefined)
                            mayHeight = placement.bottom - footerHeader - (dropH - dropHm);
                    }
                    else {
                        if (placement.search(/top/) >= 0)
                            mayHeight = wnd.height() - refer.offset().top - footerHeader - refer.outerHeight() - (dropH - dropHm);
                        if (placement.search(/bottom/) >= 0)
                            mayHeight = refer.offset().top - footerHeader - (dropH - dropHm);
                    }
                    if (mayHeight > elCH)
                        el.css('height', elCH);
                    else
                        el.css('height', mayHeight);
                }
                else {
                    if (elCH + footerHeader > dropHm)
                        el.css('height', dropHm - footerHeader);
                    else
                        el.css('height', elCH);
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
};
$.drop.methods.limitSize = function(drop) {
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
            if (drp.dropContent) {
                var el = drop.find($(drp.dropContent)).filter(':visible');
                if (el.data('jsp'))
                    el.data('jsp').destroy();
                drop.find($(drp.dropContent)).filter(':visible').css({'height': ''});
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
};