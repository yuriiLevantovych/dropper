(function ($, body, undefined) {
    var setFull = body.requestFullScreen || body.webkitRequestFullScreen || body.mozRequestFullScreen || body.msRequestFullscreen,
        clearFull = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || document.msCancelFullscreen,
        nS = 'fullScreen';

    function changeScreen(method) {
        if (method) {
            method.call(this);
        } else if (typeof window.ActiveXObject !== "undefined") {
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }
    }

    function _shortScreen(self, native) {
        var drop = this,
            drp = drop.data('drp');
        drp.isFullScreen = false;
        drop.css($.drop.drp.standartScreenStyle);
        if (!native)
            changeScreen.call(document, clearFull);
        self._checkMethod(function () {
            self._heightContent(drop);
        });
        drp.limitSize = drp.oldLimitSize;
    }

    function _fullScreen(self, native) {
        var drop = this,
            drp = drop.data('drp');

        drp.isFullScreen = true;
        drp.oldLimitSize = drp.limitSize;
        drp.limitSize = true;

        $.drop.drp.standartScreenStyle = {
            width: drop.css('width'),
            height: drop.css('height'),
            left: drop.css('left'),
            top: drop.css('top')
        }

        if (!native)
            changeScreen.call(body, setFull);

        setTimeout(function () {
            drop.css({
                width: '100%',
                height: '100%',
                'box-sizing': 'border-box',
                left: 0,
                top: 0
            });

            self._checkMethod(function () {
                self._heightContent(drop);
            });
        }, 100);

        drop.off('dropClose.' + nS).on('dropClose.' + nS, function () {
            changeScreen.call(document, clearFull);
        });
    }

    $(document).off('dropBefore.' + nS).on('dropBefore.' + nS, function (event, obj) {
        var opt = obj.options;
        if (opt.fullScreen) {
            var drop = obj.drop,
                header = drop.find(opt.placeHeader).first();

            if ($.drop.drp.existsN(header)) {
                header.off('click.' + $.drop.nS).on('click.' + $.drop.nS, function (e) {
                    $(document).on('mousedown.' + nS, function (e) {
                        e.preventDefault();
                    });
                });
                (function (obj, drop) {
                    $(window).off('keyup.' + nS).on('keyup.' + nS, function (e) {
                        if (e.keyCode === 122) {
                            if (drop.data('drp').isFullScreen)
                                _shortScreen.call(drop, obj.methods);
                            else
                                _fullScreen.call(drop, obj.methods);
                        }
                    });

                    header.off('click.' + nS).on('click.' + nS, function (e) {
                        $(document).off('mousedown.' + nS);
                        if (drop.data('drp').isFullScreen)
                            _shortScreen.call(drop, obj.methods);
                        else
                            _fullScreen.call(drop, obj.methods);
                    });
                    if ($.drop.drp.isTouch)
                        $(document).off('webkitfullscreenchange.' + nS + ' mozfullscreenchange.' + nS + ' fullscreenchange.' + nS + ' MSFullscreenChange.' + nS).on('webkitfullscreenchange.' + nS + ' mozfullscreenchange.' + nS + ' fullscreenchange.' + nS + ' MSFullscreenChange.' + nS, function () {
                            if ((document.fullscreenElement && document.fullscreenElement !== null) || // alternative standard methods
                                document.mozFullScreen || document.webkitIsFullScreen)
                                _fullScreen.call(drop, obj.methods, true);
                            else
                                _shortScreen.call(drop, obj.methods, true);
                        });
                })(obj, drop);
            }
        }
    });

})(jQuery, document.body);