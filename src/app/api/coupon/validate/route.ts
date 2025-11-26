import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Coupon codes configuration
const COUPONS: Record<string, { discount: number; type: 'fixed' | 'percentage'; description: string }> = {
  '9526846201': {
    discount: 1, // Special coupon: ₹1 for any subscription
    type: 'fixed',
    description: 'Special offer: Pay only ₹1',
  },
  // Add more coupons here as needed
  // 'WELCOME10': {
  //   discount: 10,
  //   type: 'percentage',
  //   description: '10% off on your subscription',
  // },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { couponCode, planAmount } = body;

    if (!couponCode) {
      return NextResponse.json(
        { error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    const coupon = COUPONS[couponCode.toUpperCase().trim()];

    if (!coupon) {
      return NextResponse.json(
        { error: 'Invalid coupon code' },
        { status: 404 }
      );
    }

    // Calculate discount
    let discountAmount = 0;
    let finalAmount = planAmount;

    if (coupon.type === 'fixed') {
      // Special case: 9526846201 makes any subscription ₹1
      if (couponCode === '9526846201') {
        discountAmount = planAmount - 1; // Discount = original amount - 1
        finalAmount = 1;
      } else {
        discountAmount = Math.min(coupon.discount, planAmount);
        finalAmount = Math.max(0, planAmount - discountAmount);
      }
    } else if (coupon.type === 'percentage') {
      discountAmount = Math.round((planAmount * coupon.discount) / 100);
      finalAmount = Math.max(0, planAmount - discountAmount);
    }

    // Calculate GST on final amount (18%)
    const GST_RATE = 0.18;
    const gstAmount = Math.round(finalAmount * GST_RATE);
    const totalAmount = finalAmount + gstAmount;

    return NextResponse.json({
      valid: true,
      coupon: {
        code: couponCode.toUpperCase(),
        description: coupon.description,
        discount: discountAmount,
        discountType: coupon.type,
      },
      amounts: {
        original: planAmount,
        discount: discountAmount,
        subtotal: finalAmount,
        gst: gstAmount,
        total: totalAmount,
      },
    });
  } catch (error: any) {
    console.error('Error validating coupon:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}

