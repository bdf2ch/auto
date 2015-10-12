<?php
  header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
  header("Last-Modified: " . gmdate("D, d M Y H:i:s")." GMT");
  header("Cache-Control: no-cache, must-revalidate");
  header("Cache-Control: post-check=0,pre-check=0", false);
  header("Cache-Control: max-age=0", false);
  header("Pragma: no-cache");

/***** Подключение необходимых библиотек *****/
include 'php/xtemplate.class.php';
include 'php/user.class.php';
include 'php/globalFunctions.php';

/***** Инициализация глобальных переменных и объектов *****/
session_start();
$template = new XTemplate("index.html");
$client = new user();


/***** Сборка основного шаблона *****/
$template -> assign_file("MAIN_HEADER", "templates/mainHeader.html");

if ($client -> isRegistered()){
    //$template -> assign_file("USER_MENU", "../templates/userMenu.html");
    /***** Получение наименования области видимости *****/
    $template -> assign("USER_VISIBILITY_AREA", $client -> getVisibilityAreaTilte());
    /***** Получение фио пользователя *****/
    $template -> assign("USER_FIO", $client -> getFio());
    /***** Парсинг элемента меню - ДИТ *****/
    if($client -> getOblVidId() != 4)
        $template -> parse("main.menu.dit");
    /***** Парсинг элемента меню - Автотранспорт *****/
    //if ($client -> isAutoVisible())
    $template -> parse("main.menu.auto");
	$template -> parse("main.menu.newHelp");
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
	
/***** Сборка содержимого *****/
 if (isset($_GET['view'])){
	if($client -> isRegistered()){
		 $view = $_GET['view'];
		 switch($view){
			 case "list" : //allRequestsList(); break;
			 header("Location: http://".$_SERVER['HTTP_HOST']."/zayavki/auto/");
			 $template -> parse("main.menu.newHelp");
			 break;
			 case "panorama" : 
				panorama(); 
				$template -> parse("main.menu.oldHelp");
				break;
			 case "test" : panorama(); break;
			default : 
				allRequestsRequests(); 
				$template -> parse("main.menu.newHelp");
				break;
		 }
	 } else
		header("Location: http://".$_SERVER['HTTP_HOST']."/zayavki/");
 } else if($client -> isRegistered()){
	   allRequestsList();
	   $template -> parse("main.menu.newHelp");
	}
	else
	   header("Location: http://".$_SERVER['HTTP_HOST']."/zayavki/");
    
//print_r($client);     
 
$template -> parse("main.menu");
$template -> parse("main");
$template -> out("main"); 

?>