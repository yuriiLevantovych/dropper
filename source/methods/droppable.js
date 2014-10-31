$.drop.setMethod('droppable', function(drop) {
    var $ = jQuery,
            wnd = $(window),
            doc = $(document);
    return (drop || this).each(function() {
        var drop = $(this);
        drop.on('close.' + $.drop.nS, function() {
            $(this).off('mousedown.' + $.drop.nS);
        });
        drop.find('img').off('dragstart.' + $.drop.nS).on('dragstart.' + $.drop.nS, function(e) {
            e.preventDefault();
        });
        wnd.off('scroll.droppable' + $.drop.nS);
        drop.off('mousedown.' + $.drop.nS).on('mousedown.' + $.drop.nS, function(e) {
            var drop = $(this),
                    drp = drop.data('drp');
            if ($(e.target).is(':input, button') || $.drop.drp.existsN($(e.target).closest('button')))
                return false;
            var drop = $(this),
                    w = drop.outerWidth(),
                    h = drop.outerHeight(),
                    wndW = wnd.width(),
                    wndH = wnd.height();
            if ((w > wndW || h > wndH) && drp.droppableLimit)
                return false;
            doc.on('mouseup.' + $.drop.nS, function(e) {
                drop.css('cursor', '');
                doc.off('selectstart.' + $.drop.nS + ' mousemove.' + $.drop.nS + ' mouseup.' + $.drop.nS);
                if (drp.droppableFixed) {
                    $.drop.drp.scrollTopD = wnd.scrollTop();
                    drp.top = parseInt(drop.css('top'));
                    wnd.on('scroll.droppable' + $.drop.nS, function(e) {
                        var n = wnd.scrollTop(),
                                top = drp.top - $.drop.drp.scrollTopD + n;
                        drop.css('top', top);
                        drp.top = top;
                        $.drop.drp.scrollTopD = n;
                    });
                }
            });
            var left = e.pageX - drop.offset().left,
                    top = e.pageY - drop.offset().top;
            drop.css('cursor', 'move');
            doc.on('selectstart.' + $.drop.nS, function(e) {
                e.preventDefault();
            });
            doc.on('mousemove.' + $.drop.nS, function(e) {
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
                drop.css({
                    'left': l,
                    'top': t
                });
            });
        });
    });
});