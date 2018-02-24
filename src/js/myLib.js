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
}

let createTag = function (tag_, attr_) {
    let tagObj = document.createElement(tag_);
    if (attr_) {
        for (let key in attr_) {
            let attr = attr_[key];
            switch (key) {
                case 'className':
                    {
                        tagObj[key] = Array.isArray(attr) ? attr.join(' ') : attr;
                        break;
                    }
                default:
                    {
                        tagObj[key] = attr;
                    }
            }
        }
    }
    return tagObj;
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
}

export {
    addEvent,
    leftPadding,
    createTag,
    reload,
};