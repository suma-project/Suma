<?php

require_once 'ServerIO.php';
require_once 'Gump.php';
require_once 'SumaGump.php';
require_once 'vendor/autoload.php';

/**
 * Class to create an hourly report on previous
 * day's counts for all initiatives.
 *
 * @author  Bret Davidson <bret_davidson@ncsu.edu>
 */
class SessionsData
{
    /**
     * Placeholder for returned data.
     * @var array
     * @access  private
     */
    private $countHash = array();
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

        $sessions = $response['initiative']['sessions'];

        foreach ($sessions as $sess)
        {

            if (isset($this->countHash[$sess['id']]))
            {
                $total = 0;

                foreach ($sess['locations'] as $loc)
                {
                    $total += $loc['counts'];
                }

                $this->countHash[$sess['id']]['total'] += $total;
            }
            else
            {
                $sess_array = array(
                    "id" => $sess["id"],
                    "start" => $sess["start"],
                    "end"   => $sess["end"],
                    "transId" => $sess["transId"],
                    "transStart" => $sess["transStart"],
                    "transEnd" => $sess["transEnd"],
                    "total" => 0
                );

                foreach ($sess['locations'] as $loc)
                {
                    $sess_array['total'] += $loc['counts'];
                }

                $this->countHash[$sess['id']] = $sess_array;
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
            'format' => "lc",
            'sum'    => "true",
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
     * Convert hash to array of objects
     * @param  array $data
     * @return array
     */
    private function formatData($data)
    {
        $array = array();

        foreach ($data as $d)
        {
            array_push($array, $d);
        }

        return $array;
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

        $data = $this->formatData($this->countHash);
        return $data;
    }
}
