<?php
    /** Error reporting */
    //error_reporting(E_ALL);
    ini_set('display_errors', TRUE);
    ini_set('display_startup_errors', TRUE);

    if (PHP_SAPI == 'cli')
    	die('This example should only be run from a Web Browser');
    include "../../php/user.class.php";
    require_once '../../../php/Classes/PHPExcel.php';

    if(isset($_GET['start']))
        $start = $_GET['start'];

    if(isset($_GET['end']))
        $end = $_GET['end'];

    if(isset($_GET['department']))
        $department = $_GET['department'];

    $days = array();
    $current_date = getdate();
    $requests = array();

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



    $objPHPExcel = new PHPExcel();
    $objPHPExcel->removeSheetByIndex(0);
    $worksheet = new PHPExcel_Worksheet($objPHPExcel, 'График поездок');
    $objPHPExcel->addSheet($worksheet, 1);
    $objPHPExcel->setActiveSheetIndex(0);

    $objPHPExcel->getActiveSheet()->getPageSetup()->setOrientation(PHPExcel_Worksheet_PageSetup::ORIENTATION_LANDSCAPE);
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
                    V_AUTO_REQUESTS.REQUEST_DEPARTMENT = $department AND
                    V_AUTO_REQUESTS.REQUEST_REJECT_RECIEVED = 0
              ORDER BY V_AUTO_REQUESTS.REQUEST_ID ASC ";
    $statement = oci_parse($con, $query);

    if(oci_execute($statement, OCI_DEFAULT)){
        while($res = oci_fetch_array($statement))
            $requests[] = $res;
    } else
        die("Не удалось выполнить запрос");


    $pageHeaderAlignRight = array(
        'alignment' => array(
            'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_RIGHT,
            'vertical' => PHPExcel_Style_Alignment::VERTICAL_BOTTOM
        ),
        'font' => array(
            'size' => '14'
        )
    );

    $mainTitle = array(
        'alignment' => array(
            'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_LEFT,
            'vertical' => PHPExcel_Style_Alignment::VERTICAL_BOTTOM
        ),
        'font' => array(
            'size' => '16',
            'bold' => true
        )
    );


    $pageHeaderSign = array(
        'borders' => array(
            'bottom' => array(
                'style' => PHPExcel_Style_Border::BORDER_THIN,
                'color' => array(
                    'rgb' => '000000'
                )
            )
        )
    );

    $tableHeader = array(
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
                )
            )
        )
    );

    $user = array(
        'alignment' => array(
            'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
            'vertical' => PHPExcel_Style_Alignment::VERTICAL_CENTER
        ),
        'font' => array(
            'size' => '11'
        ),
        'borders' => array(
            'top' => array(
                'style' => PHPExcel_Style_Border::BORDER_THIN,
                'color' => array(
                    'rgb' => '000000'
                )
            ),
            'left' => array(
                'style' => PHPExcel_Style_Border::BORDER_THIN,
                'color' => array(
                    'rgb' => '000000'
                )
            ),
            'right' => array(
                'style' => PHPExcel_Style_Border::BORDER_THIN,
                'color' => array(
                    'rgb' => '000000'
                )
            )
        )
    );

    $division = array(
        'alignment' => array(
            'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
            'vertical' => PHPExcel_Style_Alignment::VERTICAL_CENTER
        ),
        'font' => array(
            'size' => '9'
        ),
        'borders' => array(
            'bottom' => array(
                'style' => PHPExcel_Style_Border::BORDER_THIN,
                'color' => array(
                    'rgb' => '000000'
                )
            ),
            'left' => array(
                'style' => PHPExcel_Style_Border::BORDER_THIN,
                'color' => array(
                    'rgb' => '000000'
                )
            ),
            'right' => array(
                'style' => PHPExcel_Style_Border::BORDER_THIN,
                'color' => array(
                    'rgb' => '000000'
                )
            )
        )
    );

    $transport = array(
        'alignment' => array(
            'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
            'vertical' => PHPExcel_Style_Alignment::VERTICAL_CENTER
        ),
        'font' => array(
            'size' => '10'
        ),
        'borders' => array(
            'bottom' => array(
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

    $info = array(
        'alignment' => array(
            'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
            'vertical' => PHPExcel_Style_Alignment::VERTICAL_CENTER
        ),
        'font' => array(
            'size' => '10',
            'italic' => true
        ),
        'borders' => array(
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

    $route = array(
        'alignment' => array(
            'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
            'vertical' => PHPExcel_Style_Alignment::VERTICAL_CENTER
        ),
        'font' => array(
            'size' => '10'
        ),
        'borders' => array(
            'bottom' => array(
                'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                )
            ),
            'left' => array(
                'style' => PHPExcel_Style_Border::BORDER_THIN,
                 'color' => array(
                    'rgb' => '000000'
                 )
            ),
            'right' => array(
                'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                )
            )
        )
    );

    $request = array(
        'alignment' => array(
            'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
            'vertical' => PHPExcel_Style_alignment::VERTICAL_CENTER
        ),
        'font' => array(
            'size' => '10'
        ),
        'borders' => array(
            'bottom' => array(
                'style' => PHPExcel_Style_Border::BORDER_THIN,
                'color' => array(
                    'rgb' => '000000'
                )
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
                )
            ),
            'right' => array(
                'style' => PHPExcel_Style_Border::BORDER_THIN,
                'color' => array(
                    'rgb' => '000000'
                )
            )
        ),
        'fill' => array(
            'type' => PHPExcel_Style_Fill::FILL_SOLID,
            'color' => array(
                'rgb' => "F2F2F2"
            )
        )
    );

    $empty = array(
            'borders' => array(
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
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
                    )
                ),
                'right' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THIN,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );



    /*** PAGE HEADER ***/
    $objPHPExcel->getActiveSheet()->mergeCells('L1:N1');
    $objPHPExcel->getActiveSheet()->getStyle('L1:N1')->applyFromArray($pageHeaderAlignRight);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('L1',  '«Утверждаю»');
    $objPHPExcel->getActiveSheet()->mergeCells('G2:N2');
    $objPHPExcel->getActiveSheet()->getStyle('G2:N2')->applyFromArray($pageHeaderAlignRight);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('G2',  'Зам. директора ПО «Колэнерго»');
    $objPHPExcel->getActiveSheet()->mergeCells('K3:L3');
    $objPHPExcel->getActiveSheet()->getStyle('K3:L3')->applyFromArray($pageHeaderSign);
    $objPHPExcel->getActiveSheet()->mergeCells('M3:N3');
    $objPHPExcel->getActiveSheet()->getStyle('M3:N3')->applyFromArray($pageHeaderAlignRight);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('M3',  'С.Н. Викулин');
    $objPHPExcel->getActiveSheet()->getStyle('K4')->applyFromArray($pageHeaderSign);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('K4',  ' «             »');
    $objPHPExcel->getActiveSheet()->mergeCells('L4:M4');
    $objPHPExcel->getActiveSheet()->getStyle('L4:M4')->applyFromArray($pageHeaderSign);
    $objPHPExcel->getActiveSheet()->getStyle('N4')->applyFromArray($pageHeaderAlignRight);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('N4',  $current_date['year'].' г.');

    /*** REPORT TITLE ***/
    $objPHPExcel->getActiveSheet()->mergeCells('A6:N6');
    $objPHPExcel->getActiveSheet()->getStyle('A6:N6')->applyFromArray($mainTitle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A6', 'График поездок автотранспорта за период с '.$start_date.' по '.$end_date);

    /*** TABLE HEADER ***/
    $objPHPExcel->getActiveSheet()->mergeCells('A7:B7');
    $objPHPExcel->getActiveSheet()->getStyle('A7:B7')->applyFromArray($tableHeader);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A7',  'Заказчик');
    $objPHPExcel->getActiveSheet()->mergeCells('C7:D7');
    $objPHPExcel->getActiveSheet()->getStyle('C7:D7')->applyFromArray($tableHeader);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('C7',  'Транспорт');
    $objPHPExcel->getActiveSheet()->mergeCells('E7:G7');
    $objPHPExcel->getActiveSheet()->getStyle('E7:G7')->applyFromArray($tableHeader);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('E7',  'Подробности');
    $first_date = getdate($start);
    //$first_date["COL"] = "H";
    $days[] = $first_date;
    for($i = 0; $i <= 6; $i++){
        $day = $days[$i]["mday"];

        if($day < 10)
            $day = "0".$day;
        $month = $days[$i]["mon"];
        if($month < 10)
            $month = "0".$month;
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($i+7, 7 , $day."-".$month);
        $start = $start + 86400;
        $temp_date = getdate($start);
        $days[] = $temp_date;
        switch($i){
            case 0: $days[$i]["COL"] = "H"; $days[$i]["COLINDEX"] = 7; break;
            case 1: $days[$i]["COL"] = "I"; $days[$i]["COLINDEX"] = 8; break;
            case 2: $days[$i]["COL"] = "J"; $days[$i]["COLINDEX"] = 9; break;
            case 3: $days[$i]["COL"] = "K"; $days[$i]["COLINDEX"] = 10; break;
            case 4: $days[$i]["COL"] = "L"; $days[$i]["COLINDEX"] = 11; break;
            case 5: $days[$i]["COL"] = "M"; $days[$i]["COLINDEX"] = 12; break;
            case 6: $days[$i]["COL"] = "N"; $days[$i]["COLINDEX"] = 13; break;
        }
    }
    unset($days[7]);

    //for($z=0; $z < sizeof($days); $z++){
    //    print_r($days[$z]); echo "<br>";
    //}

    $objPHPExcel->getActiveSheet()->getStyle('H7')->applyFromArray($tableHeader);
    $objPHPExcel->getActiveSheet()->getStyle('I7')->applyFromArray($tableHeader);
    $objPHPExcel->getActiveSheet()->getStyle('J7')->applyFromArray($tableHeader);
    $objPHPExcel->getActiveSheet()->getStyle('K7')->applyFromArray($tableHeader);
    $objPHPExcel->getActiveSheet()->getStyle('L7')->applyFromArray($tableHeader);
    $objPHPExcel->getActiveSheet()->getStyle('M7')->applyFromArray($tableHeader);
    $objPHPExcel->getActiveSheet()->getStyle('N7')->applyFromArray($tableHeader);

    /***  TABLE BODY ***/
    $temp = 7;
    for($x = 0; $x < sizeof($requests); $x++){
        $merge = "A".($temp+1).":B".($temp+2);
        $objPHPExcel->getActiveSheet()->mergeCells($merge);
        $objPHPExcel->getActiveSheet()->getStyle($merge)->applyFromArray($user);
        $objPHPExcel->getActiveSheet()->getStyle($merge) ->getAlignment()->setWrapText(true);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(0, $temp+1 , $requests[$x]['FAM_NAME']." ".$requests[$x]['FST_NAME']." ".$requests[$x]['LST_NAME']);
        $merge = "A".($temp+3).":B".($temp+4);
        $objPHPExcel->getActiveSheet()->mergeCells($merge);
        $objPHPExcel->getActiveSheet()->getStyle($merge)->applyFromArray($division);
        $objPHPExcel->getActiveSheet()->getStyle($merge) ->getAlignment()->setWrapText(true);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(0, $temp+3 , $requests[$x]['DIVISION_TITLE']);

        $merge = "C".($temp+1).":D".($temp+2);
        $objPHPExcel->getActiveSheet()->mergeCells($merge);
        $objPHPExcel->getActiveSheet()->getStyle($merge)->applyFromArray($user);
        $objPHPExcel->getActiveSheet()->getStyle($merge) ->getAlignment()->setWrapText(true);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(2, $temp+1 , $requests[$x]['TRANSPORT_SUBTYPE_TITLE']);
        $merge = "C".($temp+3).":D".($temp+4);
        $objPHPExcel->getActiveSheet()->mergeCells($merge);
        $objPHPExcel->getActiveSheet()->getStyle($merge)->applyFromArray($transport);
        $objPHPExcel->getActiveSheet()->getStyle($merge) ->getAlignment()->setWrapText(true);
        if($requests[$x]["ITEM_ID"] != 0)
            $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(2, $temp+3 , "[".$requests[$x]['ITEM_GID']."] ".$requests[$x]['ITEM_TITLE']);

        $merge = "E".($temp+1).":G".($temp+2);
        $objPHPExcel->getActiveSheet()->mergeCells($merge);
        $objPHPExcel->getActiveSheet()->getStyle($merge)->applyFromArray($info);
        $objPHPExcel->getActiveSheet()->getStyle($merge) ->getAlignment()->setWrapText(true);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(4, $temp+1 , $requests[$x]['REQUEST_INFO']);
        $merge = "E".($temp+3).":G".($temp+4);
        $objPHPExcel->getActiveSheet()->mergeCells($merge);
        $objPHPExcel->getActiveSheet()->getStyle($merge)->applyFromArray($route);
        $routes = $requests[$x]["REQUEST_ROUTE"];
        $routes = explode(";", $routes);
        $final_route = "";
        for($o = 0; $o < sizeof($routes); $o++){
            $final_route = $final_route.$routes[$o];
            if($o < sizeof($routes) - 1){
                $final_route = $final_route." - ";
            }
        }
        $objPHPExcel->getActiveSheet()->getStyle($merge) ->getAlignment()->setWrapText(true);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(4, $temp+3 , $final_route);

        $start_merge = "";
        $end_merge = "";
        $week_start = $days[0][0];
        $week_end = $days[6][0] + 86399;
        $empty_cell = false;
        $done = false;

        //echo "siz = ".sizeof($days)."<br>";
        for($d = 0; $d < sizeof($days); $d++){
            $day_start_unix = $days[$d][0];
            $day_end_unix = $days[$d][0] + 86399;
            $day_start = getdate($requests[$x]["START_TIME"]);
            $day_end = getdate($requests[$x]["END_TIME"]);

            //$start_merge = $days[$d]["COL"].($temp+1);
            //$end_merge = $days[$d]["COL"].($temp+4);
            //$merge_final = $start_merge.":".$end_merge;
            //$objPHPExcel->getActiveSheet()->getStyle($merge_final)->applyFromArray($empty);



            $start_day = $day_start["mday"];
            if($start_day < 10)
                $start_day = "0".$start_day;
            $start_month = $day_start["mon"];
            if($start_month < 10)
                $start_month = "0".$start_month;
            $start_hour = $day_start["hours"];
            if($start_hour < 10)
                $start_hour = "0".$start_hour;
            $start_minute = $day_start["minutes"];
            if($start_minute < 10)
                $start_minute = "0".$start_minute;
            $final_start_time = $start_day.".".$start_month.".".$day_start["year"]." ".$start_hour.":".$start_minute;

            $end_day = $day_end["mday"];
            if($end_day < 10)
                $end_day = "0".$end_day;
            $end_month = $day_end["mon"];
            if($end_month < 10)
                $end_month = "0".$end_month;
            $end_hour = $day_end["hours"];
            if($end_hour < 10)
                $end_hour = "0".$end_hour;
            $end_minute = $day_end["minutes"];
            if($end_minute < 10)
                $end_minute = "0".$end_minute;
            $final_end_time = $end_day.".".$end_month.".".$date_end["year"]." ".$end_hour.":".$end_minute;



            if($requests[$x]["START_TIME"] >= $day_start_unix  && $requests[$x]["START_TIME"] <= $day_end_unix && $requests[$x]["END_TIME"] >= $day_start_unix && $requests[$x]["END_TIME"] <= $day_end_unix){
                //echo $requests[$x]["REQUEST_ID"]." - today<br>";
                $start_merge = $days[$d]["COL"].($temp+1);
                $end_merge = $days[$d]["COL"].($temp+4);
                $done = true;

                $merge_final = $start_merge.":".$end_merge;
                $objPHPExcel->getActiveSheet()->mergeCells($merge_final);
                $objPHPExcel->getActiveSheet()->getStyle($merge_final)->applyFromArray($request);
                $objPHPExcel->getActiveSheet()->getStyle($merge_final)->getAlignment()->setWrapText(true);
                $objPHPExcel->getActiveSheet()->setCellValue($start_merge, $start_hour.":".$start_minute." - ".$end_hour.":".$end_minute);

            }

            if($requests[$x]["START_TIME"] >= $day_start_unix && $requests[$x]["START_TIME"] < $day_end_unix && $requests[$x]["END_TIME"] > $day_end_unix){
                //echo $requests[$x]["REQUEST_ID"]." - start today, ends later<br>";
                $start_merge = $days[$d]["COL"].($temp+1);

                for($o = $d; $o < sizeof($days); $o++){
                    $now_start = $days[$o][0];
                    $now_end = $now_start + 86399;
                    if($requests[$x]["END_TIME"] >= $now_start && $requests[$x]["END_TIME"] <= $now_end){
                        $end_merge =$days[$o]["COL"].($temp+4);
                        $merge_final = $start_merge.":".$end_merge;
                        $objPHPExcel->getActiveSheet()->mergeCells($merge_final);
                        $objPHPExcel->getActiveSheet()->getStyle($merge_final)->applyFromArray($request);
                        $objPHPExcel->getActiveSheet()->getStyle($merge_final)->getAlignment()->setWrapText(true);
                        if($day_start["mday"] == $day_end["mday"]){
                            $objPHPExcel->getActiveSheet()->setCellValue($start_merge, $start_hour.":".$start_minute." - ".$end_hour.":".$end_minute);
                        }
                        if($day_start["mday"] <> $day_end["mday"]){
                            $objPHPExcel->getActiveSheet()->setCellValue($start_merge, $start_day.".".$start_month." ".$start_hour.":".$start_minute." - ".$end_day.".".$end_month." ".$end_hour.":".$end_minute);
                        }

                    }

                    if($requests[$x]["END_TIME"] >= $now_start && $requests[$x]["END_TIME"] > $week_end){
                        //echo "weekend";
                        $end_merge =$days[6]["COL"].($temp+4);
                        $merge_final = $start_merge.":".$end_merge;
                        $objPHPExcel->getActiveSheet()->mergeCells($merge_final);
                        $objPHPExcel->getActiveSheet()->getStyle($merge_final)->applyFromArray($request);
                        $objPHPExcel->getActiveSheet()->getStyle($merge_final)->getAlignment()->setWrapText(true);
                        if($day_start["mday"] == $day_end["mday"]){
                            $objPHPExcel->getActiveSheet()->setCellValue($start_merge, $start_hour.":".$start_minute." - ".$end_hour.":".$end_minute);
                        }
                        if($day_start["mday"] <> $day_end["mday"]){
                            $objPHPExcel->getActiveSheet()->setCellValue($start_merge, $start_day.".".$start_month." ".$start_hour.":".$start_minute." - ".$end_day.".".$end_month." ".$end_hour.":".$end_minute);
                        }
                    }
                }


                //$done = false;
                //continue;
            }

            if($requests[$x]["START_TIME"] < $day_start_unix && $requests[$x]["END_TIME"] <= $day_end_unix && $requests[$x]["END_TIME"] >= $day_start_unix){
                //echo $requests[$x]["REQUEST_ID"]." - start earlier, ends today<br>";
                $end_merge = $days[$d]["COL"].($temp+4);
                for($o = 0; $o < $d; $o++){
                    $now_start = $days[$o][0];
                    $now_end = $now_start + 86399;
                                    if($requests[$x]["END_TIME"] >= $now_start && $requests[$x]["END_TIME"] <= $now_end){
                                        $end_merge =$days[$o]["COL"].($temp+4);
                                        $merge_final = $start_merge.":".$end_merge;
                                        $objPHPExcel->getActiveSheet()->mergeCells($merge_final);
                                        $objPHPExcel->getActiveSheet()->getStyle($merge_final)->applyFromArray($request);
                                        $objPHPExcel->getActiveSheet()->getStyle($merge_final)->getAlignment()->setWrapText(true);
                                        if($day_start["mday"] == $day_end["mday"]){
                                            $objPHPExcel->getActiveSheet()->setCellValue($start_merge, $start_hour.":".$start_minute." - ".$end_hour.":".$end_minute);
                                        }
                                        if($day_start["mday"] <> $day_end["mday"]){
                                            $objPHPExcel->getActiveSheet()->setCellValue($start_merge, $start_day.".".$start_month." ".$start_hour.":".$start_minute." - ".$end_day.".".$end_month." ".$end_hour.":".$end_minute);
                                        }

                                    }

                                    if($requests[$x]["END_TIME"] >= $now_start && $requests[$x]["END_TIME"] > $week_end){
                                        //echo "weekend";
                                        $end_merge =$days[6]["COL"].($temp+4);
                                        $merge_final = $start_merge.":".$end_merge;
                                        $objPHPExcel->getActiveSheet()->mergeCells($merge_final);
                                        $objPHPExcel->getActiveSheet()->getStyle($merge_final)->applyFromArray($request);
                                        $objPHPExcel->getActiveSheet()->getStyle($merge_final)->getAlignment()->setWrapText(true);
                                        if($day_start["mday"] == $day_end["mday"]){
                                            $objPHPExcel->getActiveSheet()->setCellValue($start_merge, $start_hour.":".$start_minute." - ".$end_hour.":".$end_minute);
                                        }
                                        if($day_start["mday"] <> $day_end["mday"]){
                                            $objPHPExcel->getActiveSheet()->setCellValue($start_merge, $start_day.".".$start_month." ".$start_hour.":".$start_minute." - ".$end_day.".".$end_month." ".$end_hour.":".$end_minute);
                                        }
                                    }
                 }
            }

            if($requests[$x]["START_TIME"] < $day_start_unix && $requests[$x]["END_TIME"] < $day_start_unix){
                //echo $requests[$x]["REQUEST_ID"]." - earlier<br>";
                $start_merge = $days[$d]["COL"].($temp+1);
                $end_merge = $days[$d]["COL"].($temp+4);
                $empty_cell = true;


                $merge_final = $start_merge.":".$end_merge;
                $objPHPExcel->getActiveSheet()->mergeCells($merge_final);
                $objPHPExcel->getActiveSheet()->getStyle($merge_final)->applyFromArray($empty);
            }

            if($requests[$x]["START_TIME"] > $day_end_unix && $requests[$x]["END_TIME"] > $day_end_unix){
                //echo $requests[$x]["REQUEST_ID"]." - later<br>";
                $start_merge = $days[$d]["COL"].($temp+1);
                $end_merge = $days[$d]["COL"].($temp+4);
                $empty_cell = true;
                $done = true;

                $merge_final = $start_merge.":".$end_merge;
                $objPHPExcel->getActiveSheet()->mergeCells($merge_final);
                $objPHPExcel->getActiveSheet()->getStyle($merge_final)->applyFromArray($empty);
            }

            /*
            if($requests[$x]["START_TIME"] < $week_start && $requests[$x]["END_TIME"] > $week_end){
                $start_merge = $days[0]["COL"].($temp+1);
                $end_merge = $days[6]["COL"].($temp+4);
                $merge_final = $start_merge.":".$end_merge;
                $objPHPExcel->getActiveSheet()->mergeCells($merge_final);
                $objPHPExcel->getActiveSheet()->getStyle($merge_final)->applyFromArray($request);
                $objPHPExcel->getActiveSheet()->getStyle($merge_final)->getAlignment()->setWrapText(true);
                if($day_start["mday"] == $day_end["mday"]){
                    $objPHPExcel->getActiveSheet()->setCellValue($start_merge, $start_hour.":".$start_minute." - ".$end_hour.":".$end_minute);
                }
                if($day_start["mday"] <> $day_end["mday"]){
                    $objPHPExcel->getActiveSheet()->setCellValue($start_merge, $start_day.".".$start_month." ".$start_hour.":".$start_minute." - ".$end_day.".".$end_month." ".$end_hour.":".$end_minute);
                }
            }
            */


            //print_r ($days[$d]); echo($d." <br>");

        }







        $temp = $temp + 4;
    }

    $objPHPExcel->getActiveSheet()->getPageMargins()->setTop(1.5);
    $objPHPExcel->getActiveSheet()->getPageMargins()->setRight(0.5);
    $objPHPExcel->getActiveSheet()->getPageMargins()->setLeft(0.5);
    $objPHPExcel->getActiveSheet()->getPageMargins()->setBottom(1.5);

    header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    header('Content-Disposition: attachment;filename="Обзор заявок.xlsx"');
    header('Cache-Control: max-age=0');
    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
    $objWriter->save('php://output');
    exit;
