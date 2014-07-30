/*plugin drop*/
(function($, wnd) {
    (function($) {
        $.fn.actual = function() {
            if (arguments.length && typeof arguments[0] === 'string') {
                var dim = arguments[0],
                        clone = this.clone();
                if (arguments[1] === undefined)
                    clone.css({
                        position: 'absolute',
                        top: '-9999px'
                    }).show().appendTo($('body')).find('*:not([style*="display:none"])').show();
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
        if (window.console) {
            console.log(msg);
        }
    };
    var aC = 'active';
    var methods = {
        init: function(options) {
            var set = $.extend({}, $.drop.dP, options);
            this.each(function() {
                var el = methods.destroy($(this)),
                        opt = $.extend({}, set, el.data());

                if (opt.notify)
                    methods._notifyTrigger(el, opt);
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

                el.data('drp', opt).addClass('isDrop');

                if (!opt.context) {
                    if (opt.triggerOn || opt.triggerOff)
                        el.on(opt.triggerOn + '.' + $.drop.nS + ' ' + opt.triggerOff + '.' + $.drop.nS, function(e) {
                            e.stopPropagation();
                            e.preventDefault();
                        }).on(opt.triggerOn + '.' + $.drop.nS, function(e) {
                            if (opt.condTrigger && eval('(function(){' + opt.condTrigger + '})()'))
                                methods.open(opt, null, $(this), e);
                        }).on(opt.triggerOff + '.' + $.drop.nS, function() {
                            methods.close($(el.attr('data-drop')));
                        });
                    else
                        el.on(opt.trigger + '.' + $.drop.nS, function(e) {
                            if (el.hasClass(aC))
                                methods.close($(el.attr('data-drop')));
                            else
                                methods.open(opt, null, $(this), e);
                            e.stopPropagation();
                            e.preventDefault();
                        });
                }
                else {
                    el.on('contextmenu.' + $.drop.nS, function(e) {
                        e.preventDefault();
                    });
                    el.on('mouseup.' + $.drop.nS, function(e) {
                        e.preventDefault();
                        if (el.hasClass(aC))
                            methods.close($(el.attr('data-drop')));
                        if (e.button === 2)
                            methods.open($.extend(opt, {place: 'noinherit', limitSize: true}), null, $(this), e);
                    });
                }
                var href = el.data('href');
                if (href && window.location.hash.indexOf(href) !== -1 && !$.drop.drp.hrefs[href])
                    methods.open(opt, null, el, null);
                if (/#/.test(href) && !$.drop.drp.hrefs[href])
                    $.drop.drp.hrefs[href] = el;
            });
            for (var i in $.drop.drp.galleries)
                if ($.drop.drp.galleries[i].length <= 1)
                    delete $.drop.drp.galleries[i];
            return $(this);
        },
        destroy: function(el) {
            return (el || this).each(function() {
                var el = $(this),
                        opt = el.data('drp');
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
        _get: function(el, opt, e, hashChange) {
            if (!el)
                el = this;
            var elSet = el.data();
            $.extend(opt, elSet);
            delete opt.drp;

            var rel = null;
            if (el.get(0).rel)
                rel = el.get(0).rel.replace(methods._reg(), '');
            function _update(data) {
                $.drop.hideActivity();
                if (!opt.always && !opt.notify)
                    $.drop.drp.drops[opt.source.replace(methods._reg(), '')] = data;
                var drop = methods._pasteDrop(opt, opt.pattern, rel, $.drop.drp.curDefault);
                drop.attr('pattern', true);
                drop.find($(opt.placePaste)).html(data);
                methods._show(el, e, opt, hashChange);
            }

            if ($.drop.drp.drops[opt.source.replace(methods._reg(), '')]) {
                methods._pasteDrop(opt, $.drop.drp.drops[opt.source.replace(methods._reg(), '')], rel);
                methods._show(el, e, opt, hashChange);
                return el;
            }
            if (elSet.drop && !$.existsN(elSet.drop))
                $.ajax({
                    type: opt.type,
                    data: opt.datas,
                    url: opt.source,
                    beforeSend: function() {
                        if (!opt.moreOne)
                            methods._closeMoreOne();
                        $.drop.showActivity();
                    },
                    dataType: opt.notify ? 'json' : opt.dataType,
                    success: function(data) {
                        $.drop.hideActivity();
                        if (opt.notify)
                            methods._pasteNotify(el, data, opt, rel, hashChange);
                        else {
                            if (!opt.always)
                                $.drop.drp.drops[opt.source.replace(methods._reg(), '')] = data;
                            methods._pasteDrop(opt, data, rel);
                            var drop = $(elSet.drop);
                            $(document).trigger({
                                type: 'successHtml.' + $.drop.nS,
                                el: drop,
                                datas: data
                            });
                            methods._show(el, e, opt, hashChange);
                        }
                    }
                });
            else {
                $.drop.drp.curDefault = opt.defaultClassBtnDrop + (rel ? rel : (opt.source ? opt.source.replace(methods._reg(), '') : (new Date()).getTime()));
                el.data('drop', '.' + $.drop.drp.curDefault).attr('data-drop', '.' + $.drop.drp.curDefault);
                $.drop.showActivity();
                if (opt.source.match(/jpg|gif|png|bmp|jpeg/)) {
                    var img = new Image();
                    $(img).load(function() {
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
                        success: function(data) {
                            _update(data);
                        }
                    });
            }
            return el;
        },
        open: function(opt, datas, $this, e, hashChange) {
            e = e ? e : window.event;
            opt = $.extend({}, $.drop.dP, opt);
            if (!$this) {
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
                        methods._notifyTrigger($this, $.extend(opt, $this.data()));
                    }
                    else {
                        var sourcePref = opt.source.replace(methods._reg(), '');
                        if (!$.exists('.refer' + opt.defaultClassBtnDrop + sourcePref))
                            $this = $('<div><button class="refer' + (opt.defaultClassBtnDrop + sourcePref) + '"></button></div>').appendTo($('body')).hide().children();
                        else
                            $this = $('.refer' + opt.defaultClassBtnDrop + sourcePref);
                    }
                }
            }
            $this.each(function() {
                var $this = $(this);
                $.extend(opt, $this.data());
                delete opt.drp;
                var drop = $(opt.drop);
                opt.source = opt.source || $this.attr('href');
                if (opt.always && opt.source && $.existsN(drop) && !opt.notify) {
                    drop.remove();
                    delete $.drop.drp.drops[opt.source.replace(methods._reg(), '')];
                }
                if (opt.dropFilter && !opt.drop) {
                    drop = methods._filterSource($this, opt.dropFilter);
                    var _classFilter = opt.defaultClassBtnDrop + (new Date()).getTime();
                    $this.attr('data-drop', '.' + _classFilter);
                    opt.drop = '.' + _classFilter;
                    drop.addClass(_classFilter);
                }
                function _confirmF() {
                    if (!$.existsN(drop) || $.existsN(drop) && opt.source && !$.drop.drp.drops[opt.source.replace(methods._reg(), '')] || opt.notify || opt.always) {
                        if (datas && opt.notify)
                            methods._pasteNotify($this, datas, opt, null, hashChange);
                        else if (opt.source)
                            methods._get($this, opt, e, hashChange);
                    }
                    else
                        methods._show($this, e, opt, hashChange);
                }
                if (!$this.hasClass(aC)) {
                    if (!opt.moreOne && !opt.start)
                        methods._closeMoreOne();
                    if (!$this.is(':disabled')) {
                        if (opt.start && !eval(opt.start).call($this, drop, opt))
                            return false;

                        if (opt.notify)//for front validations
                            methods._pasteNotify($this, datas, opt, null, hashChange);
                        else {
                            if (opt.prompt || opt.confirm || opt.source && !$.existsN(drop) || opt.source && opt.always) {
                                if (!opt.confirm && !opt.prompt)
                                    _confirmF();
                                else//for cofirm && prompt
                                    methods._checkMethod(function() {
                                        methods.confirmPrompt(opt, methods, hashChange, _confirmF, e);
                                    });
                            }
                            else if ($.existsN(drop) || opt.source && $.drop.drp.drops[opt.source.replace(methods._reg(), '')]) {
                                methods._pasteDrop(opt, $.existsN(drop) ? drop : $.drop.drp.drops[opt.source.replace(methods._reg(), '')]);
                                methods._show($this, e, opt, hashChange);
                            }
                            else
                                returnMsg('insufficient data');
                        }
                    }
                }
                else
                    methods.close($($this.data('drop')));
            });
            return $this;
        },
        close: function(sel, hashChange, f) {
            var sel2 = sel || this,
                    drop = sel2 instanceof jQuery ? sel2 : $('[data-elrun].' + aC);

            if (!((drop instanceof jQuery) && $.existsN(drop)))
                return false;

            clearTimeout($.drop.drp.closeDropTime);
            drop.each(function() {
                var drop = $(this),
                        opt = drop.data('drp');
                if (!(opt && drop.is(':visible') && (opt.notify || sel || opt.place !== 'inherit' || opt.inheritClose || opt.overlayOpacity !== 0)))
                    return false;

                var $thisB = opt.elrun;
                if (!$thisB)
                    return false;
                var durOff = opt.durationOff;
                function _hide() {
                    $thisB.removeClass(aC);
                    $thisB.each(function() {
                        var $thisHref = $(this).data('href');
                        if ($thisHref) {
                            clearTimeout($.drop.drp.curHashTimeout);
                            $.drop.drp.curHash = hashChange ? $thisHref : null;
                            $.drop.drp.scrollTop = wnd.scrollTop();
                            location.hash = location.hash.replace($thisHref, '');
                            $.drop.drp.curHashTimeout = setTimeout(function() {
                                $.drop.drp.curHash = null;
                                $.drop.drp.scrollTop = null;
                            }, 400);
                        }
                    });
                    drop.removeClass(aC);
                    if (methods.placeAfterClose)
                        methods._checkMethod(function() {
                            methods.placeAfterClose(drop, $thisB, opt);
                        });
                    if (opt.droppableIn)
                        drop.data('drp').positionDroppableIn = {'left': drop.css('left'), 'top': drop.css('top')}

                    var ev = opt.drop ? opt.drop.replace(methods._reg(), '') : '';
                    wnd.off('resize.' + $.drop.nS + ev).off('scroll.' + $.drop.nS + ev);
                    $('body').off('keyup.' + $.drop.nS + ev).off('keyup.' + $.drop.nS).off('click.' + $.drop.nS);

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
                            methods._resetStyleDrop($(this));
                        $this.removeClass(opt.place);
                        if (opt.closed)
                            opt.closed.call($thisB, $this, opt);
                        if (opt.elClosed)
                            eval(opt.elClosed).call($thisB, $this, opt);
                        if (opt.closedG)
                            opt.closedG.call($thisB, $this);
                        $this.add($(document)).trigger({
                            type: 'closed.' + $.drop.nS,
                            drp: {
                                el: $thisB,
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
                    });
                }
                drop.add($(document)).trigger({
                    type: 'close.' + $.drop.nS,
                    drp: {
                        el: $thisB,
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

            return sel2;
        },
        center: function(drop) {
            drop = drop ? drop : this;
            return drop.each(function() {
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
        _resetStyleDrop: function(drop) {
            return drop.css({
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
                methods.close($('[data-elrun].center:visible, [data-elrun].noinherit:visible'));
            return this;
        },
        _notifyTrigger: function(el, opt) {
            el.off('successJson.' + $.drop.nS).on('successJson.' + $.drop.nS, function(e) {
                e = e.drp;
                if (!e)
                    return false

                if (e.datas.answer === "success")
                    $(e.el).find(opt.notifyPlace).empty().append(opt.message.success(e.datas.data));
                else if (e.datas.answer === "error")
                    $(e.el).find(opt.notifyPlace).empty().append(opt.message.error(e.datas.data));
                else
                    $(e.el).find(opt.notifyPlace).empty().append(opt.message.info(e.datas.data));
            });
            return this;
        },
        _pasteNotify: function(el, datas, opt, rel, hashChange) {
            datas = datas || el.data('datas');

            methods._pasteDrop(opt, opt.drop, rel);
            el.trigger({
                type: 'successJson.' + $.drop.nS,
                drp: {
                    el: opt.drop,
                    datas: datas
                }
            });
            methods._show(el, null, opt, hashChange);
            return this;
        },
        _reg: function() {
            return /[^a-zA-Z0-9]+/ig;
        },
        _pasteDrop: function(opt, drop, rel, aClass) {
            var sourcePref = opt.source ? opt.source.replace(methods._reg(), '') : '';
            if (drop instanceof jQuery && drop.attr('pattern'))
                drop.find(drop.data('drp').placePaste).empty().append($.drop.drp.drops[sourcePref]);
            var sdrop = opt.drop;
            if (!opt.drop)
                if (rel)
                    opt.drop = '.' + opt.defaultClassBtnDrop + rel;
                else
                    opt.drop = '.' + opt.defaultClassBtnDrop + sourcePref;
            if (opt.place === 'inherit') {
                if (opt.placeInherit)
                    drop = $(drop).appendTo($(opt.placeInherit).empty());
            }
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
        _show: function($this, e, opt, hashChange) {
            $this = $this || this;
            e = e ? e : window.event;
            var elSet = $this.data(),
                    rel = null,
                    self = $this.get(0);
            $.extend(opt, elSet);
            delete opt.drp;
            if (self.rel)
                rel = self.rel.replace(methods._reg(), '');

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
            //
            var drop = $('[data-elrun="' + opt.drop + '"]');

            opt = $.extend({}, drop.data('drp'), opt);
            opt.elrun = opt.elrun ? opt.elrun.add($this) : $this;
            opt.rel = rel;

            $this.addClass(aC);
            drop.data('drp', opt);

            if (rel)
                methods._checkMethod(function() {
                    methods.galleries($this, opt, methods);
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
            //end
            if (opt.beforeG)
                opt.beforeG.call($this, drop);
            drop.add($(document)).trigger({
                type: 'before.' + $.drop.nS,
                drp: {
                    el: $this,
                    drop: drop,
                    options: opt
                }
            });
            drop.addClass(opt.place);
            methods._positionType(drop);

            var href = $this.data('href');
            if (href) {
                clearTimeout($.drop.drp.curHashTimeout);
                $.drop.drp.curHash = !hashChange ? href : null;
                $.drop.drp.scrollTop = wnd.scrollTop();
                var wlh = window.location.hash;
                if (href.indexOf('#') !== -1 && (new RegExp(href + '#|' + href + '$').exec(wlh) === null))
                    window.location.hash = wlh + href;
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

            wnd.off('resize.' + $.drop.nS + ev).on('resize.' + $.drop.nS + ev, function() {
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
                        methods[opt.place](drop);
                    }, opt.place);
                setTimeout(function() {
                    methods._setHeightAddons(dropOver, forCenter);
                }, 100);
            });
            wnd.off('scroll.' + $.drop.nS + ev).on('scroll.' + $.drop.nS + ev, function() {
                if (opt.place === 'center' && opt.centerOnScroll)
                    methods._checkMethod(function() {
                        methods[opt.place](drop);
                    }, opt.place);
            });
            if (condOverlay)
                dropOver.stop().fadeIn(opt.durationOn / 2);
            if (opt.closeClick)
                $(forCenter).add(dropOver).off('click.' + $.drop.nS + ev).on('click.' + $.drop.nS + ev, function(e) {
                    if ($(e.target).is('.overlayDrop') || $(e.target).is('.forCenter'))
                        methods.close($($(e.target).attr('data-rel')));
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
                methods.close($(this).closest('[data-elrun]'));
            });
            $('body').off('keyup.' + $.drop.nS);
            if (opt.closeEsc)
                $('body').on('keyup.' + $.drop.nS, function(e) {
                    var key = e.keyCode;
                    if (key === 27)
                        methods.close(false);
                });
            $('html, body').css('height', '100%');
            $('body').off('click.' + $.drop.nS).on('click.' + $.drop.nS, function(e) {
                if (opt.closeClick && !$.existsN($(e.target).closest('[data-elrun]')))
                    methods.close(false);
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
                    methods[opt.place](drop, e);
                }, opt.place);

            if (forCenter)
                forCenter.show();

            drop[opt.effectOn](opt.durationOn, function(e) {
                methods._setHeightAddons(dropOver, forCenter);
                if (opt.context)
                    collect.off('contextmenu.' + $.drop.nS);
                var drop = $(this);
                $.drop.drp.curDrop = drop;
                if ($.existsN(drop.find('[data-drop]')))
                    methods.init.call(drop.find('[data-drop]'));
                drop.addClass(aC);
                if (opt.notify && opt.timeclosenotify)
                    $.drop.drp.closeDropTime = setTimeout(function() {
                        methods.close(drop);
                    }, opt.timeclosenotify);
                var cB = opt.elAfter;
                if (cB)
                    eval(cB).call($this, drop, opt);
                if (opt.after)
                    opt.after.call($this, drop, opt);
                if (opt.afterG)
                    opt.afterG.call($this, drop, opt);
                drop.add($(document)).trigger({
                    type: 'after.' + $.drop.nS,
                    drp: {
                        el: $this,
                        drop: drop,
                        options: opt
                    }
                });
                if (opt.droppable && opt.place !== 'inherit')
                    methods._checkMethod(function() {
                        methods.droppable(drop);
                    });
                if (rel && opt.keyNavigate && methods.galleries)
                    $('body').off('keyup.' + $.drop.nS + ev).on('keyup.' + $.drop.nS + ev, function(e) {
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
            $(dropOver).add(forCenter).css('height', '').css('height', $(document).height());
        },
        _checkMethod: function(f, nm) {
            try {
                f();
            } catch (e) {
                var method = f.toString().match(/\.\S*\(/);
                returnMsg('need connect "' + (nm ? nm : method[0].substring(1, method[0].length - 1)) + '" method');
            }
            return this;
        },
        _positionType: function(drop) {
            if (drop.data('drp').place !== 'inherit')
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
    $.dropInit = function() {
        this.nS = 'drop';
        this.method = function(m) {
            if (!/_/.test(m))
                return methods[m];
        };
        this.methods = function() {
            var newM = {};
            for (var i in methods) {
                if (!/_/.test(i))
                    newM[i] = methods[i];
            }
            return newM;
        };
        this.dP = {
            drop: null,
            source: null,
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
            closeEsc: false,
            droppable: false,
            cycle: false,
            limitSize: false,
            droppableLimit: false,
            inheritClose: false,
            keyNavigate: true,
            context: false,
            minHeightContent: 100,
            centerOnScroll: false
        };
        this.drp = {
            hrefs: {},
            drops: {},
            galleries: {},
            scrollemulatetimeout: null,
            curHash: null,
            curDrop: null,
            curHashTimeout: null,
            scrollTop: null
        };
        this.setParameters = function(options) {
            $.extend(this.dP, options);
        };
        this.setMethods = function(ms) {
            $.extend(methods, ms);
        };
    };
    $(document).ready(function() {
        var body = $('body');

        var loadingTimer, loadingFrame = 1,
                loading = $('<div id="drop-loading"><div></div></div>').appendTo(body);

        function _animate_loading() {
            if (!loading.is(':visible')) {
                clearInterval(loadingTimer);
                return;
            }
            $('div', loading).css('top', (loadingFrame * -40) + 'px');
            loadingFrame = (loadingFrame + 1) % 12;
        }

        $.dropInit.prototype.showActivity = function() {
            clearInterval(loadingTimer);
            loading.show();
            loadingTimer = setInterval(_animate_loading, 66);
        };
        $.dropInit.prototype.hideActivity = function() {
            loading.hide();
        };
    });

    $.drop = new $.dropInit();
    var wLH = window.location.hash;
    wnd.off('hashchange.' + $.drop.nS).on('hashchange.' + $.drop.nS, function(e) {
        e.preventDefault();
        if ($.drop.drp.scrollTop)
            $('html, body').scrollTop($.drop.drp.scrollTop);
        var wLHN = window.location.hash;
        if (!$.drop.drp.curHash)
            for (var i in $.drop.drp.hrefs) {
                if (wLH.indexOf(i) === -1 && wLHN.indexOf(i) !== -1)
                    methods.open({}, null, $.drop.drp.hrefs[i], e, true);
                else
                    methods.close($($.drop.drp.hrefs[i].data('drop')), true);
            }
        wLH = wLHN;
    });
    $(document).ready(function() {
        $('[data-drop]').drop();
    });
})(jQuery, $(window));
/*/plugin drop end*/