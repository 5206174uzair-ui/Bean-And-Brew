import { ArrowLeft, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { WhatsAppChat } from "@/components/WhatsAppAssistant";

export default function WhatsApp() {
  return (
    <main className="whatsapp-page">
      <div className="whatsapp-page__intro">
        <Link href="/" className="whatsapp-page__back"><ArrowLeft size={16} /> Back to Bean &amp; Brew</Link>
        <div className="whatsapp-page__eyebrow"><MessageCircle size={15} /> Bean &amp; Brew chat</div>
        <h1>Ask us<br /><em>anything.</em></h1>
        <p>Our friendly café assistant can help with hours, kitchen timings, the menu, vegetarian options, ordering, and directions.</p>
        <span className="whatsapp-page__note">Demo interface · No Meta or WhatsApp credentials required</span>
      </div>
      <WhatsAppChat />
    </main>
  );
}
