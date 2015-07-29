/*! Copyright (c) 2013 Brandon Aaron (http://brandon.aaron.sh)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 3.1.12
 *
 * Requires: jQuery 1.2.2+
 */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a:a(jQuery)}(function(a){function b(b){var g=b||window.event,h=i.call(arguments,1),j=0,l=0,m=0,n=0,o=0,p=0;if(b=a.event.fix(g),b.type="mousewheel","detail"in g&&(m=-1*g.detail),"wheelDelta"in g&&(m=g.wheelDelta),"wheelDeltaY"in g&&(m=g.wheelDeltaY),"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX),"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*m,m=0),j=0===m?l:m,"deltaY"in g&&(m=-1*g.deltaY,j=m),"deltaX"in g&&(l=g.deltaX,0===m&&(j=-1*l)),0!==m||0!==l){if(1===g.deltaMode){var q=a.data(this,"mousewheel-line-height");j*=q,m*=q,l*=q}else if(2===g.deltaMode){var r=a.data(this,"mousewheel-page-height");j*=r,m*=r,l*=r}if(n=Math.max(Math.abs(m),Math.abs(l)),(!f||f>n)&&(f=n,d(g,n)&&(f/=40)),d(g,n)&&(j/=40,l/=40,m/=40),j=Math[j>=1?"floor":"ceil"](j/f),l=Math[l>=1?"floor":"ceil"](l/f),m=Math[m>=1?"floor":"ceil"](m/f),k.settings.normalizeOffset&&this.getBoundingClientRect){var s=this.getBoundingClientRect();o=b.clientX-s.left,p=b.clientY-s.top}return b.deltaX=l,b.deltaY=m,b.deltaFactor=f,b.offsetX=o,b.offsetY=p,b.deltaMode=0,h.unshift(b,j,l,m),e&&clearTimeout(e),e=setTimeout(c,200),(a.event.dispatch||a.event.handle).apply(this,h)}}function c(){f=null}function d(a,b){return k.settings.adjustOldDeltas&&"mousewheel"===a.type&&b%120===0}var e,f,g=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],h="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice;if(a.event.fixHooks)for(var j=g.length;j;)a.event.fixHooks[g[--j]]=a.event.mouseHooks;var k=a.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var c=h.length;c;)this.addEventListener(h[--c],b,!1);else this.onmousewheel=b;a.data(this,"mousewheel-line-height",k.getLineHeight(this)),a.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var c=h.length;c;)this.removeEventListener(h[--c],b,!1);else this.onmousewheel=null;a.removeData(this,"mousewheel-line-height"),a.removeData(this,"mousewheel-page-height")},getLineHeight:function(b){var c=a(b),d=c["offsetParent"in a.fn?"offsetParent":"parent"]();return d.length||(d=a("body")),parseInt(d.css("fontSize"),10)||parseInt(c.css("fontSize"),10)||16},getPageHeight:function(b){return a(b).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})});
