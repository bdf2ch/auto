<?php

include_once 'calendarFunctions.php';
include 'dbFunctions.php';
//include 'xtemplate.class.php';

/**
 * Выводит страницу активных заявок автотранспорта
 * @global XTemplate $template
 * 
 */

function allRequestsPanorama(){
	//include 'xtemplate.class.php';
    global $template;
    global $client;
	echo "hjggh";
    $template = new XTemplate("../../templates/index.html");
    print_r($template);
    //$template -> assign_file("CONTENT", "../templates/auto/activeRequests.html");
    $template -> assign_file("CONTENT", "../templates/auto/panorama.html");
    $template -> assign("BODY_ID", "at");
    //$template -> assign("REQUEST_AUTHOR", $client -> getFio());
    //$template -> assign("TRANSPORT_CLASS_TITLE", "TRANSPORT_CLASS1");
    
    //$transport_number = 4;
    //$request_number = 1;
    //$transports = array("Грузовик", "Кран", "Самосвал", "Тягач", "Трактор");
    
    $now = getdate();
  
    $hours = 0;
    $nowDay = $now['mday'];
    $nowMonth = $now['mon'];
    $nowYear = $now['year'];
    //$nextDay = getNextDay($currentDay, $currentMonth, $currentYear);
    $transports = getAutoTypes();
    $transportId;
    $dayHeaderCounter;
    
    // Цикл отрисовки типов транспорта
    //for($t = 0; $t < sizeof($transports); $t++){
    //    $template -> assign("TRANSPORT_CLASS_TITLE", $transports[$t]['TRANSPORT_TYPE_TITLE']);
    //    $template -> assign("TRANSPORT_ITEM_ID", $transports[$t]['TRANSPORT_TYPE_ID']);
        //$transportItemContainerId = "container".$t;
        //$template -> assign("TRANSPORT_ITEM_CONTAINER_ID", $transportId);
    //    $transportId = $transports[$t]['TRANSPORT_TYPE_ID'];
    //    $requests = getRequests($transports[$t]['TRANSPORT_TYPE_ID'], "25.09.2012");
    //    $requestsCount = sizeof($requests);
    //    if($requestsCount == 0)
    //        $requestsCount++;
        
        // Цикл отрисовки заявок
        //if(sizeof($requests) == 0)
        //    array_push($requests, "");
    //    for ($r = 0; $r < $requestsCount; $r++){
            
            
            // Цикл отрисовки календарных дней
     //       for ($d = 0; $d < 5; $d++)
     //       {  
     //           $dayId = "";
     //           $template -> assign("DAY_ID", $nextDay);
                // Цикл отрисовки временных блоков
    //            for ($x = 0; $x < 12; $x++){
    //                if(($x >= $requests[$r]['START_TIME']/2) && ($x+1 <= $requests[$r]['END_TIME']/2)){
     //                   $template -> assign("TIME_ATOM_STATUS", "busy");
      //                  if(($requests[$r]['START_TIME']/2) >= $x+1)
      //                      $template -> assign("TIME_ATOM_START_STATUS", "1");
       //                 else
        //                    $template -> assign("TIME_ATOM_START_STATUS", "0");
       //                 if(($requests[$r]['END_TIME']/2) <= $x+1)
       //                     $template -> assign("TIME_ATOM_END_STATUS", "1");
       //                 else
       //                     $template -> assign("TIME_ATOM_END_STATUS", "0");
       //             }
       //             else
        //                $template -> assign("TIME_ATOM_STATUS", "free");
                   
       //             $template -> assign("TIME_ATOM_ID", $x);
       //             $template -> assign("TIME_ATOM_HINT", $x);   
       //             $template -> parse("main.transportItem.requestItem.dayItem.timeAtomItem");
        //        }
                
          //      $template -> parse("main.transportItem.requestItem.dayItem");
                
          //      $hours = $hours + 1;
          //      $timeAtomId = "";
                
                //$nextDay = getNextDay($currentDay, $currentMonth, $currentYear);
                
                // Парсим шапку с временной сеткой
                //if($dayHeaderCounter < 5)
                //    $template -> parse("main.dayHeaderItem");
                //$dayHeaderCounter++;
          //  }
        //$template -> parse("main.transportItem.requestItem");
        
       
        
        //}
        // if(sizeof($requests) == 0)
        //    $template -> parse("main.transportItem.requestItem");
    
    

   // $template -> parse("main.transportItem");
    //}
}

function allRequestsList(){
    global $template;
    global $client;
	//echo "dsadsadsad";
    //$template = new XTemplate("../angular/index.html");
    
    //$template -> assign_file("CONTENT", "../templates/auto/requestsList.html");
	//$template -> assign_file("CONTENT", "../angular/index.html");
	//$template -> assign_file("MAIN_HEADER", "../templates/mainHeader.html");
	//$template -> assign("USER_VISIBILITY_AREA", $client -> getVisibilityAreaTilte());
	//$template -> assign("USER_FIO", $client -> getFio());
	//$template -> parse("main.menu.dit");
	//$template -> parse("main.menu.auto");
	//if($client -> isRegistered()) {
    //$template -> assign_file("USER_MENU", "../templates/userMenu.html");
   // $template -> assign_file("CONTENT", "../templates/login.html");
 //}else
  //  $template -> assign_file("USER_MENU", "../templates/userMenu_unregistered.html"); 
	
    //$template -> assign("BODY_ID", "at");
	//$template -> parse("main");
}

function panorama(){
    global $template;
	global $client;
	$template = new XTemplate("../templates/index.html");
	$template -> assign_file("MAIN_HEADER", "../templates/mainHeader.html");
	if ($client -> isRegistered()){
    //$template -> assign_file("USER_MENU", "../templates/userMenu.html");
    /***** Получение наименования области видимости *****/
    $template -> assign("USER_VISIBILITY_AREA", $client -> getVisibilityAreaTilte());
    /***** Получение фио пользователя *****/
    $template -> assign("USER_FIO", $client -> getFio());
    /***** Парсинг элемента меню - ДИТ *****/
    $template -> parse("main.menu.dit");
    /***** Парсинг элемента меню - Автотранспорт *****/
    //if ($client -> isAutoVisible())
    $template -> parse("main.menu.auto");
    //*** Парсинг элемента меню - Закупки ***
    //if ($client -> isZakupkiVisible()) $template -> parse("main.menu.zakupki");
    //*** Парсинг элемента меню - Админка *****/
    //if ($client -> isAdministrator()) $template -> parse("main.menu.admin");
	}
 if($client -> isRegistered()) {
    $template -> assign_file("USER_MENU", "templates/userMenu.html");
    //$template -> assign_file("CONTENT", "../templates/login.html");
 }else
    $template -> assign_file("USER_MENU", "templates/userMenu_unregistered.html"); 
    
    $template -> assign_file("CONTENT", "../templates/auto/panorama.html");
    $template -> assign("BODY_ID", "at");
}

?>
