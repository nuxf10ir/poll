_.templateSettings = {
    evaluate: /\{\[([\s\S]+?)\]\}/g,
    interpolate: /\{\{([\s\S]+?)\}\}/g
};

var $voteContentContainer = $("#fd-vote__content");
var $voteActionsContainer = $("#fd-vote__actions");
var $voteCountdownTimer = $("#fd-vote__countdown");

var loaderTmpl = _.template($("#loader_tmpl").html());
var voteInfoTmpl = _.template($("#vote-info_tmpl").html());
var voteActionsTmpl = _.template($("#vote-actions_tmpl").html());
var voteResultTmpl = _.template($("#vote-results_tmpl").html());
var countdownTmpl = _.template($("#countdown_tmpl").html());

var daysTitles = ['день', 'дня', 'дней'];
var hoursTitles = ['час', 'часа', 'часов'];
var minutesTitles = ['минуту', 'минуты', 'минут'];

var pollId = null;

function getTimeRemaining(endtime) {
    var t = Date.parse(endtime) - Date.parse(new Date());
    var seconds = Math.floor( (t/1000) % 60 );
    var minutes = Math.floor( (t/1000/60) % 60 );
    var hours = Math.floor( (t/(1000*60*60)) % 24 );
    var days = Math.floor( t/(1000*60*60*24) );
    return {
        'total': t,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    };
}

function initializeClock(endtime){
    var timeinterval = setInterval(function() {

        var t = getTimeRemaining(endtime);

        $voteCountdownTimer.html(countdownTmpl(getTimeRemaining(endtime)));

        if (t.total <= 0) {
            clearInterval(timeinterval);
        }

    }, 1000);
}

function plural(n,f) {n%=100;if(n>10&&n<20)return f[2];n%=10;return f[n>1&&n<5?1:n==1?0:2]};

$(function() {

    initializeClock(new Date(2018, 10, 22, 11));

    $voteContentContainer.html(loaderTmpl());

    $.ajax({
        method: "GET",
        url: "https://voice.fd.ru/api/get-poll.php",
    })
        .done(function (response) {
            $voteContentContainer.html(voteInfoTmpl(response));
            $voteActionsContainer.html(voteActionsTmpl(response));
            pollId = response['pollId'] || null;
        })
        .fail(function () {

        })
        .always(function () {

        });

    $voteActionsContainer.on('click.FDVote', '.js-send-answer', function (event) {

        $voteActionsContainer.off('click.FDVote');

        var answerId = $(event.target).data('answer');

        if (!pollId) {
            return false;
        }

        $.ajax({
            method: "POST",
            url: "https://voice.fd.ru/api/set-poll.php",
            data: {
                answerId: answerId,
                pollId: pollId
            }
        })
            .done(function (response) {
                $voteActionsContainer.html(voteResultTmpl(response));
                $voteCountdownTimer.removeClass('hidden');
            })
            .fail(function () {

            })
            .always(function () {

            });
    });

});





