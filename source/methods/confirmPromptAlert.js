$.drop.setMethod('confirmPromptAlert', function(opt, hashChange, _confirmF, e, el) {
    var self = this,
            $ = jQuery;
    if (opt.confirm) {
        var optC = $.extend({}, opt),
                drop = self._pasteDrop(optC, opt.patternConfirm);
        self._show.call(el, drop, e, optC, hashChange);

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
        var optC = $.extend({}, opt),
                drop = self._pasteDrop(optC, opt.patternAlert);
        self._show.call(el, drop, e, optC, hashChange);

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
        var optP = $.extend({}, opt),
                drop = self._pasteDrop(optP, opt.patternPrompt);
        self._show.call(el, drop, e, optP, hashChange);

        (function(drop, _confirmF, opt, optP) {
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
        })(drop, _confirmF, opt, optP);
        var pp = drop.find(opt.placePaste).empty();
        if (opt.promptText && $.existsN(pp))
            pp.html(opt.promptText);
    }
    el.data('dropConfirmPromptAlert', drop);
    return this;
});