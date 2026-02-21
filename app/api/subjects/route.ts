import { NextRequest, NextResponse } from 'next/server'
import { getAllSubjects, findSubjectById } from '@/lib/services/subject'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (id) {
      const subject = await findSubjectById(id)
      if (!subject) {
        return NextResponse.json({ error: 'Subject not found' }, { status: 404 })
      }
      return NextResponse.json(subject)
    }

    const subjects = await getAllSubjects()
    return NextResponse.json(subjects)
  } catch (error: any) {
    console.error('Error fetching subjects:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
