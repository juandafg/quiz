var models =  require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
    models.Quiz.find(quizId)
        .then(function(quiz) {
            if (quiz) {
                req.quiz = quiz;
                next();
            }
            else {
                next(new Error('No existe quizId '+ quizId));
            }
        })
        .catch(function(error) {
            next(error);
        })
    ;
};

// GET /quizes

exports.index = function(req, res) {  
/*
  var options = {};
  if(req.user){
    options.where = {UserId: req.user.id}
  }
*/  
  models.Quiz.findAll().then(
    function(quizes) {
      res.render('quizes/index.ejs', {quizes: quizes, errors: []});
    }
  ).catch(function(error){next(error)});
};


// GET /quizes/:id
exports.show = function(req, res) {
	res.render('quizes/show', {quiz: req.quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer = function(req, res){
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};


exports.new = function(req, res, next) {
    var quiz = models.Quiz.build({
        pregunta: "Pregunta",
        respuesta: "Respuesta"
    });
    res.render('quizes/new', {quiz: quiz, errors: []});
}

exports.create = function(req, res, next) {
    var quiz = models.Quiz.build(req.body.quiz);
    quiz.validate()
        .then(function(err) {
            if (err) {
                console.log(err);
                res.render('/quizes/new', {quiz: quiz, errors: err.errors});
            }
            else {
                quiz
                    .save({fields: ["pregunta", "respuesta"]})
                    .then(function(){
                        res.redirect('/quizes');
                    })
                ;    
            }
        })
    ;
};

// GET /author	
exports.author = function(req, res) {
	res.render('author');
};