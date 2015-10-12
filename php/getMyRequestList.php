<?php
header('Content-Type: application/json');
$postdata = file_get_contents('php://input');
//echo $postdata;
$params = json_decode($postdata, true);
$userId = $params["userId"]; //echo ("id = ".$id);
$department = $params["department"];
$pkgSize = $params["pkgSize"];
$startPos = $params["startPos"];
if($startPos == 0){
	$startPos = 1;
	$sign = ">=";
} else {
	$startPos = $startPos * $pkgSize;
		$sign = ">";
}
	
$endPos = $startPos + $pkgSize;
	
    if(isset($_POST['userId']))
        $userId = $_POST['userId'];

    if (isset($_POST['department']))
        $department = $_POST['department'];

    if (isset($_POST['startPos']))
        $startPos = $_POST['startPos'];

    if (isset($_POST['pkgSize']))
        $pkgSize = $_POST['pkgSize'];

    $result = array();
    
    $con1 = oci_connect(
            'purchases', 
            'PURCHASES', 
            '192.168.50.52/ORCLWORK', 
            'AL32UTF8');
    
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
              ORDER BY REQUEST_ID DESC";
    
    $query_pagination = 
        "SELECT *
         FROM (SELECT * FROM V_AUTO_REQUESTS ORDER BY REQUEST_ID DESC)
         WHERE ROWNUM >= {$startPos} AND ROWNUM < {$endPos}";
         
    $query3 = "
        select V_AUTO_REQUESTS.*
        from (select rownum rw, V_AUTO_REQUESTS.*
              from (select V_AUTO_REQUESTS.* 
                    from V_AUTO_REQUESTS 
                    where V_AUTO_REQUESTS.REQUEST_DEPARTMENT = {$department}
                    order by REQUEST_ID DESC) V_AUTO_REQUESTS
              where rownum < {$endPos} AND
                    V_AUTO_REQUESTS.USER_ID = {$userId}) V_AUTO_REQUESTS
        where V_AUTO_REQUESTS.rw >= {$startPos}";
		
	$query2 = " select V_AUTO_REQUESTS.*
                from (
                    select rownum rw, V_AUTO_REQUESTS.*
                    from (
                        select V_AUTO_REQUESTS.*   
                        from V_AUTO_REQUESTS 
                        where V_AUTO_REQUESTS.REQUEST_DEPARTMENT = {$department} AND
						V_AUTO_REQUESTS.USER_ID = {$userId}
                        order by REQUEST_ID DESC) V_AUTO_REQUESTS
                    where rownum < {$endPos}
                ) V_AUTO_REQUESTS
                where V_AUTO_REQUESTS.rw {$sign} {$startPos}";
              
    $statement = oci_parse($con1, $query2);
    
    if(oci_execute($statement, OCI_DEFAULT)){
            while($res = oci_fetch_array($statement))
                array_push($result, $res);
    }
    else {
        $err = oci_error();
        die("Не удалось выполнить звапрос : ".$err[message]);
    }
        
    oci_close($con1);
    echo json_encode($result);


?>
