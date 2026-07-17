package com.reelline.config;

import com.reelline.entity.Organization;
import com.reelline.entity.Project;
import com.reelline.entity.User;
import com.reelline.repository.OrganizationRepository;
import com.reelline.repository.ProjectRepository;
import com.reelline.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final ProjectRepository projectRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Only initialize if no organizations exist
        if (organizationRepository.count() > 0) {
            log.info("✅ Database already has data, skipping initialization");
            return;
        }

        log.info("🚀 Initializing test data...");

        // Create organization
        Organization org = Organization.builder()
                .name("ReelLine Studios")
                .slug("reelline-studios")
                .email("contact@reelline.io")
                .phone("+91 98765 43210")
                .address("123 Film City Road")
                .city("Hyderabad")
                .state("Telangana")
                .country("India")
                .plan(Organization.Plan.PREMIUM)
                .build();
        org = organizationRepository.save(org);
        log.info("✅ Created organization: {}", org.getName());

        // Create users with proper BCrypt password hashing
        User owner = createUser(org, "Aarav Kapoor", "aarav@reelline.io", "password123",
                User.Role.OWNER, "#2563EB", "AK");

        User manager = createUser(org, "Maya Singh", "maya@reelline.io", "password123",
                User.Role.MANAGER, "#7C3AED", "MS");

        User dataCopy = createUser(org, "Rohan Verma", "rohan@reelline.io", "password123",
                User.Role.DATA_COPY, "#22C55E", "RV");

        User lightroom = createUser(org, "Ishita Patel", "ishita@reelline.io", "password123",
                User.Role.LIGHTROOM, "#F59E0B", "IP");

        User video = createUser(org, "Vikram Shah", "vikram@reelline.io", "password123",
                User.Role.VIDEO, "#EF4444", "VS");

        User album = createUser(org, "Anaya Roy", "anaya@reelline.io", "password123",
                User.Role.ALBUM, "#06B6D4", "AR");

        User editor = createUser(org, "Dev Mehta", "dev@reelline.io", "password123",
                User.Role.EDITOR, "#EC4899", "DM");

        log.info("✅ Created 7 team members");

        // Create sample projects
        createProject(org, manager, "PRJ-2841", "Sharma & Patel Wedding", "Rohan Sharma",
                LocalDate.of(2026, 7, 18), Project.Status.ACTIVE, Project.Stage.LIGHTROOM,
                Project.Priority.HIGH, new BigDecimal("28500"), 68, "WEDDING");

        createProject(org, manager, "PRJ-2840", "Apex Tech Annual Summit", "Apex Technologies",
                LocalDate.of(2026, 7, 22), Project.Status.ACTIVE, Project.Stage.VIDEO,
                Project.Priority.URGENT, new BigDecimal("42000"), 45, "CORPORATE");

        createProject(org, manager, "PRJ-2839", "Kapoor Family Portrait", "Anjali Kapoor",
                LocalDate.of(2026, 7, 15), Project.Status.COMPLETED, Project.Stage.DELIVERY,
                Project.Priority.MEDIUM, new BigDecimal("9800"), 100, "PORTRAIT");

        createProject(org, manager, "PRJ-2838", "Vogue Editorial — Spring", "Vogue India",
                LocalDate.of(2026, 7, 25), Project.Status.DELAYED, Project.Stage.DATA_COPY,
                Project.Priority.HIGH, new BigDecimal("65000"), 22, "FASHION");

        createProject(org, manager, "PRJ-2837", "Mehta Wedding — Goa", "Sahil Mehta",
                LocalDate.of(2026, 8, 2), Project.Status.ACTIVE, Project.Stage.MANAGER,
                Project.Priority.MEDIUM, new BigDecimal("38000"), 15, "WEDDING");

        createProject(org, manager, "PRJ-2836", "Lumen Studios Launch", "Lumen Studios",
                LocalDate.of(2026, 7, 30), Project.Status.REVIEW, Project.Stage.ALBUM,
                Project.Priority.MEDIUM, new BigDecimal("22000"), 82, "CORPORATE");

        createProject(org, manager, "PRJ-2835", "Gupta Engagement Ceremony", "Nidhi Gupta",
                LocalDate.of(2026, 7, 12), Project.Status.ACTIVE, Project.Stage.EDITOR,
                Project.Priority.LOW, new BigDecimal("12500"), 90, "EVENT");

        createProject(org, manager, "PRJ-2834", "Redwood Charity Gala", "Redwood Foundation",
                LocalDate.of(2026, 8, 10), Project.Status.LOCKED, Project.Stage.DATA_COPY,
                Project.Priority.LOW, new BigDecimal("18000"), 0, "EVENT");

        log.info("✅ Created 8 sample projects");
        log.info(" Test data initialization complete!");
        log.info("");
        log.info("📧 Login Credentials:");
        log.info("   Owner:        aarav@reelline.io / password123");
        log.info("   Manager:      maya@reelline.io / password123");
        log.info("   Data Copy:    rohan@reelline.io / password123");
        log.info("   Lightroom:    ishita@reelline.io / password123");
        log.info("   Video:        vikram@reelline.io / password123");
        log.info("   Album:        anaya@reelline.io / password123");
        log.info("   Editor:       dev@reelline.io / password123");
    }

    private User createUser(Organization org, String name, String email, String password,
                           User.Role role, String color, String initials) {
        User user = User.builder()
                .organization(org)
                .name(name)
                .email(email)
                .passwordHash(passwordEncoder.encode(password))
                .role(role)
                .status(User.Status.ACTIVE)
                .color(color)
                .initials(initials)
                .emailVerified(true)
                .build();
        return userRepository.save(user);
    }

    private Project createProject(Organization org, User manager, String code, String name,
                                 String client, LocalDate eventDate, Project.Status status,
                                 Project.Stage stage, Project.Priority priority,
                                 BigDecimal quotation, int progress, String type) {
        Project project = Project.builder()
                .organization(org)
                .code(code)
                .name(name)
                .client(client)
                .eventDate(eventDate)
                .status(status)
                .currentStage(stage)
                .priority(priority)
                .manager(manager)
                .quotation(quotation)
                .progress(progress)
                .type(Project.Type.valueOf(type))
                .createdBy(manager)
                .build();
        return projectRepository.save(project);
    }
}
