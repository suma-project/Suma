<?php

require_once 'vendor/autoload.php';
require_once 'ServerIO.php';
require_once 'SumaGump.php';

/**
 * Class to create an hourly report on previous
 * day's counts for all initiatives.
 *
 * @author  Bret Davidson <bret_davidson@ncsu.edu>
 */
class RawData
{
    /**
     * Placeholder for returned data.
     * @var array
     * @access  private
     */
    private $countHash = array();
    private $actHash = array();
    private $actGrpHash = array();
    private $locHash = array();
    /**
     * [__construct]
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
    }
    /**
     * Form input validation.
     * @param  array $input
     * @return array
     */
    public function validateInput($input)
    {
        // Initialize SumaGump class
        $validator = new SumaGump();

        // Sanitize input
        $input = $validator->sanitize($input);

        // Define filters
        $filters = array(
            'id'    => 'trim',
            'sdate' => 'trim|sanitize_numbers|rmhyphen',
            'edate' => 'trim|sanitize_numbers|rmhyphen',
            'stime' => 'trim|sanitize_numbers',
            'etime' => 'trim|sanitize_numbers'
        );

        // Define validation rules
        $rules = array(
            'id'    => 'required|numeric',
            'sdate' => 'numeric|multi_exact_len, 0 8',
            'edate' => 'numeric|multi_exact_len, 0 8',
            'stime' => 'numeric|multi_exact_len, 0 4',
            'etime' => 'numeric|multi_exact_len, 0 4'
        );

        // Filter input
        $input = $validator->filter($input, $filters);

        // Validate input
        $validated = $validator->validate($input, $rules);

        // If input validates, return params array
        if ($validated === TRUE)
        {
            $params = array(
                    'id'         => $input['id'],
                    'sdate'      => $input['sdate'],
                    'edate'      => $input['edate'],
                    'stime'      => $input['stime'],
                    'etime'      => $input['etime']
            );

            // If end date parameter is greater than or equal
            // to today, set end date to yesterday
            $today = date('Ymd');

            if ($params['edate'] > $today)
            {
                $params['edate'] = $today;
            }

            return $params;
        }
        else
        {
            $message = 'Query Parameter Input Error.';

            foreach ($validator->get_readable_errors() as $error) {
                $message = $message . " " . strip_tags($error);
            }

            throw new Exception($message, 500);
        }

    }

    /**
       * Method for creating full location ancestry as a string
       * @param object location
       * @param array location dictionary
       * @access private
       * @return string
       */
     private function locAncestry($loc, $locDict, $rootLocation, $base="")
     {
         // Exit recursion if parent is rootLocation
         if ($loc['parent'] == $rootLocation)
         {
             if (empty($base))
             {
                return $loc['title'] . " (id:" . $loc['id'] . ")";
             }
             else
             {
                return $loc['title'] . "-" . $base;
             }
         }

        // Find parent location
        $parentLoc = NULL;
        foreach($locDict as $l)
        {
            if ($l['id'] == $loc['parent'])
            {
                $parentLoc = $l;
            }
        }

        // Build location string component
        if (empty($base))
        {
            $locString = $loc['title'] . " (id:" . $loc['id'] . ")";
        }
        else
        {
            $locString = $loc['title'] . "-" . $base;
        }

        // Recurse
        return $this->locAncestry($parentLoc, $locDict, $rootLocation, $locString);
     }

    /**
     * Method for processing response from ServerIO
     * @param  array $response
     * @access  private
     */
    private function populateHash($response) {
        // Check for sessions object
        if (!isset($response['initiative']['sessions']))
        {
            throw new Exception('No data found for that combination of filters. Please try a broader search.');
        }

        // Build Dictionaries
        $locDict = $response['initiative']['dictionary']['locations'];
        $rootLocation = $response['initiative']['rootLocation'];

        if(empty($this->locHash))
        {
            foreach($locDict as $loc)
            {
                $this->locHash[$loc['id']] = $this->locAncestry($loc, $locDict, $rootLocation);
            }
        }

        $sessions = $response['initiative']['sessions'];

        foreach ($sessions as $sess)
        {
            $sessId = $sess['id'];
            $sessStart = $sess['start'];
            $sessEnd = $sess['end'];

            foreach ($sess['counts'] as $count)
            {
                $row = array();
                $row['sessionId'] = $sessId;
                $row['sessionStart'] = $sessStart;
                $row['sessionEnd'] = $sessEnd;
                $row['countId'] = $count['id'];
                $row['time'] = $count['time'];
                $row['count'] = $count['number'];
                $row['location'] = $this->locHash[$count['location']];
                $row['activities'] = $count['activities'];

                array_push($this->countHash, $row);
            }
        }
    }
    /**
     * Method for processing nightly data
     * @param string $day YYYYMMDD string for date
     * @access private
     */
    private function processData($p)
    {
        // QueryServer config
        $queryType = "sessions";

        // Create new ServerIO instance
        $io = new ServerIO();

        $params = array(
            'id'     => $p['id'],
            'sdate'  => $p['sdate'],
            'edate'  => $p['edate'],
            'stime'  => $p['stime'],
            'etime'  => $p['etime']
        );

        // Retrieve data for each initiative
        try
        {
            $io = new ServerIO();
            $this->populateHash($io->getData($params, $queryType));
            while ($io->hasMore())
            {
                $this->populateHash($io->next());
            }
        }
        catch (Exception $e)
        {
            throw new Exception($e->getMessage());
        }

    }

    /**
     * Get data from server
     *
     * @param  string $day YYYYMMDD string for date
     * @return array
     * @access  public
     */
    public function getData($input)
    {
        $params = $this->validateInput($input);
        $this->processData($params);
        return $this->countHash;
    }
}
