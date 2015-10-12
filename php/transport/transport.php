<?php

$postdata = file_get_contents('php://input');
$params = json_decode($postdata, true);
$action = $params["action"];
$transportId = $params["id"];
$model = $params["model"];
$gid = $params["gid"];
$departmentId = $params["departmentId"];
$transportTypeId = $params["transportTypeId"];
$transportSubtypeId = $params["transportSubtypeId"];
$id;

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

switch($action){
    case "add":
        addTransport();
        break;
    case "edit":
        editTransport();
        break;
}

function addTransport(){
    global $con1;
    global $id;
    global $departmentId;
    global $transportTypeId;
    global $transportSubtypeId;
    global $model;
    global $gid;

    $query = "SELECT sq_request_all.nextval FROM DUAL";
    $statement = oci_parse($con1, $query);
    if(oci_execute($statement, OCI_DEFAULT)){
        $res = oci_fetch_assoc($statement);
        $id = $res["NEXTVAL"];
    } else {
        $err = oci_error();
        die("Не удалось получить индентификатор : ".$err[message]);
        echo false;
    }

    $query2 = "INSERT INTO TRANSPORT_ITEMS(ITEM_ID, ITEM_TITLE, ITEM_GID, DEP_ID, ITEM_TYPE_ID, ITEM_SUBTYPE_ID)
               VALUES($id, '$model', '$gid', $departmentId, $transportTypeId, $transportSubtypeId)";
    $statement2 = oci_parse($con1, $query2);
    if(oci_execute($statement2, OCI_COMMIT_ON_SUCCESS)){
        $query3 = "SELECT * FROM TRANSPORT_ITEMS WHERE ITEM_ID = $id";
        $statement3 = oci_parse($con1, $query3);
        if(oci_execute($statement3, OCI_DEFAULT)){
            $transport = oci_fetch_assoc($statement3);
            echo json_encode($transport);
        }
    } else {
        $err = oci_error();
        die("Не удалось добавить транспорт: ".$err[message]);
        echo "fail";
    }
};

function editTransport(){
    global $con1;
    global $transportId;
    global $departmentId;
    global $transportTypeId;
    global $transportSubtypeId;

    $query = "UPDATE TRANSPORT_ITEMS
              SET ITEM_TYPE_ID = {$transportTypeId},
                  ITEM_SUBTYPE_ID = {$transportSubtypeId},
                  DEP_ID = {$departmentId}
              WHERE ITEM_ID = {$transportId}";
    $statement = oci_parse($con1, $query);

    if(oci_execute($statement, OCI_COMMIT_ON_SUCCESS))
        echo true;
    else {
        $err = oci_error();
        die("Не удалось сохранить изменения : ".$err[message]);
        echo false;
    }
};

oci_close($con1);
?>