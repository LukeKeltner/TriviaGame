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
		'Which creature is described as having a human head, torso and arms joined to a horse\'s body which may be any of several colours.  Being intelligent and capable of speech, it should not strictly speaking be termed a beast, but by its own request it has been classified as such by the Ministry of Magic?', 
		'Centaur', 
		['Squib', 'Muggle', 'Hungarian Horntail'], 
		'assets/images/ministryofmagic.jpg')

	var question2 = new question(
		'Which Quidditch team from Northern England was founded in 1612 and is known for their pale blue robes?',
		'Appleby Arrows',
		['Caerphilly Catapults', 'Chudley Cannons', 'Puddlemere United'],
		'assets/images/quidditch.png')

	var question3 = new question(
		"In 'The Tale of the Three Brothers' what does Death give the youngest brother?",
		'Death\'s own cloak',
		['A wand fashioned from a branch', 'A stone from the riverbank', 'Immortality'],
		'assets/images/death.jpg')

	var question4 = new question(
		'What did Ron see in the Mirror of Erised?',
		'Him being Head Boy and the Quidditch Captain',
		['His brothers admiring him', 'An perfect score on his O.W.L.s', 'He and Hermonie together'],
		'assets/images/mirror.jpg')

	var question5 = new question(
		'Dudley was very upset to learn that Harry must come to the zoo with him for his birthday.  At least Dudley had his best friend with him.  What is his name?',
		'Piers Polkiss',
		['Thomas Trinkle', 'Stewart Sursis', 'Richard Rhomlick'],
		'assets/images/dursleys.png')

	var question6 = new question(
		'Harry met Dobby for the first time in his bedroom. Whom did the Dursley\'s have over for dinner that same night?',
		'The Masons',
		['Aunt Marge', 'Mrs. Figg', 'Petunia Dursley\'s sister, Lily'],
		'assets/images/harrydobby.jpg')

	var question7 = new question(
		'At the beginning of their third year at Hogwarts, Ron glances over at Hermonie\'s class schedule and realizes she is scheduled for three different classes all at nine o\' clock.  What are these three classes?',
		'Divination, Muggle Studies, and Arithmancy',
		['Potions, Defense Against the Dark Arts, and Herbology', 'History of Magic, Potions, and Muggle Studies', 'Arithmancy, Potions, and Defense Against the Dark Arts'],
		'assets/images/hermione.jpg')



	var tick = new Audio('assets/sounds/tick.mp3')
	var maxQuestions;
	var questionsCompleted = 0;

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
		questionBank.push(question5)
		questionBank.push(question6)
		questionBank.push(question7)
		questionBank = shuffleArray(questionBank)
		maxQuestions = questionBank.length
	}

	var progressBar = $('.progress-bar')
	var progressWidth;
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
		var currentTime = 15
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
			tick.play()
			time.html(currentTime)

			if (currentTime === 0 && !freeze)
			{
				result.html('OUT OF TIME!')
				questionsWrong++;
				correctAnswer.html(newQuestion.rightAnswer)
				clearInterval(runClock)
				freeze = true
				questionsCompleted++;
				progressWidth = questionsCompleted/maxQuestions*100
				progressBar.css('width', progressWidth+'%')
		

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
		questionsCompleted = 0
		questionBank = []
		getQuestionBank()
		questionsLeft = questionBank.length	
	}

	$('.start').on('click', function()
	{ 
		progressBar.css('width', '0%')
		$('.initial').hide()
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
			questionsCompleted++;
			progressWidth = questionsCompleted/maxQuestions*100
			progressBar.css('width', progressWidth+'%')
	

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
			questionsCompleted++;
			progressWidth = questionsCompleted/maxQuestions*100
			progressBar.css('width', progressWidth+'%')
	
			
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
