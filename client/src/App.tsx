import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Link, Route, Switch, useLocation } from "wouter";
import { Coffee, Menu as MenuIcon, X } from "lucide-react";
import { useState } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";

function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const isMenu = location === "/menu";

  return (
    <header className={`site-header ${isMenu ? "site-header--light" : ""}`}>
      <div className="site-header__inner">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand__mark"><Coffee size={17} strokeWidth={1.8} /></span>
          <span className="brand__name">Bean &amp; Brew</span>
          <span className="brand__type">Cafe</span>
        </Link>

        <nav className={`site-nav ${open ? "site-nav--open" : ""}`} aria-label="Primary navigation">
          <Link href="/" className={!isMenu ? "is-active" : ""} onClick={() => setOpen(false)}>Home</Link>
          <Link href="/menu" className={isMenu ? "is-active" : ""} onClick={() => setOpen(false)}>Our menu</Link>
          <a href="/#visit" onClick={() => setOpen(false)}>Visit us</a>
        </nav>

        <div className="site-header__right">
          <a className="header-phone" href="tel:+15550142765">+1 555 014 2765</a>
          <Link href="/menu" className="header-cta">Order to-go <span>↗</span></Link>
          <button className="menu-toggle" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <Link href="/" className="brand brand--footer">
            <span className="brand__mark"><Coffee size={17} strokeWidth={1.8} /></span>
            <span className="brand__name">Bean &amp; Brew</span>
            <span className="brand__type">Cafe</span>
          </Link>
          <p className="footer-note">Slow mornings, bright afternoons,<br />and something warm in between.</p>
        </div>
        <div className="footer-links">
          <div><span className="footer-label">Explore</span><Link href="/">Home</Link><Link href="/menu">Menu</Link></div>
          <div><span className="footer-label">Find us</span><a href="/#visit">18 Mercer Lane</a><a href="tel:+15550142765">+1 555 014 2765</a></div>
          <div><span className="footer-label">Open daily</span><span>7:00 — 17:00</span><span>Kitchen until 16:00</span></div>
        </div>
      </div>
      <div className="footer-bottom"><span>© 2025 Bean &amp; Brew Cafe</span><span>Made for slow days.</span></div>
    </footer>
  );
}

function Router() {
  const [location] = useLocation();
  const routes = (
      <Switch>
        <Route path="/admin" component={Admin} />
        <Route path="/" component={Home} />
        <Route path="/menu" component={Menu} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
  );
  if (location.startsWith("/admin")) return routes;
  return <><SiteHeader />{routes}<SiteFooter /></>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
