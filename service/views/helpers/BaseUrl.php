<?php

class Zend_View_Helper_BaseUrl
{
  public function baseUrl()
  {
    return Zend_Controller_Front::getInstance()->getBaseUrl();
  }
}
