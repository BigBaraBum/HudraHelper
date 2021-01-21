// ==UserScript==
// @name         HydraPriceChanger
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Allows you to visibly change the prices
// @author       Nikita Inkin
// @match        http://hydraruzxpnew4af.onion/*
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @require https://code.jquery.com/ui/1.11.4/jquery-ui.min.js
// @updateURL https://github.com/BigBaraBum/HudraHelper/raw/master/HydraPriceChanger.user.js
// ==/UserScript==

(function () {
  "use strict";
  var currentPage = "";
  $("body").append('<div class="mymenu"></div>');
  $(".mymenu")
    .css({
      position: "fixed",
      top: "0",
      left: "0",
      background: "rgba(255,255,255,1)",
      width: "500px",
      height: "400px",
      "z-index": "999999",
      border: "5px solid blue",
      padding: "20px"
    })
    .draggable();

  $(".mymenu")
    .append("<p>Сумма прибавления</p>")
    .append('<input id="input-adder" type="number" value=200 />')
    .append('<button id="button-adder">Прибавить</button>')
    .append('<p>Текущий баланс в BTC: <span class="balance-btc"></span></p>')
    .append('<p>Текущий адрес кошелька: <span class="btc-wallet"></span></p>')
    .append('<p>Страница:<span class="page-display"></span></p>')
    .append('<p>Version: <span class="version">1.1</span></p>');

  $("#button-adder").click(function () {
    var value = $("#input-adder").get(0).value;
    renderPrices(parseInt(value));
  });
  renderBalanceWallet();
  getCurrentPage();
  if (currentPage == "product") {
    $(".mymenu").append('<button id="button-discounts">Убрать скидки</button>');
    $("#button-discounts").click(function () {
      removeDiscounts();
    });
  }

  function getCurrentPage() {
    var pathname = window.location.pathname;
    if (pathname.startsWith("/product")) {
      setPageDisplay("Продукт");
      setCurrentPage("product");
    } else if (pathname.startsWith("/catalog")) {
      setPageDisplay("Каталог");
      setCurrentPage("catalog");
    }
  }
  function removeDiscounts() {
    $(".av_price s").each(function () {
      $(this).remove();
    });
  }
  function renderBalanceWallet() {
    $.ajax({
      url: "http://hydraruzxpnew4af.onion/balance",
      dataType: "html",
      success: function (response) {
        var balance = $(response).find(".balance_list .text-primary")[0].innerText;
        var wallet = $(response).find(".balance_list .text-primary")[1].innerText;
        setBalance(balance);
        setWallet(wallet);
      },
      error: function (error) {
        alert(error);
      }
    });
  }
  function renderPrices(sumToAdd) {
    if (currentPage == "catalog") {
      $(".slide_price span, .price span").each(function () {
        var oldPrice = $(this).get(0).innerText;
        var newPrice = sumOldPrice(oldPrice, sumToAdd);
        var position = newPrice.length;
        var ending = oldPrice.slice(position);
        var final = newPrice + ending;
        $(this).get(0).innerText = final;
      });
    } else if (currentPage == "product") {
      $(".av_price b").each(function () {
        var oldPrice = $(this).get(0).innerText;
        var newPrice = sumOldPrice(oldPrice, sumToAdd);
        var position = newPrice.length;
        var ending = oldPrice.slice(position);
        var final = newPrice + ending;
        $(this).get(0).innerText = final;
        //console.log($(this).get(0).innerText)
      });
    }
  }

  function sumOldPrice(oldPrice, sumToAdd) {
    var result = oldPrice.match(/((\d{1,2} )?(\d{3}))/gm);
    result = result[0].replace(/\ /g, "");
    result = String(parseInt(result) + sumToAdd);
    var position = result.length - 3;
    var ready = [result.slice(0, position), result.slice(position)].join(" ");
    return ready;
  }
  function setBalance(balance) {
    $(".balance-btc").get(0).textContent = balance;
  }
  function setWallet(wallet) {
    $(".btc-wallet").get(0).textContent = wallet;
  }
  function setPageDisplay(pageName) {
    $(".page-display").get(0).textContent = pageName;
  }
  function setCurrentPage(data) {
    currentPage = data;
  }
})();
