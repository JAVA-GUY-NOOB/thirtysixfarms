
package com.farmcity.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.farmcity.model.RiceProduct;
import com.farmcity.repository.RiceProductRepository;


@RestController
@RequestMapping("/api/rice-products")
public class RiceProductController {
    @Autowired
    private RiceProductRepository riceProductRepository;

    @GetMapping
    public List<RiceProduct> getAll() {
        return riceProductRepository.findAll();
    }

    @PostMapping("/seed")
    public List<RiceProduct> seedProducts() {
        RiceProduct p1 = new RiceProduct();
        p1.setName("Premium Basmati Rice");
        p1.setDescription("Aromatic long-grain rice, perfect for biryani.");
        p1.setPrice(1200.0);
        p1.setImageUrl("https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80");
        p1.setAvailable(true);

        RiceProduct p2 = new RiceProduct();
        p2.setName("Organic Brown Rice");
        p2.setDescription("Healthy whole-grain rice, rich in fiber.");
        p2.setPrice(800.0);
        p2.setImageUrl("https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80");
        p2.setAvailable(true);

        riceProductRepository.save(p1);
        riceProductRepository.save(p2);
        return riceProductRepository.findAll();
    }
}
