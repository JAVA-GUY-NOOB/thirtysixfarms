
package com.farmcity.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.farmcity.model.RiceProduct;
import com.farmcity.repository.RiceProductRepository;

@RestController
@RequestMapping("/api/rice-products")
@CrossOrigin(origins = "http://localhost:3000")
public class RiceProductController {
    private final RiceProductRepository riceProductRepository;

    public RiceProductController(RiceProductRepository riceProductRepository) {
        this.riceProductRepository = riceProductRepository;
    }

    @GetMapping
    public List<RiceProduct> getAll() {
        return riceProductRepository.findAll();
    }

    @GetMapping("/search")
    public List<RiceProduct> search(@org.springframework.web.bind.annotation.RequestParam(required = false) String q) {
        if (q == null || q.isBlank()) {
            return riceProductRepository.findAll();
        }
        return riceProductRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(q, q);
    }

    @GetMapping("/category/{category}")
    public List<RiceProduct> byCategory(@PathVariable String category) {
        return riceProductRepository.findByCategoryIgnoreCase(category);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RiceProduct> getById(@PathVariable Long id) {
        return riceProductRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<RiceProduct> create(@RequestBody RiceProduct product) {
        if (product == null || product.getName() == null || product.getPrice() == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(riceProductRepository.save(product));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RiceProduct> update(@PathVariable Long id, @RequestBody RiceProduct update) {
        return riceProductRepository.findById(id)
                .map(existing -> {
                    existing.setName(update.getName() != null ? update.getName() : existing.getName());
                    existing.setDescription(update.getDescription() != null ? update.getDescription() : existing.getDescription());
                    existing.setPrice(update.getPrice() != null ? update.getPrice() : existing.getPrice());
                    existing.setImageUrl(update.getImageUrl() != null ? update.getImageUrl() : existing.getImageUrl());
                    existing.setAvailable(update.getAvailable() != null ? update.getAvailable() : existing.getAvailable());
                    return ResponseEntity.ok(riceProductRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable Long id) {
        return riceProductRepository.findById(id)
                .map(existing -> {
                    riceProductRepository.delete(existing);
                    Map<String, Object> resp = new HashMap<>();
                    resp.put("deleted", true);
                    return ResponseEntity.ok(resp);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/seed")
    public List<RiceProduct> seedProducts() {
        if (riceProductRepository.count() > 0) {
            return riceProductRepository.findAll();
        }
        RiceProduct p1 = new RiceProduct();
        p1.setName("Premium Basmati Rice");
        p1.setCategory("Premium");
        p1.setDescription("Aromatic long-grain rice, perfect for biryani.");
        p1.setPrice(1200.0);
        p1.setImageUrl("https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80");
        p1.setAvailable(true);

        RiceProduct p2 = new RiceProduct();
        p2.setName("Organic Brown Rice");
        p2.setCategory("Healthy");
        p2.setDescription("Healthy whole-grain rice, rich in fiber.");
        p2.setPrice(800.0);
        p2.setImageUrl("https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80");
        p2.setAvailable(true);

        riceProductRepository.save(p1);
        riceProductRepository.save(p2);
        return riceProductRepository.findAll();
    }
}
