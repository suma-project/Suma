<?php 

class Server_IO
{
    private static $_serverUrl = 'http://<host>/query';
    
    static function getData($params, $mode)
    {
        if (! isset($params['id']) || ! is_numeric($params['id']))
        {
            throw new Exception('Must provide numeric Initiative ID');
        }
        
        if ($mode != 'sessions' && $mode != 'counts')
        {
            throw new Exception('Must provide valid mode (sessions or counts)');
        }
        
        self::$_serverUrl .= ($mode == 'sessions') ? '/sessions' : '/counts';
        
        foreach($params as $key => $val)
        {
            if (($key == 'sdate' || $key == 'edate' || $key == 'stime' || $key == 'etime') && !empty($val) && !is_numeric($val))
            {
                throw new Exception('Supplied dates and times must be all numeric');
            }
            self::$_serverUrl .= "/$key/$val";
        }
        
        return self::sendRequest();
    }
    
    static function getInitiatives()
    {
        self::$_serverUrl .= '/initiatives';
        return self::sendRequest();
    }
    
    private function sendRequest()
    {
        $ch = curl_init(self::$_serverUrl);
    
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 20);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        
        $response = curl_exec($ch);
        
        $curlInfo = curl_getinfo($ch);
        curl_close($ch);
        
        if ($curlInfo['http_code'] != 200) 
        {
            throw new Exception('HTTP ERROR CODE: ' . $curlInfo['http_code']);
        }
        else
        {
            $results = json_decode($response, true);
            
            if ($results)
            {
                return $results;
            }
            else
            {
                throw new Exception('JSON Parse Error');
            }
        }
    }
    
}
