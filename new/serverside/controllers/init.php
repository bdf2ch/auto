<?php
    include("../config.php");
    include("../core.php");

    $result = new stdClass;
    $statuses = array();
    $rejectReasons = array();
    $routes = array();
    $drivers = array();
    $vehicles = array();
    $vehicleTypes = array();
    $vehicleSubTypes = array();
    $departments = array();
    $users = array();
    $divisions = array();

    $connection = oci_connect($db_user, $db_password, $db_host, 'AL32UTF8');
    if (!$connection){
        oci_close($connection);
        $error = oci_error();
        $result = new DBError($error["code"], $error["message"]);
        echo(json_encode($result));
    } else {
        $cursor = oci_new_cursor($connection);

        /* Получение списка всех статусов заявки */
        if (!$statement = oci_parse($connection, "begin pkg_auto.p_get_request_statuses(:data); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":data", $cursor, -1, OCI_B_CURSOR)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_execute($statement)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            } else {
                if (!oci_execute($cursor)) {
                    $error = oci_error();
                    $result = new DBError($error["code"], $error["message"]);
                    echo(json_encode($result));
                } else {
                    while ($status = oci_fetch_assoc($cursor))
                        array_push($statuses, $status);
                }
            }
        }
        $result -> statuses = $statuses;


        /* Получение списка всех причин отклонения заявки */
        if (!$statement = oci_parse($connection, "begin pkg_auto.p_get_reject_reasons(:data); end;")) {
             $error = oci_error();
             $result = new DBError($error["code"], $error["message"]);
             echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":data", $cursor, -1, OCI_B_CURSOR)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_execute($statement)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            } else {
                if (!oci_execute($cursor)) {
                    $error = oci_error();
                    $result = new DBError($error["code"], $error["message"]);
                    echo(json_encode($result));
                } else {
                    while ($reject_reason = oci_fetch_assoc($cursor))
                        array_push($rejectReasons, $reject_reason);
                }
            }
        }
        $result -> rejectReasons = $rejectReasons;


        /* Получение списка всех пунктов назначения */
        if (!$statement = oci_parse($connection, "begin pkg_auto.p_get_routes(:data); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":data", $cursor, -1, OCI_B_CURSOR)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_execute($statement)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            } else {
                if (!oci_execute($cursor)) {
                    $error = oci_error();
                    $result = new DBError($error["code"], $error["message"]);
                    echo(json_encode($result));
                } else {
                    while ($route = oci_fetch_assoc($cursor))
                        array_push($routes, $route);
                }
            }
        }
        $result -> routes = $routes;


        /* Получение списка всех типов транспортных средств */
        if (!$statement = oci_parse($connection, "begin pkg_auto.p_get_vehicle_types(:data); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":data", $cursor, -1, OCI_B_CURSOR)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_execute($statement)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            } else {
                if (!oci_execute($cursor)) {
                    $error = oci_error();
                    $result = new DBError($error["code"], $error["message"]);
                    echo(json_encode($result));
                } else {
                    while ($vehicleType = oci_fetch_assoc($cursor))
                        array_push($vehicleTypes, $vehicleType);
                }
            }
        }
        $result -> vehicleTypes = $vehicleTypes;


        /* Получение списка всех типов транспортных средств */
        if (!$statement = oci_parse($connection, "begin pkg_auto.p_get_vehicle_subtypes(:data); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":data", $cursor, -1, OCI_B_CURSOR)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_execute($statement)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            } else {
                if (!oci_execute($cursor)) {
                    $error = oci_error();
                    $result = new DBError($error["code"], $error["message"]);
                    echo(json_encode($result));
                } else {
                    while ($vehicleSubType = oci_fetch_assoc($cursor))
                        array_push($vehicleSubTypes, $vehicleSubType);
                }
            }
        }
        $result -> vehicleSubTypes = $vehicleSubTypes;


        /* Получение списка всех типов транспортных средств */
        if (!$statement = oci_parse($connection, "begin pkg_auto.p_get_vehicle_subtypes(:data); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":data", $cursor, -1, OCI_B_CURSOR)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_execute($statement)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            } else {
                if (!oci_execute($cursor)) {
                    $error = oci_error();
                    $result = new DBError($error["code"], $error["message"]);
                    echo(json_encode($result));
                } else {
                    while ($vehicle = oci_fetch_assoc($cursor))
                        array_push($vehicles, $vehicle);
                }
            }
        }
        $result -> vehicles = $vehicles;


        /* Получение списка всех водителей */
        if (!$statement = oci_parse($connection, "begin pkg_auto.p_get_drivers(:data); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":data", $cursor, -1, OCI_B_CURSOR)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_execute($statement)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            } else {
                if (!oci_execute($cursor)) {
                    $error = oci_error();
                    $result = new DBError($error["code"], $error["message"]);
                    echo(json_encode($result));
                } else {
                    while ($driver = oci_fetch_assoc($cursor))
                        array_push($drivers, $driver);
                }
            }
        }
        $result -> drivers = $drivers;


        /* Получение списка всех производственных отделения */
        if (!$statement = oci_parse($connection, "begin pkg_auto.p_get_departments(:data); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":data", $cursor, -1, OCI_B_CURSOR)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_execute($statement)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            } else {
                if (!oci_execute($cursor)) {
                    $error = oci_error();
                    $result = new DBError($error["code"], $error["message"]);
                    echo(json_encode($result));
                } else {
                    while ($department = oci_fetch_assoc($cursor))
                        array_push($departments, $department);
                }
            }
        }
        $result -> departments = $departments;


        /* Получение списка всех пользователей */
        if (!$statement = oci_parse($connection, "begin pkg_auto.p_get_users(:data); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":data", $cursor, -1, OCI_B_CURSOR)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_execute($statement)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            } else {
                if (!oci_execute($cursor)) {
                    $error = oci_error();
                    $result = new DBError($error["code"], $error["message"]);
                    echo(json_encode($result));
                } else {
                    while ($user = oci_fetch_assoc($cursor))
                        array_push($users, $user);
                }
            }
        }
        $result -> users = $users;


        /* Получение списка всех отделов */
        if (!$statement = oci_parse($connection, "begin pkg_auto.p_get_divisions(:data); end;")) {
            $error = oci_error();
            $result = new DBError($error["code"], $error["message"]);
            echo(json_encode($result));
        } else {
            if (!oci_bind_by_name($statement, ":data", $cursor, -1, OCI_B_CURSOR)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            }
            if (!oci_execute($statement)) {
                $error = oci_error();
                $result = new DBError($error["code"], $error["message"]);
                echo(json_encode($result));
            } else {
                if (!oci_execute($cursor)) {
                    $error = oci_error();
                    $result = new DBError($error["code"], $error["message"]);
                    echo(json_encode($result));
                } else {
                    while ($division = oci_fetch_assoc($cursor))
                        array_push($divisions, $division);
                }
            }
        }
        $result -> divisions = $divisions;

    }


    /* Освобождение ресурсов */
    oci_free_statement($statement);
    oci_free_statement($cursor);

    /* Возврат результата */
    echo json_encode($result);

?>