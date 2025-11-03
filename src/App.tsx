import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import AIChatAgent from './components/AIChatAgent';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import GetStartedPage from './pages/GetStartedPage';
import ContactPage from './pages/ContactPage';
import DashboardPage from './pages/DashboardPage';
import AuthPage from './pages/AuthPage';

type Page = 'home' | 'services' | 'how-it-works' | 'contact' | 'get-started' | 'dashboard' | 'auth';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [pageData, setPageData] = useState<unknown>(null);

  const handleNavigate = (page: string, data?: unknown) => {
    setCurrentPage(page as Page);
    setPageData(data || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'services':
        return <ServicesPage onNavigate={handleNavigate} />;
      case 'how-it-works':
        return <HomePage onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage />;
      case 'get-started':
        return <GetStartedPage onNavigate={handleNavigate} selectedPackage={pageData as any} />;
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;
      case 'auth':
        return <AuthPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
          <Header onNavigate={handleNavigate} currentPage={currentPage} />
          <main>{renderPage()}</main>
          <Footer onNavigate={handleNavigate} />
          <WhatsAppButton />
          <AIChatAgent onNavigate={handleNavigate} />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
