<?php
/** Error reporting */
error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);

if (PHP_SAPI == 'cli')
	die('This example should only be run from a Web Browser');

/** Include PHPExcel */
require_once '../../php/Classes/PHPExcel.php';

$postdata = file_get_contents('php://input');
$params = json_decode($postdata, true);
$driverId = $params["driverId"];
$start = $params["start"];
$end = $params["end"];

$requests = array();

$con = oci_connect('purchases', 'PURCHASES', '192.168.50.52/ORCLWORK', 'AL32UTF8');
 if(!$con){
    oci_close($con);
    die('Ошибка подключения к базе');
}

// Create new PHPExcel object
$objPHPExcel = new PHPExcel();
$worksheet = new PHPExcel_Worksheet($objPHPExcel, "hgfhgfhf");
// Attach the “My Data” worksheet as the first worksheet in the PHPExcel object
    $objPHPExcel->addSheet($worksheet, 1);
//$objPHPExcel->removeSheetByIndex(1);




    $objPHPExcel->setActiveSheetIndex(1)
                ->setCellValue('A2', 'Информация о заявке')
                ->setCellValue('B2', 'Заказчик')
                ->setCellValue('C2', 'Продолжительность поездки')
                ->setCellValue('D2', 'Маршрут')
                ->setCellValue('E2', 'Транспортная единица')
                ->setCellValue('F2', 'Подробности о поездке')

    $objPHPExcel->getActiveSheet()->mergeCells('A1:F1');
    //$objPHPExcel->setActiveSheetIndex(0)
    //            ->setCellValue('A1', 'Обзор заявок, для с '.$startDate.' по '.$endDate." (".$transportTypes[$i]['TRANSPORT_TYPE_TITLE'].")");


    /*
    $query = "SELECT *
               FROM V_AUTO_REQUESTS
               WHERE V_AUTO_REQUESTS.DRIVER_ID = {$driverId} AND
                     V_AUTO_REQUESTS.START_TIME >= '{$start}' AND
                     V_AUTO_REQUESTS.END_TIME <= '{$end}' AND
                     V_AUTO_REQUESTS.REQUEST_STATUS = 2
               ORDER BY V_AUTO_REQUESTS.START_TIME ASC";
    $statement = oci_parse($con, $query);

    if(oci_execute($statement, OCI_DEFAULT)){
        while($res = oci_fetch_array($statement))
            array_push($requests, $res);
    } else
        die("Не удалось выполнить запрос");
         //$objPHPExcel->setActiveSheetIndex(1);

        //$sheets = $objPHPExcel ->getAllSheets();

        $rows = 2;
    */

        for($i = 0; $i < sizeof($requests); $i++){

            $objPHPExcel->setActiveSheetIndex(1);
            $requestId = $requests[$i]['REQUEST_ID'];
            $firstCol = "#".$requestId." от ".$requests[$i]['REQUEST_DATE'].", ".$requests[$i]['REQUEST_TIME'];
            $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(0, $i+3 , $firstCol);

            //$info = $requests[$x]['REQUEST_DATE']." в ".$requests[$x]['REQUEST_TIME'];
            //$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(1, $x+3, $info);

            //$userFio = $requests[$x]['FAM_NAME']." ".$requests[$x]['FST_NAME']." ".$requests[$x]['LST_NAME'];
            //$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(2, $x+3, $userFio);

            //date_default_timezone_set("Etc/GMT-4");

            //$timeOut = date("H:i", $requests[$x]['START_TIME']);

            ////if($timeOut < 10)
            ////    $timeOut = "0".$timeOut;

            //$out = $requests[$x]['START_DATE']." в ".$timeOut;
            //$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(3, $x+3, $out);

            //$timeIn = date("H:i", $requests[$x]['END_TIME']);
            ////if($timeIn < 10)
            ////    $timeIn = "0".$timeIn;
            //$in = $requests[$x]['END_DATE']." в ".$timeIn;
            //$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(4, $x+3, $in);

            //$transportItem = $requests[$x]['ITEM_TITLE'];
            //if($transportItem <> "")
            //    $transportItem = $requests[$x]['ITEM_TITLE']." (".$requests[$x]['ITEM_GID'].")";
            //else
            //    $transportItem = "Не назначена";
            //$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(5, $x+3, $transportItem);

            //$driver = $requests[$x]['FIO'];
            //if($driver <> "")
            //    $driver = $requests[$x]['FIO'];
            //else
            //    $driver = "Не назначен";
            //$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(6, $x+3, $driver);

            //$infoExt = $requests[$x]['REQUEST_INFO'];
            //$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(7, $x+3, $infoExt);

            //$status = $requests[$x]['STATUS_TITLE'];
            //$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow(8, $x+3, $status);
            $rows++;
        }

        //$rows = 'A2:I'.$rows;
        //$styleArray = array(
        //    'borders' => array(
        //        'allborders' => array(
        //            'style' => PHPExcel_Style_Border::BORDER_THIN,
        //            'color' => array(
        //                'rgb' => '000000'
        //            ),
        //        ),
        //    ),

        //         'alignment' => array(
        //                'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER
        //            ),
        //);

        //$titleStyle = array(
        //    'font' => array(
        //       'bold' => true,
        //        ), 'alignment' => array(
        //                'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_LEFT
        //            ),
        //    );
//$objPHPExcel->getActiveSheet()->getStyle($rows)->applyFromArray($styleArray);
//$objPHPExcel->getActiveSheet()->getStyle('A1:I1')->applyFromArray($titleStyle);
////$objPHPExcel->getActiveSheet()->getStyle('A1:I100')->g
////$objPHPExcel->getActiveSheet()->getDefaultColumnDimension()->setWidth(30);
//$objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(7);
//$objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(15);
//$objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(30);
//$objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(15);
//$objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(15);
//$objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(30);
//$objPHPExcel->getActiveSheet()->getColumnDimension('G')->setWidth(30);
//$objPHPExcel->getActiveSheet()->getColumnDimension('H')->setWidth(25);
//$objPHPExcel->getActiveSheet()->getColumnDimension('I')->setWidth(17);
//}







// Set document properties
/*$objPHPExcel->getProperties()->setCreator("Maarten Balliauw")
							 ->setLastModifiedBy("Maarten Balliauw")
							 ->setTitle("Office 2007 XLSX Test Document")
							 ->setSubject("Office 2007 XLSX Test Document")
							 ->setDescription("Test document for Office 2007 XLSX, generated using PHP classes.")
							 ->setKeywords("office 2007 openxml php")
							 ->setCategory("Test result file");*/






// Rename worksheet
////$objPHPExcel->getActiveSheet()->setTitle('Simple');
//$objPHPExcel->getDefaultStyle()->getFont()->setName('Helvetica');
//$objPHPExcel->getDefaultStyle()->getBorders()->applyFromArray(array(
//    'bottom' => array(
//        'style' => PHPExcel_Style_Border::BORDER_DASHDOT,
//        'color' => array( 'rgb' => '808080' ) ),
//    'top' => array(
//        'style' => PHPExcel_Style_Border::BORDER_DASHDOT,
//        'color' => array( 'rgb' => '808080' ) ) ) );



// Set active sheet index to the first sheet, so Excel opens this as the first sheet
//$objPHPExcel->setActiveSheetIndex(1);


// Redirect output to a client’s web browser (Excel2007)
header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header('Content-Disposition: attachment;filename="report.xlsx"');
header('Cache-Control: max-age=0');

$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
$objWriter->save('php://output');
exit;

?>
