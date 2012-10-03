# jquery-ie-text-shadow

This library is `text-shadow` polyfill for Internet Explorer 7, 8 and 9. It's used in web site http://www.5nen10nen.com/ .

Demonstration page is hre.

## Known Issues

* When apply this library to inline elements running two or more lines, unintended line break are inserted after applyed elements. You may separate a word in a span tag to fix it.
* When resize window and text are reflowd, shadow are separated from text unintentionally.

## Usage

```html
<script src="jquery-1.7.1.min.js"></script>
<!--[if lt IE 10]>
<script src="jquery-ie-text-shadow.js"></script>
<script>
$(document).ready(function() {
    $('.emboss').ieTextShadow();
}
</script>
<![endif]-->
<style>
.emboss {
    text-shadow: 0px -1px #222222, 0px 2px #FFFFFF;    
}
</style>
<div class="emboss">Emboss</div>
```

## Options

You can overwrite CSS `text-shadow` property by arguments.

```javascript
$('.emboss').ieTextShadow('4px -4px 10px red, -4px -4px 10px green');
```


