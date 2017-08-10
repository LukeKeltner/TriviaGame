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

	var shuffleArray = function(array)
	{
		var result = []

		for (var i=0; i<array.length; i++)
		{
			var r = Math.floor(Math.random()*array.length)
			result.push(array[r])
			array.splice(r, 1)
			i = i - 1
		}		

		return result
	}

	var getQuestionBank = function()
	{
		questionBank.push(question1)
		questionBank.push(question2)
		questionBank.push(question3)
		questionBank.push(question4)
		questionBank = shuffleArray(questionBank)
	}

	var questionBank = []
	getQuestionBank()
	var time = $('.time')
	var result = $('.result')
	var correctAnswer = $('.correctAnswer')
	var wins = $('.wins')
	var losses = $('.losses')
	var runClock;
	var waitForNewQuestion;
	var questionsCorrect = 0
	var questionsWrong = 0
	var currentQuestion;
	var questionsLeft = questionBank.length
	var freeze = false;

	var run = function(newQuestion)
	{
		console.log("counting this question, you have "+questionsLeft+" left")
		questionBank.splice(0,1)
		console.log("Questions left "+questionBank)
		questionsLeft = questionsLeft - 1
		currentQuestion = newQuestion
		clearInterval(waitForNewQuestion)
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

			potentialAnswers = shuffleArray(potentialAnswers)

			for (var i=0; i<potentialAnswers.length; i++)
			{
				$("."+i+"").html(potentialAnswers[i])
			}
		}

		var countDown = function()
		{
			currentTime = currentTime - 1;
			time.html(currentTime)

			if (currentTime === 0 && !freeze)
			{
				result.html('OUT OF TIME!')
				questionsWrong++;
				correctAnswer.html(newQuestion.rightAnswer)
				clearInterval(runClock)
				freeze = true

				if (questionsLeft !== 0)
				{
					waitForNewQuestion = setInterval(userGuessed, 2000)
				}

				else
				{
					waitForNewQuestion = setInterval(done, 2000)
				}
			}
		}

		getNewQuestion(newQuestion)
		runClock = setInterval(countDown, 1000)
	}

	var userGuessed = function()
	{
		result.html("")
		correctAnswer.html("")
		freeze = false
		run(questionBank[0])	
	}

	var done = function()
	{
		freeze = false
		clearInterval(waitForNewQuestion)
		var percent = Math.round(questionsCorrect/(questionsCorrect+questionsWrong)*100)
		$('.start').show()
		$('.game-board').hide()
		$('.how-you-did').show()
		$('.percent').html(percent+"%")
		result.html("")
		correctAnswer.html("")
		wins.html(questionsCorrect)
		losses.html(questionsWrong)
		questionsCorrect  = 0
		questionsWrong = 0
		questionBank = []
		getQuestionBank()
		questionsLeft = questionBank.length	
	}

	$('.start').on('click', function()
	{ 
		$('.how-you-did').hide()
		$('.game-board').show()
		$('.start').hide()
		run(questionBank[0])
	})

	$('.answer-group').on('click', function()
	{
		var usersPick = event.srcElement.textContent

		if (usersPick === currentQuestion.rightAnswer && !freeze)
		{
			result.html('CORRECT!')
			questionsCorrect++;
			clearInterval(runClock)
			freeze = true

			if (questionsLeft !== 0)
			{
				waitForNewQuestion = setInterval(userGuessed, 2000)
			}

			else
			{
				waitForNewQuestion = setInterval(done, 2000)
			}
		}

		else if(!freeze)
		{
			result.html('WRONG!')
			questionsWrong++;
			correctAnswer.html(currentQuestion.rightAnswer)
			clearInterval(runClock)
			freeze = true
			
			if (questionsLeft !== 0)
			{
				waitForNewQuestion = setInterval(userGuessed, 2000)
			}

			else
			{
				waitForNewQuestion = setInterval(done, 2000)
			}
		}
	})
});
