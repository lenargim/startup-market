import $ from "jquery";

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
  });

  $('input[name="award-type"]').on('change', function () {
    let id = $(this).attr('id');
    changeAwardBlock(id)
  });

  $('.internal').on('click', function () {
    const id = $(this).parents('.project-award__block').attr('for');
    $(`#${id}`).prop('checked', true);
    changeAwardBlock(id)
  });


  $('input[name="delivery-type"]').on('change', function () {
    const type = $(this).val();
    let choose = $(this).parents('.form-radio').siblings('.choose');
    choose.each(function () {
      if ($(this).hasClass(type)) {
        $(this).show();
        $(this).find('.internal').addClass('required')
      } else {
        $(this).hide();
        $(this).find('.internal').removeClass('required')
      }
    })
  });


  function changeAwardBlock(id) {
    $('.internal').removeClass('required');
    $('.form-row').removeClass('error');
    $('.project-award__block-open').hide();
    const label = $(`label[for=${id}]`);
    label.find('.internal').addClass('required');
    label.find('.project-award__block-open').show()
  }



  if (window.innerWidth < 1024) {
    const activeLi = $('.project__sidebar-li.active');
    const offset = activeLi.position().left;
    const nav = activeLi.parent('nav');
    const left = nav.find('li:first-child').position().left;
    const diff = offset - left ;
    nav.animate({
      scrollLeft: diff,
    }, 1000)
  }



  const slider = $('.project__slider');
  const offset = slider.offset().top + slider.height();
  const docHeight = document.body.scrollHeight - $('footer').height() - $(window).height() - 100;
  $(document).on('scroll', function () {
    if (slider.length) {
      let screenOffset = window.pageYOffset;
      if (window.innerWidth > 1023) {
        // if ( screenOffset > offset && screenOffset < docHeight ) {
        //   let top = screenOffset - offset - 40;
        //   $('.could-fixed').css('top', top)
        // }
      } else {
        if (screenOffset > offset) {
          $('.could-fixed-mobile').addClass('fixed')
        } else {
          $('.could-fixed-mobile').removeClass('fixed')
        }
      }
    }
  });

  let parent = document.querySelector('.project__sidebar').parentElement;

  while (parent) {
    const hasOverflow = getComputedStyle(parent).overflow;
    if (hasOverflow !== 'visible') {
      console.log(hasOverflow, parent);
    }
    parent = parent.parentElement;
  }
});
