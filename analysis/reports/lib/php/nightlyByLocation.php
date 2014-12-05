<style>
table { border-collapse: collapse;}
td,th { border: 1px solid black; text-align: center;}
</style>
<?
error_reporting(E_ALL);
ini_set("display_errors", true);
//$init = 1; // 1= the student manager head count

require_once 'vendor/autoload.php';
require_once 'ServerIO.php';
$config = Spyc::YAMLLoad(realpath(dirname(__FILE__)) . '/../../../config/config.yaml');

$day = "yesterday";
$sdate = $DAY_PROCESS = date('Ymd0000', strtotime('yesterday'));
$edate = $DAY_PROCESS = date('Ymd0000', strtotime('today'));
$baseurl = $config['serverIO']['baseUrl'];

$active_inits = json_decode(file_get_contents(preg_replace ("/query/", "clientinit", $baseurl)));

foreach ($active_inits as $init) {
  $counts_info = GetCountsByHourandLocation($init->initiativeId, $day, $sdate, $edate, $baseurl);
  print '<h1>' . $init->initiativeTitle . '</h1>';
  print (TableCountsByLocation($counts_info['counts'], $counts_info['locations'], $day));
} //end foreach active initiative

function GetCountsByHourandLocation($init, $day, $sdate, $edate, $baseurl) {
$counts_url = "http://www6.wittenberg.edu/lib/sumaserver/query/counts?sdate=$sdate&edate=$edate&format=lc&id=$init";
$cts = (file_get_contents($counts_url));
$data = json_decode($cts);

//$data has ->has_more and ->initiative (only one init)
//$data->initiative has ->id ->title ->dictionary ->locations

$locations = array();
$counts = array();


foreach ($data as $initiative) { //look at all initiatives
  if (isset($initiative->dictionary->locations)) { //avoids some php notices
    foreach ($initiative->dictionary->locations as $loc_info) {
      $locations[$loc_info->id] = $loc_info->title;
    }
  }
}//end foreach initiative

foreach ($data->initiative->locations as $loc) {
  foreach ($loc->counts as $count) {
    $hour = date ("H", strtotime($count->time)); //Hour in 24-hour time
    $loc_name = $locations[$loc->id];
    if (! isset($counts[$hour])) { $counts[$hour] = array(); }
    if (! isset($counts[$hour][$loc_name])) { $counts[$hour][$loc_name] = 0;}
    if (! isset($counts[$hour]['count'])) { $counts[$hour]['count'] = 0;}
    $counts[$hour][$loc_name] += $count->number;
    $counts[$hour]['count'] += $count->number; 
  }
}
$return = array ("counts" => $counts, "locations" => $locations, "init_title" => $data->initiative->title);
return $return;
} //end function GetCountsByHourandLocation



function TableCountsByLocation ($count, $locations, $day) {
asort($locations);
$num_locs = sizeof($locations);
$thead = "<thead><tr><th>Hour</th>\n";
$tbody = "";
if ($num_locs > 1) { // only list locations if there is more than one
  foreach ($locations as $loc) {
    $thead .= "<th>$loc</th>";
  }
}
$thead .="<th>Total</th></tr></thead>\n";

$tbody .="<tbody>\n";
if (isset($count)) {
  foreach ($count as $hour => $loc_counts ) {
    $hour = date("h A", strtotime("$day $hour:00:00"));
  $row = "<tr><th>$hour</th>\n";
  foreach ($locations as $key=> $loc) {
    if ($loc_counts[$loc] == "") { $loc_counts[$loc] = 0; }
    if ($num_locs > 1) { $row .= " <td>$loc_counts[$loc]</td>\n"; } //only if multiple locations
  }
  $row .= "<td>".$loc_counts['count']."</td>";
  $tbody .= $row . "</td><tr>\n"; 

  } //end foreach count
}// end if count
$tbody .="</tbody>\n";

print "<table>$thead$tbody</table>\n";

}
?>