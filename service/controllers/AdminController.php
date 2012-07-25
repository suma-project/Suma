<?php 

require_once 'BaseController.php';
require_once 'models/SessionModel.php';
require_once 'models/InitiativeModel.php';
require_once 'models/LocationModel.php';
require_once 'models/ActivityModel.php';


class AdminController extends BaseController
{
    public function indexAction()
    {       
        //
    }
    
    public function loginAction()
    {
        
    }
    
    public function authenticateAction()
    {
      $user = Zend_Filter::filterStatic($this->getRequest()->getParam('username'), 'StripTags');
      $pass = Zend_Filter::filterStatic($this->getRequest()->getParam('password'), 'StripTags');
      
      $auth = Zend_Auth::getInstance();
      $result = $auth->authenticate(new My_Auth_Adapter($user, $pass));
      
      switch($result->getCode())
      {
        case Zend_Auth_Result::FAILURE:
          $this->_forward("login");
          Globals::getLog()->warn('FAILED ADMIN LOGIN');
          //echo "failure";
          break;
        case Zend_Auth_Result::SUCCESS:
          $this->_forward("index");
          //echo "success";
          break;
        default:
          $this->_forward("login");
          //echo "default";
          break;
      }
    }
    
    public function logoutAction()
    {
      Zend_Auth::getInstance()->clearIdentity();
      Zend_Session::destroy();
      $this->_forward('login');
    }
    
    public function errorAction()
    {
        
    }
    
    public function initiativesAction()
    {
        $this->view->initiatives = InitiativeModel::getAll();
        $this->view->roots = LocationModel::getLocTreeRoots();
    }
    
    public function initiativeloadAction()
    {
        $id = Zend_Filter::filterStatic($this->getRequest()->getParam('id'), 'StripTags');
        
        if (is_numeric($id))
        {
            $this->view->init = new InitiativeModel($id);
            $this->view->roots = LocationModel::getLocTreeRoots();
        }
    }
    
    public function createinitiativeAction()
    {
        $title = Zend_Filter::filterStatic($this->getRequest()->getParam('title'), 'StripTags');
        $description = Zend_Filter::filterStatic($this->getRequest()->getParam('desc'), 'StripTags');
        $locRootID = Zend_Filter::filterStatic($this->getRequest()->getParam('locRootID'), 'StripTags');

        if (get_magic_quotes_gpc())
        {
            $title = Zend_Filter::filterStatic(stripslashes($this->getRequest()->getParam('title')), 'StripTags');
            $description = Zend_Filter::filterStatic(stripslashes($this->getRequest()->getParam('desc')), 'StripTags');
            $locRootID = Zend_Filter::filterStatic(stripslashes($this->getRequest()->getParam('locRootID')), 'StripTags');
        }
        
        if (!empty($title) && is_numeric($locRootID))
        {
            $data['title'] = $title;
            $data['description'] = $description;
            
            try
            {
                $this->view->id = InitiativeModel::create($data);
            } catch (Exception $e){
                $this->view->error = $e->getMessage();
                $this->render('error');
                return false;               
            }
            
            $initModel = new InitiativeModel($this->view->id);
            $initModel->setRoot($locRootID);
        } else {
            $this->view->error = 'Title must not be empty and location root ID must be numeric';
            $this->render('error');
            return false;
        }
    }
    
    public function updateinitiativeAction()
    {
        $id = Zend_Filter::filterStatic($this->getRequest()->getParam('id'), 'StripTags');
        $title = Zend_Filter::filterStatic($this->getRequest()->getParam('title'), 'StripTags');
        $description = Zend_Filter::filterStatic($this->getRequest()->getParam('desc'), 'StripTags'); 
        
        if (is_numeric($id) && !empty($title))
        {
            $data['title'] = $title;
            $data['description'] = $description;
            
            $init = new InitiativeModel($id);
            $init->update($data);
        }
    }
    
    public function enableinitiativeAction()
    {
        $id = Zend_Filter::filterStatic($this->getRequest()->getParam('id'), 'StripTags');
        
        if (is_numeric($id))
        {
            $init = new InitiativeModel($id);
            $init->enable();
        }
    }
    
    public function disableinitiativeAction()
    {
        $id = Zend_Filter::filterStatic($this->getRequest()->getParam('id'), 'StripTags');
        
        if (is_numeric($id))
        {
            $init = new InitiativeModel($id);
            $init->disable();  
        }
    }
    
    public function setinitloctreeAction()
    {
        $id = Zend_Filter::filterStatic($this->getRequest()->getParam('id'), 'StripTags');
        $rootId = Zend_Filter::filterStatic($this->getRequest()->getParam('root'), 'StripTags');
        
        if (is_numeric($id) && is_numeric($rootId))
        {
            $initModel = new InitiativeModel($id);
            $initModel->setRoot($rootId);
        }
    }
    
