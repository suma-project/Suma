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
     * Boolean: break down hourly stats by location? Default = false
     * @var bool
     * @access  private
     */
    private $locationBreakdown = false;
    /**
     * Placeholder for returned data.
     * @var array
     * @access  private
     */
    private $locations = array();
    /**
     * ID of initiative currently being processed
     * @var string
     * @access  private
     */
    private $currentInitID = "";
    /**
     * Title of initiative currently being processed
     * @var string
     * @access  private
     */
    private $currentInitTitle = "";
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
     * Get list of active initiatives and populate $locations array
     * @return array
     * @access private
     */
    private function activeInitiatives() {
      $active = array();
      $io = new ServerIO();
      $inits = $io->getInitiatives();
      foreach ($inits as $key => $init) {
	if ($init['enabled'] == 1) {
	  $id = $init['id'];
	  $title = $init['title'];
	  $active[$id] = $title;
	  foreach ($init['dictionary']['locations'] as $key => $locData) {
	    $locID = $locData['id'];
	    $locTitle = $locData['title'];
	    $this->locations[$id][$locID] = $locTitle;
	  }
	}
      }
      return $active;
    }
    /** 
     * Gets array of initiatives for a location
    /**
     * Builds 24 hour scaffold array for counts
     * @return array
     * @access  private
     */
    private function buildHoursScaffold() {
        $hours = array();
	// if need location breakdown, build a 2-D scaffold
	if ($this->locationBreakdown) {
	  $initID = $this->currentInitID;
	  foreach ($this->locations[$this->currentInitID] as $locID => $locTitle) {

	    for ($i = 0; $i <= 23; $i++) {
	      $hours[$i][$locID] = 0;
	    }
	  }
	}

	// otherwise, build a 1-D scaffold
	else {
	  for ($i = 0; $i <= 23; $i++)
	    {
	      $hours[$i] = "n/a";
	    }
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
	
	// Remember Initiative ID & Title
	$this->currentInitID = $response['initiative']['id'];
	$this->currentInitTitle = $response['initiative']['title'];

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
	      $locID = $loc['id'];
                foreach ($loc['counts'] as $count)
                {
                    $hour = date('G', strtotime($count['time']));

		    // get a count each location separately if needed
		    if ($this->locationBreakdown) {
		      if (!is_int($this->countHash[$title][$hour][$locID])) {
			  $this->countHash[$title][$hour][$locID] = $count['number'];
			}
			else {
			  $this->countHash[$title][$hour][$locID] += $count['number'];
			}
		    } 

		      // if not breaking down by location, keep it simple
		    else { 
		      if (!is_int($this->countHash[$title][$hour]['total']))
			{
			  $this->countHash[$title][$hour]['total'] = $count['number'];
			}
		      else
			{
			  $this->countHash[$title][$hour]['total'] += $count['number'];
			}
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
    private function processData($day)
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
     * Build table of hourly stats by location
     * @return string $table
     * @access public
     */
    public function buildLocationStatsTable ($statsArray, $initTitle) 
    {
      $tableHeader = '<tr><th>Hour</th>'; 
      $tableRows = '';
      $initID = array_search ($initTitle, $this->activeInitiatives());
      $multipleLocs = (sizeof($this->locations[$initID]) > 1 ? true : false);

      //build table header from locations if multiple locations
      if ($multipleLocs) {
	foreach ($this->locations[$initID] as $key => $locTitle) {
	  $tableHeader .= '<th>'.$locTitle.'</th>';
	}
      }
      $tableHeader .= '<th>Total</th></tr>';

      // build table rows -- only show locations if more than one
      foreach ($statsArray as $hour => $stats) {
	$formattedHour = date ("h A", strtotime("$hour:00:00"));
	$rowTotal = 0;
	$rowCells = '<tr><th>'.$formattedHour.'</th>';
	foreach ($stats as $locID => $count) {
	  if (is_numeric($count)) { 
	    $rowTotal += $count;
	  }
	  if ($multipleLocs) {
	    $rowCells .= '<td>'.$count.'</td>';
	  }
	}
	$rowCells .= '<td>'.$rowTotal.'</td></tr>';
	$tableRows .= $rowCells;
      }
      $table = '<table class="stats-by-location">' . $tableHeader . $tableRows . '</table>';
      return $table;
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
      $this->locationBreakdown = $locationBreakdown;
      $this->processData($day);
      return $this->countHash;
    }
}