/*!
 * jScrollPane - v2.0.21 - 2015-02-24
 * http://jscrollpane.kelvinluck.com/
 *
 * Copyright (c) 2014 Kelvin Luck
 * Dual licensed under the MIT or GPL licenses.
 */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a(require("jquery")):a(jQuery)}(function(a){a.fn.jScrollPane=function(b){function c(b,c){function d(c){var f,h,j,k,l,o,p=!1,q=!1;if(N=c,void 0===O)l=b.scrollTop(),o=b.scrollLeft(),b.css({overflow:"hidden",padding:0}),P=b.innerWidth()+rb,Q=b.innerHeight(),b.width(P),O=a('<div class="jspPane" />').css("padding",qb).append(b.children()),R=a('<div class="jspContainer" />').css({width:P+"px",height:Q+"px"}).append(O).appendTo(b);else{if(b.css("width",""),p=N.stickToBottom&&A(),q=N.stickToRight&&B(),k=b.innerWidth()+rb!=P||b.outerHeight()!=Q,k&&(P=b.innerWidth()+rb,Q=b.innerHeight(),R.css({width:P+"px",height:Q+"px"})),!k&&sb==S&&O.outerHeight()==T)return void b.width(P);sb=S,O.css("width",""),b.width(P),R.find(">.jspVerticalBar,>.jspHorizontalBar").remove().end()}O.css("overflow","auto"),S=c.contentWidth?c.contentWidth:O[0].scrollWidth,T=O[0].scrollHeight,O.css("overflow",""),U=S/P,V=T/Q,W=V>1,X=U>1,X||W?(b.addClass("jspScrollable"),f=N.maintainPosition&&($||bb),f&&(h=y(),j=z()),e(),g(),i(),f&&(w(q?S-P:h,!1),v(p?T-Q:j,!1)),F(),C(),L(),N.enableKeyboardNavigation&&H(),N.clickOnTrack&&m(),J(),N.hijackInternalLinks&&K()):(b.removeClass("jspScrollable"),O.css({top:0,left:0,width:R.width()-rb}),D(),G(),I(),n()),N.autoReinitialise&&!pb?pb=setInterval(function(){d(N)},N.autoReinitialiseDelay):!N.autoReinitialise&&pb&&clearInterval(pb),l&&b.scrollTop(0)&&v(l,!1),o&&b.scrollLeft(0)&&w(o,!1),b.trigger("jsp-initialised",[X||W])}function e(){W&&(R.append(a('<div class="jspVerticalBar" />').append(a('<div class="jspCap jspCapTop" />'),a('<div class="jspTrack" />').append(a('<div class="jspDrag" />').append(a('<div class="jspDragTop" />'),a('<div class="jspDragBottom" />'))),a('<div class="jspCap jspCapBottom" />'))),cb=R.find(">.jspVerticalBar"),db=cb.find(">.jspTrack"),Y=db.find(">.jspDrag"),N.showArrows&&(hb=a('<a class="jspArrow jspArrowUp" />').bind("mousedown.jsp",k(0,-1)).bind("click.jsp",E),ib=a('<a class="jspArrow jspArrowDown" />').bind("mousedown.jsp",k(0,1)).bind("click.jsp",E),N.arrowScrollOnHover&&(hb.bind("mouseover.jsp",k(0,-1,hb)),ib.bind("mouseover.jsp",k(0,1,ib))),j(db,N.verticalArrowPositions,hb,ib)),fb=Q,R.find(">.jspVerticalBar>.jspCap:visible,>.jspVerticalBar>.jspArrow").each(function(){fb-=a(this).outerHeight()}),Y.hover(function(){Y.addClass("jspHover")},function(){Y.removeClass("jspHover")}).bind("mousedown.jsp",function(b){a("html").bind("dragstart.jsp selectstart.jsp",E),Y.addClass("jspActive");var c=b.pageY-Y.position().top;return a("html").bind("mousemove.jsp",function(a){p(a.pageY-c,!1)}).bind("mouseup.jsp mouseleave.jsp",o),!1}),f())}function f(){db.height(fb+"px"),$=0,eb=N.verticalGutter+db.outerWidth(),O.width(P-eb-rb);try{0===cb.position().left&&O.css("margin-left",eb+"px")}catch(a){}}function g(){X&&(R.append(a('<div class="jspHorizontalBar" />').append(a('<div class="jspCap jspCapLeft" />'),a('<div class="jspTrack" />').append(a('<div class="jspDrag" />').append(a('<div class="jspDragLeft" />'),a('<div class="jspDragRight" />'))),a('<div class="jspCap jspCapRight" />'))),jb=R.find(">.jspHorizontalBar"),kb=jb.find(">.jspTrack"),_=kb.find(">.jspDrag"),N.showArrows&&(nb=a('<a class="jspArrow jspArrowLeft" />').bind("mousedown.jsp",k(-1,0)).bind("click.jsp",E),ob=a('<a class="jspArrow jspArrowRight" />').bind("mousedown.jsp",k(1,0)).bind("click.jsp",E),N.arrowScrollOnHover&&(nb.bind("mouseover.jsp",k(-1,0,nb)),ob.bind("mouseover.jsp",k(1,0,ob))),j(kb,N.horizontalArrowPositions,nb,ob)),_.hover(function(){_.addClass("jspHover")},function(){_.removeClass("jspHover")}).bind("mousedown.jsp",function(b){a("html").bind("dragstart.jsp selectstart.jsp",E),_.addClass("jspActive");var c=b.pageX-_.position().left;return a("html").bind("mousemove.jsp",function(a){r(a.pageX-c,!1)}).bind("mouseup.jsp mouseleave.jsp",o),!1}),lb=R.innerWidth(),h())}function h(){R.find(">.jspHorizontalBar>.jspCap:visible,>.jspHorizontalBar>.jspArrow").each(function(){lb-=a(this).outerWidth()}),kb.width(lb+"px"),bb=0}function i(){if(X&&W){var b=kb.outerHeight(),c=db.outerWidth();fb-=b,a(jb).find(">.jspCap:visible,>.jspArrow").each(function(){lb+=a(this).outerWidth()}),lb-=c,Q-=c,P-=b,kb.parent().append(a('<div class="jspCorner" />').css("width",b+"px")),f(),h()}X&&O.width(R.outerWidth()-rb+"px"),T=O.outerHeight(),V=T/Q,X&&(mb=Math.ceil(1/U*lb),mb>N.horizontalDragMaxWidth?mb=N.horizontalDragMaxWidth:mb<N.horizontalDragMinWidth&&(mb=N.horizontalDragMinWidth),_.width(mb+"px"),ab=lb-mb,s(bb)),W&&(gb=Math.ceil(1/V*fb),gb>N.verticalDragMaxHeight?gb=N.verticalDragMaxHeight:gb<N.verticalDragMinHeight&&(gb=N.verticalDragMinHeight),Y.height(gb+"px"),Z=fb-gb,q($))}function j(a,b,c,d){var e,f="before",g="after";"os"==b&&(b=/Mac/.test(navigator.platform)?"after":"split"),b==f?g=b:b==g&&(f=b,e=c,c=d,d=e),a[f](c)[g](d)}function k(a,b,c){return function(){return l(a,b,this,c),this.blur(),!1}}function l(b,c,d,e){d=a(d).addClass("jspActive");var f,g,h=!0,i=function(){0!==b&&tb.scrollByX(b*N.arrowButtonSpeed),0!==c&&tb.scrollByY(c*N.arrowButtonSpeed),g=setTimeout(i,h?N.initialDelay:N.arrowRepeatFreq),h=!1};i(),f=e?"mouseout.jsp":"mouseup.jsp",e=e||a("html"),e.bind(f,function(){d.removeClass("jspActive"),g&&clearTimeout(g),g=null,e.unbind(f)})}function m(){n(),W&&db.bind("mousedown.jsp",function(b){if(void 0===b.originalTarget||b.originalTarget==b.currentTarget){var c,d=a(this),e=d.offset(),f=b.pageY-e.top-$,g=!0,h=function(){var a=d.offset(),e=b.pageY-a.top-gb/2,j=Q*N.scrollPagePercent,k=Z*j/(T-Q);if(0>f)$-k>e?tb.scrollByY(-j):p(e);else{if(!(f>0))return void i();e>$+k?tb.scrollByY(j):p(e)}c=setTimeout(h,g?N.initialDelay:N.trackClickRepeatFreq),g=!1},i=function(){c&&clearTimeout(c),c=null,a(document).unbind("mouseup.jsp",i)};return h(),a(document).bind("mouseup.jsp",i),!1}}),X&&kb.bind("mousedown.jsp",function(b){if(void 0===b.originalTarget||b.originalTarget==b.currentTarget){var c,d=a(this),e=d.offset(),f=b.pageX-e.left-bb,g=!0,h=function(){var a=d.offset(),e=b.pageX-a.left-mb/2,j=P*N.scrollPagePercent,k=ab*j/(S-P);if(0>f)bb-k>e?tb.scrollByX(-j):r(e);else{if(!(f>0))return void i();e>bb+k?tb.scrollByX(j):r(e)}c=setTimeout(h,g?N.initialDelay:N.trackClickRepeatFreq),g=!1},i=function(){c&&clearTimeout(c),c=null,a(document).unbind("mouseup.jsp",i)};return h(),a(document).bind("mouseup.jsp",i),!1}})}function n(){kb&&kb.unbind("mousedown.jsp"),db&&db.unbind("mousedown.jsp")}function o(){a("html").unbind("dragstart.jsp selectstart.jsp mousemove.jsp mouseup.jsp mouseleave.jsp"),Y&&Y.removeClass("jspActive"),_&&_.removeClass("jspActive")}function p(a,b){W&&(0>a?a=0:a>Z&&(a=Z),void 0===b&&(b=N.animateScroll),b?tb.animate(Y,"top",a,q):(Y.css("top",a),q(a)))}function q(a){void 0===a&&(a=Y.position().top),R.scrollTop(0),$=a||0;var c=0===$,d=$==Z,e=a/Z,f=-e*(T-Q);(ub!=c||wb!=d)&&(ub=c,wb=d,b.trigger("jsp-arrow-change",[ub,wb,vb,xb])),t(c,d),O.css("top",f),b.trigger("jsp-scroll-y",[-f,c,d]).trigger("scroll")}function r(a,b){X&&(0>a?a=0:a>ab&&(a=ab),void 0===b&&(b=N.animateScroll),b?tb.animate(_,"left",a,s):(_.css("left",a),s(a)))}function s(a){void 0===a&&(a=_.position().left),R.scrollTop(0),bb=a||0;var c=0===bb,d=bb==ab,e=a/ab,f=-e*(S-P);(vb!=c||xb!=d)&&(vb=c,xb=d,b.trigger("jsp-arrow-change",[ub,wb,vb,xb])),u(c,d),O.css("left",f),b.trigger("jsp-scroll-x",[-f,c,d]).trigger("scroll")}function t(a,b){N.showArrows&&(hb[a?"addClass":"removeClass"]("jspDisabled"),ib[b?"addClass":"removeClass"]("jspDisabled"))}function u(a,b){N.showArrows&&(nb[a?"addClass":"removeClass"]("jspDisabled"),ob[b?"addClass":"removeClass"]("jspDisabled"))}function v(a,b){var c=a/(T-Q);p(c*Z,b)}function w(a,b){var c=a/(S-P);r(c*ab,b)}function x(b,c,d){var e,f,g,h,i,j,k,l,m,n=0,o=0;try{e=a(b)}catch(p){return}for(f=e.outerHeight(),g=e.outerWidth(),R.scrollTop(0),R.scrollLeft(0);!e.is(".jspPane");)if(n+=e.position().top,o+=e.position().left,e=e.offsetParent(),/^body|html$/i.test(e[0].nodeName))return;h=z(),j=h+Q,h>n||c?l=n-N.horizontalGutter:n+f>j&&(l=n-Q+f+N.horizontalGutter),isNaN(l)||v(l,d),i=y(),k=i+P,i>o||c?m=o-N.horizontalGutter:o+g>k&&(m=o-P+g+N.horizontalGutter),isNaN(m)||w(m,d)}function y(){return-O.position().left}function z(){return-O.position().top}function A(){var a=T-Q;return a>20&&a-z()<10}function B(){var a=S-P;return a>20&&a-y()<10}function C(){R.unbind(zb).bind(zb,function(a,b,c,d){bb||(bb=0),$||($=0);var e=bb,f=$,g=a.deltaFactor||N.mouseWheelSpeed;return tb.scrollBy(c*g,-d*g,!1),e==bb&&f==$})}function D(){R.unbind(zb)}function E(){return!1}function F(){O.find(":input,a").unbind("focus.jsp").bind("focus.jsp",function(a){x(a.target,!1)})}function G(){O.find(":input,a").unbind("focus.jsp")}function H(){function c(){var a=bb,b=$;switch(d){case 40:tb.scrollByY(N.keyboardSpeed,!1);break;case 38:tb.scrollByY(-N.keyboardSpeed,!1);break;case 34:case 32:tb.scrollByY(Q*N.scrollPagePercent,!1);break;case 33:tb.scrollByY(-Q*N.scrollPagePercent,!1);break;case 39:tb.scrollByX(N.keyboardSpeed,!1);break;case 37:tb.scrollByX(-N.keyboardSpeed,!1)}return e=a!=bb||b!=$}var d,e,f=[];X&&f.push(jb[0]),W&&f.push(cb[0]),O.focus(function(){b.focus()}),b.attr("tabindex",0).unbind("keydown.jsp keypress.jsp").bind("keydown.jsp",function(b){if(b.target===this||f.length&&a(b.target).closest(f).length){var g=bb,h=$;switch(b.keyCode){case 40:case 38:case 34:case 32:case 33:case 39:case 37:d=b.keyCode,c();break;case 35:v(T-Q),d=null;break;case 36:v(0),d=null}return e=b.keyCode==d&&g!=bb||h!=$,!e}}).bind("keypress.jsp",function(a){return a.keyCode==d&&c(),!e}),N.hideFocus?(b.css("outline","none"),"hideFocus"in R[0]&&b.attr("hideFocus",!0)):(b.css("outline",""),"hideFocus"in R[0]&&b.attr("hideFocus",!1))}function I(){b.attr("tabindex","-1").removeAttr("tabindex").unbind("keydown.jsp keypress.jsp")}function J(){if(location.hash&&location.hash.length>1){var b,c,d=escape(location.hash.substr(1));try{b=a("#"+d+', a[name="'+d+'"]')}catch(e){return}b.length&&O.find(d)&&(0===R.scrollTop()?c=setInterval(function(){R.scrollTop()>0&&(x(b,!0),a(document).scrollTop(R.position().top),clearInterval(c))},50):(x(b,!0),a(document).scrollTop(R.position().top)))}}function K(){a(document.body).data("jspHijack")||(a(document.body).data("jspHijack",!0),a(document.body).delegate("a[href*=#]","click",function(b){var c,d,e,f,g,h,i=this.href.substr(0,this.href.indexOf("#")),j=location.href;if(-1!==location.href.indexOf("#")&&(j=location.href.substr(0,location.href.indexOf("#"))),i===j){c=escape(this.href.substr(this.href.indexOf("#")+1));try{d=a("#"+c+', a[name="'+c+'"]')}catch(k){return}d.length&&(e=d.closest(".jspScrollable"),f=e.data("jsp"),f.scrollToElement(d,!0),e[0].scrollIntoView&&(g=a(window).scrollTop(),h=d.offset().top,(g>h||h>g+a(window).height())&&e[0].scrollIntoView()),b.preventDefault())}}))}function L(){var a,b,c,d,e,f=!1;R.unbind("touchstart.jsp touchmove.jsp touchend.jsp click.jsp-touchclick").bind("touchstart.jsp",function(g){var h=g.originalEvent.touches[0];a=y(),b=z(),c=h.pageX,d=h.pageY,e=!1,f=!0}).bind("touchmove.jsp",function(g){if(f){var h=g.originalEvent.touches[0],i=bb,j=$;return tb.scrollTo(a+c-h.pageX,b+d-h.pageY),e=e||Math.abs(c-h.pageX)>5||Math.abs(d-h.pageY)>5,i==bb&&j==$}}).bind("touchend.jsp",function(){f=!1}).bind("click.jsp-touchclick",function(){return e?(e=!1,!1):void 0})}function M(){var a=z(),c=y();b.removeClass("jspScrollable").unbind(".jsp"),b.replaceWith(yb.append(O.children())),yb.scrollTop(a),yb.scrollLeft(c),pb&&clearInterval(pb)}var N,O,P,Q,R,S,T,U,V,W,X,Y,Z,$,_,ab,bb,cb,db,eb,fb,gb,hb,ib,jb,kb,lb,mb,nb,ob,pb,qb,rb,sb,tb=this,ub=!0,vb=!0,wb=!1,xb=!1,yb=b.clone(!1,!1).empty(),zb=a.fn.mwheelIntent?"mwheelIntent.jsp":"mousewheel.jsp";"border-box"===b.css("box-sizing")?(qb=0,rb=0):(qb=b.css("paddingTop")+" "+b.css("paddingRight")+" "+b.css("paddingBottom")+" "+b.css("paddingLeft"),rb=(parseInt(b.css("paddingLeft"),10)||0)+(parseInt(b.css("paddingRight"),10)||0)),a.extend(tb,{reinitialise:function(b){b=a.extend({},N,b),d(b)},scrollToElement:function(a,b,c){x(a,b,c)},scrollTo:function(a,b,c){w(a,c),v(b,c)},scrollToX:function(a,b){w(a,b)},scrollToY:function(a,b){v(a,b)},scrollToPercentX:function(a,b){w(a*(S-P),b)},scrollToPercentY:function(a,b){v(a*(T-Q),b)},scrollBy:function(a,b,c){tb.scrollByX(a,c),tb.scrollByY(b,c)},scrollByX:function(a,b){var c=y()+Math[0>a?"floor":"ceil"](a),d=c/(S-P);r(d*ab,b)},scrollByY:function(a,b){var c=z()+Math[0>a?"floor":"ceil"](a),d=c/(T-Q);p(d*Z,b)},positionDragX:function(a,b){r(a,b)},positionDragY:function(a,b){p(a,b)},animate:function(a,b,c,d){var e={};e[b]=c,a.animate(e,{duration:N.animateDuration,easing:N.animateEase,queue:!1,step:d})},getContentPositionX:function(){return y()},getContentPositionY:function(){return z()},getContentWidth:function(){return S},getContentHeight:function(){return T},getPercentScrolledX:function(){return y()/(S-P)},getPercentScrolledY:function(){return z()/(T-Q)},getIsScrollableH:function(){return X},getIsScrollableV:function(){return W},getContentPane:function(){return O},scrollToBottom:function(a){p(Z,a)},hijackInternalLinks:a.noop,destroy:function(){M()}}),d(c)}return b=a.extend({},a.fn.jScrollPane.defaults,b),a.each(["arrowButtonSpeed","trackClickSpeed","keyboardSpeed"],function(){b[this]=b[this]||b.speed}),this.each(function(){var d=a(this),e=d.data("jsp");e?e.reinitialise(b):(a("script",d).filter('[type="text/javascript"],:not([type])').remove(),e=new c(d,b),d.data("jsp",e))})},a.fn.jScrollPane.defaults={showArrows:!1,maintainPosition:!0,stickToBottom:!1,stickToRight:!1,clickOnTrack:!0,autoReinitialise:!1,autoReinitialiseDelay:500,verticalDragMinHeight:0,verticalDragMaxHeight:99999,horizontalDragMinWidth:0,horizontalDragMaxWidth:99999,contentWidth:void 0,animateScroll:!1,animateDuration:300,animateEase:"linear",hijackInternalLinks:!1,verticalGutter:4,horizontalGutter:4,mouseWheelSpeed:3,arrowButtonSpeed:0,arrowRepeatFreq:50,arrowScrollOnHover:!1,trackClickSpeed:0,trackClickRepeatFreq:70,verticalArrowPositions:"split",horizontalArrowPositions:"split",enableKeyboardNavigation:!0,hideFocus:!1,keyboardSpeed:0,initialDelay:300,speed:30,scrollPagePercent:.8}});
