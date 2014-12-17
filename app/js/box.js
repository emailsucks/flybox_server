window.addEventListener('resize', resize);
resize();
function resize () {
  var width = document.body.offsetWidth;
  if (width >= 1000) {
    var full = document.querySelector('.body-cont').offsetHeight;
    var opts = document.querySelector('.options').offsetHeight;
    var mailBody = document.querySelector('.body');
    var mailBodyStyle = document.querySelector('.body').style;
    mailBodyStyle.height = full;
    var cont = mailBody.offsetHeight;
    var par = document.querySelector('#aaa').offsetHeight;
    var h1 = document.querySelector('h1').offsetHeight;
    var changedHeight = full - par - opts - h1 - 48;
    var images = document.querySelector('.otherBody').getElementsByTagName('img')
    var imagesLen = images.length;
    var other = document.querySelector('.otherBody');
    for (iWTotal=0, ratioT=0, i=0; i < imagesLen; i++) {
      var iH = images[i].clientHeight;
      var iW = images[i].clientWidth;
      var ratio = iW / iH;
      ratioT += ratio;
      iWTotal += iW;
      images[i].style.minWidth = 100 / imagesLen + '%';
      images[i].style.height = changedHeight + 'px';
      if (imagesLen > 5) {
        images[i].style.height = changedHeight / 2 + 'px';
        other.style.flexWrap = 'wrap';
      };
    };
    other.style.minHeight = changedHeight + 'px';
    var ratioAve = ratioT / imagesLen;
    other.style.minWidth = (changedHeight * ratioAve) + 10 + 'px';
    var sections = document.querySelector('.comments').getElementsByTagName('section');
    var len = sections.length;
    for (i=0; i < len; i++) {
      var divH = sections[i].querySelectorAll('div')[0].offsetHeight;
      sections[i].style.minHeight = divH + 'px';
    };
  };
};

var search = document.querySelector('.searchInput');
search.addEventListener('keypress', entry);
function entry (e) {
  if (e.keyCode == 13) {
    var entry = search.value;
    var all = window.find(entry);
    console.log(all);
    function doSearch(entry) {
      if (window.find && window.getSelection) {
        document.designMode = "on";
        var sel = window.getSelection();
        sel.collapse(document.body, 0);
        while (window.find(entry)) {
          document.execCommand("HiliteColor", false, "yellow");
          sel.collapseToEnd();
        };
        document.designMode = "off";
      }
      else if (document.body.createTextRange) {
        console.log('asda');
        var textRange = document.body.createTextRange();
        while (textRange.findText(entry)) {
            textRange.execCommand("BackColor", false, "yellow");
            textRange.collapse(false);
        };
      };
    };
    return false;
  };
  // var find = document.body.createTextRange();
  // var sBookMark = find.getBookmark();
  // var result = find.findText(entry);
  // var all = document.body.innerHTML;
  // find.moveToBookmark(sBookMark);
};
// var width = $('body').width();
// if (width > 1000) {
//   var full = $('.body-cont').height();
//   var opts = $('.options').height();
//   $('.body').height(full);
//   var cont = $('.body').height();
//   var par = $('#aaa').height();
//   var changedHeight = cont - par - opts;
//   var iH = $('.otherBody img').height();
//   var iW = $('.otherBody img').width();
//   var ratio = iW / iH;
//   $('.otherBody').height(changedHeight - 72);
//   $('.otherBody').width((ratio * changedHeight) - 72);
//   var len = $('.comments section').length;
//   for (i=1; i < len + 1; i++) {
//     var divH = $('.comments section:nth-child(' + i + ') div').height();
//     $('.comments section:nth-child(' + i + ')').css('min-height', divH);
//   };
// };

// var asd = document.querySelector('.body').style
// asd.display = "flex";
// console.log(document.querySelector('.comments').style.color);