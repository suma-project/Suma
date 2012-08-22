<?php

require_once "../../lib/guzzle.phar";

class ServerIO
{
    private $_client = NULL;
    private static $_baseUrl = 'http://<host>/query';
    private static $_urlParams = '';
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

        self::$_urlParams .= ($mode == 'sessions') ? 'sessions' : 'counts';

        foreach($params as $key => $val)
        {
            if (($key == 'sdate' || $key == 'edate' || $key == 'stime' || $key == 'etime') && !empty($val) && !is_numeric($val))
            {
                throw new Exception('All supplied dates and times must be numeric');
            }
            self::$_urlParams .= "/$key/$val";
        }

        return $this->sendRequest(self::$_urlParams);
    }

    public function hasMore()
    {
        return self::$_hasMore;
    }

    public function next()
    {
        return $this->sendRequest(self::$_urlParams.'/offset/'.self::$_offset);
    }

    // ------ PRIVATE FUNCTIONS ------

    private function sendRequest($url)
    {
        if (empty($_client))
        {
            $_client = new Guzzle\Service\Client(self::$_baseUrl);
        }

        $request  = $_client->get($url);
        $response = $request->send();

        try
        {
            $results = json_decode($response->getBody(), true);

            if ($results)
            {
                if (isset($results['status']))
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
                }

                return $results;
            }
            else
            {
                throw new Exception('JSON Parse Error');
            }
        }
        catch (Guzzle\Http\Exception\BadResponseException $e)
        {
            throw new Exception($e->getMessage());
        }
    }

    // ------ STATIC FUNCTIONS ------

    static function getInitiatives()
    {
        return self::sendRequest(self::$_urlParams . 'initiatives');
    }
}