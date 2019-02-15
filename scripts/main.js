/**************************************** NAVIGATION ****************************************/

// On load...

$(function(){
    
    // Add exit button for mobile menu
    
    $('.mobile-menu-top .mobile-nav-links').each(function(){
        
        let back = $('<button type="button"></button>');
        $(back).addClass('exit');
        
        $(this).prepend(back);
        
    });
    
    // Set event handlers for mobile menu button
    
    $('.mobile-menu-button').on('click', function(event){
        
        $('.mobile-menu-top').css('display', 'block');
        
    });
    
    // Set event handlers for mobile menu exit button
    
    $('.mobile-nav-links button.exit').on('click', function(event){
        
        $(this).parent().parent().hide();
        
    });
    
    // Handle clicking outside mobile menu
    
    $('.mobile-menu').on('click', function(event){
        
        if($(this).has(event.target).length == 0){
            
            $(this).hide();
            
        }
        
    });
    
    // Handle resizing window
    
    $(window).resize(function(){
        
        // If window expands beyond breakpoint, hide mobile menu
        
        if($(window).width() > 1000){
            
            $('.mobile-menu').hide();
            
        }
        
    });
    
});



/**************************************** TABS ****************************************/

// On load...

$(function(){
    
    // Assign tab numbers; set active tab to first tab by default; set event handlers
    
    $('.tab-container').each(function(){
        
        setTabNumbers(this);
        setTabHandlers(this);
        setTab(this, 1);
    
    });
    
});

// Assign tab numbers to tabs and content

function setTabNumbers(tabContainer){
    
    let tabs = $(tabContainer).find('button.htab, button.vtab');
    let content = $(tabContainer).find('div.htab, div.vtab');
    
    for(let i = 1; i < tabs.length + 1; i++){
        
        $(tabs[i - 1]).attr('tabNumber', i);
        $(content[i - 1]).attr('tabNumber', i);
        
    }
    
}

// Set event handlers

function setTabHandlers(tabContainer){
    
    // Handle clicking on tab
    
    $(tabContainer).find('button.htab, button.vtab').on('click', function(event){
        
        setTab(tabContainer, $(this).attr('tabNumber'));
        
    });
    
    // Handle resizing window
    
    $(window).resize(function(){
        
        // Handle tab overflow
        
        handleTabOverflow(tabContainer);
        
    });
    
}

// Handle tab overflow

function handleTabOverflow(tabContainer){
    
    // Sort tabs, including placing overflown tabs back into container
    
    let tabRow = $(tabContainer).find('.horizontal-tabs, .vertical-tabs');
    let overflowTab = $(tabRow).find('button.overflow-tab');
    
    // Only handle overflow if using horizontal tabs (use float to determine since vertical tabs become horizontal on mobile)
    
    if($(tabRow).css('float') != 'left'){
        
        for(let i = 1; i < $(tabContainer).find('button.htab, button.vtab').length + 1; i++){
            
            $(tabRow).append($(tabRow).find('button.htab[tabNumber="' + i + '"], button.vtab[tabNumber="' + i + '"]'));
            
        }
        
        // Set variables
        
        let containerWidth = $(tabRow).width();
        let totalWidth = 0;
        let activeTab = $(tabRow).find('button.htab.active, button.vtab.active');
        let inactiveTabs = $(tabRow).find('button.htab:not(.active), button.vtab:not(.active)');
        
        // Add active tab width to total width since it will always be included
        
        totalWidth += $(activeTab).outerWidth();
        
        // Get overflow tab or create it to reference width
        
        let overflowMenu = $(overflowTab).find('.overflow-menu');
        
        if($(overflowTab).length == 0){
            
            overflowTab = $('<button type="button"><span></span></button>');
            $(overflowTab).addClass('overflow-tab');
            overflowMenu = $('<div></div>');
            $(overflowMenu).addClass('overflow-menu');
            $(overflowTab).append(overflowMenu);
            
        }
        
        $(tabRow).append(overflowTab);
        
        // Hide tabs that will not fit in tab container
        
        $(inactiveTabs).each(function(){
            
            // If tab will not fit OR if tab + overflow tab will not fit, then place in overflow menu
            
            let tabWidth = $(this).outerWidth();
            let addedWidth = $(this).nextAll('button.htab:not(.active), button.vtab:not(.active)').length > 0 ? tabWidth + $(overflowTab).outerWidth() : tabWidth;
            
            if(totalWidth + addedWidth > containerWidth){
                
                $(overflowMenu).append(this);
                
                // If first overflown tab, add overflow tab width to total width
                
                if($(overflowMenu).find('button.htab, button.vtab').length == 1){
                    
                    totalWidth += $(overflowTab).width();
                    
                }
                
            }
            
            // Add tab width to total width
            
            totalWidth += tabWidth;
            
        });
        
        // If no overflown tabs, remove overflow tab
        
        if($(overflowMenu).find('button.htab, button.vtab').length == 0){
            
            $(overflowTab).remove();
            
        }
        
    }
    
    // If vertical tabs and some tabs are in overflow menu, put them back on vertical tab bar and remove overflow menu
    
    else if($(overflowTab).find('button.htab, button.vtab').length > 0){
        
        for(let i = 1; i < $(tabContainer).find('button.htab, button.vtab').length + 1; i++){
            
            $(tabRow).append($(tabRow).find('button.htab[tabNumber="' + i + '"], button.vtab[tabNumber="' + i + '"]'));
            
        }
        
        $(overflowTab).remove();
        
    }
    
}

// Set tab content based on active tab

function setTab(tabContainer, tabNumber){
    
    // Place overflown tabs back into tab row
    
    let tabRow = $(tabContainer).find('.horizontal-tabs, .vertical-tabs');
    tabRow.append($(tabRow).find('button.htab, button.vtab'));
    
    // Get new active tab and section based on tab number
    
    let activeTab = $(tabContainer).find('button.htab[tabNumber="' + tabNumber + '"], button.vtab[tabNumber="' + tabNumber + '"]');
    let activeSection = $(tabContainer).find('div.htab[tabNumber="' + tabNumber + '"], div.vtab[tabNumber="' + tabNumber + '"]');
    
    // Set new active tab as active and deactivate all others
    
    $(activeTab).addClass('active');
    $(activeTab).siblings('button.htab, button.vtab').removeClass('active');
    
    // Set new active section as active and deactivate all others
    
    $(activeSection).addClass('active');
    $(activeSection).siblings('div.htab, div.vtab').removeClass('active');
    
    // Handle tab overflow
    
    handleTabOverflow(tabContainer);
    
    // Set sizes and center images for thumbnails and cards
    
    $(activeSection).find('.card-container-s, .card-container-m, .card-container-l, .card-container-flex').each(function(){
        
        setCardContainerSize(this);
        
    });
    
    $(activeSection).find('.thumbnail-container').each(function(){
        
        setThumbnailContainerSize(this);
        
    });
    
}



/**************************************** CARDS ****************************************/

// On load...

$(function(){
    
    // Set card container size 
    
    $('.card-container-s, .card-container-m, .card-container-l, .card-container-flex').each(function(){
        
        setCardContainerSize(this);
        
    });
    
    // Set card container on window resize
    
    $(window).resize(function(){
        
        $('.card-container-s, .card-container-m, .card-container-l, .card-container-flex').each(function(){
            
             setCardContainerSize(this);
            
        });
        
    });
    
});

// Set width of card container

function setCardContainerSize(cardContainer){
    
    // Get card width including margin
    
    let cardWidth;
    
    if($(cardContainer).hasClass('card-container-flex')){
        
        cardWidth = 510;
        
    }
    
    else if($(cardContainer).hasClass('card-container-l')){
        
        cardWidth = 410;
        
    }
    
    else if($(cardContainer).hasClass('card-container-m')){
        
        cardWidth = 310;
        
    }
    
    else{
        
        cardWidth = 260;
        
    }
    
    // If card container is big enough for 2 cards, set width of card container as interval of card width including margin
    
    if($(cardContainer).parent().width() > 2 * cardWidth || ($(cardContainer).hasClass('card-container-flex') && $(cardContainer).parent().width() > cardWidth)){
        
        $(cardContainer).width($(cardContainer).parent().width() - ($(cardContainer).parent().width()) % cardWidth);
        
    }
    
    // Otherwise, set width to 100%
    
    else{
        
        $(cardContainer).css('width', '100%');
        
    }
    
    // Center images on cards
    
    $(cardContainer).find('.card-img-s, .card-img-m, .card-img-l').each(function(){
        
        centerImage(this);
        
    });
    
}



/**************************************** LISTS ****************************************/

// On load...

$(function(){
    
    // Set list item image size 
    
    $('.list-item-img').each(function(){
        
        centerImage(this);
        
    });
    
    // Set list item image size on window resize
    
    $(window).resize(function(){
        
        $('.list-item-img').each(function(){
            
             centerImage(this);
            
        });
        
    });
    
});



/**************************************** THUMBNAILS ****************************************/

// On load...

$(function(){
    
    $('.thumbnail-container').each(function(){
        
        // Set event handlers
        
        setThumbnailHandlers(this);
        
        // Set width of thumbnail container
        
        setThumbnailContainerSize(this);
        
    });
    
    // Center images on thumbnail
    
    $('.thumbnail-container').find('.thumbnail').each(function(){
        
        centerImage(this);
        
    });
    
});

// Set event handlers

