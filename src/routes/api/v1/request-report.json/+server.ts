import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error, redirect, type RequestHandler } from '@sveltejs/kit';
import { stripIndent, oneLine } from 'common-tags';
import type { CreateCompletionRequest } from 'openai';
import { SECRET_OPENAI_KEY } from '$env/static/private'

export const GET: RequestHandler = async (event) => {
  throw redirect(302, '/')
  return new Response()
}

export const POST: RequestHandler = async (event) => {
  const { request } = event;
  const { session, supabaseClient } = await getSupabase(event);

  if (!session) {
    throw redirect(303, '/')
  }

  try {
    if (!SECRET_OPENAI_KEY) {
      throw new Error('OPENAI_KEY env var not set')
    }

    const requestData = await request.json()

    if (!requestData) {
      throw new Error('Request data missing')
    }

    const { details } = requestData

    if (!details) {
      throw new Error('No details provided')
    }

    const prompt = stripIndent`
    ${oneLine`
    You are an excellent naval officer writing your periodic fitrep. The core attributes of a naval officer are 
    initiative, accountability, integrity and toughness. The core values are honor, courage, and commitment. 
    You will be told your rank, name, and several key facts to include. Fitreps have extremely strict guidelines 
    on length. There are 91 characters per line and 18 lines. Fitreps need to use all 18 lines. Blank lines can 
    be used to fill space but never more than one blank line in a row. Good fitreps will have a 1 line headline 
    comment that says the officer is excellent in various ways is in all-caps with three asterisks "*" 
    surrounding the text, like ***This Headline***, it will then have three bullet point paragraphs with a 
    two-word summary of the paragraph as the lead in, such as "METICULOUS PLANNER", finally there is a 1 line 
    bottom headline that says the officer should be promoted or selected for their next milestone. Good bullet 
    point paragraphs have specific details with embellished language. Officers want to use very positive and 
    flowery language when describing their actions, even if those actions are mundane or routine. When there 
    are not enough details, fill the necessary space, 91 characters per line, 18 lines total, with positive 
    descriptions of a naval officer.

    This is an example:
    Details:
    Name and Rank: {{name}}
    Unit: HSMWSP
    Detail 1: instructed 3 events during HARP 1903 and led two events as Range Training Officer
    Detail 2: was the mission planning subject matter expert (SME).
    Detail 3: Led operations planning meetings for nine squadrons for 250 flight hours and 95 simulator hours.
    Detail 4: Updated operations currency tracker for the SHARP 7.0 update. This task took around 20 hours of extra work.
    Detail 5: flew 15 hours of FCF for HSM-77.`}

    Output:
    ***A RISING STAR IN HSM WING PACIFIC'S MOST COMPETITIVE WARDROOM!***

    - EXPERT INSTRUCTOR. {{name}} continues to display great enthusiasm for student interaction and engagement. He expertly instructed three flight events during HARP 1903 and effortlessly led two events as Range Training Officer. As mission planning SME, he put in countless additional hours assisting crews with mission planning and flight briefs.

    - METICULOUS PLANNER. Led weekly operational planning meetings with HSM Wing representatives to coordinate flight support requirements across nine squadrons, resulting in the execution of 250 mishap-free flight hours and 95 simulator hours for HSMWSP cadre. 

    - DILIGENT PROFESSIONAL. During SHARP 7.0 updates HSMWSP operations did not have the necessary information for safely creating a flight schedule. LT Buck volunteered to fix this issue and spent over 20 hours, in addition to his schedule writing duties to identify the affected reports and formulate and implement solutions. Always ready to help, LT Buck spent over 15 hours assisting HSM-77 with FCF procedures. 

    ***PROMOTE NOW TO {{next-rank}} AND SELECT FOR AVIATION DEPARTMENT HEAD!***

    Request: """${details.trim()}"""
    Output:`

    const completionOpts: CreateCompletionRequest = {
      model: 'gpt-3.5-turbo',
      prompt,
      max_tokens: 1000,
      temperature: 0.75,
      stream: true
    }

    const response = await fetch('https://api.openai.com/v1/completions', {
      headers: {
        Authorization: `Bearer ${SECRET_OPENAI_KEY} `,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(completionOpts)
    })

    if (!response.ok) {
      const err = await response.json()
      console.error(err)
      throw new Error('Failed to create completion')
    }

    return new Response(response.body, {
      headers: {
        'Content-type': 'text/event-stream'
      }
    })
  } catch (err) {
    console.error(err)
    throw error(500, 'An error occured')
  }
};