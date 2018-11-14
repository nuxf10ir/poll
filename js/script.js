_.templateSettings = {
    evaluate: /\{\[([\s\S]+?)\]\}/g,
    interpolate: /\{\{([\s\S]+?)\}\}/g
};

var $voteContainer = $("#fd-vote__content");
var loaderTmpl = _.template($("#loader_tmpl").html());
var voteTmpl = _.template($("#vote_tmpl").html());
var resultTmpl = _.template($("#results_tmpl").html());
var pollId = null;


/*

jQuery.fn.cardGame = function(data) {
    var $self = $(this),
        questionsData = gameData.questionsData,
        answersData = gameData.answersData,
        $card = $("#card", $self),
        $front = $("#card-front", $card),
        $back = $("#card-back", $card),
        questionTmpl = _.template($("#question__tmpl").html()),
        answerTmpl = _.template($("#answer__tmpl").html()),
        finishTmpl = _.template($("#finish__tmpl").html());

    $card.flip({
        trigger: 'manual',
        axis: 'y'
    });

    $card.on("click.cardGame", ".js-to-question", function(e) {
        var $this = $(e.currentTarget),
            questionId = $this.data("question");

        if (questionId === -1) {
            $front.html(finishTmpl(_.extend(questionsData[questionId], {id: questionId})));
        } else {
            $front.html(questionTmpl(_.extend(questionsData[questionId], {id: questionId})));
        }


        $card.flip(false);

    });

    $card.on("click.cardGame", ".js-to-answer", function(e) {
        var $this = $(e.currentTarget),
            questionId = $this.data("question");
            answerId = $this.data("answer");

        $back.html(answerTmpl(answersData[questionId][answerId]));
        $card.flip(true);
    });


    return {
        init: function () {
            setTimeout(function () {
                $card.flip(true);
            }, 1000);
        }
    }


};*/


$voteContainer.html(loaderTmpl());

$.ajax({
        method: "GET",
        url: "https://voice.fd.ru/api/get-poll.php",
    })
    .done(function(response) {
        $voteContainer.html(voteTmpl(response));
        pollId = response['pollId'] || null;
    })
    .fail(function() {

    })
    .always(function() {

    });

$voteContainer.on('click', '.js-send-answer', function (event) {

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
        .done(function(response) {
            console.log(response);
        })
        .fail(function() {

        })
        .always(function() {

        });
});






