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



    $objPHPExcel->getActiveSheet()->mergeCells('A1:N1');
    $objPHPExcel->getActiveSheet()->getStyle('A1:N1')->applyFromArray($headerStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A1', 'Обзор заявок за период с '.$start_date.' по '.$end_date);


    $objPHPExcel->getActiveSheet()->mergeCells('A2:A2');
    $objPHPExcel->getActiveSheet()->getStyle('A2:A2')->applyFromArray($regularStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A2', '#');

    $objPHPExcel->getActiveSheet()->mergeCells('B2:D2');
    $objPHPExcel->getActiveSheet()->getStyle('B2:D2')->applyFromArray($regularStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('B2', 'Дата подачи');

    $objPHPExcel->getActiveSheet()->mergeCells('E2:H2');
    $objPHPExcel->getActiveSheet()->getStyle('E2:H2')->applyFromArray($regularStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('E2', 'Заказчик');

    $objPHPExcel->getActiveSheet()->mergeCells('I2:L2');
    $objPHPExcel->getActiveSheet()->getStyle('I2:L2')->applyFromArray($regularStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('I2', 'Тип транспорта');

    $objPHPExcel->getActiveSheet()->mergeCells('M2:N2');
    $objPHPExcel->getActiveSheet()->getStyle('M2:N2')->applyFromArray($regularStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('M2', 'Статус заявки');

    $temp = 3;
    for($x = 0; $x < sizeof($requests); $x++){

        $merge = "A".$temp.":A".$temp;
        $objPHPExcel->getActiveSheet()->mergeCells($merge);
        $objPHPExcel->getActiveSheet()->getStyle($merge)->applyFromArray($regularStyle);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(0, $temp, $requests[$x]['REQUEST_ID']);

        $merge = "B".$temp.":D".$temp;
        $objPHPExcel->getActiveSheet()->mergeCells($merge);
        $objPHPExcel->getActiveSheet()->getStyle($merge)->applyFromArray($regularStyle);
        $objPHPExcel->getActiveSheet()->getStyle($merge) ->getAlignment()->setWrapText(true);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(1, $temp , $requests[$x]['REQUEST_DATE']." в ".$requests[$x]['REQUEST_TIME']);

        $merge = "E".$temp.":H".$temp;
        $objPHPExcel->getActiveSheet()->mergeCells($merge);
        $objPHPExcel->getActiveSheet()->getStyle($merge)->applyFromArray($regularStyle);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(4, $temp , $requests[$x]['FAM_NAME']." ".$requests[$x]['FST_NAME']." ".$requests[$x]['LST_NAME']);

        $merge = "I".$temp.":L".$temp;
        $objPHPExcel->getActiveSheet()->mergeCells($merge);
        $objPHPExcel->getActiveSheet()->getStyle($merge)->applyFromArray($regularStyle);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(8, $temp , $requests[$x]['TRANSPORT_SUBTYPE_TITLE']);

        $merge = "M".$temp.":N".$temp;
        $objPHPExcel->getActiveSheet()->mergeCells($merge);
        $objPHPExcel->getActiveSheet()->getStyle($merge)->applyFromArray($regularStyle);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(12, $temp , $requests[$x]['STATUS_TITLE']);

        $temp = $temp + 1;

    }

    header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    header('Content-Disposition: attachment;filename="Обзор заявок.xlsx"');
    header('Cache-Control: max-age=0');
    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
    $objWriter->save('php://output');
    exit;

    ?>
