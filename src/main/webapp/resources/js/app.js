/*****
 * CONFIGURATION
 */
//Main navigation
$.navigation = $('nav > ul.nav');
$.panelIconOpened = 'icon-arrow-up';
$.panelIconClosed = 'icon-arrow-down';
//Default colours
$.brandPrimary = '#20a8d8';
$.brandSuccess = '#4dbd74';
$.brandInfo = '#63c2de';
$.brandWarning = '#f8cb00';
$.brandDanger = '#f86c6b';
$.grayDark = '#2a2c36';
$.gray = '#55595c';
$.grayLight = '#818a91';
$.grayLighter = '#d1d4d7';
$.grayLightest = '#f8f9fa';
'use strict';
/****
 * MAIN NAVIGATION
 */

$(document).ready(function ($) {

    // Add class .active to current link
    $.navigation.find('a').each(function () {

        var cUrl = String(window.location).split('?')[0];
        if (cUrl.substr(cUrl.length - 1) == '#') {
            cUrl = cUrl.slice(0, -1);
        }

        if ($($(this))[0].href == cUrl) {
            $(this).addClass('active');
            $(this).parents('ul').add(this).each(function () {
                $(this).parent().addClass('open');
            });
        }
    });
    // Dropdown Menu
    $.navigation.on('click', 'a', function (e) {

        if ($.ajaxLoad) {
            e.preventDefault();
        }

        if ($(this).hasClass('nav-dropdown-toggle')) {
            $(this).parent().toggleClass('open');
            resizeBroadcast();
        }

    });
    function resizeBroadcast() {

        var timesRun = 0;
        var interval = setInterval(function () {
            timesRun += 1;
            if (timesRun === 5) {
                clearInterval(interval);
            }
            window.dispatchEvent(new Event('resize'));
        }, 62.5);
    }

    /* ---------- Main Menu Open/Close, Min/Full ---------- */
    $('.navbar-toggler').click(function () {

        if ($(this).hasClass('sidebar-toggler')) {
            $('body').toggleClass('sidebar-hidden');
            resizeBroadcast();
        }

        if ($(this).hasClass('aside-menu-toggler')) {
            $('body').toggleClass('aside-menu-hidden');
            resizeBroadcast();
        }

        if ($(this).hasClass('mobile-sidebar-toggler')) {
            $('body').toggleClass('sidebar-mobile-show');
            resizeBroadcast();
        }

    });
    $('.sidebar-close').click(function () {
        $('body').toggleClass('sidebar-opened').parent().toggleClass('sidebar-opened');
    });
    /* ---------- Disable moving to top ---------- */
    $('a[href="#"][data-top!=true]').click(function (e) {
        e.preventDefault();
    });
});
/****
 * CARDS ACTIONS
 */

$(document).on('click', '.card-actions a', function (e) {
    e.preventDefault();
    if ($(this).hasClass('btn-close')) {
        $(this).parent().parent().parent().fadeOut();
    } else if ($(this).hasClass('btn-minimize')) {
        var $target = $(this).parent().parent().next('.card-block');
        if (!$(this).hasClass('collapsed')) {
            $('i', $(this)).removeClass($.panelIconOpened).addClass($.panelIconClosed);
        } else {
            $('i', $(this)).removeClass($.panelIconClosed).addClass($.panelIconOpened);
        }

    } else if ($(this).hasClass('btn-setting')) {
        $('#myModal').modal('show');
    }

});
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function init(url) {

    /* ---------- Tooltip ---------- */
    $('[rel="tooltip"],[data-rel="tooltip"]').tooltip({ "placement": "bottom", delay: { show: 400, hide: 200 } });
    /* ---------- Popover ---------- */
    $('[rel="popover"],[data-rel="popover"],[data-toggle="popover"]').popover();
}

$(document).ready(function () {
    console.log("ready!");
    var wsUri = "ws://localhost:8080/jflow-qms/kioscoinf/A82A723F-E31D-44D0-8F05-6071B43B2B20/2.0.4";
    var output;
    function iniciar() {
        output = document.getElementById("output");
        testWebSocket();
    }

    function testWebSocket() {
        websocket = new WebSocket(wsUri);
        websocket.onopen = function (evt) {
            onOpen(evt);
        };
        websocket.onclose = function (evt) {
            onClose(evt);
        };
        websocket.onmessage = function (evt) {
            onMessage(evt);
        };
        websocket.onerror = function (evt) {
            onError(evt);
        };
    }

    function onOpen(evt) {
        writeToStatus("CONNECTED", "tag tag-success pull-left");
    }

    function onClose(evt) {
        writeToStatus("DISCONNECTED", "tag tag-danger pull-left");
    }

    function onMessage(evt) {
        console.log(evt.data);
        messageDetect(evt.data);
    }

    function onError(evt) {
        writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
    }

    function doSend(message) {
        writeToScreen("SENT: " + message);
        console.log("conectado");
    }

    function writeToStatus(message, clase) {
        $('#estadoWebSocket').remove();
        $('.app-footer').append("<span id='estadoWebSocket'>  </span>");
        $("#estadoWebSocket").append(message).addClass(clase);
    }

    function writeToSucursal(message) {
        
        $('#nombreSucursal').remove();
        $('.breadcrumb').append("<li id='nombreSucursal' class='breadcrumb-item'><a href='#'></a> </li>");
        $("#nombreSucursal").append(message);

    }

    function writeToScreen(message) {
        console.log(message);
    }

    function messageDetect(message) {

        var obj = JSON.parse(message);

        switch (obj.tipoMensaje) {
            case "SUCCESS_LOGIN":
                writeToSucursal(obj.mensaje.nombreOficina);
                break;
            case "CALL":
                break;
            case "REMOVE":
                break;
            case "REFRESH":
                break;
            case "PRINT":
                break;
            case "LOGIN":
                break;
        }

    }

    window.addEventListener("load", iniciar, false);
});