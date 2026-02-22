import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

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

export async function POST(request: NextRequest) {
  try {
    const created = []
    const existing = []

    for (const subject of subjects) {
      try {
        const result = await prisma.subject.upsert({
          where: { name: subject.name },
          update: {},
          create: subject,
        })
        created.push(result)
      } catch (error: any) {
        if (error.code === 'P2002') {
          // Unique constraint violation - subject already exists
          existing.push(subject.name)
        } else {
          throw error
        }
      }
    }

    return NextResponse.json({
      success: true,
      created: created.length,
      existing: existing.length,
      subjects: created,
    })
  } catch (error: any) {
    console.error('Error seeding subjects:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to seed subjects' },
      { status: 500 }
    )
  }
}
