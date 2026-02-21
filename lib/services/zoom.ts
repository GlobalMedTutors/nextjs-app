import axios from 'axios'
import { ENV } from '@/lib/config/env'

interface ZoomMeeting {
  join_url: string
  start_url: string
}

export async function createZoomMeeting(
  topic: string,
  startTime: Date,
  endTime: Date,
  instructorEmail: string,
  studentEmail: string
): Promise<ZoomMeeting> {
  const token = await getZoomAccessToken()
  
  const response = await axios.post(
    `https://api.zoom.us/v2/users/${ENV.ZOOM_ACCOUNT_ID}/meetings`,
    {
      topic,
      type: 2, // Scheduled meeting
      start_time: startTime.toISOString(),
      duration: Math.round((endTime.getTime() - startTime.getTime()) / 60000), // Duration in minutes
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        mute_upon_entry: false,
        waiting_room: false,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )

  return {
    join_url: response.data.join_url,
    start_url: response.data.start_url,
  }
}

async function getZoomAccessToken(): Promise<string> {
  const auth = Buffer.from(`${ENV.ZOOM_CLIENT_ID}:${ENV.ZOOM_CLIENT_SECRET}`).toString('base64')
  
  const response = await axios.post(
    'https://zoom.us/oauth/token?grant_type=account_credentials&account_id=' + ENV.ZOOM_ACCOUNT_ID,
    {},
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  )

  return response.data.access_token
}
