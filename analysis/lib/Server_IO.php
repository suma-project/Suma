<?php 

class Server_IO
{
    private static $_serverUrl = 'http://<host>/query';
    private static $_hasMore;
    private static $_offset;
    
    public function getData($params, $mode)
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
                throw new Exception('All supplied dates and times must be numeric');
            }
            self::$_serverUrl .= "/$key/$val";
        }
        
        return $this->sendRequest(self::$_serverUrl);
    }
    
    public function hasMore()
    {
        return self::$_hasMore;
    }
    
    public function next()
    {
        return $this->sendRequest(self::$_serverUrl.'/offset/'.self::$_offset);
    }
    
    
    // ------ PRIVATE FUNCTIONS ------    
    
    private function sendRequest($url)
    {
        $ch = curl_init($url);
    
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
                if (strtolower($results['status']['has more']) == 'true')
                {
                    self::$_hasMore = true;
                    self::$_offset = $results['status']['offset'];
                }
                else 
                {
                    self::$_hasMore = false;
                }
                
                return $results;
            }
            else
            {
                throw new Exception('JSON Parse Error');
            }
        }
    }
    
    
    // ------ STATIC FUNCTIONS ------    
    
    static function getInitiatives()
    {
        return self::sendRequest(self::$_serverUrl.'/initiatives');
    }    
    
}
