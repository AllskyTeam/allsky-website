<?php
$forecast   = file_get_contents('http://services.swpc.noaa.gov/text/3-day-forecast.txt');
//echo $homepage;
$stripStart = substr($forecast, strpos($forecast, "00-03UT"));
$kpTable    = substr($stripStart, 0, strpos($stripStart, "Rationale") -2 );
//echo $kpTable;

$rows       = explode("\n", $kpTable);

foreach($rows as $row => $data)
{
    //get row data
    $noBrackets = preg_replace("/\([^)]+\)/","", $data);
    $dataFormatted = preg_replace('!\s+!', ' ', $noBrackets);
    $row_data = explode(' ', $dataFormatted);

    $info[$row]['time']  = $row_data[0];
    $info[$row]['day1']  = $row_data[1];
    $info[$row]['day2']  = $row_data[2];
    $info[$row]['day3']  = $row_data[3];
}

echo json_encode($info);

?>