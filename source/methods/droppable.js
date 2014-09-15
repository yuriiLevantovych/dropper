$.drop.methods.droppable = function(drop) {
    var $ = jQuery,
            wnd = $(window),
            doc = $(document);
    return (drop || this).each(function() {
        var drop = $(this);
        drop.off('close.' + $.drop.nS).on('close.' + $.drop.nS, function() {
            var drop = $(this),
                    drp = drop.data('drp');
            if (drp.droppableIn)
                drp.positionDroppableIn = {'left': drop.css('left'), 'top': drop.css('top')};
        });
        drop.find('img').off('dragstart.' + $.drop.nS).on('dragstart.' + $.drop.nS, function(e) {
            e.preventDefault();
        });
        drop.off('mousedown.' + $.drop.nS).on('mousedown.' + $.drop.nS, function(e) {
            var drop = $(this),
                    drp = drop.data('drp');
            if ($(e.target).is(':input, button') || $.existsN($(e.target).closest('button')))
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
                    l = l + w < wndW ? l : wndW - w;
                    t = t + h < wndH ? t : wndH - h;
                }
                drop.css({
                    'left': l,
                    'top': t
                });
            });
        });
    });
};