function setThumbnailHandlers(thumbnailContainer){
    
    // Handle clicking on thumbnail
    
    $(thumbnailContainer).find('.thumbnail').on('click', function(event){
        
        showSlideshow(thumbnailContainer, $(this).prevAll('.thumbnail').length + 1);
        
    });
    
    // Handle resizing window
    
    $(window).resize(function(){
        
        // Set width of thumbnail container
        
        setThumbnailContainerSize(thumbnailContainer);
        
    });
    
}

// Set width of thumbnail container

function setThumbnailContainerSize(thumbnailContainer){
    
    // If parent is more than 3 200px thumbnails, set width of thumbnail container as interval of 200px + 5px padding
    
    if($(thumbnailContainer).parent().width() > 630){
        
        $(thumbnailContainer).width($(thumbnailContainer).parent().width() - ($(thumbnailContainer).parent().width()) % 210);
        
    }
    
    // Otherwise, if parent is less than 3 100px thumbnails, set width of thumbnail container as interval of 100px + 5px padding
    
    else if($(thumbnailContainer).parent().width() < 330){
        
        $(thumbnailContainer).width($(thumbnailContainer).parent().width() - ($(thumbnailContainer).parent().width()) % 110);
        
    }
    
    // Otherwise, set width to 100%
    
    else{
        
        $(thumbnailContainer).css('width', '100%');
        
    }
    
    // Set height of thumbnails to equal its width
    
    $(thumbnailContainer).find('.thumbnail').each(function(){
        
        let height = $(this).height();
        let width = $(this).width();
        
        if(height != width){
            
            $(this).height(width);
            centerImage(this);
            
        }
        
    });
    
}

// Create or show slideshow

function showSlideshow(thumbnailContainer, slideNumber){
    
    // Get slideshow
    
    let slideshow = $(thumbnailContainer).find('.slideshow');
    
    // If slideshow exists, show it
    
    if(slideshow.length > 0){
        
        $(slideshow).show();
        
    }
    
    // Otherwise, create slideshow
    
    else{
        
        // Create slideshow
        
        slideshow = $('<div></div>');
        $(slideshow).addClass('slideshow');
        
        // HTML for start of slideshow thumbnail container
        
        let html1 = '';
        html1 += '<div class="slideshow">';
        html1 += '<button type="button" class="exit"></button>';
        html1 += '<div class="slideshow-thumbnail-container">';
        
        // HTML for start of slideshow main
        
        let html2 = '';
        html2 += '<div class="slideshow-main">';
        html2 += '<button type="button" class="prev"></button>';
        html2 += '<button type="button" class="next"></button>';
        
        // HTML for slides and slideshow thumbnails 
        
        $(thumbnailContainer).find('.thumbnail').each(function(){
            
            let image = $(this).find('img')[0].outerHTML;
            let heading = $(this).find('h1, h2, h3, h4, h5, h6').text();
            
            // Create slideshow thumbnails from thumbnail images
            
            html1 += '<button type="button" class="slideshow-thumbnail">';
            html1 += image;
            html1 += '</button>';
            
            // Create slides from thumbnail images
            
            html2 += '<div class="slideshow-picture">';
            html2 += '<h3>' + heading + '</h3>';
            html2 += image;
            html2 += '</div>';
            
        });
        
        // HTML for end of slideshow thumbnail container and slideshow main
        
        html1 += '</div>';
        html2 += '</div></div>';
        
        // Add HTML for slideshow thumbnail container and slideshow main to slideshow
        
        $(slideshow).html(html1 + html2);
        
        // Add slideshow to thumbnail container
        
        $(thumbnailContainer).append(slideshow);
        
        // Set event handlers for new slideshow and set slideshow size
        
        setSlideshowHandlers(slideshow);
        setSlideshowSize(slideshow);
        
        // Center images on slideshow thumbnails
        
        $(slideshow).find('.slideshow-thumbnail').each(function(){
            
            centerImage(this);
            
        });
        
    }
    
    // Set active slide
    
    setSlide(slideshow, slideNumber, false);
    
}

// Center images on thumbnail

function centerImage(imageContainer){
    
    let image = $(imageContainer).find('img')[0];
    
    // If image height/width > container height/width, set class with max-width
    
    if($(image).height() / $(image).width() > $(imageContainer).height() / $(imageContainer).width()){
        
        $(imageContainer).addClass('img-v');
        $(imageContainer).removeClass('img-h');
        
    }
    
    // Otherwise, set class with max-height
    
    else{
        
        $(imageContainer).addClass('img-h');
        $(imageContainer).removeClass('img-v');
        
    }
    
}



/**************************************** SLIDESHOWS ****************************************/

// On load...

$(function(){
    
    $('.slideshow').each(function(){
        
        // Set event handlers
        
        setSlideshowHandlers(this);
        
        // Set height and width of slideshow
        
        setSlideshowSize(this);
        
    });
    
});

// Set event handlers

function setSlideshowHandlers(slideshow){
    
    // Handle clicking on exit button
    
    $(slideshow).find('.exit').on('click', function(event){
        
        $(slideshow).hide();
        
    });
    
    // Handle clicking outside slideshow thumbnail container and slideshow main
    
    $(slideshow).on('click', function(event){
        
        let slideshowThumb = $(slideshow).find('.slideshow-thumbnail-container');
        let slideshowMain = $(slideshow).find('.slideshow-main');
        
        if($(slideshowThumb).has(event.target).length == 0 && $(slideshowMain).has(event.target).length == 0){
            
            $(slideshow).hide();
            
        }
        
    });
    
    // Handle clicking on slideshow thumbnail
    
    $(slideshow).find('.slideshow-thumbnail-container').find('.slideshow-thumbnail').on('click', function(event){
        
        setSlide(slideshow, $(this).prevAll('.slideshow-thumbnail').length + 1, true);
        
    });
    
    // Handle clicking on previous button
    
    $(slideshow).find('.prev').on('click', function(event){
        
        prevSlide(slideshow);
        
    });
    
    // Handle clicking on next button
    
    $(slideshow).find('.next').on('click', function(event){
        
        nextSlide(slideshow);
        
    });
    
    // Handle arrow keys
    
    $(document).on('keyup', function(event){
        
        // If left arrow, go to previous slide
        
        if(event.which == 37){
            
            prevSlide(slideshow);
            
        }
        
        // If right arrow, go to next slide
        
        if(event.which == 39){
            
            nextSlide(slideshow);
            
        }
        
    });
    
    // Handle resizing window
    
    $(window).resize(function(){
        
        // Set height and width of slideshow
        
        setSlideshowSize(slideshow);
        
    });
    
}

// Set height and width of slideshow

function setSlideshowSize(slideshow){
    
    let main = $(slideshow).find('.slideshow-main');
    let height = $(slideshow).height();
    let width = $(slideshow).width();
    let ratio = 1;
    let maxHeight = Math.min(Math.round(ratio * width), 720);
    let maxWidth = Math.min(Math.round(1 / ratio * height), 720);
    
    $(main).css('max-height', maxHeight + 'px');
    $(main).css('max-width', maxWidth + 'px');
    
}

// Set to previous slide

function prevSlide(slideshow){
    
    let i = 1;
    let slideNumber = 1;
    let slides = $(slideshow).find('.slideshow-main').find('.slideshow-picture');
    
    // Get position of active slide
    
    $(slides).each(function(){
        
        if($(this).hasClass('active')){
            
            slideNumber = i;
            
        }
        
        i++;
        
    });
    
    // If active slide is first slide, set previous slide as last slide; otherwise set previous slide as previous slide
    
    slideNumber = slideNumber == 1 ? $(slides).length : slideNumber - 1;
    
    // Set active slide as previous slide
    
    setSlide(slideshow, slideNumber, true);
    
}

// Set to next slide

function nextSlide(slideshow){
    
    let i = 1;
    let slideNumber = 1;
    let slides = $(slideshow).find('.slideshow-main').find('.slideshow-picture');
    
    // Get position of active slide
    
    $(slides).each(function(){
        
        if($(this).hasClass('active')){
            
            slideNumber = i;
            
        }
        
        i++;
        
    });
    
    // If active slide is last slide, set next slide as first slide; otherwise set next slide as next slide
    
    slideNumber = slideNumber == $(slides).length ? 1 : slideNumber + 1;
    
    // Set active slide as next slide
    
    setSlide(slideshow, slideNumber, true);
    
}

// Set specific slide

function setSlide(slideshow, slideNumber, animate){
    
    // Get new active thumbnail and slide based on slide number
    
    let thumbnailContainer = $(slideshow).find('.slideshow-thumbnail-container');
    let activeThumbnail = $(thumbnailContainer).find('.slideshow-thumbnail')[slideNumber - 1];
    let activeSlide = $(slideshow).find('.slideshow-main').find('.slideshow-picture')[slideNumber - 1];
    
    // Set new active thumbnail as active and deactivate all others
    
    $(activeThumbnail).addClass('active');
    $(activeThumbnail).siblings('.slideshow-thumbnail').removeClass('active');
    
    // Set scroll of thumbnail container so active thumbnail is at top
    
    if(animate){
        
        $(thumbnailContainer).animate({

            scrollTop: (slideNumber - 1) * 155

        }, 300);
        
    }
    
    else{
        
        $(thumbnailContainer).scrollTop((slideNumber - 1) * 155);
        
    }
    
    // Set new active slide as active and deactivate all others
    
    $(activeSlide).addClass('active');
    $(activeSlide).siblings('.slideshow-picture').removeClass('active');
    
}



