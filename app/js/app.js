// // Import vendor jQuery plugin example
// import '~/app/libs/mmenu/dist/mmenu.js'
import $ from "jquery";
import "jquery-mask-plugin"

$(document).ready(function () {
  // Plugin

  $('.tel').mask('+7(Z00) 000-00-00', {translation: {'Z': {pattern: /[0-79]/}}});

  $('.mail').mask("A", {
    translation: {
      "A": {pattern: /[\w@\-.+]/, recursive: true}
    }
  });

  // Layout events

  $('.form-input').on('focus', function () {
    $(this).addClass('focused')
  })
  $('.form-input').on('blur', function () {
    if ($(this).val() === '') {
      $(this).removeClass('focused');
      $(this).parents('.form-row').removeClass('active');
      if ($(this).hasClass('required')) {
        $(this).parent('.form-row').addClass('error');
        $(this).siblings('.form-error-empty').show()
      }
    }
  });

  $('.award__filled .form-counter').each(function () {
    let currentLength = $(this).siblings('.form-input-countered').val().length;
    $(this).find('.current').text(currentLength);
  })

  $('.form-award-input').on('change', function (e) {

    let input = $(this);
    let picBox = $(this).siblings('.award__img-box').find('.award__img-pic');
    let file = e.currentTarget.files[0];
    if (!file) return;
    if (file.size > 5242880) {
      alert('Файл слишком большой');
      return;
    }
    readFileAsUrl(file).then(url => {
      const image = new Image();
      //Set the Base64 string return from FileReader as source.
      image.src = url;
      //Validate the File Height and Width.
      image.onload = function () {
        var height = this.height;
        var width = this.width;
        if (width < 600 || height < 338) {
          alert("Минимальное разрешение 600×338 пикселей");
          return false;
        }

        if (!picBox.find('img').length) {
          picBox.append(image);
        } else {
          picBox.find('img').replaceWith(image)
        }
        input.siblings('.award__img-box').addClass('uploaded');
        return true;
      }
    });
  });

  $('.award__add').on('click', function () {
    $('.award__new').slideToggle();
  });

  $('.award__new .delete').on('click', function (e) {
    e.preventDefault();
    $('.award__new').find('input[type=text], input[type=number], textarea').val('');
    $('.award__new .focused').removeClass('focused');
    $('.award__new .active').removeClass('active');
    $('.award__new .current').text('0');
  });

  $('.form-file').on('change', function (e) {
    let files = e.currentTarget.files;
    if (!files.length) return;
    if (files.length > 4) {
      alert('Максимум 4 изображения');
      return;
    }

    // Store promises in array
    for (let i = 0; i < files.length; i++) {
      readFileAsUrl(files[i]).then(url => {
        const image = new Image();
        //Set the Base64 string return from FileReader as source.
        image.src = url;
        //Validate the File Height and Width.
        image.onload = function () {
          var height = this.height;
          var width = this.width;
          if (width < 1300 || height < 732) {
            alert("Минимальное разрешение 1300×732 пикселей");
            return false;
          }
          $('.form-row-file').addClass('active');
          let box = $(`#photo-${++i}`);

          if (!box.find('img').length) {
            box.append(image);
          } else {
            box.find('img').replaceWith(image)
          }

          //box.append(image);
          box.addClass('uploaded');
          $('.form-counter-photo .current').text(i++);
          return true;
        }
      })
    }
  });

  $('.label .close').on('click', function () {
    $(this).parent().removeClass('uploaded');
    $(this).siblings('img').remove();
    const count = $('.form-file-img.uploaded').length;
    $('.form-row-file .current').text(count);
    if (count === 0) {
      $('.form-row-file').removeClass('active');
    }
  });

  $('.form-input[type=text], .form-input[type=number]').on('input change', function () {
    const parent = $(this).parents('.form-row');
    if ($(this).hasClass('form-input-countered')) {
      const counter = $(this).siblings('.form-counter');
      const length = $(this).val().length;
      const max = counter.find('.max').text();
      counter.find('.current').text(length);

      if (length > max) {
        parent.removeClass('active').addClass('error');
        $(this).siblings('.form-error-length').show();
        $(this).addClass('error-length');
      } else {
        parent.addClass('active').removeClass('error');
        $(this).siblings('.form-error').hide();
        $(this).removeClass('error-length');
      }
    } else {
      parent.removeClass('error');
      $(this).siblings('.form-error').hide();
      //$(this).removeClass('error-length');
    }
  });

  $('input[type=number]').on('input change', function () {
    const maxNumber = $(this).data('max-number');
    if (typeof maxNumber !== typeof undefined && maxNumber !== false) {
      $(this).val() > maxNumber || $(this).val().length > maxNumber.toString().length
        ? $(this).val(maxNumber) : false;
    }
  });

  $('.mail').on('input change', function () {
    let val = $(this).val();
    if (!validateEmail(val)) {
      $(this).addClass('mail-mask-error');
      $(this).parent('.form-row').addClass('error');
      $(this).siblings('.form-error-mail').show();
    } else {
      $(this).removeClass('mail-mask-error');
      $(this).parent('.form-row').removeClass('error');
      $(this).siblings('.form-error-mail').hide();
    }
  });

  $('input[name=project-location]').on('change', function () {
    $(this).val() === 'local' ? $('#location-city').addClass('required') : $('#location-city').removeClass('required')
  });
  $('input[name=project-type]').on('change', function () {
    const time = $('#create-project-days');
    if ($(this).val() === 'all-and-more') {
      time.addClass('required');
      time.parent('.form-row').show();
    } else if ($(this).val() === 'all-or-nothing') {
      time.removeClass('required');
      time.parent('.form-row').hide();

    }
  });

  $('.numberonly').keypress(function (e) {
    const charCode = (e.which) ? e.which : event.keyCode;
    if (String.fromCharCode(charCode).match(/[^0-9]/g))
      return false;
  });

  $('.form-radio-input').on('change', function () {
    const val = $(this).val();
    const type = $(this).data('context');
    $(`.${type}`).find('.form-radio-description').hide();
    $(`.form-radio-description[data-value="${val}"]`).show()
  });

  $('.step-event').on('click', function (e) {
    e.preventDefault();
    const activeBlock = $('.create-project__main.active');
    const index = activeBlock.index();
    activeBlock.removeClass('active');
    $('.header-create-project__menu .active').removeClass('active');
    if ($(this).hasClass('step-next')) {
      $('.create-project__main').eq(index + 1).addClass('active');
      $('.header-create-project__menu li').eq(index + 1).addClass('active')
    } else if ($(this).hasClass('step-prev')) {
      $('.create-project__main').eq(index - 1).addClass('active');
      $('.header-create-project__menu li').eq(index - 1).addClass('active')
    } else if ($(this).hasClass('header-create-project__menu-link')) {
      const li = $(this).parent('li');
      const indexLi = li.index();
      li.addClass('active');
      $('.create-project__main').eq(indexLi).addClass('active');
    }
    if (window.innerWidth < 768) {
      const activeLi = $('.header-create-project__menu li.active');
      const offset = activeLi.position().left;
      const nav = activeLi.parent('nav');
      const left = nav.find('li:first-child').position().left;
      const diff = offset - left ;
      nav.animate({
        scrollLeft: diff,
      }, 1000)
    }
    $('html, body').animate({
      scrollTop: $("#create-project-form").offset().top
    }, 1000);
  });

  $('#award-delivery, #award-delivery-filled').on('change', function () {
    const parent = $(this).parents('.award__delivery');
    if ($(this).prop('checked')) {
      parent.find('.open-if-delivery').addClass('open');
      parent.find('input[type=text]').addClass('required');
    } else {
      parent.find('.open-if-delivery').removeClass('open');
      parent.find('input[type=text]').removeClass('required');
    }
  });

  $('.edit').on('click', function (e) {
    e.preventDefault();
    const parent = $(this).parents('.could-be-editted');
    parent.addClass('is-eddited');
    parent.find('input, textarea, label button').attr('disabled', false)
  });

  $('.save').on('click', function (e) {
    e.preventDefault();
    const parent = $(this).parents('.is-eddited');
    parent.removeClass('is-eddited');
    parent.find('input, textarea, label button').attr('disabled', true);
    parent.find('.form-row').removeClass('active');
  });

  $('.error-box .close').on('click', function () {
    $('.error-box').hide();
  });


  // SUBMIT
  $('#create-project-form').on('submit', function (e) {
    e.preventDefault();
    // put base64 url into form
    $('.form-file-img.uploaded').each(function (i, el) {
      let url = $(this).find('img').attr('src');
      $('#create-project-form').append(`<input type="hidden" name="project-photo-${i}" value="${url}" /> `);
    });
    $('.award__img-box.uploaded').each(function (i, el) {
      let url = $(this).find('img').attr('src');
      $('#create-project-form').append(`<input type="hidden" name="project-award-photo-${i}" value="${url}" /> `);
    });

    // Check if errors exist
    const requiredFields = $(this).find('.required');
    const errorFieldsId = [];
    const errorPageIndexArray = [];
    requiredFields.each(function () {
      if (!$(this).val() || $(this).hasClass('error-length') || $(this).hasClass('mail-mask-error')) {
        errorFieldsId.push($(this).attr('id'));
        $(this).parents('.form-row').addClass('error');
        if (!$(this).val()) $(this).siblings('.form-error-empty').show();
        if ($(this).hasClass('error-length')) $(this).siblings('.form-error-length').show();
        if (!$(this).hasClass('mail-mask-error') && $(this).val()) $(this).siblings('.form-error-mail').show()
      }
    });

    errorFieldsId.length ? $('.error-box').addClass('active') : $('.error-box').removeClass('active');

    errorFieldsId.map(id => {
      errorPageIndexArray.push($(`#${id}`).parents('.create-project__main').index())
    });
    const cleanArr = errorPageIndexArray.filter((item, pos) => errorPageIndexArray.indexOf(item) == pos);


    // Highlight error menus
    $('.header-create-project__menu li').each(function () {
      cleanArr.includes($(this).index()) ? $(this).addClass('error') : $(this).removeClass('error');
    });

    // if no errors
    if (!errorFieldsId.length) {
      const data = $(this).serializeArray();
      window.location.href = "./thankyou.html";
    }
  });

  $('#award-img-filled').on('change, input', function () {
    console.log('ddd')
  });

  const myMenu = $('.header-create-project__menu');
  if (myMenu.length) {
    //showOffset(myMenu);
  }
});

function showOffset(myMenu) {
  if (window.innerWidth < 768) {
    console.log(myMenu.scrollLeft());
    setTimeout(function () {
      showOffset(myMenu)
    }, 1000);
  }
}


function readFileAsUrl(file) {
  return new Promise(function (resolve, reject) {
    let fr = new FileReader();

    fr.onload = function () {
      resolve(fr.result);
    };

    fr.onerror = function () {
      reject(fr);
    };

    fr.readAsDataURL(file);
  });
}

function validateEmail(val) {
  const emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailReg.test(val);
}