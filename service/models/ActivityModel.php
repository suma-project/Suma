<?php

require_once 'models/ActivityGroupModel.php';

class ActivityModel
{
    private $_db;
    private $_metadata;
    private $_id;

    public function __construct($id)
    {
        $this->_db = Globals::getDBConn();
        $select = $this->_db->select()
            ->from('activity')
            ->where('id = '.$id);
        $row = $select->query()->fetch();

        if (empty($row))
        {
            Globals::getLog()->err('NONEXISTENT ACTIVITY - ActivityModel id: '.$id);
            throw new Exception('Activity object not found in database with id ' . $id);
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
                ->from('activity')
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

    public function getActivityGroup()
    {
        return new ActivityGroupModel($this->getMetadata('fk_activity_group'));
    }

    public function update($data)
    {
        $hash = array('title'             =>  isset($data['title']) ? $data['title'] : $this->getMetadata('title'),
                      'enabled'           =>  (isset($data['enabled']) && is_bool($data['enabled'])) ? $data['enabled'] : $this->getMetadata('enabled'),
                      'fk_activity_group' =>  isset($data['group']) ? $data['group'] : $this->getMetadata('fk_activity_group'),
                      'description'       =>  isset($data['desc']) ? $data['desc'] : $this->getMetadata('desc'),
                      'rank'              =>  isset($data['rank']) ? $data['rank'] : $this->getMetadata('rank'));

        $this->_db->update('activity', $hash, 'id = '.$this->_id);
        $this->jettisonMetadata();
    }

    public function enable()
    {
        $data = array('enabled'  =>  true);
        $this->_db->update('activity', $data, 'id = '.$this->_id);
        Globals::getLog()->info('ACTIVITY ENABLED - id: '.$this->_id.', init: '.$this->getMetadata('fk_initiative'));
        $this->jettisonMetadata();
    }

    public function disable()
    {
        $data = array('enabled'  =>  false);
        $this->_db->update('activity', $data, 'id = '.$this->_id);
        Globals::getLog()->info('ACTIVITY DISABLED - id: '.$this->_id.', init: '.$this->getMetadata('fk_initiative'));
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
        if ((isset($data['group']) && is_numeric($data['group'])) && (isset($data['title']) && strlen($data['title']) > 0)) {
            $select = $db->select()
                ->from('activity')
                ->where('fk_activity_group = '.$data['group'].' AND LOWER(title) = '.$db->quote(strtolower($data['title'])));
            $existingActivity = $select->query()->fetch();

            if (empty($existingActivity)) {
                $hash = array(
                    'title'             =>  $data['title'],
                    'enabled'           =>  isset($data['enabled']) ? $data['enabled'] : false,
                    'fk_activity_group' =>  $data['group'],
                    'description'       =>  isset($data['desc']) ? $data['desc'] : null,
                    'rank'              =>  isset($data['rank']) ? $data['rank'] : null
                    );

                $db->insert('activity', $hash);
                $actId = $db->lastInsertId();
                Globals::getLog()->info('ACTIVITY CREATED - id: '.$actId.', title: '.$data['title'].', group: '.$data['group']);
                return $actId;
            }
            else {
                $errStr = 'DUPLICATE ACTIVITY CREATION DENIED - title: '.$data['title'].', group: '.$data['group'];
                Globals::getLog()->warn($errStr);
                throw new Exception($errStr);
            }
        } else {
            $errStr = 'MINIMUM METADATA FOR NEW ACTIVITY (ACTIVITY GROUP AND TITLE) not provided';
            Globals::getLog()->warn($errStr);
            throw new Exception($errStr);
        }

        return FALSE;
    }

    public static function updateActivitiesArray($activities, $initID=null)
    {
        if (!$initID || !$activities || !is_array($activities) || !is_numeric($initID)) {
            throw new Exception('Invalid data structure');
        }

        try {
            $db = Globals::getDBConn();
            $db->beginTransaction();
            foreach($activities as $actGroupKey => $activityGroup) {

                if ((isset($activityGroup['title']) && strlen($activityGroup['title']) > 0) && isset($activityGroup['id'])
                    && isset($activityGroup['desc'])  && (isset($activityGroup['required']) && is_bool($activityGroup['required']))
                    && (isset($activityGroup['allowMulti']) && is_bool($activityGroup['allowMulti'])))
                {
                    $actGroupData = Array(
                        'title'    => $activityGroup['title'],
                        'desc'     => $activityGroup['desc'],
                        'rank'     => $actGroupKey,
                        'required' => $activityGroup['required'],
                        'allowMulti' => $activityGroup['allowMulti']
                        );

                    if (is_numeric($activityGroup['id']))
                    {
                        $activityGroupObj = new ActivityGroupModel($activityGroup['id']);

                        if (!$activityGroupObj) {
                            throw new Exception('Failed to retrieve activity group');
                        }

                        $activityGroupObj->update($actGroupData);
                        $activityGroupID = $activityGroupObj->getMetadata('id');
                    } else if ('new-act-group' === $activityGroup['id'])
                    {
                        $actGroupData['init'] = $initID;
                        $activityGroupID = ActivityGroupModel::create($actGroupData);

                        if (false === $activityGroupID) {
                            throw new Exception('Failed to create activity group');
                        }
                    } else {
                        throw new Exception('Invalid activity group ID');
                    }

                    foreach($activityGroup['activities'] as $actKey => $activity)
                    {
                        if ((isset($activity['title']) && strlen($activity['title']) > 0) && isset($activity['id'])
                            && isset($activity['desc']) && (isset($activity['enabled']) && is_bool($activity['enabled'])))
                        {
                            $actData = Array(
                                'title'   => $activity['title'],
                                'desc'    => $activity['desc'],
                                'enabled' => $activity['enabled'],
                                'group'   => $activityGroupID,
                                'rank'    => $actKey
                                );


                            if (is_numeric($activity['id']))
                            {
                                $activityObj = new ActivityModel($activity['id']);

                                if (!$activityObj) {
                                    throw new Exception('Failed to retrieve activity');
                                }

                                $activityObj->update($actData);
                            } else if ('new-act' === $activity['id'])
                            {
                            //$actData['init'] = $initID;
                                $activityID = self::create($actData);

                                if (false === $activityID) {
                                    throw new Exception('Failed to create activity');
                                }
                            } else {
                                throw new Exception('Invalid activity ID');
                            }
                        } else {
                            throw new Exception('Missing required activity fields (title, ID, enabled, or desc)');
                        }
                    }
                } else {
                    throw new Exception('Missing required activity group fields (title, ID, required, allowMulti, or desc)');
                }
            }
            $db->commit();
        } catch (Exception $e) {
            $db->rollBack();
            throw $e;
        }
        return true;
    }

}
