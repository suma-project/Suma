<?php 

require_once 'models/LocationModel.php';
require_once 'models/SessionModel.php';
require_once 'models/ActivityModel.php';

class InitiativeModel
{
    private $_db;
    private $_rootLocation;
    private $_sessions = array();
    private $_activities = array();
    private $_metadata;
    private $_id;
    
    public function __construct($id)
    {
        $this->_db = Globals::getDBConn();
        $select = $this->_db->select()
            ->from('initiative')
            ->where('id = '.$id);
        $row = $select->query()->fetch();
        
        if (empty($row))
        {
            Globals::getLog()->err('NONEXISTENT INITIATIVE - InitiativeModel id: '.$id);
            throw new Exception('Initiative object not found in database with id ' . $id);
        }
            
        foreach ($row as $key => $value)
        {
            $this->_metadata[$key] = $value;
        }
        
        $this->_id = $id;
    }

    public function getMetadata($key = null)
    {
        if (empty($this->_metadata))
        {
            $select = $this->_db->select()
                ->from('initiative')
                ->where('id = '.$this->_id);
            $row = $select->query()->fetch();
            
            foreach ($row as $index => $val)
            {
                $this->_metadata[$index] = $val;
            }
        }
        
        if ($key == null)
        {
            return $this->_metadata;
        }
        else 
        {
            if (isset($this->_metadata[$key]))
            {
                return $this->_metadata[$key];
            }
            else
            {
                return '';
            }
        }
    }    
    
    public function getActivities($filterDisabled = true)
    {
        if (isset($this->_activities) && ! empty($this->_activities))
        {
            return $this->_activities;
        } 
        else if (isset($this->_id))
        {
            $select = $this->_db->select()
                ->from('activity')
                ->where('fk_initiative = '.$this->_id);

            if ($filterDisabled)
            {
                $select->where('enabled = true');
            }

            $select->order('rank ASC');

            $rows = $select->query()->fetchAll();
            
            foreach($rows as $row)
            {
                $this->_activities[] = new ActivityModel($row['id']);
            }
            
            return $this->_activities;
        }    
    }
    
    public function getSessions()
    {
        if (isset($this->_sessions) && ! empty($this->_sessions))
        {
            return $this->_sessions;
        }
        else if (isset($this->_id))
        {
            $select = $this->_db->select()
                ->from('session')
                ->where('deleted = false AND fk_initiative = '.$this->_id);
            $rows = $select->query()->fetchAll();
            
            foreach($rows as $row)
            {
                $this->_sessions[] = new SessionModel($row['id']);
            }
            
            return $this->_sessions;
        }
    }
    
    public function getRootLocation()
    {
        $root = $this->getMetadata('fk_root_location');
        if (isset($this->_rootLocation) && ! empty($this->_rootLocation))
        {
            return $this->_rootLocation;
        }
        else if (isset($root))
        {
            $this->_rootLocation = new LocationModel($root);
            return $this->_rootLocation;            
        }
    }
    
    public function getJSON()
    {
        $rootLoc = $this->getRootLocation();
        
        if (! isset($rootLoc))
        {
            return json_encode(array());
        }
        
        $rootMeta = $rootLoc->getMetadata();
        
        $rootId = $rootMeta['id'];
        $rootTitle = $rootMeta['title'];
        $locations = $this->walkLocTree($rootMeta['id']);
        $activities = $this->fetchActivities();
        $activityGroups = $this->fetchActivityGroups();
        
        $array = array('initiativeId'    => (int)$this->_id,
                       'initiativeTitle' => $this->getMetadata('title'),
                       'locations'       => array('id' => (int)$rootId, 'title' => $rootTitle, 'children' => $locations),
                       'activities'      => $activities,
                       'activityGroups'  => $activityGroups);
        
        return json_encode($array);
    }
    
    public function enable()
    {
        $data = array('enabled'  =>  true);
        $this->_db->update('initiative', $data, 'id = '.$this->_id);
        Globals::getLog()->info('INITIATIVE ENABLED - id: '.$this->_id.', title: '.$this->getMetadata('title'));
        $this->jettisonMetadata();
    }
    
    public function disable()
    {
        $data = array('enabled'  =>  false);
        $this->_db->update('initiative', $data, 'id = '.$this->_id);
        Globals::getLog()->info('INITIATIVE DISABLED - id: '.$this->_id.', title: '.$this->getMetadata('title'));
        $this->jettisonMetadata();
    }
    
