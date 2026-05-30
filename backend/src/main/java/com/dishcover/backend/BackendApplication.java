package com.dishcover.backend;

// Autor: Manuel García Nieto
// Punto de entrada principal del backend Spring Boot de DishCover.

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
        // Arranca el contexto de Spring Boot y expone la API REST.
		SpringApplication.run(BackendApplication.class, args);
        System.out.println("Hello from DishCover backend");
	}
}
