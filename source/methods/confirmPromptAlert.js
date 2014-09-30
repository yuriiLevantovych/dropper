$.drop.setMethod('confirmPromptAlert', function(opt, hashChange, _confirmF, e, el) {
    var self = this,
            $ = jQuery;
    opt.tempClass = 'drop-' + (+new Date());
    if (opt.confirm) {
        var confirmBtn = opt.elrun = self._referCreate('.' + opt.tempClass).data('confirm', true),
                optC = $.extend({}, opt, confirmBtn.data()),
                drop = self._pasteDrop(optC, opt.patternConfirm);

        self._show.call(confirmBtn, drop, e, optC, hashChange);

        (function(drop, _confirmF, opt) {
            $(opt.confirmActionBtn).off('click.' + $.drop.nS).on('click.' + $.drop.nS, function(e) {
                e.stopPropagation();
                self.close.call(drop, e, _confirmF, null);
            });
        })(drop, _confirmF, opt);
        var pp = drop.find(opt.placePaste).empty();
        if (opt.confirmText && $.existsN(pp))
            pp.html(opt.confirmText);
    }
    else if (opt.alert) {
        var alertBtn = opt.elrun = self._referCreate('.' + opt.tempClass).data('alert', true),
                optC = $.extend({}, opt, alertBtn.data()),
                drop = self._pasteDrop(optC, opt.patternAlert);

        self._show.call(alertBtn, drop, e, optC, hashChange);

        (function(drop, _confirmF, opt) {
            $(opt.alertActionBtn).off('click.' + $.drop.nS).on('click.' + $.drop.nS, function(e) {
                e.stopPropagation();
                self.close.call(drop, e, _confirmF, null);
            });
        })(drop, _confirmF, opt);
        var pp = drop.find(opt.placePaste).empty();
        if (opt.alertText && $.existsN(pp))
            pp.html(opt.alertText);
    }
    else if (opt.prompt) {
        var promptBtn = opt.elrun = self._referCreate('.' + opt.tempClass).data({'prompt': true, 'promptInputValue': opt.promptInputValue}),
                optP = $.extend({}, opt, promptBtn.data()),
                drop = self._pasteDrop(optP, opt.patternPrompt);

        self._show.call(promptBtn, drop, e, optP, hashChange);

        (function(drop, _confirmF, opt) {
            $(opt.promptActionBtn).off('click.' + $.drop.nS).on('click.' + $.drop.nS, function(e) {
                e.stopPropagation();
                var getUrlVars = function(url) {
                    var hash, myJson = {}, hashes = url.slice(url.indexOf('?') + 1).split('&');
                    for (var i = 0; i < hashes.length; i++) {
                        hash = hashes[i].split('=');
                        myJson[hash[0]] = hash[1];
                    }
                    return myJson;
                };

                optP.dataPrompt = opt.dataPrompt = getUrlVars($(this).closest('form').serialize());
                self.close.call(drop, e, _confirmF, null);
            });
        })(drop, _confirmF, opt);
        var pp = drop.find(opt.placePaste).empty();
        if (opt.promptText && $.existsN(pp))
            pp.html(opt.promptText);
    }
    el.data('dropConfirmPromptAlert', drop);
    return this;
});