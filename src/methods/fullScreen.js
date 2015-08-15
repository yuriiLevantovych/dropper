jQuery(function () {
    (function ($, body) {
        var setFull = function () {
                if (document.documentElement.requestFullScreen) {
                    document.documentElement.requestFullScreen();
                }
                else if (document.documentElement.webkitRequestFullScreen) {
                    document.documentElement.webkitRequestFullScreen();
                }
                else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                }
                else if (document.documentElement.msRequestFullscreen) {
                    document.documentElement.msRequestFullscreen();
                }
                else
                    return false;
            },
            clearFull = function () {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
                else
                    return false;
            },
            nS = 'fullScreen';

        function checkFullScreen() {
            return ((document.fullscreenElement && document.fullscreenElement !== null) || document.mozFullScreen || document.webkitIsFullScreen) && window.innerHeight === screen.height;
        }

        function changeScreen(method) {
            if (method() === false) {
                var wscript = new ActiveXObject("WScript.Shell");
                if (wscript !== null) {
                    wscript.SendKeys("{F11}");
                }
            }
        }

        function _shortScreen(self, native) {
            var dropper = this,
                drp = dropper.data('drp');
            dropper.css($.dropper.drp.standartScreenStyle).removeClass($.dropper.drp.pC + 'full-screen');
            if (!native)
                changeScreen.call(dropper, clearFull);
            self._checkMethod(function () {
                self._heightContent(dropper);
            });
            drp.limitSize = drp.oldLimitSize;
        }

        function _fullScreen(self, native) {
            var dropper = this,
                drp = dropper.data('drp');

            drp.oldLimitSize = drp.limitSize;
            drp.limitSize = true;

            $.dropper.drp.standartScreenStyle = {
                width: dropper.css('width'),
                height: dropper.css('height'),
                left: dropper.css('left'),
                top: dropper.css('top')
            }

            if (!native)
                changeScreen.call(dropper, setFull);

            if (!checkFullScreen()) {
                var args = arguments,
                    callee = args.callee;
                setTimeout(function () {
                    callee.apply(dropper, args);
                }, 10);
                return;
            }

            dropper.css({
                width: '100%',
                height: '100%',
                'box-sizing': 'border-box',
                left: 0,
                top: 0
            }).addClass($.dropper.drp.pC + 'full-screen');

            self._checkMethod(function () {
                self._heightContent(dropper);
            });

            dropper.off('dropperClose.' + nS).on('dropperClose.' + nS, function (e, obj) {
                if (!obj.options.opening)
                    changeScreen.call(dropper, clearFull);
            });
        }

        $(document).off('dropperBefore.' + nS).on('dropperBefore.' + nS, function (event, obj) {
            if (obj.options.fullScreen) {
                (function (obj) {
                    var dropper = obj.dropper;

                    function triggerFullScreen(native) {
                        if (checkFullScreen())
                            _shortScreen.call(dropper, obj.methods, native)
                        else
                            _fullScreen.call(dropper, obj.methods, native);
                    }

                    $(window).off('keyup.' + nS).on('keyup.' + nS, function (e) {
                        if (e.keyCode === 122) {
                            triggerFullScreen();
                        }
                    });

                    dropper.off('click.' + nS).on('click.' + nS, obj.options.fullScreenButton, function (e) {
                        e.preventDefault();
                        triggerFullScreen()
                    });
                    if ($.dropper.drp.isTouch)
                        $(document).off('webkitfullscreenchange.' + nS + ' mozfullscreenchange.' + nS + ' fullscreenchange.' + nS + ' MSFullscreenChange.' + nS).on('webkitfullscreenchange.' + nS + ' mozfullscreenchange.' + nS + ' fullscreenchange.' + nS + ' MSFullscreenChange.' + nS, function () {
                            triggerFullScreen(true);
                        });
                })(obj);
                if (checkFullScreen()) {
                    obj.dropper.addClass($.dropper.drp.pC + 'full-screen');
                }
            }
        });
    })(jQuery, document.body);
})
;