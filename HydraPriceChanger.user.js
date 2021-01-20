// ==UserScript==
// @name         HydraPriceChanger
// @namespace    http://tampermonkey.net/
// @version      0.5.1
// @description  Allows you to visibly change the prices
// @author       Nikita Inkin
// @match        http://hydraruzxpnew4af.onion/catalog/*
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @require https://code.jquery.com/ui/1.11.4/jquery-ui.min.js
// @updateURL https://github.com/BigBaraBum/HudraHelper/raw/master/HydraPriceChanger.user.js
// ==/UserScript==

(function() {
    'use strict';
    $('body').append('<div class="mymenu"></div>');
    $('.mymenu').css({'position':'fixed','top':'0','left':'0','background':'rgba(255,255,255,1)','width':'250px','height':'400px','z-index':'999999','border':'5px solid blue','padding':'20px'}).draggable();
    $('.mymenu').append('<p>Сумма прибавления</p>').append('<input id="input-adder" type="number" value=200 />');
    $('.mymenu').append('<button id="button-adder">Прибавить</button>');
    $('#button-adder').click(function(){
        var value = $('#input-adder').get(0).value;
        renderPrices(parseInt(value));
    });
    var sumToAdd = 200;
    function getTransactionFee(){

    }
    function renderPrices(sumToAdd){
        $('.slide_price span, .price span').each(function(){
            var oldPrice = $(this).get(0).innerText;
            var newPrice = sumOldPrice(oldPrice, sumToAdd);
            var position = newPrice.length;
            var ending = oldPrice.slice(position);
            var final = newPrice + ending;
            $(this).get(0).innerText = final;
            console.log(ending);
        });
    }
    function sumOldPrice(oldPrice, sumToAdd){
        var result = oldPrice.match(/((\d{1,2} )?(\d{3}))/gm);
        result = result[0].replace(/\ /g,'');
        result = String(parseInt(result)+sumToAdd);
        var position = result.length - 3;
        var ready = [result.slice(0, position), result.slice(position)].join(' ');
        return ready;
    };
})();