    public function update($data)
    {
        $hash = array('title'       =>  $data['title'],
                      'description' =>  $data['description']);
        $this->_db->update('initiative', $hash, 'id = '.$this->_id);
        Globals::getLog()->info('INITIATIVE UPDATED - id: '.$this->_id.', title: '.$this->getMetadata('title'));
        $this->jettisonMetadata();
    }
    
    public function setRoot($rootId)
    {
        $select = $this->_db->select()
            ->from('location')
            ->where('fk_parent IS NULL AND id = '.$rootId);
        $treeExist = $select->query()->fetch();
        
        if ($treeExist)
        {
            $data = array('fk_root_location' => $rootId);
            $this->_db->update('initiative', $data, 'id = '.$this->_id);
            Globals::getLog()->info('INITIATIVE ROOT SET - id: '.$this->_id.', title: '.$this->getMetadata('title').', root_id: '.$rootId);
            $this->jettisonMetadata();
        }
        else
        {
            Globals::getLog()->warn('CANNOT SET INITIATIVE ROOT, LOCATION DOES NOT EXIST - init_id: '.$this->_id.', title: '.$this->getMetadata('title').', root_id: '.$rootId);
        }
    }
    
    
    // ------ PRIVATE FUNCTIONS ------
    
    private function walkLocTree($parentId)
    {
        $select = $this->_db->select()
            ->from('location')
            ->where('enabled = true AND fk_parent = ' . $parentId)
            ->order('rank ASC');
        $results = $select->query()->fetchAll();
        
        if (empty($results))
        {
           return null;
        }
        
        $array = array();
        foreach($results as $result)
        {
            if ($children = $this->walkLocTree($result['id']))
            {
                $array[] = array('id' => (int)$result['id'], 'title' => $result['title'], 'children' => $children);
            }
            else 
            {
                $array[] = array('id' => (int)$result['id'], 'title' => $result['title']);
            }           
        }
        
        return $array;
    }
    
    private function fetchActivities()
    {
        $array = array();
        foreach($this->getActivities() as $activity)
        {
            $meta = $activity->getMetaData();
            $group = $activity->getActivityGroup();
            $array[] = array('id'            => (int)$meta['id'], 
                             'title'         => $meta['title'],
                             'groupId'       => (int)$group->getMetadata('id'));
        }
        
        return $array;
    }
    
    private function fetchActivityGroups()
    {
        $array = array();
        $groupsHash = array();
        
        foreach($this->getActivities() as $activity)
        {
            $groupsHash[(int)$activity->getMetadata('fk_activity_group')] = null;
        }
        
        foreach($groupsHash as $key => $val)
        {
            $group = new ActivityGroupModel($key);
            $array[] = array('id'       => (int)$group->getMetadata('id'), 
                             'title'    => $group->getMetadata('title'),
                             'rank'     => (int)$group->getMetadata('rank'),
                             'required' => ($group->getMetadata('required')) ? 'true' : 'false');
        }
        
        return $array;
    }
    
    private function jettisonMetadata()
    {
        $this->_metadata = null;
    }

    
    // ------ STATIC FUNCTIONS ------

    public static function create($data)
    {
        $db = Globals::getDBConn();
        
        $select = $db->select()
            ->from('initiative')
            ->where('LOWER(title) = '. $db->quote(strtolower($data['title'])));
        $row = $select->query()->fetch();
        
        if (empty($row))
        {
            $hash =     array('title'       =>  $data['title'],
                              'enabled'     =>  false,
                              'description' =>  $data['description']);
            
            $db->insert('initiative', $hash);
            $initId = $db->lastInsertId();
            Globals::getLog()->info('INITIATIVE CREATED - id: '.$initId.', title: '.$data['title']);
            return $initId;
        }
        else
        {
            Globals::getLog()->warn('DUPLICATE INITIATIVE CREATION DENIED - title: '.$data['title']);
            throw new Exception('Initiative already exists with the title "' . $data['title'].'"');
        }
    }
    
    public static function getAll($filterDisabled = false)
    {
        $db = Globals::getDBConn();
        $select = $db->select()
            ->from('initiative');
            if ($filterDisabled)
            {
                $select->where('enabled = true');
            }
            
        $rows = $select->query()->fetchAll();
        
        $inits = array();
        foreach($rows as $row)
        {
            $inits[] = new InitiativeModel($row['id']);
        }
        
        return $inits;
    }    
    
}
