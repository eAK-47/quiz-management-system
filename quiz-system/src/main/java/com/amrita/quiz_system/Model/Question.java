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

    public boolean checkAnswer(int selectedOption) {
        return this.correctOption == selectedOption;
    }
}
