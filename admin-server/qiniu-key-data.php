<?php
$accessKey = 'rdr7SFLdR7ymIaiQyRk1R1lcEZiwAPP9Jbmmz-8n';
$secretKey = 'PEt7EZY_9zflT-megCvXOSo3qOGh-WUbjrgxDsbv';
$bucket = 'net-music';

$account = 'XiaoLe';
$password = '123654';

function checkLogin($account_, $password_)
{
    global $account,$password;
    if ($account_ != $account) {
        return false;
    }
    if ($password_ != $password) {
        return false;
    }
    return true;
}