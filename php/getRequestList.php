<?php
header('Content-Type: application/json');
$postdata = file_get_contents('php://input');
//echo $postdata;
$params = json_decode($postdata, true);
$id = $params["id"]; //echo ("id = ".$id);
$department = $params["department"];
$start = $params["start"];
$end = $params["end"];
$pkgSize = $params["pkgSize"];
$startPos = $params["startPos"];
if($startPos == 0)
	$startPos = 1;
else
	$startPos = $startPos * $pkgSize;
$endPos = $startPos + $pkgSize;
	$now = getdate();
    $now_unix = mktime(0, 0, 0, $now[mon], $now[mday], $now[year]);
	//echo $now_inix;
//print_r($params);

if(isset($_HTTP_RAW_POST_DATA ['id'])){
    $id = $_HTTP_RAW_POST_DATA ['id'];
	//echo $_HTTP_RAW_POST_DATA ['id'];
	}
	//else echo("NO ID");

if(isset($_POST['department']))
    $department = $_POST['department'];

if(isset($_POST['start']))
    $start = $_POST['start'];

if(isset($_POST['end']))
    $end = $_POST['end'];

$startDate;
$result = array();
    
    //if (is_null($date))
        //$startDate = getFormattedDate();
        //$startDate = "20.09.2012";
    //else
      //  $startDate = $date;
  
    //echo $startDate;
    
    $con1 = oci_connect('purchases', 'PURCHASES', '192.168.50.52/ORCLWORK', 'AL32UTF8');
    if (!$con1){
        $err = oci_error($con1);
        var_dump($con1);
        print "Error code = " . $err[code];
        print "Error message = " . $err[message];
        print "Error position = " . $err[offset];
        print "SQL Statement = " . $err[sqltext];
        oci_close($con1);
        die('Ошибка подключения к базе');
    }
    
    $query = "SELECT *
              FROM V_AUTO_REQUESTS
              WHERE V_AUTO_REQUESTS.TRANSPORT_TYPE_ID = {$id} AND
              V_AUTO_REQUESTS.START_TIME >= '{$start}' AND 
              V_AUTO_REQUESTS.END_TIME <= '{$end}' AND
              V_AUTO_REQUESTS.REQUEST_DEPARTMENT = {$department}";
			  
	$query2 = " select V_AUTO_REQUESTS.*
                from (
                    select rownum rw, V_AUTO_REQUESTS.*
                    from (
                        select V_AUTO_REQUESTS.*   
                        from V_AUTO_REQUESTS 
                        where V_AUTO_REQUESTS.REQUEST_DEPARTMENT = {$department} AND
                              V_AUTO_REQUESTS.START_TIME >= {$now_unix}
                        order by REQUEST_ID DESC) V_AUTO_REQUESTS
                    where rownum < {$endPos}
                ) V_AUTO_REQUESTS
                where V_AUTO_REQUESTS.rw >= {$startPos}
                order by V_AUTO_REQUESTS.START_TIME ASC, V_AUTO_REQUESTS.REQUEST_ID";

    $query_new = "SELECT * FROM V_AUTO_REQUESTS
                  WHERE V_AUTO_REQUESTS.REQUEST_DEPARTMENT = $department AND
                        V_AUTO_REQUESTS.START_TIME >= $start AND
                        V_AUTO_REQUESTS.START_TIME <= $end
                  ORDER BY V_AUTO_REQUESTS.START_TIME ASC";
              
    $statement = oci_parse($con1, $query_new);
    
    if(oci_execute($statement, OCI_DEFAULT)){
	//$i = 1;
            while($res = oci_fetch_array($statement)){
				//$result[$i] = $res;
                array_push($result, $res);
				//$i++;
				}
    }
    else {
        $err = oci_error();
        die("Не удалось выполнить запрос : ".$err[message]);
    }
        
    oci_close($con1);
    //return json_decode($result);
    echo json_encode($result);
?>
