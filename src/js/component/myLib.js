"use strict";

let addEvent = (elem_, type_, func_) => {
    if (window.addEventListener) {
        addEvent = (elem_, type_, func_) => {
            elem_.addEventListener(type_, func_, false);
        };
    } else if (window.attachEvent) {
        addEvent = (elem_, type_, func_) => {
            elem_.attachEvent('on' + type_, func_);
        };
    } else {
        throw 'Un support event system';
    }
    addEvent(elem_, type_, func_);
};

let ajaxDetect = ({url_, method_, body_, success_, fail_, test_}) => {
    return new Promise((resolve_, reject_) => {
        let request = new XMLHttpRequest();
        request.open(method_ || 'get', url_);
        request.addEventListener('readystatechange', (event_) => {
            if (request.status >= 200) {
                let requestStatus = request.status;
                request.abort();
                if (requestStatus > 300) {
                    resolve_(false);
                    return
                }
                resolve_(true);
            }
        });
        request.send(body_);
    });
};

let reload = (method_) => {
    switch (method_) {
        case 'url': {
            document.location.href = document.location.origin + document.location.pathname;
            return;
        }
        case 'query': {
            document.location.href = document.location.origin + document.location.pathname + document.location.search;
            return
        }
        default: {
            document.location.href = document.location.href.toString();
        }
    }
};

let errorProcess = (err_) => {
    if (swal) {
        swal('错误！', err_, 'error');
    }
    console.warn(err_);
};

export {
    addEvent,
    reload,
    errorProcess,
    ajaxDetect,
};