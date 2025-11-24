import { NextRequest, NextResponse } from 'next/server';
import { sendContactNotification, sendPaymentNotification, ContactEmailData, PaymentEmailData } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    console.log('📧 Email API route called');
    const body = await request.json();
    const { type, data } = body;

    console.log('Email request:', { type, hasData: !!data });

    if (!type || !data) {
      console.error('❌ Missing type or data');
      return NextResponse.json(
        { error: 'Type and data are required' },
        { status: 400 }
      );
    }

    switch (type) {
      case 'contact':
        console.log('📧 Sending contact notification email...');
        await sendContactNotification(data as ContactEmailData);
        console.log('✅ Contact email sent successfully');
        break;
      case 'payment':
        console.log('📧 Sending payment notification email...');
        await sendPaymentNotification(data as PaymentEmailData);
        console.log('✅ Payment email sent successfully');
        break;
      default:
        console.error('❌ Invalid email type:', type);
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('❌ Error in email API route:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}

