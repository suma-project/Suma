 <?php
 require_once 'ServerIO.php';
/**
 * Class to create an hourly report on previous
 * day's counts for all initiatives.
 *
 * @author Bret Davidson <bret_davidson@ncsu.edu>  */
class NightlyData
{
    /**
     * [__construct description]
     * @param string $startHour Start hour of 24-Hour period
     */
    public function __construct($startHour="0000") {
      $this->startHour = $startHour;
    }
    /**
     * Placeholder for returned data.
     * @var array
     * @access private
     */
    private $countHash = array();
    /**
     * Placeholder for returned data.
     * @var array
     * @access private
     */
    private $locations = array();
    /**
     * ID of initiative currently being processed
     * @var string
     * @access private
     */
    private $currentInitID = "";
    /**
     * Total counts for current initiative
     * @var int
     * @access public
     */
    public $currentInitTotal = 0;
    /**
     * Get list of active initiatives and populate $locations array
     * @return array
     * @access private
     */
    private function activeInitiatives()
    {
        $active = array();
        try
        {
            $io     = new ServerIO();
            $inits  = $io->getInitiatives();
            foreach ($inits as $key => $init)
            {
                if ($init['enabled'] == 1)
                {
                    $id          = $init['id'];
                    $title       = $init['title'];
                    $active[$id] = $title;
                    foreach ($init['dictionary']['locations'] as $key => $locData)
                    {
                        $locID                        = $locData['id'];
                        $locTitle                     = $locData['title'];
                        $this->locations[$id][$locID] = $locTitle;
                    }
                }
            }
        }
        catch (Exception $e)
        {
            throw $e;
        }
        return $active;
    }
    /**
     * Gets array of initiatives for a location
     * Builds 24 hour scaffold array for counts
     * @return array
     * @access private
     */
    private function buildHoursScaffold()
    {
        $hours  = array();
        $initID = $this->currentInitID;
        foreach ($this->locations[$this->currentInitID] as $locID => $locTitle)
        {
            for ($i = 0; $i <= 23; $i++)
            {
                $hours[$i][$locID] = 0;
            }
        }
        return $hours;
    }
    /**
     * Method for building a query string for a timeseries report URL. Should be
     * appended to baseUrl for analysis environment
     * @param  string $id    Initiative ID
     * @param  string $sDate Start date of query
     * @param  string $eDate End date of Query
     * @return string
     */
    private function buildReportUrl($id, $day, $startHour)
    {
      $urlParams = "/#/timeseries?stime=&etime=&classifyCounts=count&wholeSession=no"
      . "&zeroCounts=no&requireActs=&excludeActs=&requireActGrps="
      . "&excludeActGrps=&excludeLocs=&days=mo,tu,we,th,fr,sa,su";

      $urlParams .= "&startHour" . $startHour;
      $urlParams .= "&id=" . $id;
      $urlParams .= "&sdate=" . $day;
      $urlParams .= "&edate=" . $day;

      return $urlParams;
    }
    /**
     * Method for processing response from ServerIO
     * @param array $response
     * @param string $boundaryStart Unix timestamp
     * @param string $boundaryEnd Unix timestamp
     * @access private
     */
    private function populateHash($response, $boundaryStart, $boundaryEnd, $day, $startHour)
    {
        // Get init title
        $title = $response['initiative']['title'];

        // Remember Initiative ID & Title
        $this->currentInitID = $response['initiative']['id'];

        // Add init to COUNTHASH
        if (!isset($this->countHash[$title]))
        {
            $this->countHash[$title]['counts'] = $this->buildHoursScaffold();
            $this->countHash[$title]['url'] = $this->buildReportUrl($response['initiative']['id'], $day, $startHour);
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
                    $countTime = strtotime($count['time']);

                    // Include count only if it falls within boundaries
                    if ($countTime >= $boundaryStart && $countTime <= $boundaryEnd)
                    {
                      $hour = date('G', $countTime);

                      // get a count of each location separately
                      if (!is_int($this->countHash[$title]['counts'][$hour][$locID]))
                      {
                          $this->countHash[$title]['counts'][$hour][$locID] = $count['number'];
                      }
                      else
                      {
                          $this->countHash[$title]['counts'][$hour][$locID] += $count['number'];
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
        $queryType   = "counts";

        // Retrieve all active initiatives
        $initiatives = $this->activeInitiatives();

        // Build array of param arrays for active inits
        $inits       = array();

        // Adjust end day if start hour !== "0000" and define boundaries
        if ($this-> startHour === "0000")
        {
            $eDate = $day;
            $boundaryStart = strtotime($day . "0000");
            $boundaryEnd = strtotime($eDate . "2359");
        }
        else
        {
            $eDate = str_replace("-", "", date('Y-m-d', strtotime('+1 day', strtotime($day))));
            $boundaryStart = strtotime($day . $this->startHour);
            $boundaryEnd = strtotime(date('Y-m-d H:i', strtotime('-1 minute', strtotime($eDate . $this->startHour))));;
        }

        foreach ($initiatives as $id => $title)
        {
            $params = array(
                'id' => $id,
                'format' => "lc",
                'sdate' => $day,
                'edate' => $eDate
            );
            array_push($inits, $params);
        }

        // Retrieve data for each initiative
        foreach ($inits as $params)
        {
            try
            {
                $io = new ServerIO();
                $this->populateHash($io->getData($params, $queryType), $boundaryStart, $boundaryEnd, $day, $this->startHour);
                while ($io->hasMore())
                {
                    $this->populateHash($io->next(), $boundaryStart, $boundaryEnd, $day, $this->startHour);
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
    public function buildLocationStatsTable($statsArray, $initTitle)
    {
        $this->currentInitTotal = 0;
        $tableHeader  = array(
            'Hour'
                              );
        $tableRows    = array();
        $initID       = array_search($initTitle, $this->activeInitiatives());
        $multipleLocs = (sizeof($this->locations[$initID]) > 1 ? true : false);
        //build table header from locations if multiple locations
        if ($multipleLocs)
        {
            foreach ($this->locations[$initID] as $key => $locTitle)
            {
                array_push($tableHeader, $locTitle);
            }
        }
        array_push($tableHeader, 'Total');
        array_push($tableRows, $tableHeader);
        // build table rows -- only show locations if more than one
        foreach ($statsArray as $hour => $stats)
        {
            $formattedHour = date("h A", strtotime("$hour:00:00"));
            $rowTotal      = 0;
            $rowCells      = array(
                $formattedHour
            );
            foreach ($stats as $locID => $count)
            {
                if (is_numeric($count))
                {
                    $rowTotal += $count;
                }
                if ($multipleLocs)
                {
                    array_push($rowCells, $count);
                }
            }
            array_push($rowCells, $rowTotal);
            array_push($tableRows, $rowCells);
            $this->currentInitTotal+=$rowTotal;
        }
        return $tableRows;
    }
    /**
     * Reduce table to just hours and totals
     *
     * @param array of table rows
     * @return array newTable
     * @access public
     */
    public function eliminateLocations($table)
    {
        $newTable = array();
        foreach ($table as $rows)
        {
            $newRow = array(
                $rows[0],
                $rows[sizeof($rows) - 1]
            );
            array_push($newTable, $newRow);
        }
        return $newTable;
    }
    /**
     * Prepend date to each line of table; early morning hours will have a different date than the pre-midnight hours that immediate precede thm
     *
     * @param array of table rows, date format optional (default yyyy-mm-dd)
     * @return array newTable
     * @access public
     */
    public function prependDate($table, $date, $format="Y-m-d") 
    {
        $newTable = array();
        $year = substr($date,0,4);
        $month = substr($date,4,2);
        $day = substr($date,6,2);
        $use_date = strtotime($year.'-'.$month.'-'.$day);
        $display_date = date($format, $use_date);

        $i = 0;
        $previous_hour = 0;
        foreach ($table as $row)
        {
            $newRow = $row;
            if ($i==0)
            {
                array_unshift($newRow, 'Date');
            }
            else 
            {
                $hour = strtotime($newRow[0]);
                if ($previous_hour > $hour) {
                    $display_date = date($format, strtotime("+1 day",$use_date));
                }
                array_unshift($newRow, $display_date);
                $previous_hour = $hour;
            }
            array_push($newTable, $newRow);
            $i++;
        }
        return $newTable;
    }
    /** Remove table header from the report table
     * @param array table 
     * @return array newTable
     * @access public
     */
    public function omitHeader($table) 
    {
        $newTable = $table;
        array_shift($newTable);
        return $newTable;
    }
    /** Delete a column from a multidimensional array
     * @param table (passed by reference), offset of row to delete
     * @return array (passed by reference, so inherently returned
     * @access private
     * @url from: http://stackoverflow.com/questions/16564650/best-way-to-delete-column-from-multidimensional-array
     */
    private function deleteColumn (&$array, $offset)
    {
        return array_walk($array, function (&$v) use ($offset)
                          {
                              array_splice($v, $offset, 1);
                          }
        );
    }
    /**
     * Hide from report hours with no activity
     * @param array of table rows
     * @return array
     * @access public
     */
    public function hideZeroHours($table)
    {
        $newTable = array();
        $i        = 0;
        foreach ($table as $rows)
        {
            $lastIndex = sizeof($rows) - 1;
            if ($rows[$lastIndex] != 0 || $i == 0)
            {
                array_push($newTable, $rows);
            }
            $i++;
        }
        return $newTable;
    }
    /**
     * Hide from report columns with no activity
     * @param array of table rows
     * @return array
     * @access public
     */
    public function hideZeroColumns($table)
    {
        $columnCounts = array();
        foreach ($table as $rows)
        {
            foreach ($rows as $key => $value) {
                if (is_numeric($value))
                {
                    if (is_null($columnCounts[$key]))
                    {
                        $columnCounts[$key] = $value;
                    }
                    else
                    {
                        $columnCounts[$key] += $value;
                    }
                }
            }
        }
        foreach ($columnCounts as $i => $total) {

            if ($total == 0)
            {
                $this->deleteColumn($table, $i);
            }

        }
        return $table;
    }
    /**
     * Format table output as text or html
     *
     * @param array of table rows, string printFormat
     * @return string output
     * @access public
     */
    public function formatTable($rows, $printFormat = "text")
    {
        if ($this->currentInitTotal == 0)
        {
            $output = "No data to show for this initiative".PHP_EOL;
            if ($printFormat == "html")
            {
                $output = "<p>$output</p>";
            }
            return $output;
        }


        //get column widths
        $columnWidth = array();
        foreach ($rows as $row)
        {
            foreach ($row as $num => $val)
            {
                if (isset($columnWidth[$num]))
                {
                    $columnWidth[$num] = (strlen($val) > $columnWidth[$num] ? strlen($val) : $columnWidth[$num]);
                }
                else
                {
                    $columnWidth[$num] = strlen($val);
                }
            }
        }
        $output = "";
        foreach ($rows as $row)
            {
                $format = '%-' . $columnWidth[0] . 's';
                for ($i = 1; $i < sizeof($row); $i++)
                {
                    $format .= ' %' . $columnWidth[$i] . 's';
                }
                if ($printFormat == "html")
                {
                    $output .= "<tr><td>" . join("</td>\n<td>", $row) . "</td></tr>" . PHP_EOL;
                }
                elseif ($printFormat == "tab")
                {
                    $output .= join("\t",$row).PHP_EOL;
                }
                else
                {
                    $output .= vsprintf($format, $row) . PHP_EOL;
                }
            }
        if ($printFormat == "html")
        {
            $output = "<table>$output</table>\n";
        }
        return $output;
    }
    /**
     * Turn array data sideways (rows <-> columns)
     *
     * @param array $rows
     * @return array
     * @access public
     */
    public function sideways($rows)
    {
        $sideways = array();
        $i        = 0;
        foreach ($rows as $array)
        {
            foreach ($array as $k => $v)
            {
                $sideways[$k][$i] = $v;
            }
            $i++;
        }
        return $sideways;
    }
    /**
     * Sort each initiatives hours based on start hour
     */
    public function resortCountHash() {
        // Convert start hour to usable index
        $startHourIndex = ltrim(substr($this->startHour, 0, -2), "0");

        // Process each initiative hours, preserving indices
        foreach ($this->countHash as $init => $data)
        {
            // Capture end of hours starting at startHourIndex
            $end = array_slice($data['counts'], $startHourIndex, null, true);

            // Capture beginning of hours
            $start = array_slice($data['counts'], 0, $startHourIndex, true);

            // Create new array with end at beginning of array
            $new = $end + $start;

            // Update $this->countHash
            $this->countHash[$init]['counts'] = $new;
        }
    }
    /**
     * Get data from server
     *
     * @param string $day YYYYMMDD string for date
     * @return array
     * @access public
     */
    public function getData($day)
    {
        $this->processData($day);

        if ($this->startHour !== "0000")
        {
          $this->resortCountHash();
        }

        return $this->countHash;
    }
}
