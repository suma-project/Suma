<?php

class SyncModel
{
    private $_error;

    public function commit($json)
    {
        $db = Globals::getDBConn();
        $db->insert('transaction', array('start' => date('Y-m-d H:i:s')));
        $transId = $db->lastInsertId();
        $transHandle = null;

        Globals::getLog()->debug('TRANSACTION START - id:'.$transId.' >>>');
        $decoded = json_decode($json, true);

        if ($decoded == false)
        {
            $this->setError('MALFORMED JSON - ' . $json, $transId);
            return false;
        }
        else
        {
            Globals::getLog()->info('JSON INPUT - ' . $json);
        }

        $device = $decoded['device'];
        $version = $decoded['version'];
        $sessions = $decoded['sessions'];

        if (is_null($device) || is_null($version) || is_null($sessions))
        {
            $this->setError("NULL JSON ELEMENT(S) - Device:$device, Version:$version, Sessions:$sessions", $transId);
            return false;
        }

        $db->update('transaction', array('device' => $device, 'version' => $version), 'id = '.$transId);

        foreach($sessions as $session)
        {
            try
            {
                $initId = $session['initiativeID'];
                $start = $this->convertTime($session['startTime']);
                $end = $this->convertTime($session['endTime']);
                $counts = $session['counts'];

                if (is_null($start) || is_null($end) || is_null($counts) || is_null($initId))
                {
                    throw new Exception("Session with NULL value(s) - InitID:$initId, Start:$start, End:$end, Counts:".$counts);
                }

                if ($this->initiativeCheck($initId) == false)
                {
                    Globals::getLog()->warn('SKIPPING SESSION WITH INVALID INITIATIVE ID - '.urldecode(http_build_query($session)));
                    continue;
                }

                $unique = $this->uniqueSessionCheck($start, $end, count($counts), $initId);

                if ($unique == false)
                {
                    Globals::getLog()->warn('SKIPPING DUPLICATE SESSION - '.urldecode(http_build_query($session)));
                    continue;
                }

                if (isset($transHandle) == false)
                {
                    $transHandle = $db->beginTransaction();
                }

                $data = array('start'          => $start,
                              'end'            => $end,
                              'fk_initiative'  => $initId,
                              'fk_transaction' => $transId);

                $logLabel = '';
                if (isset($session['deleted']))
                {
                    $data['deleted'] = 1;
                    $logLabel = 'DELETED ';
                }

                $db->insert('session', $data);
                $sessId = $db->lastInsertId();
                Globals::getLog()->info($logLabel.'SESSION INSERT - id:'.$sessId);

                foreach ($counts as $count)
                {
                    $countTime = $this->convertTime($count['timestamp']);
                    $location = $count['location'];
                    $num = $count['number'];

                    $data = array('occurrence'  => $countTime,
                                  'number'      => $num,
                                  'fk_location' => $location,
                                  'fk_session'  => $sessId);

                    $db->insert('count', $data);
                    $countId = $db->lastInsertId();
                    Globals::getLog()->info('COUNT INSERT - id:'.$countId);

                    $activities = $count['activities'];
                    foreach($activities as $activity)
                    {
                        $data = array('fk_count' => $countId, 'fk_activity' => $activity);
                        $db->insert('count_activity_join', $data);
                        $activityId = $db->lastInsertId();
                        Globals::getLog()->info('C_A_JOIN INSERT - id:'.$activityId);
                    }
                }

                $db->commit();
                unset($transHandle);
                Globals::getLog()->info($logLabel.'SESSION COMMITTED - id:'.$sessId);

            }
            catch (Exception $e)
            {
                Globals::getLog()->err('SKIPPING INVALID/MALFORMED SESSION - '.$e->getMessage());

                // Test if in the middle of a database (internal) transaction.
                if (isset($transHandle))
                {
                    $db->rollBack();
                    Globals::getLog()->warn('SESSION ROLLBACK - id:'.$sessId.', '.$e->getMessage());
                }
            }

        }

        $db->update('transaction', array('end' => date('Y-m-d H:i:s')), 'id = '.$transId);
        Globals::getLog()->debug('TRANSACTION END - id:'.$transId.' <<<');

        return true;
    }

    private function initiativeCheck($initId)
    {
        $db = Globals::getDBConn();

        $select = $db->select()
            ->from('initiative')
            ->where('id = '.$initId);
        $result = $select->query()->fetch();

        if (empty($result))
        {
            return false;
        }
        else
        {
            return true;
        }
    }

    private function uniqueSessionCheck($start, $end, $counts, $initId)
    {
        $db = Globals::getDBConn();

        $select = $db->select()
            ->from('session')
            ->where('start = \''.$start.'\' AND end = \''.$end.'\' AND fk_initiative = '.$initId);
        $sessions = $select->query()->fetchAll();

        foreach($sessions as $session)
        {
            if (is_numeric($session['id']))
            {
                $select = $db->select()
                    ->from('count')
                    ->where('fk_session = '.$session['id']);

                if ($counts == count($select->query()->fetchAll()))
                {
                    return false;
                }
            }
        }

        return true;
    }

    private function convertTime($unixstamp)
    {
        if (isset($unixstamp))
        {
            if (strlen($unixstamp) == 13)
            {
                Globals::getLog()->warn('Assuming unix timestamp is in milliseconds: '.$unixstamp);
                return date('Y-m-d H:i:s', substr($unixstamp, 0, -3));
            }

            return date('Y-m-d H:i:s', $unixstamp);
        }

        return $unixstamp;
    }

    private function setError($error, $transId)
    {
        Globals::getLog()->err($error);
        Globals::getLog()->debug('TRANSACTION END - id:'.$transId.' <<<');
        $this->_error = $error;
    }

    public function getError()
    {
        return $this->_error;
    }

}
