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


    private String option1;
    private String option2;
    private String option3;
    private String option4;

    private int correctOption;


    public List<String> getOptions() {
        return Arrays.asList(option1, option2, option3, option4);
    }


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
