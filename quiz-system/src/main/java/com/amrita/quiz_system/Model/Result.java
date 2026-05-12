package com.amrita.quiz_system.Model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Result {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    private String studentName;
    private int score;
    private int totalMarks;
}