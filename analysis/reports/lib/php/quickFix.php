<style>
table { border-collapse: collapse;}
td,th { border: 1px solid black; text-align: center;}
</style>
<?
$init = 1; // 1= the student manager head count
include_once ("localSql.php");
$db = mysql_pconnect ("$db_host", "$db_user", "$db_pass");
mysql_select_db ("$db_name");


$day = $DAY_PROCESS = date('Y-m-d', strtotime('yesterday'));
//$day = $DAY_PROCESS = date('Y-m-d');
//require_once 'ServerIO.php';

// Find out which sessions were deleted 

// Get Location Names
$q = "SELECT * from `location` WHERE fk_parent = $init";
$r = mysql_query($q);
$locations = array();
while ($myrow = mysql_fetch_assoc($r)) {
  extract($myrow);
  $locations[$id] = $title;
}

// get data per day, skipping any deleted sessions
$q = "SELECT count.* FROM `count`,`session` WHERE `occurrence` like '$day%' and `session`.`fk_initiative` = $init and `session`.`id` = `count`.`fk_session` and `session`.`deleted` != 1";
$r = mysql_query($q);
while ($myrow = mysql_fetch_assoc($r)) {
  extract($myrow);
  $hour = date("H", strtotime($occurrence));
  $loc = $locations[$fk_location];
  $count[$hour][$loc] += $number; 
  $count[$hour]['count'] += $number; 

}
//print_r($count);

asort($locations);
$thead = "<thead><tr><th>Hour</th>\n";
$tbody = "";
foreach ($locations as $loc) {
  $thead .= "<th>$loc</th>";
}
$thead .="<th>Total</th></tr></thead>\n";

$tbody .="<tbody>\n";
if (isset($count)) {
  foreach ($count as $hour => $locs ) {
    $hour = date("h A", strtotime("$day $hour:00:00"));
  $row = "<tr><th>$hour</th>\n";
  foreach ($locations as $key=> $loc) {
    if ($locs[$loc] == "") { $locs[$loc] = 0; }
    $row .= " <td>$locs[$loc]</td>\n";
  }
  $row .= "<td>".$locs['count']."</td>";
  $tbody .= $row . "</td><tr>\n"; 

  } //end foreach count
}// end if count
$tbody .="</tbody>\n";

print "<table>$thead$tbody</table>\n";

?>