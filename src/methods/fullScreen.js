(function ($, body) {
    var setFull = body.requestFullScreen || body.webkitRequestFullScreen || body.mozRequestFullScreen || body.msRequestFullscreen,
        clearFull = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || document.msCancelFullscreen,
        nS = 'fullScreen';

function checkFullScreen(){	
return  ((document.fullscreenElement && document.fullscreenElement !== null) ||  document.mozFullScreen || document.webkitIsFullScreen) && window.innerHeight === screen.height;}
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
        var dropper = this,
            drp = dropper.data('drp');
        drp.isFullScreen = false;
        dropper.css($.dropper.drp.standartScreenStyle);
        if (!native)
            changeScreen.call(document, clearFull);
        self._checkMethod(function () {
            self._heightContent(dropper);
        });
        drp.limitSize = drp.oldLimitSize;
    }

    function _fullScreen(self, native) {
        var dropper = this,
            drp = dropper.data('drp');

        drp.isFullScreen = true;
        drp.oldLimitSize = drp.limitSize;
        drp.limitSize = true;

        $.dropper.drp.standartScreenStyle = {
            width: dropper.css('width'),
            height: dropper.css('height'),
            left: dropper.css('left'),
            top: dropper.css('top')
        }

        if (!native)
            changeScreen.call(body, setFull);
	
        (function () {
        				var dropper = this;
		        		
		        		if (!checkFullScreen()){
		        				var callee = arguments.callee;
		        				setTimeout(function(){
		        						callee.call(dropper);
		        		 		}, 10)
		        		 		return;
		        		}
		        		dropper.css({
                width: '100%',
                height: '100%',
                'box-sizing': 'border-box',
                left: 0,
                top: 0
            });

            self._checkMethod(function () {
                self._heightContent(dropper);
            });
        }).call(dropper);

        dropper.off('dropperClose.' + nS).on('dropperClose.' + nS, function () {
            changeScreen.call(document, clearFull);
        });
    }

    $(document).off('dropperBefore.' + nS).on('dropperBefore.' + nS, function (event, obj) {
        var opt = obj.options;
        if (opt.fullScreen) {
            var dropper = obj.dropper,
                header = dropper.find(opt.placeHeader).first();

            if ($.dropper.drp.existsN(header)) {
                header.off('click.' + $.dropper.nS).on('click.' + $.dropper.nS, function (e) {
                    $(document).on('mousedown.' + nS, function (e) {
                        e.preventDefault();
                    });
                });
                (function (obj, dropper) {
                    $(window).off('keyup.' + nS).on('keyup.' + nS, function (e) {
                        if (e.keyCode === 122) {
                            if (dropper.data('drp').isFullScreen)
                                _shortScreen.call(dropper, obj.methods);
                            else
                                _fullScreen.call(dropper, obj.methods);
                        }
                    });

                    header.off('click.' + nS).on('click.' + nS, function (e) {
                        $(document).off('mousedown.' + nS);
                        if (dropper.data('drp').isFullScreen)
                            _shortScreen.call(dropper, obj.methods);
                        else
                            _fullScreen.call(dropper, obj.methods);
                    });
                    if ($.dropper.drp.isTouch)
                        $(document).off('webkitfullscreenchange.' + nS + ' mozfullscreenchange.' + nS + ' fullscreenchange.' + nS + ' MSFullscreenChange.' + nS).on('webkitfullscreenchange.' + nS + ' mozfullscreenchange.' + nS + ' fullscreenchange.' + nS + ' MSFullscreenChange.' + nS, function () {
                            if (checkFullScreen())
                                _fullScreen.call(dropper, obj.methods, true);
                            else
                                _shortScreen.call(dropper, obj.methods, true);
                        });
                })(obj, dropper);
            }
        }
    });

})(jQuery, document.body);