/**************************************** FORMATS ****************************************/

// Add leading zeros to number

function zeroPad(number, targetLength){
    
    let padded = number.toString();
    
    // Add leading zeros until string length equals target length
    
    while(padded.length < targetLength){
        
        padded = '0' + padded;
        
    }
    
    return padded;
    
}

// Transform formatted number into number with only digits and decimals

function getUnformattedNumber(number){
    
    // Remove anything but digits and decimal points
    
    number = number.toString().replace(/[^0-9.]/g, '');
    
    // Remove any decimal points after the first decimal point
    
    return number.substring(0, number.indexOf('.') + 1) + number.substring(number.indexOf('.') + 1).replace(/\./g, '');
    
}

// Transform unformatted number into number with commas and set number of decimals

function getFormattedNumber(number, decimals){
    
    let textWithCommas = '';
    let dec = '';
    
    // Set decimals based on target number of decimal places
    
    if(decimals > 0){
        
        dec += '.' + zeroPad(Math.round((number * Math.pow(10, decimals))) % Math.pow(10, decimals), decimals);
        number = Math.floor(number);
        
    }
    
    else{
        
        number = Math.round(number);
        
    }
    
    // Take last 3 digits, place a comma before them, and remove them until there's less than 4 digits left
    
    while(number >= 1000){
        
        textWithCommas = ',' + zeroPad(number % 1000, 3) + textWithCommas;
        number = Math.floor(number / 1000);
        
    }
    
    // Return remaining digits + formatted digits + decimals
    
    return number + textWithCommas + dec;
    
}

// Transform number into phone number

function getFormattedPhone(number){
    
    // Remove anything but digits
    
    let unformatted = number.replace(/[^0-9]/g, '').substr(0, 10);
    
    let formatted = '(' + unformatted.substr(0, 2);
    
    if(unformatted.length >= 3){
        
        formatted += unformatted.substr(2, 1) + ') ' + unformatted.substr(3, 2);
        
    }
    
    if(unformatted.length >= 6){
        
        formatted += unformatted.substr(5, 1) + '-' + unformatted.substr(6, 4);
        
    }
    
    return formatted;
    
}

// Validate phone number

function isValidPhone(phone){
    
    return /^\(\d{3}\)\s\d{3}-\d{4}$/.test(phone);
    
}

// Validate URL

function isValidURL(url){
    
    return /^((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)$/.test(url);
    
}

// Validate email address

function isValidEmail(email){
    
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    
}

// Validate password

function isValidPassword(password){
    
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,20}$/.test(password);
    
}

// Validate date

function isValidDate(date){
    
    return /^([1-9]|[0][1-9]|[1][0-2])\/([1-9]|[0][1-9]|[12][0-9]|[3][01])\/\d{4}$/.test(date);
    
}

// Validate time

function isValidTime(time){
    
    return /^([1-9]|[0][1-9]|[1][0-2]):[0-6][0-9]\s?[AaPp][Mm]$/.test(time);
    
}

// Validate date/time

function isValidDateTime(dateTime){
    
    return /^([1-9]|[0][1-9]|[1][0-2])\/([1-9]|[0][1-9]|[12][0-9]|[3][01])\/\d{4}\s?([1-9]|[0][1-9]|[1][0-2]):[0-6][0-9]\s?[AaPp][Mm]$/.test(dateTime);
    
}

// Get date/time equivalent in milliseconds

function getDateTimeValue(dateTime){
    
    // If valid date or date/time, convert to date and return time
    
    if(isValidDate(dateTime) || isValidDateTime(dateTime)){
        
        return new Date(dateTime).getTime();
        
    }
    
    // If valid time, get hours, minutes, and AM/PM and return time
    
    else if(isValidTime(dateTime)){
        
        // Get hour, minute, and AM/PM
        
        let hour = dateTime.substring(0, dateTime.indexOf(':'));
        let minute = dateTime.replace(/([1-9]|[0][1-9]|[1][0-2]):/, '').substr(0, 2);
        let type = dateTime.replace(/([1-9]|[0][1-9]|[1][0-2]):[0-6][0-9]\s?/, '');
        
        // Add hours * 60 min/hour * 60 sec/min * 1000 ms/sec
        
        let time = parseInt(hour, 10) * 60 * 60 * 1000;
        
        // Add minutes * 60 sec/min * 1000 ms/sec
        
        time += parseInt(minute, 10) * 60 * 1000;
        
        // If PM, add 12 hours * 60 min/hour * 60 sec/min * 1000 ms/sec
        
        time += type == 'PM' ? 12 * 60 * 60 * 1000 : 0;
        
        return time;
        
    }
    
    // If not valid date, time, or date/time, return 0
    
    else{
        
        return 0;
        
    }
    
}

// Validate form, return true if valid

function isValidForm(form){
    
    let isValid = true;
    
    // Cycle through fields in form
    
    $(form).find('.field-33, .field-50, .field-100').each(function(){
        
        let input = $(this).find('input, select, textarea');
        let value = $(input).val();
        
        // If field is required and is empty, invalidate
        
        if(($(this).hasClass('required') && value == '')
          || ($(input).hasClass('phone') && !isValidPhone(value))
          || ($(input).hasClass('url') && !isValidURL(value))
          || ($(input).hasClass('email') && !isValidEmail(value))
          || ($(input).hasClass('password') && !isValidPassword(value))
          || ($(input).hasClass('date') && !isValidDate(value))
          || ($(input).hasClass('time') && !isValidTime(value))){
            
            $(input).addClass('invalid');
            isValid = false;
            console.log(this);
        }
        
        // Otherwise, validate
        
        else{
            
            $(input).removeClass('invalid');
            
        }
        
    });
    
    // If invalid, add error message
    
    if(!isValid){
        
        let error = $(form).find('.error');
        
        // If error message does not already exist...
        
        if(error.length == 0){
            
            // Create error message
            
            error = $('<div></div>');
            $(error).addClass('error');
            $(form).prepend(error);
            
        }
        
        $(error).html('Please complete all required fields and check formats.');
        
    }
    
    // Otherwise, remove error message
    
    else{
        
        $(form).find('.error').remove();
        
    }
    
    return isValid;
    
}



/**************************************** INPUTS ****************************************/

// On load...

