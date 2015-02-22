// ==UserScript==
// @name        ESPN Poll Colors
// @namespace   espnpollcolors
// @include     http://espn.go.com/espn/fp/flashPollResultsState*
// @version     1
// @grant       none
// ==/UserScript==

(function ($) {
  var pollId = window.location.href.match(/pollId=(\d*)/)[1],
      pollDataPath = 'http://partners.sodahead.com/api/polls/' + pollId + '/?ext=geo-us&jsonp=window.setOpacities';

  window.sumVotes = function () {
    return Array.prototype.slice.call(arguments, 0).reduce(function(prev, curr) {
      return prev + curr;
    });
  };

  window.calculateOpacity = function (votesArray) {
    var max = Math.max.apply(null, votesArray),
        total = window.sumVotes.apply(null, votesArray);

    return max / total;
  };

  window.setOpacities = function (data) {
    var $regions = window.jQuery('[data-code]');

    $regions.each(function () {
      var $this = $(this),
          code = $this.data('code').split('-'),
          codePrefix = code[0], 
          codeSuffix = code[1],
          results = codeSuffix ? data['poll']['geo'][codePrefix][codeSuffix] : data['poll']['geo'][codePrefix],
          votes = [],
          opacity;

      for (var answerId in results) {
        votes.push(results[answerId]);
      }

      opacity = window.calculateOpacity(votes);

      $this.css('opacity', opacity);
    });
  };

  function getPollResults() {
    $.getScript(pollDataPath);
  }

  $(window).load(getPollResults);
}(window.jQuery));