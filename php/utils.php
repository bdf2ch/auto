<?php

    function format_date ($unix_timestamp, $format) {
        if (!is_null($unix_timestamp) && !is_null($format)) {
            $temp_date = getdate($unix_timestamp);
            $month = $temp_date["mon"] < 10 ? "0".$temp_date["mon"] : $temp_date["mon"];
            $mday = $temp_date["mday"] < 10 ? "0".$temp_date["mday"] : $temp_date["mday"];
            $hours = $temp_date["hours"] < 10 ? "0".strval($temp_date["hours"] - 1) : $temp_date["hours"] - 1;
            $minutes = $temp_date["minutes"] < 10 ? "0".$temp_date["minutes"] : $temp_date["minutes"];
            $seconds = $temp_date["seconds"] < 10 ? "0".$temp_date["seconds"] : $temp_date["seconds"];
            $months = array(
                1 => "янв",
                2 => "фев",
                3 => "мар",
                4 => "апр",
                5 => "май",
                6 => "июн",
                7 => "июл",
                8 => "авг",
                9 => "сен",
                10 => "окт",
                11 => "ноя",
                12 => "дек"
            );
            switch ($format) {
                case "DD.MM.YYYY":
                    return $mday.".".$month.".".$temp_date["year"];
                    break;
                case "DD MMM YYYY":
                    return $mday." ".$months[$temp_date["mon"]]." ".$temp_date["year"];
                    break;
                case "DD MMM YYYY HH:mm":
                    return $mday." ".$months[$temp_date["mon"]]." ".$temp_date["year"]." ".$hours.":".$minutes;
                    break;
                case "HH:mm":
                    return $hours.":".$minutes;
                    break;
            }
        } else
            return false;
    };

?>