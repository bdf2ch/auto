$(document).ready(function(){
            
            
            
            //========= Инициализация Календаря====================
            $.datepicker.setDefaults($.datepicker.regional['ru']);
            $('#datepicker').datepicker({
                minDate: 0,
                showOn: "both",
                buttonImage: "src/img/ico_calendar_16x16.png",
		buttonImageOnly: true
            });
            
            
            
            //========= Установка слушателя для активного текста ===
            $('.active-text').hover(function(){
                           $(this).addClass('text-hover');
                      },function(){
                           $(this).removeClass('text-hover');
                      }
            );
            
            
            
            //========== Инициализация Выбиралки Времени============
            $('#timepicker').timepicker({
                    timeOnlyTitle: 'Выберите время',
                    timeText: 'Время',
                    hourText: 'Часы',
                    minuteText: 'Минуты',
                    secondText: 'Секунды',
                    currentText: 'Сейчас',
                    closeText: 'Готово',
                    hourGrid: 4,
                    minuteGrid: 15,
                    stepMinute: 15
            });
            
            
            
            //===============Показать/Спрятать Времявыбиралку========
            $('#timePickSwithcer').click(function(){
                var elem = $(this);
                
                if (!elem.hasClass('tpSwClk')){
                    
                    elem.html('Убрать уточнение времени');
                    elem.addClass('text-red').removeClass('text-blue');
                    $('#timepicker').val('');
                    
                    
                } else {
                    
                    elem.html('Уточнить время');
                    $('#timepicker').val('');
                    elem.addClass('text-blue').removeClass('text-red');
                
                }
                
                    elem.toggleClass('tpSwClk');
                
                $('#timepicker').fadeToggle(function(){
                   var elt = $(this); 
                   if (elt.is(':visible')) elt.focus();
                });
            });
            
            
            
            //======================================================
            $('input#newApTopic').focusin(function(){
                var elem = $(this);
                 
                if (elem.val() == 'Тема новой заявки'){
                    $(this).val('');
                }
                
                $('input#newApCancelButton').removeAttr('disabled');
                
            }).focusout(function(){
                var elem = $(this); 
                var title = elem.attr('title');
                
                if(elem.val() == ''){
                    elem.val(title);
                    $('input#newApCancelButton').attr('disabled', true);
                }
            });
            
            
            
            //======================================================
            $('input#newApCancelButton').click(function(){
                $('input#newApTopic').val($('input#newApTopic').attr('title'));
                $(this).attr('disabled', true);
            });
            
            
            
            //====== Отображение помощи ============================
            $('#helpCaller').click(function(){
                $.ajax({
                    url: 'help.php',
                    type: 'GET',
                    success: function (data){
                        $('#helpDialog').html(data).dialog({
                            width: 760,
                            height: 500,
                            minWidth:450
                        });
                    }
                    
                });
                
            });
            
            
});    




//===============Переформатирование списка автокомплита=========================
$.ui.autocomplete.prototype._renderItem = function (ul, item) {
            item.label = item.label.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(this.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<span style='color:blue;'>$1</span>");
            return $("<li></li>")
                    .data("item.autocomplete", item)
                    .append("<a>" + item.label + " &mdash; "+ item.email +"</a>")
                    .appendTo(ul);
};



//===============Отображение всплывающего сообщения=============================
function splashAlert(typ, mess){
       var acceptIco    = '<img src="src/img/ico_accept_32x32.png" style="float: left; margin-right:10px;"/>';
       var errorIco     = '<img src="src/img/ico_error_32x32.png" style="float: left; margin-right:10px;"/>';
       var infoIco      = '<img src="src/img/ico_info_32x32.png" style="float: left; margin-right:10px;"/>';
       if ( typ == 'accept' ){
           
           var audio = $('<audio />', {
                            autoPlay : 'autoplay'
                        });
            addSource(audio, 'src/audio/click_01.mp3');
            addSource(audio, 'src/audio/click_01.ogg');
            audio.appendTo('body');
           
           $('#alertHolder').prepend('<div class="splashAlert">'+ acceptIco + mess +'</div>').ready( function() {
                var elem = $('#alertHolder .splashAlert:first');
                setTimeout(function(){elem.fadeOut(1000, function(){elem.remove()})},4000);
           });
       
       } else if ( typ == 'error' ){
           
            var audio = $('<audio />', {
                            autoPlay : 'autoplay'
                        });
            addSource(audio, 'src/audio/click_01.mp3');
            addSource(audio, 'src/audio/click_01.ogg');
            audio.appendTo('body');
           
           $('#alertHolder').prepend('<div class="splashAlert">'+ errorIco + mess +'</div>').ready( function() {
                var elem = $('#alertHolder .splashAlert:first');
                setTimeout(function(){elem.fadeOut(1000, function(){elem.remove()})},4000);
           });
       
       } else if ( typ == 'info' ){
           
           var audio = $('<audio />', {autoPlay : 'autoplay'});
            addSource(audio, 'src/audio/click_01.mp3');
            addSource(audio, 'src/audio/click_01.ogg');
            audio.appendTo('body');           
           
           $('#alertHolder').prepend('<div class="splashAlert">'+ infoIco + mess +'</div>').ready( function() {
                var elem = $('#alertHolder .splashAlert:first');
                setTimeout(function(){elem.fadeOut(1000, function(){elem.remove()})},4000);
           });
       
       }
}

function addSource(elem, path) {
    $('<source>').attr('src', path).appendTo(elem);
}
//==============================================================================
