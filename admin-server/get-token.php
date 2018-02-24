<?php
require 'autoload.php';
use Qiniu\Auth;

include 'qiniu-key-data.php';

// echo var_dump($_POST).','.$user.';';
if (!checkLogin($_POST['account'], $_POST['password'])) {
    http_response_code(403);
    echo '账号密码错误';
    exit();
}

$auth = new Auth($accessKey, $secretKey);
$token = $auth->uploadToken($bucket);
header("Content-type: application/json; charset=utf-8");

echo json_encode(
    [
        'QinniuToken'=>$token,
    ]
);
