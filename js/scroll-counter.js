/**
 * Created by milos_000 on 02-Mar-16.
 */
$( document ).ready(function() {
    var scrollTimerHandle = "";
    var positionTimerHandle = "";
    var boxSize = 60;

    $("#scroller-body").scroll(function() {
        var preScrollPosition = parseInt(this.scrollTop / boxSize) * boxSize;
        var newScrollPosition = this.scrollTop - preScrollPosition < boxSize /2 ? preScrollPosition : preScrollPosition + boxSize;
        var order = newScrollPosition / boxSize;

        // Set selected item
        $("[data-order]").removeClass("selected");
        $("[data-order='" + order + "']").addClass("selected");
        $("#resultInput").val(order + 1);

        _this = this;

        clearInterval(scrollTimerHandle);
        scrollTimerHandle  = setTimeout(function() {
            positionTimerHandle = setInterval(function(){
                if (_this.scrollTop == newScrollPosition){
                    clearInterval(positionTimerHandle);
                } else {
                    if (_this.scrollTop > newScrollPosition){
                        _this.scrollTop--;
                    } else {
                        _this.scrollTop++;
                    }
                }
            }, 10);
        }, 100);
    });

    $("#resultInput").change(function(){
        var value = 0;
        value = boxSize * parseInt($(this).val() - 1);
        console.log(value);
        $("#scroller-body").scrollTop(value);
    });
});