$(function(){
    
    // For fields with character limit...
    
    $('input[maxlength], textarea[maxlength]').each(function(event){
        
        // Set event handler
        
        $(this).on('keyup', function(){
            
            setCharacterCount(this);
            
        });
        
        // Set initial character count
        
        setCharacterCount(this);
        
    });
    
    // Set event handlers for number fields
    
    $('input[type=text].number').on({
        
        // On focus, unformat number
        
        'focus': function(event){
            
            let value = $(this).val();            
            $(this).val(getUnformattedNumber(value));
            
        },
        
        // On defocus, format number
        
        'blur': function(event){
            
            // Get number of decimal places
            
            let classList = $(this).attr('class');
            let decimals = parseInt(classList.substr(classList.search('dec'), 4).replace('dec', ''));
            
            // Format number
            
            let value = $(this).val();
            $(this).val(getFormattedNumber(value, decimals));
            
        },
        
        // On typing, remove any non-number characters and unnecessary decimal points
        
        'keyup': function(event){
            
            // Get current cursor position
            
            let cursorPosition = this.selectionStart;
            
            // Unformat number
            
            let value = $(this).val();
            $(this).val(getUnformattedNumber(value));
            
            // If if typed character was removed, adjust cursor position
            
            let startLength = value.length;
            let endLength = $(this).val().length;
            
            if(startLength > endLength){
                
                setCursorPosition(this, cursorPosition - 1);
                
            }
            
        }
        
    });
    
    // Set event handlers for currency fields
    
    $('input[type=text].currency').on({
        
        // On focus, unformat number
        
        'focus': function(event){
            
            let value = $(this).val();            
            $(this).val(getUnformattedNumber(value));
            
        },
        
        // On defocus, format number
        
        'blur': function(event){
            
            // Get number of decimal places
            
            let classList = $(this).attr('class');
            let decimals = parseInt(classList.substr(classList.search('dec'), 4).replace('dec', ''));
            
            // Format number
            
            let value = $(this).val();
            $(this).val('$ ' + getFormattedNumber(value, decimals));
            
        },
        
        // On typing, remove any non-number characters and unnecessary decimal points
        
        'keyup': function(event){
            
            // Get current cursor position
            
            let cursorPosition = this.selectionStart;
            
            // Unformat number
            
            let value = $(this).val();
            $(this).val(getUnformattedNumber(value));
            
            // If if typed character was removed, adjust cursor position
            
            let startLength = value.length;
            let endLength = $(this).val().length;
            
            if(startLength > endLength){
                
                setCursorPosition(this, cursorPosition - 1);
                
            }
            
        }
        
    });
    
    // Set event handlers for percentage fields
    
    $('input[type=text].percent').on({
        
        // On focus, unformat number
        
        'focus': function(event){
            
            let value = $(this).val();            
            $(this).val(getUnformattedNumber(value));
            
        },
        
        // On defocus, format number
        
        'blur': function(event){
            
            // Get number of decimal places
            
            let classList = $(this).attr('class');
            let decimals = parseInt(classList.substr(classList.search('dec'), 4).replace('dec', ''));
            
            // Format number
            
            let value = $(this).val();
            $(this).val(getFormattedNumber(value, decimals) + ' %');
            
        },
        
        // On typing, remove any non-number characters and unnecessary decimal points
        
        'keyup': function(event){
            
            // Get current cursor position
            
            let cursorPosition = this.selectionStart;
            
            // Unformat number
            
            let value = $(this).val();
            $(this).val(getUnformattedNumber(value));
            
            // If if typed character was removed, adjust cursor position
            
            let startLength = value.length;
            let endLength = $(this).val().length;
            
            if(startLength > endLength){
                
                setCursorPosition(this, cursorPosition - 1);
                
            }
            
        }
        
    });
    
    // Set event handlers for phone fields
    
    $('input[type=text].phone').on({
        
        // On focus or cursor move...
        
        'focus click': function(event){
            
            // Remove validation
            
            $(this).removeClass('invalid');
            
            // If blank, place open parenthesis to start phone number
            
            if($(this).val().length == 0){
                
                $(this).val('(');
                
            }
            
            // Control cursor position
            
            setPhoneCursor(this, event);
            
        },
        
        // On typing, format number
        
        'keyup': function(event){
            
            let cursorStart = this.selectionStart;
            
            // Format phone number
            
            let value = $(this).val();
            $(this).val(getFormattedPhone(value));
            
            // If last character was not number, adjust cursor position (account for backspace and delete)
            
            if(value.length > $(this).val().length && (event.which < 48 || event.which > 57) && (event.which < 96 || event.which > 105) && event.which != 8 && event.which != 46){
                
                setCursorPosition(this, cursorStart - 1);
                
            }
            
            // Otherwise
            
            else{
                
                setCursorPosition(this, cursorStart);
                
            }
            
            // Adjust cursor position based on phone format
            
            setPhoneCursor(this, event);
            
        },
        
        // On backspace, control cursor position before deleting
        
        'keydown': function(event){
            
            let cursorPosition = this.selectionStart;
            let charBefore = $(this).val().substr(cursorPosition - 1, 1);
            
            if(event.which == 8){
                
                if(charBefore == '(' || charBefore == ')' || charBefore == '-'){
                    
                    setCursorPosition(this, cursorPosition - 1);
                    
                }
                
                else if(charBefore == ' '){
                    
                    setCursorPosition(this, cursorPosition - 2);
                    
                }
                
            }
            
        },
        
        // On defocus, validate completion
        
        'blur': function(event){
            
            // If field only contains autofilled start, clear
            
            if($(this).val() == '('){
                
                $(this).val('');
                
            }
            
            // Validate format if not empty
            
            if(!isValidPhone($(this).val()) && $(this).val().length > 0){
                
                $(this).addClass('invalid');
                
            }
            
        }
        
    });
    
    // Set event handlers for URL fields
    
    $('input[type=text].url').on({
        
        // On focus, remove validation
        
        'focus': function(event){
            
            $(this).removeClass('invalid');
            
            // If empty, place start of URL
            
            if($(this).val().length == 0){
                
                $(this).val('https://');
                setCursorPosition(this, 8);
                
            }
            
        },
        
        // On defocus, validate
        
        'blur': function(event){
            
            // If field only contains autofilled start, clear
            
            if($(this).val() == 'https://'){
                
                $(this).val('');
                
            }
            
            // Validate format if not empty
            
            if(!isValidURL($(this).val()) && $(this).val().length > 0){
                
                $(this).addClass('invalid');
                
            }
            
        }
        
    });
    
    // Set event handlers for email fields
    
    $('input[type=text].email').on({
        
        // On focus, remove validation
        
        'focus': function(event){
            
            $(this).removeClass('invalid');
            
        },
        
        // On defocus, validate
        
        'blur': function(event){
            
            // Validate format if not empty
            
            if(!isValidEmail($(this).val()) && $(this).val().length > 0){
                
                $(this).addClass('invalid');
                
            }
            
        }
        
    });
    
    // Set event handlers for password fields
    
    $('input[type=password].password').on({
        
        // On defocus or typing, validate
        
        'keyup': function(event){
            
            // Validate format if not empty
            
            if(!isValidPassword($(this).val()) && $(this).val().length > 0){
                
                $(this).addClass('invalid');
                
            }
            
            else{
                
                $(this).removeClass('invalid');
                
            }
            
        }
        
    });
    
    // Set event handlers for date fields
    
    $('input[type=text].date').each(function(){
        
        setDateHandlers(this);
        
    });
    
    // Set event handlers for time fields
    
    $('input[type=text].time').each(function(){
        
        setTimeHandlers(this);
        
    });
    
    // Set event handlers for file fields
    
    $('input[type=file].file').on({
        
        // On change, extract file name and display in span
        
        'change': function(event){
            
            let fileName = $(this).val().split(/(\\|\/)/g).pop() == '' ? 'No file chosen' : $(this).val().split(/(\\|\/)/g).pop();
            $(this).siblings('.file-upload-name').html(fileName);
            
        }
        
    });
    
    // Set event handlers for field icons
    
    $('.field-icon').on('click', function(event){
        
        // Focus on input that follows
        
        $(this).siblings('input, select').focus();
        
    });
    
});

// Set cursor position for field

function setCursorPosition(field, position){
    
    // If not focused, set focus on field
    
    if(!$(field).is(':focus')){
        
        $(field).focus();
        
    }
    
    // Set cursor position for field
    
    field.selectionStart = position;
    field.selectionEnd = position;
}

// Update character count

function setCharacterCount(field){
    
    // Get character count element
    
    let counter = $(field).nextAll('.character-count');
    
    // If character count element doesn't exist, create it
    
    if(counter.length == 0){
        
        // Create character count element
        
        counter = $('<div></div>');
        $(counter).addClass('character-count');
        
        // Add character count element after field
        
        $(field).after(counter);
        
    }
    
    // Get number of characters and character limit for field
    
    let count = getFormattedNumber($(field).val().length, 0);
    let max = getFormattedNumber($(field).attr('maxLength'), 0);
    
    // Set text of character count element
    
    $(counter[0]).text(count + ' of ' + max + ' characters used');
    
}

// Control cursor position for phone field

function setPhoneCursor(field, event){
    
    let cursorPosition = field.selectionStart;
    let charAfter = $(field).val().substr(cursorPosition, 1);
    
    // If cursor is directly before a non-number...
    
    if(charAfter.match(/[^0-9]/)){
        
        // If key pressed is left arrow, move cursor directly in front of number directly before non-number
        
        if(event.which == 37 && cursorPosition > 1){
            
            let cursorAdjust = charAfter == ' ' ? 2 : 1;
            setCursorPosition(field, cursorPosition - cursorAdjust);
            
        }
        
        // Otherwise, move cursor directly in front of number directly after non-number
        
        else{
            
            let cursorAdjust = charAfter == ')' ? 2 : 1;
            setCursorPosition(field, cursorPosition + cursorAdjust);
            
        }
        
    }
    
}



/**************************************** DATE PICKERS ****************************************/

// Set event handlers for date fields

function setDateHandlers(field){
    
    $(field).on({
        
        // On focus...
        
        'focus': function(event){
            
            // Remove validation
            
            $(this).removeClass('invalid');
            
            // Show date picker if not shown already
            
            if(!$(this).siblings('.date-picker').is(':visible')){
                
                showDatePicker(this);
                
            }
            
        },
        
        // On defocus, validate
        
        'blur': function(event){
            
            // If valid date, format
            
            if(isValidDate($(this).val())){
                
                let date = new Date($(this).val());
                $(this).val(zeroPad(date.getMonth() + 1, 2) + '/' + zeroPad(date.getDate(), 2) + '/' + date.getFullYear());
                
            }
            
            // Otherwise, make invalid
            
            else if($(this).val().length > 0){
                
                $(this).addClass('invalid');
                
            }
            
        },
        
        // On tab, hide date picker
        
        'keydown': function(event){
            
            if(event.which == 9){
                
                $(this).siblings('.date-picker').hide();
                
            }
            
        },
        
        // On typing...
        
        'keyup': function(event){
            
            // Get current cursor position
            
            let cursorPosition = this.selectionStart;
            
            // Remove non-date characters
            
            let value = $(this).val();
            $(this).val(value.replace(/[^0-9\/]/g, ''));
            
            // If if typed character was removed, adjust cursor position
            
            let startLength = value.length;
            let endLength = $(this).val().length;
            
            if(startLength > endLength){
                
                setCursorPosition(this, cursorPosition - 1);
                
            }
            
            // If valid date, adjust date picker
            
            if(isValidDate($(this).val())){
                
                showDatePicker(this);
                
            }
            
        }
        
    });
    
}

// Get day of week name from number (1-7)

function getDayOfWeek(day){
    
    let daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    return daysOfWeek[day - 1];
    
}

// Get month name from number (1-12)

function getMonthName(month){
    
    let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    return monthNames[month - 1];
    
}

// Get month number (1-12) from name

function getMonthNumber(month){
    
    switch(month){
        
        case 'January':
            
            return 1;
            
        case 'February':
            
            return 2;
            
        case 'March':
            
            return 3;
            
        case 'April':
            
            return 4;
            
        case 'May':
            
            return 5;
            
        case 'June':
            
            return 6;
            
        case 'July':
            
            return 7;
            
        case 'August':
            
            return 8;
            
        case 'September':
            
            return 9;
            
        case 'October':
            
            return 10;
            
        case 'November':
            
            return 11;
            
        case 'December':
            
            return 12;
        
    }
    
}

