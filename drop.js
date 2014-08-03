/*plugin drop*/
(function($, wnd, doc) {
    (function($) {
        $.fn.actual = function() {
            if (arguments.length && typeof arguments[0] === 'string') {
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
        return nabir.length > 0 && nabir instanceof jQuery;
    };
    $.exists = function(selector) {
        return $(selector).length > 0 && $(selector) instanceof jQuery;
    };
    var returnMsg = function(msg) {
        if (window.console)
            console.log(msg);
    };
    var methods = {
        init: function(options) {
            var set = $.extend({}, $.drop.dP, options);

            this.each(function() {
                var el = methods.destroy($(this)),
                        opt = $.extend({}, set, el.data());

                if (opt.notify)
                    methods._notifyTrigger.call(el, opt);
                var rel = this.rel;
                if (rel) {
                    rel = rel.replace(methods._reg(), '');
                    var source = el.data('source') || $(this).attr('href');
                    if (source) {
                        if (!$.drop.drp.galleries[rel])
                            $.drop.drp.galleries[rel] = new Array();
                        $.drop.drp.galleries[rel].push(source);
                    }
                }

                el.addClass('isDrop');

                if (opt.context) {
                    el.on('contextmenu.' + $.drop.nS, function(e) {
                        e.preventDefault();
                    });
                    el.on('mouseup.' + $.drop.nS, function(e) {
                        e.preventDefault();
                        if (el.hasClass($.drop.dP.activeClass))
                            methods.close.call($(el.attr('data-drop')));
                        if (e.button === 2)
                            methods.open.call($(this), $.extend(opt, {place: 'noinherit', limitSize: true}), null, e);
                    });
                }
                else {
                    if (opt.triggerOn || opt.triggerOff)
                        el.on(opt.triggerOn + '.' + $.drop.nS + ' ' + opt.triggerOff + '.' + $.drop.nS, function(e) {
                            e.stopPropagation();
                            e.preventDefault();
                        }).on(opt.triggerOn + '.' + $.drop.nS, function(e) {
                            if (opt.condTrigger) {
                                if (eval('(function(){' + opt.condTrigger + '})()'))
                                    methods.open.call($(this), opt, null, e);
                            }
                            else
                                methods.open.call($(this), opt, null, e);
                        }).on(opt.triggerOff + '.' + $.drop.nS, function() {
                            methods.close.call($(el.attr('data-drop')));
                        });
                    else
                        el.on(opt.trigger + '.' + $.drop.nS, function(e) {
                            if (el.hasClass($.drop.dP.activeClass))
                                methods.close.call($(el.attr('data-drop')));
                            else
                                methods.open.call($(this), opt, null, e);
                            e.stopPropagation();
                            e.preventDefault();
                        });
                }
                if (opt.href && window.location.hash.indexOf(opt.href) !== -1 && !$.drop.drp.hrefs[opt.href])
                    methods.open.call(el, opt, null, null);
                if (/#/.test(opt.href) && !$.drop.drp.hrefs[opt.href])
                    $.drop.drp.hrefs[opt.href] = el;
            });
            for (var i in $.drop.drp.galleries)
                if ($.drop.drp.galleries[i].length <= 1)
                    delete $.drop.drp.galleries[i];

            return this;
        },
        destroy: function(el) {
            return (el || this).each(function() {
                var el = $(this),
                        opt = $(el.attr('data-drop')).data('drp');
                if (!opt)
                    return;

                el.removeClass('isDrop');
                if (opt.trigger)
                    el.off(opt.trigger + '.' + $.drop.nS).removeData(opt.trigger);
                if (opt.triggerOn)
                    el.off(opt.triggerOn + '.' + $.drop.nS).removeData(opt.triggerOn);
                if (opt.triggerOff)
                    el.off(opt.triggerOff + '.' + $.drop.nS).removeData(opt.triggerOff);
                el.off('contextmenu.' + $.drop.nS).off('mouseup.' + $.drop.nS);
            });
        },
        _get: function(opt, e, hashChange) {
            var el = this,
                    elSet = el.data();

            $.extend(opt, elSet);

            function _update(data) {
                var drop = methods._pasteDrop(opt, opt.pattern, opt.rel, $.drop.drp.curDefault).attr('pattern', true);

                if (opt.source && !opt.always && !opt.notify)
                    $.drop.drp.drops[opt.source.replace(methods._reg(), '')] = drop;

                drop.find($(opt.placePaste)).html(data);
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

            $.drop.drp.curDefault = opt.defaultClassBtnDrop + (opt.rel ? opt.rel : (opt.source ? opt.source.replace(methods._reg(), '') : (new Date()).getTime()));
            el.attr('data-drop', '.' + $.drop.drp.curDefault).data('drop', '.' + $.drop.drp.curDefault);

            if ($.drop.drp.drops[opt.source.replace(methods._reg(), '')]) {
                var drop = methods._pasteDrop(opt, $.drop.drp.drops[opt.source.replace(methods._reg(), '')], opt.rel);
                methods._show.call(el, drop, e, opt, hashChange);
                return el;
            }

            $.drop.showActivity();
            if (opt.source.match(/jpg|gif|png|bmp|jpeg/)) {
                var img = new Image();
                $(img).load(function() {
                    $.drop.hideActivity();
                    _update($(this));
                });
                img.src = opt.source;
            }
            else
                $.ajax({
                    type: opt.type,
                    url: opt.source,
                    data: opt.datas,
                    dataType: opt.dataType ? opt.dataType : 'html',
                    beforeSend: function() {
                        if (!opt.moreOne)
                            methods._closeMoreOne();
                    },
                    success: function(data) {
                        $.drop.hideActivity();
                        if (opt.notify)
                            methods._pasteNotify.call(el, data, opt, opt.rel, hashChange);
                        else
                            _update(data);
                    }
                });
            return el;
        },
        open: function(opt, datas, e, hashChange) {
            var $this = this;
            e = e ? e : window.event;
            opt = $.extend({}, $.drop.dP, opt);
            if (!$this || !($this instanceof jQuery)) {
                if ($(this).hasClass('isDrop'))
                    $this = this;
                else {
                    if (datas) {
                        if (!$.exists('[data-drop="' + opt.notifyBtnDrop + '"]')) {
                            $this = $('<div><button data-drop="' + opt.notifyBtnDrop + '" data-notify="true"></button></div>').appendTo($('body')).hide().children();
                            methods._pasteDrop($.extend(opt, $this.data()), opt.patternNotif);
                        }
                        else
                            $this = $('[data-drop="' + opt.notifyBtnDrop + '"]');
                        $this.data('datas', datas);
                        methods._notifyTrigger.call($this, $.extend(opt, $this.data()));
                    }
                    else if (opt.source) {
                        var sourcePref = opt.source.replace(methods._reg(), '');
                        if (!$.exists('.refer' + opt.defaultClassBtnDrop + sourcePref))
                            $this = $('<div><button class="refer' + (opt.defaultClassBtnDrop + sourcePref) + '"></button></div>').appendTo($('body')).hide().children();
                        else
                            $this = $('.refer' + opt.defaultClassBtnDrop + sourcePref);
                    }
                    else {
                        $.drop.drp.curDefault = opt.defaultClassBtnDrop + (new Date()).getTime();
                        if (!$.exists('[data-drop=".' + $.drop.drp.curDefault + '"]'))
                            $this = $('<div><button data-drop=".' + $.drop.drp.curDefault + '"></button></div>').appendTo($('body')).hide().children();
                        else
                            $this = $('[data-drop=".' + $.drop.drp.curDefault + '"] ');

                        var drop = methods._pasteDrop($.extend(opt, $this.data()), opt.pattern, opt.rel, $.drop.drp.curDefault);
                        drop.find($(opt.placePaste)).html(opt.html);
                    }
                }
            }
            if (!($this instanceof jQuery))
                return this;
            return $this.each(function() {
                var $this = $(this),
                        self = $this.get(0);
                $.extend(opt, $this.data());
                var drop = $(opt.drop);
                opt.source = opt.source || $this.attr('href');
                if (self.rel && $.drop.drp.galleries[self.rel])
                    opt.rel = self.rel.replace(methods._reg(), '');
                //zzz
                opt.elrun = opt.elrun ? opt.elrun.add($this) : $this;
                var sourceC = opt.source ? opt.source.replace(methods._reg(), '') : null;

                if (opt.always && opt.source && $.existsN(drop) && !opt.notify) {
                    drop.remove();
                    delete $.drop.drp.drops[sourceC];
                }
                if (opt.dropFilter && !opt.drop) {
                    drop = methods._filterSource($this, opt.dropFilter);
                    var _classFilter = opt.defaultClassBtnDrop + (new Date()).getTime();
                    $this.attr('data-drop', '.' + _classFilter).data('drop', '.' + _classFilter);
                    opt.drop = '.' + _classFilter;
                    drop.addClass(_classFilter);
                }

                function _confirmF() {
                    if (!$.existsN(drop) || $.existsN(drop) && opt.source && !$.drop.drp.drops[sourceC] || opt.notify || opt.always) {
                        if (datas && opt.notify)
                            methods._pasteNotify.call($this, datas, opt, null, hashChange);
                        else if (opt.source)
                            methods._get.call($this, opt, e, hashChange);
                    }
                    else
                        methods._show.call($this, drop, e, opt, hashChange);
                }

                if (!$this.hasClass($.drop.dP.activeClass) || !drop.hasClass($.drop.dP.activeClass)) {
                    //zzz
                    if (!opt.moreOne && !opt.start)
                        methods._closeMoreOne();
                    if ($this.is(':disabled') || opt.start && !eval(opt.start).call($this, drop, opt))
                        return false;

                    if (opt.notify)//for front validations
                        methods._pasteNotify.call($this, datas, opt, null, hashChange);
                    else {
                        if (opt.prompt || opt.confirm || opt.source && !$.existsN(drop) || opt.source && opt.always) {
                            if (!opt.confirm && !opt.prompt)
                                _confirmF();
                            else//for cofirm && prompt
                                methods._checkMethod(function() {
                                    methods.confirmPrompt(opt, methods, hashChange, _confirmF, e);
                                });
                        }
                        else if ($.existsN(drop) || opt.source && $.drop.drp.drops[sourceC]) {
                            drop = methods._pasteDrop(opt, $.existsN(drop) && !opt.rel ? drop : $.drop.drp.drops[sourceC]);
                            methods._show.call($this, drop, e, opt, hashChange);
                        }
                        else
                            returnMsg('insufficient data');
                    }
                }
                else
                    methods.close.call($($this.data('drop')));
            });
        },
        close: function(hashChange, f) {
            var sel = this,
                    drop = $.existsN(sel) ? sel : $('[data-elrun].' + $.drop.dP.activeClass);

            clearTimeout($.drop.drp.closeDropTime);

            drop.each(function() {
                var drop = $(this),
                        opt = drop.data('drp'),
                        $thisB = opt.elrun;

                if (!(opt && (opt.notify || sel || opt.place !== 'inherit' || opt.inheritClose || opt.overlayOpacity !== 0) && $thisB))
                    return false;

                var durOff = opt.durationOff;
                function _hide() {
                    $thisB.removeClass($.drop.dP.activeClass).each(function() {
                        if (opt.href) {
                            clearTimeout($.drop.drp.curHashTimeout);
                            $.drop.drp.curHash = hashChange ? opt.href : null;
                            $.drop.drp.scrollTop = wnd.scrollTop();
                            location.hash = location.hash.replace(opt.href, '');
                            $.drop.drp.curHashTimeout = setTimeout(function() {
                                $.drop.drp.curHash = null;
                                $.drop.drp.scrollTop = null;
                            }, 400);
                        }
                    });
                    drop.removeClass($.drop.dP.activeClass);
                    if (methods.placeAfterClose)
                        methods._checkMethod(function() {
                            methods.placeAfterClose(drop, $thisB, opt);
                        });
                    if (opt.droppableIn)
                        drop.data('drp').positionDroppableIn = {'left': drop.css('left'), 'top': drop.css('top')}

                    var ev = opt.drop ? opt.drop.replace(methods._reg(), '') : '';
                    wnd.off('resize.' + $.drop.nS + ev).off('scroll.' + $.drop.nS + ev);
                    doc.off('keydown.' + $.drop.nS + ev).off('keyup.' + $.drop.nS).off('click.' + $.drop.nS);

                    drop[opt.effectOff](durOff, function() {
                        var $this = $(this);
                        if (opt.forCenter)
                            opt.forCenter.hide();
                        var zInd = 0,
                                drpV = null;
                        $('[data-elrun]:visible').each(function() {
                            var $this = $(this);
                            if (parseInt($this.css('z-index')) > zInd) {
                                zInd = parseInt($this.css('z-index'));
                                drpV = $.extend({}, $this.data('drp'));
                            }
                        });

                        if (opt.dropOver && !f)
                            opt.dropOver.fadeOut(durOff);
                        if (!opt.context)
                            methods._resetStyleDrop.call($(this));
                        $this.removeClass(opt.place);
                        if (opt.closed)
                            opt.closed.call($thisB, $this, opt);
                        if (opt.elClosed)
                            eval(opt.elClosed).call($thisB, $this, opt);
                        if (opt.closedG)
                            opt.closedG.call($thisB, $this);
                        $this.add(doc).trigger({
                            type: 'closed.' + $.drop.nS,
                            drp: {
                                refer: $thisB,
                                drop: $this,
                                options: opt
                            }
                        });
                        var dC = $this.find($(opt.dropContent)).data('jsp');
                        if (dC)
                            dC.destroy();
                        if (f)
                            f();
                        if (!$.exists('[data-elrun].center:visible, [data-elrun].noinherit:visible'))
                            $('body, html').css('height', '');
                        if (opt.html) {
                            $(opt.elrun).parent().remove();
                            $(opt.dropOver).add($(opt.forCenter)).remove();
                        }
                    });
                }
                drop.add(doc).trigger({
                    type: 'close.' + $.drop.nS,
                    drp: {
                        refer: $thisB,
                        drop: drop,
                        options: opt
                    }
                });
                var close = opt.elClose || opt.close || opt.closeG;

                if (close) {
                    if (typeof close === 'string')
                        var res = eval(close).call($thisB, $(this), opt);
                    else
                        var res = close.call($thisB, $(this), opt);
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
        center: function() {
            return this.each(function() {
                var drop = $(this),
                        drp = drop.data('drp');
                if (drp && !drp.droppableIn) {
                    var method = drp.animate ? 'animate' : 'css',
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
        _closeMoreOne: function() {
            if ($.exists('[data-elrun].center:visible, [data-elrun].noinherit:visible'))
                methods.close.call($('[data-elrun].center:visible, [data-elrun].noinherit:visible'));
            return this;
        },
        _notifyTrigger: function(opt) {
            return this.off('successJson.' + $.drop.nS).on('successJson.' + $.drop.nS, function(e) {
                e = e.drp;
                if (!e || !e.datas) {
                    $(e.el).find(opt.notifyPlace).empty().append(opt.message.info('Object notify is empty'));
                    return false;
                }

                if (e.datas.answer === "success")
                    $(e.el).find(opt.notifyPlace).empty().append(opt.message.success(e.datas.data));
                else if (e.datas.answer === "error")
                    $(e.el).find(opt.notifyPlace).empty().append(opt.message.error(e.datas.data));
                else
                    $(e.el).find(opt.notifyPlace).empty().append(opt.message.info(e.datas.data));
            });
        },
        _pasteNotify: function(datas, opt, rel, hashChange) {
            var el = this;
            datas = datas || el.data('datas');

            var drop = methods._pasteDrop(opt, opt.drop, rel);
            el.trigger({
                type: 'successJson.' + $.drop.nS,
                drp: {
                    refer: el,
                    drop: drop,
                    options: opt,
                    datas: datas
                }
            });
            methods._show.call(el, drop, null, opt, hashChange);
            return this;
        },
        _reg: function() {
            return /[^a-zA-Z0-9]+/ig;
        },
        _pasteDrop: function(opt, drop, rel, aClass) {
            var sourcePref = opt.source ? opt.source.replace(methods._reg(), '') : '',
                    sdrop = opt.drop;

            if (!opt.drop)
                if (rel)
                    opt.drop = '.' + opt.defaultClassBtnDrop + rel;
                else
                    opt.drop = '.' + opt.defaultClassBtnDrop + sourcePref;

            if (opt.place === 'inherit' && opt.placeInherit)
                drop = $(drop).appendTo($(opt.placeInherit).empty());
            else {
                function _for_center(rel) {
                    $('body').append('<div class="forCenter" data-rel="' + rel + '" style="left: 0;top: 0;width: 100%;display:none;height: 100%;position: absolute;height: 100%;"></div>');
                }
                if (opt.place === 'noinherit')
                    drop = $(drop).appendTo($('body'));
                else {
                    var sel = '[data-rel="' + opt.drop + '"].forCenter';
                    if (!$.exists(sel))
                        _for_center(opt.drop);
                    drop = $(drop).appendTo($(sel).empty()).data('drp', $(sel).find('[data-elrun]').data('drp') || {});
                }
            }
            drop = $(drop).addClass(aClass).attr('data-rel', rel).attr('data-elrun', opt.drop);
            if (sdrop)
                drop = drop.filter(sdrop);
            return drop;
        },
        _pasteContent: function($this, drop, opt) {
            function _pasteContent(content, place) {
                if (!content)
                    return false;

                place = drop.find(place);
                if (typeof content === 'string' || typeof content === 'number' || typeof content === 'object')
                    place.empty().append(content);
                else if (typeof content === 'function')
                    content(place, $this, drop);
            }
            _pasteContent(opt.contentHeader, opt.dropHeader);
            _pasteContent(opt.contentContent, opt.dropContent);
            _pasteContent(opt.contentFooter, opt.dropFooter);
            return this;
        },
        _show: function(drop, e, opt, hashChange) {
            var $this = this;
            e = e ? e : window.event;
            var elSet = $this.data();

            //callbacks for element, options and global $.drop.dP
            opt.elBefore = elSet.elBefore;
            opt.elAfter = elSet.elAfter;
            opt.elClose = elSet.elClose;
            opt.elClosed = elSet.elClosed;
            //
            opt.beforeG = $.drop.dP.beforeG;
            opt.afterG = $.drop.dP.afterG;
            opt.closeG = $.drop.dP.closeG;
            opt.closedG = $.drop.dP.closedG;

            //opt = $.extend({}, drop.data('drp'), opt);

            drop.data('drp', opt);

            if (opt.rel)
                methods._checkMethod(function() {
                    methods.galleries.call($this, drop, opt, methods);
                });
            var overlays = $('.overlayDrop').css('z-index', 1103),
                    condOverlay = opt.overlayOpacity !== 0,
                    dropOver = null;

            if (condOverlay) {
                if (!$.exists('[data-rel="' + opt.drop + '"].overlayDrop'))
                    $('body').append('<div class="overlayDrop" data-rel="' + opt.drop + '" style="display:none;position:absolute;width:100%;left:0;top:0;"></div>');
                dropOver = $('[data-rel="' + opt.drop + '"].overlayDrop');
                opt.dropOver = dropOver;
                dropOver.css('height', '').css({
                    'background-color': opt.overlayColor,
                    'opacity': opt.overlayOpacity,
                    'z-index': overlays.length + 1103
                });
            }

            $('.forCenter').css('z-index', 1104);
            var forCenter = null,
                    objForC = $('[data-rel="' + opt.drop + '"].forCenter');
            if ($.existsN(objForC))
                forCenter = objForC;
            if (forCenter) {
                opt.forCenter = forCenter;
                forCenter.css('z-index', overlays.length + 1104);
            }
            methods._setHeightAddons(dropOver, forCenter);
            drop.css('z-index', overlays.length + 1104);
            methods._pasteContent($this, drop, opt);
            if (opt.elBefore)
                eval(opt.elBefore).call($this, drop, opt);
            if (opt.before)
                opt.before.call($this, drop, opt);
            if (opt.beforeG)
                opt.beforeG.call($this, drop);
            drop.add(doc).trigger({
                type: 'before.' + $.drop.nS,
                drp: {
                    refer: $this,
                    drop: drop,
                    options: opt
                }
            });
            drop.addClass(opt.place);
            methods._positionType(drop);

            if (opt.href) {
                clearTimeout($.drop.drp.curHashTimeout);
                $.drop.drp.curHash = !hashChange ? opt.href : null;
                $.drop.drp.scrollTop = wnd.scrollTop();
                var wlh = window.location.hash;
                if (opt.href.indexOf('#') !== -1 && (new RegExp(opt.href + '#|' + opt.href + '$').exec(wlh) === null))
                    window.location.hash = wlh + opt.href;
                $.drop.drp.curHashTimeout = setTimeout(function() {
                    $.drop.drp.curHash = null;
                    $.drop.drp.scrollTop = null;
                }, 400);
            }
            if (opt.confirm) {
                function focusConfirm() {
                    $(opt.confirmActionBtn).focus();
                }
                setTimeout(focusConfirm, 0);
                drop.click(focusConfirm);
            }

            var ev = opt.drop ? opt.drop.replace(methods._reg(), '') : '';

            wnd.off('resize.' + $.drop.nS + ev).on('resize.' + $.drop.nS + ev, function(e) {
                if (opt.limitSize) {
                    methods._checkMethod(function() {
                        methods.limitSize(drop);
                    });
                    methods._checkMethod(function() {
                        methods.heightContent(drop);
                    });
                }
                if (opt.place !== 'inherit')
                    methods._checkMethod(function() {
                        methods[opt.place].call(drop, e);
                    }, opt.place);
                setTimeout(function() {
                    methods._setHeightAddons(dropOver, forCenter);
                }, 100);
            });
            wnd.off('scroll.' + $.drop.nS + ev).on('scroll.' + $.drop.nS + ev, function(e) {
                if (opt.place === 'center' && opt.centerOnScroll)
                    methods._checkMethod(function() {
                        methods[opt.place].call(drop, e);
                    }, opt.place);
            });
            if (condOverlay)
                dropOver.stop().fadeIn(opt.durationOn / 2);
            if (opt.closeClick)
                $(forCenter).add(dropOver).off('click.' + $.drop.nS + ev).on('click.' + $.drop.nS + ev, function(e) {
                    if ($(e.target).is('.overlayDrop') || $(e.target).is('.forCenter'))
                        methods.close.call($($(e.target).attr('data-rel')));
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
                methods.close.call($(this).closest('[data-elrun]'));
            });
            doc.off('keyup.' + $.drop.nS);
            if (opt.closeEsc)
                doc.on('keyup.' + $.drop.nS, function(e) {
                    if (e.keyCode === 27)
                        methods.close.call(null);
                });
            $('html, body').css('height', '100%');
            doc.off('click.' + $.drop.nS).on('click.' + $.drop.nS, function(e) {
                if (opt.closeClick && !$.existsN($(e.target).closest('[data-elrun]')))
                    methods.close.call(null);
            });
            if (opt.context) {
                var collect = drop.add(dropOver).add(forCenter);
                collect.on('contextmenu.' + $.drop.nS, function(e) {
                    e.preventDefault();
                });
            }
            if (opt.limitSize) {
                methods._checkMethod(function() {
                    methods.limitSize(drop);
                });
                methods._checkMethod(function() {
                    methods.heightContent(drop);
                });
            }
            if (methods.placeBeforeShow)
                methods._checkMethod(function() {
                    methods.placeBeforeShow(drop, $this, methods, opt.place, opt.placeBeforeShow, e);
                });
            if (opt.place !== 'inherit')
                methods._checkMethod(function() {
                    methods[opt.place].call(drop, e);
                }, opt.place);

            if (forCenter && opt.place === 'center')
                forCenter.show();

            drop[opt.effectOn](opt.durationOn, function(e) {
                methods._setHeightAddons(dropOver, forCenter);
                if (opt.context)
                    collect.off('contextmenu.' + $.drop.nS);
                var drop = $(this);
                $.drop.drp.curDrop = drop;
                if ($.existsN(drop.find('[data-drop]')))
                    methods.init.call(drop.find('[data-drop]'));
                
                drop.addClass($.drop.dP.activeClass);
                $this.addClass($.drop.dP.activeClass);
                
                if (opt.notify && opt.timeclosenotify)
                    $.drop.drp.closeDropTime = setTimeout(function() {
                        methods.close.call(drop);
                    }, opt.timeclosenotify);
                var cB = opt.elAfter;
                if (cB)
                    eval(cB).call($this, drop, opt);
                if (opt.after)
                    opt.after.call($this, drop, opt);
                if (opt.afterG)
                    opt.afterG.call($this, drop, opt);
                drop.add(doc).trigger({
                    type: 'after.' + $.drop.nS,
                    drp: {
                        refer: $this,
                        drop: drop,
                        options: opt
                    }
                });
                if (opt.droppable && opt.place !== 'inherit')
                    methods._checkMethod(function() {
                        methods.droppable(drop);
                    });
                if (opt.rel && opt.keyNavigate && methods.galleries)
                    doc.off('keydown.' + $.drop.nS + ev).on('keydown.' + $.drop.nS + ev, function(e) {
                        e.preventDefault();
                        var key = e.keyCode;

                        if (key === 37)
                            $(opt.prev).trigger('click.' + $.drop.nS);
                        if (key === 39)
                            $(opt.next).trigger('click.' + $.drop.nS);
                    });
            });
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
            var source = s.split(').'),
                    regS, regM = '';
            $.each(source, function(i, v) {
                regS = (v[v.length - 1] !== ')' ? v + ')' : v).match(/\(.*\)/);
                regM = regS['input'].replace(regS[0], '');
                regS = regS[0].substring(1, regS[0].length - 1);
                btn = btn[regM](regS);
            });
            return btn;
        }
    };
    $.fn.drop = function(method) {
        if (methods[method]) {
            if (!/_/.test(method))
                return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
            else
                $.error('Method ' + method + ' is private on $.drop');
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on $.drop');
        }
    };
    $.drop = function(m, opt) {
        if (methods[m] && !/_/.test(m))
            return methods[m].call(null, opt);
        if (typeof m === 'string')
            return methods.open.call(null, $.extend(opt, {'html': m}));
    };
    $.drop.nS = 'drop';
    $.drop.dP = {
        activeClass: 'drop-active',
        drop: null,
        source: null,
        href: null,
        dataPrompt: null,
        dropContent: '.drop-content-default',
        dropHeader: '.drop-header-default',
        dropFooter: '.drop-footer-default',
        placePaste: '.placePaste',
        notifyPlace: '.drop-notification-default',
        datas: null,
        contentHeader: null,
        contentFooter: null,
        contentContent: null,
        start: null,
        placeInherit: null,
        condTrigger: null,
        dropFilter: null,
        message: {
            success: function(text) {
                return '<div class = "drop-msg"><div class = "drop-success"><span class = "drop-icon_info"></span><div class="drop-text-el">' + text + '</div></div></div>';
            },
            error: function(text) {
                return '<div class = "drop-msg"><div class = "drop-error"><span class = "drop-icon_info"></span><div class="drop-text-el">' + text + '</div></div></div>';
            },
            info: function(text) {
                return '<div class = "drop-msg"><div class = "drop-info"><span class = "drop-icon_info"></span><div class="drop-text-el">' + text + '</div></div></div>';
            }
        },
        trigger: 'click',
        triggerOn: null,
        triggerOff: null,
        exit: '[data-closed]',
        effectOn: 'fadeIn',
        effectOff: 'fadeOut',
        place: 'center',
        placement: 'top left',
        overlayColor: '#000',
        overlayOpacity: .6,
        position: 'absolute',
        placeBeforeShow: 'center center',
        placeAfterClose: 'center center',
        beforeG: null,
        afterG: null,
        closeG: null,
        closedG: null,
        pattern: '<div class="drop drop-style drop-default" style="background-color: #fff;"><button type="button" class="icon-times-drop" data-closed style="position: absolute;right: 5px;top: 5px;background-color: red;width: 10px;height: 10px;"></button><div class="drop-header-default"></div><div class="drop-content-default"><button class="drop-prev" type="button"  style="height:100%;display:none;font-size: 30px;position:absolute;width: 35%;left: 20px;top:0;text-align: left;"><</button><button class="drop-next" type="button" style="height:100%;display:none;font-size: 30px;position:absolute;width: 35%;right: 20px;top:0;text-align: right;">></button><div class="inside-padd placePaste" style="padding: 20px 40px;text-align: center;"></div></div><div class="drop-footer-default"></div></div>',
        notifyBtnDrop: '#drop-notification-default',
        defaultClassBtnDrop: 'drop-default',
        patternNotif: '<div class="drop drop-style" id="drop-notification-default" style="background-color: #fff;"><div class="drop-header-default" style="padding: 10px 20px;border-bottom: 1px solid #ccc;"></div><div class="drop-content-default"><div class="inside-padd drop-notification-default"></div></div><div class="drop-footer-default"></div></div>',
        confirmBtnDrop: '#drop-confirm-default',
        confirmActionBtn: '[data-button-confirm]',
        patternConfirm: '<div class="drop drop-style" id="drop-confirm-default" style="background-color: #fff;"><button type="button" class="icon-times-drop" data-closed style="position: absolute;right: 5px;top: 5px;background-color: red;width: 10px;height: 10px;"></button><div class="drop-header-default" style="padding: 10px 20px;border-bottom: 1px solid #ccc;">Confirm</div><div class="drop-content-default"><div class="inside-padd" style="padding: 20px 40px;text-align: center;"><div class="drop-btn-confirm" style="margin-right: 10px;"><button type="button" data-button-confirm><span class="text-el">confirm</span></button></div><div class="drop-btn-cancel"><button type="button" data-closed><span class="text-el">cancel</span></button></div></div></div><div class="drop-footer-default"></div></div>',
        promptBtnDrop: '#drop-prompt-default',
        promptActionBtn: '[data-button-prompt]',
        promptInput: '[name="promptInput"]',
        patternPrompt: '<div class="drop drop-style" id="drop-prompt-default" style="background-color: #fff;"><button type="button" class="icon-times-drop" data-closed style="position: absolute;right: 5px;top: 5px;background-color: red;width: 10px;height: 10px;"></button><div class="drop-header-default" style="padding: 10px 20px;border-bottom: 1px solid #ccc;">Prompt</div><div class="drop-content-default"><form class="inside-padd" style="padding: 20px 40px;text-align: center;"><input type="text" name="promptInput"/><div class="drop-btn-prompt" style="margin-right: 10px;"><button data-button-prompt type="submit"><span class="text-el">ok</span></button></div><div class="drop-btn-cancel"><button type="button" data-closed><span class="text-el">cancel</span></button></div></form></div><div class="drop-footer-default"></div></div>',
        promptInputValue: null,
        next: '.drop-next',
        prev: '.drop-prev',
        type: 'post',
        dataType: null,
        durationOn: 300,
        durationOff: 40,
        timeclosenotify: 2000,
        notify: false,
        confirm: false,
        prompt: false,
        always: false,
        animate: false,
        moreOne: false,
        closeClick: true,
        closeEsc: true,
        cycle: false,
        limitSize: false,
        droppable: true,
        droppableLimit: false,
        inheritClose: false,
        keyNavigate: true,
        context: false,
        minHeightContent: 100,
        centerOnScroll: false
    };
    $.drop.drp = {
        hrefs: {},
        drops: {},
        galleries: {},
        scrollemulatetimeout: null,
        curHash: null,
        curDrop: null,
        curHashTimeout: null,
        scrollTop: null
    };
    $.drop.setParameters = function(options) {
        $.extend($.drop.dP, options);
    };
    $.drop.setMethods = function(ms) {
        $.extend(methods, ms);
    };
    $.drop.position = function() {
        $('[data-elrun].' + $.drop.dP.activeClass).each(function() {
            var $this = $(this),
                    drp = $this.data('drp');
            if (drp && drp.place !== 'inherit')
                methods._checkMethod(function() {
                    methods[drp.place].call($this);
                }, drp.place);
        });
    };
    $.drop.close = function() {
        methods.close.call(null);
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

        $.drop.showActivity = function() {
            clearInterval(loadingTimer);
            loading.show();
            loadingTimer = setInterval(_animate_loading, 66);
        };
        $.drop.hideActivity = function() {
            loading.hide();
        };
    });

    var wLH = window.location.hash;
    wnd.off('hashchange.' + $.drop.nS).on('hashchange.' + $.drop.nS, function(e) {
        e.preventDefault();
        if ($.drop.drp.scrollTop)
            $('html, body').scrollTop($.drop.drp.scrollTop);
        var wLHN = window.location.hash;
        if (!$.drop.drp.curHash)
            for (var i in $.drop.drp.hrefs) {
                if (wLH.indexOf(i) === -1 && wLHN.indexOf(i) !== -1)
                    methods.open.call($.drop.drp.hrefs[i], {}, null, e, true);
                else
                    methods.close.call($($.drop.drp.hrefs[i].data('drop')), true);
            }
        wLH = wLHN;
    });
    doc.ready(function() {
        $('[data-drop]').drop();
    });
})(jQuery, $(window), $(document));
/*/plugin drop end*/