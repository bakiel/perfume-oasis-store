import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Try to sign in with test credentials
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@perfumeoasis.co.za',
      password: 'test123456'
    })
    
    if (error) {
      // If sign in fails, try to create the account
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: 'test@perfumeoasis.co.za',
        password: 'test123456',
        options: {
          data: {
            first_name: 'Test',
            last_name: 'User'
          }
        }
      })
      
      if (signUpError) {
        return NextResponse.json({ 
          error: 'Failed to create test account',
          details: signUpError.message 
        }, { status: 400 })
      }
      
      return NextResponse.json({ 
        success: true,
        message: 'Test account created. Please sign in.',
        email: 'test@perfumeoasis.co.za',
        password: 'test123456'
      })
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Signed in successfully',
      user: data.user
    })
    
  } catch (error) {
    console.error('Test auth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}