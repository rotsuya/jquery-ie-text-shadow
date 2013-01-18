/* Created by Martin Hintzmann 2008 martin [a] hintzmann.dk
 * MIT (http://www.opensource.org/licenses/mit-license.php) licensed.
 *
 * Tweaked by Ryosuke Otsuya 2012 https://github.com/rotsuya
 *
 * Version: 0.1
 * Requires: jQuery 1.2+
 * http://plugins.jquery.com/project/textshadow
 *
 */
(function($) {
    $.fn.ieTextShadow = function(option) {
        if (!$.browser.msie) {
            return;
        }
        var isIE6 = $.browser.version < 7;
        return this.each(function() {
            var $element = $(this);
            $element.ieTextShadowRemove();
            var style = this.currentStyle || document.defaultView.getComputedStyle(this, '');
            var shadows = ieTextShadowParse(option || style['text-shadow']);
            var html = $element.html();
            var tag = $element.get(0).tagName;
            var BLOCKS = ['ADDRESS', 'BLOCKQUOTE', 'CENTER', 'DIV', 'DL', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
                'OL', 'P', 'PRE', 'UL'];
            var INLINES = ['A', 'ABBR', 'ACRONYM', 'B', 'BIG', 'CITE', 'CODE', 'DFN', 'EM', 'FONT', 'I', 'KBD',
                'LABEL', 'Q', 'S', 'SAMP', 'SMALL', 'SPAN', 'STRIKE', 'STRONG', 'TT', 'U', 'VAR'];
            var isBlock = ($.inArray(tag, BLOCKS) !== -1);
            var isInline = ($.inArray(tag, INLINES) !== -1);
            $element.css({
                'zIndex'    : '0',
                'height'    : isBlock ? $element.height() : ''
            });
            if ($element.css('position') === 'static') {
                $element.css({position: 'relative'});
            }
            if (isInline) {
                $element.css({display: 'inline-block'});
            }
            if (isIE6) {
                $element.css({zoom: '1'});
            }
            for (var i = shadows.length - 1; i >= 0; i--) {
                var shadow = shadows[i];
                if (shadow.opacity === 0) {
                    continue;
                }
                var $div = $('<div></div>')
                    .addClass('jQueryTextShadow')
                    .css({
                        'position':         'absolute',
                        'left':             (parseInt(shadow.x) - Math.ceil(parseFloat(shadow.radius) / 2)) + 'px',
                        'top':              (parseInt(shadow.y) - Math.ceil(parseFloat(shadow.radius) / 2)) + 'px',
                        'border':           '0',
                        'margin':           '0',
                        'padding-top':      style['paddingTop'],
                        'padding-right':    style['paddingRight'],
                        'padding-bottom':   style['paddingBottom'],
                        'padding-left':     style['paddingLeft'],
                        'width':            $element.width(),
                        'height':           $element.height(),
                        'line-height':      style['lineHeight'],
                        'zIndex':           '-1000',
                        'text-align':       style['textAlign'],
                        'color':            shadow.color || $element.css('color')
                    });
                $('<span></span>')
                    .css({
                        'line-height':      style['lineHeight']
                    })
                    .html(html)
                    .appendTo($div);

                if (shadow.radius) {
                    if (shadow.opacity < 1) {
                        $div.css({
                            filter: 'progid:DXImageTransform.Microsoft.Alpha(Style=0, Opacity='
                                + shadow.opacity * 100 + ') '
                                + 'progid:DXImageTransform.Microsoft.Blur(pixelradius='
                                + Math.ceil(parseFloat(shadow.radius) / 2) + ')'
                        });
                    } else {
                        $div.css({
                            filter: 'progid:DXImageTransform.Microsoft.Blur(pixelradius='
                                + Math.ceil(parseFloat(shadow.radius) / 2) + ')'
                        });
                    }
                } else {
                    if (shadow.opacity < 1) {
                        $div.css({
                            filter: 'progid:DXImageTransform.Microsoft.Alpha(Style=0, Opacity='
                                + shadow.opacity * 100 + ')'
                        });
                    }
                }
                $element.append($div);
            }
        });
    };

    var ieTextShadowParse = function(valueString) {
        // Change separator of rgba and rgb from comma to slash.
        valueString = valueString
            .replace(/\(\s*([^,\)]+)\s*,\s*([^,\)]+)\s*,\s*([^,\)]+)\s*,\s*([^\)]+)\s*\)/g, '($1/$2/$3/$4)')
            .replace(/\(\s*([^,\)]+)\s*,\s*([^,\)]+)\s*,\s*([^\)]+)\s*\)/g, '($1/$2/$3)');
        var values = valueString.split(',');
        if (values.length === 0) {
            return;
        }
        var shadows = [];
        for (var i = 0, l = values.length; i < l; i++) {
            var value = values[i];
            value = (value + '')
                // Trim spaces in head and end of lines.
                .replace(/^\s+|\s+$/gi, '')
                // Remove '!important'
                .replace(/\s*!\s*important/i, '');
            var shadow = {
                x      : 0,
                y      : 0,
                radius : 0,
                color  : null,
                opacity: 1
            };
            if (value.length > 1 || value[0].toLowerCase() !== 'none') {
                value = value.replace(/\//g, ',');
                var color;
                if (value.match(/(\#[0-9A-Fa-f]{6}|\#[0-9A-Fa-f]{3}|rgba?\([0-9\s,]*\)|\b[a-z]+\b)/i)
                    && (color = RegExp.$1) ) {
                    shadow.color = color.replace(/^\s+/, '');
                    value = value.replace(shadow.color, '');
                }
                var isRgb = color.match(/rgba?\([0-9\s,]*\)/);
                if (isRgb) {
                    var rgb = color.replace(/rgba?\(/, '').replace(')', '').split(',');
                    shadow.color = '#'
                        + (parseInt(rgb[0]).toString(16).length === 1 ? '0' : '')
                        + parseInt(rgb[0]).toString(16)
                        + (parseInt(rgb[1]).toString(16).length === 1 ? '0' : '')
                        + parseInt(rgb[1]).toString(16)
                        + (parseInt(rgb[2]).toString(16).length === 1 ? '0' : '')
                        + parseInt(rgb[2]).toString(16);
                    if (rgb.length === 4) {
                        shadow.opacity = rgb[3];
                    }
                }
                value = $.map(value.replace(/^\s+|\s+$/g, '').split(/\s+/), function(_value) {
                    return (_value || '').replace(/^0[a-z]*$/, '') ? _value : 0;
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

    $.fn.ieTextShadowRemove = function() {
        if (!$.browser.msie) {
            return;
        }
        return this.each(function() {
            $(this).children(".jQueryTextShadow").remove();
        });
    };
})(jQuery);
