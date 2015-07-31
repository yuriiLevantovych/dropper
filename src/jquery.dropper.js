(function ($, wnd, doc, undefined) {
    var methods = {
        init: function (options) {
            var set = $.extend({}, DP, options);
            if (!D.existsN(this))
                throw "The object isn't exists";
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
                    el.on('contextmenu.' + $.dropper.nS + ' ' + 'click.' + $.dropper.nS, function (e) {
                        e.preventDefault();
                    });
                    el.on('mouseup.' + $.dropper.nS, function (e) {
                        e.preventDefault();
                        if (e.button === 2)
                            methods.open.call($(this), null, e);
                    });
                }
                else {
                    if (opt.triggerOn || opt.triggerOff)
                        el.on(opt.triggerOn + '.' + $.dropper.nS + ' ' + opt.triggerOff + '.' + $.dropper.nS, function (e) {
                            e.stopPropagation();
                            e.preventDefault();
                        }).on(opt.triggerOn + '.' + $.dropper.nS, function (e) {
                            methods.open.call($(this), null, e);
                        }).on(opt.triggerOff + '.' + $.dropper.nS, function (e) {
                            methods.close.call($($(this).attr('data-dropper')), e);
                        });
                    else
                        el.on(opt.trigger + '.' + $.dropper.nS, function (e) {
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
                    el.off(opt.trigger + '.' + $.dropper.nS);
                if (opt.triggerOn)
                    el.off(opt.triggerOn + '.' + $.dropper.nS);
                if (opt.triggerOff)
                    el.off(opt.triggerOff + '.' + $.dropper.nS);
                el.off('contextmenu.' + $.dropper.nS).off('mouseup.' + $.dropper.nS).off('click.' + $.dropper.nS);
            });
        },
        _get: function (opt, e, hashChange) {
            var hrefC = opt.href.replace(D.reg, '');
            if (!opt.isStart) //if few popup need show on start
                $.dropper.cancel();
            var el = this,
                elSet = el.data();
            var _update = function (data) {
                data = data ? data : 'response is empty';
                if (opt.droppern)
                    var dropper = methods._pasteDropper(opt, data);
                else
                    dropper = methods._pasteDropper(opt, opt.pattern);
                if (!opt.droppern)
                    dropper.find($(opt.placePaste)).html(data);
                dropper.addClass(D.pC + opt.type);
                if (!opt.always)
                    D.droppers[hrefC] = dropper.clone();
                methods._show.call(el, dropper, e, opt, hashChange);
                return dropper;
            };
            var _getImage = function () {
                opt.type = elSet.type = 'image';
                var img = D.imgPreload = new Image();
                img.onload = function () {
                    $.dropper.hideLoading();
                    this.onload = this.onerror = null;
                    _update($(this));
                };
                img.onerror = function () {
                    this.onload = this.onerror = null;
                    $.dropper.hideLoading();
                    D.busy = false;
                    methods.open.call(null, {
                        notify: true,
                        datas: {answer: 'error', data: 'image is not found'}
                    }, 'errorImage');
                };
                img.src = opt.href + (opt.always ? '?' + (+new Date()) : '');
            };
            var _getAjax = function () {
                opt.type = elSet.type = 'ajax';
                D.curAjax = $.ajax($.extend({
                    url: opt.href,
                    dataType: opt.ajax.dataType ? opt.ajax.dataType : (opt.notify ? 'json' : 'html'),
                    success: function (data) {
                        $.dropper.hideLoading();
                        if (opt.notify)
                            methods._pasteNotify.call(el, data, opt, hashChange, e);
                        else
                            _update(data);
                    },
                    error: function () {
                        $.dropper.hideLoading();
                        D.busy = false;
                        methods.open.call(null, {
                            notify: true,
                            datas: {answer: 'error', data: methods._errorM(arguments[2])}
                        }, 'errorAjax');
                    }
                }, opt.ajax));
            };
            var _getIframe = function () {
                opt.type = elSet.type = 'iframe';
                var iframe = $('<iframe name="dropper-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen' + (navigator.userAgent.match(/msie/i) ? ' allowtransparency="true"' : '') + '></iframe>');
                iframe.one('load.' + $.dropper.nS, function () {
                    $.dropper.hideLoading();
                });
                _update(iframe);
            };
            $.dropper.showLoading();
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
            if (elSet.dropperConfirmPromptAlert)
                methods.close.call(elSet.dropperConfirmPromptAlert, 'element already open', null, null, true);
            var dropper = $(elSet.dropper);
            if (opt.closeActiveClick && D.existsN(dropper) && $this.hasClass(D.activeClass)) {
                methods.close.call(dropper, 'element already open');
                return $this;
            }

            if (elSet.dropper || opt.dropper && D.existsN(opt.dropper) && opt.dropper.hasClass(D.activeClass))
                methods.close.call(dropper, 'element already open', null, null, true);
            if (elSet.tempClass && !elSet.droppern)
                elSet.dropper = opt.dropper = null;
            opt.tempClass = elSet.tempClass = 'dropper-' + (+new Date());
            opt.tempClassS = '.' + opt.tempClass;
            if (elSet || D.existsN(opt.dropper))
                elSet.droppern = opt.dropper;
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
                opt.dropper = elSet.droppern ? elSet.droppern : null;
            opt.dropper = opt.dropper && $.type(opt.dropper) === 'string' ? opt.dropper : opt.tempClassS;
            if (!D.existsN($this) /*bug of remove bellow "opt.elrun.remove"*/ || elSet.dropperId !== undefined && !D.exists('[data-dropper-id="' + elSet.dropperId + '"]'))
                $this = $('<a data-dropper-id="' + D.cOD + '" style="display: none !important;" data-dropper="' + opt.dropper + '" class="' + D.tempClass + '" href="' + (opt.href ? opt.href : '#') + '" rel="' + (opt.rel ? opt.rel : null) + '"></a>').appendTo($('body'));
            if (opt.context) {
                $.extend(opt, {place: 'global', limitSize: true, overlay: false});
                if (e && e.pageX >= 0)
                    opt.placement = {'left': parseInt(e.pageX), 'top': parseInt(e.pageY)};
                else
                    opt.placement = {'left': $this.offset().left, 'top': $this.offset().top};
            }
            opt.elrun = $this;
            if (opt.filter) {
                if ($this.hasClass('dropper-filter')) {
                    opt.tempClassS = elSet.droppern = opt.dropper;
                    opt.tempClass = null;
                }
                else {
                    methods._filterSource.call($this, opt.filter).addClass(opt.tempClass);
                    elSet.droppern = opt.dropper = opt.tempClassS;
                    $this.addClass('dropper-filter');
                }
            }
            $this.attr('data-dropper', opt.dropper).data('dropper', opt.dropper);
            dropper = $(elSet.droppern);
            var _confirmF = function () {
                if (opt.notify && opt.datas)
                    methods._pasteNotify.call($this, opt.datas, opt, hashChange, e);
                else if (opt.filter)
                    methods._show.call($this, methods._pasteDropper(opt, dropper.addClass(D.wasCreateClass)), e, opt, hashChange);
                else if (opt.html) {
                    dropper = methods._pasteDropper(opt, opt.pattern);
                    dropper.find($(opt.placePaste)).html(opt.html);
                    methods._show.call($this, dropper, e, opt, hashChange);
                }
                else if (opt.href && (!D.droppers[hrefC] || opt.always))
                    methods._get.call($this, opt, e, hashChange);
                else if (D.existsN(dropper) || opt.href && D.droppers[hrefC])
                    methods._show.call($this, methods._pasteDropper(opt, D.existsN(dropper) ? dropper.addClass(D.wasCreateClass) : D.droppers[hrefC].clone()), e, opt, hashChange);
                else if (opt.header || opt.content || opt.footer)
                    methods._show.call($this, methods._pasteDropper(opt, opt.pattern), e, opt, hashChange);
                else
                    throw 'Insufficient data';
            };

            function _show() {
                if ($this.is(':disabled') || opt.dropper && opt.start && !eval(opt.start).call($this, opt, dropper, e))
                    return;
                if (opt.prompt || opt.confirm || opt.alert) {
                    elSet.droppern = elSet.dropper;
                    opt.dropper = opt.tempClassS;
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
        _show: function (dropper, e, opt, hashChange) {
            if (!opt.moreOne && D.exists(D.aDS))
                methods.close.call($(D.aDS), 'close more one element', $.proxy(_show, this));
            else
                _show.call(this);
            function _show() {
                if (!D.existsN(dropper))
                    return false;
                e = e ? e : window.event;
                var $this = this;
                if (opt.overlay) {
                    if (!D.exists('[data-rel="' + opt.tempClassS + '"].dropper-overlay'))
                        $('body').append($('<div/>', {
                            'class': 'dropper-overlay',
                            'data-rel': opt.tempClassS
                        }));
                    opt.dropperOver = $('[data-rel="' + opt.tempClassS + '"].dropper-overlay').css({
                        'background-color': opt.overlayColor,
                        'opacity': opt.overlayOpacity,
                        'z-index': 1103 + D.cOD
                    });
                }
                dropper.data('drp', opt).attr('data-rel', opt.rel).css('z-index', 1104 + D.cOD).attr('data-elrun', opt.dropper).addClass(D.pC + opt.place).addClass(opt.addClass);
                if (opt.context)
                    dropper.addClass(D.pC + 'context');
                if (opt.notify)
                    dropper.addClass(D.pC + 'notify');
                if (opt.rel)
                    methods._checkMethod(function () {
                        methods.gallery(dropper, opt);
                    });
                methods._setHeightAddons(opt.dropperOver);
                methods._pasteContent($this, dropper, opt);
                methods._positionType(dropper);
                var ev = opt.dropper ? opt.dropper.replace(D.reg, '') : '';
                if (opt.hash && !hashChange) {
                    D.scrollTop = wnd.scrollTop();
                    var wLH = window.location.hash;
                    wnd.off('hashchange.' + $.dropper.nS);
                    if (opt.hash.indexOf('#') !== -1 && (new RegExp(opt.hash + '#|' + opt.hash + '$').exec(wLH) === null))
                        window.location.hash = wLH + opt.hash;
                    wnd.scrollTop(D.scrollTop);
                    setTimeout(methods._setEventHash, 0);
                }
                wnd.off('resize.' + $.dropper.nS + ev).on('resize.' + $.dropper.nS + ev, function () {
                    methods.update.call(dropper);
                }).off('scroll.' + $.dropper.nS + ev).on('scroll.' + $.dropper.nS + ev, function () {
                    if (opt.place === 'center' && opt.centerOnScroll)
                        methods['_' + opt.place].call(dropper);
                });
                $(opt.dropperOver).fadeIn(100).off('click.' + $.dropper.nS + ev).on('click.' + $.dropper.nS + ev, function (e) {
                    e.stopPropagation();
                    if (opt.closeClick && $(e.target).is('.dropper-overlay'))
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
                    elFocus = dropper.find(elFocus);
                    if (opt.prompt) {
                        elFocus.val(opt.promptInputValue);
                        dropper.find('form').off('submit.' + $.dropper.nS + ev).on('submit.' + $.dropper.nS + ev, function (e) {
                            e.preventDefault();
                        });
                    }
                    var focusFunc = function () {
                        elFocus.focus();
                    };
                    setTimeout(focusFunc, 0);
                }
                opt.exit = $.type(opt.exit) === 'string' ? dropper.find(opt.exit) : opt.exit;
                if (D.existsN(opt.exit)) {
                    opt.exit.off('click.' + $.dropper.nS).on('click.' + $.dropper.nS, function (e) {
                        e.stopPropagation();
                        methods.close.call($(this).closest('[data-elrun]'), e);
                    });
                }
                if (opt.context)
                    dropper.add(opt.dropperOver).off('contextmenu.' + $.dropper.nS).on('contextmenu.' + $.dropper.nS, function (e) {
                        e.preventDefault();
                    });

                var dropperWH = opt.type === 'iframe' ? dropper.find('iframe') : dropper;
                if (opt.width)
                    dropperWH.css('width', opt.width);
                if (opt.height)
                    dropperWH.css('height', opt.height);
                $('html, body').css({'height': '100%'});
                if (opt.limitSize)
                    methods._checkMethod(function () {
                        methods.limitSize(dropper);
                    });
                if (opt.placeBeforeShow)
                    methods._checkMethod(function () {
                        methods.placeBeforeShow(dropper, $this, opt);
                    });
                if (opt.place !== 'inherit')
                    methods['_' + opt.place].call(dropper);
                if (opt.before)
                    eval(opt.before).call($this, opt, dropper, e);
                dropper.trigger('dropperBefore', {
                    event: e,
                    anchor: $this,
                    dropper: dropper,
                    options: opt,
                    methods: methods
                });
                methods._disableScroll(opt);
                $('.dropper-overlay.' + D.pC + 'for-remove').stop().remove();
                dropper[opt.effectOn](opt.durationOn, function () {
                    D.cOD++;
                    D.busy = false;
                    var dropper = $(this);
                    if (opt.type === 'iframe')
                        dropperWH.attr('src', opt.href);
                    $('html, body').css({'overflow': '', 'overflow-x': ''});
                    methods._setHeightAddons(opt.dropperOver);
                    var inDropper = opt.type === 'iframe' ? dropper.find('iframe').contents().find(D.selAutoInit) : dropper.find(D.selAutoInit);
                    if (D.existsN(inDropper))
                        methods.init.call(inDropper);
                    dropper.add($this).addClass(D.activeClass);
                    D.activeDropper.unshift(opt.dropper);
                    var _decoratorClose = function (e, cond) {
                        if (opt.place === 'inherit' && !opt.inheritClose)
                            return;
                        if (cond)
                            methods.close.call(opt.closeAll && D.activeDropper.length ? null : $(D.activeDropper[0]), e);
                    };
                    D.activeDropperCEsc[opt.dropper] = function (e) {
                        _decoratorClose(e, opt.closeEsc && e.keyCode === 27);
                    };
                    D.activeDropperCClick[opt.dropper] = function (e) {
                        _decoratorClose(e, !D.existsN($(e.target).closest('[data-elrun]')));
                    };
                    if (opt.notify && !isNaN(opt.notifyclosetime))
                        D.notifyTimeout[opt.dropper] = setTimeout(function () {
                            methods.close.call(dropper, 'close notify setTimeout');
                        }, opt.notifyclosetime);
                    if (opt.droppable && opt.place !== 'inherit')
                        methods.droppable(dropper);
                    if (opt.after)
                        eval(opt.after).call($this, opt, dropper, e);
                    dropper.trigger('dropperAfter', {
                        event: e,
                        anchor: $this,
                        dropper: dropper,
                        options: opt,
                        methods: methods
                    });
                });
            }

            return this;
        },
        close: function (e, f, hashChange, force) {
            var sel = this,
                droppers = D.existsN(sel) ? sel : $('[data-elrun].' + D.activeClass);
            var closeLength = droppers.length;
            droppers.each(function (i) {
                var dropper = $(this),
                    opt = $.extend({}, dropper.data('drp'));
                if (!dropper.data('drp') || hashChange && opt.hash && window.location.hash.indexOf(opt.hash) !== -1)
                    return;
                var _hide = function () {
                    if (opt.notify && D.notifyTimeout[opt.dropper]) {
                        clearTimeout(D.notifyTimeout[opt.dropper]);
                        delete D.notifyTimeout[opt.dropper];
                    }
                    D.enableScroll();
                    if (opt.type === 'iframe')
                        dropper.find('iframe').removeAttr('src');
                    var ev = opt.dropper ? opt.dropper.replace(D.reg, '') : '';
                    wnd.off('resize.' + $.dropper.nS + ev).off('scroll.' + $.dropper.nS + ev);
                    D.activeDropper.splice($.inArray(opt.dropper, D.activeDropper), 1);
                    delete D.activeDropperCEsc[opt.dropper];
                    delete D.activeDropperCClick[opt.dropper];
                    if (D.activeDropper[0] && $(D.activeDropper[0]).data('drp'))
                        methods._disableScroll($(D.activeDropper[0]).data('drp'));
                    dropper.add(opt.elrun).removeClass(D.activeClass);
                    if (opt.hash && !hashChange) {
                        D.scrollTop = wnd.scrollTop();
                        wnd.off('hashchange.' + $.dropper.nS);
                        window.location.hash = window.location.hash.replace(new RegExp(opt.hash + '($|\b)', 'ig'), '').replace(new RegExp(opt.hash + '#', 'ig'), '#');
                        wnd.scrollTop(D.scrollTop);
                        setTimeout(methods._setEventHash, 0);
                    }
                    if (opt.placeAfterClose)
                        methods._checkMethod(function () {
                            methods.placeAfterClose(dropper, opt.elrun, opt);
                        });
                    dropper[opt.effectOff](force ? 0 : opt.durationOff, function () {
                        D.busy = false;
                        $('html, body').css({'overflow': '', 'overflow-x': ''});
                        var $this = $(this);
                        methods._resetStyleDropper.call($(this));
                        if (opt.closed)
                            eval(opt.closed).call(opt.elrun, opt, $this, e);
                        $this.trigger('dropperClosed', {
                            event: e,
                            anchor: opt.elrun,
                            dropper: $this,
                            options: opt,
                            methods: methods
                        });
                        var dC = $this.find($(opt.placeContent)).data('jsp');
                        if (dC)
                            dC.destroy();
                        if (!D.exists(D.aDS))
                            $('html, body').css({'height': ''});
                        if (!opt.filter)
                            $this.removeClass(opt.tempClass);
                        if (!opt.elrun.data('droppern'))
                            opt.elrun.data('dropper', null);
                        if (opt.elrun.hasClass(D.tempClass))
                            opt.elrun.remove();
                        $this.data('drp', null);
                        if (!$this.hasClass(D.wasCreateClass))
                            $this.remove();
                        var condCallback = i === closeLength - 1 && $.isFunction(f);
                        if (opt.dropperOver) {
                            opt.dropperOver.addClass(D.pC + 'for-remove').fadeOut(force ? 0 : opt.durationOff, function () {
                                $(this).remove();
                            });
                            if (condCallback)
                                setTimeout(f, force ? 0 : opt.durationOff + 100);
                        }
                        else if (condCallback)
                            f();
                    });
                };
                dropper.trigger('dropperClose', {
                    event: e,
                    anchor: opt.elrun,
                    dropper: dropper,
                    options: opt,
                    methods: methods
                });
                if (opt.close) {
                    var res = eval(opt.close).call(opt.elrun, opt, dropper, e);
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
            var dropper = this,
                drp = dropper.data('drp');
            if (!drp)
                return false;
            if (drp.isFullScreen)
                return false;
            if (drp.limitSize)
                methods._checkMethod(function () {
                    methods.limitSize(dropper);
                });
            if (drp.place !== 'inherit')
                methods._checkMethod(function () {
                    methods['_' + drp.place].call(dropper);
                }, drp.place);
            methods._setHeightAddons(drp.dropperOver);
        },
        _center: function () {
            return this.each(function () {
                var dropper = $(this),
                    drp = dropper.data('drp');
                if (!drp)
                    return false;
                var method = drp.animate || drp.placeBeforeShow ? 'animate' : 'css',
                    dropperV = dropper.is(':visible'),
                    w = dropperV ? dropper.outerWidth() : dropper[D.actual]('outerWidth'),
                    h = dropperV ? dropper.outerHeight() : dropper[D.actual]('outerHeight'),
                    wndT = wnd.scrollTop(),
                    wndL = wnd.scrollLeft(),
                    top = Math.floor((wnd.height() - h) / 2),
                    left = Math.floor((wnd.width() - w) / 2);
                top = top > 0 ? top + wndT : wndT;
                left = left > 0 ? left + wndL : wndL;

                dropper[method]({
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
                var dropper = $(this),
                    drp = dropper.data('drp');
                if (!drp && drp.droppableIn)
                    return false;
                var method = drp.animate || drp.placeBeforeShow ? 'animate' : 'css',
                    $this = drp.elrun,
                    t = 0,
                    l = 0,
                    $thisW = $this.width(),
                    $thisH = $this.height(),
                    dropperW = +dropper[D.actual]('outerWidth'),
                    dropperH = +dropper[D.actual]('outerHeight'),
                    wndT = wnd.scrollTop(),
                    wndL = wnd.scrollLeft(),
                    offTop = $this.offset().top,
                    offLeft = $this.offset().left,
                    $thisT = 0,
                    $thisL = 0;
                if (!dropper.is(':visible'))
                    dropper.css({top: 'auto', bottom: 'auto', left: 'auto', right: 'auto'});
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
                    dropper[method](temp, {
                        duration: drp.durationOn,
                        queue: false
                    });
                }
                else {
                    var pmt = drp.placement.toLowerCase().split(' ');
                    if (pmt[1] === 'top')
                        t = -dropperH;
                    if (pmt[1] === 'bottom')
                        t = $thisH;
                    if (pmt[0] === 'left')
                        l = 0;
                    if (pmt[0] === 'right')
                        l = -dropperW + $thisW;
                    if (pmt[0] === 'center')
                        l = -dropperW / 2 + $thisW / 2;
                    if (pmt[1] === 'center')
                        t = -dropperH / 2 + $thisH / 2;
                    $thisT = offTop + t;
                    $thisL = offLeft + l;
                    if ($thisL < 0)
                        $thisL = 0;
                    dropper[method]({
                        'top': $thisT,
                        'left': $thisL
                    }, {
                        duration: drp.durationOn,
                        queue: false
                    });
                }
            });
        },
        _resetStyleDropper: function () {
            return this.stop().css({
                'z-index': '',
                'top': '', 'left': '',
                'bottom': '',
                'right': '',
                'position': '',
                'box-sizing': ''
            });
        },
        _pasteNotify: function (datas, opt, hashChange, e) {
            if (!$.isFunction(opt.handlerNotify))
                return false;
            var dropper = methods._pasteDropper(opt, opt.pattern);
            opt.handlerNotify.call($(this), datas, opt);
            return methods._show.call($(this), dropper, e, opt, hashChange);
        },
        _pasteDropper: function (opt, dropper) {
            dropper = $(dropper);
            if (opt.droppern)
                dropper = D.existsN(dropper.filter(opt.dropper)) ? dropper.filter(opt.dropper) : (D.existsN(dropper.find(opt.dropper)) ? dropper.find(opt.dropper) : dropper);
            if (opt.place !== 'inherit')
                dropper.appendTo($('body'));
            else if (opt.placeInherit)
                $(opt.placeInherit)[opt.methodPlaceInherit](dropper);
            return dropper.hide().addClass(opt.tempClass).addClass('dropper').attr('data-elrun', opt.dropper);
        },
        _pasteContent: function ($this, dropper, opt) {
            var _checkCont = function (place) {
                if (place.is(':empty'))
                    place.removeClass(D.noEmptyClass).addClass(D.emptyClass);
                else
                    place.addClass(D.noEmptyClass).removeClass(D.emptyClass);
            };
            var _pasteContent = function (content, place) {
                place = dropper.find(place).first();
                if (!D.existsN(place))
                    return false;
                _checkCont(place);
                if (!content)
                    return false;
                _checkCont(place.empty().html(function () {
                    try {
                        if ($.type(eval(content)) === 'function')
                            return eval(content).call(place, opt, dropper, $this);
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
        _setHeightAddons: function (dropperOver) {
            $(dropperOver).css({width: '', height: ''}).css({width: wnd.width(), height: doc.height()});
        },
        _checkMethod: function (f) {
            try {
                f();
            } catch (e) {
                var method = f.toString().match(/\.\S*\(/);
                throw  'Need connected "' + method[0].substring(1, method[0].length - 1) + '" method';
            }
            return this;
        },
        _positionType: function (dropper) {
            if (dropper.data('drp') && dropper.data('drp').place !== 'inherit')
                dropper.css({
                    'position': dropper.data('drp').position
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
            wnd.off('hashchange.' + $.dropper.nS).on('hashchange.' + $.dropper.nS, function (e) {
                e.preventDefault();
                if (D.scrollTop)
                    $('html, body').scrollTop(D.scrollTop);
                D.wLHN = window.location.hash;
                for (var i in D.hashs) {
                    if (D.wLH.indexOf(i) === -1 && D.wLHN.indexOf(i) !== -1)
                        methods.open.call(D.hashs[i], null, e, true);
                    else
                        methods.close.call($(D.hashs[i].data('dropper')).add(D.hashs[i].data('dropperConfirmPromptAlert')), e, null, true);
                }
                D.wLH = D.wLHN;
            });
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
                if ($.inArray(opt.href, D.gallery[opt.rel]) === -1)
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
    $.fn.dropper = function (method) {
        if (methods[method]) {
            if (!/_/.test(method))
                return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            else
                throw 'Method ' + method + ' is private on $.dropper';
        }
        else if ($.type(method) === 'object' || !method)
            return methods.init.apply(this, arguments);
        else
            throw "Method " + method + " doesn't exist on $.dropper";
    };
    $.dropper = function (m, opt) {
        if (!opt)
            opt = {};
        var set;
        if (D.existsN(m))
            set = {'dropper': m};
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
                        throw 'Insufficient data';
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
            throw 'Insufficient data';
        return methods.open.call(null, $.extend(opt, set), 'API');
    };
    $.dropper.nS = 'dropper';
    $.dropper.version = '1.0';
    $.dropper.dP = {
        dropper: null,
        html: null,
        addClas: null,
        href: null,
        hash: null,
        placeContent: '.dropper-content',
        placeHeader: '.dropper-header',
        placeFooter: '.dropper-footer',
        placePaste: '.placePaste',
        header: null,
        footer: null,
        content: null,
        placeInherit: null,
        methodPlaceInherit: 'html',
        filter: null,
        message: {
            success: function (text) {
                return '<div class= "dropper-msg"><div class="dropper-success"><span class="dropper-icon-notify"></span><div class="dropper-text-el">' + text + '</div></div></div>';
            },
            warning: function (text) {
                return '<div class= "dropper-msg"><div class="dropper-warning"><span class="dropper-icon-notify"></span><div class="dropper-text-el">' + text + '</div></div></div>';
            },
            error: function (text) {
                return '<div class="dropper-msg"><div class="dropper-error"><span class="dropper-icon-notify"></span><div class="dropper-text-el">' + text + '</div></div></div>';
            },
            info: function (text) {
                return '<div class="dropper-msg"><div class="dropper-info"><span class="dropper-icon-notify"></span><div class="dropper-text-el">' + text + '</div></div></div>';
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
        pattern: '<div class="dropper dropper-simple"><button type="button" class="dropper-close" data-closed><span class="dropper-icon-close">&#215;</span></button><button class="dropper-prev" type="button" style="display: none;"><i class="dropper-icon-prev">&#60;</i></button><button class="dropper-next" type="button" style="display: none;"><i class="dropper-icon-next">&#62;</i></button><div class="dropper-header"></div><div class="dropper-content"><div class="inside-padd placePaste"></div></div><div class="dropper-footer"></div></div>',
        patternConfirm: '<div class="dropper dropper-confirm"><button type="button" class="dropper-close" data-closed><span class="dropper-icon-close">&#215;</span></button><button class="dropper-prev" type="button" style="display: none;"><i class="dropper-icon-prev">&#60;</i></button><button class="dropper-next" type="button" style="display: none;"><i class="dropper-icon-next">&#62;</i></button><div class="dropper-header">Confirm</div><div class="dropper-content"><div class="inside-padd"><div class="placePaste"></div><div class="dropper-group-btns"><button type="button" class="dropper-button-confirm" data-button-confirm>ok</button><button type="button" class="dropper-btn-cancel" data-closed>cancel</button></div></div></div><div class="dropper-footer"></div></div>',
        patternPrompt: '<div class="dropper dropper-prompt"><button type="button" class="dropper-close" data-closed><span class="dropper-icon-close">&#215;</span></button><button class="dropper-prev" type="button" style="display: none;"><i class="dropper-icon-prev">&#60;</i></button><button class="dropper-next" type="button" style="display: none;"><i class="dropper-icon-next">&#62;</i></button><div class="dropper-header">Prompt</div><div class="dropper-content"><form class="inside-padd"><div class="placePaste"></div><input type="text" name="promptInput"/><div class="dropper-group-btns"><button data-button-prompt type="submit" class="dropper-button-prompt">ok</button><button type="button" data-closed class="dropper-btn-cancel">cancel</button></div></form></div><div class="dropper-footer"></div></div>',
        patternAlert: '<div class="dropper dropper-alert"><button type="button" class="dropper-close" data-closed><span class="dropper-icon-close">&#215;</span></button><button class="dropper-prev" type="button" style="display: none;"><i class="dropper-icon-prev">&#60;</i></button><button class="dropper-next" type="button" style="display: none;"><i class="dropper-icon-next">&#62;</i></button><div class="dropper-header">Alert</div><div class="dropper-content"><div class="inside-padd"><div class="placePaste"></div><div class="dropper-group-btns"><button type="button" class="dropper-button-alert" data-button-alert>ok</button></div></div></div><div class="dropper-footer"></div></div>',
        confirmActionBtn: '[data-button-confirm]',
        promptActionBtn: '[data-button-prompt]',
        alertActionBtn: '[data-button-alert]',
        dataPrompt: null,
        promptInput: '[name="promptInput"]',
        promptInputValue: null,
        exit: '[data-closed]',
        next: '.dropper-next',
        prev: '.dropper-prev',
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
            $(opt.dropper).find(opt.placePaste).empty().append(text);
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
        rel: null,
        fullScreen: true,
        loadingAnimate: true
    };
    $.dropper.drp = {
        handlerMessageWindow: function (e) {
            if ($.type(e.originalEvent.data) === 'object')
                return $.dropper(e.originalEvent.data);
        },
        regImg: /(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i,
        mainStyle: '#dropper-loading {position: fixed;top: 50%;left: 50%;width: 40px;height: 40px;margin-top: -20px;margin-left: -20px;cursor: pointer;overflow: hidden;z-index: 11104;display: none;}\n\
                    #dropper-loading div{position: absolute;top: 0;left: 0;width: 480px;height: 40px;}\n\
                    .dropper{display: none;}.dropper-overlay{display:none;position:absolute;width:100%;left:0;top:0;}',
        reg: /[^a-zA-Z0-9]+/ig,
        autoPlayInterval: {},
        hashs: {},
        droppers: {},
        gallery: {},
        galleryOpt: {},
        galleryHashs: {},
        notifyTimeout: {},
        activeDropperCEsc: {},
        activeDropperCClick: {},
        isD: 'isDropper',
        pC: 'dropper-',
        activeClass: 'dropper-active',
        aDS: '[data-elrun].dropper-center:visible, [data-elrun].dropper-global:visible',
        selAutoInit: '[data-dropper], [data-html]',
        tempClass: 'dropper-temp',
        wasCreateClass: 'dropper-was-create',
        emptyClass: 'dropper-empty',
        noEmptyClass: 'dropper-no-empty',
        activeDropper: [],
        cOD: 0,
        disableScroll: function () {
            if (D.isTouch)
                return false;
            var self = this;
            self.enableScroll();
            wnd.add(doc).on('mousewheel.scr' + $.dropper.nS, function (e) {
                if (!($(e.target).is('[data-elrun]') || D.existsN($(e.target).closest('[data-elrun]'))))
                    e.preventDefault();
            });
            D.scrollTop = wnd.scrollTop();
            D.scrollLeft = wnd.scrollLeft();
            wnd.on('scroll.scr' + $.dropper.nS, function () {
                $('html, body').scrollTop(D.scrollTop).scrollLeft(D.scrollLeft);
            });
            return self;
        },
        enableScroll: function () {
            if (D.isTouch)
                return false;
            wnd.off('scroll.scr' + $.dropper.nS).add(doc).off('mousewheel.scr' + $.dropper.nS);
            return this;
        },
        isTouch: document.createTouch !== undefined,
        existsN: function (nabir) {
            return nabir && nabir.length > 0 && nabir instanceof $;
        },
        exists: function (selector) {
            return $(selector).length > 0 && $(selector) instanceof $;
        }
    };
    var D = $.dropper.drp,
        DP = $.dropper.dP;
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
    $.dropper.setParameters = function (options) {
        $.extend(DP, options);
        return this;
    };
    $.dropper.setMethod = function (n, v) {
        var nm = {};
        nm[n] = v;
        $.extend(methods, nm);
        return this;
    };
    $.dropper.getMethods = function () {
        var public = {};
        for (var i in methods)
            if (!/_/.test(i))
                public[i] = methods[i];
        return public;
    };
    $.dropper.close = function (el, force) {
        return methods.close.call(el ? $(el) : null, 'artificial close element', 'API', null, force);
    };
    $.dropper.cancel = function () {
        if (D.curAjax)
            D.curAjax.abort();
        D.curAjax = null;
        if (D.imgPreload)
            D.imgPreload.onload = D.imgPreload.onerror = null;
        $.dropper.hideLoading();
        return this;
    };
    $.dropper.update = function (el) {
        return (el ? $(el) : $('[data-elrun].' + D.activeClass)).each(function () {
            methods.update.call($(this));
        });
    };
    doc.ready(function () {
        $('<style>', {html: D.mainStyle.replace(/\s{2,}/g, ' ')}).appendTo($('body'));
        D.scrollTop = wnd.scrollTop();
        var loadingTimer, loadingFrame = 1,
            loading = $('<div/>', {
                id: 'dropper-loading'
            }).append($('<div/>')).appendTo($('body'));
        var _animate_loading = function () {
            if (!loading.is(':visible') && DP.loadingAnimate) {
                clearInterval(loadingTimer);
                return;
            }
            $('div', loading).css('left', (loadingFrame * -40) + 'px');
            loadingFrame = (loadingFrame + 1) % 12;
        };
        $.dropper.showLoading = function () {
            loading.show();
            if (DP.loadingAnimate) {
                clearInterval(loadingTimer);
                loadingTimer = setInterval(_animate_loading, 66);
            }
            return this;
        };
        $.dropper.hideLoading = function () {
            loading.hide();
            return this;
        };
    }).on('keyup.' + $.dropper.nS, function (e) {
        if (e.bubbles && D.activeDropper[0] && D.activeDropperCEsc[D.activeDropper[0]])
            D.activeDropperCEsc[D.activeDropper[0]](e);
    }).on('click.' + $.dropper.nS, function (e) {
        var $this = $(e.target);
        if (!D.existsN($this.closest('[data-elrun]')) && !$this.is('[data-elrun]') && $this.is(':visible') && e.bubbles && D.activeDropper[0] && D.activeDropperCClick[D.activeDropper[0]])
            D.activeDropperCClick[D.activeDropper[0]](e);
    });
    wnd.on('load.' + $.dropper.nS, function () {
        setTimeout(function () {
            var autoInitObject = $(D.selAutoInit).not('.' + D.isD);
            if (D.existsN(autoInitObject)) {
                autoInitObject.dropper();
            }
        }, 0);
    }).on('message.' + $.dropper.nS, D.handlerMessageWindow);
})(jQuery, jQuery(window), jQuery(document));