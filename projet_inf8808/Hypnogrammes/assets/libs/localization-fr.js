/**
 * Objet fournissant des fonctions pour formater correctement des données selon les règles locales (canadien-français).
 */
var localization = (function(d3) {
  "use strict";

  var self = {};
  var frenchLocale = {
    "decimal": ",",
    "thousands": "",
    "grouping": [3],
    "currency": ["$", ""],
    "dateTime": "%a %b %e %X %Y",
    "date": "%d/%m/%Y",
    "time": "%H:%M:%S",
    "periods": ["AM", "PM"],
    "days": ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
    "shortDays": ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
    "months": ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
    "shortMonths": ["jan", "fév", "mar", "avr", "mai", "jun", "jui", "août", "sep", "oct", "nov", "déc"]
  };
  var customTimeFormat = [
    [".%L", function(d) { return d.getMilliseconds(); }],
    [":%S", function(d) { return d.getSeconds(); }],
    ["%I:%M", function(d) { return d.getMinutes(); }],
    ["%I %p", function(d) { return d.getHours(); }],
    ["%d %b", function(d) { return d.getDate() !== 1; }],
    ["%B", function(d) { return d.getMonth(); }],
    ["%Y", function() { return true; }]
  ];
  var locale = d3.timeFormatDefaultLocale(frenchLocale);

  /**
   * Obtient les règles locales.
   *
   * @return object   Un objet contenant les règles.
   */
  self.getLocale = function() {
    return locale;
  };

  /**
   * Formate une date selon les règles locales.
   *
   * @param date    L'objet date à formater.
   * @return {*}    La date formatée.
   */
  self.getFormattedDate = function(date) {
    return locale.format(customTimeFormat.find(function(format) {
      return format[1](date)
    })[0])(date);
  };

  return self;
})(d3);
