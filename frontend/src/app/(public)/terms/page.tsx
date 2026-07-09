export default function TermsPage() {
  return (
    <div className="animate-in max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using our services, you agree to be bound by these Terms of Service.</p>
        <h2>2. Services</h2>
        <p>We provide legal consultation and representation services. Nothing on this website constitutes legal advice until a formal attorney-client relationship is established.</p>
        <h2>3. Consultation Booking</h2>
        <p>Booking a consultation does not guarantee legal representation. All bookings are subject to review and confirmation by the lawyer.</p>
        <h2>4. Fees and Payment</h2>
        <p>Fees for legal services will be communicated separately and agreed upon before any work commences. Payment is due as per the agreed terms.</p>
        <h2>5. Confidentiality</h2>
        <p>All information shared during consultations is protected by attorney-client privilege and will be kept strictly confidential.</p>
        <h2>6. Limitation of Liability</h2>
        <p>We are not liable for any indirect, incidental, or consequential damages arising from the use of our services or website.</p>
        <h2>7. Governing Law</h2>
        <p>These terms are governed by the laws of India and subject to the jurisdiction of courts in Mumbai.</p>
      </div>
    </div>
  );
}