<?php
$accessKey = '';
$secretKey = '';
$bucket = '';

$account = '';
$password = '';

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