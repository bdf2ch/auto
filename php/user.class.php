<?php

/**
 * Класс описывает пользователя 
 */
class user {
    
    private $id;
    private $fio;
    private $email;
    private $admin_dep_id;
    private $admin_dep_suf;
    private $zak_oper_suf;
    private $obl_vid_id;
    private $obl_vid_name;
    
    private $isRegistered;
    private $isAdministrator;
    
    /**
     * создает экземпляр класса user
     * @constructor
     */
    public function __construct(){
        session_start();
        /***** Если куки установлены *****/
        if (isset($_COOKIE['user_id']) && $_COOKIE['user_id'] != '' ){
       
            /***** Продлеваем им жизнь еще на 2 недели *****/
            $st_path    = '/zayavki/';
            $st_time    = time()+14*24*60*60;
            
            /***** Устанавливаем id пользователя по кукам *****/
            setcookie('user_id', $_COOKIE['user_id'], $st_time, $st_path, false);
            //$_SESSION['user_id'] = $_COOKIE['user_id'];
            $this -> id = $_COOKIE['user_id'];
            
            /***** Устанавливаем фио пользователя по кукам *****/
            setcookie('user_fio', $_COOKIE['user_fio'], $st_time, $st_path, false);
            //$_SESSION['user_fio'] = $_COOKIE['user_fio'];
            $this -> fio = $_COOKIE['user_fio'];
            
            /***** Устанавливаем email пользователя по кукам *****/
            setcookie('user_email', $_COOKIE['user_email'], $st_time, $st_path, false);
            //$_SESSION['user_email'] = $_COOKIE['User_email'];
            $this -> email = $_COOKIE['user_email'];
            
            /***** Устанавливаем является ли пользователь администратором по кукам *****/
            setcookie('admin_dep_id', $_COOKIE['admin_dep_id'], $st_time, $st_path, false);
            $this -> admin_dep_id = $_COOKIE['admin_dep_id'];
            if ($_COOKIE['admin_dep_id'] != '0'){
                //$_SESSION['admin_dep_id'] = $_COOKIE['admin_dep_id'];
                $this -> isAdministrator = true;
            }
            else
                $this -> isAdministrator = false;
            
            /***** Устанавливаем  пользователя по кукам *****/
            setcookie('admin_dep_suf',$_COOKIE['admin_dep_suf'], $st_time, $st_path, false);
            //$_SESSION['admin_dep_suf'] = $_COOKIE['admin_dep_suf'];
            $this -> admin_dep_suf = $_COOKIE['admin_dep_suf'];
            
            /***** Устанавливаем  пользователя по кукам *****/
           // setcookie('zak_oper_suf', $_COOKIE['zak_oper_suf'], $st_time, $st_path, false);
            //$_SESSION['zak_oper_suf'] = $_COOKIE['zak_oper_suf'];
            //$this -> zak_oper_suf = $_COOKIE['zak_oper_suf'];
            
            /***** Устанавливаем область видимости пользователя по кукам *****/
            setcookie('obl_vid_id',   $_COOKIE['obl_vid_id'], $st_time, $st_path, false);
            //$_SESSION['obl_vid_id'] = $_COOKIE['obl_vid_id'];
            $this -> obl_vid_id = $_COOKIE['obl_vid_id'];
            
            /***** Устанавливаем наименование области видимости пользователя по кукам *****/
            setcookie('obl_vid_name', $_COOKIE['obl_vid_name'], $st_time, $st_path, false);
            //$_SESSION['obl_vid_name'] = $_COOKIE['obl_vid_name'];
            $this -> obl_vid_name = $_COOKIE['obl_vid_name']; 
            
            ///***** Устанавливаем флаг, что пользователь зарегистрирован *****/
            $this -> isRegistered = true;
        }
        else
            $this ->isRegistered = false;
    }
    
   /**
    * Возвращает флаг, зарегистрирован ли пользователь в системе
    * @return bool
    */
    public function isRegistered() {
        return $this -> isRegistered;
    }
    
    /**
     * Возвращает флаг, является ли пользователь администратором
     * @return bool
     */
    public function isAdministrator(){
        return $this -> isAdministrator;
    }
    
    /**
     * Возвращает id пользователя
     * @return integer
     */
     public function getId(){
        return $this -> id;
    }
    
    /**
     * Возвращает фио пользователя
     * @return string
     */
    public function getFio(){
        return $this -> fio;
    }
    
    /**
     * Возвращает Email пользователя
     * @return string
     */
    public function getEmail(){
        return $this -> email;
    }
    
    /**
     * Возвращает наименование области видимости пользователя
     * @return string
     */
    public function getVisibilityAreaTilte(){
        return $this -> obl_vid_name;
    }


    public function getOblVidId(){
            return $this -> obl_vid_id;
        }
    
    /**
     * Разлогинивает пользователя
     */
    public function logOut(){
        session_start();
        /***** Если куки установлены *****/
        if ($_COOKIE['user_id'] && $_COOKIE['user_id'] != '' ){
            //unset($_SESSION["user_id"]);
            unset($_COOKIE["user_id"]);
        }
    }
}

?>
