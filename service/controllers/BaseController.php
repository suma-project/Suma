<?php 

Zend_Loader::loadClass('Zend_Auth');
Zend_Loader::loadClass('Zend_Auth_Adapter_Interface');
Zend_Loader::loadClass('Zend_Json');

class BaseController extends Zend_Controller_Action
{
}

class My_Auth_Adapter implements Zend_Auth_Adapter_Interface
{
  protected $_username;
  protected $_password;
  
  public function __construct($user, $pass)
  {
    $this->_username = $user;
    $this->_password = $pass;
  }
  
  public function authenticate()
  {
    $adminuser = Globals::getConfig()->sumaserver->admin->user;
    $adminpass = Globals::getConfig()->sumaserver->admin->pass;
    
    if($adminuser === $this->_username && $adminpass === $this->_password)
    {
      return new Zend_Auth_Result(Zend_Auth_Result::SUCCESS, "admin");
    }
    else
    {
      return new Zend_Auth_Result(Zend_Auth_Result::FAILURE, "admin");
    }
  }
}