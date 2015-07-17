<?php

require_once "vendor/autoload.php";

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
        $config = Spyc::YAMLLoad(realpath(dirname(__FILE__)) . '/../../../config/config.yaml');

        // Set Error Reporting Levels
        if (isset($config['showErrors']) && $config['showErrors'] === true)
        {
            $SUMA_ERROR_REPORTING  = E_ERROR | E_WARNING | E_PARSE | E_NOTICE;
            $SUMA_DISPLAY_ERRORS   = 'on';
        }
        else
        {
            $SUMA_ERROR_REPORTING  = 0;
            $SUMA_DISPLAY_ERRORS   = 'off';
        }

        error_reporting($SUMA_ERROR_REPORTING);
        ini_set('display_errors', $SUMA_DISPLAY_ERRORS);

        // Verify that config exists
        if (isset($config['serverIO']['baseUrl']))
        {
            $this->_baseUrl = $config['serverIO']['baseUrl'];
        }
        else
        {
            throw new Exception('Error loading config.yaml. Please verify config.yaml exists and contains a valid baseUrl.');
        }

        // Verify that cURL is available
        if (!function_exists('curl_init'))
        {
            throw new Exception('The cURL extension was not found and is required for the Suma analysis tools.');
        }
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
        }
        // Guzzle Exceptions
        catch (Guzzle\Http\Exception\BadResponseException $e)
        {
            $code = $e->getResponse()->getStatusCode();

            // Set reason phrase from Guzzle exception
            $message = $e->getResponse()->getReasonPhrase() . ". ";

            // If available, append error body content
            $message .= $e->getResponse()->getBody();

            throw new Exception($message, $code);
        }
        // Generic Exceptions
        catch (Exception $e)
        {
            $code = $e->getCode();
            $message = $e->getMessage();

            throw new Exception($message, $code);
        }

        try
        {
            $results = json_decode($response->getBody(), true);

            // Throw error if results empty (no initiatives)
            if (empty($results))
            {
                throw new Exception("No initiatives found. Please create an initiative in the Suma admin tools.", 500);
            }

            // Set offset if more results exist
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
        catch (Exception $e)
        {
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }
}
