let timerFlag = 0
let testDuration = 60
let actualText

// Fetch text from test_text.json and start test
function start_test(duration) {
	$(".duration-card").addClass('d-none')
	$.get('test_text.json', function(response) {
		actualText = response["easy"].split(" ")
		$('.test-text').text(response["easy"])
	})
	$(".test-card").removeClass('d-none')
	$("#base-timer-label").text(`${formatTime(duration)}`)
	testDuration = duration
}

// Verify text and calculate score
function displayScore() {
	var typedText = $("#text").val().split(" ")
	let score = 0, right = 0, wrong = 0
	for(var i = 0; i < typedText.length; i++) {
		actualText[i] == typedText[i] ? right++ : wrong++
	}
	score = (right * 10) - (wrong * 5)
	$("#right").text(right)
	$("#wrong").text(wrong)
	$("#score").text(score)
	$("#scoreModal").modal('show')
	$("#accuracy").text(`${right/(right + wrong)*100}%`)
	saveScore(score)
}

function saveScore(score) {
	let scores = localStorage.getItem('score')
	let scoreList = scores ? JSON.parse(scores) : ["-"]
	$('#score-list').html(`<div class="prev-score">Previous Scores:</div>`)
	for(var i=0; i < scoreList.length; i++) {
		$('#score-list').append(`<div class="text-primary mx-2">${scoreList[i]}</div>`)
	}
	if(scoreList.length > 2)
		scoreList.shift()
	scoreList.push(score)
	localStorage.setItem('score', JSON.stringify(scoreList))
}

$('body')
.ready(function() {
	$(".selectpicker").selectpicker()
})
.on("click", "#start-test", function() {
	start_test($("#select-time").val())
})
.on("keydown", "#text", function() {
	if(!timerFlag) {
		timerFlag = 1
		startTimer(Number(testDuration))
	}
})
.on("hidden.bs.modal", "#scoreModal", function() {
	$(".duration-card").removeClass('d-none')
	$("#text").val('')
	$(".test-card").addClass('d-none')
	timerFlag = 0
}).on("click", "#close-modal", function() {
	$("#scoreModal").modal('hide')
})

