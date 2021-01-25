// ==UserScript==
// @name         HydraPriceChanger
// @namespace    https://github.com/BigBaraBum
// @version      3.5
// @description  Allows you to visibly change the prices
// @author       BigBaraBum
// @match        http://hydraruzxpnew4af.onion/*
// @match        http://hydra2exghh3rnmc.onion/*
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @require https://code.jquery.com/ui/1.11.4/jquery-ui.min.js
// @updateURL https://github.com/BigBaraBum/HudraHelper/raw/master/HydraPriceChanger.user.js
// ==/UserScript==

(function () {
  "use strict";
  var currentPage = "";
  var currentHost = "";
  //setRedStyle();
  $("body").append('<div class="mymenu"></div>');
  $(".mymenu").css({
    position: "absolute",
    top: "0",
    left: "0",
    background: "rgba(255,255,255,1)",
    "z-index": "999999",
    border: "5px solid blue",
    padding: "20px"
  });
  $(".mymenu").append('<button id="hide">Меню</button>').append('<div class="mymenu-wrapper"></div>');
  $(".mymenu-wrapper").toggle();
  $("#hide").click(function () {
    $(".mymenu-wrapper").toggle();
  });
  $(window).on("load", function () {
    renderCurrentPage();
    renderBalanceWallet();
    renderPageTitle();
  });
  $(".mymenu-wrapper")
    .append("<p>Сумма прибавления    sss</p>")
    .append('<input id="input-adder" type="number" value=200 />')
    .append('<button id="button-adder">Прибавить</button>')
    .append('<p>Текущий баланс в BTC: <span class="balance-btc"></span></p>')
    .append('<p>Текущий адрес кошелька: <span class="btc-wallet"></span></p>')
    .append('<p>Текущий сайт: <span class="host-display"></span></p>')
    .append('<p>Страница: <span class="page-display"></span></p>')
    .append('<p>Version: <span class="version">3.5</span></p>')

  $("#button-adder").click(function () {
    var value = $("#input-adder").get(0).value;
    renderPrices(parseInt(value));
  });

  if (currentPage == "product") {
    $(".mymenu-wrapper").append('<button id="button-discounts">Убрать скидки</button>');
    $("#button-discounts").click(function () {
      removeDiscounts();
    });
  }
  function getCurrentUserName() {
    return $(".user_head .dropdown-toggle").get(0).innerText;
  }
  function renderPageTitle() {
    document.title = getCurrentUserName() + document.title;
  }
  function renderCurrentPage() {
    if (window.location.pathname.startsWith("/product")) {
      setCurrentPage("product");
      setPageDisplay("Продукт");
    } else if (window.location.pathname.startsWith("/catalog")) {
      setCurrentPage("catalog");
      setPageDisplay("Каталог");
    } else if (window.location.pathname == "/" || window.location.pathname.startsWith("/login")) {
      setCurrentPage("login");
      setPageDisplay("Логин");
      addLoginButtons();
    }
    setCurrentHost(window.location.origin);
    renderCurrentHost();
  }
  function addLoginButtons() {
    $(".mymenu-wrapper").append('<button id="button-bigbarabum">BigBaraBum</button>').append('<button id="button-mason">Mason</button>');
    $("#button-bigbarabum").click(function () {
      $("#login-name").get(0).value = "BigBaraBum";
      $("#login-pass").get(0).value = "stakan420";
    });
    $("#button-mason").click(function () {
      $("#login-name").get(0).value = "MrMasoon456";
      $("#login-pass").get(0).value = "Mason96Jamboo";
    });
  }
  function renderCurrentHost() {
    $(".host-display").get(0).textContent = currentHost;
  }
  function setRedStyle() {
    $(".bg-primary").each(function () {
      $(this).css({ background: "black" });
    });
    $("a, p, h1, h2, h3, h4, h5, h6, b, span, div").each(function () {
      $(this).css({ color: "red" });
    });
    $("body, div, .btn-primary, input, blockquote").css({ background: "black" });
    $(".av_tabs").css({ border: "none" });
  }

  function removeDiscounts() {
    $(".av_price s").each(function () {
      $(this).remove();
    });
  }
  function renderBalanceWallet() {
    var url = currentHost + "/balance";
    $.ajax({
      url: url,
      dataType: "html",
      success: function (response) {
        var balance = $(response).find(".balance_list .text-primary")[0].innerText;
        var wallet = $(response).find(".balance_list .text-primary")[1].innerText;
        setBalance(balance);
        setWallet(wallet);
      },
      error: function (error) {
        console.log(error);
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
  function setCurrentHost(data) {
    currentHost = data;
  }
  function getOrders() {
    var shops = {};
    var baseUrl = "http://hydraruzxpnew4af.onion/orders/closed?page=";
    for (var i = 1; i <= 104; i++) {
      var newUrl = baseUrl + String(i);
      getOrders(newUrl);
      if (i == 104) {
        console.log(shops);
      }
    }
    function getOrders(url) {
      $.ajax({
        url: url,
        dataType: "html",
        timeout: 3000,
        success: function (response) {
          $(response)
            .find(".table tbody tr .tdo_tools_name a")
            .each(function () {
              var shopName = $(this).get(0).innerText;
              if (shops[shopName]) {
                shops[shopName] += 1;
              } else {
                shops[shopName] = 1;
              }
            });
        },
        error: function (error) {
          console.log(error);
        }
      });
    }
  }
})();
