/**
 * @fileoverview This is the text-shadow polyfill library for Internet Explorer 7, 8 and 9.
 *     Original version was created by Martin Hintzmann 2008 martin [a] hintzmann.dk
 *     MIT (http://www.opensource.org/licenses/mit-license.php) licensed.
 * @author Ryosuke Otsuya
 */
(function($) {
    /**
     * Apply text shadow.
     * @param {Object=} option
     *     Can overwrite text shadow defined by CSS with one defined by this option.
     * @return {jQuery}
     */
    $.fn.ieTextShadow = function(option) {
        /**
         * If IE6 or not.
         * @type {Boolean}
         */
        var isIE6 = $.browser.version < 7;
        return this.each(function() {
            if ($.browser.msie) {
                var _$element = $(this);
                _$element.ieTextShadowRemove();
                var _style = this.currentStyle || document.defaultView.getComputedStyle(this, '');
                var _shadows = ieTextShadowParse(option || _style['text-shadow']);
                var _html = _$element.html();
                var _tag = _$element.get(0).tagName;
                var BLOCKS = ['ADDRESS', 'BLOCKQUOTE', 'CENTER', 'DIV', 'DL', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
                    'OL', 'P', 'PRE', 'UL'];
                var INLINES = ['A', 'ABBR', 'ACRONYM', 'B', 'BIG', 'CITE', 'CODE', 'DFN', 'EM', 'FONT', 'I', 'KBD',
                    'LABEL', 'Q', 'S', 'SAMP', 'SMALL', 'SPAN', 'STRIKE', 'STRONG', 'TT', 'U', 'VAR'];
                var _isBlock = ($.inArray(_tag, BLOCKS) !== -1);
                var _isInline = ($.inArray(_tag, INLINES) !== -1);
                _$element.css({
                    'zIndex'    : '0',
                    'height'    : _isBlock ? _$element.height() : ''
                });
                if (_$element.css('position') === 'static') {
                    _$element.css({position: 'relative'});
                }
                if (_isInline) {
                    _$element.css({display: 'inline-block'});
                }
                if (isIE6) {
                    _$element.css({zoom: '1'});
                }
                for (var i = _shadows.length - 1; i >= 0; i--) {
                    var _shadow = _shadows[i];
                    if (_shadow.opacity === 0) {
                        continue;
                    }
                    var _$div = $('<div></div>')
                        .addClass('jQueryTextShadow')
                        .css({
                            'position':         'absolute',
                            'left':             (parseInt(_shadow.x) - Math.ceil(parseFloat(_shadow.radius) / 2)) + 'px',
                            'top':              (parseInt(_shadow.y) - Math.ceil(parseFloat(_shadow.radius) / 2)) + 'px',
                            'border':           '0',
                            'margin':           '0',
                            'padding-top':      _style['paddingTop'],
                            'padding-right':    _style['paddingRight'],
                            'padding-bottom':   _style['paddingBottom'],
                            'padding-left':     _style['paddingLeft'],
                            'width':            _$element.width(),
                            'height':           _$element.height(),
                            'line-height':      _style['lineHeight'],
                            'zIndex':           '-1000',
                            'text-align':       _style['textAlign'],
                            'color':            _shadow.color || _$element.css('color')
                        });
                    $('<span></span>')
                        .css({
                            'line-height':      _style['lineHeight']
                        })
                        .html(_html)
                        .appendTo(_$div);

                    if (_shadow.radius) {
                        if (_shadow.opacity < 1) {
                            _$div.css({
                                filter: 'progid:DXImageTransform.Microsoft.Alpha(Style=0, Opacity='
                                    + _shadow.opacity * 100 + ') '
                                    + 'progid:DXImageTransform.Microsoft.Blur(pixelradius='
                                    + Math.ceil(parseFloat(_shadow.radius) / 2) + ')'
                            });
                        } else {
                            _$div.css({
                                filter: 'progid:DXImageTransform.Microsoft.Blur(pixelradius='
                                    + Math.ceil(parseFloat(_shadow.radius) / 2) + ')'
                            });
                        }
                    } else {
                        if (_shadow.opacity < 1) {
                            _$div.css({
                                filter: 'progid:DXImageTransform.Microsoft.Alpha(Style=0, Opacity='
                                    + _shadow.opacity * 100 + ')'
                            });
                        }
                    }
                    _$element.append(_$div);
                }
            }
        });
    };

    var ieTextShadowParse = function(valueString) {
        // Change separator of rgba and rgb from comma to slash.
        valueString = valueString
            .replace(/\(\s*([^,\)]+)\s*,\s*([^,\)]+)\s*,\s*([^,\)]+)\s*,\s*([^\)]+)\s*\)/g, '($1/$2/$3/$4)')
            .replace(/\(\s*([^,\)]+)\s*,\s*([^,\)]+)\s*,\s*([^\)]+)\s*\)/g, '($1/$2/$3)');
        var _values = valueString.split(',');
        if (_values.length === 0) {
            return;
        }
        var _shadows = [];
        for (var i = 0, l = _values.length; i < l; i++) {
            var _value = _values[i];
            _value = (_value + '')
                // Trim spaces in head and end of lines.
                .replace(/^\s+|\s+$/gi, '')
                // Remove '!important'
                .replace(/\s*!\s*important/i, '');
            var _shadow = {
                x      : 0,
                y      : 0,
                radius : 0,
                color  : null,
                opacity: 1
            };
            if (_value.length > 0 || _value[0].toLowerCase() !== 'none') {
                _value = _value.replace(/\//g, ',');
                var _color;
                if (_value.match(/(\#[0-9A-Fa-f]{6}|\#[0-9A-Fa-f]{3}|rgba?\([0-9\.\,]*\)|\b[a-z]+\b)/i)
                    && (_color = RegExp.$1) ) {
                    _shadow.color = _color.replace(/^\s+/, '');
                    _value = _value.replace(_shadow.color, '');
                }
                var isRgb = _color.match(/rgba?\([0-9\.\,]*\)/);
                if (isRgb) {
                    var _rgb = _color.replace(/rgba?\(/, '').replace(')', '').split(',');
                    _shadow.color = '#'
                        + (parseInt(_rgb[0]).toString(16).length === 1 ? '0' : '')
                        + parseInt(_rgb[0]).toString(16)
                        + (parseInt(_rgb[1]).toString(16).length === 1 ? '0' : '')
                        + parseInt(_rgb[1]).toString(16)
                        + (parseInt(_rgb[2]).toString(16).length === 1 ? '0' : '')
                        + parseInt(_rgb[2]).toString(16);
                    if (_rgb.length === 4) {
                        _shadow.opacity = _rgb[3];
                    }
                }
                _value = $.map(_value.replace(/^\s+|\s+$/g, '').split(/\s+/), function(_distance) {
                    return (_distance || '').replace(/^0[a-z]*$/, '') ? _distance : 0;
                });

                switch (_value.length) {
                    case 1:
                        _shadow.x = _shadow.y = _value[0];
                        break;
                    case 2:
                        _shadow.x = _value[0];
                        _shadow.y = _value[1];
                        break;
                    case 3:
                        _shadow.x = _value[0];
                        _shadow.y = _value[1];
                        _shadow.radius = _value[2];
                        break;
                }
                if (_shadow.color === 'transparent') {
                    _shadow.x = _shadow.y = _shadow.radius = 0;
                    _shadow.color = null;
                }
            }
            _shadows.push(_shadow);
        }
        return _shadows;
    };

    $.fn.ieTextShadowRemove = function() {
        return this.each(function() {
            if ($.browser.msie) {
                $(this).children(".jQueryTextShadow").remove();
            }
        });
    };
})(jQuery);
