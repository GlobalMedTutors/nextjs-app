import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const subjects = [
  { name: 'Mathematics', description: 'Algebra, Calculus, Geometry, Statistics' },
  { name: 'Physics', description: 'Mechanics, Thermodynamics, Electromagnetism' },
  { name: 'Chemistry', description: 'Organic, Inorganic, Physical Chemistry' },
  { name: 'Biology', description: 'Cell Biology, Genetics, Anatomy, Physiology' },
  { name: 'Medicine', description: 'Medical School Prep, USMLE, MCAT' },
  { name: 'English', description: 'Literature, Writing, Grammar' },
  { name: 'History', description: 'World History, US History, European History' },
  { name: 'Computer Science', description: 'Programming, Data Structures, Algorithms' },
  { name: 'Spanish', description: 'Spanish Language and Literature' },
  { name: 'French', description: 'French Language and Literature' },
]

async function main() {
  console.log('Seeding subjects...')
  
  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { name: subject.name },
      update: {},
      create: subject,
    })
    console.log(`✓ ${subject.name}`)
  }
  
  console.log('✅ Subjects seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding subjects:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
