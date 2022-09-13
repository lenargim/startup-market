$(document).ready(function () {
  const current = Number($('.project__collect .current').text());
  const max = Number($('.project__collect .max').text());
  const filled = current / max * 100;
  $('.project__collect .after').css('width', `${filled}%`);
  const currentFormatted = new Intl.NumberFormat('ru-RU').format(current);
  const maxFormatted = new Intl.NumberFormat('ru-RU').format(current);
  $('.project__collect .current').text(currentFormatted);
  $('.project__collect .max').text(maxFormatted);
});