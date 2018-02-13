<?php
require 'autoload.php';
use Qiniu\Auth;

include 'config.qiniu-key.php';

// echo var_dump($_POST).','.$user.';';
if (!checkLogin($_POST['user'], $_POST['password'])) {
    http_response_code(403);
    echo 'Invalid user or password';
    exit();
}

$auth = new Auth($accessKey, $secretKey);
$token = $auth->uploadToken($bucket);
echo $token;