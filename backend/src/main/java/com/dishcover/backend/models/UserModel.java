package com.dishcover.backend.models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="users", uniqueConstraints = {@UniqueConstraint(columnNames = {"username", "email"})})
public class UserModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 45, nullable = false)
    private String username;

    @Column(length = 100, nullable = false)
    @JsonIgnore
    private String password;

    @Column(length = 45, nullable = false)
    private String email;

    @Column(length = 45, nullable = true)
    private String firstName;

    @Column(length = 45, nullable = true)
    private String lastName;

    @Enumerated(EnumType.STRING)
    private RoleModel role;

    @Column
    private Boolean active;

    @OneToMany(mappedBy = "ownerId", cascade = CascadeType.PERSIST)
    @JsonIgnore
    private List<RecipeModel> recipesList;

    @OneToMany(mappedBy = "user", cascade = CascadeType.PERSIST)
    @JsonIgnore
    private List<CommentModel> commentsList;

    @OneToMany(mappedBy = "user", cascade = CascadeType.PERSIST)
    @JsonIgnore
    private List<ReportModel> reportsList;

    @ManyToMany(mappedBy = "username")
    @JsonIgnore
    private List<RecipeModel> recipesFavorite;

    @ManyToMany(mappedBy = "attendee")
    @JsonIgnore
    private List<EventModel> events;
}
