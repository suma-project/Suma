<?php 

class LocationModel
{
    private $_db;
    private $_metadata;
    private $_children;
    private $_parent;
    private $_id;

    public function __construct($id)
    {
        $this->_db = Globals::getDBConn();

        $select = $this->_db->select()
            ->from('location')
            ->where('id = '.$id);
        $row = $select->query()->fetch();

        if (empty($row))
        {
            Globals::getLog()->err('NONEXISTENT LOCATION - LocationModel id: '.$id);
            throw new Exception('Location object not found in database with id ' . $id);
        }

        //TODO: Re-enable caching, it is disabled for now.
        /*
        foreach($row as $key => $value)
        {
            $this->_metadata[$key] = $value;
        }
        */
        
        $this->_id = $id;
    }

    public function getMetadata($key = null)
    {
        //TODO: Re-enable caching, it is disabled for now.
        $metadata = array();
        
        if (empty($this->_metadata))
        {
            $select = $this->_db->select()
                ->from('location')
                ->where('id = '.$this->_id);
            $row = $select->query()->fetch();

            foreach($row as $index => $val)
            {
                //$this->_metadata[$index] = $val;
                $metadata[$index] = $val;
            }
        }
        
        if ($key == null)
        {
            //return $this->_metadata;
            return $metadata;
        }
        else 
        {
            //if (isset($this->_metadata[$key]))
            if (isset($metadata[$key]))
            {
                //return $this->_metadata[$key];
                return $metadata[$key];
            }
            else
            {
                return '';
            }
        }
    }    

    public function getChildren($filterDisabled = true)
    {
        //TODO: Re-enable caching, it is disabled for now.
        $children = array();
        
        if (isset($this->_children))
        {
            return $this->_children;
        }
        else
        {
            $select = $this->_db->select()
                ->from('location')
                ->where('fk_parent = ' . $this->_id);

            if (true === $filterDisabled)
            {
                $select->where('enabled = true');
            }

            $select->order('rank ASC');

            $rows = $select->query()->fetchAll();

            foreach($rows as $row)
            {
                //$this->_children[] = new LocationModel($row['id']);
                $children[] = new LocationModel($row['id']);
            }

            //return $this->_children;
            return $children;
        }
    }

    public function getParent()
    {
        //TODO: Re-enable caching, it is disabled for now.
        $parent = $this->getMetadata('fk_parent');
        
        if (isset($this->_parent))
        {
            return $this->_parent;
        }
        else if (isset($parent))
        {
            //$this->_parent = new LocationModel($this->_metadata['fk_parent']);
            //return $this->_parent;
            return new LocationModel($parent);
        }
        else
        {
            return null;
        }
    }

    public function update($data)
    {
        // FIXME: make sure all of the fields are passed in
        $hash = array('title'       =>  $data['title'],
                      'enabled'     =>  $data['enabled'],
                      'fk_parent'   =>  $data['fk_parent'],
                      'description' =>  $data['description'],
                      'rank'        =>  $data['rank']);

        $this->_db->update('location', $hash, 'id = '.$this->_id);
    }    

    public function enable()
    {
        $data = array('enabled'  =>  true);
        $this->_db->update('location', $data, 'id = '.$this->_id);
        Globals::getLog()->info('LOCATION ENABLED - id: '.$this->_id);
    }

    public function disable()
    {
        $data = array('enabled'  =>  false);
        $this->_db->update('location', $data, 'id = '.$this->_id);
        Globals::getLog()->info('LOCATION DISABLED - id: '.$this->_id);
    }    


    // ------ STATIC FUNCTIONS ------

    public static function create($data)
    {
        $db = Globals::getDBConn();

        $hash =     array('title'       =>  isset($data['title']) ? $data['title']: '',
                          'enabled'     =>  isset($data['enabled']) ? $data['enabled'] : true,
                          'fk_parent'   =>  isset($data['fk_parent']) ? $data['fk_parent'] : null,
                          'description' =>  isset($data['description']) ? $data['description'] : '',
                          'rank'        =>  isset($data['rank']) ? $data['rank'] : 0);

        $db->insert('location', $hash);
        $locId = $db->lastInsertId();
        Globals::getLog()->info('LOCATION CREATED - id: '.$locId.', title: '.$data['title']);
        return $locId;
    }    

    public static function walkTree($root)
    {
        if (is_numeric($root))
        {
            $db = Globals::getDBConn();
            $select = $db->select()
                ->from('location')
                ->where('enabled = true AND fk_parent = ' . $root);
            $locations = $select->query()->fetchAll(); 

            if (empty($locations))
            {
                return null;
            }

            $s = '';
            $size = count($locations);
            foreach($locations as $key=>$location)
            {
                if ($children = self::walkTree($location['id']))
                {
                    $s .= $location['id'] . ',' . $children;
                }
                else 
                {
                    $s .= $location['id'];
                }
                if ($key+1 < $size)
                {
                    $s .= ',';
                }             
            }

            return $s;
        }
    }

    public static function getLocTreeRoots($filterDisabled = false)
    {
        $db = Globals::getDBConn();
        $select = $db->select()->from('location');

        if ($filterDisabled)
        {
            $select->where('enabled = true AND fk_parent IS NULL');
        }
        else
        {
            $select->where('fk_parent IS NULL');
        }

        $rows = $select->query()->fetchAll();

        $roots = array();
        foreach($rows as $row)
        {
            $roots[] = new LocationModel($row['id']);
        }

        return $roots;
    }

    public static function validateLocTree($locTree)
    {
        $retValue = false;
        if (isset($locTree['id']) && (is_numeric($locTree['id']) 
            || ($locTree['id'] === 'new-loc')))
        {
            if (!empty($locTree['title']) 
                && isset($locTree['description']) 
                && (isset($locTree['enabled']) && is_bool($locTree['enabled'])))
            {
                $retValue = true;

                if (isset($locTree['children']) && is_array($locTree['children'])) 
                {
                    foreach($locTree['children'] as $childLoc)
                    {
                        if (!self::validateLocTree($childLoc)) 
                        {
                            $retValue = false;
                        }
                    }
                }
            }
        }
        return $retValue;
    }

    public static function updateLocTree($locTree, $parentID = null, $rank = 0)
    {
        // FIXME: redundant validation
        if (self::validateLocTree($locTree)) 
        {
            $locDataArr = Array('fk_parent'   => $parentID,
                                'title'       => $locTree['title'],
                                'description' => $locTree['description'],
                                'enabled'     => $locTree['enabled'],
                                'rank'        => $rank);

            if (is_numeric($locTree['id']))
            {
                $loc = new LocationModel($locTree['id']);
                if ($loc) {
                    $loc->update($locDataArr);
                } else {
                    return false;
                }
            } elseif ('new-loc' === $locTree['id']) {
                $locID = self::create($locDataArr);
                $loc = new LocationModel($locID);
                if (!$loc) {
                    throw new Exception("Unable to create new location");
                }
            } else {
                throw new Exception('Invalid location ID: ' . $locTree['id']);
            }

            if (isset($locTree['children']) && is_array($locTree['children'])) 
            {
                foreach($locTree['children'] as $locKey => $childLoc)
                {
                    $updateRes = self::updateLocTree($childLoc, $loc->getMetadata('id'), $locKey);
                }
            }
        } else {
            throw new Exception('Invalid location tree');
        }

        return true;
    }

}