    // public function createactivityAction()
    // {
    //     $init = Zend_Filter::filterStatic($this->getRequest()->getParam('init'), 'StripTags');
    //     $title = Zend_Filter::filterStatic($this->getRequest()->getParam('title'), 'StripTags');
    //     $desc = Zend_Filter::filterStatic($this->getRequest()->getParam('desc'), 'StripTags');
    //     $rank = Zend_Filter::filterStatic($this->getRequest()->getParam('rank'), 'StripTags');
    //     
    //     if (is_numeric($init) && !empty($title))
    //     {
    //         $data['init'] = $init;
    //         $data['title'] = $title;
    //         $data['desc'] = $desc;
    //         (isset($rank) && is_numeric($rank)) ? $data['rank'] = $rank : $data['rank'] = 0;
    //         $this->view->id = ActivityModel::create($data);
    //     }
    // }
    // 
    // public function updateactivityAction()
    // {
    //     $id = Zend_Filter::filterStatic($this->getRequest()->getParam('id'), 'StripTags');
    //     $title = Zend_Filter::filterStatic($this->getRequest()->getParam('title'), 'StripTags');
    //     $desc = Zend_Filter::filterStatic($this->getRequest()->getParam('desc'), 'StripTags');
    //     $rank = Zend_Filter::filterStatic($this->getRequest()->getParam('rank'), 'StripTags');
    //     
    //     if (! empty($title) && is_numeric($id))
    //     {
    //         $data['title'] = $title;
    //         $data['desc'] = $desc;
    //         (isset($rank) && is_numeric($rank)) ? $data['rank'] = $rank : $data['rank'] = 0;
    //         $activity = new ActivityModel($id);
    //         $activity->update($data);
    //     }
    // }

    public function updateactivitiesAction()
    {
        $activities = json_decode(Zend_Filter::filterStatic($this->getRequest()->getParam('activities'), 'StripTags'), true);
        $initID = Zend_Filter::filterStatic($this->getRequest()->getParam('init'), 'StripTags');

        if (!$activities || !is_numeric($initID))
        {
            $this->view->error = 'Problem with activities or init ID';
            $this->render('error');
            return false;
        }

        try {
            ActivityModel::updateActivitiesArray($activities, $initID);
        } catch (Exception $e) {
            $this->view->error = 'Error updating activities: ' . $e->getMessage();
            $this->render('error');
            return false;
        }
        return true;
    }
    
    public function enableactivityAction()
    {
        $id = Zend_Filter::filterStatic($this->getRequest()->getParam('id'), 'StripTags');
        
        if (is_numeric($id))
        {
            $activity = new ActivityModel($id);
            $activity->enable();
        }
    }

    public function disableactivityAction()
    {
        $id = Zend_Filter::filterStatic($this->getRequest()->getParam('id'), 'StripTags');
        
        if (is_numeric($id))
        {
            $activity = new ActivityModel($id);
            $activity->disable();             
        }
    }    
    
    public function locationsAction()
    {
        $this->view->roots = LocationModel::getLocTreeRoots();
    }
    
    public function locationloadAction()
    {
        $id = Zend_Filter::filterStatic($this->getRequest()->getParam('id'), 'StripTags');
        
        if (is_numeric($id))
        {
            $this->view->location = new LocationModel($id);
        }
    }
    
    public function createloctreeAction()
    {
        $title = Zend_Filter::filterStatic($this->getRequest()->getParam('title'), 'StripTags');
        $description = Zend_Filter::filterStatic($this->getRequest()->getParam('desc'), 'StripTags');

        if (get_magic_quotes_gpc())
        {
            $title = Zend_Filter::filterStatic(stripslashes($this->getRequest()->getParam('title')), 'StripTags');
            $description = Zend_Filter::filterStatic(stripslashes($this->getRequest()->getParam('desc')), 'StripTags');
        }
        
        if (!empty($title))
        {
            $data['title'] = $title;
            $data['description'] = $description;
            $this->view->id = LocationModel::create($data);
            // TODO: see if this fails...
            // if so, delete loc and throw an error
        } else {
            $this->view->error = 'Title must not be empty';
            $this->render('error');
            return false;
        }
    }
    
    public function updateloctreeAction()
    {
        $locTree = json_decode(Zend_Filter::filterStatic($this->getRequest()->getParam('loc_tree'), 'StripTags'), true);

        if (!$locTree) 
        {
            $this->view->error = 'Problem parsing tree';
            $this->render('error');
            return false;
        }

        if (!LocationModel::updateLocTree($locTree))
        {
            $this->view->error = 'Error updating location tree';
            $this->render('error');
            return false;
        }
        return true;
    }
    
    public function toggleloctreeAction()
    {
        // NOT TO BE IMPLEMENTED YET
    }
    
    public function sessionsAction()
    {
        $this->view->sessions = SessionModel::getAll(false);
    }
    
    public function sessionAction()
    {
        $id = Zend_Filter::filterStatic($this->getRequest()->getParam('id'), 'StripTags');
        
        if (is_numeric($id))
        {
            $session = new SessionModel($id);
            $init = $session->getInitiative();
    
            $rootLoc = $init->getRootLocation();
            $treeString = LocationModel::walkTree($rootLoc->getMetadata('id'));
            $treeArray = explode(",", $treeString);
            $locations = array();
            foreach($treeArray as $locId)
            {
                $locations[] = new LocationModel($locId);
            }        
            
            $this->view->locations = $locations;
            $this->view->session = $session;
            $this->view->init = $init;
        }
    }
    
    public function jsonimportAction()
    {
        
    }

    public function preDispatch()
    {
      $auth = Zend_Auth::getInstance();
      
      if(!$auth->hasIdentity())
      {
        if(! in_array($this->_request->getActionName(), array(
                    'login', 'authenticate'))
                ) {
                $this->_redirect('admin/login');
            }
        
      }
      else
      {
        //echo $auth->getIdentity();
      }
    }
   
}
