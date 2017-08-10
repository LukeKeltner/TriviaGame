$(document).ready(function() 
{
	function question(questionText, rightAnswer, wrongAnswers, pic)
	{
		this.questionText = questionText
		this.rightAnswer = rightAnswer
		this.wrongAnswers = wrongAnswers
		this.pic = pic
	}

	var question1 = new question(
		'Here is the questions! Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah Blah', 
		'Corrent Answer', 
		['wrong 1', 'wrong 2', 'wrong 3'], 
		'http://i.ndtvimg.com/i/2017-01/woman-illusion_650x400_61484043713.jpg')

	var question2 = new question(
		'Here is a second question!',
		'Here is the CORRECT answer to 2',
		['wrong 12', 'wrong 22', 'wrong 32'],
		'http://images5.fanpop.com/image/photos/30900000/beautiful-pic-different-beautiful-pictures-30958251-500-313.jpg')

	var question3 = new question(
		'Here is number 3',
		'the correct answer to 3!',
		['wrongggg', 'wrosdsdf', 'svsdv dfg'],
		'http://www.abc.net.au/news/image/7369752-16x9-940x529.jpg')

	var question4 = new question(
		'Here is number 4',
		'the correct answer to 4!',
		['wrongsdfsdfsdfggg', 'wrosdfsdfsddsdf', 'svssdfsdfdv dfsdfsdfsdfg'],
		'https://pbs.twimg.com/profile_images/378800000748859587/289a592b2989b6f2dabb76db7fc25947_400x400.jpeg')

	var questionBank = []
	questionBank.push(question1)
	questionBank.push(question2)
	questionBank.push(question3)
	questionBank.push(question4)
	var time = $('.time')
	var result = $('.result')
	var correctAnswer = $('.correctAnswer')
	var wins = $('.wins')
	var losses = $('.losses')
	var runClock;
	var waitForNewQuestion;
	var questionsCorrect = 0
	var questionsWrong = 0

	var run = function(newQuestion)
	{
		clearInterval(waitForNewQuestion)
		console.log(questionBank)
		var currentTime = 10
		time.html(currentTime)

		var getNewQuestion = function(question)
		{
			$('.question').html(question.questionText)
			$('img').attr('src', question.pic)
			getPotentialAnswers(question)
		}

		var getPotentialAnswers = function(question)
		{
			var potentialAnswers = []
			var potentialAnswersShuffled = []

			potentialAnswers.push(question.rightAnswer)
			for (var i=0; i<question.wrongAnswers.length; i++)
			{
				potentialAnswers.push(question.wrongAnswers[i])
			}

			for (var i=0; i<potentialAnswers.length; i++)
			{
				var r = Math.floor(Math.random()*potentialAnswers.length)
				potentialAnswersShuffled.push(potentialAnswers[r])
				potentialAnswers.splice(r, 1)
				i = i - 1
			}

			for (var i=0; i<potentialAnswersShuffled.length; i++)
			{
				$("."+i+"").html(potentialAnswersShuffled[i])
			}
		}

		var countDown = function()
		{
			currentTime = currentTime - 1;
			time.html(currentTime)
			console.log(currentTime)

			if (currentTime === 0)
			{
				result.html('OUT OF TIME!')
				questionsWrong++;
				correctAnswer.html(newQuestion.rightAnswer)
				losses.html(questionsWrong)
				clearInterval(runClock)

				waitForNewQuestion = setInterval(function()
				{
					run(questionBank[0])
				}, 3000)
			}

		}

		getNewQuestion(newQuestion)

		$('.answer-group').on('click', function()
		{
			var usersPick = event.srcElement.textContent
			console.log("The correct answer is "+newQuestion.rightAnswer)

			if (usersPick === newQuestion.rightAnswer)
			{
				result.html('CORRECT!')
				questionsCorrect++;
				wins.html(questionsCorrect)
				clearInterval(runClock)

				waitForNewQuestion = setInterval(function()
				{
					run(questionBank[0])
				}, 3000)

			}

			else
			{
				result.html('WRONG!')
				questionsWrong++;
				correctAnswer.html(newQuestion.rightAnswer)
				losses.html(questionsWrong)
				clearInterval(runClock)
				
				waitForNewQuestion = setInterval(function()
				{
					run(questionBank[0])
				}, 3000)
			}
		})

		runClock = setInterval(countDown, 1000)
		questionBank.splice(0,1)
	}

	console.log(questionBank)
	run(questionBank[0])
	console.log("DO I SEE THIS MORE THAN ONCE!?")
});
