(function ($, body) {
    var setFull = body.requestFullScreen || body.webkitRequestFullScreen || body.mozRequestFullScreen || body.msRequestFullscreen,
        clearFull = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || document.msCancelFullscreen;

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

    function _shortScreen(self) {
        var drop = this,
            drp = drop.data('drp');
        drp.isFullScreen = false;
        drop.css($.drop.drp.standartScreenStyle);
        changeScreen.call(document, clearFull);
        self._checkMethod(function () {
            self._heightContent(drop);
        });
        drp.limitSize = drp.oldLimitSize;
    }

    function _fullScreen(self) {
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

        drop.off('dropClose.fullScreen').on('dropClose.fullScreen', function () {
            changeScreen.call(document, clearFull);
        });
    }

    $(document).off('dropBefore.fullScreen').on('dropBefore.fullScreen', function (event, obj) {
        var opt = obj.options;
        if (opt.fullScreen) {
            var drop = obj.drop,
                header = drop.find(opt.placeHeader).first();

            (function (obj, drop) {
                $(window).off('keyup.fullScreen').on('keyup.fullScreen', function (e) {
                    if (e.keyCode === 122) {
                        if (drop.data('drp').isFullScreen)
                            _shortScreen.call(drop, obj.methods);
                        else
                            _fullScreen.call(drop, obj.methods);
                    }
                });
            })(obj, drop);

            if ($.drop.drp.existsN(header)) {
                header.off('click.' + $.drop.nS).on('click.' + $.drop.nS, function (e) {
                    $(document).on('mousedown.fullScreen', function (e) {
                        e.preventDefault();
                    });
                });
                (function (obj, drop) {
                    header.off('dblclick.' + $.drop.nS).on('dblclick.' + $.drop.nS, function (e) {
                        $(document).off('mousedown.fullScreen');
                        if (drop.data('drp').isFullScreen)
                            _shortScreen.call(drop, obj.methods);
                        else
                            _fullScreen.call(drop, obj.methods);
                    });
                })(obj, drop);
            }
        }
    });

})(jQuery, document.body);