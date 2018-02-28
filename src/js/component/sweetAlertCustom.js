"use strict";
import 'sweetalert';

const defaultButton = {
    visible: true,
    text: null,
    value: null,
    className: '',
    closeModal: true,
};

const defaultCancelButton = Object.assign({},
    defaultButton, {
        visible: false,
        text: "取消",
        value: null,
    }
);

const defaultConfirmButton = Object.assign({},
    defaultButton, {
        text: "确定",
        value: true,
    }
);

const defaultWarningButton = Object.assign({},
    defaultButton, {
        text: "确定",
        value: true,
        className: '',
    }
);

const defaultButtonList = {
    cancel: defaultCancelButton,
    confirm: defaultConfirmButton,
};


swal.setDefaults({
    buttons: defaultButtonList,
});

swal.success = ({ text_, title_, } = {}) => {
    return swal({
        text: text_,
        title: title_ || '成功',
        icon: 'success',
    });
};

swal.info = ({ text_, title_, } = {}) => {
    return swal({
        text: text_,
        title: title_ || '注意',
        icon: 'info',
    });
};

swal.warning = ({ text_, title_, } = {}) => {
    return swal({
        text: text_,
        title: title_ || '成功',
        icon: 'warning',
    });
};


swal.error = ({ text_, title_, } = {}) => {
    return swal({
        text: text_,
        title: title_ || '错误',
        icon: 'error',
    });
};

swal.confirm = ({ text_, icon_, title_, } = {}) => {
    return swal({
        text: text_,
        title: title_ || '确认',
        icon: icon_ || "warning",
        buttons: {
            cancel: true,
            confirm: true,
        },
    });
};


swal.input = function ({ text_, icon_, title_, placeholder_, type_ } = {}) {
    return swal({
        title: title_,
        content: {
            element: "input",
            attributes: {
                type: type_,
                placeholder: placeholder_,
            },
        },
        buttons: {
            cancel: true,
            confirm: true,
        },
    });
};

