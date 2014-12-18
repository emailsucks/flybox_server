var burger = document.getElementById('burger');
var sideMenu = document.getElementById('sideMenu');
var nav = document.querySelector('nav');
burger.onclick = function() {
  console.log(sideMenu.style.display);
  if (sideMenu.style.display == '' || sideMenu.style.display == 'none') {
    sideMenu.style.display = 'block';
    nav.style.zIndex = 10;
  }
  else {
    sideMenu.style.display = 'none';
    nav.style.zIndex = 0;
  }
};
var compose = document.querySelector('.compose');
var writeMail = document.getElementById('writeMail');
var main = document.querySelector('main');
var functions = document.querySelector('.functions');
var checkedNames = document.querySelector('.checkedNames');
compose.onclick =  function() {
  if (writeMail.style.display == ('none' || '')) {
    writeMail.style.display = 'flex';
    compose.className += ' writing';
    main.className += ' inactive';
    functions.className += ' inactive';
    checkedNames.className = 'checkedNames';
  }
  else {
    writeMail.style.display = 'none';
    compose.className = 'compose';
    main.className = '';
    functions.className = 'functions';
    checkedNames.className += ' checkedNamesActive';
  };
};

var tools = document.getElementById('tools');
var toolMenu = document.getElementById('toolMenu');
tools.onclick =  function() {
  if (toolMenu.style.display == ('none' || '')) {
    toolMenu.style.display = 'flex';
    tools.className = 'toolsOpen';
  }
  else {
    toolMenu.style.display = 'none';
    tools.className = '';
  };
};
//
//message viewer
//
// var pars = document.querySelectorAll('.pars');
// var readMessage = document.getElementById('readMessage');
// var read = document.getElementById('read');
// for (i=0; i<pars.length; i++) {
//   pars[i].onclick = function() {
//     var content = pars[i].querySelector('~ div');
//     // $('#readMessage').empty();
//     // content.clone().appendTo($('#readMessage'));
//     // $('#read').css('display', 'flex');
//     // $('main').css({
//     //     'z-index': '0',
//     // });
//   };
// }
//
// $('#close').on('click', function () {
//   $('#readMessage').empty();
//   $('#read').css('display', 'none');
// });

var label = document.querySelectorAll('section span label');
for (i=0; i<label.length; i++) {
  label[i].onclick = function() {
    if((this).className == 'checkbox-checked') {
      (this).className = '';
      var parent = (this).parentNode;
      parent.parentNode.className = '';
    }
    else {
      (this).className = 'checkbox-checked';
      var parent = (this).parentNode;
      parent.parentNode.className += ' checked';
    };
  };
};
var all = document.querySelector('.all');
var input = document.querySelectorAll('section input');
all.onclick = function() {
  if (all.className == 'all checkbox-checked') {
    for (i=0; i<input.length; i++) {
      all.className = 'all';
      label[i].className = '';
      var parent = input[i].parentNode;
      parent.parentNode.className = '';
    }
  }
  else if (all.className == 'all') {
    for (i=0; i<input.length; i++) {
      all.className = 'all checkbox-checked';
      label[i].className = 'checkbox-checked';
      var parent = input[i].parentNode;
      parent.parentNode.className = 'checked';
      console.log(parent.parentNode.className);
    };
  };
};

// var n = $( ".checked" ).length;

// $('label').on('click', function() {
//   var n = $( ".checked" ).length;
//   if (n > 0) {
//     $('.checkedNames').addClass('checkedNamesActive');
//     $( ".checkedNamesActive" ).html('<p>' + n + (n === 1 ? " message is" : " messages are") + " checked!</p>" );
//   }
//   else {
//     $('.checkedNames').removeClass('checkedNamesActive');
//     $('.all').removeClass('checkbox-checked');
//   }
// });
