$(document).ready(function () {
  $('.get-donation').each(function () {
    const current = Number($(this).find('.current span').text());
    const max = Number($(this).find('.max').text());
    const filled = current / max * 100;
    $(this).find('.after').css('width', `${filled}%`);
    const currentFormatted = new Intl.NumberFormat('ru-RU').format(current);
    const maxFormatted = new Intl.NumberFormat('ru-RU').format(max);
    $(this).find('.current span').text(currentFormatted);
    $(this).find('.max').text(maxFormatted);
  })
});