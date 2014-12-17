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
	$initID = $this->currentInitID;
	foreach ($this->locations[$this->currentInitID] as $locID => $locTitle) {
	  
	  for ($i = 0; $i <= 23; $i++) {
	    $hours[$i][$locID] = 0;
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

		    // get a count of each location separately 
		      if (!is_int($this->countHash[$title][$hour][$locID])) {
			  $this->countHash[$title][$hour][$locID] = $count['number'];
			}
			else {
			  $this->countHash[$title][$hour][$locID] += $count['number'];
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
      $tableHeader = array('Hour');
      $tableRows = array();
      $initID = array_search ($initTitle, $this->activeInitiatives());
      $multipleLocs = (sizeof($this->locations[$initID]) > 1 ? true : false);

      //build table header from locations if multiple locations
      if ($multipleLocs) {
	foreach ($this->locations[$initID] as $key => $locTitle) {
	  array_push($tableHeader,$locTitle);
	}
      }
      array_push($tableHeader,'Total');
      array_push($tableRows,$tableHeader);

      // build table rows -- only show locations if more than one
      foreach ($statsArray as $hour => $stats) {
	$formattedHour = date ("h A", strtotime("$hour:00:00"));
	$rowTotal = 0;
	$rowCells = array($formattedHour);
	foreach ($stats as $locID => $count) {
	  if (is_numeric($count)) { 
	    $rowTotal += $count;
	  }
	  if ($multipleLocs) {
	    array_push($rowCells,$count);
	  }
	}
	array_push($rowCells,$rowTotal);
	array_push($tableRows,$rowCells);
      }
      return $tableRows;
    }
    /**
     * Reduce table to just hours and totals
     *
     * @param array of table rows
     * @return array newTable
     * @access  public
     */
    public function eliminateLocations($table) {
      $newTable = array();
      foreach ($table as $rows) {
	$newRow = array($rows[0], $rows[sizeof($rows)-1]);
	array_push($newTable, $newRow);
      }
      return $newTable;
    }
    /**
     * Format table output as text or html
     *
     * @param array of table rows, string printFormat
     * @return string output
     * @access  public
     */
public function formatTable ($rows, $printFormat="text") {
  //get column widths
  $columnWidth = array();
  foreach($rows as $row) {
    foreach ($row as $num=>$val) {
      if (isset($columnWidth[$num])) { 
	$columnWidth[$num] = (strlen($val) > $columnWidth[$num] ? strlen($val) : $columnWidth[$num] );
      }
      else { $columnWidth[$num] = strlen($val); }
    }
  }

  $output = "";
  foreach ($rows as $row) {
    $format = '%-'.$columnWidth[0].'s';
    for ($i=1; $i<sizeof($row); $i++) {
      $format.= '  %'.$columnWidth[$i].'s';
    }
    if ($printFormat == "html") {
      $output .= "<tr><td>" . join("</td>\n<td>", $row) . "</td></tr>". PHP_EOL;
    }
    else {
      $output .= vsprintf($format,$row)."\n";
    }
  }
  if ($printFormat == "html") { 
    $output = "<table>$output</table>\n";
  }
  return $output;
}
    /**
     * Turn array data sideways (rows <-> columns)
     *
     * @param  array $rows
     * @return array
     * @access  public
     */
public function sideways ($rows) {
  $sideways = array();
  $i = 0;
  foreach ($rows as $array) {
    foreach ($array as $k=>$v) {
      $sideways[$k][$i] = $v;
    }
    $i++;
  }
  return $sideways;
}
    /**
     * Get data from server
     *
     * @param  string $day YYYYMMDD string for date
     * @return array
     * @access  public
     */
    public function getData($day)
    {
      $this->processData($day);
      return $this->countHash;
    }
}
