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
  hornClone.find('img').attr('src', this.image_url);
  hornClone.find('p').text(this.description);
  hornClone.removeClass('clone');
  hornClone.attr('class', this.keyword);
};

//Use AJAX, specifically $.get(), to read the provided JSON file.

Picture.readJson = () => {
  $.get('./data/page-1.json')
    .then(data => {
      data.forEach(element => {
        Picture.allHorns.push(new Picture(element));
      });
    })
    .then(Picture.loadHorns);
};

Picture.loadHorns = () => {
  Picture.allHorns.forEach(horn => horn.render());

  Picture.populateFilter();
};

$(() => Picture.readJson());


// Filter function to view image corresponding to a picked keyword

Picture.populateFilter = () => {
  let filterKeywords = [];

  $('option').not(':first').remove();

  Picture.allHorns.forEach(horn => {
    if(!filterKeywords.includes(horn.keyword)) {
      filterKeywords.push(horn.keyword);
    }
  });


  filterKeywords.sort();
  filterKeywords.forEach(keyword => {
    let optionTag = `<option value="${keyword}">${keyword}</option>`;
    $('select').append(optionTag);
  });
};


Picture.handleFilter = () => {
  $('select').on('change', function() {
    let selected = $(this).val();
    if(selected !== 'default') {
      $('div').hide();
      $(`div.${selected}`).fadeIn();
    }
  });
};

$(() => Picture.handleFilter());


// function to sort the order in which images are rendered

Picture.handleSort = () => {
  $('input').on('change', function() {
    $('select').val('default');
    $('div').remove();
    Picture.sortBy(Picture.allHorns, $(this).attr('id'));
    Picture.allHorns.forEach(horn => {
      $('#image-container').append(horn.render());
    });
  });
};

$(() => Picture.handleSort());


// function to display a clicked-on image

Picture.handleImageEvents = () => {
  $('main').on('click', 'div', function(event) {
    event.stopPropagation();
    let $clone = $(this).clone();
    let elements = $clone[0].children;

    $('section').addClass('active').html(elements);

    $(window).scrollTop(0);
  });

  $('body').on('click', function() {
    const $section = $('section');
    $section.empty();
    $section.removeClass('active');
  });
};

$(() => Picture.handleImageEvents());

