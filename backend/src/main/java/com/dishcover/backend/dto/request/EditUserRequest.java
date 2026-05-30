package com.dishcover.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class EditUserRequest {

    private String username;
    private String password;
    private String email;
    private String firstName;
    private String lastName;
    private boolean active;
    private String role;

}