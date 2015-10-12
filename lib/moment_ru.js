moment.lang('ru', {
    months : "Январь_Февраль_Март_Апрель_Май_Июнь_Июль_Август_Сентябрь_Октябрь_Ноябрь_Декабрь".split("_"),
    monthsShort : "Янв_Фев_Март_Апр_Май_Июнь_Июль_Авг_Сент_Окт_Ноя_Дек".split("_"),
    weekdays : "Воскресенье_Понедельник_Вторник_Среда_Четверг_Пятница_Суббота".split("_"),
    weekdaysShort : "Вс_Пн_Вт_Ср_Чт_Пт_Сб".split("_"),
    longDateFormat : {
        L : "DD/MM/YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY HH:mm",
        LLLL : "dddd, D MMMM YYYY HH:mm"
    },
    meridiem : {
        AM : 'AM',
        am : 'am',
        PM : 'PM',
        pm : 'pm'
    },
    calendar : {
        sameDay: "[Ajourd'hui à] LT",
        nextDay: '[Demain à] LT',
        nextWeek: 'dddd [à] LT',
        lastDay: '[Hier à] LT',
        lastWeek: 'dddd [denier à] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : "in %s",
        past : "il y a %s",
        s : "секунд",
        m : "une minute",
        mm : "%d minutes",
        h : "une heure",
        hh : "%d heures",
        d : "un jour",
        dd : "%d jours",
        M : "un mois",
        MM : "%d mois",
        y : "une année",
        yy : "%d années"
    },
    ordinal : function (number) {
        return (~~ (number % 100 / 10) === 1) ? 'er' : 'ое';
    }
});
