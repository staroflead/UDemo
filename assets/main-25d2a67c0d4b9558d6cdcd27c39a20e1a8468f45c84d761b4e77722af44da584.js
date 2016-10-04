$(function(){
    var positions = [];
    var max = 0;
    setTimeout(function() {
        //--------------measuring size of span
        $('.dragNDrop').each(function (index) {
            // console.log($(this).outerWidth()+" "+$(this).outerHeight())
            if ($(this).outerWidth() > max)
                max = $(this).outerWidth();
            if ($(this).outerHeight() > max)
                max = $(this).outerWidth();
        });
        max = 30; // widen gap between span
        //--------------measuring size of span ---end
        //--------------generate location of span
        $('.dragNDrop').each(function (index) {
            do {
                var x = Math.random() * (($('.playground').width() * 0.9) - $(this).outerWidth()) + ($('.playground').width() * 0.05);
                var y = Math.random() * (($('.playground').height() * 0.9) - $(this).outerHeight()) + ($('.playground').height() * 0.05);
                var tmp = {
                    x1: x,
                    y1: y,
                    x2: x + $(this).outerWidth(),
                    y2: y + $(this).outerHeight()
                };

            } while (check(tmp, max));
            positions.push(tmp);
            $(this).css({
                left: tmp.x1,
                top: tmp.y1,
                zIndex: 10
            });
        });
        $('.dragNDrop').fadeTo(1,1);

        // console.log(positions);
        //fix overlapping span
        for (var i = 0 ;i < positions.length-1; i++){
            for (var j = i+1 ;j < positions.length; j++){
                // if (checkBound(positions[i],positions[j].x1,positions[j].x2,positions[j].y1,positions[j].y2)){
                if (checkBound(positions[i],positions[j])){
                    // console.log($('.dragNDrop')[i].style);
                    // console.log("trung");
                    // console.log($('.dragNDrop')[j].style);
                    do {
                        var x = Math.random() * (($('.playground').width() * 0.9) - $($('.dragNDrop')[i]).outerWidth()) + ($('.playground').width() * 0.05);
                        var y = Math.random() * (($('.playground').height() * 0.9) - $($('.dragNDrop')[i]).outerHeight()) + ($('.playground').height() * 0.05);
                        var tmp = {x1: x,
                            y1: y,
                            x2: x+$(selectedElement).outerWidth(),
                            y2: y+$(selectedElement).outerHeight()};
                    } while (check(tmp, max));
                    positions[i] = tmp;
                    $($('.dragNDrop')[i]).css({
                        left: tmp.x1,
                        top: tmp.y1,
                        zIndex: 10
                    });
                    // console.log($('.dragNDrop')[i].style);
                }
            }
            // console.log("het");
        }
        // console.log(positions[0].x1 + " " + positions[1].x1);
    },1);
    function check(span,optionalRadius){//check overlay, return false if not overlayed
        z = (typeof optionalRadius === 'undefined') ? 0 : optionalRadius;
        if (positions.length == 0){
            return false;
        }else{
            for (var i = 0 ;i < positions.length; i++){
                var pos = positions[i];
                //create bigger diameter
                var tmp = {
                    x1 : pos.x1 - z,
                    x2 : pos.x2 + z,
                    y1 : pos.y1 - z,
                    y2 : pos.y2 + z
                };
                if (checkBound(span, tmp) || checkBound(tmp,span)){
                    return true;
                }
            }
            return false;
        }
    }

    function checkBound(span1, span2){
        if (span2.x1 <= span1.x1 && span1.x1 <= span2.x2 && span2.y1 <= span1.y1 && span1.y1 <= span2.y2){
            return true;
        }
        if (span2.x1 <= span1.x2 && span1.x2 <= span2.x2 && span2.y1 <= span1.y2 && span1.y2 <= span2.y2){
            return true;
        }
        if (span2.x1 <= span1.x1 && span1.x1 <= span2.x2 && span2.y1 <= span1.y2 && span1.y2 <= span2.y2){
            return true;
        }
        if (span2.x1 <= span1.x2 && span1.x2 <= span2.x2 && span2.y1 <= span1.y1 && span1.y1 <= span2.y2){
            return true;
        }
        return false;
    }
    //--------------generate location of span ---end
    //--------------drag and drop process
    var selectedElement = null;
    var hoveringElement = null;
    var oldPos = {
        x: 0,
        y: 0
    };
    function dragStart(e) {
        selectedElement = this;
        var style = window.getComputedStyle(e.originalEvent.target, null);
        var str = (parseInt(style.getPropertyValue("left")) - e.originalEvent.clientX) + ',' + (parseInt(style.getPropertyValue("top")) - e.originalEvent.clientY);

        e.originalEvent.dataTransfer.setData("Text",str);

        oldPos.x = (parseInt(style.getPropertyValue("left")) - e.originalEvent.clientX);
        oldPos.y = (parseInt(style.getPropertyValue("top")) - e.originalEvent.clientY);

        this.style.zIndex=0;

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
        // console.log(selectedElement.style.left+" "+selectedElement.style.top);
        positions[$('.dragNDrop').index(selectedElement)].x1 =parseFloat($(selectedElement).css('left'));
        positions[$('.dragNDrop').index(selectedElement)].x2 =parseFloat($(selectedElement).css('left'))+ $(selectedElement).outerWidth();
        positions[$('.dragNDrop').index(selectedElement)].y1 =parseFloat($(selectedElement).css('top'));
        positions[$('.dragNDrop').index(selectedElement)].y2 =parseFloat($(selectedElement).css('top'))+ $(selectedElement).outerHeight();
        for (var i = 0 ;i < positions.length; i++){
            // console.log($('.dragNDrop').index(selectedElement));
            if ($('.dragNDrop').index(selectedElement)!=i && (checkBound(positions[$('.dragNDrop').index(selectedElement)],positions[i]) || checkBound(positions[i],positions[$('.dragNDrop').index(selectedElement)]))){
                $($('.dragNDrop')[i]).addClass('hover');
            }
            else
                $($('.dragNDrop')[i]).removeClass('hover');
        }
    }

    // function bodyOnDrop(e){
    //     if (e.stopPropagation) {
    //         e.stopPropagation(); // Stops some browsers from redirecting.
    //     }
    //     if (e.preventDefault) {
    //         e.preventDefault(); // Necessary. Allows us to drop.
    //     }
    //     // var offset = e.originalEvent.dataTransfer.getData("Text").split(',');
    //     // selectedElement.style.left = (e.originalEvent.clientX + parseInt(offset[0],10)) + 'px';
    //     // selectedElement.style.top = (e.originalEvent.clientY + parseInt(offset[1],10)) + 'px';
    //     e.preventDefault();
    //     return false;
    // }
    function matchOnDrop(e){// this: drop on / selectedElement : dragged
        if (e.stopPropagation) {
            e.stopPropagation(); // Stops some browsers from redirecting.
        }
        if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
        }
        selectedElement.style.zIndex = 10;
        // console.log('Dropped');
        // console.log(positions[0].x1 + " " + positions[1].x1);
        setTimeout(function() {
            if ($('.hover').length > 0) {
                // console.log('Dropped with hover');
                var isDeleted = false;
                for (var i = 0; i < $('.hover').length; i++) {
                    if ($(selectedElement).attr('data-tea') == $($('.hover')[i]).attr('data-tea')
                        && $(selectedElement).attr('data-prop') != $($('.hover')[i]).attr('data-prop')
                        && (
                        $($(selectedElement)[i]).attr('data-prop') == null
                        || $($('.hover')[i]).attr('data-prop') == null)
                    ) {
                        // console.log('Delete');
                        // console.log("deleted = "+$('.dragNDrop').index($('.hover')[i])+","+$('.dragNDrop').index(selectedElement));

                        positions.splice($('.dragNDrop').index($('.hover')[i]), 1);
                        $('.hover')[i].remove();
                        positions.splice($('.dragNDrop').index(selectedElement), 1);
                        $(selectedElement).remove();

                        if ($('.dragNDrop').length == 0) {// there is no more span to play
                            $('.next').attr('style', '');
                            // clearInterval(countdown);//stop time because player win
                            rightAnswer();
                        }
                        isDeleted = true;
                        break;
                    }
                }
                $('.hover').removeClass('hover');
                if (!isDeleted) {
                    do {
                        var x = Math.random() * (($('.playground').width() * 0.9) - $(this).outerWidth()) + ($('.playground').width() * 0.05);
                        var y = Math.random() * (($('.playground').height() * 0.9) - $(this).outerHeight()) + ($('.playground').height() * 0.05);
                        var tmp = {
                            x1: x,
                            y1: y,
                            x2: x + $(selectedElement).outerWidth(),
                            y2: y + $(selectedElement).outerHeight()
                        };
                    } while (check(tmp, max));

                    positions[$('.dragNDrop').index(selectedElement)] = tmp;
                    // console.log(positions);
                    $(selectedElement).animate({left: tmp.x1, top: tmp.y1}, 500);
                }
            }
        },100);

        return false;
    }
    //--------------drag and drop process ---end
    //--------------startup setting
    // $('body').on('dragover',bodyOnDragOver);
    $('.playground')
        .on('dragover', bodyOnDragOver)
        .on('drop', matchOnDrop);
    $('.dragNDrop')
        .on('dragstart',dragStart)
        .on('dragover',bodyOnDragOver)
        .on('drop',matchOnDrop);

    var countUp = 0;
    //var timer = setInterval(updateTime, 100);
    //function updateTime(){
    //    countUp += 1;
    //    var sec_num = countUp;
    //    var mill_sec= sec_num % 10;
    //    sec_num 		= sec_num /10 ;
    //    var hours   = Math.floor(sec_num / 3600);
    //    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    //    var seconds = parseInt(sec_num - (hours * 3600) - (minutes * 60));
    //    if (minutes < 10) {minutes = "0"+minutes;}
    //    if (seconds < 10) {seconds = "0"+seconds;}
    //    $('.timer').text(minutes+':'+seconds+'.'+mill_sec);
    //}
    //--------------startup setting ---end
});
var pos = 0;
var time = 0;
var countdown;
var user = {};
$(document).ready(function () {
    if ($('.top5').length > 0){
        calculateResult();
        var jsonString = localStorage.getItem('top5');
        top5Array = JSON.parse(jsonString);
        for (i = 0; i < top5Array.length; i++) {
            $('#rank' + (i + 1)).text(top5Array[i].name);
            $('#score' + (i + 1)).text(convertTime(top5Array[i].score));
        }
        var rank = localStorage.getItem('rank');
        $('#rank' + (i)).parent().attr('style','color: red');
    }
    if (sessionStorage.getItem("user") != null) {
        startGameKnorr();
        startGame7();
    }
    // $(".btn-next").hide();//hide next btn if production
    $("body").on("click", ".btn-get-name", function () {
        registerUser();
    });
    $("#userName").keyup(function (e) {
        if (e.keyCode == 13) {
            registerUser();
        }
    });
    function registerUser() {
        var Validator = $(".validation").validate();
        if (Validator.form()) {
            var name = $("input[name='name']").val();
            sessionStorage.setItem("user", name);
            startGameKnorr();
            startGame7();
        }
    }
    $("body").on("click", ".game-knorr", function () {
        var answer = $(this).attr("data-rel");
        if (answer == answerRight) {

            $(".game-knorr").each(function () {
                $(this).attr({
                    'data-rel': function (_, value) {
                        if (value != answerRight) {
                            $(this).fadeOut();
                        } else {
                            $(this).css({
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
            showButtonNext();
            rightAnswer();
        } else {
            wrongAnser();
        }
    });

    //Sunlight
    $(".input-last").keyup(function () {
        var firstText = $(".input-first").val();
        var lastText = $(this).val();
        if (lastText.length >= 5) {
            var rightAnswerKnorr = ["thiên nhiên", "thien nhien", "thiên nhien", "thien nhiên"];
            var answer = firstText + " " + lastText;
            if (rightAnswerKnorr.indexOf(answer) != -1) {
                rightAnswer();
            } else {
                wrongAnser();
            }
        }
    });
});
function startGameKnorr() {
    showUserInfo();
    if ($(".game-knorr").length != '') {
        $(".game-knorr").each(function () {
            var position = getPosition();
            var ran = Math.floor(Math.random() * 1);
            var delay_1 = ran;
            var time_1 = Math.floor((Math.random() * 15) + 20);
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
        countdown = setInterval(countDown, 100);
    }
}
function getPosition() {
    pos = Math.floor((Math.random() * 70) + 1);
    return pos;
}

function countDown() {
    time += 1;
    var textTime = convertTime(time);
    $('.timer').text(textTime);
}
function convertTime(time) {
    var sec_num = time;
    var mill_sec = sec_num % 10;
    sec_num = sec_num / 10;
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = parseInt(sec_num - (hours * 3600) - (minutes * 60));
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return minutes + ':' + seconds + '.' + mill_sec;
}
function showButtonNext() {
    $(".btn-next").show();
}
function calculatorScore(timePlay) {

    var oldScore = sessionStorage.getItem("score");
    var newScore = parseInt(timePlay);
    if (oldScore != null) {
        newScore = parseInt(oldScore) + parseInt(timePlay);
    }
    sessionStorage.setItem("score", newScore);
}
function showUserInfo() {
    $(".wrapper").show();
    var username = sessionStorage.getItem("user");
    var lasttime = sessionStorage.getItem("score");
    if (lasttime != null) {
        var textTime = convertTime(lasttime);
        $(".last-time-play").text(textTime);
    } else {
        $(".last-time-play").text("0");
    }

    $(".get-name").remove();
    $(".username").text(username);

    if ($('#unileverStart').length >0)// homepage landing
        $('#unileverStart')[0].click();
}
function calculateResult(){
    //create new object store user score and name
    if (sessionStorage.getItem('user')!= null && sessionStorage.getItem('score') != null) {
        var obj = {
            name: sessionStorage.getItem('user'),
            score: 55
        };
        // console.log(obj);
        var jsonString = localStorage.getItem('top5');
        var top5Array = [];
        top5Array = JSON.parse(jsonString);
        if (top5Array == null) {
            top5Array = [];
            top5Array.push(obj);
            localStorage.setItem('rank',1);
        } else {
            var i = 0;
            for (i; i < top5Array.length; i++) {
                if (parseInt(obj.score) < parseInt(top5Array[i].score))
                    break;
            }
            localStorage.setItem('rank',i);
            top5Array.splice(i, 0, obj);
            if (top5Array.length > 5) {
                top5Array.splice(-1, 1);
            }
        }
        // console.log(top5Array);
        for (i = 0; i < top5Array.length; i++) {
            $('#rank' + (i + 1)).text(top5Array[i].name);
            $('#score' + (i + 1)).text(convertTime(top5Array[i].score));
        }
        jsonString = JSON.stringify(top5Array);
        localStorage.setItem('top5', jsonString);
    }
}
function clearRanking(){
    localStorage.removeItem('top5');
    $('td').text('');
    var rank = localStorage.getItem('rank');
    $('tr').attr('style','');
}
function rePlay(){
    // reset info for new user
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('score');
    window.location.href = "/";
}
function rightAnswer() {
    var nextLink = $(".btn-next").attr("href");
    clearInterval(countdown);
    calculatorScore(time);
    $(".message-right").html('<span style="color:green" >Bạn đã trả lời Đúng</span>');
    // show popup instead of jumping
    setTimeout(function () {
        // window.location.href = nextLink;
        $('.popup_overlay').css("display","block");
        $('#complete').attr("href",nextLink);
    }, 1500);
    if ($('#theEnd').length >0){
        calculateResult();
    }
}
function wrongAnser() {
    $(".message-answer").html('<span style="color:red" >Bạn đã trả lời Sai và bị công thêm 5s</span>');
    setTimeout(function () {
        $(".message-answer").html("");
    }, 1000);
    time = time + 50;
}
;
var img = 2;
var rightAnswerOmo = 4;
var gameOmo;
$(document).ready(function () {
    startGameOmo();
    $("body").on("click", ".icon-gif", function () {
        clearInterval(gameOmo);
        var answer=$(".image-omo").attr("data-rel");
        $(this).hide();
        if (answer == rightAnswerOmo) {
            rightAnswer();
        } else {
            wrongAnser();
        }
    });
    $("body").on("click", ".image-omo", function () {
        startGameOmo()
        $(".icon-gif").show();
    });
});
function startGameOmo() {
    gameOmo = setInterval(function () {
        $(".image-omo").attr("src", "/images/omo" + img + ".jpg");
        $(".image-omo").attr("data-rel", img);
        img++;
        if (img > 4) {
            img = 1;
        }
    }, 300);
}
;
//var time = 15;

var pos = 0;
$(document).ready(function () {
    var positionOmo = getPosition();
    $("#stock").css({
        "left": positionOmo + "%",
    });

    $("body").on("click", ".btn-submit", function () {
        var validator = $(".form-question").validate();
        if (validator.form()) {
            var answer = $("input[name='question']:checked").val();
            if (answer == answerRightOmo) {
                rightAnswer();
                $("#stock").removeClass("animation-stock");
                $("#stock").css({
                    "margin":"0 auto",
                    "left":0,
                    "right":0,
                });
            } else {
                wrongAnser();
            }
        } else {
            return;
        }
    });
});
function getPosition() {
    pos = Math.floor((Math.random() * 90) + 1);
    return pos;
}
;
var answerGame7 = 0;
$(document).ready(function () {
    $("body").on("click", ".game7", function () {
        var answer = $(this).attr("data-rel");
        console.log(answer);
        console.log(answerRightGame7);
        if (answerRightGame7.indexOf(answer)!= -1) {
            answerGame7++;
            $(this).fadeIn().remove();
            if(answerGame7==answerRightGame7.length) {
                showButtonNext();
                rightAnswer();
            }else{
                $(".message-right").html('<span style="color:green" >Bạn đã trả lời Đúng.Còn 1 đáp án nữa</span>');
                setTimeout(function(){
                    $(".message-right").html("");
                },1000);
            }
        } else {
            wrongAnser();
        }
    });

    //Sunlight
    $(".input-last").keyup(function () {
        var firstText = $(".input-first").val();
        var lastText = $(this).val();
        if (lastText.length >= 5) {
            var rightAnswerKnorr = ["thiên nhiên", "thien nhien", "thiên nhien", "thien nhiên"];
            var answer = firstText + " " + lastText;
            if (rightAnswerKnorr.indexOf(answer) != -1) {
                rightAnswer();
            } else {
                wrongAnser();
            }
        }
    });
});
function startGame7() {
    if ($(".game7").length != '') {
        $(".game7").each(function () {
            var position = getPosition();
            var ran = Math.floor(Math.random() * 3);
            var delay_1 = ran;
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
}
;
/**
 * Created by Nam Trung on 9/30/2016.
 */





;
