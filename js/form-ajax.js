jQuery(document).ready(function ($) {

    /* Submit form to get link on HobSpot */
    $(document).on('submit', '[data-action="HobSpot"]', function (e) {
        e.preventDefault();

        var th = $(this);
        var dataStr = th.serialize();

        $.ajax({
            url: '/wp-admin/admin-ajax.php',
            type: 'POST',
            data: dataStr + '&action=linkHobSpot',
            success: function (data) {
                setTimeout(function () {
                    $.cookie('gated_article', 'opened', { expires: 365, path: window.location.pathname });
                    $('html, body').animate({
                        scrollTop: $('.article_section').offset().top
                    }, 500);
                    $('.limited_article').removeClass('limited_article');
                    $('.limited_article_form').fadeOut();
                }, 300)
            }
        });
    });

    /* Subscribe Mail Ajax form for MailChimp */
    $(document).on('submit', '[data-action="mailChimp"]', function (e) {
        e.preventDefault();

        var th = $(this);
        var dataStr = th.serialize();

        $.ajax({
            url: '/wp-admin/admin-ajax.php',
            type: 'POST',
            data: dataStr + '&action=subscribeMailChimp',
            success: function (data) {
                // DO something when send form
            }
        });
    });

    /* Subscribe Mail Ajax form for MailChimp */
    $(document).on('submit', '[data-action="contactForm"]', function (e) {
        e.preventDefault();

        var th = $(this);
        var dataStr = th.serialize();

        $.ajax({
            //action: 'linkContactForm',
            url: '/wp-content/themes/clarity/contact_form.php',
            //url: '/wp-admin/admin-ajax.php',
            type: 'POST',
            data: dataStr,
            success: function (data) {
               window.location.href = "https://wecreateclarity.com/thank-you-for-getting-in-touch/";
                //th.closest('.form_wrap_hide').slideUp().next('.form_success').slideDown();
            }
        });
    });

});