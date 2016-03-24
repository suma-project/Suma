<?php

require_once 'models/ActivityModel.php';

class ActivityGroupModel
{
    private $_db;
    private $_metadata;
    private $_id;

    public function __construct($id)
    {
        $this->_db = Globals::getDBConn();
        $select = $this->_db->select()
            ->from('activity_group')
            ->where('id = '.$id);
        $row = $select->query()->fetch();

        if (empty($row))
        {
            Globals::getLog()->err('NONEXISTENT ACTIVITY GROUP - ActivityGroupModel id: '.$id);
            throw new Exception('Activity Group object not found in database with id ' . $id);
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
                ->from('activity_group')
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
        if (isset($this->_id))
        {
            $select = $this->_db->select()
                ->from(array('a' => 'activity'), array('id'))
                ->join(array('ag' => 'activity_group'), 'a.fk_activity_group = ag.id', array())
                ->where('ag.id = '.$this->_id);

            if ($filterDisabled)
            {
                $select->where('a.enabled = 1');
            }

            $select->order('a.rank ASC');
            $rows = $select->query()->fetchAll();

            $activities = array();
            foreach($rows as $row)
            {
                $activities[] = new ActivityModel($row['id']);
            }

            return $activities;
        }
    }

    public function numberOfActivities($filterDisabled = true) {
        $select = $this->_db->select()
        ->from(array('a' => 'activity'), array('id'))
        ->join(array('ag' => 'activity_group'), 'a.fk_activity_group = ag.id', array())
        ->where('ag.id = '.$this->_id);

        if ($filterDisabled)
        {
            $select->where('a.enabled = 1');
        }

        $rows = $select->query()->fetchAll();

        if (empty($rows)) {
            $actCount = 0;
        } else {
            $actCount = count($rows);
        }

        return $actCount;
    }

    public function update($data)
    {
        $hash = array('title'        =>  $data['title'],
                      'rank'         =>  $data['rank'],
                      'description'  =>  $data['desc'],
                      'required'     =>  (int)$data['required'],
                      'allowMulti'   =>  (int)$data['allowMulti'],
                      'sticky'       =>  (int)$data['sticky']);

        $this->_db->update('activity_group', $hash, 'id = '.$this->_id);
        Globals::getLog()->info('ACTIVITY GROUP UPDATED - id: '.$this->_id.', title: '.$data['title']);
        $this->jettisonMetadata();
    }


    // ------ PRIVATE FUNCTIONS ------


    private function jettisonMetadata()
    {
        $this->_metadata = null;
    }


    // ------ STATIC FUNCTIONS ------


    public static function create($data)
    {
        $db = Globals::getDBConn();

        $hash = array('title'          =>  isset($data['title']) ? $data['title'] : 'Default',
                      'rank'           =>  isset($data['rank']) ? $data['rank'] : 1,
                      'description'    =>  isset($data['descr']) ? $data['descr'] : null,
                      'required'       =>  isset($data['required']) ? (int)$data['required'] : 0,
                      'allowMulti'     =>  isset($data['allowMulti']) ? (int)$data['allowMulti'] : 1,
                      'sticky'         =>  isset($data['sticky']) ? (int)$data['sticky'] : 0,
                      'fk_initiative'  =>  $data['init']);

        $select = $db->select()
            ->from('activity_group')
            ->where('fk_initiative = '.$hash['fk_initiative'].' AND LOWER(title) = '.$db->quote(strtolower($hash['title'])));
        $existingActivityGroup = $select->query()->fetch();

        if (empty($existingActivityGroup)) {
            $db->insert('activity_group', $hash);
            $actGrpId = $db->lastInsertId();
            Globals::getLog()->info('ACTIVITY GROUP CREATED - id: '.$actGrpId.', title: '.$data['title'].', init: '.$data['init']);
        } else {
            $errStr = 'DUPLICATE ACTIVITY GROUP CREATION DENIED - title: '.$data['title'];
            Globals::getLog()->warn($errStr);
            throw new Exception($errStr);
        }

        return $actGrpId;
    }

}
