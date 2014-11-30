(function ($, wnd, doc) {
    var methods = {
        init: function (options) {
            var set = $.extend({}, DP, options);
            if (!D.existsN(this))
                throw 'this object is not exists';
            return this.each(function () {
                var el = methods.destroy.call($(this)),
                        opt = $.extend({}, set, el.data());
                el.data('drp', opt);
                var href = $.trim(el.attr('href') || opt.href);
                opt.href = href && href.indexOf('#') === 0 ? null : href;
                opt.hash = /#.+?$/.test(href) ? href.match(/(#.+?$)/g)[0] : opt.hash;
                opt.rel = $.trim(this.rel || opt.rel);
                methods._setGallery(opt);
                el.addClass(D.isD);
                if (opt.context) {
                    el.on('contextmenu.' + $.drop.nS + ' ' + 'click.' + $.drop.nS, function (e) {
                        e.preventDefault();
                    });
                    el.on('mouseup.' + $.drop.nS, function (e) {
                        e.preventDefault();
                        if (e.button === 2)
                            methods.open.call($(this), null, e);
                    });
                }
                else {
                    if (opt.triggerOn || opt.triggerOff)
                        el.on(opt.triggerOn + '.' + $.drop.nS + ' ' + opt.triggerOff + '.' + $.drop.nS, function (e) {
                            e.stopPropagation();
                            e.preventDefault();
                        }).on(opt.triggerOn + '.' + $.drop.nS, function (e) {
                            methods.open.call($(this), null, e);
                        }).on(opt.triggerOff + '.' + $.drop.nS, function (e) {
                            methods.close.call($($(this).attr('data-drop')), e);
                        });
                    else
                        el.on(opt.trigger + '.' + $.drop.nS, function (e) {
                            methods.open.call($(this), null, e);
                            e.stopPropagation();
                            e.preventDefault();
                        });
                }
                if (/#.+/.test(opt.hash) && !D.hashs[opt.hash])
                    D.hashs[opt.hash] = el;
            }).each(function () {
                D.busy = false;
                if (window.location.hash.indexOf($(this).data('drp').hash) !== -1)
                    methods.open.call($(this), $.extend({isStart: true}, set, $(this).data('drp')), 'startHash');
            });
        },
        destroy: function (el) {
            return (el || this).each(function () {
                var el = $(this),
                        opt = $(el).data('drp');
                el.removeClass(D.isD).removeData('drp');
                if (!opt)
                    return;
                if (opt.trigger)
                    el.off(opt.trigger + '.' + $.drop.nS);
                if (opt.triggerOn)
                    el.off(opt.triggerOn + '.' + $.drop.nS);
                if (opt.triggerOff)
                    el.off(opt.triggerOff + '.' + $.drop.nS);
                el.off('contextmenu.' + $.drop.nS).off('mouseup.' + $.drop.nS).off('click.' + $.drop.nS);
            });
        },
        _get: function (opt, e, hashChange) {
            var hrefC = opt.href.replace(D.reg, '');
            if (!opt.isStart) //if few popup need show on start
                $.drop.cancel();
            var el = this,
                    elSet = el.data();
            var _update = function (data) {
                data = data ? data : 'response is empty';
                if (opt.dropn)
                    var drop = methods._pasteDrop(opt, data);
                else
                    drop = methods._pasteDrop(opt, opt.pattern);
                if (!opt.dropn)
                    drop.find($(opt.placePaste)).html(data);
                drop.addClass(D.pC + opt.type);
                if (!opt.always)
                    D.drops[hrefC] = drop.clone();
                methods._show.call(el, drop, e, opt, hashChange);
                return drop;
            };
            var _getImage = function () {
                opt.type = elSet.type = 'image';
                var img = D.imgPreload = new Image();
                img.onload = function () {
                    $.drop.hideLoading();
                    this.onload = this.onerror = null;
                    _update($(this));
                };
                img.onerror = function () {
                    this.onload = this.onerror = null;
                    $.drop.hideLoading();
                    D.busy = false;
                    methods.open.call(null, {notify: true, datas: {answer: 'error', data: 'image is not found'}}, 'errorImage');
                };
                img.src = opt.href + (opt.always ? '?' + (+new Date()) : '');
            };
            var _getAjax = function () {
                opt.type = elSet.type = 'ajax';
                D.curAjax = $.ajax($.extend({
                    url: opt.href,
                    dataType: opt.ajax.dataType ? opt.ajax.dataType : (opt.notify ? 'json' : 'html'),
                    success: function (data) {
                        $.drop.hideLoading();
                        if (opt.notify)
                            methods._pasteNotify.call(el, data, opt, hashChange, e);
                        else
                            _update(data);
                    },
                    error: function () {
                        $.drop.hideLoading();
                        D.busy = false;
                        methods.open.call(null, {notify: true, datas: {answer: 'error', data: methods._errorM(arguments[2])}}, 'errorAjax');
                    }
                }, opt.ajax));
            };
            var _getIframe = function () {
                opt.type = elSet.type = 'iframe';
                var iframe = $('<iframe name="drop-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen' + (navigator.userAgent.match(/msie/i) ? ' allowtransparency="true"' : '') + '></iframe>');
                iframe.one('load.' + $.drop.nS, function () {
                    $.drop.hideLoading();
                });
                _update(iframe);
            };
            $.drop.showLoading();
            if (opt.type === 'auto') {
                if (opt.href.match(D.regImg))
                    _getImage();
                else
                    _getAjax();
            }
            else
                switch (opt.type) {
                    case 'image':
                        _getImage();
                        break;
                    case 'iframe':
                        _getIframe();
                        break;
                    default:
                        _getAjax();
                }
            return el;
        },
        open: function (opt, e, hashChange) {
            if (D.busy)
                return false;
            D.busy = true;
            var $this = D.existsN(this) ? this : $([]),
                    elSet = D.existsN($this) ? $this.data() : {};
            opt = $.extend({}, DP, elSet && elSet.drp ? elSet.drp : {}, opt);
            e = e ? e : window.event;
            if (elSet.dropConfirmPromptAlert)
                methods.close.call(elSet.dropConfirmPromptAlert, 'element already open', null, null, true);
            var drop = $(elSet.drop);
            if (opt.closeActiveClick && D.existsN(drop) && $this.hasClass(D.activeClass)) {
                methods.close.call(drop, 'element already open');
                return $this;
            }

            if (elSet.drop || opt.drop && D.existsN(opt.drop) && opt.drop.hasClass(D.activeClass))
                methods.close.call(drop, 'element already open', null, null, true);
            if (elSet.tempClass && !elSet.dropn)
                elSet.drop = opt.drop = null;
            opt.tempClass = elSet.tempClass = 'drop-' + (+new Date());
            opt.tempClassS = '.' + opt.tempClass;
            if (elSet || D.existsN(opt.drop))
                elSet.dropn = opt.drop;
            $.extend(opt, elSet);
            var href = $this.attr('href') || opt.href;
            opt.href = href && $.trim(href).indexOf('#') === 0 ? null : href;
            var hrefC = opt.href ? opt.href.replace(D.reg, '') : null,
                    rel = $this.attr('rel') || opt.rel;
            opt.hash = /#.+?$/.test(href) ? href.match(/(#.+?$)/g)[0] : opt.hash;
            if (rel && D.gallery[rel])
                opt.rel = rel;
            if (opt.rel && D.galleryOpt[opt.rel])
                $.extend(opt, D.galleryOpt[opt.rel]['genOpt'], D.galleryOpt[opt.rel][hrefC]);
            methods._setGallery(opt);
            if (opt.href && opt.always)
                opt.drop = elSet.dropn ? elSet.dropn : null;
            opt.drop = opt.drop && $.type(opt.drop) === 'string' ? opt.drop : opt.tempClassS;
            if (!D.existsN($this) /*bug of remove bellow "opt.elrun.remove"*/ || elSet.dropId !== undefined && !D.exists('[data-drop-id="' + elSet.dropId + '"]'))
                $this = $('<a data-drop-id="' + D.cOD + '" style="display: none !important;" data-drop="' + opt.drop + '" class="' + D.tempClass + '" href="' + (opt.href ? opt.href : '#') + '" rel="' + (opt.rel ? opt.rel : null) + '"></a>').appendTo($('body'));
            if (opt.context) {
                $.extend(opt, {place: 'global', limitSize: true, overlay: false});
                if (e && e.pageX >= 0)
                    opt.placement = {'left': parseInt(e.pageX), 'top': parseInt(e.pageY)};
                else
                    opt.placement = {'left': $this.offset().left, 'top': $this.offset().top};
            }
            opt.elrun = $this;
            if (opt.filter) {
                if ($this.hasClass('drop-filter')) {
                    opt.tempClassS = elSet.dropn = opt.drop;
                    opt.tempClass = null;
                }
                else {
                    methods._filterSource.call($this, opt.filter).addClass(opt.tempClass);
                    elSet.dropn = opt.drop = opt.tempClassS;
                    $this.addClass('drop-filter');
                }
            }
            $this.attr('data-drop', opt.drop).data('drop', opt.drop);
            drop = $(elSet.dropn);
            var _confirmF = function () {
                opt.style = methods._styleCreate(opt);
                if (opt.notify && opt.datas)
                    methods._pasteNotify.call($this, opt.datas, opt, hashChange, e);
                else if (opt.filter)
                    methods._show.call($this, methods._pasteDrop(opt, drop.addClass(D.wasCreateClass)), e, opt, hashChange);
                else if (opt.html) {
                    drop = methods._pasteDrop(opt, opt.pattern);
                    drop.find($(opt.placePaste)).html(opt.html);
                    methods._show.call($this, drop, e, opt, hashChange);
                }
                else if (opt.href && (!D.drops[hrefC] || opt.always))
                    methods._get.call($this, opt, e, hashChange);
                else if (D.existsN(drop) || opt.href && D.drops[hrefC])
                    methods._show.call($this, methods._pasteDrop(opt, D.existsN(drop) ? drop.addClass(D.wasCreateClass) : D.drops[hrefC].clone()), e, opt, hashChange);
                else if (opt.header || opt.content || opt.footer)
                    methods._show.call($this, methods._pasteDrop(opt, opt.pattern), e, opt, hashChange);
                else
                    throw 'insufficient data';
            };
            function _show() {
                if ($this.is(':disabled') || opt.drop && opt.start && !eval(opt.start).call($this, opt, drop, e))
                    return;
                if (opt.prompt || opt.confirm || opt.alert) {
                    elSet.dropn = elSet.drop;
                    opt.drop = opt.tempClassS;
                    opt.style = methods._styleCreate(opt);
                    methods._checkMethod(function () {
                        methods.confirmPromptAlert(opt, hashChange, _confirmF, e, $this);
                    });
                }
                else
                    _confirmF();
            }
            if (!opt.moreOne && D.exists(D.aDS))
                methods.close.call($(D.aDS), 'close more one element', _show);
            else
                _show();
            return this;
        },
        _show: function (drop, e, opt, hashChange) {
            if (!opt.moreOne && D.exists(D.aDS))
                methods.close.call($(D.aDS), 'close more one element', $.proxy(_show, this));
            else
                _show.call(this);
            function _show() {
                if (!D.existsN(drop))
                    return false;
                e = e ? e : window.event;
                var $this = this,
                        dropOver = null;
                if (opt.overlay) {
                    if (!D.exists('[data-rel="' + opt.tempClassS + '"].drop-overlay'))
                        $('body').append('<div class="drop-overlay" data-rel="' + opt.tempClassS + '"></div>');
                    (opt.dropOver = dropOver = $('[data-rel="' + opt.tempClassS + '"].drop-overlay')).css({
                        'background-color': opt.overlayColor,
                        'opacity': opt.overlayOpacity,
                        'z-index': 1103 + D.cOD
                    });
                }
                drop.data('drp', opt).attr('data-rel', opt.rel).css('z-index', 1104 + D.cOD).attr('data-elrun', opt.drop).addClass(D.pC + opt.place);
                if (opt.context)
                    drop.addClass(D.pC + 'context');
                if (opt.notify)
                    drop.addClass(D.pC + 'notify');
                if (opt.rel)
                    methods._checkMethod(function () {
                        methods.gallery(drop, opt);
                    });
                methods._setHeightAddons(dropOver);
                methods._pasteContent($this, drop, opt);
                methods._positionType(drop);
                var ev = opt.drop ? opt.drop.replace(D.reg, '') : '';
                if (opt.hash && !hashChange) {
                    D.scrollTop = wnd.scrollTop();
                    var wLH = window.location.hash;
                    wnd.off('hashchange.' + $.drop.nS);
                    if (opt.hash.indexOf('#') !== -1 && (new RegExp(opt.hash + '#|' + opt.hash + '$').exec(wLH) === null))
                        window.location.hash = wLH + opt.hash;
                    wnd.scrollTop(D.scrollTop);
                    setTimeout(methods._setEventHash, 0);
                }
                wnd.off('resize.' + $.drop.nS + ev).on('resize.' + $.drop.nS + ev, function () {
                    methods.update.call(drop);
                }).off('scroll.' + $.drop.nS + ev).on('scroll.' + $.drop.nS + ev, function () {
                    if (opt.place === 'center' && opt.centerOnScroll)
                        methods['_' + opt.place].call(drop);
                });
                $(dropOver).fadeIn(100).off('click.' + $.drop.nS + ev).on('click.' + $.drop.nS + ev, function (e) {
                    e.stopPropagation();
                    if (opt.closeClick && $(e.target).is('.drop-overlay'))
                        methods.close.call($($(e.target).attr('data-rel')), e);
                });
                if (opt.alert || opt.confirm || opt.prompt) {
                    var elFocus;
                    if (opt.alert)
                        elFocus = opt.alertActionBtn;
                    else if (opt.confirm)
                        elFocus = opt.confirmActionBtn;
                    else if (opt.prompt)
                        elFocus = opt.promptInput;
                    elFocus = drop.find(elFocus);
                    if (opt.prompt) {
                        elFocus.val(opt.promptInputValue);
                        drop.find('form').off('submit.' + $.drop.nS + ev).on('submit.' + $.drop.nS + ev, function (e) {
                            e.preventDefault();
                        });
                    }
                    var focusFunc = function () {
                        elFocus.focus();
                    };
                    setTimeout(focusFunc, 0);
                }
                opt.exit = $.type(opt.exit) === 'string' ? drop.find(opt.exit) : opt.exit;
                if (D.existsN(opt.exit)) {
                    if (opt.closeClick)
                        opt.exit.show().off('click.' + $.drop.nS).on('click.' + $.drop.nS, function (e) {
                            e.stopPropagation();
                            methods.close.call($(this).closest('[data-elrun]'), e);
                        });
                    else
                        opt.exit.hide();
                }
                if (opt.context)
                    drop.add(dropOver).off('contextmenu.' + $.drop.nS).on('contextmenu.' + $.drop.nS, function (e) {
                        e.preventDefault();
                    });
                var dropWH = opt.type === 'iframe' ? drop.find('iframe') : drop;
                if (opt.width)
                    dropWH.css('width', opt.width);
                if (opt.height)
                    dropWH.css('height', opt.height);
                $('html, body').css({'height': '100%'});
                if (opt.limitSize)
                    methods._checkMethod(function () {
                        methods.limitSize(drop);
                    });
                if (opt.placeBeforeShow)
                    methods._checkMethod(function () {
                        methods.placeBeforeShow(drop, $this, opt);
                    });
                if (opt.place !== 'inherit')
                    methods['_' + opt.place].call(drop);
                if (opt.before)
                    eval(opt.before).call($this, opt, drop, e);
                drop.trigger('dropBefore', {
                    event: e,
                    anchor: $this,
                    drop: drop,
                    options: opt
                });
                methods._disableScroll(opt);
                $('.drop-overlay.' + D.pC + 'for-remove').stop().remove();
                drop[opt.effectOn](opt.durationOn, function () {
                    D.cOD++;
                    D.busy = false;
                    var drop = $(this);
                    if (opt.type === 'iframe')
                        dropWH.attr('src', opt.href);
                    $('html, body').css({'overflow': '', 'overflow-x': ''});
                    methods._setHeightAddons(dropOver);
                    var inDrop = opt.type === 'iframe' ? drop.find('iframe').contents().find(D.selAutoInit) : drop.find(D.selAutoInit);
                    if (D.existsN(inDrop))
                        methods.init.call(inDrop);
                    drop.add($this).addClass(D.activeClass);
                    D.activeDrop.unshift(opt.drop);
                    var _decoratorClose = function (e, cond) {
                        if (opt.place === 'inherit' && !opt.inheritClose)
                            return;
                        if (cond)
                            methods.close.call(opt.closeAll && D.activeDrop.length ? null : $(D.activeDrop[0]), e);
                    };
                    D.activeDropCEsc[opt.drop] = function (e) {
                        _decoratorClose(e, opt.closeEsc && e.keyCode === 27);
                    };
                    D.activeDropCClick[opt.drop] = function (e) {
                        _decoratorClose(e, opt.closeClick && !D.existsN($(e.target).closest('[data-elrun]')));
                    };
                    if (opt.notify && !isNaN(opt.notifyclosetime))
                        D.notifyTimeout[opt.drop] = setTimeout(function () {
                            methods.close.call(drop, 'close notify setTimeout');
                        }, opt.notifyclosetime);
                    if (opt.droppable && opt.place !== 'inherit')
                        methods.droppable(drop);
                    if (opt.after)
                        eval(opt.after).call($this, opt, drop, e);
                    drop.trigger('dropAfter', {
                        event: e,
                        anchor: $this,
                        drop: drop,
                        options: opt
                    });
                });
            }
            return this;
        },
        close: function (e, f, hashChange, force) {
            var sel = this,
                    drops = D.existsN(sel) ? sel : $('[data-elrun].' + D.activeClass);
            var closeLength = drops.length;
            drops.each(function (i) {
                var drop = $(this),
                        opt = $.extend({}, drop.data('drp'));
                if (!drop.data('drp') || hashChange && opt.hash && window.location.hash.indexOf(opt.hash) !== -1)
                    return;
                var _hide = function () {
                    if (opt.notify && D.notifyTimeout[opt.drop]) {
                        clearTimeout(D.notifyTimeout[opt.drop]);
                        delete D.notifyTimeout[opt.drop];
                    }
                    D.enableScroll();
                    if (opt.type === 'iframe')
                        drop.find('iframe').removeAttr('src');
                    var ev = opt.drop ? opt.drop.replace(D.reg, '') : '';
                    wnd.off('resize.' + $.drop.nS + ev).off('scroll.' + $.drop.nS + ev);
                    D.activeDrop.splice($.inArray(opt.drop, D.activeDrop), 1);
                    delete D.activeDropCEsc[opt.drop];
                    delete D.activeDropCClick[opt.drop];
                    if (D.activeDrop[0] && $(D.activeDrop[0]).data('drp'))
                        methods._disableScroll($(D.activeDrop[0]).data('drp'));
                    drop.add(opt.elrun).removeClass(D.activeClass);
                    if (opt.hash && !hashChange) {
                        D.scrollTop = wnd.scrollTop();
                        wnd.off('hashchange.' + $.drop.nS);
                        window.location.hash = window.location.hash.replace(new RegExp(opt.hash + '($|\b)', 'ig'), '').replace(new RegExp(opt.hash + '#', 'ig'), '#');
                        wnd.scrollTop(D.scrollTop);
                        setTimeout(methods._setEventHash, 0);
                    }
                    if (opt.placeAfterClose)
                        methods._checkMethod(function () {
                            methods.placeAfterClose(drop, opt.elrun, opt);
                        });
                    drop[opt.effectOff](force ? 0 : opt.durationOff, function () {
                        D.busy = false;
                        opt.style.remove();
                        $('html, body').css({'overflow': '', 'overflow-x': ''});
                        var $this = $(this);
                        methods._resetStyleDrop.call($(this));
                        $this.removeClass(D.pC + opt.place).removeClass(D.pC + opt.type).removeClass(D.pC + 'context').removeClass(D.pC + 'notify');
                        if (opt.closed)
                            eval(opt.closed).call(opt.elrun, opt, $this, e);
                        $this.trigger('dropClosed', {
                            event: e,
                            anchor: opt.elrun,
                            drop: $this,
                            options: opt
                        });
                        var dC = $this.find($(opt.placeContent)).data('jsp');
                        if (dC)
                            dC.destroy();
                        if (!D.exists(D.aDS))
                            $('html, body').css({'height': ''});
                        if (!opt.filter)
                            $this.removeClass(opt.tempClass);
                        if (!opt.elrun.data('dropn'))
                            opt.elrun.data('drop', null);
                        if (opt.elrun.hasClass(D.tempClass))
                            opt.elrun.remove();
                        $this.data('drp', null);
                        if (!$this.hasClass(D.wasCreateClass))
                            $this.remove();
                        var condCallback = i === closeLength - 1 && $.isFunction(f);
                        if (opt.dropOver) {
                            opt.dropOver.addClass(D.pC + 'for-remove').fadeOut(force ? 0 : opt.durationOff, function () {
                                $(this).remove();
                            });
                            if (condCallback)
                                setTimeout(f, force ? 0 : opt.durationOff + 100);
                        }
                        else if (condCallback)
                            f();
                    });
                };
                drop.trigger('dropClose', {
                    event: e,
                    anchor: opt.elrun,
                    drop: drop,
                    options: opt
                });
                if (opt.close) {
                    var res = eval(opt.close).call(opt.elrun, opt, drop, e);
                    if (res === false && res !== true)
                        throw res;
                    else
                        _hide();
                }
                else
                    _hide();
            });
            return sel;
        },
        update: function () {
            var drop = this,
                    drp = drop.data('drp');
            if (!drp)
                return false;
            if (drp.limitSize)
                methods._checkMethod(function () {
                    methods.limitSize(drop);
                });
            if (drp.place !== 'inherit' && !D.isTouch)
                methods._checkMethod(function () {
                    methods['_' + drp.place].call(drop);
                }, drp.place);
            methods._setHeightAddons(drp.dropOver);
        },
        _center: function () {
            return this.each(function () {
                var drop = $(this),
                        drp = drop.data('drp');
                if (!drp)
                    return false;
                var method = drp.animate || drp.placeBeforeShow ? 'animate' : 'css',
                        dropV = drop.is(':visible'),
                        w = dropV ? drop.outerWidth() : drop[D.actual]('outerWidth'),
                        h = dropV ? drop.outerHeight() : drop[D.actual]('outerHeight'),
                        wndT = wnd.scrollTop(),
                        wndL = wnd.scrollLeft(),
                        top = Math.floor((wnd.height() - h) / 2),
                        left = Math.floor((wnd.width() - w) / 2);
                top = top > 0 ? top + wndT : wndT;
                left = left > 0 ? left + wndL : wndL;
                if (top + h > doc.height() || left + w > doc.width())
                    return false;
                drop[method]({
                    'top': top,
                    'left': left
                }, {
                    duration: drp.durationOn,
                    queue: false
                });
            });
        },
        _global: function () {
            return this.each(function () {
                var drop = $(this),
                        drp = drop.data('drp');
                if (!drp && drp.droppableIn)
                    return false;
                var method = drp.animate || drp.placeBeforeShow ? 'animate' : 'css',
                        $this = drp.elrun,
                        t = 0,
                        l = 0,
                        $thisW = $this.width(),
                        $thisH = $this.height(),
                        dropW = +drop[D.actual]('outerWidth'),
                        dropH = +drop[D.actual]('outerHeight'),
                        wndT = wnd.scrollTop(),
                        wndL = wnd.scrollLeft(),
                        offTop = $this.offset().top,
                        offLeft = $this.offset().left,
                        $thisT = 0,
                        $thisL = 0;
                if (!drop.is(':visible'))
                    drop.css({top: 'auto', bottom: 'auto', left: 'auto', right: 'auto'});
                if ($.type(drp.placement) === 'object') {
                    var temp = drp.placement;
                    if (!drp.context) {
                        if (temp.top !== undefined)
                            temp.top = temp.top + wndT;
                        if (temp.left !== undefined)
                            temp.left = temp.left + wndL;
                        if (temp.bottom !== undefined)
                            temp.bottom = temp.bottom - wndT;
                        if (temp.right !== undefined)
                            temp.right = temp.right - wndL;
                    }
                    drop[method](temp, {
                        duration: drp.durationOn,
                        queue: false
                    });
                }
                else {
                    var pmt = drp.placement.toLowerCase().split(' ');
                    if (pmt[1] === 'top')
                        t = -dropH;
                    if (pmt[1] === 'bottom')
                        t = $thisH;
                    if (pmt[0] === 'left')
                        l = 0;
                    if (pmt[0] === 'right')
                        l = -dropW + $thisW;
                    if (pmt[0] === 'center')
                        l = -dropW / 2 + $thisW / 2;
                    if (pmt[1] === 'center')
                        t = -dropH / 2 + $thisH / 2;
                    $thisT = offTop + t;
                    $thisL = offLeft + l;
                    if ($thisL < 0)
                        $thisL = 0;
                    drop[method]({
                        'top': $thisT,
                        'left': $thisL
                    }, {
                        duration: drp.durationOn,
                        queue: false
                    });
                }
            });
        },
        _resetStyleDrop: function () {
            return this.stop().css({'z-index': '',
                'top': '', 'left': '',
                'bottom': '',
                'right': '',
                'position': ''
            });
        },
        _pasteNotify: function (datas, opt, hashChange, e) {
            if (!$.isFunction(opt.handlerNotify))
                return false;
            var drop = methods._pasteDrop(opt, opt.pattern);
            opt.handlerNotify.call($(this), datas, opt);
            return methods._show.call($(this), drop, e, opt, hashChange);
        },
        _pasteDrop: function (opt, drop) {
            drop = $(drop);
            if (opt.dropn)
                drop = D.existsN(drop.filter(opt.drop)) ? drop.filter(opt.drop) : (D.existsN(drop.find(opt.drop)) ? drop.find(opt.drop) : drop);
            if (opt.place !== 'inherit')
                drop.appendTo($('body'));
            else if (opt.placeInherit)
                $(opt.placeInherit)[opt.methodPlaceInherit](drop);
            return drop.hide().addClass(opt.tempClass).attr('data-elrun', opt.drop);
        },
        _pasteContent: function ($this, drop, opt) {
            var _checkCont = function (place) {
                if (place.is(':empty'))
                    place.removeClass(D.noEmptyClass).addClass(D.emptyClass);
                else
                    place.addClass(D.noEmptyClass).removeClass(D.emptyClass);
            };
            var _pasteContent = function (content, place) {
                place = drop.find(place).first();
                if (!D.existsN(place))
                    return false;
                _checkCont(place);
                if (!content)
                    return false;
                _checkCont(place.empty().html(function () {
                    try {
                        if ($.type(eval(content)) === 'function')
                            return eval(content).call(place, opt, drop, $this);
                        return content;
                    } catch (e) {
                        return content;
                    }
                }));
            };
            _pasteContent(opt.header, opt.placeHeader);
            _pasteContent(opt.content, opt.placePaste);
            _pasteContent(opt.footer, opt.placeFooter);
            return this;
        },
        _setHeightAddons: function (dropOver) {
            $(dropOver).css({width: '', height: ''}).css({width: doc.width(), height: doc.height()});
        },
        _checkMethod: function (f) {
            try {
                f();
            } catch (e) {
                var method = f.toString().match(/\.\S*\(/);
                throw  'need connect "' + method[0].substring(1, method[0].length - 1) + '" method';
            }
            return this;
        },
        _positionType: function (drop) {
            if (drop.data('drp') && drop.data('drp').place !== 'inherit')
                drop.css({
                    'position': drop.data('drp').position
                });
            return this;
        },
        _filterSource: function (s) {
            var btn = this,
                    href = s.split(').'),
                    regS, regM = '';
            $.map(href, function (v) {
                regS = (v[v.length - 1] !== ')' ? v + ')' : v).match(/\(.*\)/);
                regM = regS['input'].replace(regS[0], '');
                regS = regS[0].substring(1, regS[0].length - 1);
                btn = btn[regM](regS);
            });
            return btn;
        },
        _setEventHash: function () {
            D.wLH = window.location.hash;
            wnd.off('hashchange.' + $.drop.nS).on('hashchange.' + $.drop.nS, function (e) {
                e.preventDefault();
                if (D.scrollTop)
                    $('html, body').scrollTop(D.scrollTop);
                D.wLHN = window.location.hash;
                for (var i in D.hashs) {
                    if (D.wLH.indexOf(i) === -1 && D.wLHN.indexOf(i) !== -1)
                        methods.open.call(D.hashs[i], null, e, true);
                    else
                        methods.close.call($(D.hashs[i].data('drop')).add(D.hashs[i].data('dropConfirmPromptAlert')), e, null, true);
                }
                D.wLH = D.wLHN;
            });
        },
        _styleCreate: function (opt) {
            $('[data-rel="' + opt.tempClassS + '"]').remove();
            if (!D.theme[opt.theme])
                throw 'theme' + ' "' + opt.theme + '" ' + 'not available';
            var text = D.theme[opt.theme],
                    coms = D.theme[opt.theme].match(/.*,([^{]*)/gm);
            if (coms)
                $.map(coms, function (n) {
                    n = n.split('{')[0];
                    text = text.replace(n, n.replace(/,(?!(\s*\[drop\])|(\s*\[\[))/g, ', ' + opt.tempClassS + ' '));
                });
            return $('<style>', {
                'data-rel': opt.tempClassS,
                html: text.replace(/\}[^$](?!(\s*\[drop\])|(\s*\[\[))/g, '} ' + opt.tempClassS + ' ').replace(/^(?!(\s*\[drop\])|(\s*\[\[))/, opt.tempClassS + ' ').replace(/\[\[(.*?)\]\]/g, '$1').replace(/\[drop\]/g, opt.tempClassS).replace(/\s{2,}/g, ' ').replace(/url\((.*)\)/g, 'url(' + D.url + 'images/' + opt.theme + '/$1)')
            }).appendTo($('body'));
        },
        _disableScroll: function (opt) {
            D.enableScroll();
            if (opt.place === 'center' && !opt.scroll)
                D.disableScroll();
        },
        _setGallery: function (opt) {
            if (opt.rel && opt.href) {
                if (!D.gallery[opt.rel])
                    D.gallery[opt.rel] = [];
                if ($.inArray(opt.href, D.gallery[opt.rel]) === -1 && opt.href.match(D.regImg))
                    D.gallery[opt.rel].push(opt.href);
                if (!D.galleryHashs[opt.rel] && opt.hash)
                    D.galleryHashs[opt.rel] = [];
                if (opt.hash)
                    D.galleryHashs[opt.rel].push(opt.hash);
            }
            return this;
        },
        _errorM: function (mes) {
            return $.type(mes) === 'string' ? mes : mes.message;
        }
    };
    $.fn.drop = function (method) {
        if (methods[method]) {
            if (!/_/.test(method))
                return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
            else
                throw 'Method ' + method + ' is private on $.drop';
        }
        else if ($.type(method) === 'object' || !method)
            return methods.init.apply(this, arguments);
        else
            throw 'Method ' + method + ' does not exist on $.drop';
    };
    $.drop = function (m, opt) {
        if (!opt)
            opt = {};
        var set;
        if (D.existsN(m))
            set = {'drop': m};
        else if ($.type(m) === 'array' || $.type(m) === 'string' && m.match(D.regImg)) {
            if ($.type(m) === 'array') {
                if (m.length > 1) {
                    opt.rel = opt.rel ? opt.rel : 'rel' + (+new Date());
                    if (!D.galleryOpt[opt.rel])
                        D.galleryOpt[opt.rel] = {};
                    D.galleryOpt[opt.rel]['genOpt'] = $.extend({}, opt);
                    if (!D.gallery[opt.rel])
                        D.gallery[opt.rel] = [];
                    m.map(function (n) {
                        if ($.type(n) === 'string' && $.inArray(n, D.gallery[opt.rel]) === -1)
                            D.gallery[opt.rel].push(n);
                        else if ($.type(n) === 'object' && n.href && $.inArray(n.href, D.gallery[opt.rel]) === -1) {
                            D.galleryOpt[opt.rel][n.href.replace(D.reg, '')] = n;
                            D.gallery[opt.rel].push(n.href);
                        }
                        else
                            return;
                    });
                    if (D.gallery[opt.rel][0])
                        set = {href: D.gallery[opt.rel][0]};
                    else
                        throw 'insufficient data';
                }
                else if ($.type(m[0]) === 'object')
                    set = m[0];
                else if ($.type(m[0]) === 'string')
                    if (m[0].match(D.regImg))
                        set = {href: m[0]};
                    else
                        set = {html: m[0]};
            }
            else if ($.type(m) === 'string' && m.match(D.regImg))
                set = {href: m};
        }
        else if ($.type(m) === 'string')
            set = {'html': m};
        else if ($.type(m) === 'object')
            set = m;
        else
            throw 'insufficient data';
        return methods.open.call(null, $.extend(opt, set), 'API');
    };
    $.drop.nS = 'drop';
    $.drop.version = '1.0';
    $.drop.dP = {
        drop: null,
        html: null,
        href: null,
        hash: null,
        placeContent: '.drop-content',
        placeHeader: '.drop-header',
        placeFooter: '.drop-footer',
        placePaste: '.placePaste',
        header: null,
        footer: null,
        content: null,
        placeInherit: null,
        methodPlaceInherit: 'html',
        filter: null,
        message: {
            success: function (text) {
                return '<div class= "drop-msg"><div class="drop-success"><span class="drop-icon-notify"></span><div class="drop-text-el">' + text + '</div></div></div>';
            },
            warning: function (text) {
                return '<div class= "drop-msg"><div class="drop-warning"><span class="drop-icon-notify"></span><div class="drop-text-el">' + text + '</div></div></div>';
            },
            error: function (text) {
                return '<div class="drop-msg"><div class="drop-error"><span class="drop-icon-notify"></span><div class="drop-text-el">' + text + '</div></div></div>';
            },
            info: function (text) {
                return '<div class="drop-msg"><div class="drop-info"><span class="drop-icon-notify"></span><div class="drop-text-el">' + text + '</div></div></div>';
            }
        },
        trigger: 'click',
        triggerOn: null,
        triggerOff: null,
        effectOn: 'fadeIn',
        effectOff: 'fadeOut',
        place: 'center',
        placement: 'left bottom',
        overlay: true,
        overlayColor: '#000',
        overlayOpacity: .6,
        position: 'absolute',
        placeBeforeShow: null,
        placeAfterClose: null,
        start: null,
        before: null,
        after: null,
        close: null,
        closed: null,
        ok: null,
        pattern: '<div class="drop drop-simple"><button type="button" class="drop-close" data-closed><span class="drop-icon-close">&#215;</span></button><button class="drop-prev" type="button" style="display: none;"><i class="drop-icon-prev">&#60;</i></button><button class="drop-next" type="button" style="display: none;"><i class="drop-icon-next">&#62;</i></button><div class="drop-header"></div><div class="drop-content"><div class="inside-padd placePaste"></div></div><div class="drop-footer"></div></div>',
        patternConfirm: '<div class="drop drop-confirm"><button type="button" class="drop-close" data-closed><span class="drop-icon-close">&#215;</span></button><button class="drop-prev" type="button" style="display: none;"><i class="drop-icon-prev">&#60;</i></button><button class="drop-next" type="button" style="display: none;"><i class="drop-icon-next">&#62;</i></button><div class="drop-header">Confirm</div><div class="drop-content"><div class="inside-padd"><div class="placePaste"></div><div class="drop-group-btns"><button type="button" class="drop-button-confirm" data-button-confirm>ok</button><button type="button" class="drop-btn-cancel" data-closed>cancel</button></div></div></div><div class="drop-footer"></div></div>',
        patternPrompt: '<div class="drop drop-prompt"><button type="button" class="drop-close" data-closed><span class="drop-icon-close">&#215;</span></button><button class="drop-prev" type="button" style="display: none;"><i class="drop-icon-prev">&#60;</i></button><button class="drop-next" type="button" style="display: none;"><i class="drop-icon-next">&#62;</i></button><div class="drop-header">Prompt</div><div class="drop-content"><form class="inside-padd"><div class="placePaste"></div><input type="text" name="promptInput"/><div class="drop-group-btns"><button data-button-prompt type="submit" class="drop-button-prompt">ok</button><button type="button" data-closed class="drop-btn-cancel">cancel</button></div></form></div><div class="drop-footer"></div></div>',
        patternAlert: '<div class="drop drop-alert"><button type="button" class="drop-close" data-closed><span class="drop-icon-close">&#215;</span></button><button class="drop-prev" type="button" style="display: none;"><i class="drop-icon-prev">&#60;</i></button><button class="drop-next" type="button" style="display: none;"><i class="drop-icon-next">&#62;</i></button><div class="drop-header">Alert</div><div class="drop-content"><div class="inside-padd"><div class="placePaste"></div><div class="drop-group-btns"><button type="button" class="drop-button-alert" data-button-alert>ok</button></div></div></div><div class="drop-footer"></div></div>',
        confirmActionBtn: '[data-button-confirm]',
        promptActionBtn: '[data-button-prompt]',
        alertActionBtn: '[data-button-alert]',
        dataPrompt: null,
        promptInput: '[name="promptInput"]',
        promptInputValue: null,
        exit: '[data-closed]',
        next: '.drop-next',
        prev: '.drop-prev',
        autoPlay: false,
        autoPlaySpeed: 2000,
        ajax: {
            type: 'post'
        },
        jScrollPane: {
            animateScroll: true,
            showArrows: true
        },
        durationOn: 300,
        durationOff: 200,
        notifyclosetime: 3000,
        notify: false,
        datas: null,
        handlerNotify: function (data, opt) {
            if (data && $.type(data) === 'string')
                data = eval("(" + data + ")");
            if (!data)
                var text = 'Object notify is empty';
            else if (!data.answer || !data.data)
                text = 'Answer is empty';
            else if (!opt.message || !opt.message[data.answer])
                text = data.data;
            else
                text = opt.message[data.answer](data.data);
            $(opt.drop).find(opt.placePaste).empty().append(text);
            return this;
        },
        confirm: false,
        confirmText: null,
        prompt: false,
        promptText: null,
        alert: false,
        alertText: null,
        always: false,
        animate: false,
        moreOne: false,
        closeAll: false,
        closeClick: true,
        closeEsc: true,
        closeActiveClick: false,
        cycle: true,
        scroll: false,
        limitSize: false,
        scrollContent: true,
        centerOnScroll: false,
        droppable: false,
        droppableLimit: false,
        droppableFixed: false,
        inheritClose: false,
        keyNavigate: true,
        context: false,
        theme: 'default',
        type: 'auto',
        width: null,
        height: null,
        rel: null
    };
    $.drop.drp = {
        handlerMessageWindow: function (e) {
            $.drop(e.originalEvent.data);
        },
        theme: {
            default: '*{margin: 0;padding: 0;}\n\
                    .drop-header{background-color: #f8f8f8;padding: 0 55px 0 12px;font-size: 14px;}\n\
                    input, select, textarea{margin-bottom: 6px;}\n\
                    input, select, textarea, .drop-content button{outline: none;font-family: Arial, Helvetica CY, Nimbus Sans L, sans-serif;line-height: 1.5;border: 1px solid #d8d8d8;padding: 4px 6px;}\n\
                    button{background-color: #fafafa;color: #666;cursor: pointer;}\n\
                    .drop-header.drop-no-empty, .drop-footer.drop-no-empty{padding-top: 6px;padding-bottom: 7px;}\n\
                    .drop-header.drop-no-empty{border-bottom: 1px solid #d8d8d8;}\n\
                    [drop].drop-is-scroll .drop-header.drop-empty{height: 28px;}\n\
                    .drop-footer.drop-no-empty{border-top: 1px solid #d8d8d8;}\n\
                    .drop-content{position: relative;z-index: 1;}\n\
                    .drop-content .inside-padd{padding: 12px 28px 12px 12px;}\n\
                    [[.drop-image .drop-content .inside-padd]], [[.drop-alert .drop-content .inside-padd]]{padding: 10px;}\n\
                    [[.drop-alert .drop-group-btns]]{text-align: center;}\n\
                    .drop-content button{margin-right: 4px;}\n\
                    button:focus, input:focus, select:focus, textarea:focus{outline: #b3b3b3 solid 1px;}\n\
                    .drop-footer{background-color: #d5d5d5;padding: 0 12px;}\n\
                    .drop-close, .drop-prev, .drop-next{outline: none;background: none;border: 0;cursor: pointer;vertical-align: middle;position: absolute;font-size: 0;padding: 0;}\n\
                    .drop-prev, .drop-next{width: 35%;height: 100%;top: 0;z-index: 2;}\n\
                    .drop-prev:focus, .drop-next:focus{outline: none;}\n\
                    .drop-icon-prev, .drop-icon-next{width: 20px;height: 80px;line-height: 80px;}\n\
                    .drop-icon-prev, .drop-icon-next, .drop-icon-close{font-family: "Trebuchet MS", "Helvetica CY", sans-serif;font-size: 21px;color: #999;background-color: #fff;display: inline-block;text-align: center;//display: inline;zoom: 1;}\n\
                    .drop-icon-close{line-height: 17px;width: 19px;height: 19px;}\n\
                    .drop-close{right: 5px;top: 4px;z-index: 2;}\n\
                    .drop-next{right: 5px;text-align: right;}\n\
                    .drop-prev{left: 5px;text-align: left;}\n\
                    [drop].drop-is-scroll .drop-next{right: 16px;}\n\
                    .drop-icon-next{text-align: center;}\n\
                    .icon-times-drop{position: absolute;z-index:1;right:0;top: 0;cursor: pointer;width: 15px;height: 15px;}\n\
                    .nav{list-style: none;margin-left: 0;}\n\
                    .nav-vertical > li{display: block;border-top: 1px solid #ebebeb;padding: 8px 35px 8px 15px;}\n\
                    .nav-vertical > li > a{text-decoration: none;}\n\
                    .nav-vertical > li:first-child{border-top: 0;}\n\
                    .drop-msg > div{border-width: 1px;border-style: solid;padding: 10px;}\n\
                    .drop-success{background-color: #dff0d8;border-color: #d6e9c6;color: #3c763d;}\n\
                    .drop-warning{background-color: #fcf8e3;border-color: #faebcc;color: #8a6d3b;}\n\
                    .drop-error{background-color: #f2dede;border-color: #ebccd1;color: #a94442;}\n\
                    .drop-info{background-color: #d9edf7;border-color: #bce8f1;color: #31708f;}\n\
                    [[.drop-context .drop-content .inside-padd]]{padding: 0;}\n\
                    [drop]{font-family: Arial, "Helvetica CY", "Nimbus Sans L" sans-serif;font-size: 13px;color: #333;border: 1px solid #e4e4e4;background-color: #fff;}\n\
                    [drop].drop-is-scroll .placePaste img{max-width: none; max-height: none;width: auto;height: auto;}\n\
                    .jspContainer{overflow: hidden;position: relative;}\n\
                    .jspPane{position: absolute;}\n\
                    .jspVerticalBar{position: absolute;top: 0;right: 0;width: 16px;height: 100%;background: red;}\n\
                    .jspHorizontalBar{position: absolute;bottom: 0;left: 0;width: 100%;height: 16px;background: red;}\n\
                    .jspCap{display: none;}\n\
                    .jspHorizontalBar .jspCap{float: left;}\n\
                    .jspTrack{background: #f9f8f7;position: relative;}\n\
                    .jspDrag{background: #d5d5d5;position: relative;top: 0;left: 0;cursor: pointer;}\n\
                    .jspHorizontalBar .jspTrack,.jspHorizontalBar .jspDrag{float: left;height: 100%;}\n\
                    .jspArrow{background: #ccc;position: relative;display: block;cursor: pointer;padding: 0;margin: 0;}\n\
                    .jspArrow.jspDisabled{cursor: default;background: #eee;}\n\
                    .jspVerticalBar .jspArrow{height: 16px;}\n\
                    .jspHorizontalBar .jspArrow{width: 16px;float: left;height: 100%;}\n\
                    .jspVerticalBar .jspArrow:focus{outline: none;}\n\
                    .jspCorner{background: #eeeef4;float: left;height: 100%;}\n\
                    .jspArrowUp:before, .jspArrowDown:before, .jspArrowLeft:before, .jspArrowRight:before{position: absolute;font-size: 10px;color: #777;left: 3px;top: 1px;}\n\
                    .jspArrowUp:before{content: "\\25b2";}\n\
                    .jspArrowDown:before{content: "\\25bc";}\n\
                    .jspArrowLeft:before{content: "\\25c4";}\n\
                    .jspArrowRight:before{content: "\\25ba";}\n\
                    [[#drop-loading div]]{background-image: url(drop.png);}'
        },
        regImg: /(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i,
        mainStyle: '#drop-loading {position: fixed;top: 50%;left: 50%;width: 40px;height: 40px;margin-top: -20px;margin-left: -20px;cursor: pointer;overflow: hidden;z-index: 11104;display: none;}\n\
                    #drop-loading div{position: absolute;top: 0;left: 0;width: 40px;height: 480px;}\n\
                    .drop{display: none;}.drop-overlay{display:none;position:absolute;width:100%;left:0;top:0;}',
        reg: /[^a-zA-Z0-9]+/ig,
        autoPlayInterval: {},
        hashs: {},
        drops: {},
        gallery: {},
        galleryOpt: {},
        galleryHashs: {},
        notifyTimeout: {},
        activeDropCEsc: {},
        activeDropCClick: {},
        isD: 'isDrop',
        pC: 'drop-',
        activeClass: 'drop-active',
        aDS: '[data-elrun].drop-center:visible, [data-elrun].drop-global:visible',
        selAutoInit: '[data-drop], [data-html]',
        tempClass: 'drop-temp',
        wasCreateClass: 'drop-was-create',
        emptyClass: 'drop-empty',
        noEmptyClass: 'drop-no-empty',
        activeDrop: [],
        cOD: 0,
        disableScroll: function () {
            if (D.isTouch)
                return false;
            var self = this;
            self.enableScroll();
            wnd.add(doc).on('mousewheel.scr' + $.drop.nS, function (e) {
                if (!($(e.target).is('[data-elrun]') || D.existsN($(e.target).closest('[data-elrun]'))))
                    e.preventDefault();
            });
            D.scrollTop = wnd.scrollTop();
            D.scrollLeft = wnd.scrollLeft();
            wnd.on('scroll.scr' + $.drop.nS, function () {
                $('html, body').scrollTop(D.scrollTop).scrollLeft(D.scrollLeft);
            });
            return self;
        },
        enableScroll: function () {
            if (D.isTouch)
                return false;
            wnd.off('scroll.scr' + $.drop.nS).add(doc).off('mousewheel.scr' + $.drop.nS);
            return this;
        },
        isTouch: document.createTouch !== undefined,
        existsN: function (nabir) {
            return nabir && nabir.length > 0 && nabir instanceof jQuery;
        },
        exists: function (selector) {
            return $(selector).length > 0 && $(selector) instanceof jQuery;
        },
        url: (location.origin + location.pathname + $("[src*='drop']").attr('src') + '/../').replace(/(.[^\/]*?)\/\.\./g, ''),
        requireLength: 0,
        requireCur: 0
    };
    var D = $.drop.drp,
            DP = $.drop.dP;
    $.fn[D.actual = $.fn.actual ? 'actual' + (+new Date()) : 'actual'] = function () {
        if (arguments.length && $.type(arguments[0]) === 'string') {
            var dim = arguments[0],
                    clone = this.clone();
            if (arguments[1] === undefined)
                clone.css({
                    position: 'absolute',
                    top: '-9999px',
                    left: '-9999px'
                }).show().appendTo($('body'));
            var dimS = clone[dim]();
            clone.remove();
            return dimS;
        }
        return undefined;
    };
    $.drop.setParameters = function (options) {
        $.extend(DP, options);
        return this;
    };
    $.drop.setThemes = function () {
        for (var i = 0; i < arguments.length; i++) {
            var obj = {};
            if (arguments[i].file !== undefined)
                (function (o, obj) {
                    $.ajax({
                        url: D.url + 'styles/' + o.file,
                        dataType: 'text',
                        cache: true,
                        success: function (data) {
                            obj[o.name] = data;
                            $.extend(D.theme, obj);
                        },
                        error: function () {
                            throw methods._errorM(arguments[2]);
                        }
                    });
                })(arguments[i], obj);
            else {
                obj[arguments[i].name] = arguments[i].text;
                $.extend(D.theme, obj);
            }
        }
        return this;
    };
    $.drop.setMethod = function (n, v) {
        var nm = {};
        nm[n] = v;
        $.extend(methods, nm);
        return this;
    };
    $.drop.getMethods = function () {
        var public = {};
        for (var i in methods)
            if (!/_/.test(i))
                public[i] = methods[i];
        return public;
    };
    $.drop.close = function (el, force) {
        return methods.close.call(el ? $(el) : null, 'artificial close element', 'API', null, force);
    };
    $.drop.cancel = function () {
        if (D.curAjax)
            D.curAjax.abort();
        D.curAjax = null;
        if (D.imgPreload)
            D.imgPreload.onload = D.imgPreload.onerror = null;
        $.drop.hideLoading();
        return this;
    };
    $.drop.update = function (el) {
        return (el ? $(el) : $('[data-elrun].' + D.activeClass)).each(function () {
            methods.update.call($(this));
        });
    };
    $.drop.require = function (arr, cb) {
        (function (arr, cb) {
            if ($.type(arr) !== 'array')
                arr = arr.split(',');
            D.requireLength += arr.length;
            for (var i in arr) {
                if (methods.hasOwnProperty(arr[i]))
                    continue;
                $.ajax({
                    url: D.url + 'methods/' + arr[i] + '.js',
                    dataType: 'script',
                    cache: true,
                    success: function () {
                        if (++D.requireCur === D.requireLength) {
                            if (cb)
                                cb();
                            doc.trigger('dropRequire');
                        }
                    },
                    error: function () {
                        throw methods._errorM(arguments[2]);
                    }
                });
            }
        })(arr, cb);
        return this;
    };
    doc.ready(function () {
        $('<style>', {html: D.mainStyle.replace(/\s{2,}/g, ' ').replace(/url\((.*)\)/g, 'url(' + D.url + 'images/default/$1)')}).appendTo($('body'));
        D.scrollTop = wnd.scrollTop();
        var loadingTimer, loadingFrame = 1,
                loading = $('<div id="drop-loading"><div></div></div>').appendTo($('body'));
        var _animate_loading = function () {
            if (!loading.is(':visible')) {
                clearInterval(loadingTimer);
                return;
            }
            $('div', loading).css('top', (loadingFrame * -40) + 'px');
            loadingFrame = (loadingFrame + 1) % 12;
        };
        $.drop.showLoading = function () {
            clearInterval(loadingTimer);
            loading.show();
            loadingTimer = setInterval(_animate_loading, 66);
            return this;
        };
        $.drop.hideLoading = function () {
            loading.hide();
            return this;
        };
    }).on('keyup.' + $.drop.nS, function (e) {
        if (D.activeDrop[0] && D.activeDropCEsc[D.activeDrop[0]])
            D.activeDropCEsc[D.activeDrop[0]](e);
    }).on('click.' + $.drop.nS, function (e) {
        if (D.activeDrop[0] && D.activeDropCClick[D.activeDrop[0]])
            D.activeDropCClick[D.activeDrop[0]](e);
    });
    wnd.on('load.' + $.drop.nS, function () {
        setTimeout(function () {
            if (D.requireLength && D.requireCur !== D.requireLength)
                doc.on('dropRequire.' + $.drop.nS, function () {
                    if (D.existsN($(D.selAutoInit).not('.' + D.isD)))
                        $(D.selAutoInit).not('.' + D.isD).drop();
                });
            else
                $(D.selAutoInit).not('.' + D.isD).drop();
        }, 0);
    }).on('message.' + $.drop.nS, D.handlerMessageWindow);
})(jQuery, $(window), $(document));