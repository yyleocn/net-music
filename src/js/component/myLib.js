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

let leftPadding = (str_, length_, pad_) => {
    if (typeof str_ !== 'string' || typeof length_ !== 'number') {
        throw 'Invalid arguments.';
    }
    let pad = typeof pad_ === 'string' ? pad_ : ' ';
    let res = str_;
    while (res.length < length_) {
        res = pad_ + res;
    }
    return res;
};

// let createTag = function (tag_, attr_) {
//     let tagObj = document.createElement(tag_);
//     if (attr_) {
//         for (let key in attr_) {
//             let attr = attr_[key];
//             switch (key) {
//                 case 'className':
//                     {
//                         tagObj[key] = Array.isArray(attr) ? attr.join(' ') : attr;
//                         break;
//                     }
//                 default:
//                     {
//                         tagObj[key] = attr;
//                     }
//             }
//         }
//     }
//     return tagObj;
// };

let ajaxDetect = ({url_, method_, body_, success_, fail_, test_}) => {
    return new Promise(function (resolve_, reject_) {
        let request = new XMLHttpRequest();
        request.open(method_ || 'get', url_);
        request.onreadystatechange = (event_) => {
            if (request.status >= 200) {
                let requestStatus = request.status;
                request.abort();
                if (requestStatus > 300) {
                    reject_.call(undefined, request);
                    return
                }
                resolve_.call(undefined, request);
            }
        };
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
            document.location.href = document.location.href;
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
    leftPadding,
    // createTag,
    reload,
    errorProcess,
    ajaxDetect,
};