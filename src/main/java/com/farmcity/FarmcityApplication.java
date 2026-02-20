
package com.farmcity;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = {"com.farmcity.entity", "com.farmcity.model"})
public class FarmcityApplication {
    public static void main(String[] args) {
        SpringApplication.run(FarmcityApplication.class, args);
    }
}
