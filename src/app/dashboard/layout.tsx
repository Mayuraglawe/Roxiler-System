import Sidebar from './components/Sidebar';
import Header from './components/Header';
import styles from './dashboard.module.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.dashboardTheme}>
      <div className={styles.dashboardLayout}>
        <Sidebar />
        <div className={styles.dashboardBody}>
          <Header />
          <main className={styles.mainContent}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}


