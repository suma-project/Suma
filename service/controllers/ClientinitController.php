<?php

require_once 'BaseController.php';
require_once 'models/InitiativeModel.php';

class ClientinitController extends BaseController
{
    public function indexAction()
    {
        $initiatives = InitiativeModel::getAll(true);
        
        $array = array();
        foreach($initiatives as $init)
        {
            $array[] = array('initiativeId' => $init->getMetadata('id'), 'initiativeTitle' => $init->getMetadata('title'));
        }
        $this->view->json = json_encode($array);
    }
    
    public function loadAction()
    {
        $id = Zend_Filter::filterStatic($this->getRequest()->getParam('initiative'), 'StripTags');
        if (is_numeric($id))
        {
            $init = new InitiativeModel($id);
            $json = $init->getJSON();
            if (empty($json))
            {
                $this->view->error = 'Could not find requested Initiative';
                $this->render('error');
            }
            $this->view->json = $json;
        }
        else
        {
            $this->view->error = 'Initiative ID must be numeric';
            $this->render('error');
        }
    }
}

?>