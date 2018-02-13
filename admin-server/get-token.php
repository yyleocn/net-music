<?php
require 'autoload.php';
use Qiniu\Auth;

include 'config.qiniu-key.php';

$auth = new Auth($accessKey, $secretKey);
$token = $auth->uploadToken($bucket);
echo var_dump($_POST);
echo var_dump([1,2,3,4,5]);
echo '<br>';
echo $token;
