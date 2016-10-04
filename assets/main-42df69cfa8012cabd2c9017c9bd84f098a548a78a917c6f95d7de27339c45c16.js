$(function(){
    var positions = [];
    //--------------measuring size of span
    var max = 0;
    $('span').each(function(index){
        // console.log($(this).outerWidth()+" "+$(this).outerHeight())
        if ($(this).outerWidth() > max)
            max = $(this).outerWidth();
        if ($(this).outerHeight() > max)
            max = $(this).outerWidth();
    });
    max = 20; // widen gap between span
    //--------------measuring size of span ---end
    //--------------generate location of span
    $('span').each(function(index){
        do {
            var x = Math.random()*($('.playground').width() - $(this).outerWidth());
            var y = Math.random()*($('.playground').height() - $(this).outerHeight());
            var tmp = {x1: x,
                y1: y,
                x2: x+$(this).outerWidth(),
                y2: y+$(this).outerHeight()};

        } while (check(tmp, max));
        positions.push(tmp);
        $(this).css({
            left: tmp.x1,
            top: tmp.y1,
            zIndex: 10
        });
    });

    function check(span,optionalRadius){//check overlay, return false if not overlayed
        z = (typeof optionalRadius === 'undefined') ? 0 : optionalRadius;
        if (positions.length == 0){
            return false;
        }else{
            for (var i = 0 ;i < positions.length; i++){
                var pos = positions[i];
                //create bigger diameter
                var x1 = pos.x1 - z;
                var x2 = pos.x2 + z;
                var y1 = pos.y1 - z;
                var y2 = pos.y2 + z;
                if (checkBound(span, x1, x2, y1, y2)){
                    return true;
                }
            }
            return false;
        }
    }

    function checkBound(span, x1, x2, y1, y2){
        if (x1 <= span.x1 && span.x1 <= x2 && y1 <= span.y1 && span.y1 <= y2){
            return true;
        }
        if (x1 <= span.x2 && span.x2 <= x2 && y1 <= span.y2 && span.y2 <= y2){
            return true;
        }
        if (x1 <= span.x1 && span.x1 <= x2 && y1 <= span.y2 && span.y2 <= y2){
            return true;
        }
        if (x1 <= span.x2 && span.x2 <= x2 && y1 <= span.y1 && span.y1 <= y2){
            return true;
        }
        return false;
    }
    //--------------generate location of span ---end
    //--------------drag and drop process
    var selectedElement = null;
    var oldPos = {
        x: 0,
        y: 0
    }
    function dragStart(e) {
        var style = window.getComputedStyle(e.originalEvent.target, null);
        var str = (parseInt(style.getPropertyValue("left")) - e.originalEvent.clientX) + ',' + (parseInt(style.getPropertyValue("top")) - e.originalEvent.clientY);

        e.originalEvent.dataTransfer.setData("Text",str);
        selectedElement = this;

        oldPos.x = (parseInt(style.getPropertyValue("left")) - e.originalEvent.clientX);
        oldPos.y = (parseInt(style.getPropertyValue("top")) - e.originalEvent.clientY);

        this.style.zIndex=1;

        var crt = this.cloneNode(true);// create no ghost image
          crt.style.display = "none";//  or visibility: hidden, or any of the above
          // document.body.appendChild(crt);
          e.originalEvent.dataTransfer.setDragImage(crt, 0, 0);
    }
    function bodyOnDragOver(e){
        if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
        }
        selectedElement.style.left = (oldPos.x + e.originalEvent.clientX) + 'px';
        selectedElement.style.top = (oldPos.y + e.originalEvent.clientY) + 'px';
    }
    function bodyOnDrop(e){
        if (e.stopPropagation) {
            e.stopPropagation(); // Stops some browsers from redirecting.
        }
        if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
        }
        var offset = e.originalEvent.dataTransfer.getData("Text").split(',');
        selectedElement.style.left = (e.originalEvent.clientX + parseInt(offset[0],10)) + 'px';
        selectedElement.style.top = (e.originalEvent.clientY + parseInt(offset[1],10)) + 'px';
        e.preventDefault();
        return false;
    }
    function matchOnDrop(e){// this: drop on / selectedElement : dragged
        if (e.stopPropagation) {
            e.stopPropagation(); // Stops some browsers from redirecting.
        }
        if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
        }
        if ($(selectedElement).attr('data-tea')==$(this).attr('data-tea') && $(selectedElement).attr('data-prop')!=$(this).attr('data-prop') && (selectedElement != this) ){
            $(this).remove();
            $(selectedElement).remove();
            if ($('span').length == 0){// there is no more span to play
                $('.next').attr('style','');
                clearInterval(timer);//stop time because player win
            }
        }else{
            selectedElement.style.zIndex=10;
            if (selectedElement == this){
                //because the element is now follow mouse so if we release mouse on empty space the ghost image will dropped on to it's origin
                //if player drop item ourside of the boundary then we randomize new location and animate it
                //check if style top and left outside of playground
                var s = selectedElement;
                // console.log(parseInt(s.style.left,10));
                // console.log(0 < parseInt(s.style.left,10));

                // console.log(parseInt(s.style.left,10) + s.offsetWidth);
                // console.log((parseInt(s.style.left,10) + s.offsetWidth) < $('.playground').width());

                // console.log(parseInt(s.style.top,10));
                // console.log(0 < parseInt(s.style.top,10));

                // console.log(parseInt(s.style.top,10) + s.offsetHeight);
                // console.log((parseInt(s.style.top,10) + s.offsetHeight) < $('.playground').height());
                if (0 < parseInt(s.style.left,10) && (parseInt(s.style.left,10) + s.offsetWidth) < $('.playground').width() &&
                    0 < parseInt(s.style.top,10) && (parseInt(s.style.top,10) + s.offsetHeight) < $('.playground').height())
                    return false;
            }
            do {
                var x = Math.random()*($('.playground').width() - $(selectedElement).outerWidth());
                var y = Math.random()*($('.playground').height() - $(selectedElement).outerHeight());
                var tmp = {x1: x,
                    y1: y,
                    x2: x+$(selectedElement).outerWidth(),
                    y2: y+$(selectedElement).outerHeight()};
            } while (check(tmp, max));

            positions[$('span').index(selectedElement)] =  tmp;

            $(selectedElement).animate({left:tmp.x1, top:tmp.y1},500);
        }
        return false;
    }
    //--------------drag and drop process ---end
    //--------------startup setting
    // $('body').on('dragover',bodyOnDragOver);
    $('.playground')
        .on('dragover', bodyOnDragOver)
        .on('drop', bodyOnDrop);
    $('span')
        .on('dragstart',dragStart)
        .on('dragover',bodyOnDragOver)
        .on('drop',matchOnDrop);

    var countUp = 0;
    var timer = setInterval(updateTime, 100);
    function updateTime(){
        countUp += 1;
        var sec_num = countUp;
        var mill_sec= sec_num % 10;
        sec_num 		= sec_num /10 ;
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = parseInt(sec_num - (hours * 3600) - (minutes * 60));
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        $('.timer').text(minutes+':'+seconds+'.'+mill_sec);
    }
    //--------------startup setting ---end
});
var time = 0;
var answerRight = '7';
var pos = 0;
$(document).ready(function () {
    if ($(".clound").length != '') {
        $(".clound").each(function () {
            var position = getPosition();
            var ran = Math.floor(Math.random() * 5);
            var delay_1 = ran * 2;
            var time_1 = Math.floor((Math.random() * 15) + 10);
            $(this).css({
                "top": position + "%",
                "-webkit-animation": "moveclouds " + time_1 + "s linear infinite",
                "-moz-animation": "moveclouds " + time_1 + "s linear infinite",
                "-o-animation": "moveclouds " + time_1 + "s linear infinite",
                "animation-delay": delay_1 + "ms",
                "-webkit-animation-delay": delay_1 + "s",
                "-moz-animation-delay": delay_1 + "s",
                "-o-animation-delay": delay_1 + "s",
            });
        });
    }
    if ($(".time-countdown").length != '') {
        var countdown = setInterval(function () {
            $(".time-countdown").text(time + "s");
            time++;
        }, 1000);
    }
    $("body").on("click", ".clound", function () {
        var answer = $(this).attr("data-rel");
        if (answer == answerRight) {

            $(".clound").each(function () {
                $(this).attr({
                    'data-rel': function (_, value) {
                        if (value != answerRight) {
                            $(this).fadeOut();
                        } else {

                            $(this).css({
                                "top": position + "%",
                                "-webkit-animation": "none",
                                "-moz-animation": "none",
                                "-o-animation": "none",
                                "animation-delay": "none",
                                "-webkit-animation-delay": "none",
                                "-moz-animation-delay": "none",
                                "-o-animation-delay": "none",
                            });
                            $(this).addClass("center");
                        }
                    }
                });
            });
            clearInterval(countdown);
            $(".message-right").html('<span style="color:green" >Bạn đã trả lời Đúng</span>');
        } else {
            $(".message-answer").html('<span style="color:red" >Bạn đã trả lời Sai và bị công thêm 5s</span>');
            setTimeout(function () {
                $(".message-answer").html("");
            }, 1000);
            time = time + 5;
        }
        //$("#clound").removeClass("animation-clound");
        //$("#clound").css({
        //    "margin": "0 auto",
        //    "left": 0,
        //    "right": 0,
        //});
    });
});
function getPosition() {
    pos = Math.floor((Math.random() * 70) + 1);
    return pos;
}
;
/**
 * Created by Nam Trung on 9/30/2016.
 */


;
