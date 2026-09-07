import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.pageWrapper}>
      
      {/* Navigation Bar */}
      <nav className={styles.navbar}>
        <Link href="/" className={styles.navLogo}>
          <div className={styles.navLogoIcon}>⭐</div>
          <span>RatingApp</span>
        </Link>
        <div className={styles.navLinks}>
          <Link href="#features" className={styles.navLink}>Features</Link>
          <Link href="#roles" className={styles.navLink}>Roles</Link>
          <Link href="/login" className={styles.navLink}>Sign In</Link>
        </div>
        <div className={styles.navActions}>
          <Link href="/dashboard" className={styles.getStartedBtn}>Launch App ✨</Link>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className={styles.hero} style={{ minHeight: '85vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '8rem 5% 4rem' }}>
          <div className={styles.heroContent} style={{ alignItems: 'center', maxWidth: '850px' }}>
            <div className={styles.badge}>
              <span className={styles.badgeHighlight}>RatingApp 2.0</span>
              <span>Next-Gen Store Rating & Review Platform</span>
            </div>

            <h1 className={styles.title} style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)' }}>
              <span className={styles.titleGradient}>Discover & Rate Stores</span>
              <br />
              <span className={styles.titleAccent}>With Transparency</span>
            </h1>

            <p className={styles.tagline} style={{ margin: '0 auto 2.5rem' }}>
              The ultimate store rating ecosystem. Empowering customers to rate stores with 1–5 stars, store owners to monitor performance, and admins to govern platform users seamlessly.
            </p>

            <div className={styles.heroActions} style={{ justifyContent: 'center' }}>
              <Link href="/dashboard" className={styles.btnPrimary}>
                Explore Stores Now ⭐
              </Link>
              <Link href="/register" className={styles.btnSecondary}>
                Create Account
              </Link>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className={styles.featuresSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Built for Customers, Owners & Admins</h2>
            <p className={styles.tagline} style={{ margin: '0 auto' }}>
              A high-performance rating suite designed with role-based governance.
            </p>
          </div>

          <div className={styles.bentoGrid}>
            <div className={`${styles.bentoCard} ${styles.bentoLarge}`}>
              <div className={styles.featureIconWrapper}>⭐</div>
              <h3 className={styles.featureTitle}>1-to-5 Star Interactive Ratings</h3>
              <p className={styles.featureDesc}>
                Customers can instantly submit star ratings for registered stores, modify their ratings anytime, and view real-time overall averages.
              </p>
            </div>

            <div className={styles.bentoCard}>
              <div className={styles.featureIconWrapper}>👑</div>
              <h3 className={styles.featureTitle}>Admin Governance</h3>
              <p className={styles.featureDesc}>
                Complete control over platform users and store profiles with instant user creation, role assignment, sorting, and row deletion.
              </p>
            </div>

            <div className={styles.bentoCard}>
              <div className={styles.featureIconWrapper}>🏪</div>
              <h3 className={styles.featureTitle}>Store Owner Dashboard</h3>
              <p className={styles.featureDesc}>
                Store owners can view their store ratings, analyze average customer satisfaction, and inspect customer raters.
              </p>
            </div>

            <div className={`${styles.bentoCard} ${styles.bentoLarge}`}>
              <div className={styles.featureIconWrapper}>🔒</div>
              <h3 className={styles.featureTitle}>Security & Access Control</h3>
              <p className={styles.featureDesc}>
                Powered by NextAuth credentials, Prisma ORM, real-time password strength validation, and secure password management.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <div className={styles.navLogoIcon} style={{ width: '28px', height: '28px', fontSize: '0.9rem' }}>⭐</div>
            <span>RatingApp</span>
          </div>
          <div className={styles.footerLinks}>
            <Link href="/dashboard" className={styles.footerLink}>Dashboard</Link>
            <Link href="/login" className={styles.footerLink}>Sign In</Link>
            <Link href="/register" className={styles.footerLink}>Register</Link>
          </div>
        </div>
        <div className={styles.copyright}>
          &copy; {new Date().getFullYear()} RatingApp. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
