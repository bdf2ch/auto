<?php
    session_start();
    $result = array();
    
    if(isset($_COOKIE["user_id"]) && $_COOKIE["user_id"] != ""){
        $result["user_id"] = $_COOKIE["user_id"];
        $result["user_fio"] = $_COOKIE["user_fio"];
        $result["user_email"] = $_COOKIE["user_email"];
        $result["admin_dep_id"] = $_COOKIE["admin_dep_id"];
        $result["admin_dep_suf"] = $_COOKIE["admin_dep_suf"];
        $result["obl_vid_id"] = $_COOKIE["obl_vid_id"];
        $result["obl_vid_title"] = $_COOKIE["obl_vid_suf"];
        
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
              FROM AP_USERS, AP_OBL_VIDIMOSTI
              WHERE AP_USERS.ID = {$_COOKIE['user_id']} AND AP_USERS.OBL_VID = AP_OBL_VIDIMOSTI.OV_ID";
    
    $statement = oci_parse($con1, $query);
    
    if(oci_execute($statement, OCI_DEFAULT)){
        $result = oci_fetch_array($statement);
            //array_push($result, $res);
    }
    else {
        $err = oci_error();
        //$result = oci_error();
        die("Не удалось выполнить звапрос : ".$err[message]);
    }
    } else {
        $result = "fail";
    }
    
    echo json_encode($result);
?>
