$.drop.setMethod('confirmPromptAlert', function (opt, hashChange, _confirmF, e, el) {
    var self = this,
            $ = jQuery;
    if (opt.alert) {
        var optC = $.extend({}, opt),
                drop = self._pasteDrop(optC, opt.patternAlert),
                pp = drop.find(opt.placePaste).empty();

        if (opt.alertText && $.drop.drp.existsN(pp))
            pp.html(function () {
                try {
                    if ($.type(eval(opt.alertText)) === 'function')
                        return eval(opt.alertText).call($(this), opt, drop, el);
                } catch (e) {
                    return opt.alertText;
                }
            });

        self._show.call(el, drop, e, optC, hashChange);

        (function (drop, _confirmF, opt) {
            drop.find(opt.alertActionBtn).off('click.' + $.drop.nS).on('click.' + $.drop.nS, function (e) {
                e.stopPropagation();
                self.close.call(drop, e, _confirmF);
                if (opt.ok)
                    eval(opt.ok).call(el, opt, drop, e, 'alert');
                drop.trigger('dropOk', {
                    type: 'alert',
                    event: e,
                    anchor: el,
                    drop: drop,
                    options: opt
                });
            });
        })(drop, _confirmF, opt);
    }
    else if (opt.confirm) {
        var optC = $.extend({}, opt),
                drop = self._pasteDrop(optC, opt.patternConfirm),
                pp = drop.find(opt.placePaste).empty();
        if (opt.confirmText && $.drop.drp.existsN(pp))
            pp.html(function () {
                try {
                    if ($.type(eval(opt.confirmText)) === 'function')
                        return eval(opt.confirmText).call($(this), opt, drop, el);
                } catch (e) {
                    return opt.confirmText;
                }
            });

        self._show.call(el, drop, e, optC, hashChange);

        (function (drop, _confirmF, opt) {
            drop.find(opt.confirmActionBtn).off('click.' + $.drop.nS).on('click.' + $.drop.nS, function (e) {
                e.stopPropagation();
                self.close.call(drop, e, _confirmF);
                if (opt.ok)
                    eval(opt.ok).call(el, opt, drop, e, 'confirm');
                drop.trigger('dropOk', {
                    type: 'confirm',
                    event: e,
                    anchor: el,
                    drop: drop,
                    options: opt
                });
            });
        })(drop, _confirmF, opt);
    }
    else if (opt.prompt) {
        var optP = $.extend({}, opt),
                drop = self._pasteDrop(optP, opt.patternPrompt),
                pp = drop.find(opt.placePaste).empty();

        if (opt.promptText && $.drop.drp.existsN(pp))
            pp.html(function () {
                try {
                    if ($.type(eval(opt.promptText)) === 'function')
                        return eval(opt.promptText).call($(this), opt, drop, el);
                } catch (e) {
                    return opt.promptText;
                }
            });

        self._show.call(el, drop, e, optP, hashChange);

        (function (drop, _confirmF, opt, optP) {
            drop.find(opt.promptActionBtn).off('click.' + $.drop.nS).on('click.' + $.drop.nS, function (e) {
                e.stopPropagation();
                var getUrlVars = function (url) {
                    var hash, myJson = {}, hashes = url.slice(url.indexOf('?') + 1).split('&');
                    for (var i = 0; i < hashes.length; i++) {
                        hash = hashes[i].split('=');
                        myJson[hash[0]] = hash[1];
                    }
                    return myJson;
                };

                optP.dataPrompt = opt.dataPrompt = getUrlVars($(this).closest('form').serialize());
                self.close.call(drop, e, _confirmF);
                if (opt.ok)
                    eval(opt.ok).call(el, opt, drop, e, 'prompt', opt.dataPrompt);
                drop.trigger('dropOk', {
                    type: 'prompt',
                    dataPrompt: opt.dataPrompt,
                    event: e,
                    anchor: el,
                    drop: drop,
                    options: opt
                });
            });
        })(drop, _confirmF, opt, optP);
    }
    el.data('dropConfirmPromptAlert', drop);
    return self;
});