jQuery.dropper.setMethod('droppable', function(dropper, undefined) {
    var $ = jQuery,
            wnd = $(window),
            doc = $(document);
    return (dropper || this).each(function() {
        var dropper = $(this);
        dropper.off('dropperClose.' + $.dropper.nS).on('dropperClose.' + $.dropper.nS, function() {
            $(this).off('mousedown.' + $.dropper.nS);
        });
        dropper.find('img').off('dragstart.' + $.dropper.nS).on('dragstart.' + $.dropper.nS, function(e) {
            e.preventDefault();
        });
        wnd.off('scroll.droppable' + $.dropper.nS);
        dropper.on('mousedown.' + $.dropper.nS, function(e) {
            var dropper = $(this),
                    drp = dropper.data('drp');
            if ($(e.target).is(':input, button') || $.dropper.drp.existsN($(e.target).closest('button')))
                return false;
            var dropper = $(this),
                    w = dropper.outerWidth(),
                    h = dropper.outerHeight(),
                    wndW = wnd.width(),
                    wndH = wnd.height();
            if ((w > wndW || h > wndH) && drp.droppableLimit)
                return false;
            doc.on('mouseup.' + $.dropper.nS, function(e) {
                dropper.css('cursor', '');
                doc.off('selectstart.' + $.dropper.nS + ' mousemove.' + $.dropper.nS + ' mouseup.' + $.dropper.nS);
                if (drp.droppableFixed) {
                    $.dropper.drp.scrollTopD = wnd.scrollTop();
                    drp.top = parseInt(dropper.css('top'));
                    wnd.on('scroll.droppable' + $.dropper.nS, function(e) {
                        var n = wnd.scrollTop(),
                                top = drp.top - $.dropper.drp.scrollTopD + n;
                        dropper.css('top', top);
                        drp.top = top;
                        $.dropper.drp.scrollTopD = n;
                    });
                }
            });
            var left = e.pageX - dropper.offset().left,
                    top = e.pageY - dropper.offset().top;
            dropper.css('cursor', 'move');
            doc.off('selectstart.' + $.dropper.nS).on('selectstart.' + $.dropper.nS, function(e) {
                e.preventDefault();
            });
            doc.off('mousemove.' + $.dropper.nS).on('mousemove.' + $.dropper.nS, function(e) {
                e.preventDefault();
                drp.droppableIn = true;
                var l = e.pageX - left,
                        t = e.pageY - top;
                if (drp.droppableLimit) {
                    l = l < 0 ? 0 : l;
                    t = t < 0 ? 0 : t;
                    l = l + w < wndW + wnd.scrollLeft() ? l : wndW - w;
                    t = t + h < wndH + wnd.scrollTop() ? t : wndH - h + wnd.scrollTop();
                    l = l < wnd.scrollLeft() ? wnd.scrollLeft() : l;
                    t = t < wnd.scrollTop() ? wnd.scrollTop() : t;
                }
                dropper.css({
                    'left': l,
                    'top': t
                });
            });
        });
    });
});