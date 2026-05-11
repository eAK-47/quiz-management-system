package com.amrita.quiz_system.Model;



import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import java.util.ArrayList;

@Entity
@Data
public class Quiz {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;

    // Aggregation
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "quiz_id")
    private List<Question> questions = new ArrayList<>();

    // Composition
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "result_quiz_id")
    private List<Result> results = new ArrayList<>();
}
