<?php
$id = null;
$requestInfo = array();

$now = getdate();
$mday = $now['mday'];
if($mday < 10)
    $mday = "0".$mday;
$mon = $now['mon'];
if($mon < 10)
    $mon = "0".$mon;
$hours = $now['hours'];
if($hours < 10)
    $hours = "0".$hours;
$minutes = $now['minutes'];
if($minutes < 10)
    $minutes = "0".$minutes;

$requestDate = $mday.".".$mon.".".$now['year'];
$requestTime = $hours.":".$minutes;

$postdata = file_get_contents('php://input');
//echo $postdata;
$params = json_decode($postdata, true);
$userId = $params["userId"];
$transportGlobalTypeId = $params["transportGlobalTypeId"];
$transportSubtypeId = intval($params["transportSubtypeId"]);

//echo("global = ".$transportGlobalTypeId."  subtype = ".$transportSubtypeId);
$startDate = $params["startDate"];
$startTime = $params["startTime"];
$endDate = $params["endDate"];
$endTime = $params["endTime"];
$route = $params["route"];
$passCount = $params["passCount"];
$info = $params["info"];
$department = $params["department"];

$con1 = oci_connect('purchases', 'PURCHASES', '192.168.50.52/ORCLWORK', 'AL32UTF8');
    if (!$con1){
        $err = oci_error($con1);
        var_dump($con1);
        print "Error code = " . $err[code];
        print "Error message = " . $err[message];
        print "Error position = " . $err[offset];
        print "SQL Statement = " . $err[sqltext];
        oci_close($con1);
        die('Не удалось подключиться к БД');
    }


    $query = "SELECT sq_request_all.nextval FROM DUAL";
    $statement = oci_parse($con1, $query);
    if(oci_execute($statement, OCI_DEFAULT))
    {
        $res = oci_fetch_assoc($statement);
        $id = $res["NEXTVAL"];
		//echo "id = ".$id;
        $requestInfo["REQUEST_ID"] = $id;
        //die("id = ".$id);
    }
     else {
        $err = oci_error();
        die("Не удалось выполнить запрос 1 : ".$err[message]);
        //echo false;
    }

    $query2 = "INSERT INTO
                         AUTO_REQUESTS (REQUEST_ID,
                                        TRANSPORT_TYPE_ID,
                                        START_DATE,
                                        END_DATE,
                                        DRIVER_ID,
                                        TRANSPORT_ITEM_ID,
                                        USER_ID,
                                        DISPATCHER_ID,
                                        START_TIME,
                                        END_TIME,
                                        PASS_COUNT,
                                        REQUEST_STATUS,
                                        REQUEST_DATE,
                                        REQUEST_TIME,
                                        REJECT_REASON_ID,
                                        REQUEST_ROUTE,
                                        REQUEST_INFO,
                                        REQUEST_DEPARTMENT,
										REQUEST_REJECT_RECIEVED,
										TRANSPORT_SUBTYPE_ID)
                         VALUES ($id,
                                 $transportGlobalTypeId,
                                 '$startDate',
                                 '$endDate',
                                 0,
                                 0,
                                 $userId,
                                 0,
                                 '$startTime',
                                 '$endTime',
                                 $passCount,
                                 1,
                                 '$requestDate',
                                 '$requestTime',
                                 0,
                                 '$route',
                                 '$info',
                                 $department,
								 0,
								 $transportSubtypeId)";

    $statement2 = oci_parse($con1, $query2);

    if(oci_execute($statement2, OCI_COMMIT_ON_SUCCESS)){
        $request_query = "SELECT * FROM V_AUTO_REQUESTS WHERE V_AUTO_REQUESTS.REQUEST_ID = $id";
        $statement = oci_parse($con1, $request_query);
        oci_execute($statement, OCI_DEFAULT);
        $res = oci_fetch_array($statement);
        //$res = oci_fetch_array($statement);
        //$get_query = "SELECT * FROM AUTO_REQUESTS WHERE REQUEST_ID = $res";
        //$statement2 = oci_parse($con1, $get_query);
        //$res2 = oci_fetch_assoc($statement2);
        //echo json_encode($requestInfo);
        //die($id);
		//echo "success";
		echo json_encode($res);
		//echo $id;
    } else {
        $err = oci_error();
        die("Не удалось выполнить запрос 2: ".$err[message]);
        echo json_encode(false);
    }

    oci_close($con1);
    //echo json_encode($result);

?>