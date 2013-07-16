<?php

require_once "../../lib/php/guzzle.phar";
require_once "../../config/ServerIOConfig.php";

/**
 * ServerIO - Class that facilitates retrieval of data from Suma server.
 *
 * @author  Eric McEachern
 * @author  Bret Davidson <bret_davidson@ncsu.edu>
 */
class ServerIO
{
    /**
     * Guzzle client
     *
     * @var object
     * @access  private
     */
    private $_client = NULL;
    /**
     * Base url of Suma query server
     *
     * @var string
     * @access  private
     */
    private $_baseUrl;
    /**
     * Parameters to append to $_baseUrl
     *
     * @var string
     * @access  private
     */
    private $_urlParams = '';
    /**
     * Record of server response field hasMore
     *
     * @var boolean
     * @access  private
     */
    private $_hasMore = NULL;
    /**
     * Record of incremented (5000) offset
     *
     * @var string
     * @access  private
     */
    private $_offset = NULL;
    /**
     * Constructor to set url configuration
     */
    function __construct() {
        // $config = new ServerIOConfig();
        global $ServerIOBaseUrl;
        $this->_baseUrl = $ServerIOBaseUrl;
    }
    /**
     * Builds full URL and returns result of sendRequest
     *
     * @access  public
     * @param  array $params
     * @param  string $mode
     * @return array
     */
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

        $this->_urlParams .= ($mode == 'sessions') ? 'sessions' : 'counts';

        foreach($params as $key => $val)
        {
            if (($key == 'sdate' || $key == 'edate' || $key == 'stime' || $key == 'etime') && !empty($val) && !is_numeric($val))
            {
                throw new Exception('All supplied dates and times must be numeric');
            }
            $this->_urlParams .= "/$key/$val";
        }

        return $this->sendRequest($this->_urlParams);
    }
    /**
     * Returns value of $this->_hasMore
     *
     * @access  public
     * @return boolean
     */
    public function hasMore()
    {
        return $this->_hasMore;
    }
    /**
     * Calls sendRequest, appending appropriate offset to
     * $this->_urlParams
     *
     * @access  public
     * @return array
     */
    public function next()
    {
        return $this->sendRequest($this->_urlParams . '/offset/'. $this->_offset);
    }
    /**
     * Retrieve a dictionary of available initiatives
     *
     * @access  public
     * @return array
     */
    public function getInitiatives()
    {
        return $this->sendRequest($this->_urlParams . 'initiatives');
    }
    /**
     * Sends request to Suma server using base url
     * and parameters defined elsewhere in this class.
     *
     * @access  private
     * @param  string $url
     * @return array
     */
    private function sendRequest($url)
    {
        if (empty($this->_client))
        {
            $this->_client = new Guzzle\Service\Client($this->_baseUrl);
        }

        try
        {
            $request  = $this->_client->get($url);
            $response = $request->send();
        } catch (Exception $e) {
            throw new Exception("Please verify that the ServerIOBaseUrl in ServerIOConfig is a valid URL. Please verify that the configuration file (config.yaml) in service/config exists and is readable.");
        }

        try
        {
            $results = json_decode($response->getBody(), true);

            if ($results)
            {
                if (isset($results['status']))
                {
                    if (strtolower($results['status']['has more']) == 'true')
                    {
                        $this->_hasMore = true;
                        $this->_offset = $results['status']['offset'];
                    }
                    else
                    {
                        $this->_hasMore = false;
                    }
                }

                return $results;
            }
            else
            {
                throw new Exception("JSON Parse Error in ServerIO.php.");
            }
        } catch (Exception $e) {
            throw new Exception($e);
        }
    }
}
