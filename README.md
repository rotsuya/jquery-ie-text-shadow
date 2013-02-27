# jquery-ie-text-shadow

<table>
  <tr>
    <td><img src="http://lh4.googleusercontent.com/-k4On9qiOuII/UNAkRO2_h8I/AAAAAAAADME/kLwD8PWglzw/s800/jquery-ie-text-shadow-ie8.png" alt="ie8" width="339" height="309" /><br />
      Win XP, IE 8 with jquery-ie-text-shadow</td>
    <td><img src="http://lh4.googleusercontent.com/-3REzR9lxYYI/UNAkRa3e0HI/AAAAAAAADMA/OcxVZcOCLKE/s800/jquery-ie-text-shadow-safari6.png" alt="safari6" width="339" height="309" /><br />
      Mac OS X 10.8, Safari 6</td>
  </tr>
</table>

## 概要 / Overview

* Internet Explorer 7, 8, 9で、CSSの`text-shadow`を polyfill で実現する jQuery プラグインです。
* [5年後10年後 こどもたちが健やかに育つ会](http://www.5nen10nen.com/)というウェブサイトで使用しています。
* 他の同様のプラグイン、ライブラリと比較すると以下の点で優れています。
  * 複数の影を指定できる。
  ([CSS-3 Text-Shadow](http://www.hintzmann.dk/testcenter/js/jquery/textshadow/)と比較)
  * 表示の再現性が高くモダンブラウザの`text-shadow`に近い。  
    node.js で[テストページ](/test/test.js)を生成してテストしています。  
    ([heygrady / textshadow](https://github.com/heygrady/textshadow)と比較)
* こちらに[デモページ](http://rotsuya.github.com/jquery-ie-text-shadow/demo.html)があります。

###

* jQuery plugin for `text-shadow` polyfill for Internet Explorer 7, 8 and 9.
* It's used in web site [www.5nen10nen.com](http://www.5nen10nen.com/).
* It's superior to other similar libraries and plugins at these points.
  * You can apply multiple shadows.
    (VS [CSS-3 Text-Shadow](http://www.hintzmann.dk/testcenter/js/jquery/textshadow/))
  * Quality of rendering are better and more sililar to moderen browser's `text-shadow`.
    Tested with [exhaustive test page](/test/test.js) generated with node.js.
    (VS [heygrady / textshadow](https://github.com/heygrady/textshadow))
* Here is [Demonstration page](http://rotsuya.github.com/jquery-ie-text-shadow/demo.html).

## 使い方 / Usage

* jQueryをインクルードした後に、このライブラリをインクルードしてください。  
  Internet Explorer 以外で不要な処理を実行しないため、 Internet Explorerの条件付きコメントを使うことをおすすめします。
* 適用したい jQuery オブジェクトに対して、`ieTextShadow()`メソッドを呼び出してください。
* CSSの`text-shadow`プロパティで指定したスタイルが自動的に適用されます。

###

* It is necessary to include this library after jQuery.  
I recommend that you use Internet Explorer's conditional comment.
* Call `ieTextShadow()` method of jQuery DOM object that you'd like to apply text-shadow.
* The style that defined by CSS `text-shadow` property is applied.

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

* `ieTextShadow()`メソッドの引数に、`text-shadow` プロパティの値を指定すると、CSSのスタイルを上書きできます。

###

* You can overwrite CSS `text-shadow` property by arguments of `ieTextShadow()` method.

```javascript
$('.emboss').ieTextShadow('4px -4px 10px red, -4px -4px 10px green');
```

## 制限事項 / Known Issues

* 2行以上にまたがる長いテキストに適用すると、適用部分の後に意図しない改行が入ってしまいます。
  面倒ですが、単語ごとに`<span>`タグで区切ると回避できます。
* ブラウザのウィンドウサイズの変更等に伴い、テキストがリフローされた場合、影は再レイアウトされません。その結果、ベースのテキストとtext-shadowが分離していまいます。

###

* When apply to inline elements with long text running two or more lines,
  unintended line break are inserted after elements.
  You may separate a word with a `<span>` tag to fix it.
* When you resize window and text are reflowed, shadows are separated from text unintentionally.

## 謝辞 / Acknowledgement

* [Original version](http://www.hintzmann.dk/testcenter/js/jquery/textshadow/) was created
  by Martin Hintzmann 2008 martin [a] hintzmann.dk