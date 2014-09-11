/*plugin drop*/
(function($, wnd, doc) {
    (function($) {
        $.fn.actual = function() {
            if (arguments.length && $.type(arguments[0]) === 'string') {
                var dim = arguments[0],
                        clone = this.clone();
                if (arguments[1] === undefined)
                    clone.css({
                        position: 'absolute',
                        top: '-9999px'
                    }).show().appendTo($('body'));
                var dimS = clone[dim]();
                clone.remove();
                return dimS;
            }
            return undefined;
        };
    })(jQuery);
    $.existsN = function(nabir) {
        return nabir && nabir.length > 0 && nabir instanceof jQuery;
    };
    $.exists = function(selector) {
        return $(selector).length > 0 && $(selector) instanceof jQuery;
    };
    var returnMsg = function(msg) {
        if (window.console)
            console.log(msg);
    };
    var IE = navigator.userAgent.match(/msie/i);
    var methods = {
        init: function(options) {
            var set = $.extend({}, DP, options);
            if (!$.existsN(this)) {
                returnMsg('this object is not a jQuery object');
                return false;
            }

            return this.each(function() {
                var el = methods.destroy.call($(this)),
                        opt = $.extend({}, set, el.data());
                el.data('drp', $.extend({}, set, {genOpt: $.extend({}, opt)}));

                var rel = this.rel || opt.rel,
                        hash = el.data('hash');
                if (rel) {
                    rel = rel.replace(D.reg, '');
                    var href = el.data('href') || el.attr('href');

                    if (href) {
                        if (!D.galleries[rel])
                            D.galleries[rel] = [];
                        if (!D.galleryHashs[rel] && hash)
                            D.galleryHashs[rel] = [];

                        if (D.galleries[rel].indexOf(href) === -1 && href.match(D.regImg))
                            D.galleries[rel].push(href);
                        if (hash)
                            D.galleryHashs[rel].push(hash);
                    }
                }
                else if (hash && $.inArray(hash, D.galleryHashs._butRel) === -1)
                    D.galleryHashs._butRel.push(hash);

                el.addClass('isDrop');
                if (opt.context) {
                    el.on('contextmenu.' + $.drop.nS, function(e) {
                        e.preventDefault();
                    });
                    el.on('mouseup.' + $.drop.nS, function(e) {
                        e.preventDefault();
                        if (e.button === 2)
                            methods.open.call($(this), opt, e);
                    });
                }
                else {
                    if (opt.triggerOn || opt.triggerOff)
                        el.on(opt.triggerOn + '.' + $.drop.nS + ' ' + opt.triggerOff + '.' + $.drop.nS, function(e) {
                            e.stopPropagation();
                            e.preventDefault();
                        }).on(opt.triggerOn + '.' + $.drop.nS, function(e) {
                            methods.open.call($(this), opt, e);
                        }).on(opt.triggerOff + '.' + $.drop.nS, function(e) {
                            methods.close.call($(el.attr('data-drop')), e);
                        });
                    else
                        el.on(opt.trigger + '.' + $.drop.nS, function(e) {
                            methods.open.call($(this), opt, e);
                            e.stopPropagation();
                            e.preventDefault();
                        });
                }
                if (/#/.test(opt.hash) && !D.hashs[opt.hash])
                    D.hashs[opt.hash] = el;
            }).each(function() {
                var opt = $.extend({}, $(this).data('drp').genOpt);
                if (window.location.hash.indexOf(opt.hash) !== -1)
                    methods.open.call($(this), opt, null);
            });
        },
        destroy: function(el) {
            return (el || this).each(function() {
                var el = $(this),
                        opt = $(el).data('drp');
                el.removeClass('isDrop').removeData('drp');
                if (opt)
                    opt = opt.genOpt;
                if (!opt)
                    return;
                if (opt.trigger)
                    el.off(opt.trigger + '.' + $.drop.nS);
                if (opt.triggerOn)
                    el.off(opt.triggerOn + '.' + $.drop.nS);
                if (opt.triggerOff)
                    el.off(opt.triggerOff + '.' + $.drop.nS);
                el.off('contextmenu.' + $.drop.nS).off('mouseup.' + $.drop.nS);
            });
        },
        _get: function(opt, e, hashChange, cLS) {
            var el = this;
            function _update(data, cLS) {
                if (opt.dropn)
                    var drop = methods._pasteDrop(opt, data, cLS);
                else
                    drop = methods._pasteDrop(opt, opt.pattern, cLS);
                if (!opt.dropn)
                    drop.find($(opt.placePaste)).html(data);
                if (opt.href && !opt.always && !opt.notify)
                    D.drops[opt.href.replace(D.reg, '')] = drop.clone();

                doc.trigger({
                    type: 'successHtml.' + $.drop.nS,
                    drp: {
                        refer: el,
                        drop: drop,
                        options: opt,
                        datas: data
                    }
                });
                methods._show.call(el, drop, e, opt, hashChange);
            }
            if (D.drops[opt.href.replace(D.reg, '')]) {
                methods._show.call(el, methods._pasteDrop(opt, D.drops[opt.href.replace(D.reg, '')]), e, opt, hashChange);
                return el;
            }
            $.drop.showLoading();
            var _getImage = function() {
                opt.type = 'image';
                var img = D.imgPreload = new Image();
                img.onload = function() {
                    $.drop.hideLoading();
                    this.onload = this.onerror = null;
                    _update($(this), cLS);
                };
                img.onerror = function() {
                    this.onload = this.onerror = null;
                    $.drop.hideLoading();
                    methods.open.call(null, {notify: true, datas: {answer: 'error', data: 'image is not found'}});
                };
                img.src = opt.href + (opt.always ? '?' + (+new Date()) : '');
            };
            var _getAjax = function() {
                opt.type = 'ajax';
                D.curAjax.push($.ajax($.extend({}, opt.ajax, {
                    url: opt.href,
                    dataType: opt.ajax.dataType ? opt.ajax.dataType : (opt.notify ? 'json' : 'html'),
                    success: function(data) {
                        $.drop.hideLoading();
                        if (opt.notify)
                            methods._pasteNotify.call(el, data, opt, hashChange, e, cLS);
                        else
                            _update(data, cLS);
                    },
                    error: function() {
                        $.drop.hideLoading();
                        if (arguments[2].message)
                            methods.open.call(null, {notify: true, datas: {answer: 'error', data: arguments[2].message}});
                    }
                })));
            };
            var _getIframe = function() {
                opt.type = 'iframe';
                var iframe = $(opt.patternIframe).attr('src', opt.href).one('load.' + $.drop.nS, function() {
                    $.drop.hideLoading();
                });
                opt.dropn = true;
                _update(iframe, cLS);
            };
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
        open: function(opt, e, hashChange) {
            var $this = $(this),
                    elSet = $this.data();
            opt = $.extend({}, DP, $.existsN($this) && $this.data('drp') ? $this.data('drp').genOpt : {}, opt);
            e = e ? e : window.event;

            var cLS = opt.defaultClassBtnDrop + (+new Date());

            if (elSet.dropn !== null)
                elSet.dropn = opt.drop;

            $.extend(opt, elSet);

            opt.drop = opt.drop && $.type(opt.drop) === 'string' && !opt.notify ? opt.drop : '.' + cLS;
            if (!this || this && this.constructor !== jQuery || opt.notify)
                $this = methods._referCreate(opt.drop);

            if (opt.context) {
                $.extend(opt, {place: 'global', limitSize: true, overlay: false});
                if (e && e.pageX >= 0)
                    opt.placement = {'left': parseInt(e.pageX), 'top': parseInt(e.pageY)};
                else
                    opt.placement = {'left': $this.offset().left, 'top': $this.offset().top};
            }

            opt.href = opt.href || $this.attr('href');
            opt.elrun = $this;
            opt.rel = $this.get(0).rel || opt.rel;

            if (opt.rel && D.galleries[opt.rel.replace(D.reg, '')])
                opt.rel = opt.rel.replace(D.reg, '');
            var hrefC = opt.href ? opt.href.replace(D.reg, '') : null;

            if (opt.dropFilter) {
                if ($this.hasClass('drop-filter'))
                    elSet.dropn = opt.drop;
                else {
                    methods._filterSource($this, opt.dropFilter).addClass(cLS);
                    elSet.dropn = opt.drop = '.' + cLS;
                    $this.addClass('drop-filter');
                }
            }

            $this.attr('data-drop', opt.drop).data('drop', opt.drop);
            var drop = $(elSet.dropn);

            function _confirmF() {
                if (opt.href && (!$.existsN(drop) || !D.drops[hrefC] || opt.always || opt.notify))
                    methods._get.call($this, opt, e, hashChange, cLS);
                else if ($.existsN(drop)) {
                    drop = methods._pasteDrop(opt, $.existsN(drop) ? drop.addClass(D.wasCreateClass) : D.drops[hrefC]);
                    methods._show.call($this, drop, e, opt, hashChange);
                }
            }

            if (opt.closeActiveClick && $this.hasClass(DP.activeClass) && drop.hasClass(DP.activeClass) && drop.length === 1) {
                methods.close.call($($this.data('drop')), 'element already open');
                return $this;
            }
            function _show() {
                if ($this.is(':disabled') || opt.drop && opt.start && !eval(opt.start).call($this, drop, opt, e))
                    return $this;

                if (opt.notify && opt.datas)
                    return methods._pasteNotify.call($this, opt.datas, opt, hashChange, e, cLS);

                if (opt.dropFilter)
                    methods._show.call($this, drop, e, opt, hashChange);
                else if (opt.html) {
                    drop = methods._pasteDrop(opt, opt.pattern, cLS);
                    drop.find($(opt.placePaste)).html(opt.html);
                    methods._show.call($this, drop, e, opt, hashChange);
                }
                else if (opt.prompt || opt.confirm || opt.href && (!$.existsN(drop) || opt.always || opt.notify)) {
                    if (!opt.confirm && !opt.prompt)
                        _confirmF();
                    else
                        methods._checkMethod(function() {
                            methods.confirmPrompt(opt, hashChange, _confirmF, e, $this);
                        });
                }
                else if ($.existsN(drop) || opt.href && D.drops[hrefC]) {
                    drop = methods._pasteDrop(opt, $.existsN(drop) ? drop.addClass(D.wasCreateClass) : D.drops[hrefC], cLS);
                    methods._show.call($this, drop, e, opt, hashChange);
                }
                else
                    returnMsg('insufficient data');
            }
            if (!opt.moreOne && $.exists(D.aDS))
                return methods.close.call($(D.aDS), 'close more one element', _show);
            return _show();
        },
        _show: function(drop, e, opt, hashChange) {
            if (!$.existsN(drop))
                return false;
            var $this = this,
                    elSet = $this.data();
            e = e ? e : window.event;
            //callbacks for element, options and global DP
            opt.elBefore = elSet.elBefore;
            opt.elAfter = elSet.elAfter;
            opt.elClose = elSet.elClose;
            opt.elClosed = elSet.elClosed;
            //
            opt.beforeG = DP.beforeG;
            opt.afterG = DP.afterG;
            opt.closeG = DP.closeG;
            opt.closedG = DP.closedG;

            var overlays = $('.overlayDrop').css('z-index', 1103),
                    dropOver = null;
            if (opt.overlay) {
                if (!$.exists('[data-rel="' + opt.drop + '"].overlayDrop'))
                    $('body').append('<div class="overlayDrop" data-rel="' + opt.drop + '" style="display:none;position:absolute;width:100%;left:0;top:0;"></div>');
                (opt.dropOver = dropOver = $('[data-rel="' + opt.drop + '"].overlayDrop')).css({
                    'height': '',
                    'background-color': opt.overlayColor,
                    'opacity': opt.overlayOpacity,
                    'z-index': overlays.length + 1103
                });
            }

            $('.forCenter').css('z-index', 1104);
            var forCenter = null;
            if (opt.place === 'center')
                (forCenter = opt.forCenter = $('[data-rel="' + opt.drop + '"].forCenter')).css('z-index', overlays.length + 1104);
            drop.data('drp', opt).attr('data-rel', opt.rel);

            if (opt.rel)
                methods._checkMethod(function() {
                    methods.galleries(drop, opt);
                });

            methods._setHeightAddons(dropOver, forCenter);
            drop.css('z-index', overlays.length + 1104);
            methods._pasteContent($this, drop, opt);
            if (opt.elBefore)
                eval(opt.elBefore).call($this, drop, opt, e);
            if (opt.before)
                opt.before.call($this, drop, opt, e);
            if (opt.beforeG)
                opt.beforeG.call($this, drop, opt, e);
            drop.add(doc).trigger({
                type: 'before.' + $.drop.nS,
                drp: {
                    event: e,
                    refer: $this,
                    drop: drop,
                    options: opt
                }
            });
            drop.addClass(opt.place);
            methods._positionType(drop);

            var ev = opt.drop ? opt.drop.replace(D.reg, '') : '';

            if (opt.hash && !hashChange) {
                D.scrollTop = wnd.scrollTop();
                var wLH = window.location.hash;

                wnd.off('hashchange.' + $.drop.nS);
                var k = false;
                if (opt.rel && !opt.moreOne && D.galleryHashs[opt.rel]) {
                    D.galleryHashs[opt.rel].map(function(n, i) {
                        if (wLH && wLH.indexOf(n) !== -1)
                            k = n;
                    });
                }
                if (k)
                    window.location.hash = wLH.replace(k, opt.hash);
                else if (opt.hash.indexOf('#') !== -1 && (new RegExp(opt.hash + '#|' + opt.hash + '$').exec(wLH) === null))
                    window.location.hash = wLH + opt.hash;
                setTimeout(methods._setEventHash, 0);
            }
            if (opt.confirm) {
                function focusConfirm() {
                    $(opt.confirmActionBtn).focus();
                }
                setTimeout(focusConfirm, 0);
                drop.click(focusConfirm);
            }
            wnd.off('resize.' + $.drop.nS + ev).on('resize.' + $.drop.nS + ev, function(e) {
                methods.update.call(drop, e);
            });
            wnd.off('scroll.' + $.drop.nS + ev).on('scroll.' + $.drop.nS + ev, function(e) {
                if (opt.place === 'center' && opt.centerOnScroll)
                    methods._checkMethod(function() {
                        methods[opt.place].call(drop);
                    }, opt.place);
            });
            $(dropOver).stop().fadeIn(opt.durationOn / 2);
            if (opt.closeClick)
                $(forCenter).add(dropOver).off('click.' + $.drop.nS + ev).on('click.' + $.drop.nS + ev, function(e) {
                    if ($(e.target).is('.overlayDrop') || $(e.target).is('.forCenter'))
                        methods.close.call($($(e.target).attr('data-rel')), e);
                });
            if (opt.prompt) {
                var input = drop.find(opt.promptInput).val(opt.promptInputValue);
                function focusInput() {
                    input.focus();
                }
                setTimeout(focusInput, 0);
                drop.find('form').off('submit.' + $.drop.nS + ev).on('submit.' + $.drop.nS + ev, function(e) {
                    e.preventDefault();
                });
                drop.click(focusInput);
            }
            drop.attr('data-elrun', opt.drop).off('click.' + $.drop.nS, opt.exit).on('click.' + $.drop.nS, opt.exit, function(e) {
                e.stopPropagation();
                methods.close.call($(this).closest('[data-elrun]'), e);
            });
            doc.off('keyup.' + $.drop.nS);
            if (opt.closeEsc)
                doc.on('keyup.' + $.drop.nS, function(e) {
                    if (e.keyCode === 27)
                        methods.close.call(null, e);
                });
            $('html, body').css('height', '100%');
            doc.off('click.' + $.drop.nS).on('click.' + $.drop.nS, function(e) {
                if (opt.closeClick && !$.existsN($(e.target).closest('[data-elrun]')))
                    methods.close.call(null, e);
            });
            if (opt.context)
                var collect = drop.add(dropOver).add(forCenter).on('contextmenu.' + $.drop.nS, function(e) {
                    e.preventDefault();
                });

            if (opt.width)
                drop.css('width', opt.width);
            if (opt.height)
                drop.css('height', opt.height);

            if (opt.limitSize)
                methods._checkMethod(function() {
                    methods.limitSize(drop);
                });

            if (methods.placeBeforeShow)
                methods.placeBeforeShow(drop, $this, opt.place, opt.placeBeforeShow, e);
            if (opt.place !== 'inherit')
                methods._checkMethod(function() {
                    methods[opt.place].call(drop);
                }, opt.place);
            $(forCenter).show();
            $('style' + '[data-rel="' + opt.drop + '"]').remove();
            if (!D.theme[opt.theme])
                returnMsg('theme' + ' "' + opt.theme + '" ' + 'not available');
            else
                methods._styleCreate(opt, opt.type === 'iframe' ? drop.css('visibility', 'hidden') : $('body'));
            drop[opt.effectOn](opt.durationOn, function(e) {
                var drop = $(this);
                if (opt.type === 'iframe')
                    methods._styleCreate(opt, drop.css('visibility', '').contents().find('body'));
                $('html, body').css({'overflow': '', 'overflow-x': ''});
                methods._setHeightAddons(dropOver, forCenter);
                if (opt.context)
                    collect.off('contextmenu.' + $.drop.nS);
                if ($.existsN(drop.find('[data-drop]')))
                    methods.init.call(drop.find('[data-drop]'));
                drop.add($this).addClass(DP.activeClass);
                if (opt.notify && !isNaN(opt.timeclosenotify))
                    setTimeout(function() {
                        methods.close.call(drop, 'close notify setTimeout');
                    }, opt.timeclosenotify);
                if (opt.droppable && opt.place !== 'inherit')
                    methods._checkMethod(function() {
                        methods.droppable(drop);
                    });
                var cB = opt.elAfter;
                if (cB)
                    eval(cB).call($this, drop, opt, e);
                if (opt.after)
                    opt.after.call($this, drop, opt, e);
                if (opt.afterG)
                    opt.afterG.call($this, drop, opt, e);

                drop.add(doc).trigger({
                    type: 'after.' + $.drop.nS,
                    drp: {
                        event: e,
                        refer: $this,
                        drop: drop,
                        options: opt
                    }
                });
            });
            return this;
        },
        close: function(e, f, hashChange) {
            var sel = this,
                    drop = $.existsN(sel) ? sel : $('[data-elrun].' + DP.activeClass);
            drop.each(function() {
                var drop = $(this),
                        opt = drop.data('drp');
                if (!opt)
                    return false;
                if (hashChange && opt.hash && window.location.hash.indexOf(opt.hash) !== -1)
                    return false;
                var $thisB = opt.elrun;
                if (!(opt.notify || $.existsN(sel) || opt.place !== 'inherit' || opt.inheritClose || opt.overlay) && $thisB)
                    return false;
                function _hide() {
                    var ev = opt.drop ? opt.drop.replace(D.reg, '') : '';
                    wnd.off('resize.' + $.drop.nS + ev).off('scroll.' + $.drop.nS + ev);
                    doc.off('keydown.' + $.drop.nS + ev).off('keyup.' + $.drop.nS).off('click.' + $.drop.nS);
                    $thisB.add(drop).removeClass(DP.activeClass);
                    if (opt.hash && !hashChange) {
                        D.scrollTop = wnd.scrollTop();
                        wnd.off('hashchange.' + $.drop.nS);
                        window.location.hash = window.location.hash.replace(opt.hash, '');
                        setTimeout(methods._setEventHash, 0);
                    }
                    if (methods.placeAfterClose)
                        methods.placeAfterClose(drop, $thisB, opt);

                    drop[opt.effectOff](opt.durationOff, function() {
                        $('style' + '[data-rel="' + opt.drop + '"]').remove();
                        $('html, body').css({'overflow': '', 'overflow-x': ''});
                        var $this = $(this);
                        if (opt.forCenter)
                            opt.forCenter.hide();

                        if (opt.dropOver)
                            opt.dropOver.fadeOut(opt.durationOff);
                        if (!opt.context)
                            methods._resetStyleDrop.call($(this));
                        $this.removeClass(opt.place);
                        if (opt.closed)
                            opt.closed.call($thisB, $this, opt, e);
                        if (opt.elClosed)
                            eval(opt.elClosed).call($thisB, $this, opt, e);
                        if (opt.closedG)
                            opt.closedG.call($thisB, $this, opt, e);
                        $this.add(doc).trigger({
                            type: 'closed.' + $.drop.nS,
                            drp: {
                                event: e,
                                refer: $thisB,
                                drop: $this,
                                options: opt
                            }
                        });
                        var dC = $this.find($(opt.dropContent)).data('jsp');
                        if (dC)
                            dC.destroy();
                        if (!$.exists(D.aDS))
                            $('body, html').css('height', '');
                        if (opt.always && !opt.dropn)
                            $thisB.data('drop', null);
                        if ($this.hasClass(D.tempClass)) {
                            if (opt.tempClass)
                                $this.removeClass(opt.tempClass);
                            if ($(opt.elrun).hasClass(D.tempClass))
                                $(opt.elrun).parent().remove();
                            if (!$this.hasClass(D.wasCreateClass))
                                $this.remove();
                            else
                                $this.appendTo($('body'));
                            $(opt.dropOver).add($(opt.forCenter)).remove();
                        }
                        if ($.isFunction(f))
                            f();
                    });
                }
                drop.add(doc).trigger({
                    type: 'close.' + $.drop.nS,
                    drp: {
                        event: e,
                        refer: $thisB,
                        drop: drop,
                        options: opt
                    }
                });
                var close = opt.elClose || opt.close || opt.closeG;
                if (close) {
                    if ($.type(close) === 'string')
                        var res = eval(close).call($thisB, $(this), opt, e);
                    else
                        var res = close.call($thisB, $(this), opt, e);
                    if (res === false && res !== true)
                        returnMsg(res);
                    else
                        _hide();
                }
                else
                    _hide();
            });
            return sel;
        },
        update: function(opt) {
            var drop = this;
            opt = $.extend({}, opt, drop.data('drp'));
            if (opt.limitSize)
                methods._checkMethod(function() {
                    methods.limitSize(drop);
                });
            if (opt.place !== 'inherit')
                methods._checkMethod(function() {
                    methods[opt.place].call(drop);
                }, opt.place);
            methods._setHeightAddons(opt.dropOver, opt.forCenter);
        },
        center: function(start) {
            return this.each(function() {
                var drop = $(this),
                        drp = drop.data('drp');
                if (drp && !drp.droppableIn) {
                    var method = drp.animate && !start ? 'animate' : 'css',
                            dropV = drop.is(':visible'),
                            w = dropV ? drop.outerWidth() : drop.actual('outerWidth'),
                            h = dropV ? drop.outerHeight() : drop.actual('outerHeight'),
                            top = Math.floor((wnd.height() - h) / 2) + (drp.centerOnScroll ? wnd.scrollTop() : 0),
                            left = Math.floor((wnd.width() - w) / 2) + (drp.centerOnScroll ? wnd.scrollLeft() : 0);
                    drop[method]({
                        'top': top > 0 ? top : 0,
                        'left': left > 0 ? left : 0
                    }, {
                        duration: drp.durationOn,
                        queue: false
                    });
                }
                else if (drp.droppableIn && drp.positionDroppableIn)
                    drop.css({
                        'top': drp.positionDroppableIn.top,
                        'left': drp.positionDroppableIn.left
                    });
            });
        },
        _resetStyleDrop: function() {
            return this.css({
                'z-index': '',
                'top': '',
                'left': '',
                'bottom': '',
                'right': '',
                'position': ''
            });
        },
        _pasteNotify: function(datas, opt, hashChange, e, cLS) {
            if (!$.isFunction(opt.handleNotify))
                return false;

            var el = this,
                    drop = methods._pasteDrop(opt, opt.patternNotify, cLS);
            el.off('successJson.' + $.drop.nS).on('successJson.' + $.drop.nS, function(e) {
                opt.handleNotify.call($(this), e, opt);
            }).trigger({
                type: 'successJson.' + $.drop.nS,
                drp: {
                    refer: el,
                    drop: drop,
                    options: opt,
                    datas: datas || el.data('datas')
                }
            });
            return methods._show.call(el, drop, e, opt, hashChange);
        },
        _pasteDrop: function(opt, drop, aClass) {
            if (opt.place === 'inherit' && opt.placeInherit)
                drop = $(drop).appendTo($(opt.placeInherit).empty());
            else {
                if (opt.place === 'global')
                    drop = $(drop).appendTo($('body'));
                else
                    drop = $(drop).appendTo($('<div class="forCenter" data-rel="' + opt.drop + '" style="left: 0;top: 0;width: 100%;display:none;height: 100%;position: absolute;height: 100%;"></div>').appendTo($('body')));
            }
            drop = $(drop).addClass(aClass).attr('data-elrun', opt.drop).filter(opt.drop);
            if (aClass) {
                opt.tempClass = aClass;
                drop.addClass(D.tempClass);
            }

            return drop;
        },
        _pasteContent: function($this, drop, opt) {
            function _pasteContent(content, place) {
                if (!content)
                    return false;
                place = drop.find(place);
                if ($.type(content) === 'function')
                    content(place, $this, drop);
                else
                    place.empty().append(content);
            }
            _pasteContent(opt.contentHeader, opt.dropHeader);
            _pasteContent(opt.contentContent, opt.dropContent);
            _pasteContent(opt.contentFooter, opt.dropFooter);
            return this;
        },
        _setHeightAddons: function(dropOver, forCenter) {
            $(dropOver).add(forCenter).css('height', '').css('height', doc.height());
        },
        _checkMethod: function(f, nm) {
            //try {
            f();
//            } catch (e) {
//                var method = f.toString().match(/\.\S*\(/);
//                returnMsg('need connect "' + (nm ? nm : method[0].substring(1, method[0].length - 1)) + '" method');
//            }
            return this;
        },
        _positionType: function(drop) {
            if (drop.data('drp') && drop.data('drp').place !== 'inherit')
                drop.css({
                    'position': drop.data('drp').position
                });
            return this;
        },
        _filterSource: function(btn, s) {
            var href = s.split(').'),
                    regS, regM = '';
            $.each(href, function(i, v) {
                regS = (v[v.length - 1] !== ')' ? v + ')' : v).match(/\(.*\)/);
                regM = regS['input'].replace(regS[0], '');
                regS = regS[0].substring(1, regS[0].length - 1);
                btn = btn[regM](regS);
            });
            return btn;
        },
        _isScrollable: function(el) {
            return (el && !(el.style.overflow && el.style.overflow === 'hidden') && ((el.clientWidth && el.scrollWidth > el.clientWidth) || (el.clientHeight && el.scrollHeight > el.clientHeight)));
        },
        _setEventHash: function() {
            D.wLH = window.location.hash;
            wnd.off('hashchange.' + $.drop.nS).on('hashchange.' + $.drop.nS, function(e) {
                e.preventDefault();
                if (D.scrollTop)
                    $('html, body').scrollTop(D.scrollTop);
                D.wLHN = window.location.hash;
                for (var i in D.hashs) {
                    if (D.wLH.indexOf(i) === -1 && D.wLHN.indexOf(i) !== -1)
                        methods.open.call(D.hashs[i], D.hashs[i].data('drp').genOpt, e, true);
                    else
                        methods.close.call($(D.hashs[i].data('drop')).add(D.hashs[i].data('dropConfirmPrompt')), e, null, true);
                }
                D.wLH = D.wLHN;
            });
        },
        _referCreate: function(sel) {
            return $('<div><button data-drop="' + sel + '" class="' + D.tempClass + '"></button></div>').appendTo($('body')).hide().children();
        },
        _styleCreate: function(opt, where) {
            return $('<style>', {
                'data-rel': opt.drop,
                text: opt.type === 'iframe' ? D.theme[opt.theme] : D.theme[opt.theme].replace(/\}[^$]/g, '} ' + opt.drop + ' ').replace(/,/g, ', ' + opt.drop + ' ').replace(/^/, opt.drop + ' ').replace(/\s\s+/g, ' ')
            }).appendTo(where);
        }
    };
    $.fn.drop = function(method) {
        if (methods[method]) {
            if (!/_/.test(method))
                return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
            else
                $.error('Method ' + method + ' is private on $.drop');
        } else if ($.type(method) === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on $.drop');
        }
    };
    $.drop = function(m, opt) {
        if (!opt)
            opt = {};
        if (m && m.constructor === jQuery)
            return methods.open.call(null, $.extend({'drop': m}, opt));
        else if ($.type(m) === 'array' || $.type(m) === 'string' && m.match(D.regImg)) {
            if ($.type(m) === 'array') {
                opt.rel = opt.rel ? opt.rel : 'rel' + (+new Date());
                if (!D.galleries[opt.rel])
                    D.galleries[opt.rel] = [];
                m.map(function(n) {
                    if (D.galleries[opt.rel].indexOf(n) === -1 && n.match(D.regImg))
                        D.galleries[opt.rel].push(n);
                });
                return methods.open.call(null, $.extend(opt, {href: D.galleries[opt.rel][0]}));
            }
            else if ($.type(m) === 'string' && m.match(D.regImg))
                return methods.open.call(null, $.extend(opt, {href: m}));
        }
        else if ($.type(m) === 'string')
            return methods.open.call(null, $.extend(opt, {'html': m}));
        else if ($.type(m) === 'object')
            return methods.open.call(null, m);
        else
            return returnMsg('insufficient data');
    };
    $.drop.nS = 'drop';
    $.drop.version = '1.0';
    $.drop.dP = {
        activeClass: 'drop-active',
        drop: null,
        href: null,
        hash: null,
        dataPrompt: null,
        dropContent: '.drop-content-default',
        dropHeader: '.drop-header-default',
        dropFooter: '.drop-footer-default',
        placePaste: '.placePaste',
        contentHeader: null,
        contentFooter: null,
        contentContent: null,
        placeInherit: null,
        dropFilter: null,
        message: {
            success: function(text) {
                return '<div class= "drop-msg"><div class="drop-success"><span class="drop-icon_info"></span><div class="drop-text-el">' + text + '</div></div></div>';
            },
            error: function(text) {
                return '<div class="drop-msg"><div class="drop-error"><span class="drop-icon_info"></span><div class="drop-text-el">' + text + '</div></div></div>';
            },
            info: function(text) {
                return '<div class="drop-msg"><div class="drop-info"><span class="drop-icon_info"></span><div class="drop-text-el">' + text + '</div></div></div>';
            }
        },
        trigger: 'click',
        triggerOn: null,
        triggerOff: null,
        exit: '[data-closed]',
        effectOn: 'fadeIn',
        effectOff: 'hide',
        place: 'center',
        placement: 'left bottom',
        overlay: true,
        overlayColor: '#000',
        overlayOpacity: .6,
        position: 'absolute',
        placeBeforeShow: 'center center',
        placeAfterClose: 'center center',
        start: null,
        beforeG: $.noop,
        afterG: $.noop,
        closeG: $.noop,
        closedG: $.noop,
        pattern: '<div class="drop drop-default"><button type="button" class="icon-times-drop" data-closed></button><button class="drop-prev" type="button" style="display: none;"><</button><button class="drop-next" type="button" style="display: none;">></button><div class="drop-header-default"></div><div class="drop-content-default"><div class="inside-padd placePaste"></div></div><div class="drop-footer-default"></div></div>',
        patternIframe: '<iframe class="drop drop-iframe" name="drop-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen' + (IE ? ' allowtransparency="true"' : '') + '></iframe>',
        patternNotify: '<div class="drop drop-notify"><button type="button" class="icon-times-drop" data-closed></button><button class="drop-prev" type="button" style="display: none;"><</button><button class="drop-next" type="button" style="display: none;">></button><div class="drop-header-default"></div><div class="drop-content-default"><div class="inside-padd drop-notification-default"></div></div><div class="drop-footer-default"></div></div>',
        patternConfirm: '<div class="drop drop-confirm"><button type="button" class="icon-times-drop" data-closed></button><button class="drop-prev" type="button" style="display: none;"><</button><button class="drop-next" type="button" style="display: none;">></button><div class="drop-header-default">Confirm</div><div class="drop-content-default"><div class="inside-padd"><div class="drop-group-btns"><button type="button" class="drop-btn-confirm" data-button-confirm><span class="text-el">confirm</span></button><button type="button" class="drop-btn-cancel" data-closed><span class="text-el">cancel</span></button></div></div></div><div class="drop-footer-default"></div></div>',
        patternPrompt: '<div class="drop drop-prompt"><button type="button" class="icon-times-drop" data-closed></button><button class="drop-prev" type="button" style="display: none;"><</button><button class="drop-next" type="button" style="display: none;">></button><div class="drop-header-default">Prompt</div><div class="drop-content-default"><form class="inside-padd"><input type="text" name="promptInput"/><div class="drop-group-btns"><button data-button-prompt type="submit" class="drop-btn-prompt"><span class="text-el">ok</span></button><button type="button" data-closed class="drop-btn-cancel"><span class="text-el">cancel</span></button></div></form></div><div class="drop-footer-default"></div></div>',
        defaultClassBtnDrop: 'drop-default',
        confirmActionBtn: '[data-button-confirm]',
        promptActionBtn: '[data-button-prompt]',
        promptInput: '[name="promptInput"]',
        promptInputValue: null,
        next: '.drop-next',
        prev: '.drop-prev',
        ajax: {
            type: 'post',
            dataType: null
        },
        jScrollPane: {
            animateScroll: true,
            showArrows: true
        },
        durationOn: 300,
        durationOff: 200,
        timeclosenotify: 2000,
        notify: false,
        notifyPlace: '.drop-notification-default',
        datas: null,
        handleNotify: function(e, opt) {
            e = e.drp;
            if (!e || !e.datas)
                var text = 'Object notify is empty';
            else if (e.datas.answer === undefined || e.datas.data === undefined)
                text = 'Answer is empty';
            else if (!opt.message || !opt.message[e.datas.answer])
                text = e.datas.data;
            else
                text = opt.message[e.datas.answer](e.datas.data);
            $(e.drop).find(opt.notifyPlace).empty().append(text);
            return this;
        },
        confirm: false,
        prompt: false,
        always: false,
        animate: false,
        moreOne: false,
        closeClick: true,
        closeEsc: true,
        cycle: true,
        limitSize: false,
        droppable: true,
        droppableLimit: false,
        inheritClose: false,
        keyNavigate: true,
        context: false,
        minHeightContent: 100,
        centerOnScroll: false,
        autoPlay: false,
        autoPlaySpeed: 2000,
        theme: 'default',
        closeActiveClick: false,
        type: 'auto',
        width: null,
        height: null
    };
    $.drop.drp = {
        theme: {
            default:
                    '*{margin: 0;}\n\
                .drop-header-default{border: 2px solid red;}\n\
                .drop-prev, .drop-next{position: absolute;top: 0;width: 35%;height: 100%;background: none;border: 0;cursor: pointer;}\n\
                .drop-next{right: 0;}\n\
                .drop-prev{left: 0;}\n\
                .icon-times-drop{position: absolute;z-index:1;right:0;top: 0;cursor: pointer;width: 15px;height: 15px;}'
        },
        regImg: /(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i,
        reg: /[^a-zA-Z0-9]+/ig,
        autoPlayInterval: {},
        hashs: {},
        drops: {},
        galleries: {},
        galleryHashs: {
            _butRel: []
        },
        curAjax: [],
        aDS: '[data-elrun].center:visible, [data-elrun].global:visible',
        tempClass: 'drop-temp',
        wasCreateClass: 'drop-was-create',
        wLH: null,
        wLHN: null,
        curDrop: null,
        scrollTop: null
    };
    var D = $.drop.drp,
            DP = $.drop.dP;
    $.drop.setParameters = function(options) {
        $.extend(DP, options);
        return this;
    };
    $.drop.setThemes = function(options) {
        $.extend(D.theme, options);
        return this;
    };
    $.drop.setMethods = function(ms) {
        $.extend(methods, ms);
        return this;
    };
    $.drop.close = function() {
        return methods.close.call(null, 'artificial close element');
    };
    $.drop.cancel = function() {
        if (D.curAjax.length)
            D.curAjax.map(function(n) {
                n.abort();
            });
        D.curAjax.length = 0;
        if (D.imgPreload)
            D.imgPreload.onload = D.imgPreload.onerror = null;

        $.drop.hideLoading();
        return this;
    };
    $.drop.update = function(opt) {
        return $('[data-elrun].' + DP.activeClass).each(function() {
            methods.update.call($(this), opt);
        });
    };
    $.drop.next = function(opt) {
        return methods._galleriesDecorator(opt, 1);
    };
    $.drop.prev = function(opt) {
        return methods._galleriesDecorator(opt, -1);
    };
    $.drop.jumpto = function(i, opt) {
        return methods._galleriesDecorator(opt, null, i);
    };
    $.drop.play = function(opt) {
        return methods._galleriesDecorator(opt, null, null);
    };

    doc.ready(function() {
        var loadingTimer, loadingFrame = 1,
                loading = $('<div id="drop-loading"><div></div></div>').appendTo($('body'));
        function _animate_loading() {
            if (!loading.is(':visible')) {
                clearInterval(loadingTimer);
                return;
            }
            $('div', loading).css('top', (loadingFrame * -40) + 'px');
            loadingFrame = (loadingFrame + 1) % 12;
        }

        $.drop.showLoading = function() {
            clearInterval(loadingTimer);
            loading.show();
            loadingTimer = setInterval(_animate_loading, 66);
            return this;
        };
        $.drop.hideLoading = function() {
            loading.hide();
            return this;
        };
        $('[data-drop]').drop();
    });
})(jQuery, $(window), $(document));
/*/plugin drop end*/