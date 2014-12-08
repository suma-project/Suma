<?php

require_once 'ServerIO.php';

/**
 * Class to create an hourly report on previous
 * day's counts for all initiatives.
 *
 * @author  Bret Davidson <bret_davidson@ncsu.edu>
 */
class NightlyData
{
    /**
     * Placeholder for returned data.
     * @var array
     * @access  private
     */
    private $countHash = array();
    /**
     * Hash for human-readable display of hours
     * @var array
     * @access  public
     */
    public $hourDisplay = array(
        "0" => "12:00 AM",
        "1" => "01:00 AM",
        "2" => "02:00 AM",
        "3" => "03:00 AM",
        "4" => "04:00 AM",
        "5" => "05:00 AM",
        "6" => "06:00 AM",
        "7" => "07:00 AM",
        "8" => "08:00 AM",
        "9" => "09:00 AM",
        "10" => "10:00 AM",
        "11" => "11:00 AM",
        "12" => "12:00 PM",
        "13" => "01:00 PM",
        "14" => "02:00 PM",
        "15" => "03:00 PM",
        "16" => "04:00 PM",
        "17" => "05:00 PM",
        "18" => "06:00 PM",
        "19" => "07:00 PM",
        "20" => "08:00 PM",
        "21" => "09:00 PM",
        "22" => "10:00 PM",
        "23" => "11:00 PM",
    );
    /** 
     * Get list of active initiatives
     * @return array
     * @access private
     */
    public function activeInitiatives() {
      $active = array();
      $io = new ServerIO();
      $inits = $io->getInitiatives();
      foreach ($inits as $key => $init) {
	if ($init['enabled'] == 1) {
	  $id = $init['id'];
	  $title = $init['title'];
	  $active[$id] = $title;
	}
      }
      return $active;
    }
    /**
     * Builds 24 hour scaffold array for counts
     * @return array
     * @access  private
     */
    private function buildHoursScaffold() {
        $hours = array();

        for ($i = 0; $i <= 23; $i++)
        {
            $hours[$i] = "n/a";
        }

        return $hours;
    }
    /**
     * Method for processing response from ServerIO
     * @param  array $response
     * @access  private
     */
    private function populateHash($response) {
        // Get init title
        $title = $response['initiative']['title'];

        // Add init to COUNTHASH
        if (!isset($this->countHash[$title]))
        {
            $this->countHash[$title] = $this->buildHoursScaffold();
        }

        // Process counts
        if (isset($response['initiative']['locations']))
        {
            $locations = $response['initiative']['locations'];
            foreach ($locations as $loc)
            {
                foreach ($loc['counts'] as $count)
                {
                    $hour = date('G', strtotime($count['time']));
                    if (!is_int($this->countHash[$title][$hour]))
                    {
                        $this->countHash[$title][$hour] = $count['number'];
                    }
                    else
                    {
                        $this->countHash[$title][$hour] += $count['number'];
                    }
                }
            }
        }
    }
    /**
     * Method for processing nightly data
     * @param string $day YYYYMMDD string for date
     * @access private
     */
    private function processData($day, $locationBreakdown = false)
    {
        // QueryServer config
        $queryType = "counts";

        // Create new ServerIO instance
        $io = new ServerIO();

        // Retrieve all active initiatives
	$initiatives = $this->activeInitiatives();

        // Build array of param arrays for active inits
        $inits = array();
        foreach ($initiatives as $id => $title)
        {
            $params = array(
                'id'     => $id,
                'format' => "lc",
                'sdate'  => $day,
                'edate'  => $day
            );
            array_push($inits, $params);
        }

        // Retrieve data for each initiative
        foreach ($inits as $params)
        {
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
                throw $e;
            }
        }

    }
    /**
     * Get data from server
     *
     * @param  string $day YYYYMMDD string for date
     * @return array
     * @access  public
     */
    public function getData($day, $locationBreakdown = false)
    {
      $this->processData($day, $locationBreakdown);
      return $this->countHash;
    }
}