// Set event handlers for header

function setDatePickerHeaderHandlers(datePicker){
    
    // Handle selecting month or year
    
    $(datePicker).find('select.month, select.year').on('change', function(event){
        
        // Set date picker to new month/year
        
        let month = getMonthNumber($(datePicker).find('select.month').val());
        let year = parseInt($(datePicker).find('select.year').val());
        let selectedDate = new Date($(datePicker).siblings('input[type=text].date').val());
        setDatePicker(datePicker, month, year, selectedDate);
        
    });
    
    // Handle clicking on previous year button
    
    $(datePicker).find('button.prev-year').on('click', function(event){
        
        // Set date picker to previous year
        
        let month = getMonthNumber($(datePicker).find('select.month').val());
        let year = parseInt($(datePicker).find('select.year').val()) - 1;
        let selectedDate = new Date($(datePicker).siblings('input[type=text].date').val());
        setDatePicker(datePicker, month, year, selectedDate);
        
    });
    
    // Handle clicking on previous month button
    
    $(datePicker).find('button.prev-month').on('click', function(event){
        
        // Set date picker to previous month
        
        let month = getMonthNumber($(datePicker).find('select.month').val()) - 1;
        let year = parseInt($(datePicker).find('select.year').val());
        
        if(month < 1){
            
            month = 12;
            year--;
            
        }
        
        let selectedDate = new Date($(datePicker).siblings('input[type=text].date').val());
        setDatePicker(datePicker, month, year, selectedDate);
        
    });
    
    // Handle clicking on today button
    
    $(datePicker).find('button.today').on('click', function(event){
        
        // Set input value to today
        
        let today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        let month = today.getMonth() + 1;
        let day = today.getDate();
        let year = today.getFullYear();
        let input = $(datePicker).siblings('input[type=text].date');
        $(input).val(zeroPad(month, 2) + '/' + zeroPad(day, 2) + '/' + year);
        $(input).focus();
        
        // Set date picker to today's month/year
        
        setDatePicker(datePicker, month, year, today);
        
    });
    
    // Handle clicking on next month button
    
    $(datePicker).find('button.next-month').on('click', function(event){
        
        // Set date picker to next month
        
        let month = getMonthNumber($(datePicker).find('select.month').val()) + 1;
        let year = parseInt($(datePicker).find('select.year').val());
        
        if(month > 12){
            
            month = 1;
            year++;
            
        }
        
        let selectedDate = new Date($(datePicker).siblings('input[type=text].date').val());
        setDatePicker(datePicker, month, year, selectedDate);
        
    });
    
    // Handle clicking on next year button
    
    $(datePicker).find('button.next-year').on('click', function(event){
        
        // Set date picker to next year
        
        let month = getMonthNumber($(datePicker).find('select.month').val());
        let year = parseInt($(datePicker).find('select.year').val()) + 1;
        let selectedDate = new Date($(datePicker).siblings('input[type=text].date').val());
        setDatePicker(datePicker, month, year, selectedDate);
        
    });
    
    // Handle clicking outside of date picker/field
    
    $(document).on('mousedown', function(event){
        
        if($(datePicker).parent().has(event.target).length == 0){
            
            $(datePicker).hide();
            
        }
        
    });
    
}

// Set event handlers for date buttons

function setDatePickerDateHandlers(datePicker){
    
    // Handle clicking on date
    
    $(datePicker).find('tr.dates button').on('click', function(event){
        
        // Set input value to selected date
        
        let input = $(datePicker).siblings('input[type=text].date');
        $(input).val($(this).val());
        $(input).focus();
        
        // Set selected date as selected
        
        $(datePicker).find('tr.dates button.selected').removeClass('selected');
        $(this).addClass('selected');
        
    });
    
}

// Show date picker or create it if it doesn't exist

function showDatePicker(field){
    
    // Get date picker
    
    let datePicker = $(field).siblings('.date-picker');
    
    // If date picker doesn't exist, create it
    
    if(datePicker.length == 0){
        
        // Create date picker
        
        datePicker = $('<table></table>');
        $(datePicker).addClass('date-picker');
        
        // HTML for date picker
        
        let html = '';
        
        // Add header
        
        html += '<tr class="date-picker-header">';
        html += '<td colspan="7">';
        html += '<span>';
        html += '<select class="month-width"></select><select class="year-width"></select>';
        html += '<select class="month">';
        
        // Add months to picklist
        
        for(let i = 1; i <=12; i++){
            
            html += '<option>' + getMonthName(i) + '</option>';
            
        }
        
        html += '</select><select class="year">';
        
        // Add years to picklist
        
        for(let i = 1900; i <= new Date().getFullYear() + 5; i++){
            
            html += '<option>' + i + '</option>';
            
        }
        
        html += '</select></span>';
        
        // Add previous/next buttons
        
        html += '<button type="button" class="prev-year"></button>';
        html += '<button type="button" class="prev-month"></button>';
        html += '<button type="button" class="today"></button>';
        html += '<button type="button" class="next-month"></button>';
        html += '<button type="button" class="next-year"></button>';
        html += '</td></tr>'
        
        // Add days of week
        
        html += '<tr class="days-of-week"><td>S</td><td>M</td><td>T</td><td>W</td><td>T</td><td>F</td><td>S</td></tr>';
        
        // Add HTML for date picker
        
        datePicker.html(html);
        
        // Add date picker after field
        
        $(field).after(datePicker);
        
        // Set event handlers for header
        
        setDatePickerHeaderHandlers(datePicker);
        
    }
    
    // Show date picker
    
    $(datePicker).show();
    
    // If valid date, set date picker to month/year of date
    
    if(isValidDate($(field).val())){
        
        let selectedDate = new Date($(field).val());
        setDatePicker(datePicker, selectedDate.getMonth() + 1, selectedDate.getFullYear(), selectedDate);
        
    }
    
    // Otherwise, set date picker to month/year of today
    
    else{
        
        let today = new Date();
        setDatePicker(datePicker, today.getMonth() + 1, today.getFullYear(), new Date($(field).val()));
        
    }
    
}

// Set date picker to month/year (month is number 1-12)

function setDatePicker(datePicker, month, year, selectedDate){
    
    // Set month and year on header
    
    $(datePicker).find('select.month-width').html('<option selected>' + getMonthName(month) + '</option>');
    $(datePicker).find('select.year-width').html('<option selected>' + year + '</option>');
    $(datePicker).find('select.month').val(getMonthName(month));
    $(datePicker).find('select.year').val(year);
    
    // Set width of month and year on header
    
    $(datePicker).find('select.month').width($(datePicker).find('select.month-width').width());
    $(datePicker).find('select.year').width($(datePicker).find('select.year-width').width());
    
    // Set date rows for given month and year
    
    $(datePicker).children('tr.dates').remove();
    $(datePicker).append(getDateRows(datePicker, month, year, selectedDate));
    
    // Set event handlers
    
    setDatePickerDateHandlers(datePicker);
    
}

// Get date rows for date picker (month is number 1-12)

function getDateRows(datePicker, month, year, selectedDate){
    
    // Get first date of month
    
    let first = new Date(year, month - 1, 1);
    
    // Set start date to Sunday before first date of month
    
    let start = first.getDay() == 0 ? new Date(first.getFullYear(), first.getMonth(), first.getDate() - 7) : new Date(first.getFullYear(), first.getMonth(), first.getDate() - first.getDay());
    
    // Set today with only day, month, and year
    
    let today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    
    // HTML for date rows
    
    let dateRows = '';
    
    // Cycle through 6 weeks of dates
    
    for(let i = 0; i < 42; i++){
        
        // Date to add
        
        let day = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
        let dayMonth = day.getMonth() + 1;
        let dayDate = day.getDate();
        let dayYear = day.getFullYear();
        
        // Classes to add for date
        
        let classes = '';
        
        // If first day of week, start row
        
        if(i % 7 == 0){
            
            dateRows += '<tr class="dates">';
            
        }
        
        // If date is today, add class
        
        if(day.getTime() == today.getTime()){
            
            classes += 'today';
            
        }
        
        // If date is selected date, add class
        
        if(day.getTime() == selectedDate.getTime()){
            
            classes += classes == '' ? 'selected' : ' selected';
            
        }
        
        // If date is in previous month, add class
        
        if(dayMonth == month - 1 || (month == 1 && dayMonth == 12)){
            
            classes += classes == '' ? 'prev-month' : ' prev-month';
            
        }
        
        // If date is in next month, add class
        
        if(dayMonth == month + 1 || (month == 12 && dayMonth == 1)){
            
            classes += classes == '' ? 'next-month' : ' next-month';
            
        }
        
        // Compose date with classes, set value to date in mm/dd/yyyy format
        
        dateRows += '<td><button type="button" value="' + zeroPad(dayMonth, 2) + '/' + zeroPad(dayDate, 2) + '/' + dayYear + '"';
        dateRows += classes == '' ? '' : ' class="' + classes + '"';
        dateRows += '>' + zeroPad(dayDate, 2) + '</button></td>';
        
        // If last day of week, end row
        
        if(i % 7 == 6){
            
            dateRows += '</tr>';
            
        }
        
    }
    
    return dateRows;
    
}



