<?php
    ini_set('display_errors', TRUE);
    ini_set('display_startup_errors', TRUE);

    if (PHP_SAPI == 'cli')
        die('This example should only be run from a Web Browser');
    include "../../php/user.class.php";
    include("../utils.php");
    require_once '../../../php/Classes/PHPExcel.php';
    $res = array();
    $line = 1;

    if (isset($_GET["id"]))
        $id = $_GET["id"];

    $con = oci_connect('purchases', 'PURCHASES', '192.168.50.52/ORCLWORK', 'AL32UTF8');
    if(!$con) {
        oci_close($con);
        die('Ошибка подключения к базе');
    } else {
        date_default_timezone_set("Etc/GMT-4");
        $query = "SELECT * FROM V_AUTO_REQUESTS WHERE V_AUTO_REQUESTS.REQUEST_ID = {$id}";
        $statement = oci_parse($con, $query);
        if(oci_execute($statement, OCI_DEFAULT))
            $res = oci_fetch_assoc($statement);
        else
            die("Не удалось выполнить запрос");
    }

    $objPHPExcel = new PHPExcel();
    $objPHPExcel->removeSheetByIndex(0);
    $worksheet = new PHPExcel_Worksheet($objPHPExcel, 'Заявка #'.$id);
    $objPHPExcel->addSheet($worksheet, 1);
    $objPHPExcel->setActiveSheetIndex(0);

    $objPHPExcel->getActiveSheet()->getPageSetup()->setOrientation(PHPExcel_Worksheet_PageSetup::ORIENTATION_PORTRAIT);
    $objPHPExcel->getActiveSheet()->getPageSetup()->setPaperSize(PHPExcel_Worksheet_PageSetup::PAPERSIZE_A4);
    $objPHPExcel->getActiveSheet()->getPageSetup()->setFitToWidth(1);
    $objPHPExcel->getActiveSheet()->getPageSetup()->setFitToHeight(0);


    $headerStyle = array(
        'alignment' => array(
            'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
            'vertical' => PHPExcel_Style_Alignment::VERTICAL_BOTTOM
        ),
        'font' => array(
            'size' => '18'
        )
    );

    $regularStyle = array(
        'alignment' => array(
            'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_LEFT,
            'vertical' => PHPExcel_Style_Alignment::VERTICAL_CENTER
        ),
        'font' => array(
            'size' => '14'
        )
    );

    $boldStyle = array(
        'alignment' => array(
            'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_LEFT,
            'vertical' => PHPExcel_Style_Alignment::VERTICAL_TOP
        ),
        'font' => array(
            'size' => '14',
            'bold' => true
        )
    );

    $italicStyle = array(
        'alignment' => array(
            'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_LEFT,
            'vertical' => PHPExcel_Style_Alignment::VERTICAL_CENTER
        ),
        'font' => array(
            'size' => '14',
             'italic' => true
        )
    );

    $underlineStyle = array(
        'borders' => array(
            'bottom' => array(
                'style' => PHPExcel_Style_Border::BORDER_THIN,
                'color' => array(
                    'rgb' => '000000'
                )
            )
        ),
        'font' => array(
            'size' => '14'
        )
    );

    $smallStyle = array(
        'alignment' => array(
            'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
            'vertical' => PHPExcel_Style_Alignment::VERTICAL_CENTER
        ),
        'font' => array(
            'size' => '10'
        )
    );

    $range = "A".$line.":K".$line;
    $objPHPExcel->getActiveSheet()->mergeCells($range);
    $objPHPExcel->getActiveSheet()->getStyle($range)->applyFromArray($headerStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue("A".$line, 'Служебная записка ');

    $line += 2;
    $range = "A".$line.":K".($line+1);
    $objPHPExcel->getActiveSheet()->mergeCells($range);
    $objPHPExcel->getActiveSheet()->getStyle($range) ->getAlignment()->setWrapText(true);
    $objPHPExcel->getActiveSheet()->getStyle("A".$line)->applyFromArray($regularStyle);
    $objPHPExcel->getActiveSheet()->getRowDimension('3')->setRowHeight(25);
    $objPHPExcel->getActiveSheet()->getRowDimension('4')->setRowHeight(25);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue("A".$line, 'Требуется обеспечить сотрудника(цу) служебным автотранспортом в связи со служебной необходимостью.');

    $line += 3;
    $range = "A".$line.":C".$line;
    $objPHPExcel->getActiveSheet()->mergeCells($range);
    $objPHPExcel->getActiveSheet()->getStyle($range)->applyFromArray($regularStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue("A".$line, 'Заказчик транспорта:');

    $range = "D".$line.":K".$line;
    $objPHPExcel->getActiveSheet()->mergeCells($range);
    $objPHPExcel->getActiveSheet()->getStyle($range)->applyFromArray($boldStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue("D".$line, $res["FAM_NAME"]." ".$res["FST_NAME"]." ".$res["LST_NAME"]);

    if (!is_null($res["DOLZH"])) {
        $line += 1;
        $range = "D".$line.":K".$line;
        $objPHPExcel->getActiveSheet()->mergeCells($range);
        $objPHPExcel->getActiveSheet()->getStyle($range)->applyFromArray($italicStyle);
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue("D".$line, $res["DOLZH"]);
    }

    if (!is_null($res["DIVISION_TITLE"])) {
        $line += 1;
        $range = "D".$line.":K".$line;
        $objPHPExcel->getActiveSheet()->mergeCells($range);
        $objPHPExcel->getActiveSheet()->getStyle($range)->applyFromArray($italicStyle);
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue("D".$line, $res["DIVISION_TITLE"]);
    }

    $line += 2;
    $range = "A".$line.":C".$line;
    $objPHPExcel->getActiveSheet()->mergeCells($range);
    $objPHPExcel->getActiveSheet()->getStyle($range)->applyFromArray($regularStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue("A".$line, 'Тип транспорта:');

    $range = "D".$line.":K".$line;
    $objPHPExcel->getActiveSheet()->mergeCells($range);
    $objPHPExcel->getActiveSheet()->getStyle($range)->applyFromArray($boldStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue("D".$line, $res["TRANSPORT_SUBTYPE_TITLE"]);

    $line += 2;
    $range = "A".$line.":C".$line;
    $objPHPExcel->getActiveSheet()->mergeCells($range);
    $objPHPExcel->getActiveSheet()->getStyle($range)->applyFromArray($regularStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue("A".$line, 'Продолжительность:');

    $range = "D".$line.":K".$line;
    $objPHPExcel->getActiveSheet()->mergeCells($range);
    $objPHPExcel->getActiveSheet()->getStyle($range)->applyFromArray($boldStyle);
    if ((($res["END_TIME"] - $res["START_TIME"]) / 86400) > 1)
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue("D".$line, (format_date($res["START_TIME"], "DD MMM YYYY HH:mm")." - ".format_date($res["END_TIME"], "DD MMM YYYY HH:mm")));
    else
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue("D".$line, (format_date($res["START_TIME"], "DD MMM YYYY HH:mm")." - ".format_date($res["END_TIME"], "HH:mm")));

    $line += 2;
    $range = "A".$line.":C".$line;
    $objPHPExcel->getActiveSheet()->mergeCells($range);
    $objPHPExcel->getActiveSheet()->getStyle($range)->applyFromArray($regularStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue("A".$line, 'Маршрут поездки:');

    $routes = explode(";", $res["REQUEST_ROUTE"]);
    for ($i = 0; $i < sizeof($routes); $i++) {
        $range = "D".$line.":K".$line;
        $objPHPExcel->getActiveSheet()->mergeCells($range);
        $objPHPExcel->getActiveSheet()->getStyle($range)->applyFromArray($regularStyle);
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue("D".$line, ($i+1).". ".$routes[$i]);
        $line += 1;
    }

    $line += 2;
    $range = "A".$line.":C".$line;
    $objPHPExcel->getActiveSheet()->mergeCells($range);
    $objPHPExcel->getActiveSheet()->getStyle($range)->applyFromArray($regularStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue("A".$line, 'Подробности:');

    $range = "D".$line.":K".($line + 3);
    $objPHPExcel->getActiveSheet()->mergeCells($range);
    $objPHPExcel->getActiveSheet()->getStyle($range)->applyFromArray($boldStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue("D".$line, $res["REQUEST_INFO"]);

    $line += 7;
    $range = "A".$line.":B".$line;
    $objPHPExcel->getActiveSheet()->mergeCells($range);
    $objPHPExcel->getActiveSheet()->getStyle($range)->applyFromArray($regularStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue("A".$line, format_date(time(), "DD.MM.YYYY"));

    $range = "D".$line.":G".$line;
    $objPHPExcel->getActiveSheet()->mergeCells($range);
    $objPHPExcel->getActiveSheet()->getStyle($range)->applyFromArray($underlineStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue("D".$line, "");

    $range = "I".$line.":K".$line;
    $objPHPExcel->getActiveSheet()->mergeCells($range);
    $objPHPExcel->getActiveSheet()->getStyle($range)->applyFromArray($underlineStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue("I".$line, "");

    $line += 1;
    $range = "D".$line.":G".$line;
    $objPHPExcel->getActiveSheet()->mergeCells($range);
    $objPHPExcel->getActiveSheet()->getStyle($range)->applyFromArray($smallStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue("D".$line, "фамилия, имя, отчество");

    $range = "I".$line.":K".$line;
    $objPHPExcel->getActiveSheet()->mergeCells($range);
    $objPHPExcel->getActiveSheet()->getStyle($range)->applyFromArray($smallStyle);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue("I".$line, "подпись");

    header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    header('Content-Disposition: attachment;filename="Заявка на автотранспорт.xls"');
    header('Cache-Control: max-age=0');
    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
    $objWriter->save('php://output');
    exit;
?>