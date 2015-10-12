<?php
    /** Error reporting */
    error_reporting(E_ALL);
    ini_set('display_errors', TRUE);
    ini_set('display_startup_errors', TRUE);

    if (PHP_SAPI == 'cli')
    	die('This example should only be run from a Web Browser');

    require_once '../../php/Classes/PHPExcel.php';

    if(isset($_GET['driver']))
        $driverId = $_GET['driver'];

    if(isset($_GET['start']))
        $start = $_GET['start'];

    if(isset($_GET['end']))
        $end = $_GET['end'];

    //if(isset($_GET['date']))
    //    $reportDate = $_GET['date'];

    $date = getdate($start);
    $date_day = $date["mday"];
    if($date_day < 10)
        $date_day = "0".$date_day;
    $date_month = $date["mon"];
    if($date_month < 10)
        $date_month = "0".$date_month;
    $date = $date_day.".".$date_month.".".$date['year'];


    $requests = array();
    $driver = array();

    $objPHPExcel = new PHPExcel();
    $objPHPExcel->removeSheetByIndex(0);
    $worksheet = new PHPExcel_Worksheet($objPHPExcel, "Расписание поездок");
    $objPHPExcel->addSheet($worksheet, 1);

    $con = oci_connect('purchases', 'PURCHASES', '192.168.50.52/ORCLWORK', 'AL32UTF8');
     if(!$con){
        oci_close($con);
        die('Ошибка подключения к базе');
    }

    date_default_timezone_set("Etc/GMT-4");

    $query_driver = "SELECT *
                     FROM DRIVERS
                     WHERE DRIVERS.DRVR_ID = $driverId";
    $statement = oci_parse($con, $query_driver);

    if(oci_execute($statement, OCI_DEFAULT)){
        while($res = oci_fetch_array($statement))
            array_push($driver, $res);
    } else
        die("Не удалось выполнить запрос");

    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A2', 'Информация о заявке');
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('B2', 'Заказчик');
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('C2', 'Продолжительность поездки');
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('D2', 'Маршрут');
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('E2', 'Транспортная единица');
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('F2', 'Подробности о поездке');
    $objPHPExcel->getActiveSheet()->mergeCells('A1:F1');
    $objPHPExcel->getActiveSheet()->setCellValue('A1', "Обзор заявок для ".$driver[0]["FIO"]." на ".$date);

    $objPHPExcel->getActiveSheet()->getDefaultColumnDimension()->setWidth(35);
    //$objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(30);
    //$objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(30);
    //$objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(30);
    //$objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(30);
    //$objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(30);
    //$objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(30);

    $query_requests = "SELECT *
                       FROM V_AUTO_REQUESTS
                       WHERE V_AUTO_REQUESTS.START_TIME >= '{$start}' AND
                             V_AUTO_REQUESTS.START_TIME <= '{$end}' AND
                             V_AUTO_REQUESTS.DRIVER_ID = $driverId AND
                             V_AUTO_REQUESTS.REQUEST_STATUS = 2
                       ORDER BY V_AUTO_REQUESTS.START_TIME ASC";
    $statement2 = oci_parse($con, $query_requests);

    if(oci_execute($statement2, OCI_DEFAULT)){
        while($res = oci_fetch_array($statement2))
            array_push($requests, $res);
    } else
        die("Не удалось выполнить запрос");


            $rows = 2;
    for($x = 0; $x < sizeof($requests); $x++){

            $requestId = $requests[$x]['REQUEST_ID'];
            $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(0, $x+3 , "Заявка #".$requestId." от ".$requests[$x]["REQUEST_DATE"]);

            $user = $requests[$x]['FAM_NAME']." ".$requests[$x]["FST_NAME"]." ".$requests[$x]["LST_NAME"];
            $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(1, $x+3 , $user);

                //$info = $requests[$x]['REQUEST_DATE']." в ".$requests[$x]['REQUEST_TIME'];
                //$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(1, $x+3, $info);

                //$userFio = $requests[$x]['FAM_NAME']." ".$requests[$x]['FST_NAME']." ".$requests[$x]['LST_NAME'];
                //$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(2, $x+3, $userFio);

                //date_default_timezone_set("Etc/GMT-4");

                //$timeOut = date("H:i", $requests[$x]['START_TIME']);
                //if($timeOut < 10)
                //    $timeOut = "0".$timeOut;
                //$out = $requests[$x]['START_DATE']." в ".$timeOut;
                //$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(3, $x+3, $out);

                //$timeIn = date("H:i", $requests[$x]['END_TIME']);
                //if($timeIn < 10)
                //    $timeIn = "0".$timeIn;
                //$in = $requests[$x]['END_DATE']." в ".$timeIn;
                //$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(4, $x+3, $in);

            $start_time = getdate($requests[$x]["START_TIME"]);
            $start_day = $start_time["mday"];
            if($start_day < 10)
                $start_day = "0".$start_day;
            $start_month = $start_time["mon"];
            if($start_month < 10)
                $start_month = "0".$start_month;
            $start_hour = $start_time["hours"];
            if($start_hour < 10)
                $start_hour = "0".$start_hour;
            $start_minute = $start_time["minutes"];
            if($start_minute < 10)
                $start_minute = "0".$start_minute;
            $final_start_time = $start_day.".".$start_month.".".$start_time["year"]." ".$start_hour.":".$start_minute;
            $end_time = getdate($requests[$x]["END_TIME"]);
            $end_day = $end_time["mday"];
            if($end_day < 10)
                $end_day = "0".$end_day;
            $end_month = $end_time["mon"];
            if($end_month < 10)
                $end_month = "0".$end_month;
            $end_hour = $end_time["hours"];
            if($end_hour < 10)
                $end_hour = "0".$end_hour;
            $end_minute = $end_time["minutes"];
            if($end_minute < 10)
                $end_minute = "0".$end_minute;
            $final_end_time = $end_day.".".$end_month.".".$end_time["year"]." ".$end_hour.":".$end_minute;
            $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(2, $x+3 , $final_start_time." - ".$final_end_time);


            $route = $requests[$x]["REQUEST_ROUTE"];
            $routes = explode(";", $route);
            $final_route = "";
            for($o = 0; $o < sizeof($routes); $o++){
                $final_route = $final_route.$routes[$o];
                if($o < sizeof($routes) - 1){
                    $final_route = $final_route." - ";
                }
            }
            $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(3, $x+3, $final_route);
            $objPHPExcel->getActiveSheet()->getStyle('A1:D4') ->getAlignment()->setWrapText(true);

            $transportItem = $requests[$x]['ITEM_TITLE'];
            if($transportItem <> "")
                $transportItem = $requests[$x]['ITEM_TITLE']." (".$requests[$x]['ITEM_GID'].")";
            else
                $transportItem = "Не назначена";
            $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(4, $x+3, $transportItem);

                //$driver = $requests[$x]['FIO'];
                //if($driver <> "")
                //   $driver = $requests[$x]['FIO'];
                //else
                //    $driver = "Не назначен";
                //$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(6, $x+3, $driver);

            $infoExt = $requests[$x]['REQUEST_INFO'];
            $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(5, $x+3, $infoExt);

                //$status = $requests[$x]['STATUS_TITLE'];
                //$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(8, $x+3, $status);
                $rows++;
    }

     $rows = 'A2:F'.$rows;
            $styleArray = array(
                'borders' => array(
                    'allborders' => array(
                        'style' => PHPExcel_Style_Border::BORDER_THIN,
                        'color' => array(
                            'rgb' => '000000'
                        ),
                    ),
                ),

                     'alignment' => array(
                            'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
                            'vertical' => PHPExcel_Style_alignment::VERTICAL_TOP
                        ),
            );

    $objPHPExcel->getActiveSheet()->getStyle($rows)->applyFromArray($styleArray);
    $objPHPExcel->getActiveSheet()->getStyle($rows) ->getAlignment()->setWrapText(true);
    //$objPHPExcel->getActiveSheet()->getStyle('A3:A'.$rows) ->getAlignment()->setWrapText(true);




    header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    header('Content-Disposition: attachment;filename="report.xlsx"');
    header('Cache-Control: max-age=0');
    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
    $objWriter->save('php://output');
    exit;
?>