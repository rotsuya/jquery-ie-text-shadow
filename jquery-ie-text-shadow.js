/**
 * Created by JetBrains WebStorm.
 * User: rotsuya
 * Date: 12/03/14
 * Time: 17:59
 * To change this template use File | Settings | File Templates.
 */
/* Created by Martin Hintzmann 2008 martin [a] hintzmann.dk
 * Created by Ryosuke Otsuya 2011 r.otsuya.co
 * MIT (http://www.opensource.org/licenses/mit-license.php) licensed.
 *
 * Version: 0.1
 * Requires: jQuery 1.2+
 *
 */
(function($) {
    $.fn.textShadow = function(option) {
/*debug
        if (!$.browser.msie) {
            return;
        }
*/
        var isIE6 = $.browser.version < 7;
        return this.each(function() {
            var $element = $(this);
            $element.textShadowRemove();
            var style = this.currentStyle || document.defaultView.getComputedStyle(this, '');
            var shadows = $element.textShadowParse(style['text-shadow']);
            var html = $element.html();
            for (var i = 0, il = shadows.length; i < il; i++) {
                var shadow = $.extend(shadows[i], option);
                if ($element.css('position') === 'static') {
                    $element.css({position: 'relative'});
                }
                $element.css({zIndex: '0'});
                if (isIE6) {
                    $element.css({zoom: '1'});
                }
                var $div = $('<div></div>')
                    .addClass('jQueryTextShadow')
                    .css({
                        position:   	    'absolute',
                        left:	    	    (parseInt(shadow.x) - parseInt(shadow.radius)) + 'px',
                        top:		        (parseInt(shadow.y) - parseInt(shadow.radius)) + 'px',
                        margin:             '0',
                        'padding-top':      style['padding-top'],
                        'padding-right':    style['padding-right'],
                        'padding-bottom':   style['padding-bottom'],
                        'padding-left':     style['padding-left'],
                        width:	    	    $element.width(),
                        zIndex:	    	    '-1'
                });
                $span = $('<span></span>')
                    .css({
                        color:	    	shadow.color || $element.css('color'),
                        'line-height':  style['line-height'],
                        'font-weight':  style['font-weight'],
                        'text-align':   style['text-align']
                    })
                    .html(html)
                    .appendTo($div);

                if (shadow.radius) {
                    if (shadow.opacity) {
                        $div.css({
                            filter: 'progid:DXImageTransform.Microsoft.Blur(pixelradius='
                                + parseInt(shadow.radius)
                                + ', makeShadow="true", ShadowOpacity='
                                + shadow.opacity
                                + ')'
                        });
                    } else {
/*
                        $div.css({
                            filter: 'progid:DXImageTransform.Microsoft.Glow(Color='
                                + shadow.color || $element.css('color')
                                + ', Strength='
                                + parseInt(shadow.radius)
                                + ')'
                        });
*/
                        $div.css({
                            filter: 'progid:DXImageTransform.Microsoft.Blur(pixelradius='
                                + parseInt(shadow.radius)
                                + ', makeShadow="false")'
                        });
                    }
                } else {
                    if (shadow.opacity) {
                        $div.css({
                            filter: 'progid:DXImageTransform.Microsoft.Alpha(Style=0, Opacity='
                                + shadow.opacity
                                + ')'
                        });
                    }
                }
                $element.append($div);
            }
        });
    };

    $.fn.textShadowParse = function(valueString) {
        var values = valueString.match(/(((#[0-9A-F]{3,6}|rgba?\(.*?\)) (\-?[0-9]+(em|px)? ?){1,3})|((\-?[0-9]+(em|px)? ){1,3}(#[0-9A-F]{3,6}|rgba?\(.*?\))))/g);
        if (values.length === 0) {
            return;
        }
        var shadows = [];
        for (var i = 0, il = values.length; i < il; i++) {
            var value = values[i];
            value = String(value)
                .replace(/^\s+|\s+$/gi, '')
                .replace(/\s*!\s*important/i, '')
                .replace(/\(\s*([^,\)]+)\s*,\s*([^,\)]+)\s*,\s*([^,\)]+)\s*,\s*([^\)]+)\s*\)/g, '($1/$2/$3/$4)')
                .replace(/\(\s*([^,\)]+)\s*,\s*([^,\)]+)\s*,\s*([^\)]+)\s*\)/g, '($1/$2/$3)')
            var shadow = {
                x      : 0,
                y      : 0,
                radius : 0,
                color  : null
            };
            if (value.length > 1 || value[0].toLowerCase() !== 'none') {
                value = value.replace(/\//g, ',');
                var color;
                if ( value.match(/(\#[0-9a-f]{6}|\#[0-9a-f]{3}|(rgb)a?\([^\)]*\)|\b[a-z]+\b)/i)
                    && (color = RegExp.$1) ) {
                    shadow.color = color.replace(/^\s+/, '');
                    value = value.replace(shadow.color, '');
                }
                var isRgb = color.match(/rgba?\(.*?\)/);
                if (isRgb) {
                    var rgb = color.replace(/rgba?\(/, '').replace(/\)/, '').split(',');
                    shadow.color = '#'
                        + ((rgb[0] - 0).toString(16).length === 1 ? '0' : '')
                        + (rgb[0] - 0).toString(16)
                        + ((rgb[1] - 0).toString(16).length === 1 ? '0' : '')
                        + (rgb[1] - 0).toString(16)
                        + ((rgb[2] - 0).toString(16).length === 1 ? '0' : '')
                        + (rgb[2] - 0).toString(16);
                    if (rgb.length === 4) {
                        shadow.opacity = rgb[3] * 100;
                    }
                }
                value = value
                    .replace(/^\s+|\s+$/g, '')
                    .split(/\s+/)
                    .map(function(item) {
                        return (item || '').replace(/^0[a-z]*$/, '') ? item : 0 ;
                    });

                switch (value.length) {
                    case 1:
                        shadow.x = shadow.y = value[0];
                        break;
                    case 2:
                        shadow.x = value[0];
                        shadow.y = value[1];
                        break;
                    case 3:
                        shadow.x = value[0];
                        shadow.y = value[1];
                        shadow.radius = value[2];
                        break;
                }
                if (shadow.color === 'transparent') {
                    shadow.x = shadow.y = shadow.radius = 0;
                    shadow.color = null;
                }
            }

            shadows.push(shadow);
        }
        return shadows;
    };

    $.fn.textShadowRemove = function() {
        if (!$.browser.msie) {
            return;
        }
        return this.each(function() {
            $(this).children("span.jQueryTextShadow").remove();
        });
    };
})(jQuery);

if(typeof Array.prototype.map === 'undefined') {
    Array.prototype.map = function(fnc) {
        var a = new Array(this.length);
        for (var i = 0; i < this.length; i++) {
            a[i] = fnc(this[i]);
        }
        return a;
    }
}
