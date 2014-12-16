<?
if (isset($argv[0])) { $displayFormat = "text"; }
else {
  $displayFormat = "html";
?>
<style>
   table, tr, th, td { border: 1px solid black; border-collapse: collapse; }
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
  $output = "";
  foreach ($rows as $row) {
    $format = "%-15s";
    for ($i=0; $i<sizeof($row)-1; $i++) {
      if (! isset($row[$i])) { $row[$i] = " ";  }
      $format.= "  %3s";
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