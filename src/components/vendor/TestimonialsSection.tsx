'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Rajesh Kumar',
    shopName: 'ABC Camera Rentals',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    quote: 'This software transformed how we manage our inventory. We used to spend hours tracking products manually, but now everything is automated. Our order processing time has reduced by 60%, and customer satisfaction has improved significantly.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80',
  },
  {
    name: 'Priya Sharma',
    shopName: 'Delhi Equipment Rentals',
    location: 'New Delhi',
    rating: 5,
    quote: 'The customer database feature is a game-changer. We can now track rental history, preferences, and build better relationships with our customers. The analytics dashboard helps us make informed decisions about which products to stock.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80',
  },
  {
    name: 'Amit Patel',
    shopName: 'TechGear Rentals',
    location: 'Bangalore, Karnataka',
    rating: 5,
    quote: 'Managing multiple staff members and branches was a nightmare before. Now, with RentOrent, we can assign roles, track permissions, and ensure everyone has the right access. The mobile-responsive design means I can manage my business from anywhere.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80',
  },
  {
    name: 'Sneha Reddy',
    shopName: 'Hyderabad Rentals Hub',
    location: 'Hyderabad, Telangana',
    rating: 5,
    quote: 'The best part is the pricing. At just ₹35 per day for the yearly plan, it\'s incredibly affordable. The ROI was immediate - we recovered the cost within the first month through improved efficiency. Highly recommend to any rental business!',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0F0F0F]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            What Our Vendors Say
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what rental shop owners are saying about RentOrent.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Based on real vendor feedback
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-8 hover:border-[#DC2626]/50 transition-all duration-300 gpu-accelerated"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-[#F59E0B] text-[#F59E0B]"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                />
                <div>
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-sm text-gray-400">{testimonial.shopName}</p>
                  <p className="text-xs text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

