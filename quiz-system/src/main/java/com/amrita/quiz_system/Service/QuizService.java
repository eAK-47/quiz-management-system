package com.amrita.quiz_system.Service;

import com.amrita.quiz_system.Model.*;
import com.amrita.quiz_system.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    // Logic for: "Automatic evaluation of scores"
    public Result evaluateQuiz(Long quizId, String studentName, List<Integer> studentChoices) {
        Quiz quiz = quizRepository.findById(quizId).orElseThrow(() -> new RuntimeException("Quiz not found"));
        int score = 0;
        List<Question> questions = quiz.getQuestions();

        // Loop: "for each Question q in questions" from your sequence diagram
        for (int i = 0; i < questions.size(); i++) {
            Question q = questions.get(i);

            if (q.getCorrectOption() == studentChoices.get(i)) {
                score++;
            }
        }


        Result result = new Result();
        result.setStudentName(studentName);
        result.setScore(score);
        result.setTotalMarks(questions.size());

        // Composition: "Results are strongly tied to the Quiz"
        quiz.getResults().add(result);
        quizRepository.save(quiz);

        return result;
    }
}