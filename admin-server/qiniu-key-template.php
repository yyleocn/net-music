<?php
$accessKey = '';
$secretKey = '';
$bucket = '';

$user = '';
$password = '';

function checkLogin($user_, $password_)
{
    global $user,$password;
    if ($user_ != $user) {
        return false;
    }
    if ($password_ != $password) {
        return false;
    }
    return true;
}