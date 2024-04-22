<?php

try {
    $url = $_GET['url'];

    $ch = curl_init(); // はじめ

    //オプション
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_HEADER, true);

    $response =  curl_exec($ch);

    // copy header
    $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $headers = substr($response, 0, $header_size);
    $body = substr($response, $header_size);

    $lines = explode("\n", $headers);
    foreach ($lines as $line) {
        header($line);
    }

    curl_close($ch); //終了

    if ($response === false) {
        // response code 500
        http_response_code(500);
        echo "error";
    } else {

        echo $body;
    }
} catch (\Throwable $th) {
    http_response_code(500);
}
