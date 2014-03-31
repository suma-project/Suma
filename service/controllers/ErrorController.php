<?php

require_once 'BaseController.php';

class ErrorController extends BaseController
{
    public function errorAction()
    {
        $errors = $this->_getParam('error_handler');

        $this->view->displayExceptions = Zend_Registry::isRegistered('sumaDisplayExceptions') ? Zend_Registry::get('sumaDisplayExceptions') : false;
        $this->view->exception = $errors->exception;

        switch ($errors->type) {
        case Zend_Controller_Plugin_ErrorHandler::EXCEPTION_NO_CONTROLLER:
        case Zend_Controller_Plugin_ErrorHandler::EXCEPTION_NO_ACTION:
            $this->getResponse()->setHttpResponseCode(404);
            $this->view->message = '404 Not found';
            break;
        default:
            $this->getResponse()->setHttpResponseCode(500);
            $this->view->message = '500 Application error';
            break;
        }
    }

    public function errorxhrAction()
    {

    }
}
