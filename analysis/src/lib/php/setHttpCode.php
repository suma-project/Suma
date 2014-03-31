<?php

function setHttpCode ($code) {
    if ($code === 500) {
        return "HTTP/1.0 500 Internal Server Error";
    }
    elseif ($code === 400) {
        return "HTTP/1.0 400 Bad Request";
    }
    elseif ($code === 401) {
        return "HTTP/1.0 401 Unauthorized";
    }
    elseif ($code === 403) {
        return "HTTP/1.0 403 Forbidden";
    }
    elseif ($code === 404) {
        return "HTTP/1.0 404 Not Found";
    }
    elseif ($code === 408) {
        return "HTTP/1.0 408 Request Timeout";
    }
    elseif ($code === 501) {
        return "HTTP/1.0 501 Not Implemented";
    }
    elseif ($code === 502) {
        return "HTTP/1.0 502 Bad Gateway";
    }
    elseif ($code === 503) {
        return "HTTP/1.0 503 Service Unavailable";
    }
    elseif ($code === 504) {
        return "HTTP/1.0 500 Gateway Timeout";
    }
    else
    {
        return "HTTP/1.0 500 Internal Server Error";
    }
}