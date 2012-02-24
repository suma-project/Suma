<?php 

require_once 'BaseController.php';
require_once 'models/SyncModel.php';


class SyncController extends BaseController
{
    public function indexAction()
    {
        $db = Globals::getDBConn();
        $json = Zend_Filter::filterStatic($this->getRequest()->getParam('json'), 'StripTags');
        
        // If the server's magic quotes setting is enabled
        if (get_magic_quotes_gpc())
        {
            $json = Zend_Filter::filterStatic(stripslashes($this->getRequest()->getParam('json')), 'StripTags');
        }
        
        $sync = new SyncModel();
        
        if ($sync->commit($json))
        {
            $this->view->result = true;
        }
        else
        {
            $this->view->result = false;
            $this->view->error = $sync->getError();
        }
    }
    
}
