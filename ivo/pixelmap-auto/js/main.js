var logmessage = [];
var sourceip = [];
var sourceport = [];
var username = [];
var time = [];            
var color;
var groupOnHover = false;

$(function() {

    wrapperone = $('#wrapper-1');
    wrappertwo = $('#wrapper-2');
    wrapperthree = $('#wrapper-3');
    wrapperfour = $('#wrapper-4');
    wrapperfive = $('#wrapper-5');

    $('h3').after('<span></span>');

    $.getJSON("../data/daten.json", function(data) {
        $.each(data, function(key, val) {
            // key == id
            logmessage.push(val.Logmessage);
            sourceip.push(val.SourceIP);
            sourceport.push(val.SourcePort);
            username.push(val.Username.replace(/\s/g, ''));
            time.push(val.Time.substring(0,6));
        });
        init();
    });
});

function init() {

    for(var i = 0; i < logmessage.length; i++) {
        if(logmessage[i] == 'Accepted publickey') {
            color = '146A75'; // Blue
        } else if(logmessage[i] == 'Failed password') {
            color = "F4CC5D"; // Yellow
        } else {
            color = "F46948"; // Red
        }
        wrapperone.append('<div style="background: #'+color+'" data-title="'+logmessage[i]+'" class="pixel-'+i+'"></div>');
    }

    for(var i = 0; i < logmessage.length; i++) {
        if(sourceip[i] == '2001:4ca0:0:109::a9c:810') {
            color = '146A75'; // Blue
        } else if(sourceip[i] == '166.78.132.130') {
            color = "65BCA5"; // Green
        } else if(sourceip[i] == '222.190.114.98') {
            color = "F4CC5D"; // Yellow
        } else {
            color = "F46948"; // Red
        }
        wrappertwo.append('<div style="background: #'+color+'" data-title="'+sourceip[i]+'" class="pixel-'+i+'"></div>');
    }

    for(var i = 0; i < logmessage.length; i++) {
        if(sourceport[i] < 20000) {
            color = '146A75'; // Blue
        }
        if(sourceport[i] > 20000) {
            color = "65BCA5"; // Green
        }
        if(sourceport[i] > 40000) {
            color = "F4CC5D"; // Yellow
        } 
        if(sourceport[i] > 60000) {
            color = "F46948"; // Red
        }
        wrapperthree.append('<div style="background: #'+color+'" data-title="'+sourceport[i]+'" class="pixel-'+i+'"></div>');
    }

    for(var i = 0; i < logmessage.length; i++) {
        if(username[i] == 'gitosis') {
            color = '146A75'; // Blue
        } else if(username[i] == 'root') {
            color = "65BCA5"; // Green
        } else {
            color = "F46948"; // Red
        }
        wrapperfour.append('<div style="background: #'+color+'" data-title="'+username[i]+'" class="pixel-'+i+'"></div>');
    }                

    for(var i = 0; i < logmessage.length; i++) {
        if(time[i] == 'Aug 18') {
            color = '146A75'; // Blue
        } else if(time[i] == 'Aug 19') {
            color = "65BCA5"; // Green
        } else if(time[i] == 'Aug 20') {
            color = "F4CC5D"; // Yellow
        } else {
            color = "F46948"; // Red
        }
        wrapperfive.append('<div style="background: #'+color+'" data-title="'+time[i]+'" class="pixel-'+i+'"></div>');
    }

    $('.wrapper div').on('mouseover', function() {
        $('.wrapper .'+$(this).attr('class')).addClass('active');

        wrapperone.find('span').html(wrapperone.find('.active').data('title'));
        wrappertwo.find('span').html(wrappertwo.find('.active').data('title'));
        wrapperthree.find('span').html(wrapperthree.find('.active').data('title'));
        wrapperfour.find('span').html(wrapperfour.find('.active').data('title'));
        wrapperfive.find('span').html(wrapperfive.find('.active').data('title'));

        if(groupOnHover) {
            $(this).parent().find('[data-title="' + $(this).attr('data-title') + '"]').addClass('same');
        }
    });

    $('.wrapper div').on('mouseout', function() {
        $('.wrapper .active').removeClass('active');
        $('.wrapper div').removeClass('same');
    });

    $('.wrapper').on('mouseenter', function() {
        if(groupOnHover) {
            $('#legendattr').html($(this).find('h3').html());
        }
    });

    $('.wrapper').on('mouseout', function() {
        $('.wrapper').find('span').html(' ');
    });


    $('#grouponhover').on('change', function () {
        if($(this).is(':checked')) {
            groupOnHover = true;
            $('.legend').css('display', 'block');
        } else {
            groupOnHover = false;
            $('.legend').css('display', 'none');
        }
    });
}