# Seeding Subjects

## Automatic Seeding

Subjects are **automatically seeded** when:
- An instructor visits the onboarding page
- No subjects exist in the database
- The page will automatically call `/api/subjects/seed` to add default subjects

## Default Subjects

The following subjects are automatically added:
1. Mathematics
2. Physics
3. Chemistry
4. Biology
5. Medicine
6. English
7. History
8. Computer Science
9. Spanish
10. French

## Manual Seeding (Optional)

If you need to manually seed subjects, you can:

### Via API (requires authentication):
```bash
curl -X POST https://global-med-tutors.vercel.app/api/subjects/seed
```

### Via Database:
Connect to your Neon database and run:
```sql
INSERT INTO "Subject" (id, name, description) VALUES
(gen_random_uuid(), 'Mathematics', 'Algebra, Calculus, Geometry, Statistics'),
(gen_random_uuid(), 'Physics', 'Mechanics, Thermodynamics, Electromagnetism'),
(gen_random_uuid(), 'Chemistry', 'Organic, Inorganic, Physical Chemistry'),
(gen_random_uuid(), 'Biology', 'Cell Biology, Genetics, Anatomy, Physiology'),
(gen_random_uuid(), 'Medicine', 'Medical School Prep, USMLE, MCAT'),
(gen_random_uuid(), 'English', 'Literature, Writing, Grammar'),
(gen_random_uuid(), 'History', 'World History, US History, European History'),
(gen_random_uuid(), 'Computer Science', 'Programming, Data Structures, Algorithms'),
(gen_random_uuid(), 'Spanish', 'Spanish Language and Literature'),
(gen_random_uuid(), 'French', 'French Language and Literature')
ON CONFLICT (name) DO NOTHING;
```

## Notes

- Subjects are only created if they don't already exist (using `upsert`)
- The seeding is idempotent - safe to run multiple times
- Subjects are required for instructor onboarding
