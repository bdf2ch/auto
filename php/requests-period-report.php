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

    $objPHPExcel = new PHPExcel();
    $objPHPExcel->removeSheetByIndex(0);
    $worksheet = new PHPExcel_Worksheet($objPHPExcel, 'Обзор заявок');
    $objPHPExcel->addSheet($worksheet, 1);
    $objPHPExcel->setActiveSheetIndex(0);

    $objPHPExcel->getActiveSheet()->getPageSetup()->setOrientation(PHPExcel_Worksheet_PageSetup::ORIENTATION_LANDSCAPE);
    $objPHPExcel->getActiveSheet()->getPageSetup()->setPaperSize(PHPExcel_Worksheet_PageSetup::PAPERSIZE_A4);
    $objPHPExcel->getActiveSheet()->getPageMargins()->setTop(1.5);
    $objPHPExcel->getActiveSheet()->getPageMargins()->setRight(0.5);
    $objPHPExcel->getActiveSheet()->getPageMargins()->setLeft(0.5);
    $objPHPExcel->getActiveSheet()->getPageMargins()->setBottom(1.5);

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
            'vertical' => PHPExcel_Style_Alignment::VERTICAL_BOTTOM
        ),
        'font' => array(
            'size' => '18'
        )
    );


    $regularStyle = array(
        'alignment' => array(
            'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
            'vertical' => PHPExcel_Style_Alignment::VERTICAL_CENTER
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

     $requestHeaderStyle = array(
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
            ),
            'fill' => array(
                        'type' => PHPExcel_Style_Fill::FILL_SOLID,
                        'color' => array(
                            'rgb' => "D3D3D3"
                        )
             )
     );

     $requestInfoStyle = array(
                 'alignment' => array(
                     'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
                     'vertical' => PHPExcel_Style_alignment::VERTICAL_CENTER
                 ),
                 'font' => array(
                     'size' => '11',
                     'italic' => true
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

   /*
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
    */

    $objPHPExcel->getActiveSheet()->mergeCells('A1:N1');
    $objPHPExcel->getActiveSheet()->getStyle('A1:N1')->applyFromArray($headerStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A1', 'Обзор заявок за период с '.$start_date.' по '.$end_date);


    $objPHPExcel->getActiveSheet()->mergeCells('A2:C2');
    $objPHPExcel->getActiveSheet()->getStyle('A2:C2')->applyFromArray($regularStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A2', 'Заказчик');
    $objPHPExcel->getActiveSheet()->mergeCells('D2:G2');
    $objPHPExcel->getActiveSheet()->getStyle('D2:G2')->applyFromArray($regularStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('D2', 'Продолжительность / маршрут');
    $objPHPExcel->getActiveSheet()->mergeCells('H2:K2');
    $objPHPExcel->getActiveSheet()->getStyle('H2:K2')->applyFromArray($regularStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('H2', 'Подробности о поездке');
    $objPHPExcel->getActiveSheet()->mergeCells('L2:N2');
    $objPHPExcel->getActiveSheet()->getStyle('L2:N2')->applyFromArray($regularStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('L2', 'Водитель / транспорт');

    $temp = 3;
    for($x = 0; $x < sizeof($requests); $x++){

        $merge = "A".($temp).":N".($temp);
        $objPHPExcel->getActiveSheet()->mergeCells($merge);
        $objPHPExcel->getActiveSheet()->getStyle($merge)->applyFromArray($requestHeaderStyle);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(0, $temp , "ЗАЯВКА #".$requests[$x]['REQUEST_ID']." от ".$requests[$x]['REQUEST_DATE'].' '.$requests[$x]['REQUEST_TIME'].' на '.$requests[$x]['TRANSPORT_SUBTYPE_TITLE']);

        $merge = "A".($temp+1).":C".($temp+2);
        $objPHPExcel->getActiveSheet()->mergeCells($merge);
        $objPHPExcel->getActiveSheet()->getStyle($merge)->applyFromArray($regularStyle);
        $objPHPExcel->getActiveSheet()->getRowDimension($temp + 1)->setRowHeight(30);
        $objPHPExcel->getActiveSheet()->getRowDimension($temp + 2)->setRowHeight(50);
        $objPHPExcel->getActiveSheet()->getStyle($merge) ->getAlignment()->setWrapText(true);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(0, $temp + 1 , $requests[$x]['FAM_NAME']." ".$requests[$x]['FST_NAME']." ".$requests[$x]['LST_NAME']);

        //$merge = "A".($temp+2).":C".($temp+2);
        //$objPHPExcel->getActiveSheet()->mergeCells($merge);
        //$objPHPExcel->getActiveSheet()->getStyle($merge)->applyFromArray($regularStyle);
        //$objPHPExcel->getActiveSheet()->getStyle($merge) ->getAlignment()->setWrapText(true);
        //$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(0, $temp + 2 , $requests[$x]['DIVISION_TITLE']);

        $merge = "D".($temp+1).":G".($temp+1);
        $objPHPExcel->getActiveSheet()->mergeCells($merge);
        $objPHPExcel->getActiveSheet()->getStyle($merge)->applyFromArray($regularStyle);
        $objPHPExcel->getActiveSheet()->getStyle($merge) ->getAlignment()->setWrapText(true);
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
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(3, $temp + 1 , $final_start_time." - ".$final_end_time);

        $merge = "D".($temp+2).":G".($temp+2);
        $objPHPExcel->getActiveSheet()->mergeCells($merge);
        $objPHPExcel->getActiveSheet()->getStyle($merge)->applyFromArray($regularStyle);
        $objPHPExcel->getActiveSheet()->getStyle($merge) ->getAlignment()->setWrapText(true);
        $route = $requests[$x]["REQUEST_ROUTE"];
        $routes = explode(";", $route);
        $final_route = "";
        for($o = 0; $o < sizeof($routes); $o++){
            $final_route = $final_route.$routes[$o];
            if($o < sizeof($routes) - 1){
                $final_route = $final_route." - ";
            }
        }
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(3, $temp + 2 , $final_route);

        $merge = "H".($temp+1).":K".($temp+2);
        $objPHPExcel->getActiveSheet()->mergeCells($merge);
        $objPHPExcel->getActiveSheet()->getStyle($merge)->applyFromArray($requestInfoStyle);
        $objPHPExcel->getActiveSheet()->getStyle($merge) ->getAlignment()->setWrapText(true);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(7, $temp+1 , $requests[$x]['REQUEST_INFO']);


        $merge = "L".($temp+1).":N".($temp+1);
        $objPHPExcel->getActiveSheet()->mergeCells($merge);
        $objPHPExcel->getActiveSheet()->getStyle($merge)->applyFromArray($regularStyle);
        $objPHPExcel->getActiveSheet()->getStyle($merge) ->getAlignment()->setWrapText(true);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(11, $temp+1 , $requests[$x]['FIO']);

        $merge = "L".($temp+2).":N".($temp+2);
        $objPHPExcel->getActiveSheet()->mergeCells($merge);
        $objPHPExcel->getActiveSheet()->getStyle($merge)->applyFromArray($regularStyle);
        $objPHPExcel->getActiveSheet()->getStyle($merge) ->getAlignment()->setWrapText(true);
        $transportItem = $requests[$x]['ITEM_TITLE'];
        if($transportItem <> "" && $requests[$x]['ITEM_ID'] <> 0)
            $transportItem = $requests[$x]['ITEM_TITLE']." (".$requests[$x]['ITEM_GID'].")";
        else
            $transportItem = "Не назначена";
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(11, $temp+2 , $transportItem);

        $temp = $temp + 3;

    }

    header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    header('Content-Disposition: attachment;filename="Обзор заявок.xlsx"');
    header('Cache-Control: max-age=0');
    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
    $objWriter->save('php://output');
    exit;
