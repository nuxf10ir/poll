_.templateSettings = {
    evaluate: /\{\[([\s\S]+?)\]\}/g,
    interpolate: /\{\{([\s\S]+?)\}\}/g
};

var $voteContentContainer = $("#fd-vote__content");
var $voteActionsContainer = $("#fd-vote__actions");

var loaderTmpl = _.template($("#loader_tmpl").html());
var voteInfoTmpl = _.template($("#vote-info_tmpl").html());
var voteActionsTmpl = _.template($("#vote-actions_tmpl").html());
var voteResultTmpl = _.template($("#vote-results_tmpl").html());

var pollId = null;

$(function() {


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
            })
            .fail(function () {

            })
            .always(function () {

            });
    });

});





