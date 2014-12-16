<?
if (isset($argv[0])) { $displayFormat = "text"; }
else {
  $displayFormat = "html";
?>
<style>
   table, tr, th, td { border: 1px solid black; border-collapse: collapse; }
table tr:first-child td {font-weight: bold }
  table tr td:first-child {font-weight: bold } 
</style>
<?
    } //end else if html

$rows = array();
array_push($rows,array("Monster","x","y","z"));
array_push($rows,array("Snuffluphagus","21","222","23"));
array_push($rows,array("Balderdash","Z","B","C"));

if (min(array_map('sizeof',$rows)) < max(array_map('sizeof',$rows))) {
  die ("Cannot print: not all rows are of the the same length");  
}
PrintTable($rows, $displayFormat);
PrintTable(Sideways($rows), $displayFormat);

function PrintTable ($rows, $printFormat="text") {
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
  print $output;
}

function Sideways ($rows) {
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
?>