/**************************************** TIME PICKERS ****************************************/

// Set event handlers for time fields

function setTimeHandlers(field){
    
    $(field).on({
    
        // On focus...
        
        'focus': function(event){
            
            // Remove validation
            
            $(this).removeClass('invalid');
            
            // If empty, set to 12:00AM
            
            if($(this).val().length == 0){
                
                $(this).val('12:00 AM');
                
            }
            
            // Show time picker if not shown already
            
            if(!$(this).siblings('.time-picker').is(':visible')){
                
                showTimePicker(this);
                
            }
            
        },
        
        // On defocus, validate
        
        'blur': function(event){
            
            // If valid time, format
            
            if(isValidTime($(this).val())){
                
                let value = $(this).val();
                let hour = value.substring(0, value.indexOf(':'));
                let minute = value.replace(/([1-9]|[0][1-9]|[1][0-2]):/, '').substr(0, 2);
                let type = value.replace(/([1-9]|[0][1-9]|[1][0-2]):[0-6][0-9]\s?/, '');
                $(this).val(zeroPad(hour, 2) + ':' + minute + ' ' + type.toUpperCase());
                
            }
            
            // Otherwise, make invalid
            
            else if($(this).val().length > 0){
                
                $(this).addClass('invalid');
                
            }
            
        },
        
        // On tab, hide time picker
        
        'keydown': function(event){
            
            if(event.which == 9){
                
                $(this).siblings('.time-picker').hide();
                
            }
            
        },
        
        // On typing...
        
        'keyup': function(event){
            
            // Get current cursor position
            
            let cursorPosition = this.selectionStart;
            
            // Remove non-time characters
            
            let value = $(this).val();
            $(this).val(value.replace(/[^0-9:\sAaPpMm]/g, ''));
            
            // If if typed character was removed, adjust cursor position
            
            let startLength = value.length;
            let endLength = $(this).val().length;
            
            if(startLength > endLength){
                
                setCursorPosition(this, cursorPosition - 1);
                
            }
            
            // If valid time, adjust time picker
            
            if(isValidTime($(this).val())){
                
                showTimePicker(this);
                
            }
            
        }
        
    });
    
}

// Set event handlers for time pickers

function setTimePickerHandlers(timePicker){
    
    // Handle selecting hour, minute, or type
    
    $(timePicker).find('select.hour, select.minute, select.ampm').on('change', function(event){
        
        // Set input value to selected time
        
        let hour = $(timePicker).find('select.hour').val();
        let minute = $(timePicker).find('select.minute').val();
        let type = $(timePicker).find('select.ampm').val();
        let input = $(timePicker).siblings('input[type=text].time');
        $(input).val(hour + ':' + minute + ' ' + type);
        $(input).focus();
        
    });
    
    // Handle clicking outside of time picker/field
    
    $(document).on('mousedown', function(event){
        
        if($(timePicker).parent().has(event.target).length == 0){
            
            $(timePicker).hide();
            
        }
        
    });
    
}

// Show time picker or create it if it doesn't exist

function showTimePicker(field){
    
    // Get time picker
    
    let timePicker = $(field).siblings('.time-picker');
    
    // If time picker doesn't exist, create it
    
    if(timePicker.length == 0){
        
        // Create time picker
        
        timePicker = $('<div></div>');
        $(timePicker).addClass('time-picker');
        
        // HTML for time picker
        
        let html = '';
        html += '<span>';
        html += '<select class="hour">';
        
        // Add hours to picklist
        
        html += '<option>12</option>'
        
        for(let i = 1; i <=11; i++){
            
            html += '<option>' + zeroPad(i, 2) + '</option>';
            
        }
        
        html += '</select><select class="minute">';
        
        // Add minutes to picklist
        
        for(let i = 0; i <= 59; i++){
            
            html += '<option>' + zeroPad(i, 2) + '</option>';
            
        }
        
        html += '</select>';
        
        // Add AM/PM
        
        html += '<select class="ampm">';
        html += '<option>AM</option>';
        html += '<option>PM</option>';
        html += '</select></span></div>';
        
        // Add HTML for time picker
        
        timePicker.html(html);
        
        // Add date picker after field
        
        $(field).after(timePicker);
        
        // Set event handlers
        
        setTimePickerHandlers(timePicker);
        
    }
    
    // Show time picker
    
    $(timePicker).show();
    
    // If valid time, set time picker to hour/minute/type of time
    
    if(isValidTime($(field).val())){
        
        let value = $(field).val();
        let hour = value.substring(0, value.indexOf(':'));
        let minute = value.replace(/([1-9]|[0][1-9]|[1][0-2]):/, '').substr(0, 2);
        let type = value.replace(/([1-9]|[0][1-9]|[1][0-2]):[0-6][0-9]\s?/, '');
        setTimePicker(timePicker, hour, minute, type);
        
    }
    
    // Otherwise, set time picker to 12:00AM
    
    else{
        
        setTimePicker(timePicker, 12, 0, 'AM');
        
    }
    
}

// Set time picker to hour/minute/type

function setTimePicker(timePicker, hour, minute, type){
    
    // Set hour
    
    $(timePicker).find('select.hour').val(zeroPad(hour, 2));
    
    // Set minute
    
    $(timePicker).find('select.minute').val(zeroPad(minute, 2));
    
    // Set AM/PM
    
    $(timePicker).find('select.ampm').val(type);
    
}



/**************************************** AUTOCOMPLETE ****************************************/

// Set event handlers

$(function(){
    
    // Set event handlers for autocomplete fields
    
    $('.autocomplete-field input').on({
        
        // On focus, show autocomplete list
        
        'focus': function(event){
            
            if(!$(this).siblings('.autocomplete-list').is(':visible')){
                
                showAutocompleteList(this);
                
            }
            
        },
        
        // On tab, hide autocomplete list
        
        'keydown': function(event){
            
            if(event.which == 9){
                
                $(this).siblings('.autocomplete-list').hide();
                
            }
            
        },
        
        // On typing...
        
        'keyup': function(event){
            
            // If key pressed is up arrow, move selected autocomplete list option up
            
            if(event.which == 38){
                
                // Get autocomplete list and selected option
                
                let list = $(this).siblings('.autocomplete-list');
                let selected = $(list).find('button.selected');
                
                // If not already on top option, deselect current selected option and select previous option
                
                if($(selected).prev('button').length > 0){
                    
                    $(selected).removeClass('selected');
                    $(selected).prev('button').addClass('selected');
                    
                }
                
                setCursorPosition(this, $(this).val().length);
                
            }
            
            // If key pressed is down arrow, move selected autocomplete list option down
            
            else if(event.which == 40){
                
                // Get autocomplete list and selected option
                
                let list = $(this).siblings('.autocomplete-list');
                let selected = $(list).find('button.selected');
                
                // If no current selected option, select first option
                
                if(selected.length == 0){
                    
                    $(list).find('button:first-of-type').addClass('selected');
                    
                }
                
                // If not already on bottom option, deselect current selected option and select next option
                
                else if($(selected).next('button').length > 0){
                    
                    $(selected).removeClass('selected');
                    $(selected).next('button').addClass('selected');
                    
                }
                
            }
            
            // If key pressed is enter...
            
            else if(event.which == 13){
                
                // Get autocomplete list and selected option
                
                let list = $(this).siblings('.autocomplete-list');
                let selected = $(list).find('button.selected');
                
                // If field is also a search bar, don't handle here
                // Otherwise, if list has selected option, set field value to value of selected option and hide autocomplete list
                
                if(!$(this).parent().hasClass('search-bar') && selected.length > 0){
                    
                    selectAutocompleteOption(selected);
                    
                }
                
            }
            
            // Otherwise, update autocomplete list
            
            else{
                
                showAutocompleteList(this);
                
            }
            
        }
        
    });
    
});

// Set source for autocomplete list

(function ($){
    
    $.fn.setAutocompleteSource = function(objectArray){
        
        $(this).data('autocompleteSource', objectArray);
        
    }
    
}(jQuery));

// Set event handlers for autocomplete list

function setAutocompleteListHandlers(list){
    
    // Handle clicking on an autocomplete list option
    
    $(list).find('button').on('click', function(event){
        
        selectAutocompleteOption(this);
        
    });
    
    // Handle clicking outside of time picker/field
    
    $(document).on('mousedown', function(event){
        
        if($(list).parent().has(event.target).length == 0){
            
            $(list).hide();
            
        }
        
    });
    
}

// Generate autocomplete list

