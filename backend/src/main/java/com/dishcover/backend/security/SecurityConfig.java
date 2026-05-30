package com.dishcover.backend.security;

// Autor: Manuel García Nieto
// Configuración de autenticación del backend con usuarios de base de datos y BCrypt.

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.dishcover.backend.models.UserModel;
import com.dishcover.backend.repositories.IUserRepository;


import java.util.Optional;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private IUserRepository userRepository;

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder = 
        http.getSharedObject(AuthenticationManagerBuilder.class);
    
        authenticationManagerBuilder
        .userDetailsService(userDetailsService())
        .passwordEncoder(passwordEncoder());
    
        return authenticationManagerBuilder.build();
    }

     @Bean
    public AuthenticationProvider authenticationProvider()
    {
        DaoAuthenticationProvider authenticationProvider= new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService());
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return authenticationProvider;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            // Spring Security carga el usuario desde MySQL para validar credenciales.
            Optional<UserModel> user = userRepository.findByUsername(username);
            UserModel foundUser = user.orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

            return org.springframework.security.core.userdetails.User
                    .withUsername(foundUser.getUsername())
                    .password(foundUser.getPassword()).authorities(new SimpleGrantedAuthority("ROLE_" + foundUser.getRole()))
                    .build();
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
