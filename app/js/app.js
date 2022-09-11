// // Import vendor jQuery plugin example
// import '~/app/libs/mmenu/dist/mmenu.js'
import $ from "jquery";
import "jquery-mask-plugin"

$(document).ready(function () {
  // Plugin

  $('.tel').mask('+7(Z00) 000-00-00', {translation: {'Z': {pattern: /[0-79]/}}});
  tinymce.init({
    selector: '#mytextarea',
    plugins: 'image code',
    file_picker_types: 'image',
    toolbar: [
      {name: 'history', items: ['undo', 'redo']},
      {name: 'styles', items: ['styles']},
      {name: 'formatting', items: ['bold', 'italic']},
      {name: 'alignment', items: ['alignleft', 'aligncenter', 'alignright', 'alignjustify']},
      {name: 'image', items: ['image']},
    ],
    images_file_types: 'jpg,jpeg,webp,png',
    height: "420",
    language: 'ru',
    automatic_uploads: true,
    file_picker_callback: (cb, value, meta) => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');

      input.addEventListener('change', (e) => {
        const file = e.target.files[0];

        const reader = new FileReader();
        reader.addEventListener('load', () => {
          /*
            Note: Now we need to register the blob in TinyMCEs image blob
            registry. In the next release this part hopefully won't be
            necessary, as we are looking to handle it internally.
          */
          const id = 'blobid' + (new Date()).getTime();
          const blobCache = tinymce.activeEditor.editorUpload.blobCache;
          const base64 = reader.result.split(',')[1];
          const blobInfo = blobCache.create(id, file, base64);
          blobCache.add(blobInfo);

          /* call the callback and populate the Title field with the file name */
          cb(blobInfo.blobUri(), {title: file.name});
        });
        reader.readAsDataURL(file);
      });

      input.click();
    },
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
  });
  $('.mail').mask("A", {
    translation: {
      "A": { pattern: /[\w@\-.+]/, recursive: true }
    }
  });


  // Layout events

  $('.form-input').on('focus', function () {
    $(this).addClass('focused')
  })
  $('.form-input').on('blur', function () {
    if ($(this).val() === '') {
      $(this).removeClass('focused');
      $(this).parents('.form-row').removeClass('active')
    }
  });
  $('.form-input-countered').on('input change', function () {
    const parent = $(this).parents('.form-row');
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
      $(this).siblings('.form-error-length').hide();
      $(this).removeClass('error-length');
    }
  });

  $('.form-award-input').on('change', function (e) {
    let input = $(this);
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
        $('.award__img-pic').append(image);
        input.siblings('.award__img-box').addClass('uploaded');
        return true;
      }
    });
  });

  $('.form-file').on('change', function (ev) {
    let files = ev.currentTarget.files;
    if (!files.length) return;

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
          box.append(image);
          box.addClass('uploaded');
          $('.form-counter-photo .current').text(i++);
          return true;
        }
      })
    }
  });

  $('.close').on('click', function () {
    $(this).parent().removeClass('uploaded');
    $(this).siblings('img').remove();
    const count = $('.form-file-img.uploaded').length;
    $('.form-row-file .current').text(count)
    if (count === 0) {
      $('.form-row-file').removeClass('active');
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
      $(this).parent('.form-row').addClass('error')
    } else {
      $(this).removeClass('mail-mask-error');
      $(this).parent('.form-row').removeClass('error')
    }


  })


  $('.numberonly').keypress(function (e) {
    const charCode = (e.which) ? e.which : event.keyCode;
    if (String.fromCharCode(charCode).match(/[^0-9]/g))
      return false;
  });

  $('.form-radio-input').on('change', function () {
    const val = $(this).val();
    const type = $(this).data('context');
    $(`.${type}`).find('.form-radio-description').hide();
    const el = $(`.form-radio-description[data-value="${val}"]`).show()
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
    $('html, body').animate({
      scrollTop: $("#create-project-form").offset().top
    }, 1000);
  });

  $('#award-delivery').on('change', function () {
    $(this).prop('checked') === true ? $('.open-if-delivery').addClass('open') : $('.open-if-delivery').removeClass('open');
  })

  $('#create-project-form').submit(function (e) {
    e.preventDefault();
    $('.form-file-img.uploaded').each(function (i, el) {
      let url = $(this).find('img').attr('src');
      $('#create-project-form').append(`<input type="hidden" name="project-photo-${i}" value="${url}" /> `);
    })
    $('.award__img-box.uploaded').each(function (i, el) {
      let url = $(this).find('img').attr('src');
      $('#create-project-form').append(`<input type="hidden" name="project-award-photo-${i}" value="${url}" /> `);
    })

    const requiredFields = $(this).find('.required');
    //console.log(`total - ${requiredFields.length}`)
    requiredFields.each(function () {
      if ( !$(this).val() ) {
        console.log('error empty')
      } else if ( $(this).hasClass('error-length') ) {
        console.log('error length');
      } else if ( $(this).hasClass('mail-mask-error') ) {
        console.log('error mail mask')
      }
    })



    const data = $(this).serializeArray();
    //console.log(data)
  })
});

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
  return emailReg.test( val );
}