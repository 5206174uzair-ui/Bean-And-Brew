import { useMemo, useState } from "react";
import { Coffee, MapPin, MessageCircle, Send } from "lucide-react";
import { Link } from "wouter";

type Message = {
  id: number;
  from: "bot" | "user";
  text: string;
};

const suggestions = ["When is your kitchen open?", "Are you closed on Sundays?", "Where are you located?"];

export function answerQuestion(question: string) {
  const normalized = question.toLowerCase();

  if (normalized.includes("sunday") || normalized.includes("closed") || normalized.includes("open")) {
    return "We are open every day from 7:00 AM to 5:00 PM. Our kitchen serves food until 4:00 PM, including Sundays.";
  }
  if (normalized.includes("kitchen") || normalized.includes("food") || normalized.includes("serve")) {
    return "Our kitchen is open daily from 7:00 AM to 4:00 PM. Try our paneer tikka, butter chicken bowl, biryani, or chole bhature.";
  }
  if (normalized.includes("where") || normalized.includes("located") || normalized.includes("address") || normalized.includes("find")) {
    return "You can find Bean & Brew at 18 Mercer Lane, Brooklyn, NY 11211. We are tucked between the bookshop and the flower stall.";
  }
  if (normalized.includes("menu") || normalized.includes("price") || normalized.includes("cost") || normalized.includes("rupee")) {
    return "Our menu includes drinks, appetizers, main courses, and desserts. Prices start at ₹90 for masala chai, with main dishes from ₹260.";
  }
  if (normalized.includes("vegetarian") || normalized.includes("vegan")) {
    return "We have vegetarian favourites including paneer tikka, paneer makhani, palak paneer, rajma chawal, dal makhani, and chole bhature. Please ask our team about vegan options.";
  }
  if (normalized.includes("order") || normalized.includes("takeaway") || normalized.includes("take away")) {
    return "Absolutely — you can order to-go from our menu. For a special request, call us at +1 555 014 2765 and our team will help.";
  }
  if (normalized.includes("phone") || normalized.includes("call") || normalized.includes("contact")) {
    return "You can reach Bean & Brew at +1 555 014 2765. We would love to hear from you.";
  }

  return "I can help with opening hours, kitchen hours, the menu, vegetarian options, ordering, location, and contact details. What would you like to know?";
}

export function WhatsAppChat() {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, from: "bot", text: "Hi! I’m the Bean & Brew assistant. How can I help you today?" },
  ]);
  const nextId = useMemo(() => messages.length + 1, [messages.length]);

  function sendMessage(text = draft) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((current) => [
      ...current,
      { id: nextId, from: "user", text: trimmed },
      { id: nextId + 1, from: "bot", text: answerQuestion(trimmed) },
    ]);
    setDraft("");
  }

  return (
    <section className="whatsapp-panel whatsapp-panel--page" aria-label="Bean and Brew WhatsApp assistant">
      <header className="whatsapp-panel__header">
        <div className="whatsapp-panel__identity">
          <span className="whatsapp-panel__avatar"><Coffee size={17} /></span>
          <span><strong>Bean &amp; Brew</strong><small>Usually replies instantly</small></span>
        </div>
        <span className="whatsapp-panel__live"><span /> Online</span>
      </header>
      <div className="whatsapp-panel__demo">Demo assistant · Ask anything about the cafe</div>
      <div className="whatsapp-panel__messages" aria-live="polite">
        {messages.map((message) => <div className={`whatsapp-message whatsapp-message--${message.from}`} key={message.id}>{message.text}<time>{message.from === "bot" ? "Bean & Brew" : "You"}</time></div>)}
      </div>
      <div className="whatsapp-panel__suggestions">
        {suggestions.map((suggestion) => <button key={suggestion} onClick={() => sendMessage(suggestion)}>{suggestion}</button>)}
      </div>
      <form className="whatsapp-panel__composer" onSubmit={(event) => { event.preventDefault(); sendMessage(); }}>
        <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask about the cafe..." aria-label="Ask the Bean and Brew assistant" />
        <button type="submit" aria-label="Send message"><Send size={17} /></button>
      </form>
    </section>
  );
}

export default function WhatsAppAssistant() {
  return (
    <div className="whatsapp-assistant">
      <a className="find-us-launcher" href="https://maps.google.com/?q=18+Mercer+Lane+Brooklyn+NY" target="_blank" rel="noreferrer" aria-label="Find Bean and Brew on Google Maps">
        <MapPin size={19} />
        <span>Find us</span>
      </a>
      <Link href="/whatsapp" className="whatsapp-launcher" aria-label="Open Bean and Brew WhatsApp assistant">
        <MessageCircle size={23} />
        <span>Chat with us</span>
      </Link>
    </div>
  );
}
