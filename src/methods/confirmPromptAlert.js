jQuery.dropper.setMethod('confirmPromptAlert', function (opt, hashChange, _confirmF, e, el, undefined) {
    var self = this,
            $ = jQuery;
    if (opt.alert) {
        var optC = $.extend({}, opt),
                dropper = self._pasteDropper(optC, opt.patternAlert),
                pp = dropper.find(opt.placePaste).empty();

        if (opt.alertText && $.dropper.drp.existsN(pp))
            pp.html(function () {
                try {
                    if ($.type(eval(opt.alertText)) === 'function')
                        return eval(opt.alertText).call($(this), opt, dropper, el);
                } catch (e) {
                    return opt.alertText;
                }
            });

        self._show.call(el, dropper, e, optC, hashChange);

        (function (dropper, _confirmF, opt) {
            dropper.find(opt.alertActionBtn).off('click.' + $.dropper.nS).on('click.' + $.dropper.nS, function (e) {
                e.stopPropagation();
                self.close.call(dropper, e, _confirmF);
                if (opt.ok)
                    eval(opt.ok).call(el, opt, dropper, e, 'alert');
                dropper.trigger('dropperOk', {
                    type: 'alert',
                    event: e,
                    anchor: el,
                    dropper: dropper,
                    options: opt,
                    methods: self
                });
            });
        })(dropper, _confirmF, opt);
    }
    else if (opt.confirm) {
        var optC = $.extend({}, opt),
                dropper = self._pasteDropper(optC, opt.patternConfirm),
                pp = dropper.find(opt.placePaste).empty();
        if (opt.confirmText && $.dropper.drp.existsN(pp))
            pp.html(function () {
                try {
                    if ($.type(eval(opt.confirmText)) === 'function')
                        return eval(opt.confirmText).call($(this), opt, dropper, el);
                } catch (e) {
                    return opt.confirmText;
                }
            });

        self._show.call(el, dropper, e, optC, hashChange);

        (function (dropper, _confirmF, opt) {
            dropper.find(opt.confirmActionBtn).off('click.' + $.dropper.nS).on('click.' + $.dropper.nS, function (e) {
                e.stopPropagation();
                self.close.call(dropper, e, _confirmF);
                if (opt.ok)
                    eval(opt.ok).call(el, opt, dropper, e, 'confirm');
                dropper.trigger('dropperOk', {
                    type: 'confirm',
                    event: e,
                    anchor: el,
                    dropper: dropper,
                    options: opt,
                    methods: self
                });
            });
        })(dropper, _confirmF, opt);
    }
    else if (opt.prompt) {
        var optP = $.extend({}, opt),
                dropper = self._pasteDropper(optP, opt.patternPrompt),
                pp = dropper.find(opt.placePaste).empty();

        if (opt.promptText && $.dropper.drp.existsN(pp))
            pp.html(function () {
                try {
                    if ($.type(eval(opt.promptText)) === 'function')
                        return eval(opt.promptText).call($(this), opt, dropper, el);
                } catch (e) {
                    return opt.promptText;
                }
            });

        self._show.call(el, dropper, e, optP, hashChange);

        (function (dropper, _confirmF, opt, optP) {
            dropper.find(opt.promptActionBtn).off('click.' + $.dropper.nS).on('click.' + $.dropper.nS, function (e) {
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
                self.close.call(dropper, e, _confirmF);
                if (opt.ok)
                    eval(opt.ok).call(el, opt, dropper, e, 'prompt', opt.dataPrompt);
                dropper.trigger('dropperOk', {
                    type: 'prompt',
                    dataPrompt: opt.dataPrompt,
                    event: e,
                    anchor: el,
                    dropper: dropper,
                    options: opt,
                    methods: self
                });
            });
        })(dropper, _confirmF, opt, optP);
    }
    el.data('dropperConfirmPromptAlert', dropper);
    return self;
});