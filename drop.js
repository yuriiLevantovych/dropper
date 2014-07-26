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
    var isTouch = 'ontouchstart' in document.documentElement;
    var aC = 'active';
    var methods = {
        init: function(options) {
            this.each(function() {
                var el = methods.destroy($(this)),
                        elSet = el.data(),
                        trigger = methods._checkProp(elSet, options, 'trigger'),
                        triggerOn = methods._checkProp(elSet, options, 'triggerOn'),
                        triggerOff = methods._checkProp(elSet, options, 'triggerOff'),
                        condTrigger = methods._checkProp(elSet, options, 'condTrigger'),
                        notify = methods._checkProp(elSet, options, 'notify');
                if (notify)
                    methods._notifyTrigger(el, elSet, options);
                var rel = this.rel;
                if (rel) {
                    rel = rel.replace(methods._reg(), '');
                    var source = el.data('source') || this.href;
                    if (source) {
                        if (!$.drop.drp.galleries[rel])
                            $.drop.drp.galleries[rel] = new Array();
                        $.drop.drp.galleries[rel].push(source);
                    }
                }

                el.data({
                    'drp': options
                }).addClass('isDrop');
                if (triggerOn || triggerOff)
                    el.data({'triggerOn': triggerOn, 'triggerOff': triggerOff}).on(triggerOn + '.' + $.drop.nS + ' ' + triggerOff + '.' + $.drop.nS, function(e) {
                        e.stopPropagation();
                        e.preventDefault();
                    }).on(triggerOn + '.' + $.drop.nS, function(e) {
                        if (condTrigger && eval('(function(){' + condTrigger + '})()'))
                            methods.open(options, null, $(this), e);
                    }).on(triggerOff + '.' + $.drop.nS, function() {
                        methods.close($(el.attr('data-drop')));
                    });
                else
                    el.data('trigger', trigger).on(trigger + '.' + $.drop.nS, function(e) {
                        if (el.parent().hasClass(aC))
                            methods.close($(el.attr('data-drop')));
                        else
                            methods.open(options, null, $(this), e);
                        e.stopPropagation();
                        e.preventDefault();
                    });
                el.on('contextmenu.' + $.drop.nS, function(e) {
                    e.preventDefault();
                });
                var href = el.data('href');
                if (href && window.location.hash.indexOf(href) !== -1 && !$.drop.drp.hrefs[href])
                    methods.open(options, null, el, null);
                if (/#/.test(href) && !$.drop.drp.hrefs[href])
                    $.drop.drp.hrefs[href] = el;
            });
            for (var i in $.drop.drp.galleries)
                if ($.drop.drp.galleries[i].length <= 1)
                    delete $.drop.drp.galleries[i];
            return $(this);
        },
        destroy: function(el) {
            el = el ? el : this;
            el.each(function() {
                var el = $(this),
                        elSet = el.data();
                el.removeClass('isDrop');
                if (elSet.trigger)
                    el.off(elSet.trigger + '.' + $.drop.nS).removeData(elSet.trigger);
                if (elSet.triggerOn)
                    el.off(elSet.triggerOn + '.' + $.drop.nS).removeData(elSet.triggerOn);
                if (elSet.triggerOff)
                    el.off(elSet.triggerOff + '.' + $.drop.nS).removeData(elSet.triggerOff);
            });
            return el;
        },
        get: function(el, set, e, hashChange) {
            if (!el)
                el = this;
            if (!set)
                set = el.data('drp');
            var elSet = el.data(),
                    source = methods._checkProp(elSet, set, 'source') || el.attr('href'),
                    always = methods._checkProp(elSet, set, 'always'),
                    notify = methods._checkProp(elSet, set, 'notify'),
                    type = methods._checkProp(elSet, set, 'type'),
                    dataType = methods._checkProp(elSet, set, 'dataType'),
                    datas = methods._checkProp(elSet, set, 'datas');
            var rel = null;
            if (el.get(0).rel)
                rel = el.get(0).rel.replace(methods._reg(), '');
            function _update(data) {
                $.drop.hideActivity();
                if (!always && !notify)
                    $.drop.drp.drops[source.replace(methods._reg(), '')] = data;
                var drop = methods._pasteDrop($.extend({}, $.drop.dP, set, elSet), methods._checkProp(elSet, set, 'pattern'), $.drop.drp.curDefault, rel);
                drop.attr('pattern', 'yes');
                drop.find($(methods._checkProp(elSet, set, 'placePaste'))).html(data);
                methods._show(el, e, set, data, hashChange);
            }

            if ($.drop.drp.drops[source.replace(methods._reg(), '')]) {
                methods._pasteDrop($.extend({}, $.drop.dP, set, elSet), $.drop.drp.drops[source.replace(methods._reg(), '')], null, rel);
                methods._show(el, e, set, false, hashChange);
                return el;
            }
            if (elSet.drop)
                $.ajax({
                    type: type,
                    data: datas,
                    url: source,
                    beforeSend: function() {
                        if (!methods._checkProp(elSet, set, 'moreOne'))
                            methods._closeMoreOne();
                        $.drop.showActivity();
                    },
                    dataType: notify ? 'json' : dataType,
                    success: function(data) {
                        $.drop.hideActivity();
                        if (!always && !notify)
                            $.drop.drp.drops[source.replace(methods._reg(), '')] = data;
                        if (notify)
                            methods._pasteModal(el, data, set, rel, hashChange);
                        else {
                            methods._pasteDrop($.extend({}, $.drop.dP, set, elSet), data, null, rel);
                            var drop = $(elSet.drop);
                            $(document).trigger({
                                type: 'successHtml.' + $.drop.nS,
                                el: drop,
                                datas: data
                            });
                            methods._show(el, e, set, data, hashChange);
                        }
                    }
                });
            else {
                $.drop.drp.curDefault = methods._checkProp(elSet, set, 'defaultClassBtnDrop') + (rel ? rel : (source ? source.replace(methods._reg(), '') : (new Date()).getTime()));
                el.data('drop', '.' + $.drop.drp.curDefault).attr('data-drop', '.' + $.drop.drp.curDefault);
                $.drop.showActivity();
                if (source.match(/jpg|gif|png|bmp|jpeg/)) {
                    var img = new Image();
                    $(img).load(function() {
                        _update($(this));
                    });
                    img.src = source;
                }
                else
                    $.ajax({
                        type: type,
                        url: source,
                        data: datas,
                        dataType: dataType ? dataType : 'html',
                        success: function(data) {
                            _update(data);
                        }
                    });
            }
            return el;
        },
        open: function(opt, datas, $this, e, hashChange) {
            e = e ? e : window.event;
            if (!$this) {
                if ($(this).hasClass('isDrop'))
                    $this = this;
                else {
                    if (datas) {
                        var notifyBtnDrop = methods._checkProp(null, opt, 'notifyBtnDrop');
                        if (!$.exists('[data-drop="' + notifyBtnDrop + '"]')) {
                            $this = $('<div><button data-drop="' + notifyBtnDrop + '" data-notify="true"></button></div>').appendTo($('body')).hide().children();
                            methods._pasteDrop($.extend({}, $.drop.dP, opt, $this.data()), methods._checkProp($this.data(), opt, 'patternNotif'));
                        }
                        else
                            $this = $('[data-drop="' + notifyBtnDrop + '"]');
                        $this.data('datas', datas);
                        methods._notifyTrigger($this, $this.data(), opt);
                    }
                    else {
                        var sourcePref = opt.source.replace(methods._reg(), ''),
                                defaultClassBtnDrop = methods._checkProp(null, opt, 'defaultClassBtnDrop');
                        if (!$.exists('.refer' + defaultClassBtnDrop + sourcePref))
                            $this = $('<div><button class="refer' + (defaultClassBtnDrop + sourcePref) + '"></button></div>').appendTo($('body')).hide().children();
                        else
                            $this = $('.refer' + defaultClassBtnDrop + sourcePref);
                    }
                }
            }
            $this.each(function() {
                var $this = $(this),
                        elSet = $this.data(),
                        moreOne = methods._checkProp(elSet, opt, 'moreOne'),
                        source = methods._checkProp(elSet, opt, 'source') || $this.attr('href'),
                        notify = methods._checkProp(elSet, opt, 'notify'),
                        always = methods._checkProp(elSet, opt, 'always'),
                        drop = $(elSet.drop),
                        dropFilter = methods._checkProp(elSet, opt, 'dropFilter'),
                        start = elSet.start;
                if (always && $.existsN(drop) && !notify) {
                    drop.remove();
                    delete $.drop.drp.drops[source.replace(methods._reg(), '')];
                }
                elSet.source = source; //may delete?
                if (dropFilter && !elSet.drop) {
                    drop = methods._filterSource($this, dropFilter);
                    var _classFilter = methods._checkProp(elSet, opt, 'defaultClassBtnDrop') + (new Date()).getTime();
                    $this.attr('data-drop', '.' + _classFilter);
                    elSet.drop = '.' + _classFilter;
                    drop.addClass(_classFilter);
                }
                function _confirmF() {
                    if (!$.existsN(drop) || $.existsN(drop) && source && !$.drop.drp.drops[source.replace(methods._reg(), '')] || notify || always) {
                        if (datas && notify)
                            methods._pasteModal($this, datas, opt, null, hashChange);
                        else
                            methods.get($this, opt, e, hashChange);
                    }
                    else
                        methods._show($this, e, opt, false, hashChange);
                }

                if (!$this.parent().hasClass(aC)) {
                    if (!moreOne && !start)
                        methods._closeMoreOne();
                    if (!$this.is(':disabled')) {
                        var confirm = methods._checkProp(elSet, opt, 'confirm'),
                                prompt = methods._checkProp(elSet, opt, 'prompt');
                        if (start && !eval(start)($this, drop))
                            return false;
                        if (($.existsN(drop) && !notify || source && $.drop.drp.drops[source.replace(methods._reg(), '')]) && !always && !confirm && !prompt) {
                            methods._pasteDrop($.extend({}, $.drop.dP, opt, elSet), $.existsN(drop) ? drop : $.drop.drp.drops[source.replace(methods._reg(), '')]);
                            methods._show($this, e, opt, false, hashChange);
                        }
                        else if (prompt || confirm || source || always) {
                            if (!confirm && !prompt)
                                _confirmF();
                            else//for cofirm && prompt
                                methods._checkMethod(function() {
                                    methods.confirmPrompt(source, methods, elSet, opt, hashChange, _confirmF, e);
                                });
                        }
                        else //for front validations
                            methods._pasteModal($this, datas, opt, null, hashChange);
                    }
                }
                else
                    methods.close($($this.data('drop')));
            });
            return $this;
        },
        close: function(sel, hashChange, f) {
            var sel2 = sel;
            if (!sel2)
                sel2 = this.self ? this.self : this;
            var drop = sel2 instanceof jQuery ? sel2 : $('[data-elrun].' + aC);
            if ((drop instanceof jQuery) && $.existsN(drop)) {
                clearTimeout($.drop.drp.closeDropTime);
                drop.each(function() {
                    var drop = $(this),
                            set = $.extend({}, drop.data('drp'));
                    if (set && drop.is(':visible') && (set.notify || sel || set.place !== 'inherit' || set.inheritClose || set.overlayOpacity !== 0)) {
                        var $thisB = set.elrun;
                        if ($thisB) {
                            var durOff = set.durationOff;
                            function _hide() {
                                $thisB.parent().removeClass(aC);
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
                                        methods.placeAfterClose(drop, $thisB, set);
                                    });
                                if (set.droppableIn)
                                    drop.data('drp').positionDroppableIn = {'left': drop.css('left'), 'top': drop.css('top')}
                                drop[set.effectOff](durOff, function() {
                                    var $this = $(this),
                                            ev = set.drop ? set.drop.replace(methods._reg(), '') : '';
                                    if (set.forCenter)
                                        set.forCenter.hide();
                                    wnd.off('resize.' + $.drop.nS + ev).off('scroll.' + $.drop.nS + ev);
                                    $('body').off('keyup.' + $.drop.nS + ev).off('keyup.' + $.drop.nS).off('click.' + $.drop.nS);
                                    var zInd = 0,
                                            drpV = null;
                                    $('[data-elrun]:visible').each(function() {
                                        var $this = $(this);
                                        if (parseInt($this.css('z-index')) > zInd) {
                                            zInd = parseInt($this.css('z-index'));
                                            drpV = $.extend({}, $this.data('drp'));
                                        }
                                    });
                                    if (drpV && drpV.overlayOpacity !== 0 && !isTouch)
                                        $('body').addClass('isScroll').css({
                                            'overflow': 'hidden',
                                            'margin-right': $.drop.widthScroll
                                        });
                                    else
                                        $('body').removeClass('isScroll').css({
                                            'overflow': '',
                                            'margin-right': ''
                                        });
                                    if (set.dropOver && !f)
                                        set.dropOver.fadeOut(durOff);
                                    methods._resetStyleDrop($(this));
                                    $this.removeClass(set.place);
                                    if (set.closed)
                                        set.closed($thisB, $this);
                                    if (set.elClosed)
                                        eval(set.elClosed)($thisB, $this);
                                    if (set.closedG)
                                        eval(set.closedG)($thisB, $this);
                                    $this.add($(document)).trigger({
                                        type: 'closed.' + $.drop.nS,
                                        el: $thisB,
                                        drop: $this
                                    });
                                    var dC = $this.find($(set.dropContent)).data('jsp');
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
                                el: $thisB,
                                drop: drop
                            });
                            var close = set.elClose || set.close || set.closeG;
                            if (close) {
                                if (typeof close === 'string')
                                    var res = eval(close)($thisB, $(this));
                                else
                                    var res = close($thisB, $(this));
                                if (res === false && res !== true)
                                    returnMsg(res);
                                else
                                    _hide();
                            }
                            else
                                _hide();
                        }
                    }
                });
            }
            return sel;
        },
        center: function(drop, start) {
            if (!drop)
                drop = this.self ? this.self : this;
            drop.each(function() {
                var drop = $(this),
                        drp = drop.data('drp');
                if (drp && !drp.droppableIn) {
                    var method = drp.animate && !start ? 'animate' : 'css',
                            dropV = drop.is(':visible'),
                            w = dropV ? drop.outerWidth() : drop.actual('outerWidth'),
                            h = dropV ? drop.outerHeight() : drop.actual('outerHeight'),
                            top = Math.floor((wnd.height() - h) / 2),
                            left = Math.floor((wnd.width() - w - $.drop.widthScroll) / 2);
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
            return drop;
        },
        _resetStyleDrop: function(drop) {
            return drop.css({
                'z-index': '',
                'width': '',
                'height': '',
                'top': '',
                'left': '',
                'bottom': '',
                'right': '',
                'position': ''
            });
        },
        _checkProp: function(elSet, opt, prop) {
            if (!elSet)
                elSet = {};
            if (!opt)
                opt = {};
            if (!isNaN(parseFloat($.drop.dP[prop])) && isFinite($.drop.dP[prop]))
                return +((elSet[prop] !== undefined && elSet[prop] !== null ? elSet[prop].toString() : elSet[prop]) || (opt[prop] !== undefined && opt[prop] !== null ? opt[prop].toString() : opt[prop]) || $.drop.dP[prop].toString());
            if ($.drop.dP[prop] !== undefined && $.drop.dP[prop] !== null && ($.drop.dP[prop].toString().toLowerCase() === 'false' || $.drop.dP[prop].toString().toLowerCase() === 'true'))
                return ((/^true$/i).test(elSet[prop] !== undefined && elSet[prop] !== null ? elSet[prop].toString().toLowerCase() : elSet[prop])) || ((/^true$/i).test(opt[prop] !== undefined && opt[prop] !== null ? opt[prop].toString().toLowerCase() : opt[prop])) || (elSet[prop] !== undefined && elSet[prop] !== null || opt[prop] !== undefined && opt[prop] !== null ? false : $.drop.dP[prop]);
            else
                return elSet[prop] || (opt[prop] ? opt[prop] : false) || $.drop.dP[prop];
            return this;
        },
        _closeMoreOne: function() {
            if ($.exists('[data-elrun].center:visible, [data-elrun].noinherit:visible'))
                methods.close($('[data-elrun].center:visible, [data-elrun].noinherit:visible'));
            return this;
        },
        _notifyTrigger: function(el, elSet, set) {
            el.off('successJson.' + $.drop.nS).on('successJson.' + $.drop.nS, function(e) {
                if (e.datas) {
                    if (e.datas.answer === "success")
                        e.el.find(methods._checkProp(elSet, set, 'notifyPlace')).empty().append(methods._checkProp(elSet, set, 'message').success(e.datas.data));
                    else if (e.datas.answer === "error")
                        e.el.find(methods._checkProp(elSet, set, 'notifyPlace')).empty().append(methods._checkProp(elSet, set, 'message').error(e.datas.data));
                    else
                        e.el.find(methods._checkProp(elSet, set, 'notifyPlace')).empty().append(methods._checkProp(elSet, set, 'message').info(e.datas.data));
                }
            });
            return this;
        },
        _pasteModal: function(el, datas, set, rel, hashChange) {
            var elSet = el.data(),
                    drop = $(elSet.drop);
            datas = datas || el.data('datas');
            methods._pasteDrop($.extend({}, $.drop.dP, set, elSet), drop, null, rel);
            el.trigger({
                type: 'successJson.' + $.drop.nS,
                el: drop,
                datas: datas
            });
            methods._show(el, null, set, datas, hashChange);
            return this;
        },
        _reg: function() {
            return /[^a-zA-Z0-9]+/ig;
        },
        _pasteDrop: function(set, drop, addClass, rel) {
            if (drop instanceof jQuery && drop.attr('pattern'))
                drop.find(drop.data('drp').placePaste).empty().append($.drop.drp.drops[set.source.replace(methods._reg(), '')]);
            addClass = addClass ? addClass : '';
            rel = rel ? rel : '';
            if (set.place === 'inherit') {
                if (set.placeInherit)
                    drop = $(drop).appendTo($(set.placeInherit).empty());
            }
            else {
                function _for_center(rel) {
                    $('body').append('<div class="forCenter" data-rel="' + rel + '" style="left: 0;width: 100%;display:none;height: 100%;position: absolute;height: 100%;overflow-x: auto;overflow-y: scroll;"></div>');
                }
                if (set.place === 'noinherit')
                    drop = $(drop).appendTo($('body'));
                else {
                    var sel = '[data-rel="' + set.drop + '"].forCenter';
                    if (!$.exists(sel))
                        _for_center(set.drop);
                    var drp = $(sel).find('[data-elrun]').data('drp') || {};
                    drop = $(drop).appendTo($(sel).empty());
                    drop.data('drp', drp);
                }
            }
            return drop.addClass(addClass).filter(set.drop).attr('data-rel', rel).attr('data-elrun', set.drop);
        },
        _pasteContent: function($this, drop, opt) {
            function _pasteContent(content, place) {
                if (content) {
                    place = drop.find(place);
                    if (typeof content === 'string' || typeof content === 'number' || typeof content === 'object')
                        place.empty().append(content);
                    else if (typeof content === 'function')
                        content(place, $this, drop);
                }
            }
            _pasteContent(opt.contentHeader, opt.dropHeader);
            _pasteContent(opt.contentContent, opt.dropContent);
            _pasteContent(opt.contentFooter, opt.dropFooter);
            return this;
        },
        _show: function($this, e, set, data, hashChange) {
            $this = $this ? $this : this;
            e = e ? e : window.event;
            var elSet = $this.data(),
                    rel = null,
                    opt = {},
                    self = $this.get(0);
            set = $.extend({}, set ? set : elSet.drp);
            if (self.rel)
                rel = self.rel.replace(methods._reg(), '');
            for (var i in $.drop.dP)
                opt[i] = methods._checkProp(elSet, set, i);
            //callbacks for element, options and global $.drop.dP
            opt.elStart = elSet.start;
            opt.elBefore = elSet.before;
            opt.elAfter = elSet.after;
            opt.elClose = elSet.close;
            opt.elClosed = elSet.closed;
            //
            opt.before = set.before;
            opt.after = set.after;
            opt.close = set.close;
            opt.closed = set.closed;
            //
            opt.beforeG = $.drop.dP.before;
            opt.afterG = $.drop.dP.after;
            opt.closeG = $.drop.dP.close;
            opt.closedG = $.drop.dP.closed;
            //
            opt.drop = elSet.drop;
            var drop = $('[data-elrun="' + opt.drop + '"]'),
                    drp = $.extend({}, drop.data('drp'));
            opt.elrun = drp.elrun ? drp.elrun.add($this) : $this;
            opt.rel = rel;
            $this.attr({
                'data-drop': opt.drop
            }).parent().addClass(aC);
            drop.data('drp', $.extend(drp, opt, {
                'methods': $.extend({}, {
                    'self': drop,
                    'elrun': opt.elrun
                }, $.drop.methods())
            }));
            if (rel)
                methods._checkMethod(function() {
                    methods.galleries($this, set, methods);
                });
            var overlays = $('.overlayDrop').css('z-index', 1103),
                    condOverlay = opt.overlayOpacity !== 0,
                    dropOver = null;
            if (condOverlay) {
                if (!$.exists('[data-rel="' + opt.drop + '"].overlayDrop'))
                    $('body').append('<div class="overlayDrop" data-rel="' + opt.drop + '" style="display:none;position:absolute;width:100%;left:0;top:0;"></div>');
                dropOver = $('[data-rel="' + opt.drop + '"].overlayDrop');
                drop.data('drp').dropOver = dropOver;
                dropOver.css('height', '').css({
                    'background-color': opt.overlayColor,
                    'opacity': opt.overlayOpacity,
                    'height': $(document).height(),
                    'z-index': overlays.length + 1103
                });
            }

            $('.forCenter').css('z-index', 1104);
            var forCenter = null,
                    objForC = $('[data-rel="' + opt.drop + '"].forCenter');
            if ($.existsN(objForC))
                forCenter = objForC;
            if (forCenter) {
                if (isTouch)
                    forCenter.css('height', '').css('height', $(document).height());
                drop.data('drp').forCenter = forCenter;
                forCenter.css('z-index', overlays.length + 1104);
            }
            drop.css('z-index', overlays.length + 1104);
            methods._pasteContent($this, drop, opt);
            if (opt.elBefore)
                eval(opt.elBefore)($this, drop, data);
            if (opt.before)
                opt.before($this, drop, data);
            if (opt.beforeG)
                opt.beforeG($this, drop, data);
            drop.add($(document)).trigger({
                'type': 'before.' + $.drop.nS,
                'el': $this,
                'drop': drop,
                'datas': data
            });
            drop.addClass(opt.place);
            methods._positionType(drop);
            if (!isTouch && opt.place !== 'inherit' && opt.overlayOpacity !== 0)
                $('body').addClass('isScroll').css({'overflow': 'hidden', 'margin-right': $.drop.widthScroll});
            if (opt.limitSize)
                methods._checkMethod(function() {
                    methods.limitSize(drop);
                });
            if (opt.limitContentSize)
                methods._checkMethod(function() {
                    methods.heightContent(drop);
                });
            if (forCenter)
                forCenter.css('top', wnd.scrollTop()).show();
            if (methods.placeBeforeShow)
                methods._checkMethod(function() {
                    methods.placeBeforeShow(drop, $this, methods, opt.place, opt.placeBeforeShow);
                });
            if (opt.place !== 'inherit')
                methods._checkMethod(function() {
                    methods[opt.place](drop);
                });
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
            $(opt.next).add($(opt.prev)).css('height', drop.actual('height'));
            var ev = opt.drop ? opt.drop.replace(methods._reg(), '') : '';
            wnd.off('resize.' + $.drop.nS + ev).on('resize.' + $.drop.nS + ev, function() {
                if (opt.limitSize)
                    methods._checkMethod(function() {
                        methods.limitSize(drop);
                    });
                if (opt.limitContentSize)
                    methods._checkMethod(function() {
                        methods.heightContent(drop);
                    });
                if (opt.place !== 'inherit')
                    methods[opt.place](drop);
                setTimeout(function() {
                    if (dropOver)
                        dropOver.css('height', '').css('height', $(document).height());
                    if (forCenter && isTouch)
                        forCenter.css('height', '').css('height', $(document).height());
                }, 100);
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
            $('html').css('height', '100%');
            $('body').css('height', '100%').off('click.' + $.drop.nS).on('click.' + $.drop.nS, function(e) {
                if (opt.closeClick && !$.existsN($(e.target).closest('[data-elrun]')))
                    methods.close(false);
            });
            drop[opt.effectOn](opt.durationOn, function(e) {
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
                    eval(cB)($this, drop, data);
                if (opt.after)
                    opt.after($this, drop, data);
                if (opt.afterG)
                    opt.afterG($this, drop, data);
                drop.add($(document)).trigger({
                    'type': 'after.' + $.drop.nS,
                    'el': $this,
                    'drop': drop,
                    'datas': data
                });
                if (opt.droppable && opt.place !== 'inherit')
                    methods._checkMethod(function() {
                        methods.droppable(drop);
                    });
                wnd.off('scroll.' + $.drop.nS + ev).on('scroll.' + $.drop.nS + ev, function(e) {
                    if (opt.place === 'center')
                        methods.center(drop);
                });
                if (rel && opt.keyNavigate && methods.galleries)
                    $('body').off('keyup.' + $.drop.nS + ev).on('keyup.' + $.drop.nS + ev, function(e) {
                        $(this).off('keyup.' + $.drop.nS + ev);
                        var key = e.keyCode;
                        if (key === 37)
                            $(opt.prev).trigger('click.' + $.drop.nS);
                        if (key === 39)
                            $(opt.next).trigger('click.' + $.drop.nS);
                    });
            });
            return this;
        },
        _checkMethod: function(f) {
            try {
                f();
            } catch (e) {
                var method = f.toString().match(/\.\S*\(/);
                returnMsg('need connect ' + method[0].substring(1, method[0].length - 1) + ' method');
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
                    return '<div class = "msg js-msg"><div class = "success"><span class = "icon_info"></span><div class="text-el">' + text + '</div></div></div>';
                },
                error: function(text) {
                    return '<div class = "msg js-msg"><div class = "error"><span class = "icon_info"></span><div class="text-el">' + text + '</div></div></div>';
                },
                info: function(text) {
                    return '<div class = "msg js-msg"><div class = "info"><span class = "icon_info"></span><div class="text-el">' + text + '</div></div></div>';
                }
            },
            trigger: 'click',
            triggerOn: '',
            triggerOff: '',
            exit: '[data-closed = "closed-js"]',
            effectOn: 'fadeIn',
            effectOff: 'fadeOut',
            place: 'center',
            placement: 'top left',
            overlayColor: '#fff',
            position: 'absolute',
            placeBeforeShow: 'center center',
            placeAfterClose: 'center center',
            before: function() {
            },
            after: function() {
            },
            close: function() {
            },
            closed: function() {
            },
            pattern: '<div class="drop drop-style drop-default" style="background-color: #fff;"><button type="button" class="icon-times-drop" data-closed="closed-js" style="position: absolute;right: 5px;top: 5px;background-color: red;width: 10px;height: 10px;"></button><div class="drop-header-default"></div><div class="drop-content-default"><button class="drop-prev" type="button"  style="display:none;font-size: 30px;position:absolute;width: 35%;left: 20px;top:0;text-align: left;"><</button><button class="drop-next" type="button" style="display:none;font-size: 30px;position:absolute;width: 35%;right: 20px;top:0;text-align: right;">></button><div class="inside-padd placePaste" style="padding: 20px 40px;text-align: center;"></div></div><div class="drop-footer-default"></div></div>',
            notifyBtnDrop: '#drop-notification-default',
            defaultClassBtnDrop: 'drop-default',
            patternNotif: '<div class="drop drop-style" id="drop-notification-default" style="background-color: #fff;"><div class="drop-header-default" style="padding: 10px 20px;border-bottom: 1px solid #ccc;"></div><div class="drop-content-default"><div class="inside-padd drop-notification-default"></div></div><div class="drop-footer-default"></div></div>',
            confirmBtnDrop: '#drop-confirm-default',
            confirmActionBtn: '[data-button-confirm]',
            patternConfirm: '<div class="drop drop-style" id="drop-confirm-default" style="background-color: #fff;"><button type="button" class="icon-times-drop" data-closed="closed-js" style="position: absolute;right: 5px;top: 5px;background-color: red;width: 10px;height: 10px;"></button><div class="drop-header-default" style="padding: 10px 20px;border-bottom: 1px solid #ccc;">Confirm</div><div class="drop-content-default"><div class="inside-padd" style="padding: 20px 40px;text-align: center;"><div class="drop-btn-confirm" style="margin-right: 10px;"><button type="button" data-button-confirm><span class="text-el">confirm</span></button></div><div class="drop-btn-cancel"><button type="button" data-closed="closed-js"><span class="text-el">cancel</span></button></div></div></div><div class="drop-footer-default"></div></div>',
            promptBtnDrop: '#drop-prompt-default',
            promptActionBtn: '[data-button-prompt]',
            promptInput: '[name="promptInput"]',
            patternPrompt: '<div class="drop drop-style" id="drop-prompt-default" style="background-color: #fff;"><button type="button" class="icon-times-drop" data-closed="closed-js" style="position: absolute;right: 5px;top: 5px;background-color: red;width: 10px;height: 10px;"></button><div class="drop-header-default" style="padding: 10px 20px;border-bottom: 1px solid #ccc;">Prompt</div><div class="drop-content-default"><form class="inside-padd" style="padding: 20px 40px;text-align: center;"><input type="text" name="promptInput"/><div class="drop-btn-prompt" style="margin-right: 10px;"><button type="button" data-button-prompt><span class="text-el">ok</span></button></div><div class="drop-btn-cancel"><button type="submit" data-closed="closed-js"><span class="text-el">cancel</span></button></div></form></div><div class="drop-footer-default"></div></div>',
            promptInputValue: '',
            next: '.drop-next',
            prev: '.drop-prev',
            type: 'post',
            dataType: null,
            overlayOpacity: 0.7,
            durationOn: 200,
            durationOff: 100,
            timeclosenotify: 2000,
            notify: false,
            confirm: false,
            prompt: false,
            always: false,
            animate: false,
            moreOne: false,
            closeClick: true,
            closeEsc: false,
            droppable: true,
            cycle: false,
            limitSize: false,
            limitContentSize: false,
            scrollContent: false,
            droppableLimit: false,
            inheritClose: false,
            keyNavigate: false
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
        var body = $('body'),
                el = $('<div/>').appendTo(body).css({
            'height': 100,
            'width': 100,
            'overflow': 'scroll'
        }).wrap($('<div style="width:0;height:0;overflow:hidden;"></div>'));
        $.dropInit.prototype.widthScroll = el.width() - el.get(0).clientWidth;
        el.parent().remove();
        var loadingTimer, loadingFrame = 1,
                loading = $('<div id="fancybox-loading"><div></div></div>').appendTo(body);

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