function showAutocompleteList(field){
    
    // Clear existing autocomplete list
    
    $(field).siblings('.autocomplete-list').remove();
    
    // Get lower-cased field value and autocomplete source for field
    
    let value = $(field).val().toLowerCase();
    
    // If value isn't blank, show autocomplete list
    
    if(value.length > 0){
        
        let objectArray = $(field).parent().data('autocompleteSource');
        
        // Create autocomplete list
        
        let list = $('<div></div>');
        $(list).addClass('autocomplete-list');
        
        // HTML for autocomplete list
        
        let html = '';
        
        // If not restricted, add typed value as first option
        
        if(!$(field).parent().hasClass('restricted-autocomplete')){
            
            html += '<button type="button" value="' + value + '">';
            html += '<b>' + value + '</b>';
            html += '<input type="hidden" name="option-id" value="">';
            html += '<input type="hidden" name="option-type" value=""></button>';
            
        }
        
        // Show item from source if it contains field value (only show 5 at most)
        
        let options = 0;
        
        for(let i = 0; i < objectArray.length && options < 5; i++){
            
            let text = objectArray[i].text;
            let subtext = objectArray[i].subtext;
            let id = objectArray[i].id;
            let type = objectArray[i].type;
            
            if(text.toLowerCase().includes(value)){
                
                // Get starting and ending indexes of matching text
                
                let matchStart = text.toLowerCase().indexOf(value);
                let matchEnd = matchStart + value.length;
                
                // Bold matching text on option
                
                html += '<button type="button" value="' + text + '">';
                html += text.substring(0, matchStart);
                html += '<b>' + text.substring(matchStart, matchEnd) + '</b>';
                html += text.substring(matchEnd, text.length);
                html += '<span class="autocomplete-subtext">' + subtext + '</span>';
                html += '<input type="hidden" name="option-id" value="' + id + '">';
                html += '<input type="hidden" name="option-type" value="' + type + '"></button>';
                
                options++;
                
            }
            
        }
        
        // Add HTML for autocomplete list
        
        $(list).html(html);
        
        // Add autocomplete list after field
        
        $(field).after(list);
        
        // Highlight first option
        
        $(list).find('button').first().addClass('selected');
        
        // Set event handlers
        
        setAutocompleteListHandlers(list);
        
    }
    
}

// Select autocomplete option

function selectAutocompleteOption(option){
    
    // Get autocomplete list and field
    
    let list = $(option).parent();
    let field = $(list).siblings('input');
    
    // Set field value to value of option and focus on field
    
    $(field).val($(option).val());
    $(field).focus();
    
    // Hide autocomplete list
    
    $(list).hide();
    
    // If field is also token field, create token
    
    if($(field).parent().hasClass('token-field')){
        
        createFieldToken(field, $(option).find('input[name="option-id"]').val(), $(option).find('input[name="option-type"]').val());
        
    }
    
}



/**************************************** TOKENS ****************************************/

// Set event handlers

$(function(){
    
    // Set event handlers for token field
    
    $('.token-field input').on('keyup', function(event){
        
        // If field is also an autocomplete field, don't handle here
        // Otherwise, on pressing enter, create token
        
        if(event.which == 13 && !$(this).parent().hasClass('autocomplete-field')){
            
            createFieldToken(this);
            
        }
        
    });
    
});

// Set event handlers for token

function setTokenHandlers(token){
    
    // Handle clicking on exit button
    
    $(token).find('button.exit').on('click', function(event){
        
        // Renumber other token names
        
        let tokenNo = $(token).prevAll('.token').length;
        
        $(token).nextAll('.token').each(function(){
            
            tokenNo ++;
            $(this).find('input[name$="-id"]').attr('name', 'token' + tokenNo + '-id');
            $(this).find('input[name$="-type"]').attr('name', 'token' + tokenNo + '-type');
            
        });
        
        // Remove token
        
        $(token).remove();
        
    });
    
}

// Create token based only on field value

function createFieldToken(field){
    
    createFieldToken(field, '', '');
    
}

// Create token based on field value and id

function createFieldToken(field, id, type){
    
    // Get field value and token container
    
    let value = $(field).val();
    let container = $(field).siblings('.token-container');
    let tokenNo = $(container).find('.token').length + 1;
    
    // If token container doesn't exist, create it
    
    if(container.length == 0){
        
        // Create token container
        
        container = $('<div></div>');
        $(container).addClass('token-container');
        
        // Add token container after field
        
        $(field).after(container);
        
    }
    
    if(id == '' || $(container).find('input[value="' + id + '"]').length == 0){
        
        // Create token
        
        let token = $('<span></span>');
        $(token).addClass('token');
        
        // Add HTML
        
        let html = value + '<button type="button" class="exit"></button>';
        html += '<input type="hidden" name="token' + tokenNo + '-id" value="' + id + '">';
        html += '<input type="hidden" name="token' + tokenNo + '-type" value="' + type + '">';
        $(token).html(html);
        
        // Add token to end of token container
        
        $(container).append(token);
        
        // Set event handlers
        
        setTokenHandlers(token);
        
    }
    
    // Clear field value and focus on field
    
    $(field).val('');
    $(field).focus();
    $(field).siblings('.autocomplete-list').hide();
    
}



/**************************************** TABLES ****************************************/

// On load...

$(function(){
    
    // Paginate all paginated tables
    
    $('table.paginated').each(function(){
        
        paginateTable(this);
        
    });
    
    // Handle clicking sortable column header
    
    $('th.sortable').on('click', function(event){
        
        sortTable($(this).parent().parent().parent(), $(this).prevAll('th').length + 1);
        
    });
    
    // Handle typing into filter
    
    $('.table-filter input').on('keyup', function(event){
        
        filterTable($(this).parent().next('.table-container').find('table.paginated'), $(this).val());
        
    });
    
    // Handle changing table show selection
    
    $('.table-show select').on('change', function(event){
        
        paginateTable($(this).parent().siblings('.table-container').find('table.paginated'));
        
    });
    
});

// Set event handlers for table pagination 

function setTablePaginationHandlers(pagination){
    
    // Get table
    
    let table = $(pagination).siblings('.table-container').find('table.paginated');
    
    // Set event handlers for page number buttons
    
    $(pagination).find('button:not(.first, .prev, .next, .last)').each(function(){
        
        $(this).on('click', function(event){
            
            let pageNumber = parseInt($(this).html());
            setTablePagination(table, pageNumber);
            
        });
        
    });
    
    // Set event handlers for first, prev, next, and last buttons
    
    $(pagination).find('button.first').on('click', function(event){
        
        setTablePagination(table, 1);
        
    });
    
    $(pagination).find('button.prev').on('click', function(event){
        
        prevTablePage(table);
        
    });
    
    $(pagination).find('button.next').on('click', function(event){
        
        nextTablePage(table);
        
    });
    
    $(pagination).find('button.last').on('click', function(event){
        
        // Get list of table rows (includes header row, not filtered rows) and number of rows to show
        
        let tableRows = $(table).find('tr:not(.filtered)');
        let showNumber = parseInt($(table).siblings('.table-show').find('select').val());
        
        // Get number of pages needed
        
        let pages = Math.ceil((tableRows.length - 1) / showNumber);
        
        setTablePagination(table, pages);
        
    });
    
}

// Sort table

function sortTable(table, columnNo){
    
    // Get list of table rows (includes header row), header of column that was sorted, direction to sort, and type of column
    
    let tableRows = $(table).find('tr');
    let sortedHeader = $(table).find('th')[columnNo - 1];
    let direction = $(sortedHeader).hasClass('asc') ? 'desc' : 'asc';
    let type = $(sortedHeader).hasClass('number') ? 'number' : ($(sortedHeader).hasClass('date-time') ? 'date-time' : 'text');
    
    // Indicate direction of sort on sorted column header and remove sort indicate for other columns
    
    $(sortedHeader).removeClass('asc desc');
    $(sortedHeader).siblings('th.asc, th.desc').removeClass('asc desc');
    $(sortedHeader).addClass(direction);
    
    // Cycle through rows and compare against rows above (skip 1st data row because no data rows above)
    
    for(let i = 2; i < tableRows.length; i++){
        
        // Get value for target row
        
        let data1 = $(tableRows[i]).find('td')[columnNo - 1];
        let value1 = $(data1).find('a').length > 0 ? $(data1).find('a').html() : $(data1).html();
        
        // Get updated/reordered list of rows above (row directly before listed first, first row overall listed last)
        
        let rowsBefore = $(tableRows[i]).prevAll('tr');
        
        // Variable to capture first row above that is greater (if ascending) or lesser (if descending)
        
        let j = 0;
        
        // Cycle through rows above to compare and find place for target row
        
        while(j < i - 1){
            
            // Get value for this row
            
            let data2 = $(rowsBefore[j]).find('td')[columnNo - 1];
            let value2 = $(data2).find('a').length > 0 ? $(data2).find('a').html() : $(data2).html();
            
            // If sorting ascending and target row > this row, stop to place target row after this row
            // If sorting descending and target row < this row, stop to place target row after this row
            
            if((direction == 'asc' && compare(value1, value2, type)) || (direction == 'desc' && !compare(value1, value2, type))){
                
                break;
                
            }
            
            // Otherwise, continue onto next row up
            
            j++;
            
        }
        
        // If target row is not already directly below jth row, place target row after jth row
        
        if(j > 0){
            
            $(rowsBefore[j]).after(tableRows[i]);
            
        }
        
    }
    
    // If table is paginated, paginate table
    
    if($(table).hasClass('paginated')){
        
        paginateTable(table);
        
    }
    
}

// Compare values - return true if element1 > element2

function compare(value1, value2, type){
    
    if(type == 'number'){
        
        return parseInt(value1, 10) > parseInt(value2, 10);
        
    }
    
    else if(type == 'date-time'){
        
        return getDateTimeValue(value1) > getDateTimeValue(value2);
        
    }
    
    else{
        
        return value1.toLowerCase() > value2.toLowerCase();
        
    }
    
}

// Filter table

