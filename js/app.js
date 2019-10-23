/* eslint-disable no-undef */
'use strict';

function Picture(horn) {
  this.image_url = horn.image_url;
  this.title = horn.title;
  this.description = horn.description;
  this.keyword = horn.keyword;
}

Picture.allHorns = [];

//Use jQuery to make a copy of the HTML template of the photo component.

Picture.prototype.render = function() {
  $('main').append('<div class="clone"></div>');
  let hornClone = $('div[class="clone"]');

  let hornHtml = $('#photo-template').html();

  hornClone.html(hornHtml);

  hornClone.find('h2').text(this.title);
  hornClone.find('horn').attr('src', this.image_url);
  hornClone.find('p').text(this.description);
  hornClone.removeClass('clone');
  hornClone.attr('class', this.keyword);
};

//Use AJAX, specifically $.get(), to read the provided JSON file.
//Failed to load resource: the server responded with a status of 404 (Not Found)

Picture.readJson = () => {
  $.get('./data/page-1.json')
    .then(data => {
      data.forEach(element => {
        Picture.allHorns.push(new Horn(element));
      });
    })
    .then(Picture.loadHorns);
};

Picture.loadHorns = () => {
  Picture.allHorns.forEach(horn => horn.render())
};

$(() => Picture.readJson());





