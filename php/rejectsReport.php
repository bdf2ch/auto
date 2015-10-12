<?php
    /** Error reporting */
    //error_reporting(E_ALL);
    ini_set('display_errors', TRUE);
    ini_set('display_startup_errors', TRUE);

    if (PHP_SAPI == 'cli')
    	die('This example should only be run from a Web Browser');
    include "../../php/user.class.php";
    require_once '../../php/Classes/PHPExcel.php';

    if(isset($_GET['start']))
        $start = $_GET['start'];

    if(isset($_GET['end']))
        $end = $_GET['end'];

    if(isset($_GET['department']))
        $department = $_GET['department'];

    $start_date = getdate($start);
    $start_date_day = $start_date["mday"];
    if($start_date_day < 10)
        $start_date_day = "0".$start_date_day;
    $start_date_month = $start_date["mon"];
    if($start_date_month < 10)
        $start_date_month = "0".$start_date_month;
    $start_date = $start_date_day.".".$start_date_month.".".$start_date['year'];

    $end_date = getdate($end);
    $end_date_day = $end_date["mday"];
    if($end_date_day < 10)
        $end_date_day = "0".$end_date_day;
        $end_date_month = $end_date["mon"];
    if($end_date_month < 10)
        $end_date_month = "0".$end_date_month;
    $end_date = $end_date_day.".".$end_date_month.".".$end_date['year'];

    $requests = array();
    $driver_rejects = 0;
    $transport_rejects = 0;
    $self_rejects = 0;
    $empty_rejects = 0;
    $total_rejects = 0;

    $objPHPExcel = new PHPExcel();
    $objPHPExcel->removeSheetByIndex(0);
    $worksheet = new PHPExcel_Worksheet($objPHPExcel, "Отчет по отклоненным заявкам".$id);
    $objPHPExcel->addSheet($worksheet, 1);
    $objPHPExcel->setActiveSheetIndex(0);

    $objPHPExcel->getActiveSheet()->getPageSetup()->setOrientation(PHPExcel_Worksheet_PageSetup::ORIENTATION_PORTRAIT);
    $objPHPExcel->getActiveSheet()->getPageSetup()->setPaperSize(PHPExcel_Worksheet_PageSetup::PAPERSIZE_A4);

    $con = oci_connect('purchases', 'PURCHASES', '192.168.50.52/ORCLWORK', 'AL32UTF8');
     if(!$con){
        oci_close($con);
        die('Ошибка подключения к базе');
    }

    date_default_timezone_set("Etc/GMT-4");

    $query = "SELECT *
              FROM V_AUTO_REQUESTS
              WHERE V_AUTO_REQUESTS.START_TIME >= '{$start}' AND
                    V_AUTO_REQUESTS.START_TIME <= '{$end}' AND
                    V_AUTO_REQUESTS.STATUS_ID = 3 AND
                    V_AUTO_REQUESTS.REQUEST_DEPARTMENT = $department";
    $statement = oci_parse($con, $query);

    if(oci_execute($statement, OCI_DEFAULT)){
        while($res = oci_fetch_array($statement))
            $requests[] = $res;
    } else
        die("Не удалось выполнить запрос");


    $headerStyle = array(
        'alignment' => array(
            'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_LEFT,
            'vertical' => PHPExcel_Style_alignment::VERTICAL_BOTTOM
        ),
        'font' => array(
            'size' => '18'
        )
    );

    $regularStyle = array(
        'alignment' => array(
            'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
            'vertical' => PHPExcel_Style_alignment::VERTICAL_CENTER
        ),
        'font' => array(
            'size' => '11'
        ),
        'borders' => array(
            'bottom' => array(
                'style' => PHPExcel_Style_Border::BORDER_THIN,
                'color' => array(
                    'rgb' => '000000'
                ),
            ),
            'top' => array(
                'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    ),
            ),
            'left' => array(
                'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    ),
            ),
            'right' => array(
                'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    ),
            )
        )
    );

    $footerNormalStyle = array(
            'alignment' => array(
                'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_LEFT,
                'vertical' => PHPExcel_Style_alignment::VERTICAL_CENTER
            ),
            'font' => array(
                'size' => '11'
            ),
            'borders' => array(
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    ),
                ),
                'top' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                        'color' => array(
                            'rgb' => '000000'
                        ),
                ),
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                        'color' => array(
                            'rgb' => '000000'
                        ),
                ),
                'right' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                        'color' => array(
                            'rgb' => '000000'
                        ),
                )
            )
        );

         $footerBoldStyle = array(
                    'alignment' => array(
                        'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_LEFT,
                        'vertical' => PHPExcel_Style_alignment::VERTICAL_CENTER
                    ),
                    'font' => array(
                        'size' => '11',
                        'bold' => true
                    ),
                    'borders' => array(
                        'bottom' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => '000000'
                            ),
                        ),
                        'top' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                                'color' => array(
                                    'rgb' => '000000'
                                ),
                        ),
                        'left' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                                'color' => array(
                                    'rgb' => '000000'
                                ),
                        ),
                        'right' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                                'color' => array(
                                    'rgb' => '000000'
                                ),
                        )
                    )
         );

         $footerBoldCenterStyle = array(
                             'alignment' => array(
                                 'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
                                 'vertical' => PHPExcel_Style_alignment::VERTICAL_CENTER
                             ),
                             'font' => array(
                                 'size' => '11',
                                 'bold' => true
                             ),
                             'borders' => array(
                                 'bottom' => array(
                                     'style' => PHPExcel_Style_Border::BORDER_THIN,
                                     'color' => array(
                                         'rgb' => '000000'
                                     ),
                                 ),
                                 'top' => array(
                                     'style' => PHPExcel_Style_Border::BORDER_THIN,
                                         'color' => array(
                                             'rgb' => '000000'
                                         ),
                                 ),
                                 'left' => array(
                                     'style' => PHPExcel_Style_Border::BORDER_THIN,
                                         'color' => array(
                                             'rgb' => '000000'
                                         ),
                                 ),
                                 'right' => array(
                                     'style' => PHPExcel_Style_Border::BORDER_THIN,
                                         'color' => array(
                                             'rgb' => '000000'
                                         ),
                                 )
                             )
                  );


    $objPHPExcel->getActiveSheet()->mergeCells('A1:N1');
    $objPHPExcel->getActiveSheet()->getStyle('A1:N1')->applyFromArray($headerStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A1', 'Отчет по отклоненным заявкам за период с '.$start_date.' по '.$end_date);

    $objPHPExcel->getActiveSheet()->mergeCells('A2:B2');
    $objPHPExcel->getActiveSheet()->getStyle('A2:B2')->applyFromArray($regularStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A2', 'Заявка');
    $objPHPExcel->getActiveSheet()->mergeCells('C2:G2');
    $objPHPExcel->getActiveSheet()->getStyle('C2:G2')->applyFromArray($regularStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('C2', 'Заказчик');
    $objPHPExcel->getActiveSheet()->mergeCells('H2:K2');
    $objPHPExcel->getActiveSheet()->getStyle('H2:K2')->applyFromArray($regularStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('H2', 'Тип транспорта');
    $objPHPExcel->getActiveSheet()->mergeCells('L2:N2');
    $objPHPExcel->getActiveSheet()->getStyle('L2:N2')->applyFromArray($regularStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('L2', 'Причина отказа');

    for($x = 0; $x < sizeof($requests); $x++){
        if($requests[$x]['REASON_ID'] == 0)
            $empty_rejects++;
        if($requests[$x]['REASON_ID'] == 1)
            $self_rejects++;
        if($requests[$x]['REASON_ID'] == 2)
            $transport_rejects++;
        if($requests[$x]['REASON_ID'] == 3)
            $driver_rejects++;
        $total_rejects++;

        $merge = "A".($x+3).":B".($x+3);
        $objPHPExcel->getActiveSheet()->mergeCells($merge);
        $objPHPExcel->getActiveSheet()->getRowDimension($x+3)->setRowHeight(30);
        $objPHPExcel->getActiveSheet()->getStyle($merge)->applyFromArray($regularStyle);
        $objPHPExcel->getActiveSheet()->getStyle($merge) ->getAlignment()->setWrapText(true);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(0, $x+3 , "#".$requests[$x]['REQUEST_ID']." от ".$requests[$x]['REQUEST_DATE'].' '.$requests[$x]['REQUEST_TIME']);

        $merge = "C".($x+3).":G".($x+3);
        $objPHPExcel->getActiveSheet()->mergeCells($merge);
        $objPHPExcel->getActiveSheet()->getStyle($merge)->applyFromArray($regularStyle);
        $objPHPExcel->getActiveSheet()->getStyle($merge) ->getAlignment()->setWrapText(true);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(2, $x+3 , $requests[$x]['FAM_NAME']." ".$requests[$x]['FST_NAME']." ".$requests[$x]['LST_NAME']);

        $merge = "H".($x+3).":K".($x+3);
        $objPHPExcel->getActiveSheet()->mergeCells($merge);
        $objPHPExcel->getActiveSheet()->getStyle($merge)->applyFromArray($regularStyle);
        $objPHPExcel->getActiveSheet()->getStyle($merge) ->getAlignment()->setWrapText(true);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(7, $x+3 , $requests[$x]['TRANSPORT_SUBTYPE_TITLE']);

        $merge = "L".($x+3).":N".($x+3);
        $objPHPExcel->getActiveSheet()->mergeCells($merge);
        $objPHPExcel->getActiveSheet()->getStyle($merge)->applyFromArray($regularStyle);
        $objPHPExcel->getActiveSheet()->getStyle($merge) ->getAlignment()->setWrapText(true);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(11, $x+3 , $requests[$x]['REASON_TITLE']);
    }

     $merge = "A".($total_rejects+3).":M".($total_rejects+3);
     $objPHPExcel->getActiveSheet()->mergeCells($merge);
     $objPHPExcel->getActiveSheet()->getStyle($merge)->applyFromArray($footerNormalStyle);
     $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(0, $total_rejects+3 , "Заявок отклонено без указания причины");
     $merge = "N".($total_rejects+3);
     $objPHPExcel->getActiveSheet()->getStyle($merge)->applyFromArray($regularStyle);
     $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(13, $total_rejects+3 , $empty_rejects);

     $merge = "A".($total_rejects+4).":M".($total_rejects+4);
     $objPHPExcel->getActiveSheet()->mergeCells($merge);
     $objPHPExcel->getActiveSheet()->getStyle($merge)->applyFromArray($footerNormalStyle);
     $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(0, $total_rejects+4 , "Заявок отклонено по причине ".'"'."Отказ заявителя".'"');
     $merge = "N".($total_rejects+4);
     $objPHPExcel->getActiveSheet()->getStyle($merge)->applyFromArray($regularStyle);
     $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(13, $total_rejects+4 , $self_rejects);

     $merge = "A".($total_rejects+5).":M".($total_rejects+5);
     $objPHPExcel->getActiveSheet()->mergeCells($merge);
     $objPHPExcel->getActiveSheet()->getStyle($merge)->applyFromArray($footerNormalStyle);
     $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(0, $total_rejects+5 , "Заявок отклонено по причине ".'"'."Отсутствие транспорта".'"');
     $merge = "N".($total_rejects+5);
     $objPHPExcel->getActiveSheet()->getStyle($merge)->applyFromArray($regularStyle);
     $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(13, $total_rejects+5 , $transport_rejects);

     $merge = "A".($total_rejects+6).":M".($total_rejects+6);
     $objPHPExcel->getActiveSheet()->mergeCells($merge);
     $objPHPExcel->getActiveSheet()->getStyle($merge)->applyFromArray($footerNormalStyle);
     $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(0, $total_rejects+6 , "Заявок отклонено по причине ".'"'."Отсутствие водителя".'"');
     $merge = "N".($total_rejects+6);
     $objPHPExcel->getActiveSheet()->getStyle($merge)->applyFromArray($regularStyle);
     $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(13, $total_rejects+6 , $driver_rejects);

     $merge = "A".($total_rejects+7).":M".($total_rejects+7);
     $objPHPExcel->getActiveSheet()->mergeCells($merge);
     $objPHPExcel->getActiveSheet()->getStyle($merge)->applyFromArray($footerBoldStyle);
     $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(0, $total_rejects+7 , "Всего за отчетный период отклонено заявок");
     $merge = "N".($total_rejects+7);
     $objPHPExcel->getActiveSheet()->getStyle($merge)->applyFromArray($footerBoldCenterStyle);
     $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(13, $total_rejects+7 , $total_rejects);
/*
    $objPHPExcel->getActiveSheet()->mergeCells('E1:I1');
    $objPHPExcel->getActiveSheet()->getStyle('E1:I1')->applyFromArray($toStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('E1', ' ПО '.$temp_client->getVisibilityAreaTilte());
    $objPHPExcel->getActiveSheet()->mergeCells('C2:I2');
    $objPHPExcel->getActiveSheet()->getStyle('C2:I2')->applyFromArray($toStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('C2', 'филиала ОАО «МРСК Северо-Запада» «Колэнерго»');
    $objPHPExcel->getActiveSheet()->mergeCells('D3:I3');
    $objPHPExcel->getActiveSheet()->getStyle('D3:I3')->applyFromArray($footerStyle);
    $objPHPExcel->getActiveSheet()->mergeCells('D4:I4');
    $objPHPExcel->getActiveSheet()->getStyle('D4:I4')->applyFromArray($footerTextStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('D4', 'Ф.И.О.');



    $objPHPExcel->getActiveSheet()->mergeCells('A8:I8');
    $objPHPExcel->getActiveSheet()->getStyle('A8:I8') ->getAlignment()->setWrapText(true);
    $objPHPExcel->getActiveSheet()->getStyle('A8:I8')->applyFromArray($headerStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A8', 'Заявка на выделение автотранспорта');
    $objPHPExcel->getActiveSheet()->mergeCells('A9:I9');
    $objPHPExcel->getActiveSheet()->getStyle('A9:I9')->applyFromArray($headerStyleBold);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A9', '# '.$request['REQUEST_ID'].' от '.$request['START_DATE'].' '.$request['REQUEST_TIME']);

    $objPHPExcel->getActiveSheet()->mergeCells('A11:D11');
    $objPHPExcel->getActiveSheet()->getStyle('A11:I11')->applyFromArray($routeStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A11', 'Заказчик:');
    $objPHPExcel->getActiveSheet()->mergeCells('E11:I11');
    $user = $request['FAM_NAME']." ".$request["FST_NAME"]." ".$request["LST_NAME"];
    $objPHPExcel->getActiveSheet()->setCellValue('E11' , $user);

    $objPHPExcel->getActiveSheet()->mergeCells('A13:D13');
     $objPHPExcel->getActiveSheet()->getStyle('A13:I13')->applyFromArray($routeStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A13', 'Продолжительность поездки:');
    $objPHPExcel->getActiveSheet()->mergeCells('E13:I13');
    $start_time = getdate($request["START_TIME"]);
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
    $end_time = getdate($request["END_TIME"]);
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
    $objPHPExcel->getActiveSheet()->setCellValue('E13' , $final_start_time." - ".$final_end_time);

    $objPHPExcel->getActiveSheet()->mergeCells('A15:D15');
    $objPHPExcel->getActiveSheet()->getStyle('A15:I15') ->getAlignment()->setWrapText(true);
    $objPHPExcel->getActiveSheet()->getStyle('A15:I15')->applyFromArray($routeStyle);
    $objPHPExcel->getActiveSheet()->getRowDimension('15')->setRowHeight(100);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A15', 'Маршрут поездки:');
    $objPHPExcel->getActiveSheet()->mergeCells('E15:I15');
    $route = $request["REQUEST_ROUTE"];
    $routes = explode(";", $route);
    $final_route = "";
    for($o = 0; $o < sizeof($routes); $o++){
        $final_route = $final_route.$routes[$o];
        if($o < sizeof($routes) - 1){
            $final_route = $final_route." - ";
        }
    }
    $objPHPExcel->getActiveSheet()->setCellValue('E15', $final_route);
    $objPHPExcel->getActiveSheet()->getStyle('E15') ->getAlignment()->setWrapText(true);

    $objPHPExcel->getActiveSheet()->mergeCells('A17:D17');
    $objPHPExcel->getActiveSheet()->getStyle('A17:I17') ->getAlignment()->setWrapText(true);
    $objPHPExcel->getActiveSheet()->getStyle('A17:I17')->applyFromArray($routeStyle);
    $objPHPExcel->getActiveSheet()->getRowDimension('17')->setRowHeight(100);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A17', 'Подробности о поездке:');
    $objPHPExcel->getActiveSheet()->mergeCells('E17:I17');
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('E17', $request['REQUEST_INFO']);

    $objPHPExcel->getActiveSheet()->mergeCells('A19:D19');
    $objPHPExcel->getActiveSheet()->getStyle('A19:I19') ->getAlignment()->setWrapText(true);
    $objPHPExcel->getActiveSheet()->getStyle('A19:I19')->applyFromArray($routeStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A19', 'Транспортная единица:');
    $objPHPExcel->getActiveSheet()->mergeCells('E19:I19');
    $transportItem = $request['ITEM_TITLE'];
    if($transportItem <> "" && $request['ITEM_ID'] <> 0)
        $transportItem = $request['ITEM_TITLE']." (".$request['ITEM_GID'].")";
    else
        $transportItem = "Не назначена";
    $objPHPExcel->getActiveSheet()->setCellValue('E19', $transportItem);

    $objPHPExcel->getActiveSheet()->mergeCells('A21:D21');
    $objPHPExcel->getActiveSheet()->getStyle('A21:I21') ->getAlignment()->setWrapText(true);
    $objPHPExcel->getActiveSheet()->getStyle('A21:I21')->applyFromArray($routeStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A21', 'Водитель:');
    $objPHPExcel->getActiveSheet()->mergeCells('E21:I21');
    $objPHPExcel->getActiveSheet()->setCellValue('E21', $request['FIO']);


    $objPHPExcel->getActiveSheet()->mergeCells('A27:C27');
    $objPHPExcel->getActiveSheet()->getStyle('A27:C27')->applyFromArray($footerStyle);
    $objPHPExcel->getActiveSheet()->getStyle('E27')->applyFromArray($footerStyle);
    $objPHPExcel->getActiveSheet()->mergeCells('G27:I27');
    $objPHPExcel->getActiveSheet()->getStyle('G27:I27')->applyFromArray($footerStyle);


    $objPHPExcel->getActiveSheet()->getRowDimension('28')->setRowHeight(25);
    $objPHPExcel->getActiveSheet()->getStyle('A28:I28') ->getAlignment()->setWrapText(true);
    $objPHPExcel->getActiveSheet()->mergeCells('A28:C28');
    $objPHPExcel->getActiveSheet()->getStyle('A28:C28')->applyFromArray($footerTextStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A28', 'Должность руководителя подразделения');

    $objPHPExcel->getActiveSheet()->getStyle('E28')->applyFromArray($footerTextStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('E28', 'Подпись');

    $objPHPExcel->getActiveSheet()->mergeCells('G28:I28');
    $objPHPExcel->getActiveSheet()->getStyle('G28:I28')->applyFromArray($footerTextStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('G28', 'Ф.И.О.');

    $objPHPExcel->getActiveSheet()->mergeCells('G31:I31');
    $objPHPExcel->getActiveSheet()->getStyle('G31:I31')->applyFromArray($toStyle);
    $current_date = getdate();
    $day = $current_date["mday"];
    if($day < 10)
        $day = "0".$day;
    $month = $current_date["mon"];
    if($month < 10)
        $month = "0".$month;
    $hour = $current_date["hours"];
    if($hour < 10)
        $hour = "0".$hour;
    $minute = $current_date["minutes"];
    if($minute < 10)
        $minute = "0".$minute;
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('G31', $day.'.'.$month.'.'.$current_date['year'].' '.$hour.':'.$minute);
    */



    header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    header('Content-Disposition: attachment;filename="report.xlsx"');
    header('Cache-Control: max-age=0');
    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
    $objWriter->save('php://output');
    exit;