function filterTable(table, filter){
    
    // Get list of table rows (includes header row)
    
    let tableRows = $(table).find('tr');
    
    // Cycle through rows to check for filter match
    
    for(let i = 1; i < tableRows.length; i++){
        
        // Reset filter for row
        
        $(tableRows[i]).removeClass('filtered');
        
        // Only filter if filter value is not blank
        
        if(filter.length > 0){
            
            // Boolean for tracking match (set to true if match is found in any column)
            
            let match = false;
            
            // Cycle through each column for row to check for filter match
            
            $(tableRows[i]).find('td').each(function(){
                
                let value = $(this).find('a').length > 0 ? $(this).find('a').html() : $(this).html();
                match = value.toLowerCase().includes(filter.toLowerCase()) ? true : match;
                
            });
            
            // If no match in any column, filter out
            
            if(!match){
                
                $(tableRows[i]).addClass('filtered');
                
            }
            
        }
        
    }
    
    // If table is paginated, paginate table
    
    if($(table).hasClass('paginated')){
        
        paginateTable(table);
        
    }
    
}

// Create pagination for table

function paginateTable(table){
    
    // Get list of table rows (includes header row, not filtered rows) and number of rows to show
    
    let tableRows = $(table).find('tr:not(.filtered)');
    let showNumber = parseInt($(table).parent().siblings('.table-show').find('select').val());
    
    // Get number of pages needed
    
    let pages = Math.ceil((tableRows.length - 1) / showNumber);
    
    // Clear table pagination
    
    $(table).parent().siblings('.pagination').remove();
    
    // If more than 1 page, create table pagination
    
    if(pages > 1){
        
        // Create table pagination
        
        let pagination = $('<div></div>');
        $(pagination).addClass('pagination');
        
        // HTML for table pagination
        
        let html = '';
        html += '<button type="button" class="first"></button>';
        html += '<button type="button" class="prev"></button>';
        
        for(let i = 1; i <= pages; i++){
            
            html += '<button>' + i + '</button>';
            
        }
        
        html += '<button type="button" class="next"></button>';
        html += '<button type="button" class="last"></button>';
        
        // Add HTML for time picker
        
        pagination.html(html);
        
        // Add date picker after field
        
        $(table).parent().after(pagination);
        
        // Set event handlers for header
        
        setTablePaginationHandlers(pagination);
        
    }
    
    // Set page to page 1 even if only 1 page
    
    setTablePagination(table, 1);
    
}

// Set page for table pagination and show rows for that page

function setTablePagination(table, pageNumber){
    
    // Get list of table rows (includes header row, not filtered rows), number of rows to show, and table pagination
    
    let tableRows = $(table).find('tr:not(.filtered)');
    let showNumber = parseInt($(table).parent().siblings('.table-show').find('select').val());
    let pagination = $(table).parent().siblings('.pagination');
    
    // Get first and last index for current page
    
    let first = (pageNumber - 1) * showNumber;
    let last = pageNumber * showNumber;
    
    // Cycle through rows to show current page and hide others
    
    for(let i = 1; i < tableRows.length; i++){
        
        if(i > first && i <= last){
            
            $(tableRows[i]).show();
            
        }
        
        else{
            
            $(tableRows[i]).hide();
            
        }
        
    }
    
    // Clear existing ellipsis buttons
    
    $(pagination).find('button.ellipsis').remove();
    
    // Set active page button on pagination
    
    let activePage = $(pagination).find('button')[pageNumber + 1];
    
    $(activePage).addClass('active');
    $(activePage).siblings('button').removeClass('active');
    
    // Show arrow buttons if hidden
    
    $(activePage).siblings('button.first, button.prev, button.next, button.last').css('visibility', 'visible');
    
    // If first page, hide first and prev buttons
    
    if($(activePage).prev().hasClass('prev')){
        
        $(activePage).siblings('button.first, button.prev').css('visibility', 'hidden');
        
    }
    
    // If last page, hide next and last buttons
    
    if($(activePage).next().hasClass('next')){
        
        $(activePage).siblings('button.next, button.last').css('visibility', 'hidden');
        
    }
    
    // If more than 9 pages, show 9 page buttons and ellipsis for anything beyond
    
    let pages = Math.ceil((tableRows.length - 1) / showNumber);
    let firstPageShown = Math.max(pageNumber - 4 - Math.max(4 - (pages - pageNumber), 0), 1);
    let lastPageShown = Math.min(pageNumber + 4 + Math.max(4 - (pageNumber - 1), 0), pages);
    
    // Cycle through page buttons to show 9 page buttons and hide others
    
    let i = 1;
    
    $(pagination).find('button:not(.first, .prev, .next, .last)').each(function(){
        
        if(i < firstPageShown || i > lastPageShown){
            
            $(this).hide();
            
        }
        
        else{
            
            $(this).show();
            
        }
        
        i++;
        
    });
    
    // If on first page button to show and that button is not first page button, add ellipsis
    
    if(firstPageShown != 1){
        
        let ellipsis = $('<button type="button"></button>');
        
        ellipsis.addClass('ellipsis');
        $(pagination).find('button.prev').after(ellipsis);
        
        $(ellipsis).on('click', function(event){
            
            setTablePagination(table, firstPageShown - 1);
            
        });
        
    }
    
    // If on last page button to show and that button is not last page button, add ellipsis
    
    if(lastPageShown != pages){
        
        let ellipsis = $('<button type="button"></button>');
        
        ellipsis.addClass('ellipsis');
        $(pagination).find('button.next').before(ellipsis);
        
        $(ellipsis).on('click', function(event){
            
            setTablePagination(table, lastPageShown + 1);
            
        });
        
    }
    
}

// Go to next page of table pagination

function nextTablePage(table){
    
    // Get table pagination
    
    let pagination = $(table).parent().siblings('.pagination');
    
    // Find current page number and go to next page
    
    let currentPage = $(pagination).find('button.active').prevAll('button').length - 1;
    setTablePagination(table, currentPage + 1);
    
}

// Go to previous page of table pagination

function prevTablePage(table){
    
    // Get table pagination
    
    let pagination = $(table).parent().siblings('.pagination');
    
    // Find current page number and go to next page
    
    let currentPage = $(pagination).find('button.active').prevAll('button').length - 1;
    setTablePagination(table, currentPage - 1);
    
}



/**************************************** BREADCRUMBS ****************************************/

// On load...

$(function(){
    
    // Center active breadcrumb for each breadcrumb container
    
    $('.breadcrumb-pages, .breadcrumb-steps').each(function(){
        
        centerActiveBreadcrumb(this);
        
    });
    
    // Handle resizing window
    
    $(window).resize(function(){
        
        // Center active breadcrumb for each breadcrumb container
        
        $('.breadcrumb-pages, .breadcrumb-steps').each(function(){
            
            centerActiveBreadcrumb(this);
            
        });
        
    });
    
});

// Center active breadcrumb

function centerActiveBreadcrumb(container){
    
    let activeBreadcrumb = $(container).find('.active');
    let activePosition = $(activeBreadcrumb).position().left + $(container).scrollLeft();
    
    let containerWidth = $(container).outerWidth();
    let activeWidth = $(activeBreadcrumb).outerWidth();
    
    $(container).scrollLeft(activePosition - (containerWidth - activeWidth) / 2);
    
}



/**************************************** MODALS ****************************************/

// On load...

$(function(){
    
    // Set event handlers
    
    $('.modal').each(function(){
        
        setModalHandlers(this);
        
    });
    
});

// Set event handlers

function setModalHandlers(modal){
    
    // Hide modal on clicking exit/close buttons
    
    $(modal).find('.exit, .close').on('click', function(event){
        
        $(modal).hide();
        
    });
    
    // Hide modal on clicking outside
    
    $(modal).on('click', function(event){
        
        if($(modal).has(event.target).length == 0 && !$(modal).hasClass('required')){
            
            $(modal).hide();
            
        }
        
    });
    
}

// Show modal

function showModal(modalId){
    
    $('#' + modalId).show();
    
    // If modal top is negative, set to 0
    
    let modal = $('#' + modalId).find('.alert-modal, .form-modal, .message-modal');
    
    if($(modal).position().top < 0){
        
        $(modal).css('top', 0);
        $(modal).css('-webkit-transform', 'translate(-50%, 0)');
        $(modal).css('-moz-transform', 'translate(-50%, 0)');
        $(modal).css('-ms-transform', 'translate(-50%, 0)');
        $(modal).css('transform', 'translate(-50%, 0)');
        
    }
    
    // If modal has tabs, set overflow tab
    
    handleTabOverflow($(modal).find('.tab-container'));
    
}



/**************************************** HELP TEXT ****************************************/

// On load...

$(function(){
    
    // Set event handlers for clickable help text
    
    $('.help.click').each(function(){
        
        // Show help text on click
        
        $(this).on('click', function(event){
            
            $(this).find('.help-text-s, .help-text-m, .help-text-l').show();
            
        });
        
        // Hide help text on clicking outside
        
        let helpText = this;
        
        $(document).on('click', function(event){
            
            if($(helpText).has(event.target).length == 0){
                
                $(helpText).find('.help-text-s, .help-text-m, .help-text-l').hide();
                
            }
            
        });
        
    });
    
});



/**************************************** BANNERS ****************************************/

// On load...

$(function(){
    
    $('.success-banner, .warning-banner, .error-banner, .message-banner').each(function(){
        
        setBannerHandlers(this);
        
    });
    
});

// Set event handlers

function setBannerHandlers(banner){
    
    $(banner).find('.exit').on('click', function(event){
        
        $(banner).hide();
        
    });
    
}