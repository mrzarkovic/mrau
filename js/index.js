/**
 * Created by Milos on 25-Feb-16.
 */

var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        // Web testing
        document.addEventListener('DOMContentLoaded', this.onDomLoaded, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        if (navigator && navigator.splashscreen) {
            //navigator.splashscreen.show();
        }
        var attachFastClick = Origami.fastclick;
        attachFastClick(document.body);

        var navbar = $('#navbar');
        $('#app').removeClass("hidden");

        $(navbar).on('show.bs.collapse', function () {
            window.scrollTo(0, 0);
            $('.navbar').removeClass("navbar-fixed-top");
            $('.navbar').addClass("navbar-static-top");
            $('.content').removeClass("navbar-padding-top");
            $('.players-row').removeClass("fixed-players");
        });
        $(navbar).on('hidden.bs.collapse', function () {
            $('.navbar').removeClass("navbar-static-top");
            $('.navbar').addClass("navbar-fixed-top");
            $('.content').addClass("navbar-padding-top");
            $('.players-row').addClass("fixed-players");
        });

        var domElement = document.getElementById("app");
        angular.bootstrap(domElement, ['mrau']);
        app.receivedEvent('deviceready');
    },
    onDomLoaded: function () {
        console.log("web");

        var navbar = $('#navbar');
        $('#app').removeClass("hidden");

        $(navbar).on('show.bs.collapse', function () {
            window.scrollTo(0, 0);
            $('.navbar').removeClass("navbar-fixed-top");
            $('.navbar').addClass("navbar-static-top");
            $('.content').removeClass("navbar-padding-top");
            $('.players-row').removeClass("fixed-players");
        });
        $(navbar).on('hidden.bs.collapse', function () {
            $('.navbar').removeClass("navbar-static-top");
            $('.navbar').addClass("navbar-fixed-top");
            $('.content').addClass("navbar-padding-top");
            $('.players-row').addClass("fixed-players");
        });
        var domElement = document.getElementById("app");
        angular.bootstrap(domElement, ['mrau']);
        //app.receivedEvent('deviceready');

        app.setupScroller();
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        //FastClick.attach(document.body);
        console.log('Received Event: ' + id);
    },
    setupScroller: function () {
        var scrollTimerHandle = "";
        var positionTimerHandle = "";
        var boxSize = 60;

        $(".scroller-body").each(function () {
            $(this).scroll(function () {
                var playerId = $(this).data("player-id");
                var preScrollPosition = parseInt(this.scrollTop / boxSize) * boxSize;
                var newScrollPosition = this.scrollTop - preScrollPosition < boxSize / 2 ? preScrollPosition : preScrollPosition + boxSize;
                var order = newScrollPosition / boxSize;

                _this = this;



                clearInterval(scrollTimerHandle);
                scrollTimerHandle = setTimeout(function () {
                    positionTimerHandle = setInterval(function () {
                        if (_this.scrollTop == newScrollPosition) {
                            clearInterval(positionTimerHandle);
                            // Set selected item
                            $("[data-order]").removeClass("selected");
                            $("[data-order='" + order + "']").addClass("selected");
                            var value = $("[data-order='" + order + "']").html();
                            var playerInput = $("[data-result-for='" + playerId + "']");
                            playerInput.val(value);
                            playerInput.trigger("change");
                        } else {
                            if (_this.scrollTop > newScrollPosition) {
                                _this.scrollTop--;
                            } else {
                                _this.scrollTop++;
                            }
                        }
                    }, 10);
                }, 100);
            });
        });

        $("[data-result-for]").each(function () {
            $(this).change(function () {
                var playerId = $(this).data("result-for");
                var val = $(this).val();
                var input = $("[data-value='" + val + "']");
                var inputOrder = $(input).data("order");
                var value = 0;
                value = boxSize * parseInt(inputOrder - 1);
                console.log(value);
                //$("[data-player-id='" + playerId + "']").scrollTop(value);
            });
        });
    }
};

app.initialize();