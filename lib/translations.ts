export const translations = {
  en: {
    nav: {
      home: 'Home',
      pricing: 'Pricing',
      location: 'Location',
      contact: 'Contact',
      booking: 'Book Now',
      checkout: 'Payment',
    },
    footer: {
      companyName: 'Emerald Spotless Cleaning',
      coverage: 'Kildare and Leinster service coverage.',
      callUs: 'Call us:',
    },
    common: {
      comingSoon: 'Coming Soon',
      language: 'Language',
    },
    booking: {
      title: 'Book Your Appointment',
      subtitle: 'Schedule Your Cleaning',
      description:
        "Check our availability calendar and select your preferred date and time. Our team will confirm your booking and you can pay securely online.",
      selectService: 'Select Service',
      availabilityCalendar: 'Availability Calendar',
      selectTimeSlot: 'Select Time Slot',
      bookingSummary: 'Booking Summary',
      date: 'Date',
      time: 'Time',
      service: 'Service',
      proceedToCheckout: 'Proceed to Checkout',
      selectADate: 'Select a date to see available times',
      noAvailableSlots: 'No available slots for this date. Please select another date.',
      available: 'Available',
      booked: 'Booked',
      previous: '← Previous',
      next: 'Next →',
    },
    checkout: {
      title: 'Book & Pay Online',
      subtitle: 'Secure Payment',
      description:
        'Complete your booking and pay securely with Stripe. Choose your service, date, and complete payment in just a few steps.',
      bookingDetails: 'Booking Details',
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      serviceType: 'Service Type',
      preferredDate: 'Preferred Date',
      hoursRequired: 'Hours Required',
      specialRequests: 'Special Requests',
      hourlyRate: 'Hourly Rate',
      hours: 'Hours',
      totalCost: 'Total Cost',
      proceedToPayment: 'Proceed to Payment',
      processing: 'Processing...',
      securePaymentInfo:
        'All payments are processed securely through Stripe. Your payment information is never stored on our servers. A confirmation email with booking details will be sent immediately after payment.',
      viewAllPricing: 'View all pricing',
    },
  },
  ga: {
    nav: {
      home: 'Baile',
      pricing: 'Praghsanna',
      location: 'Suíomh',
      contact: 'Teagmháil',
      booking: 'Cuir in Eagar Anois',
      checkout: 'Íoc',
    },
    footer: {
      companyName: 'Foluain Spotless a Ghlantóireachta',
      coverage: 'Seirbhís a fhálaithe cheantar Chhill Dara agus Laighean.',
      callUs: 'Glaoch orainn:',
    },
    common: {
      comingSoon: 'Ag Teacht Go Luath',
      language: 'Teanga',
    },
    booking: {
      title: 'Cuir do Chuairteoir in Eagar',
      subtitle: 'Iarraigh do Ghlanadh',
      description:
        'Amhairc ar ár féilire infhostaithe agus roghnaigh do dháta agus am níos fearr. Deimhneoidh an fhoireann agus is féidir leat íoc ar shlándáil ar líne.',
      selectService: 'Roghnaigh Seirbhís',
      availabilityCalendar: 'Féilire Infhostaithe',
      selectTimeSlot: 'Roghnaigh Tráth Ama',
      bookingSummary: 'Achoimre an Chuairtithe',
      date: 'Dáta',
      time: 'Am',
      service: 'Seirbhís',
      proceedToCheckout: 'Lean ar aghaidh chuig an Íoc',
      selectADate: 'Roghnaigh dáta chun a fhiceáil na hamanna infhostaithe',
      noAvailableSlots: 'Níl aon spásanna infhostaithe don dáta seo. Roghnaigh dáta eile le do thoil.',
      available: 'Infhostaithe',
      booked: 'Cuirtha in Eagar',
      previous: '← Roimhe Seo',
      next: 'Ar Aghaidh →',
    },
    checkout: {
      title: 'Cuir in Eagar & Íoc Go Fíorúil',
      subtitle: 'Íoc Slán',
      description:
        'Críochnaigh do chuairteoir agus íoc go slán trí Stripe. Roghnaigh do sheirbhís, dáta, agus críochnaigh íoc i gceithre chéim.',
      bookingDetails: 'Sonraí an Chuairtithe',
      fullName: 'Ainm Iomlán',
      email: 'Ríomhphost',
      phone: 'Fón',
      address: 'Seoladh',
      serviceType: 'Cineál Seirbhíse',
      preferredDate: 'An Dáta is Fearr leat',
      hoursRequired: 'Uaireanta Infheastaithe',
      specialRequests: 'Iarratais Speisialta',
      hourlyRate: 'Ráta in aghaidh an Uair',
      hours: 'Uaireanta',
      totalCost: 'Costas Iomlán',
      proceedToPayment: 'Lean ar aghaidh chuig an Íoc',
      processing: 'Ag Próiseáil...',
      securePaymentInfo:
        'Próiseáiltear gach íoc go slán trí Stripe. Ní dhéantar d\'fhaisnéis íoc a stóráil ar ár bhfreastalaí. Seolfar ríomhphost deimhnithe le gach sonraí cuairtithe gan dáil.',
      viewAllPricing: 'Féach ar gach praghsanna',
    },
  },
};

export type Language = 'en' | 'ga';

export function getTranslation(lang: Language, path: string): string {
  const keys = path.split('.');
  let value: any = translations[lang];

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return path; // Fallback to the path if translation not found
    }
  }

  return typeof value === 'string' ? value : path;
}
