package com.amrita.quiz_system.Model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Arrays;
import java.util.List;

@Entity
@Data
public class Question {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String questionText;

    // Four separate columns instead of String[] (H2 does not support arrays natively)
    private String option1;
    private String option2;
    private String option3;
    private String option4;

    private int correctOption;

    /**
     * Returns options as a List for JSON serialization.
     * The frontend app.js reads q.options[i] — this method satisfies that.
     */
    public List<String> getOptions() {
        return Arrays.asList(option1, option2, option3, option4);
    }

    /**
     * Accepts the "options" array from the frontend publishQuiz() payload
     * and maps each element to the four separate DB columns.
     */
    public void setOptions(List<String> options) {
        if (options != null && options.size() >= 4) {
            this.option1 = options.get(0);
            this.option2 = options.get(1);
            this.option3 = options.get(2);
            this.option4 = options.get(3);
        }
    }

    public boolean checkAnswer(int selectedOption) {
        return this.correctOption == selectedOption;
    }
}
