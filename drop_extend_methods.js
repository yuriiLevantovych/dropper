(function($, wnd, doc) {
    $.drop.extendDrop = function() {
        var addmethods = {
            droppable: function(drop) {
                return (drop || this).each(function() {
                    var drop = $(this);
                    drop.find('img').off('dragstart.' + $.drop.nS).on('dragstart.' + $.drop.nS, function(e) {
                        e.preventDefault();
                    });
                    drop.off('mousedown.' + $.drop.nS).on('mousedown.' + $.drop.nS, function(e) {
                        if (!$(e.target).is(':input')) {
                            doc.on('mouseup.' + $.drop.nS, function(e) {
                                drop.css('cursor', '');
                                doc.off('selectstart.' + $.drop.nS + ' mousemove.' + $.drop.nS + ' mouseup.' + $.drop.nS);
                            });
                            var $this = $(this).css('cursor', 'move'),
                                    left = e.pageX - $this.offset().left,
                                    top = e.pageY - $this.offset().top,
                                    w = $this.outerWidth(),
                                    h = $this.outerHeight(),
                                    wndW = wnd.width(),
                                    wndH = wnd.height();
                            doc.on('selectstart.' + $.drop.nS, function(e) {
                                e.preventDefault();
                            });
                            doc.on('mousemove.' + $.drop.nS, function(e) {
                                drop.data('drp').droppableIn = true;
                                var l = e.pageX - left,
                                        t = e.pageY - top;
                                if (!drop.data('drp').droppableLimit) {
                                    l = l < 0 ? 0 : l;
                                    t = t < 0 ? 0 : t;

                                    l = l + w < wndW ? l : wndW - w;
                                    t = t + h < wndH ? t : wndH - h;
                                }
                                $this.css({
                                    'left': l,
                                    'top': t
                                });
                            });
                        }
                    });
                });
            },
            noinherit: function(e, start) {
                return this.each(function() {
                    var drop = $(this),
                            drp = drop.data('drp');
                    if (drp && !drp.droppableIn) {
                        var method = drp.animate && !start ? 'animate' : 'css',
                                placement = drp.placement,
                                $this = drp.elrun,
                                t = 0,
                                l = 0,
                                $thisW = $this.width(),
                                $thisH = $this.height(),
                                dropW = +drop.actual('width'),
                                dropH = +drop.actual('height'),
                                $thisT = 0,
                                $thisL = 0;

                        if (drp.context && e !== undefined)
                            drp.placement = placement = {'left': parseInt(e.pageX), 'top': parseInt(e.pageY)};

                        if (typeof placement === 'object') {
                            if (placement.left + dropW > wnd.width())
                                placement.left -= dropW;
                            if (placement.top + dropH > wnd.height()) {
                                placement.top -= dropH;
                            }
                            drop[method](placement, {
                                duration: drp.durationOn,
                                queue: false
                            });
                        }
                        else {
                            var $thisPMT = placement.toLowerCase().split(' ');
                            if ($thisPMT[0] === 'bottom' || $thisPMT[1] === 'bottom')
                                t = -drop.actual('outerHeight');
                            if ($thisPMT[0] === 'top' || $thisPMT[1] === 'top')
                                t = $thisH;
                            if ($thisPMT[0] === 'left' || $thisPMT[1] === 'left')
                                l = 0;
                            if ($thisPMT[0] === 'right' || $thisPMT[1] === 'right')
                                l = -dropW - $thisW;
                            if ($thisPMT[0] === 'center')
                                l = -dropW / 2 + $thisW / 2;
                            if ($thisPMT[1] === 'center')
                                t = -dropH / 2 + $thisH / 2;
                            $thisT = $this.offset().top + t;
                            $thisL = $this.offset().left + l;
                            if ($thisL < 0)
                                $thisL = 0;
                            drop[method]({
                                'bottom': 'auto',
                                'top': $thisT,
                                'left': $thisL
                            }, {
                                duration: drp.durationOn,
                                queue: false
                            });
                        }
                    }
                });
            },
            _heightContent: function(drop) {
                return (drop || this).each(function() {
                    function _setHeight(h) {
                        return this.css('height', h > drp.minHeightContent ? h : drp.minHeightContent);
                    }
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

                            if (drp.place === 'noinherit') {
                                var mayHeight = 0,
                                        placement = drp.placement;
                                if (typeof placement === 'object') {
                                    if (placement.top !== undefined)
                                        mayHeight = wnd.height() - placement.top - footerHeader - (dropH - dropHm);
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
                                    _setHeight.call(el, elCH);
                                else
                                    _setHeight.call(el, mayHeight);
                            }
                            else {
                                if (elCH + footerHeader > dropHm)
                                    _setHeight.call(el, dropHm - footerHeader);
                                else
                                    _setHeight.call(el, elCH);
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
            },
            limitSize: function(drop) {
                var self = this;
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
            },
            _cIGalleries: function(rel) {
                clearInterval($.drop.drp.autoPlayInterval[rel]);
                delete $.drop.drp.autoPlayInterval[rel];
            },
            galleries: function(drop, opt, btn, i) {
                var relA = $.drop.drp.galleries[opt.rel],
                        self = this;

                if (!relA)
                    return false;

                var relL = relA.length,
                        relP = $.inArray(opt.source ? opt.source : drop.find(opt.placePaste).find('img').attr('src'), relA),
                        prev = drop.find(opt.prev),
                        next = drop.find(opt.next);
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
                    next.add(prev).show().removeAttr('disabled');

                function _goto(i, e) {
                    if (!relA[i]) {
                        relP -= 1;
                        return false;
                    }
                    var $next = $('[data-source="' + relA[i] + '"][rel], [href="' + relA[i] + '"][rel]').filter(':last');
                    
                    self.close.call(drop, e, function() {
                        self._cIGalleries(opt.rel);
                        self.open.call($next, $.extend($next.data('drp'), {source: relA[i], drop: null, rel: opt.rel}));
                    }, true);
                }
                function _getnext(i) {
                    relP += i;
                    if (opt.cycle) {
                        if (relP >= relL)
                            relP = 0;
                        if (relP < 0)
                            relP = relL - 1;
                    }
                    return relP;
                }

                prev.add(next).attr('data-rel', opt.rel).off('click.' + $.drop.nS).on('click.' + $.drop.nS, function(e) {
                    e.stopPropagation();
                    self._cIGalleries(opt.rel);
                    var $this = $(this).attr('disabled', 'disabled');

                    _goto(_getnext($this.is(opt.prev) ? -1 : 1), e);
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

                return self;
            },
            placeBeforeShow: function(drop, $this, place, placeBeforeShow, e) {
                var self = this;
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
                        self[place].call(drop, e, true);
                    });
                    t = drop.css('top');
                    l = drop.css('left');
                }
                if (pmt[0] === 'bottom' || pmt[1] === 'bottom')
                    t = wnd.height();
                if (pmt[0] === 'right' || pmt[1] === 'right')
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
            },
            placeAfterClose: function(drop, $this, opt) {
                if (!this._isScrollable($('body').get(0)))
                    $('body').css('overflow', 'hidden');
                $('body').css('overflow-x', 'hidden');
                var
                        method = opt.animate ? 'animate' : 'css',
                        pmt = opt.placeAfterClose.toLowerCase().split(' '),
                        t = -drop.actual('outerHeight'),
                        l = -drop.actual('outerWidth');
                if (pmt[0] === 'bottom' || pmt[1] === 'bottom')
                    t = wnd.height();
                if (pmt[0] === 'right' || pmt[1] === 'right')
                    l = wnd.width();
                if (pmt[0] === 'center' || pmt[1] === 'center') {
                    if (pmt[0] === 'left') {
                        l = -drop.actual('outerWidth');
                        t = drop.css('top');
                    }
                    if (pmt[0] === 'right') {
                        l = wnd.width();
                        t = drop.css('top');
                    }
                    if (pmt[1] === 'top') {
                        t = -drop.actual('outerHeight');
                        l = drop.css('left');
                    }
                    if (pmt[1] === 'bottom') {
                        t = wnd.height();
                        l = drop.css('left');
                    }
                }
                if (pmt[0] !== 'center' || pmt[1] !== 'center')
                    drop.stop()[method]({
                        'top': t,
                        'left': l
                    }, {
                        queue: false,
                        duration: opt.durationOff
                    });
                if (pmt[0] === 'inherit')
                    drop.stop()[method]({
                        'left': $this.offset().left,
                        'top': $this.offset().top
                    }, {
                        queue: false,
                        duration: opt.durationOff
                    });
                return this;
            },
            confirmPrompt: function(opt, hashChange, _confirmF, e) {
                var self = this;
                if (opt.confirm) {
                    if (!$.exists('[data-drop="' + opt.confirmBtnDrop + '"]'))
                        var confirmBtn = $('<div><button data-drop="' + opt.confirmBtnDrop + '"></button></div>').appendTo($('body')).hide().children();
                    else
                        confirmBtn = $('[data-drop="' + opt.confirmBtnDrop + '"]');
                    confirmBtn.data({
                        'drop': opt.confirmBtnDrop,
                        'confirm': true
                    });
                    $.extend(opt, confirmBtn.data());
                    if (!$.exists(opt.confirmBtnDrop))
                        var drop = self._pasteDrop($.extend({}, opt, confirmBtn.data()), opt.patternConfirm);
                    else
                        drop = self._pasteDrop($.extend({}, opt, confirmBtn.data()), $(opt.confirmBtnDrop));

                    self._show.call(confirmBtn, drop, e, opt, hashChange);

                    $(opt.confirmActionBtn).off('click.' + $.drop.nS).on('click.' + $.drop.nS, function(e) {
                        e.stopPropagation();
                        opt.drop = null;
                        self.close.call($(opt.confirmBtnDrop), e, _confirmF, null);
                    });
                }
                if (opt.prompt) {
                    if (!$.exists('[data-drop="' + opt.promptBtnDrop + '"]'))
                        var promptBtn = $('<div><button data-drop="' + opt.promptBtnDrop + '"></button></div>').appendTo($('body')).hide().children();
                    else
                        promptBtn = $('[data-drop="' + opt.promptBtnDrop + '"]');
                    promptBtn.data({
                        'drop': opt.promptBtnDrop,
                        'prompt': true,
                        'promptInputValue': opt.promptInputValue
                    });
                    $.extend(opt, promptBtn.data());
                    if (!$.exists(opt.promptBtnDrop))
                        var drop = self._pasteDrop($.extend({}, opt, promptBtn.data()), opt.patternPrompt);
                    else
                        drop = self._pasteDrop($.extend({}, opt, promptBtn.data()), $(opt.promptBtnDrop));

                    self._show.call(promptBtn, drop, e, opt, hashChange);

                    $(opt.promptActionBtn).off('click.' + $.drop.nS).on('click.' + $.drop.nS, function(e) {
                        e.stopPropagation();
                        function getUrlVars(url) {
                            var hash, myJson = {}, hashes = url.slice(url.indexOf('?') + 1).split('&');
                            for (var i = 0; i < hashes.length; i++) {
                                hash = hashes[i].split('=');
                                myJson[hash[0]] = hash[1];
                            }
                            return myJson;
                        }

                        opt.dataPrompt = getUrlVars($(this).closest('form').serialize());
                        opt.drop = null;
                        self.close.call($(opt.promptBtnDrop), e, _confirmF, null);
                    });
                }
                return this;
            },
            require: {
                limitSize: ['_heightContent'],
                galleries: ['_cIGalleries']
            }
        };
        var newMethods = {};
        for (var i = 0, length = arguments.length; i < length; i++)
            if (arguments[i] in addmethods) {
                newMethods[arguments[i]] = addmethods[arguments[i]];
                if (addmethods.require[arguments[i]])
                    addmethods.require[arguments[i]].map(function(n, i) {
                        newMethods[n] = addmethods[n];
                    });
            }
        return this.setMethods(newMethods);
    };
})(jQuery, $(window), $(document));