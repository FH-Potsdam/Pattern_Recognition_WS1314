$(function() {
    var logmessage = [];
    var sourceip = [];
    var sourceport = [];
    var username = [];
    var time = [];
    var colors = [
        'rgba(93, 151, 91, 1)',
        'rgba(88, 140, 148, 1)',
        'rgba(83, 104, 146, 1)',
        'rgba(113, 80, 129, 1)',
        'rgba(201, 78, 69, 1)',
        'rgba(201, 161, 56, 1)',

        'rgba(93, 151, 91, .8)',
        'rgba(88, 140, 148, .8)',
        'rgba(83, 104, 146, .8)',
        'rgba(113, 80, 129, .8)',
        'rgba(201, 78, 69, .8)',
        'rgba(201, 161, 56, .8)',

        'rgba(93, 151, 91, .6)',
        'rgba(88, 140, 148, .6)',
        'rgba(83, 104, 146, .6)',
        'rgba(113, 80, 129, .6)',
        'rgba(201, 78, 69, .6)',
        'rgba(201, 161, 56, .6)',

        'rgba(93, 151, 91, .4)',
        'rgba(88, 140, 148, .4)',
        'rgba(83, 104, 146, .4)',
        'rgba(113, 80, 129, .4)',
        'rgba(201, 78, 69, .4)',
        'rgba(201, 161, 56, .4)',

        'rgba(93, 151, 91, .2)',
        'rgba(88, 140, 148, .2)',
        'rgba(83, 104, 146, .2)',
        'rgba(113, 80, 129, .2)',
        'rgba(201, 78, 69, .2)',
        'rgba(201, 161, 56, .2)'
    ];
    colorcount = 0;            
    var groupOnHover = false;

    $(function() {

        wrapperone = $('#wrapper-1');
        wrappertwo = $('#wrapper-2');
        wrapperthree = $('#wrapper-3');
        wrapperfour = $('#wrapper-4');
        wrapperfive = $('#wrapper-5');

        $('h3').after('<span></span>');

        $.getJSON("data/daten.json", function(data) {
            $.each(data, function(key, val) {
                // key == id
                logmessage.push(val.Logmessage);
                sourceip.push(val.SourceIP);
                sourceport.push(val.SourcePort);
                username.push(val.Username);
                time.push(val.Time.substring(0,6));
            });
            init();
        });
    });

    function init() {

        for(var i = 0; i < logmessage.length; i++) {
            wrapperone.append('<div data-title="'+logmessage[i]+'" class="pixel-'+i+'"></div>');
            wrappertwo.append('<div data-title="'+sourceip[i]+'" class="pixel-'+i+'"></div>');
            wrapperthree.append('<div data-title="'+sourceport[i]+'" class="pixel-'+i+'"></div>');  
            wrapperfour.append('<div data-title="'+username[i]+'" class="pixel-'+i+'"></div>');
            wrapperfive.append('<div data-title="'+time[i]+'" class="pixel-'+i+'"></div>');
        }

        $('.wrapper div').on('mouseover', function() {
            $('.wrapper .'+$(this).attr('class')).addClass('active');

            wrapperone.find('span').html(wrapperone.find('.active').data('title'));
            wrappertwo.find('span').html(wrappertwo.find('.active').data('title'));
            wrapperthree.find('span').html(wrapperthree.find('.active').data('title'));
            wrapperfour.find('span').html(wrapperfour.find('.active').data('title'));
            wrapperfive.find('span').html(wrapperfive.find('.active').data('title'));

            if(groupOnHover) {
                $(this).parent().find('[data-title="' + $(this).data('title') + '"]').addClass('same');
            }
        });

        function get_random_color() {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.round(Math.random() * 15)];
            }
            return color;
        }

        $('.wrapper div').on('click', function() {
            //$(this).parent().find('[data-title="' + $(this).data('title') + '"]').css('background', get_random_color());
            if($(this).css('background-color') == 'rgb(0, 0, 0)') {
                $(this).parent().find('[data-title="' + $(this).data('title') + '"]').css('background', colors[colorcount]);
                colorcount++;
            }
            
        });

        $('.wrapper div').on('mouseout', function() {
            $('.wrapper .active').removeClass('active');
            $('.wrapper div').removeClass('same');
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
});

