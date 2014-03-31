<?php

require_once 'src/lib/php/setHttpCode.php';

class test extends PHPUnit_Framework_TestCase {


  public function test_500_code() {
    $this->assertEquals(setHttpCode(500), "HTTP/1.0 500 Internal Server Error");
  }

  public function test_400_code() {
    $this->assertEquals(setHttpCode(400), "HTTP/1.0 400 Bad Request");
  }

  public function test_401_code() {
    $this->assertEquals(setHttpCode(401), "HTTP/1.0 401 Unauthorized");
  }

  public function test_403_code() {
    $this->assertEquals(setHttpCode(403), "HTTP/1.0 403 Forbidden");
  }

  public function test_404_code() {
    $this->assertEquals(setHttpCode(404), "HTTP/1.0 404 Not Found");
  }

  public function test_408_code() {
    $this->assertEquals(setHttpCode(408), "HTTP/1.0 408 Request Timeout");
  }

  public function test_501_code() {
    $this->assertEquals(setHttpCode(501), "HTTP/1.0 501 Not Implemented");
  }

  public function test_502_code() {
    $this->assertEquals(setHttpCode(502), "HTTP/1.0 502 Bad Gateway");
  }

  public function test_503_code() {
    $this->assertEquals(setHttpCode(503), "HTTP/1.0 503 Service Unavailable");
  }

  public function test_504_code() {
    $this->assertEquals(setHttpCode(504), "HTTP/1.0 500 Gateway Timeout");
  }

  public function test_else_code() {
    $this->assertEquals(setHttpCode(600), "HTTP/1.0 500 Internal Server Error");
  }
}