(function ($, wnd, doc, undefined) {
    var methods = {
        init: function (options) {
            var set = $.extend({}, DP, options);
            if (!D.existsN(this))
                throw "The object isn't exists";
            return this.each(function () {
                var el = methods.destroy.call($(this)),
                    opt = $.extend({}, set, el.data());
                el.data('drp', opt);
                var href = $.trim(el.attr('href') || opt.href);
                opt.href = href && href.indexOf('#') === 0 ? null : href;
                opt.hash = /#.+?$/.test(href) ? href.match(/(#.+?$)/g)[0] : opt.hash;
                opt.rel = $.trim(this.rel || opt.rel);
                methods._setGallery(opt);
                el.addClass(D.isD);
                if (opt.context) {
                    el.on('contextmenu.' + $.dropper.nS + ' ' + 'click.' + $.dropper.nS, function (e) {
                        e.preventDefault();
                    });
                    el.on('mouseup.' + $.dropper.nS, function (e) {
                        e.preventDefault();
                        if (e.button === 2)
                            methods.open.call($(this), null, e);
                    });
                }
                else {
                    if (opt.triggerOn || opt.triggerOff)
                        el.on(opt.triggerOn + '.' + $.dropper.nS + ' ' + opt.triggerOff + '.' + $.dropper.nS, function (e) {
                            e.stopPropagation();
                            e.preventDefault();
                        }).on(opt.triggerOn + '.' + $.dropper.nS, function (e) {
                            methods.open.call($(this), null, e);
                        }).on(opt.triggerOff + '.' + $.dropper.nS, function (e) {
                            methods.close.call($($(this).attr('data-dropper')), e);
                        });
                    else
                        el.on(opt.trigger + '.' + $.dropper.nS, function (e) {
                            methods.open.call($(this), null, e);
                            e.stopPropagation();
                            e.preventDefault();
                        });
                }
                if (/#.+/.test(opt.hash) && !D.hashs[opt.hash])
                    D.hashs[opt.hash] = el;
            }).each(function () {
                D.busy = false;
                if (window.location.hash.indexOf($(this).data('drp').hash) !== -1)
                    methods.open.call($(this), $.extend({isStart: true}, set, $(this).data('drp')), 'startHash');
            });
        },
        destroy: function (el) {
            return (el || this).each(function () {
                var el = $(this),
                    opt = $(el).data('drp');
                el.removeClass(D.isD).removeData('drp');
                if (!opt)
                    return;
                if (opt.trigger)
                    el.off(opt.trigger + '.' + $.dropper.nS);
                if (opt.triggerOn)
                    el.off(opt.triggerOn + '.' + $.dropper.nS);
                if (opt.triggerOff)
                    el.off(opt.triggerOff + '.' + $.dropper.nS);
                el.off('contextmenu.' + $.dropper.nS).off('mouseup.' + $.dropper.nS).off('click.' + $.dropper.nS);
            });
        },
        _get: function (opt, e, hashChange) {
            var hrefC = opt.href.replace(D.reg, '');
            if (!opt.isStart) //if few popup need show on start
                $.dropper.cancel();
            var el = this,
                elSet = el.data();
            var _update = function (data) {
                data = data ? data : 'response is empty';
                if (opt.droppern)
                    var dropper = methods._pasteDropper(opt, data);
                else
                    dropper = methods._pasteDropper(opt, opt.pattern);
                if (!opt.droppern)
                    dropper.find($(opt.placePaste)).html(data);
                dropper.addClass(D.pC + opt.type);
                if (!opt.always)
                    D.droppers[hrefC] = dropper.clone();
                methods._show.call(el, dropper, e, opt, hashChange);
                return dropper;
            };
            var _getImage = function () {
                opt.type = elSet.type = 'image';
                var img = D.imgPreload = new Image();
                img.onload = function () {
                    $.dropper.hideLoading();
                    this.onload = this.onerror = null;
                    _update($(this));
                };
                img.onerror = function () {
                    this.onload = this.onerror = null;
                    $.dropper.hideLoading();
                    D.busy = false;
                    methods.open.call(null, {
                        notify: true,
                        datas: {answer: 'error', data: 'image is not found'}
                    }, 'errorImage');
                };
                img.src = opt.href + (opt.always ? '?' + (+new Date()) : '');
            };
            var _getAjax = function () {
                opt.type = elSet.type = 'ajax';
                D.curAjax = $.ajax($.extend({
                    url: opt.href,
                    dataType: opt.ajax.dataType ? opt.ajax.dataType : (opt.notify ? 'json' : 'html'),
                    success: function (data) {
                        $.dropper.hideLoading();
                        if (opt.notify)
                            methods._pasteNotify.call(el, data, opt, hashChange, e);
                        else
                            _update(data);
                    },
                    error: function () {
                        $.dropper.hideLoading();
                        D.busy = false;
                        methods.open.call(null, {
                            notify: true,
                            datas: {answer: 'error', data: methods._errorM(arguments[2])}
                        }, 'errorAjax');
                    }
                }, opt.ajax));
            };
            var _getIframe = function () {
                opt.type = elSet.type = 'iframe';
                var iframe = $('<iframe name="dropper-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen' + (navigator.userAgent.match(/msie/i) ? ' allowtransparency="true"' : '') + '></iframe>');
                iframe.one('load.' + $.dropper.nS, function () {
                    $.dropper.hideLoading();
                });
                _update(iframe);
            };
            $.dropper.showLoading();
            if (opt.type === 'auto') {
                if (opt.href.match(D.regImg))
                    _getImage();
                else
                    _getAjax();
            }
            else
                switch (opt.type) {
                    case 'image':
                        _getImage();
                        break;
                    case 'iframe':
                        _getIframe();
                        break;
                    default:
                        _getAjax();
                }
            return el;
        },
        open: function (opt, e, hashChange) {
            if (D.busy)
                return false;
            D.busy = true;
            var $this = D.existsN(this) ? this : $([]),
                elSet = D.existsN($this) ? $this.data() : {};
            opt = $.extend({}, DP, elSet && elSet.drp ? elSet.drp : {}, opt);
            e = e ? e : window.event;
            if (elSet.dropperConfirmPromptAlert)
                methods.close.call(elSet.dropperConfirmPromptAlert, 'element already open', null, null, true);
            var dropper = $(elSet.dropper);
            if (opt.closeActiveClick && D.existsN(dropper) && $this.hasClass(D.activeClass)) {
                methods.close.call(dropper, 'element already open');
                return $this;
            }

            if (elSet.dropper || opt.dropper && D.existsN(opt.dropper) && opt.dropper.hasClass(D.activeClass))
                methods.close.call(dropper, 'element already open', null, null, true);
            if (elSet.tempClass && !elSet.droppern)
                elSet.dropper = opt.dropper = null;
            opt.tempClass = elSet.tempClass = 'dropper-' + (+new Date());
            opt.tempClassS = '.' + opt.tempClass;
            if (elSet || D.existsN(opt.dropper))
                elSet.droppern = opt.dropper;
            $.extend(opt, elSet);
            var href = $this.attr('href') || opt.href;
            opt.href = href && $.trim(href).indexOf('#') === 0 ? null : href;
            var hrefC = opt.href ? opt.href.replace(D.reg, '') : null,
                rel = $this.attr('rel') || opt.rel;
            opt.hash = /#.+?$/.test(href) ? href.match(/(#.+?$)/g)[0] : opt.hash;
            if (rel && D.gallery[rel])
                opt.rel = rel;
            if (opt.rel && D.galleryOpt[opt.rel])
                $.extend(opt, D.galleryOpt[opt.rel]['genOpt'], D.galleryOpt[opt.rel][hrefC]);
            methods._setGallery(opt);
            if (opt.href && opt.always)
                opt.dropper = elSet.droppern ? elSet.droppern : null;
            opt.dropper = opt.dropper && $.type(opt.dropper) === 'string' ? opt.dropper : opt.tempClassS;
            if (!D.existsN($this) /*bug of remove bellow "opt.elrun.remove"*/ || elSet.dropperId !== undefined && !D.exists('[data-dropper-id="' + elSet.dropperId + '"]'))
                $this = $('<a data-dropper-id="' + D.cOD + '" style="display: none !important;" data-dropper="' + opt.dropper + '" class="' + D.tempClass + '" href="' + (opt.href ? opt.href : '#') + '" rel="' + (opt.rel ? opt.rel : null) + '"></a>').appendTo($('body'));
            if (opt.context) {
                $.extend(opt, {place: 'global', limitSize: true, overlay: false});
                if (e && e.pageX >= 0)
                    opt.placement = {'left': parseInt(e.pageX), 'top': parseInt(e.pageY)};
                else
                    opt.placement = {'left': $this.offset().left, 'top': $this.offset().top};
            }
            opt.elrun = $this;
            if (opt.filter) {
                if ($this.hasClass('dropper-filter')) {
                    opt.tempClassS = elSet.droppern = opt.dropper;
                    opt.tempClass = null;
                }
                else {
                    methods._filterSource.call($this, opt.filter).addClass(opt.tempClass);
                    elSet.droppern = opt.dropper = opt.tempClassS;
                    $this.addClass('dropper-filter');
                }
            }
            $this.attr('data-dropper', opt.dropper).data('dropper', opt.dropper);
            dropper = $(elSet.droppern);
            var _confirmF = function () {
                opt.style = methods._styleCreate(opt);
                if (opt.notify && opt.datas)
                    methods._pasteNotify.call($this, opt.datas, opt, hashChange, e);
                else if (opt.filter)
                    methods._show.call($this, methods._pasteDropper(opt, dropper.addClass(D.wasCreateClass)), e, opt, hashChange);
                else if (opt.html) {
                    dropper = methods._pasteDropper(opt, opt.pattern);
                    dropper.find($(opt.placePaste)).html(opt.html);
                    methods._show.call($this, dropper, e, opt, hashChange);
                }
                else if (opt.href && (!D.droppers[hrefC] || opt.always))
                    methods._get.call($this, opt, e, hashChange);
                else if (D.existsN(dropper) || opt.href && D.droppers[hrefC])
                    methods._show.call($this, methods._pasteDropper(opt, D.existsN(dropper) ? dropper.addClass(D.wasCreateClass) : D.droppers[hrefC].clone()), e, opt, hashChange);
                else if (opt.header || opt.content || opt.footer)
                    methods._show.call($this, methods._pasteDropper(opt, opt.pattern), e, opt, hashChange);
                else
                    throw 'Insufficient data';
            };

            function _show() {
                if ($this.is(':disabled') || opt.dropper && opt.start && !eval(opt.start).call($this, opt, dropper, e))
                    return;
                if (opt.prompt || opt.confirm || opt.alert) {
                    elSet.droppern = elSet.dropper;
                    opt.dropper = opt.tempClassS;
                    opt.style = methods._styleCreate(opt);
                    methods._checkMethod(function () {
                        methods.confirmPromptAlert(opt, hashChange, _confirmF, e, $this);
                    });
                }
                else
                    _confirmF();
            }

            if (!opt.moreOne && D.exists(D.aDS))
                methods.close.call($(D.aDS), 'close more one element', _show);
            else
                _show();
            return this;
        },
        _show: function (dropper, e, opt, hashChange) {
            if (!opt.moreOne && D.exists(D.aDS))
                methods.close.call($(D.aDS), 'close more one element', $.proxy(_show, this));
            else
                _show.call(this);
            function _show() {
                if (!D.existsN(dropper))
                    return false;
                e = e ? e : window.event;
                var $this = this;
                if (opt.overlay) {
                    if (!D.exists('[data-rel="' + opt.tempClassS + '"].dropper-overlay'))
                        $('body').append($('<div/>', {
                            'class': 'dropper-overlay',
                            'data-rel': opt.tempClassS
                        }));
                    opt.dropperOver = $('[data-rel="' + opt.tempClassS + '"].dropper-overlay').css({
                        'background-color': opt.overlayColor,
                        'opacity': opt.overlayOpacity,
                        'z-index': 1103 + D.cOD
                    });
                }
                dropper.data('drp', opt).attr('data-rel', opt.rel).css('z-index', 1104 + D.cOD).attr('data-elrun', opt.dropper).addClass(D.pC + opt.place).addClass(opt.addClass);
                if (opt.context)
                    dropper.addClass(D.pC + 'context');
                if (opt.notify)
                    dropper.addClass(D.pC + 'notify');
                if (opt.rel)
                    methods._checkMethod(function () {
                        methods.gallery(dropper, opt);
                    });
                methods._setHeightAddons(opt.dropperOver);
                methods._pasteContent($this, dropper, opt);
                methods._positionType(dropper);
                var ev = opt.dropper ? opt.dropper.replace(D.reg, '') : '';
                if (opt.hash && !hashChange) {
                    D.scrollTop = wnd.scrollTop();
                    var wLH = window.location.hash;
                    wnd.off('hashchange.' + $.dropper.nS);
                    if (opt.hash.indexOf('#') !== -1 && (new RegExp(opt.hash + '#|' + opt.hash + '$').exec(wLH) === null))
                        window.location.hash = wLH + opt.hash;
                    wnd.scrollTop(D.scrollTop);
                    setTimeout(methods._setEventHash, 0);
                }
                wnd.off('resize.' + $.dropper.nS + ev).on('resize.' + $.dropper.nS + ev, function () {
                    methods.update.call(dropper);
                }).off('scroll.' + $.dropper.nS + ev).on('scroll.' + $.dropper.nS + ev, function () {
                    if (opt.place === 'center' && opt.centerOnScroll)
                        methods['_' + opt.place].call(dropper);
                });
                $(opt.dropperOver).fadeIn(100).off('click.' + $.dropper.nS + ev).on('click.' + $.dropper.nS + ev, function (e) {
                    e.stopPropagation();
                    if (opt.closeClick && $(e.target).is('.dropper-overlay'))
                        methods.close.call($($(e.target).attr('data-rel')), e);
                });
                if (opt.alert || opt.confirm || opt.prompt) {
                    var elFocus;
                    if (opt.alert)
                        elFocus = opt.alertActionBtn;
                    else if (opt.confirm)
                        elFocus = opt.confirmActionBtn;
                    else if (opt.prompt)
                        elFocus = opt.promptInput;
                    elFocus = dropper.find(elFocus);
                    if (opt.prompt) {
                        elFocus.val(opt.promptInputValue);
                        dropper.find('form').off('submit.' + $.dropper.nS + ev).on('submit.' + $.dropper.nS + ev, function (e) {
                            e.preventDefault();
                        });
                    }
                    var focusFunc = function () {
                        elFocus.focus();
                    };
                    setTimeout(focusFunc, 0);
                }
                opt.exit = $.type(opt.exit) === 'string' ? dropper.find(opt.exit) : opt.exit;
                if (D.existsN(opt.exit)) {
                    opt.exit.off('click.' + $.dropper.nS).on('click.' + $.dropper.nS, function (e) {
                        e.stopPropagation();
                        methods.close.call($(this).closest('[data-elrun]'), e);
                    });
                }
                if (opt.context)
                    dropper.add(opt.dropperOver).off('contextmenu.' + $.dropper.nS).on('contextmenu.' + $.dropper.nS, function (e) {
                        e.preventDefault();
                    });

                var dropperWH = opt.type === 'iframe' ? dropper.find('iframe') : dropper;
                if (opt.width)
                    dropperWH.css('width', opt.width);
                if (opt.height)
                    dropperWH.css('height', opt.height);
                $('html, body').css({'height': '100%'});
                if (opt.limitSize)
                    methods._checkMethod(function () {
                        methods.limitSize(dropper);
                    });
                if (opt.placeBeforeShow)
                    methods._checkMethod(function () {
                        methods.placeBeforeShow(dropper, $this, opt);
                    });
                if (opt.place !== 'inherit')
                    methods['_' + opt.place].call(dropper);
                if (opt.before)
                    eval(opt.before).call($this, opt, dropper, e);
                dropper.trigger('dropperBefore', {
                    event: e,
                    anchor: $this,
                    dropper: dropper,
                    options: opt,
                    methods: methods
                });
                methods._disableScroll(opt);
                $('.dropper-overlay.' + D.pC + 'for-remove').stop().remove();
                dropper[opt.effectOn](opt.durationOn, function () {
                    D.cOD++;
                    D.busy = false;
                    var dropper = $(this);
                    if (opt.type === 'iframe')
                        dropperWH.attr('src', opt.href);
                    $('html, body').css({'overflow': '', 'overflow-x': ''});
                    methods._setHeightAddons(opt.dropperOver);
                    var inDropper = opt.type === 'iframe' ? dropper.find('iframe').contents().find(D.selAutoInit) : dropper.find(D.selAutoInit);
                    if (D.existsN(inDropper))
                        methods.init.call(inDropper);
                    dropper.add($this).addClass(D.activeClass);
                    D.activeDropper.unshift(opt.dropper);
                    var _decoratorClose = function (e, cond) {
                        if (opt.place === 'inherit' && !opt.inheritClose)
                            return;
                        if (cond)
                            methods.close.call(opt.closeAll && D.activeDropper.length ? null : $(D.activeDropper[0]), e);
                    };
                    D.activeDropperCEsc[opt.dropper] = function (e) {
                        _decoratorClose(e, opt.closeEsc && e.keyCode === 27);
                    };
                    D.activeDropperCClick[opt.dropper] = function (e) {
                        _decoratorClose(e, !D.existsN($(e.target).closest('[data-elrun]')));
                    };
                    if (opt.notify && !isNaN(opt.notifyclosetime))
                        D.notifyTimeout[opt.dropper] = setTimeout(function () {
                            methods.close.call(dropper, 'close notify setTimeout');
                        }, opt.notifyclosetime);
                    if (opt.droppable && opt.place !== 'inherit')
                        methods.droppable(dropper);
                    if (opt.after)
                        eval(opt.after).call($this, opt, dropper, e);
                    dropper.trigger('dropperAfter', {
                        event: e,
                        anchor: $this,
                        dropper: dropper,
                        options: opt,
                        methods: methods
                    });
                });
            }

            return this;
        },
        close: function (e, f, hashChange, force) {
            var sel = this,
                droppers = D.existsN(sel) ? sel : $('[data-elrun].' + D.activeClass);
            var closeLength = droppers.length;
            droppers.each(function (i) {
                var dropper = $(this),
                    opt = $.extend({}, dropper.data('drp'));
                if (!dropper.data('drp') || hashChange && opt.hash && window.location.hash.indexOf(opt.hash) !== -1)
                    return;
                var _hide = function () {
                    if (opt.notify && D.notifyTimeout[opt.dropper]) {
                        clearTimeout(D.notifyTimeout[opt.dropper]);
                        delete D.notifyTimeout[opt.dropper];
                    }
                    D.enableScroll();
                    if (opt.type === 'iframe')
                        dropper.find('iframe').removeAttr('src');
                    var ev = opt.dropper ? opt.dropper.replace(D.reg, '') : '';
                    wnd.off('resize.' + $.dropper.nS + ev).off('scroll.' + $.dropper.nS + ev);
                    D.activeDropper.splice($.inArray(opt.dropper, D.activeDropper), 1);
                    delete D.activeDropperCEsc[opt.dropper];
                    delete D.activeDropperCClick[opt.dropper];
                    if (D.activeDropper[0] && $(D.activeDropper[0]).data('drp'))
                        methods._disableScroll($(D.activeDropper[0]).data('drp'));
                    dropper.add(opt.elrun).removeClass(opt.addClass).removeClass(D.activeClass);
                    if (opt.hash && !hashChange) {
                        D.scrollTop = wnd.scrollTop();
                        wnd.off('hashchange.' + $.dropper.nS);
                        window.location.hash = window.location.hash.replace(new RegExp(opt.hash + '($|\b)', 'ig'), '').replace(new RegExp(opt.hash + '#', 'ig'), '#');
                        wnd.scrollTop(D.scrollTop);
                        setTimeout(methods._setEventHash, 0);
                    }
                    if (opt.placeAfterClose)
                        methods._checkMethod(function () {
                            methods.placeAfterClose(dropper, opt.elrun, opt);
                        });
                    dropper[opt.effectOff](force ? 0 : opt.durationOff, function () {
                        D.busy = false;
                        opt.style.remove();
                        $('html, body').css({'overflow': '', 'overflow-x': ''});
                        var $this = $(this);
                        methods._resetStyleDropper.call($(this));
                        $this.removeClass(D.pC + opt.place).removeClass(D.pC + opt.type).removeClass(D.pC + 'context').removeClass(D.pC + 'notify');
                        if (opt.closed)
                            eval(opt.closed).call(opt.elrun, opt, $this, e);
                        $this.trigger('dropperClosed', {
                            event: e,
                            anchor: opt.elrun,
                            dropper: $this,
                            options: opt,
                            methods: methods
                        });
                        var dC = $this.find($(opt.placeContent)).data('jsp');
                        if (dC)
                            dC.destroy();
                        if (!D.exists(D.aDS))
                            $('html, body').css({'height': ''});
                        if (!opt.filter)
                            $this.removeClass(opt.tempClass);
                        if (!opt.elrun.data('droppern'))
                            opt.elrun.data('dropper', null);
                        if (opt.elrun.hasClass(D.tempClass))
                            opt.elrun.remove();
                        $this.data('drp', null);
                        if (!$this.hasClass(D.wasCreateClass))
                            $this.remove();
                        var condCallback = i === closeLength - 1 && $.isFunction(f);
                        if (opt.dropperOver) {
                            opt.dropperOver.addClass(D.pC + 'for-remove').fadeOut(force ? 0 : opt.durationOff, function () {
                                $(this).remove();
                            });
                            if (condCallback)
                                setTimeout(f, force ? 0 : opt.durationOff + 100);
                        }
                        else if (condCallback)
                            f();
                    });
                };
                dropper.trigger('dropperClose', {
                    event: e,
                    anchor: opt.elrun,
                    dropper: dropper,
                    options: opt,
                    methods: methods
                });
                if (opt.close) {
                    var res = eval(opt.close).call(opt.elrun, opt, dropper, e);
                    if (res === false && res !== true)
                        throw res;
                    else
                        _hide();
                }
                else
                    _hide();
            });
            return sel;
        },
        update: function () {
            var dropper = this,
                drp = dropper.data('drp');
            if (!drp)
                return false;
            if (drp.isFullScreen)
                return false;
            if (drp.limitSize)
                methods._checkMethod(function () {
                    methods.limitSize(dropper);
                });
            if (drp.place !== 'inherit')
                methods._checkMethod(function () {
                    methods['_' + drp.place].call(dropper);
                }, drp.place);
            methods._setHeightAddons(drp.dropperOver);
        },
        _center: function () {
            return this.each(function () {
                var dropper = $(this),
                    drp = dropper.data('drp');
                if (!drp)
                    return false;
                var method = drp.animate || drp.placeBeforeShow ? 'animate' : 'css',
                    dropperV = dropper.is(':visible'),
                    w = dropperV ? dropper.outerWidth() : dropper[D.actual]('outerWidth'),
                    h = dropperV ? dropper.outerHeight() : dropper[D.actual]('outerHeight'),
                    wndT = wnd.scrollTop(),
                    wndL = wnd.scrollLeft(),
                    top = Math.floor((wnd.height() - h) / 2),
                    left = Math.floor((wnd.width() - w) / 2);
                top = top > 0 ? top + wndT : wndT;
                left = left > 0 ? left + wndL : wndL;

                dropper[method]({
                    'top': top,
                    'left': left
                }, {
                    duration: drp.durationOn,
                    queue: false
                });
            });
        },
        _global: function () {
            return this.each(function () {
                var dropper = $(this),
                    drp = dropper.data('drp');
                if (!drp && drp.droppableIn)
                    return false;
                var method = drp.animate || drp.placeBeforeShow ? 'animate' : 'css',
                    $this = drp.elrun,
                    t = 0,
                    l = 0,
                    $thisW = $this.width(),
                    $thisH = $this.height(),
                    dropperW = +dropper[D.actual]('outerWidth'),
                    dropperH = +dropper[D.actual]('outerHeight'),
                    wndT = wnd.scrollTop(),
                    wndL = wnd.scrollLeft(),
                    offTop = $this.offset().top,
                    offLeft = $this.offset().left,
                    $thisT = 0,
                    $thisL = 0;
                if (!dropper.is(':visible'))
                    dropper.css({top: 'auto', bottom: 'auto', left: 'auto', right: 'auto'});
                if ($.type(drp.placement) === 'object') {
                    var temp = drp.placement;
                    if (!drp.context) {
                        if (temp.top !== undefined)
                            temp.top = temp.top + wndT;
                        if (temp.left !== undefined)
                            temp.left = temp.left + wndL;
                        if (temp.bottom !== undefined)
                            temp.bottom = temp.bottom - wndT;
                        if (temp.right !== undefined)
                            temp.right = temp.right - wndL;
                    }
                    dropper[method](temp, {
                        duration: drp.durationOn,
                        queue: false
                    });
                }
                else {
                    var pmt = drp.placement.toLowerCase().split(' ');
                    if (pmt[1] === 'top')
                        t = -dropperH;
                    if (pmt[1] === 'bottom')
                        t = $thisH;
                    if (pmt[0] === 'left')
                        l = 0;
                    if (pmt[0] === 'right')
                        l = -dropperW + $thisW;
                    if (pmt[0] === 'center')
                        l = -dropperW / 2 + $thisW / 2;
                    if (pmt[1] === 'center')
                        t = -dropperH / 2 + $thisH / 2;
                    $thisT = offTop + t;
                    $thisL = offLeft + l;
                    if ($thisL < 0)
                        $thisL = 0;
                    dropper[method]({
                        'top': $thisT,
                        'left': $thisL
                    }, {
                        duration: drp.durationOn,
                        queue: false
                    });
                }
            });
        },
        _resetStyleDropper: function () {
            return this.stop().css({
                'z-index': '',
                'top': '', 'left': '',
                'bottom': '',
                'right': '',
                'position': '',
                'box-sizing': ''
            });
        },
        _pasteNotify: function (datas, opt, hashChange, e) {
            if (!$.isFunction(opt.handlerNotify))
                return false;
            var dropper = methods._pasteDropper(opt, opt.pattern);
            opt.handlerNotify.call($(this), datas, opt);
            return methods._show.call($(this), dropper, e, opt, hashChange);
        },
        _pasteDropper: function (opt, dropper) {
            dropper = $(dropper);
            if (opt.droppern)
                dropper = D.existsN(dropper.filter(opt.dropper)) ? dropper.filter(opt.dropper) : (D.existsN(dropper.find(opt.dropper)) ? dropper.find(opt.dropper) : dropper);
            if (opt.place !== 'inherit')
                dropper.appendTo($('body'));
            else if (opt.placeInherit)
                $(opt.placeInherit)[opt.methodPlaceInherit](dropper);
            return dropper.hide().addClass(opt.tempClass).addClass('dropper').attr('data-elrun', opt.dropper);
        },
        _pasteContent: function ($this, dropper, opt) {
            var _checkCont = function (place) {
                if (place.is(':empty'))
                    place.removeClass(D.noEmptyClass).addClass(D.emptyClass);
                else
                    place.addClass(D.noEmptyClass).removeClass(D.emptyClass);
            };
            var _pasteContent = function (content, place) {
                place = dropper.find(place).first();
                if (!D.existsN(place))
                    return false;
                _checkCont(place);
                if (!content)
                    return false;
                _checkCont(place.empty().html(function () {
                    try {
                        if ($.type(eval(content)) === 'function')
                            return eval(content).call(place, opt, dropper, $this);
                        return content;
                    } catch (e) {
                        return content;
                    }
                }));
            };
            _pasteContent(opt.header, opt.placeHeader);
            _pasteContent(opt.content, opt.placePaste);
            _pasteContent(opt.footer, opt.placeFooter);
            return this;
        },
        _setHeightAddons: function (dropperOver) {
            $(dropperOver).css({width: '', height: ''}).css({width: wnd.width(), height: doc.height()});
        },
        _checkMethod: function (f) {
            try {
                f();
            } catch (e) {
                var method = f.toString().match(/\.\S*\(/);
                throw  'Need connected "' + method[0].substring(1, method[0].length - 1) + '" method';
            }
            return this;
        },
        _positionType: function (dropper) {
            if (dropper.data('drp') && dropper.data('drp').place !== 'inherit')
                dropper.css({
                    'position': dropper.data('drp').position
                });
            return this;
        },
        _filterSource: function (s) {
            var btn = this,
                href = s.split(').'),
                regS, regM = '';
            $.map(href, function (v) {
                regS = (v[v.length - 1] !== ')' ? v + ')' : v).match(/\(.*\)/);
                regM = regS['input'].replace(regS[0], '');
                regS = regS[0].substring(1, regS[0].length - 1);
                btn = btn[regM](regS);
            });
            return btn;
        },
        _setEventHash: function () {
            D.wLH = window.location.hash;
            wnd.off('hashchange.' + $.dropper.nS).on('hashchange.' + $.dropper.nS, function (e) {
                e.preventDefault();
                if (D.scrollTop)
                    $('html, body').scrollTop(D.scrollTop);
                D.wLHN = window.location.hash;
                for (var i in D.hashs) {
                    if (D.wLH.indexOf(i) === -1 && D.wLHN.indexOf(i) !== -1)
                        methods.open.call(D.hashs[i], null, e, true);
                    else
                        methods.close.call($(D.hashs[i].data('dropper')).add(D.hashs[i].data('dropperConfirmPromptAlert')), e, null, true);
                }
                D.wLH = D.wLHN;
            });
        },
        _styleCreate: function (opt) {
            $('[data-rel="' + opt.tempClassS + '"]').remove();
            if (!D.theme[opt.theme])
                throw "Theme" + " '" + opt.theme + "' " + "isn't available";
            var text = D.theme[opt.theme],
                coms = D.theme[opt.theme].match(/.*,([^{]*)/gm);
            if (coms)
                $.map(coms, function (n) {
                    n = n.split('{')[0];
                    text = text.replace(n, n.replace(/,(?!\s*\[dropper\])/g, ', ' + opt.tempClassS + ' '));
                });
            return $('<style>', {
                'data-rel': opt.tempClassS,
                html: text
                    .replace(/\s\s+/g, ' ')
                    .replace(/\}[^$\*](?!\s*(\[dropper\]|\{\s*\/\*))/g, '} ' + opt.tempClassS + ' ')/*paste before begin row*/
                    .replace(/\{\s*\/\*(.*?)\*\/\s*\}/g, '$1')
                    .replace(/^(?!\s*\[dropper\])/, opt.tempClassS + ' ')/*for first row*/
                    .replace(/\[dropper\]/g, opt.tempClassS)
                    .replace(/url\((.*)\)/g, 'url(' + D.url + 'images/' + opt.theme + '/$1)')
            }).appendTo($('body'));
        },
        _disableScroll: function (opt) {
            D.enableScroll();
            if (opt.place === 'center' && !opt.scroll)
                D.disableScroll();
        },
        _setGallery: function (opt) {
            if (opt.rel && opt.href) {
                if (!D.gallery[opt.rel])
                    D.gallery[opt.rel] = [];
                if ($.inArray(opt.href, D.gallery[opt.rel]) === -1)
                    D.gallery[opt.rel].push(opt.href);
                if (!D.galleryHashs[opt.rel] && opt.hash)
                    D.galleryHashs[opt.rel] = [];
                if (opt.hash)
                    D.galleryHashs[opt.rel].push(opt.hash);
            }
            return this;
        },
        _errorM: function (mes) {
            return $.type(mes) === 'string' ? mes : mes.message;
        }
    };
    $.fn.dropper = function (method) {
        if (methods[method]) {
            if (!/_/.test(method))
                return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            else
                throw 'Method ' + method + ' is private on $.dropper';
        }
        else if ($.type(method) === 'object' || !method)
            return methods.init.apply(this, arguments);
        else
            throw "Method " + method + " doesn't exist on $.dropper";
    };
    $.dropper = function (m, opt) {
        if (!opt)
            opt = {};
        var set;
        if (D.existsN(m))
            set = {'dropper': m};
        else if ($.type(m) === 'array' || $.type(m) === 'string' && m.match(D.regImg)) {
            if ($.type(m) === 'array') {
                if (m.length > 1) {
                    opt.rel = opt.rel ? opt.rel : 'rel' + (+new Date());
                    if (!D.galleryOpt[opt.rel])
                        D.galleryOpt[opt.rel] = {};
                    D.galleryOpt[opt.rel]['genOpt'] = $.extend({}, opt);
                    if (!D.gallery[opt.rel])
                        D.gallery[opt.rel] = [];
                    m.map(function (n) {
                        if ($.type(n) === 'string' && $.inArray(n, D.gallery[opt.rel]) === -1)
                            D.gallery[opt.rel].push(n);
                        else if ($.type(n) === 'object' && n.href && $.inArray(n.href, D.gallery[opt.rel]) === -1) {
                            D.galleryOpt[opt.rel][n.href.replace(D.reg, '')] = n;
                            D.gallery[opt.rel].push(n.href);
                        }
                        else
                            return;
                    });
                    if (D.gallery[opt.rel][0])
                        set = {href: D.gallery[opt.rel][0]};
                    else
                        throw 'Insufficient data';
                }
                else if ($.type(m[0]) === 'object')
                    set = m[0];
                else if ($.type(m[0]) === 'string')
                    if (m[0].match(D.regImg))
                        set = {href: m[0]};
                    else
                        set = {html: m[0]};
            }
            else if ($.type(m) === 'string' && m.match(D.regImg))
                set = {href: m};
        }
        else if ($.type(m) === 'string')
            set = {'html': m};
        else if ($.type(m) === 'object')
            set = m;
        else
            throw 'Insufficient data';
        return methods.open.call(null, $.extend(opt, set), 'API');
    };
    $.dropper.nS = 'dropper';
    $.dropper.version = '1.0';
    $.dropper.dP = {
        dropper: null,
        html: null,
        addClas: null,
        href: null,
        hash: null,
        placeContent: '.dropper-content',
        placeHeader: '.dropper-header',
        placeFooter: '.dropper-footer',
        placePaste: '.placePaste',
        header: null,
        footer: null,
        content: null,
        placeInherit: null,
        methodPlaceInherit: 'html',
        filter: null,
        message: {
            success: function (text) {
                return '<div class= "dropper-msg"><div class="dropper-success"><span class="dropper-icon-notify"></span><div class="dropper-text-el">' + text + '</div></div></div>';
            },
            warning: function (text) {
                return '<div class= "dropper-msg"><div class="dropper-warning"><span class="dropper-icon-notify"></span><div class="dropper-text-el">' + text + '</div></div></div>';
            },
            error: function (text) {
                return '<div class="dropper-msg"><div class="dropper-error"><span class="dropper-icon-notify"></span><div class="dropper-text-el">' + text + '</div></div></div>';
            },
            info: function (text) {
                return '<div class="dropper-msg"><div class="dropper-info"><span class="dropper-icon-notify"></span><div class="dropper-text-el">' + text + '</div></div></div>';
            }
        },
        trigger: 'click',
        triggerOn: null,
        triggerOff: null,
        effectOn: 'fadeIn',
        effectOff: 'fadeOut',
        place: 'center',
        placement: 'left bottom',
        overlay: true,
        overlayColor: '#000',
        overlayOpacity: .6,
        position: 'absolute',
        placeBeforeShow: null,
        placeAfterClose: null,
        start: null,
        before: null,
        after: null,
        close: null,
        closed: null,
        ok: null,
        pattern: '<div class="dropper dropper-simple"><button type="button" class="dropper-close" data-closed><span class="dropper-icon-close">&#215;</span></button><button class="dropper-prev" type="button" style="display: none;"><i class="dropper-icon-prev">&#60;</i></button><button class="dropper-next" type="button" style="display: none;"><i class="dropper-icon-next">&#62;</i></button><div class="dropper-header"></div><div class="dropper-content"><div class="inside-padd placePaste"></div></div><div class="dropper-footer"></div></div>',
        patternConfirm: '<div class="dropper dropper-confirm"><button type="button" class="dropper-close" data-closed><span class="dropper-icon-close">&#215;</span></button><button class="dropper-prev" type="button" style="display: none;"><i class="dropper-icon-prev">&#60;</i></button><button class="dropper-next" type="button" style="display: none;"><i class="dropper-icon-next">&#62;</i></button><div class="dropper-header">Confirm</div><div class="dropper-content"><div class="inside-padd"><div class="placePaste"></div><div class="dropper-group-btns"><button type="button" class="dropper-button-confirm" data-button-confirm>ok</button><button type="button" class="dropper-btn-cancel" data-closed>cancel</button></div></div></div><div class="dropper-footer"></div></div>',
        patternPrompt: '<div class="dropper dropper-prompt"><button type="button" class="dropper-close" data-closed><span class="dropper-icon-close">&#215;</span></button><button class="dropper-prev" type="button" style="display: none;"><i class="dropper-icon-prev">&#60;</i></button><button class="dropper-next" type="button" style="display: none;"><i class="dropper-icon-next">&#62;</i></button><div class="dropper-header">Prompt</div><div class="dropper-content"><form class="inside-padd"><div class="placePaste"></div><input type="text" name="promptInput"/><div class="dropper-group-btns"><button data-button-prompt type="submit" class="dropper-button-prompt">ok</button><button type="button" data-closed class="dropper-btn-cancel">cancel</button></div></form></div><div class="dropper-footer"></div></div>',
        patternAlert: '<div class="dropper dropper-alert"><button type="button" class="dropper-close" data-closed><span class="dropper-icon-close">&#215;</span></button><button class="dropper-prev" type="button" style="display: none;"><i class="dropper-icon-prev">&#60;</i></button><button class="dropper-next" type="button" style="display: none;"><i class="dropper-icon-next">&#62;</i></button><div class="dropper-header">Alert</div><div class="dropper-content"><div class="inside-padd"><div class="placePaste"></div><div class="dropper-group-btns"><button type="button" class="dropper-button-alert" data-button-alert>ok</button></div></div></div><div class="dropper-footer"></div></div>',
        confirmActionBtn: '[data-button-confirm]',
        promptActionBtn: '[data-button-prompt]',
        alertActionBtn: '[data-button-alert]',
        dataPrompt: null,
        promptInput: '[name="promptInput"]',
        promptInputValue: null,
        exit: '[data-closed]',
        next: '.dropper-next',
        prev: '.dropper-prev',
        autoPlay: false,
        autoPlaySpeed: 2000,
        ajax: {
            type: 'post'
        },
        jScrollPane: {
            animateScroll: true,
            showArrows: true
        },
        durationOn: 300,
        durationOff: 200,
        notifyclosetime: 3000,
        notify: false,
        datas: null,
        handlerNotify: function (data, opt) {
            if (data && $.type(data) === 'string')
                data = eval("(" + data + ")");
            if (!data)
                var text = 'Object notify is empty';
            else if (!data.answer || !data.data)
                text = 'Answer is empty';
            else if (!opt.message || !opt.message[data.answer])
                text = data.data;
            else
                text = opt.message[data.answer](data.data);
            $(opt.dropper).find(opt.placePaste).empty().append(text);
            return this;
        },
        confirm: false,
        confirmText: null,
        prompt: false,
        promptText: null,
        alert: false,
        alertText: null,
        always: false,
        animate: false,
        moreOne: false,
        closeAll: false,
        closeClick: true,
        closeEsc: true,
        closeActiveClick: false,
        cycle: true,
        scroll: false,
        limitSize: false,
        scrollContent: true,
        centerOnScroll: false,
        droppable: false,
        droppableLimit: false,
        droppableFixed: false,
        inheritClose: false,
        keyNavigate: true,
        context: false,
        theme: 'default',
        type: 'auto',
        width: null,
        height: null,
        rel: null,
        fullScreen: true
    };
    $.dropper.drp = {
        handlerMessageWindow: function (e) {
            if ($.type(e.originalEvent.data) === 'object')
                return $.dropper(e.originalEvent.data);
        },
        theme: {
            default: '*{margin: 0;padding: 0;-webkit-box-sizing: content-box;-moz-box-sizing: content-box;box-sizing: content-box;}\n\
                    .dropper-header{background-color: #f8f8f8;padding: 0 55px 0 12px;font-size: 14px;}\n\
                    input, select, textarea{margin-bottom: 6px;}\n\
                    input, select, textarea, .dropper-content button{outline: none;font-family: Arial, "Helvetica CY", "Nimbus Sans L", sans-serif;line-height: 1.5;border: 1px solid #d8d8d8;padding: 4px 6px;}\n\
                    button{background-color: #fafafa;color: #666;cursor: pointer;}\n\
                    .dropper-header.dropper-no-empty, .dropper-footer.dropper-no-empty{padding-top: 6px;padding-bottom: 7px;}\n\
                    .dropper-header.dropper-no-empty{border-bottom: 1px solid #d8d8d8;}\n\
                    [dropper].dropper-is-scroll .dropper-header.dropper-empty{height: 28px;}\n\
                    .dropper-footer.dropper-no-empty{border-top: 1px solid #d8d8d8;}\n\
                    .dropper-content{position: relative;z-index: 1;}\n\
                    .dropper-content .inside-padd{padding: 12px 28px 12px 12px;}\n\
                    [dropper].dropper-image .dropper-content .inside-padd, [dropper].dropper-alert .dropper-content .inside-padd{padding: 10px;}\n\
                    [dropper].dropper-alert .dropper-group-btns{text-align: center;}\n\
                    .dropper-content button{margin-right: 4px;}\n\
                    button:focus, input:focus, select:focus, textarea:focus{outline: #b3b3b3 solid 1px;}\n\
                    .dropper-footer{background-color: #d5d5d5;padding: 0 12px;}\n\
                    .dropper-close, .dropper-prev, .dropper-next{outline: none;background: none;border: 0;cursor: pointer;vertical-align: middle;position: absolute;font-size: 0;padding: 0;line-height: 0;}\n\
                    .dropper-prev, .dropper-next{width: 35%;height: 100%;top: 0;z-index: 2;}\n\
                    .dropper-prev:focus, .dropper-next:focus{outline: none;}\n\
                    .dropper-icon-prev, .dropper-icon-next{width: 20px;height: 80px;line-height: 80px;}\n\
                    .dropper-icon-prev, .dropper-icon-next, .dropper-icon-close{font-family: "Trebuchet MS", "Helvetica CY", sans-serif;font-size: 21px;color: #999;background-color: #fff;display: inline-block;text-align: center;//display: inline;zoom: 1;}\n\
                    .dropper-icon-close{line-height: 19px;width: 19px;height: 19px;}\n\
                    .dropper-close{right: 5px;top: 4px;z-index: 3;}\n\
                    .dropper-next{right: 5px;text-align: right;}\n\
                    .dropper-prev{left: 5px;text-align: left;}\n\
                    [dropper].dropper-is-scroll .dropper-next{right: 16px;}\n\
                    .dropper-icon-next{text-align: center;}\n\
                    .icon-times-dropper{position: absolute;z-index:1;right:0;top: 0;cursor: pointer;width: 15px;height: 15px;}\n\
                    .nav{list-style: none;margin-left: 0;}\n\
                    .nav-vertical > li{display: block;border-top: 1px solid #ebebeb;padding: 8px 35px 8px 15px;}\n\
                    .nav-vertical > li > a{text-decoration: none;}\n\
                    .nav-vertical > li:first-child{border-top: 0;}\n\
                    .dropper-msg > div{border-width: 1px;border-style: solid;padding: 10px;}\n\
                    .dropper-success{background-color: #dff0d8;border-color: #d6e9c6;color: #3c763d;}\n\
                    .dropper-warning{background-color: #fcf8e3;border-color: #faebcc;color: #8a6d3b;}\n\
                    .dropper-error{background-color: #f2dede;border-color: #ebccd1;color: #a94442;}\n\
                    .dropper-info{background-color: #d9edf7;border-color: #bce8f1;color: #31708f;}\n\
                    [dropper].dropper-context .dropper-content .inside-padd{padding: 0;}\n\
                    [dropper]{max-width: 100%;font-family: Arial, "Helvetica CY", "Nimbus Sans L" sans-serif;font-size: 13px;color: #333;border: 1px solid #e4e4e4;background-color: #fff;}\n\
                    [dropper] .placePaste img{max-width: 100%;}\n\
                    [dropper].dropper-is-scroll .placePaste img{max-width: none; max-height: none;width: auto;height: auto;}\n\
                    .jspContainer{overflow: hidden;position: relative;}\n\
                    .jspPane{position: absolute;}\n\
                    .jspVerticalBar{position: absolute;top: 0;right: 0;width: 16px;height: 100%;background: red;}\n\
                    .jspHorizontalBar{position: absolute;bottom: 0;left: 0;width: 100%;height: 16px;background: red;}\n\
                    .jspCap{display: none;}\n\
                    .jspHorizontalBar .jspCap{float: left;}\n\
                    .jspTrack{background: #f9f8f7;position: relative;}\n\
                    .jspDrag{background: #d5d5d5;position: relative;top: 0;left: 0;cursor: pointer;}\n\
                    .jspHorizontalBar .jspTrack,.jspHorizontalBar .jspDrag{float: left;height: 100%;}\n\
                    .jspArrow{background: #ccc;position: relative;display: block;cursor: pointer;padding: 0;margin: 0;line-height: 0;}\n\
                    .jspArrow.jspDisabled{cursor: default;background: #eee;}\n\
                    .jspVerticalBar .jspArrow{height: 16px;}\n\
                    .jspHorizontalBar .jspArrow{width: 16px;float: left;height: 100%;}\n\
                    .jspVerticalBar .jspArrow:focus{outline: none;}\n\
                    .jspCorner{background: #eeeef4;float: left;height: 100%;}\n\
                    .jspArrowUp:before, .jspArrowDown:before, .jspArrowLeft:before, .jspArrowRight:before{position: absolute;font-size: 10px;color: #777;width: 100%;height: 100%;text-align: center;line-height: 16px;}\n\
                    .jspArrowUp:before{content: "\\25b2";}\n\
                    .jspArrowDown:before{content: "\\25bc";}\n\
                    .jspArrowLeft:before{content: "\\25c4";}\n\
                    {/*#dropper-loading div{background-image: url(loader.gif);}*/}\n\
                    .jspArrowRight:before{content: "\\25ba";}'
        },
        regImg: /(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i,
        mainStyle: '#dropper-loading {position: fixed;top: 50%;left: 50%;width: 40px;height: 40px;margin-top: -20px;margin-left: -20px;cursor: pointer;overflow: hidden;z-index: 11104;display: none;}\n\
                    #dropper-loading div{position: absolute;top: 0;left: 0;width: 480px;height: 40px;}\n\
                    .dropper{display: none;}.dropper-overlay{display:none;position:absolute;width:100%;left:0;top:0;}',
        reg: /[^a-zA-Z0-9]+/ig,
        autoPlayInterval: {},
        hashs: {},
        droppers: {},
        gallery: {},
        galleryOpt: {},
        galleryHashs: {},
        notifyTimeout: {},
        activeDropperCEsc: {},
        activeDropperCClick: {},
        isD: 'isDropper',
        pC: 'dropper-',
        activeClass: 'dropper-active',
        aDS: '[data-elrun].dropper-center:visible, [data-elrun].dropper-global:visible',
        selAutoInit: '[data-dropper], [data-html]',
        tempClass: 'dropper-temp',
        wasCreateClass: 'dropper-was-create',
        emptyClass: 'dropper-empty',
        noEmptyClass: 'dropper-no-empty',
        activeDropper: [],
        cOD: 0,
        disableScroll: function () {
            if (D.isTouch)
                return false;
            var self = this;
            self.enableScroll();
            wnd.add(doc).on('mousewheel.scr' + $.dropper.nS, function (e) {
                if (!($(e.target).is('[data-elrun]') || D.existsN($(e.target).closest('[data-elrun]'))))
                    e.preventDefault();
            });
            D.scrollTop = wnd.scrollTop();
            D.scrollLeft = wnd.scrollLeft();
            wnd.on('scroll.scr' + $.dropper.nS, function () {
                $('html, body').scrollTop(D.scrollTop).scrollLeft(D.scrollLeft);
            });
            return self;
        },
        enableScroll: function () {
            if (D.isTouch)
                return false;
            wnd.off('scroll.scr' + $.dropper.nS).add(doc).off('mousewheel.scr' + $.dropper.nS);
            return this;
        },
        isTouch: document.createTouch !== undefined,
        existsN: function (nabir) {
            return nabir && nabir.length > 0 && nabir instanceof $;
        },
        exists: function (selector) {
            return $(selector).length > 0 && $(selector) instanceof $;
        },
        url: $("[src$='dropper.js'], [src$='dropper.min.js']").attr('src') + '/../',
        requireLength: 0,
        requireCur: 0
    };
    var D = $.dropper.drp,
        DP = $.dropper.dP;
    $.fn[D.actual = $.fn.actual ? 'actual' + (+new Date()) : 'actual'] = function () {
        if (arguments.length && $.type(arguments[0]) === 'string') {
            var dim = arguments[0],
                clone = this.clone();
            if (arguments[1] === undefined)
                clone.css({
                    position: 'absolute',
                    top: '-9999px',
                    left: '-9999px'
                }).show().appendTo($('body'));
            var dimS = clone[dim]();
            clone.remove();
            return dimS;
        }
        return undefined;
    };
    $.dropper.setParameters = function (options) {
        $.extend(DP, options);
        return this;
    };
    $.dropper.setThemes = function () {
        for (var i = 0; i < arguments.length; i++) {
            var obj = {};
            if (arguments[i].file !== undefined) {
                (function (o, obj) {
                    $.ajax({
                        url: D.url + 'styles/' + o.file + '.css',
                        dataType: 'text',
                        cache: true,
                        success: function (data) {
                            obj[o.name] = data;
                            $.extend(D.theme, obj);
                            if (o.callback)
                                o.callback.call($.dropper, o.name);
                        },
                        error: function () {
                            throw methods._errorM(arguments[2]);
                        }
                    });
                })(arguments[i], obj);
            }
            else if (arguments[i].text) {
                obj[arguments[i].name] = arguments[i].text;
                $.extend(D.theme, obj);
            }
            else
                throw methods._errorM('Data not enough');
        }
        return this;
    };
    $.dropper.setMethod = function (n, v) {
        var nm = {};
        nm[n] = v;
        $.extend(methods, nm);
        return this;
    };
    $.dropper.getMethods = function () {
        var public = {};
        for (var i in methods)
            if (!/_/.test(i))
                public[i] = methods[i];
        return public;
    };
    $.dropper.close = function (el, force) {
        return methods.close.call(el ? $(el) : null, 'artificial close element', 'API', null, force);
    };
    $.dropper.cancel = function () {
        if (D.curAjax)
            D.curAjax.abort();
        D.curAjax = null;
        if (D.imgPreload)
            D.imgPreload.onload = D.imgPreload.onerror = null;
        $.dropper.hideLoading();
        return this;
    };
    $.dropper.update = function (el) {
        return (el ? $(el) : $('[data-elrun].' + D.activeClass)).each(function () {
            methods.update.call($(this));
        });
    };
    $.dropper.require = function (arr, cb) {
        (function (arr, cb) {
            if ($.type(arr) !== 'array')
                arr = arr.split(',');
            D.requireLength += arr.length;
            for (var i in arr) {
                if (methods.hasOwnProperty(arr[i]))
                    continue;
                $.ajax({
                    url: D.url + 'methods/' + arr[i] + '.js',
                    dataType: 'script',
                    cache: true,
                    success: function () {
                        if (++D.requireCur === D.requireLength) {
                            if (cb)
                                cb.call($.dropper, arr);
                            doc.trigger('dropperRequire');
                        }
                    },
                    error: function () {
                        throw methods._errorM(arguments[2]);
                    }
                });
            }
        })(arr, cb);
        return this;
    };
    doc.ready(function () {
        $('<style>', {html: D.mainStyle.replace(/\s{2,}/g, ' ').replace(/url\((.*)\)/g, 'url(' + D.url + 'images/default/$1)')}).appendTo($('body'));
        D.scrollTop = wnd.scrollTop();
        var loadingTimer, loadingFrame = 1,
            loading = $('<div/>', {
                id: 'dropper-loading'
            }).append($('<div/>')).appendTo($('body'));
        var _animate_loading = function () {
            if (!loading.is(':visible')) {
                clearInterval(loadingTimer);
                return;
            }
            $('div', loading).css('left', (loadingFrame * -40) + 'px');
            loadingFrame = (loadingFrame + 1) % 12;
        };
        $.dropper.showLoading = function () {
            clearInterval(loadingTimer);
            loading.show();
            loadingTimer = setInterval(_animate_loading, 66);
            return this;
        };
        $.dropper.hideLoading = function () {
            loading.hide();
            return this;
        };
    }).on('keyup.' + $.dropper.nS, function (e) {
        if (e.bubbles && D.activeDropper[0] && D.activeDropperCEsc[D.activeDropper[0]])
            D.activeDropperCEsc[D.activeDropper[0]](e);
    }).on('click.' + $.dropper.nS, function (e) {
        var $this = $(e.target);
        if (!D.existsN($this.closest('[data-elrun]')) && !$this.is('[data-elrun]') && $this.is(':visible') && e.bubbles && D.activeDropper[0] && D.activeDropperCClick[D.activeDropper[0]])
            D.activeDropperCClick[D.activeDropper[0]](e);
    });
    wnd.on('load.' + $.dropper.nS, function () {
        setTimeout(function () {
            var autoInitObject = $(D.selAutoInit).not('.' + D.isD);
            if (D.existsN(autoInitObject)) {
                if (D.requireLength && D.requireCur !== D.requireLength)
                    doc.on('dropperRequire.' + $.dropper.nS, function () {
                        autoInitObject.dropper();
                    });
                else {
                    autoInitObject.dropper();
                }
            }
        }, 0);
    }).on('message.' + $.dropper.nS, D.handlerMessageWindow);
})(jQuery, jQuery(window), jQuery(document));
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
jQuery.dropper.setMethod('droppable', function(dropper, undefined) {
    var $ = jQuery,
            wnd = $(window),
            doc = $(document);
    return (dropper || this).each(function() {
        var dropper = $(this);
        dropper.off('dropperClose.' + $.dropper.nS).on('dropperClose.' + $.dropper.nS, function() {
            $(this).off('mousedown.' + $.dropper.nS);
        });
        dropper.find('img').off('dragstart.' + $.dropper.nS).on('dragstart.' + $.dropper.nS, function(e) {
            e.preventDefault();
        });
        wnd.off('scroll.droppable' + $.dropper.nS);
        dropper.on('mousedown.' + $.dropper.nS, function(e) {
            var dropper = $(this),
                    drp = dropper.data('drp');
            if ($(e.target).is(':input, button') || $.dropper.drp.existsN($(e.target).closest('button')))
                return false;
            var dropper = $(this),
                    w = dropper.outerWidth(),
                    h = dropper.outerHeight(),
                    wndW = wnd.width(),
                    wndH = wnd.height();
            if ((w > wndW || h > wndH) && drp.droppableLimit)
                return false;
            doc.on('mouseup.' + $.dropper.nS, function(e) {
                dropper.css('cursor', '');
                doc.off('selectstart.' + $.dropper.nS + ' mousemove.' + $.dropper.nS + ' mouseup.' + $.dropper.nS);
                if (drp.droppableFixed) {
                    $.dropper.drp.scrollTopD = wnd.scrollTop();
                    drp.top = parseInt(dropper.css('top'));
                    wnd.on('scroll.droppable' + $.dropper.nS, function(e) {
                        var n = wnd.scrollTop(),
                                top = drp.top - $.dropper.drp.scrollTopD + n;
                        dropper.css('top', top);
                        drp.top = top;
                        $.dropper.drp.scrollTopD = n;
                    });
                }
            });
            var left = e.pageX - dropper.offset().left,
                    top = e.pageY - dropper.offset().top;
            dropper.css('cursor', 'move');
            doc.off('selectstart.' + $.dropper.nS).on('selectstart.' + $.dropper.nS, function(e) {
                e.preventDefault();
            });
            doc.off('mousemove.' + $.dropper.nS).on('mousemove.' + $.dropper.nS, function(e) {
                e.preventDefault();
                drp.droppableIn = true;
                var l = e.pageX - left,
                        t = e.pageY - top;
                if (drp.droppableLimit) {
                    l = l < 0 ? 0 : l;
                    t = t < 0 ? 0 : t;
                    l = l + w < wndW + wnd.scrollLeft() ? l : wndW - w;
                    t = t + h < wndH + wnd.scrollTop() ? t : wndH - h + wnd.scrollTop();
                    l = l < wnd.scrollLeft() ? wnd.scrollLeft() : l;
                    t = t < wnd.scrollTop() ? wnd.scrollTop() : t;
                }
                dropper.css({
                    'left': l,
                    'top': t
                });
            });
        });
    });
});
(function ($, body) {
    var setFull = body.requestFullScreen || body.webkitRequestFullScreen || body.mozRequestFullScreen || body.msRequestFullscreen,
        clearFull = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || document.msCancelFullscreen,
        nS = 'fullScreen';

    function checkFullScreen() {
        return ((document.fullscreenElement && document.fullscreenElement !== null) || document.mozFullScreen || document.webkitIsFullScreen) && window.innerHeight === screen.height;
    }

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

            if (!checkFullScreen()) {
                var callee = arguments.callee;
                setTimeout(function () {
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

                    header.off('dblclick.' + nS).on('dblclick.' + nS, function (e) {
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
(function ($, undefined) {
    var _galleryDecorator = function (rel, btn, i) {
        var self = this;
        return $('[data-elrun][data-rel' + (rel ? '="' + rel + '"' : '') + '].' + $.dropper.drp.activeClass).each(function () {
            var $this = $(this),
                    drp = $this.data('drp');
            self.gallery($this, drp, btn, i);
        });
    };
    $.dropper.setMethod('_cIGallery', function (rel) {
        var $ = jQuery;
        clearInterval($.dropper.drp.autoPlayInterval[rel]);
        delete $.dropper.drp.autoPlayInterval[rel];
    });
    $.dropper.setMethod('gallery', function (dropper, opt, btn, i) {
        var $ = jQuery,
                doc = $(document),
                self = this,
                relA = $.dropper.drp.gallery[opt.rel];
        if (!relA)
            return self;
        var relL = relA.length;
        if (relL <= 1)
            return self;
        var relP = $.inArray(opt.href, relA),
                prev = $.type(opt.prev) === 'string' ? dropper.find(opt.prev) : opt.prev,
                next = $.type(opt.next) === 'string' ? dropper.find(opt.next) : opt.next;
        prev.add(next).hide().attr('disabled', 'disabled');
        if (relP === -1)
            return false;
        if (!(relP !== relL - 1 || relP !== 0 || opt.cycle))
            return false;
        if (relP !== relL - 1)
            next.show().removeAttr('disabled');
        if (relP !== 0)
            prev.show().removeAttr('disabled');
        if (opt.cycle)
            prev.add(next).show().removeAttr('disabled');
        var _goto = function (i, e) {
            if (!relA[i]) {
                relP -= 1;
                return false;
            }
            var $next = $('[data-href="' + relA[i] + '"][rel="' + opt.rel + '"], [href="' + relA[i] + '"][rel="' + opt.rel + '"]');
            self._cIGallery(opt.rel);
            self.open.call($next, $.extend($.extend({}, opt), $next.data('drp'), {href: relA[i], dropper: null}), e);
        };
        var _getnext = function (i) {
            relP += i;
            if (opt.cycle) {
                if (relP >= relL)
                    relP = 0;
                if (relP < 0)
                    relP = relL - 1;
            }
            return relP;
        };
        prev.add(next).off('click.' + $.dropper.nS).on('click.' + $.dropper.nS, function (e) {
            e.stopPropagation();
            relP = $.inArray(opt.href, relA);
            self._cIGallery(opt.rel);
            _goto(_getnext($(this).is(prev) ? -1 : 1), e);
        });
        if (i !== undefined && i !== null && relP !== i && relA[i])
            _goto(i, null);
        if (btn)
            _goto(_getnext(btn === 1 ? 1 : -1), null);
        if (i === null)
            if (opt.autoPlay) {
                opt.autoPlay = false;
                self._cIGallery(opt.rel);
            }
            else
                opt.autoPlay = true;
        if (opt.autoPlay) {
            if ($.dropper.drp.autoPlayInterval[opt.rel])
                self._cIGallery(opt.rel);
            else
                $.dropper.drp.autoPlayInterval[opt.rel] = setInterval(function () {
                    self._cIGallery(opt.rel);
                    _goto(_getnext(1));
                }, opt.autoPlaySpeed);
        }
        dropper.off('dropperClose.' + $.dropper.nS).on('dropperClose.' + $.dropper.nS, function () {
            self._cIGallery($(this).data('drp').rel);
            doc.off('keydown.' + $.dropper.nS + opt.rel);
        });
        if (opt.keyNavigate)
            dropper.off('dropperAfter.' + $.dropper.nS).on('dropperAfter.' + $.dropper.nS, function () {
                var opt = $(this).data('drp');
                doc.off('keydown.' + $.dropper.nS + opt.rel).on('keydown.' + $.dropper.nS + opt.rel, function (e) {
                    var key = e.keyCode;
                    if (key === 37 || key === 39) //that window scrollLeft nochange after press left & right buttons
                        e.preventDefault();
                    if (key === 37)
                        _goto(_getnext(-1), e);
                    if (key === 39)
                        _goto(_getnext(1), e);
                });
            });
        return self;
    });
    $.dropper.next = function (rel) {
        return _galleryDecorator(rel, 1);
    };
    $.dropper.prev = function (rel) {
        return _galleryDecorator(rel, -1);
    };
    $.dropper.jumpto = function (i, rel) {
        return _galleryDecorator(rel, null, i);
    };
    $.dropper.play = function (rel) {
        return _galleryDecorator(rel, null, null);
    };
})(jQuery);
jQuery.dropper.setMethod('_heightContent', function (dropper, undefined) {
    var self = this,
        $ = jQuery,
        wnd = $(window);
    return (dropper || this).each(function (k) {
        var dropper = $(this),
            drp = dropper.data('drp');
        if (drp.place === 'inherit')
            return;
        if (!drp.limitSize)
            return;
        var dropperV = dropper.is(':visible');
        if (!dropperV)
            dropper.show();

        if (drp.placeContent) {
            var el = dropper.find($(drp.placeContent)).filter(':visible');
            if (el.data('jsp'))
                el.data('jsp').destroy();
            el = dropper.find($(drp.placeContent)).filter(':visible').css({'height': ''});
            var pP = el.find(drp.placePaste).css('height', '');
            if ($.dropper.drp.existsN(el)) {
                var refer = drp.elrun,
                    api = false,
                    elCH = el.css({'overflow': ''}).outerHeight();
                if (drp.scrollContent) {
                    if ($.fn.jScrollPane) {
                        api = el.jScrollPane(drp.jScrollPane).data('jsp');
                        if ($.dropper.drp.existsN(el.find('.jspPane')))
                            elCH = el.find('.jspPane').outerHeight();
                    }
                    else
                        el.css('overflow', 'auto');
                }
                else
                    el.css('overflow', 'hidden');
                var dropperH = dropper.outerHeight(),
                    dropperHm = dropper.height(),
                    footerHeader = dropper.find($(drp.placeHeader)).outerHeight() + dropper.find($(drp.placeFooter)).outerHeight(),
                    h;
                if (drp.place === 'global') {
                    var mayHeight = 0,
                        placement = drp.placement;
                    if ($.type(placement) === 'object') {
                        if (placement.top !== undefined)
                            mayHeight = placement.bottom - wnd.scrollTop() - footerHeader - (dropperH - dropperHm);
                        if (placement.bottom !== undefined)
                            mayHeight = wnd.height() - placement.top + wnd.scrollTop() - footerHeader - (dropperH - dropperHm);
                    }
                    else {
                        if (placement.search(/top/) >= 0)
                            mayHeight = refer.offset().top - wnd.scrollTop() - footerHeader - (dropperH - dropperHm);
                        if (placement.search(/bottom/) >= 0)
                            mayHeight = wnd.height() - refer.offset().top + wnd.scrollTop() - footerHeader - (dropperH - dropperHm) - refer.outerHeight();
                    }
                    if (mayHeight > elCH)
                        h = elCH;
                    else
                        h = mayHeight;
                }
                else {
                    if (elCH + footerHeader > dropperHm || drp.isFullScreen)
                        h = dropperHm - footerHeader;
                    else
                        h = elCH;
                }
                if (elCH > h && drp.scrollContent)
                    dropper.addClass($.dropper.drp.pC + 'is-scroll');
                el.css('height', h);
                if (!drp.scrollContent) {
                    el.find(drp.placePaste).css({
                        'height': h - pP.outerHeight() + pP.height(),
                        'width': function () {
                            return drp.type === 'image' ? $(this).children('img').width() : '';
                        }
                    });
                }
                if (api)
                    api.reinitialise();
                if (k !== true) { // for correct size content of popup if in style change size other elements if set class 'dropper-is-scroll'
                    arguments.callee.call(dropper, true);
                    self._limit(dropper, drp, true);
                }
            }
        }
        if (!dropperV)
            dropper.hide();
    });
});
jQuery.dropper.setMethod('limitSize', function (dropper, undefined) {
    var self = this,
        $ = jQuery;
    return dropper.each(function () {
        var dropper = $(this).removeClass($.dropper.drp.pC + 'is-limit-size'),
            drp = dropper.data('drp');

        self._limit(dropper, drp);

        self._checkMethod(function () {
            self._heightContent(dropper);
        });
    });
});
jQuery.dropper.setMethod('_limit', function (dropper, drp, add, undefined) {
    var wnd = $(window);
    if (drp.type === 'image')
        var img = dropper.find(drp.placePaste).children('img').css({'max-width': '', 'max-height': ''});
    if (drp.limitSize && drp.place === 'center') {
        dropper.css({
            width: '',
            height: ''
        });
        if (drp.placeContent && !add) {
            var jsp = dropper.find($(drp.placeContent)).filter(':visible').data('jsp');
            if (jsp)
                jsp.destroy();
            dropper.removeClass($.dropper.drp.pC + 'is-scroll').find(drp.placeContent).add(dropper.find(drp.placePaste)).filter(':visible').css({
                'height': '',
                'width': ''
            });
        }
        dropper.addClass($.dropper.drp.pC + 'is-limit-size');
        if (drp.type === 'image' && !drp.scrollContent)
            img.css({'max-width': '100%', 'max-height': '100%'});
        var wndW = wnd.width(),
            wndH = wnd.height(),
            w = dropper[$.dropper.drp.actual]('outerWidth'),
            h = dropper[$.dropper.drp.actual]('outerHeight'),
            ws = dropper[$.dropper.drp.actual]('width'),
            hs = dropper[$.dropper.drp.actual]('height');
        if (w > wndW)
            dropper.css('width', wndW - w + ws);
        if (h > wndH)
            dropper.css('height', wndH - h + hs);
    }
});
(function ($, wnd, undefined) {
    $.dropper.setMethod('placeAfterClose', function (dropper, $this, opt) {
        if (opt.place === 'inherit' || !opt.placeAfterClose)
            return false;
        if (!_isScrollable.call($('body'), 'y'))
            $('body').css('overflow-y', 'hidden');
        if (!_isScrollable.call($('body'), 'x'))
            $('body').css('overflow-x', 'hidden');
        if (!opt)
            return this;
        var pmt = opt.placeAfterClose.toLowerCase().split(' '),
                t = -dropper[$.dropper.drp.actual]('outerHeight'),
                l = -dropper[$.dropper.drp.actual]('outerWidth');
        if (pmt[1] === 'bottom')
            t = wnd.height();
        if (pmt[0] === 'right')
            l = wnd.width();
        if (pmt[0] === 'center' || pmt[1] === 'center') {
            if (pmt[0] === 'left') {
                l = -dropper[$.dropper.drp.actual]('outerWidth');
                t = dropper.css('top');
            }
            if (pmt[0] === 'right') {
                l = wnd.width();
                t = dropper.css('top');
            }
            if (pmt[1] === 'top') {
                t = -dropper[$.dropper.drp.actual]('outerHeight');
                l = dropper.css('left');
            }
            if (pmt[1] === 'bottom') {
                t = wnd.height();
                l = dropper.css('left');
            }
        }
        if (opt.placeAfterClose !== 'center center') {
            if (pmt[0] === 'inherit') {
                t = $this.offset().left;
                l = $this.offset().top;
            }
            else {
                t += wnd.scrollTop();
                l += wnd.scrollLeft();
            }
            dropper.animate({
                'left': l,
                'top': t
            }, {
                queue: false,
                duration: opt.durationOff
            });
        }
        return this;
    });
    var _isScrollable = function (side) {
        if (!$.dropper.drp.existsN(this))
            return this;
        var el = this.get(0),
                x = el.clientWidth && el.scrollWidth > el.clientWidth,
                y = el.clientHeight && el.scrollHeight > el.clientHeight;
        return !side ? (!(el.style.overflow && el.style.overflow === 'hidden') && (x || y)) : (side === 'x' ? !(el.style.overflowX === 'hidden') && x : !(el.style.overflowY === 'hidden') && y);
    };
})(jQuery, jQuery(window));
(function ($, wnd, undefined) {
    $.dropper.setMethod('placeBeforeShow', function (dropper, $this, opt) {
        var self = this;

        if (opt.place === 'inherit')
            return false;

        if (!_isScrollable.call($('body'), 'y'))
            $('body').css('overflow-y', 'hidden');
        if (!_isScrollable.call($('body'), 'x'))
            $('body').css('overflow-x', 'hidden');

        var pmt = opt.placeBeforeShow.toLowerCase().split(' '),
                t = -dropper[$.dropper.drp.actual]('outerHeight'),
                l = -dropper[$.dropper.drp.actual]('outerWidth');
        if (pmt[0] === 'center' || pmt[1] === 'center') {
            self._checkMethod(function () {
                self[opt.place].call(dropper, true);
            });
            t = dropper.css('top');
            l = dropper.css('left');
        }
        if (pmt[1] === 'bottom')
            t = wnd.height();
        if (pmt[0] === 'right')
            l = wnd.width();
        if (pmt[0] === 'center' || pmt[1] === 'center') {
            if (pmt[0] === 'left')
                l = -dropper[$.dropper.drp.actual]('outerWidth');
            if (pmt[0] === 'right')
                l = wnd.width();
            if (pmt[1] === 'top')
                t = -dropper[$.dropper.drp.actual]('outerHeight');
            if (pmt[1] === 'bottom')
                t = wnd.height();
        }
        dropper.css({
            'left': l + wnd.scrollLeft(), 'top': t + wnd.scrollTop()
        });
        if (pmt[0] === 'inherit')
            dropper.css({
                'left': $this.offset().left,
                'top': $this.offset().top + $this.outerHeight()
            });
        return this;
    });
    var _isScrollable = function (side) {
        if (!$.dropper.drp.existsN(this))
            return this;
        var el = this.get(0),
                x = el.clientWidth && el.scrollWidth > el.clientWidth,
                y = el.clientHeight && el.scrollHeight > el.clientHeight;
        return !side ? (!(el.style.overflow && el.style.overflow === 'hidden') && (x || y)) : (side === 'x' ? !(el.style.overflowX === 'hidden') && x : !(el.style.overflowY === 'hidden') && y);
    };
})(jQuery, jQuery(window));