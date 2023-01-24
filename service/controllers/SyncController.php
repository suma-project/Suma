<?php

require_once 'BaseController.php';
require_once 'models/SyncModel.php';


class SyncController extends BaseController
{
    public function indexAction()
    {
        $db = Globals::getDBConn();
        $json = Zend_Filter::filterStatic($this->getRequest()->getParam('json'), 'StripTags');

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
