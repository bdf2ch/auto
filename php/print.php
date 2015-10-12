<?php
    /** Error reporting */
    //error_reporting(E_ALL);
    ini_set('display_errors', TRUE);
    ini_set('display_startup_errors', TRUE);

    if (PHP_SAPI == 'cli')
    	die('This example should only be run from a Web Browser');
    include "../../php/user.class.php";
    require_once '../../php/Classes/PHPExcel.php';

    if(isset($_GET['id']))
        $id = $_GET['id'];

    $request = null;
    $temp_client = new user();
    //print_r($temp_client);

    $objPHPExcel = new PHPExcel();
    $objPHPExcel->removeSheetByIndex(0);
    $worksheet = new PHPExcel_Worksheet($objPHPExcel, "Заявка #".$id);
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

    $query_driver = "SELECT *
                     FROM V_AUTO_REQUESTS
                     WHERE V_AUTO_REQUESTS.REQUEST_ID = $id";
    $statement = oci_parse($con, $query_driver);

    if(oci_execute($statement, OCI_DEFAULT)){
        while($res = oci_fetch_array($statement))
            $request = $res;
    } else
        die("Не удалось выполнить запрос");

    $toStyle = array(
                  'alignment' => array(
                      'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_RIGHT,
                      'vertical' => PHPExcel_Style_alignment::VERTICAL_TOP
                  ),
                  'font' => array(
                      'size' => '14'
                  )
              );

    $headerStyle = array(
              'alignment' => array(
                  'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
                  'vertical' => PHPExcel_Style_alignment::VERTICAL_TOP
              ),
              'font' => array(
                  'size' => '20'
              )
          );

           $headerStyleBold = array(
                'alignment' => array(
                    'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
                    'vertical' => PHPExcel_Style_alignment::VERTICAL_TOP
                ),
                'font' => array(
                    'bold' => true,
                    'size' => '24'
                ),
                'borders' => array(
                    'bottom' => array(
                        'style' => PHPExcel_Style_Border::BORDER_THIN,
                        'color' => array(
                            'rgb' => '000000'
                        ),
                    ),
                )
           );

    $routeStyle = array(
        'alignment' => array(
            'vertical' => PHPExcel_Style_alignment::VERTICAL_TOP
        ),
        'font' => array(
            'size' => '14'
        )
    );

    $footerStyle = array(
              'borders' => array(
                  'bottom' => array(
                      'style' => PHPExcel_Style_Border::BORDER_THIN,
                      'color' => array(
                          'rgb' => '000000'
                      ),
                  ),
              )
          );

    $footerTextStyle = array(
        'font' => array(
            'size' => '10'
        ),
        'alignment' => array(
            'vertical' => PHPExcel_Style_alignment::VERTICAL_TOP
        )
    );


    $objPHPExcel->getActiveSheet()->mergeCells('B1:D1');
    $objPHPExcel->getActiveSheet()->getStyle('B1:D1')->applyFromArray($footerStyle);
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




    header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    header('Content-Disposition: attachment;filename="report.xls"');
    header('Cache-Control: max-age=0');
    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
    $objWriter->save('php://output');
    exit;
?>