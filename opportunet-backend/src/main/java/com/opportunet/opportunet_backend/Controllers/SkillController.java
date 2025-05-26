package com.opportunet.opportunet_backend.Controllers;

import com.opportunet.opportunet_backend.Entities.Skill;
import com.opportunet.opportunet_backend.Services.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillController {
    @Autowired
    private SkillService skillService;

    @GetMapping
    public List<Skill> getAllSkills() {
        return skillService.getAllSkills();
    }

    @PostMapping
    public Skill createSkill(@RequestBody Skill skill) {
        return skillService.createSkill(skill);
    }
}