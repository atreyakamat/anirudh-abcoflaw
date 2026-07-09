export default function PrivacyPage() {
  return (
    <div className="animate-in max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly, including name, email, phone number, and details about your legal matter when you book a consultation or create an account.</p>
        <h2>2. How We Use Your Information</h2>
        <p>We use your information to provide legal services, schedule appointments, communicate with you, and improve our services.</p>
        <h2>3. Information Security</h2>
        <p>We implement appropriate security measures to protect your personal information. All data is transmitted over encrypted connections and stored securely.</p>
        <h2>4. Confidentiality</h2>
        <p>As a legal practice, we are bound by attorney-client privilege. All communications and information shared during consultations are strictly confidential.</p>
        <h2>5. Data Retention</h2>
        <p>We retain your information for as long as necessary to provide our services and comply with legal obligations.</p>
        <h2>6. Third-Party Services</h2>
        <p>We do not sell or share your personal information with third parties, except as necessary to provide our services or as required by law.</p>
        <h2>7. Your Rights</h2>
        <p>You have the right to access, correct, or delete your personal information. Contact us to exercise these rights.</p>
        <h2>8. Contact</h2>
        <p>For privacy-related inquiries, please contact us at contact@lawpractice.com.</p>
      </div>
    </div>
  );
}